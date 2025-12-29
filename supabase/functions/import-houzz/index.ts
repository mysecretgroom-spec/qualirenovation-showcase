import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const HOUZZ_PROFILE_URL = "https://www.houzz.fr/pro/qualirenovation";
const HOUZZ_PROJECTS_URL = "https://www.houzz.fr/pro/qualirenovation/projets";

interface HouzzProject {
  url: string;
  title: string;
  description?: string;
  category?: string;
  images: { url: string; caption?: string }[];
  location?: string;
  year?: string;
}

// Generate URL-friendly slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100);
}

// Scrape a page with Firecrawl
async function scrapeWithFirecrawl(url: string, apiKey: string): Promise<any> {
  console.log('[Firecrawl] Scraping:', url);
  
  const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url,
      formats: ['markdown', 'html', 'links'],
      onlyMainContent: false,
      waitFor: 5000,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('[Firecrawl] Error:', error);
    throw new Error(`Firecrawl scrape failed: ${response.status}`);
  }

  const data = await response.json();
  return data.data || data;
}

// Extract project URLs from the profile page
function extractProjectUrls(html: string, links: string[]): string[] {
  const projectUrls: string[] = [];
  
  // From links array
  for (const link of links) {
    if (link.includes('/projets/') && link.includes('houzz.fr')) {
      projectUrls.push(link);
    }
  }
  
  // From HTML with regex patterns
  const patterns = [
    /href="(https:\/\/www\.houzz\.fr\/pro\/qualirenovation\/projets\/[^"]+)"/g,
    /href="(\/pro\/qualirenovation\/projets\/[^"]+)"/g,
    /"url":"(https:\/\/www\.houzz\.fr\/[^"]*projets[^"]*)"/g,
  ];
  
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(html)) !== null) {
      let url = match[1];
      if (url.startsWith('/')) {
        url = `https://www.houzz.fr${url}`;
      }
      if (!projectUrls.includes(url)) {
        projectUrls.push(url);
      }
    }
  }
  
  console.log('[Extract] Found', projectUrls.length, 'project URLs');
  return projectUrls;
}

// Extract images from a project page HTML
function extractImagesFromHtml(html: string): { url: string; caption?: string }[] {
  const images: { url: string; caption?: string }[] = [];
  const seenUrls = new Set<string>();
  
  // Multiple patterns to find Houzz image URLs
  const patterns = [
    /"imageUrl":"([^"]+)"/g,
    /data-src="(https:\/\/[^"]*houzz[^"]*\.(jpg|jpeg|png|webp)[^"]*)"/gi,
    /src="(https:\/\/[^"]*st\.hzcdn\.com[^"]*\.(jpg|jpeg|png|webp)[^"]*)"/gi,
    /"fullUrl":"([^"]+)"/g,
    /srcset="([^"\s]+)/g,
  ];
  
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(html)) !== null) {
      let url = match[1];
      
      // Clean and validate URL
      url = url.replace(/\\u002F/g, '/').replace(/\\/g, '');
      
      if (!url.startsWith('http')) continue;
      if (seenUrls.has(url)) continue;
      if (url.includes('avatar') || url.includes('profile') || url.includes('logo')) continue;
      if (url.includes('.svg') || url.includes('.gif')) continue;
      
      // Convert to high resolution
      url = url.replace(/\/v\d+-\d+x\d+-[a-z]+\//, '/v1-1920x1080-ls/');
      url = url.replace(/-\d+x\d+-/, '-1920x1080-');
      
      seenUrls.add(url);
      images.push({ url });
    }
  }
  
  console.log('[Extract] Found', images.length, 'images');
  return images.slice(0, 20); // Max 20 images per project
}

// Extract project details from scraped page
function extractProjectDetails(data: any, url: string): HouzzProject {
  const html = data.html || '';
  const markdown = data.markdown || '';
  const metadata = data.metadata || {};
  
  // Title
  let title = metadata.title || '';
  title = title.replace(/ \| Houzz.*$/i, '').trim();
  if (!title) {
    const titleMatch = markdown.match(/^#\s+(.+)$/m);
    title = titleMatch ? titleMatch[1] : 'Projet sans titre';
  }
  
  // Description - extract from markdown
  let description = metadata.description || '';
  const descMatch = markdown.match(/##.*Description.*\n+([\s\S]*?)(?=\n##|\n\n\n|$)/i);
  if (descMatch) {
    description = descMatch[1].trim().substring(0, 1000);
  }
  
  // Category
  let category = 'Rénovation';
  const categoryPatterns = [
    /salle\s*de\s*bain/i,
    /cuisine/i,
    /salon/i,
    /chambre/i,
    /appartement/i,
    /maison/i,
    /bureau/i,
    /terrasse/i,
  ];
  for (const pattern of categoryPatterns) {
    if (pattern.test(title) || pattern.test(description)) {
      category = title.match(pattern)?.[0] || category;
      break;
    }
  }
  
  // Location
  let location = '';
  const locationMatch = markdown.match(/Paris|Lyon|Marseille|Bordeaux|Nantes|France/i);
  if (locationMatch) {
    location = locationMatch[0];
  }
  
  // Images
  const images = extractImagesFromHtml(html);
  
  return {
    url,
    title,
    description,
    category,
    images,
    location,
  };
}

// Save projects to database
async function saveProjectsToDatabase(supabase: any, projects: HouzzProject[]): Promise<{ imported: number; errors: number }> {
  let imported = 0;
  let errors = 0;

  for (const project of projects) {
    try {
      const slug = generateSlug(project.title);
      
      // Check if project already exists
      const { data: existing } = await supabase
        .from('houzz_projects')
        .select('id')
        .eq('slug', slug)
        .single();

      let projectId: string;

      if (existing) {
        // Update existing project
        const { error: updateError } = await supabase
          .from('houzz_projects')
          .update({
            title: project.title,
            description: project.description,
            category: project.category,
            location: project.location,
            year: project.year,
            houzz_url: project.url,
            image_count: project.images?.length || 0,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id);

        if (updateError) throw updateError;
        projectId = existing.id;
        
        // Delete existing images
        await supabase
          .from('houzz_project_images')
          .delete()
          .eq('project_id', projectId);
      } else {
        // Insert new project
        const { data: newProject, error: insertError } = await supabase
          .from('houzz_projects')
          .insert({
            title: project.title,
            slug,
            description: project.description,
            category: project.category,
            location: project.location,
            year: project.year,
            houzz_url: project.url,
            image_count: project.images?.length || 0,
          })
          .select('id')
          .single();

        if (insertError) throw insertError;
        projectId = newProject.id;
      }

      // Insert images
      if (project.images && project.images.length > 0) {
        const imageRecords = project.images
          .filter(img => img.url && img.url.length > 0)
          .map((img, index) => ({
            project_id: projectId,
            image_url: img.url,
            caption: img.caption || null,
            image_order: index,
          }));

        if (imageRecords.length > 0) {
          const { error: imageError } = await supabase
            .from('houzz_project_images')
            .insert(imageRecords);

          if (imageError) {
            console.error('[DB] Image insert error:', imageError);
          }
        }
      }

      imported++;
      console.log('[DB] Saved project:', project.title, `(${project.images?.length || 0} images)`);
    } catch (error) {
      console.error('[DB] Error saving project:', project.title, error);
      errors++;
    }
  }

  return { imported, errors };
}

// Main handler
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const FIRECRAWL_API_KEY = Deno.env.get('FIRECRAWL_API_KEY');
    if (!FIRECRAWL_API_KEY) {
      throw new Error('FIRECRAWL_API_KEY not configured');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { action, limit = 10 } = await req.json();
    console.log('[Handler] Action:', action, 'Limit:', limit);

    switch (action) {
      case 'import-latest': {
        // Step 1: Scrape the projects page to get URLs
        console.log('[Handler] Step 1: Discovering project URLs...');
        const profileData = await scrapeWithFirecrawl(HOUZZ_PROJECTS_URL, FIRECRAWL_API_KEY);
        
        const projectUrls = extractProjectUrls(
          profileData.html || '', 
          profileData.links || []
        );
        
        if (projectUrls.length === 0) {
          return new Response(
            JSON.stringify({
              success: false,
              error: 'Aucun projet trouvé sur la page Houzz',
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        // Take only the first N projects
        const urlsToImport = projectUrls.slice(0, limit);
        console.log('[Handler] Will import', urlsToImport.length, 'projects');
        
        // Step 2: Scrape each project page
        const projects: HouzzProject[] = [];
        for (const url of urlsToImport) {
          try {
            console.log('[Handler] Scraping project:', url);
            const projectData = await scrapeWithFirecrawl(url, FIRECRAWL_API_KEY);
            const project = extractProjectDetails(projectData, url);
            projects.push(project);
            
            // Small delay between requests
            await new Promise(resolve => setTimeout(resolve, 500));
          } catch (error) {
            console.error('[Handler] Error scraping project:', url, error);
          }
        }
        
        // Step 3: Save to database
        console.log('[Handler] Saving', projects.length, 'projects to database...');
        const result = await saveProjectsToDatabase(supabase, projects);

        return new Response(
          JSON.stringify({
            success: true,
            discovered: projectUrls.length,
            imported: result.imported,
            errors: result.errors,
            houzzProfileUrl: HOUZZ_PROFILE_URL,
            message: `${result.imported} projets importés sur ${urlsToImport.length}`,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'queue-status': {
        // Return current database stats
        const { count: projectCount } = await supabase
          .from('houzz_projects')
          .select('*', { count: 'exact', head: true });

        const { count: imageCount } = await supabase
          .from('houzz_project_images')
          .select('*', { count: 'exact', head: true });

        return new Response(
          JSON.stringify({
            projects: projectCount || 0,
            images: imageCount || 0,
            houzzProfileUrl: HOUZZ_PROFILE_URL,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ 
            error: 'Action inconnue. Disponibles: import-latest, queue-status' 
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('[Handler] Error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
