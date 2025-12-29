import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const HOUZZ_PROFILE_URL = "https://www.houzz.fr/pro/qualirenovation";
const HOUZZ_REVIEWS_URL = "https://www.houzz.fr/professionnels/artisan-et-entreprise-generale-de-batiment/qualirenovation-by-qualiconcept-pfvwfr-pf~1259357618/avis";

interface HouzzProject {
  url: string;
  title: string;
  description?: string;
  category?: string;
  images: { url: string; caption?: string }[];
  location?: string;
  year?: string;
}

interface HouzzTestimonial {
  name: string;
  role?: string;
  rating: number;
  text: string;
  date?: string;
  project_type?: string;
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

// Extract testimonials from HTML
function extractTestimonialsFromHtml(html: string, markdown: string): HouzzTestimonial[] {
  const testimonials: HouzzTestimonial[] = [];
  
  console.log('[Extract] Parsing testimonials from HTML...');
  
  // Pattern 1: Look for review blocks in HTML
  // Houzz reviews typically have reviewer name, rating, date, and review text
  
  // Try to find JSON-LD structured data first
  const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi);
  if (jsonLdMatch) {
    for (const match of jsonLdMatch) {
      try {
        const jsonContent = match.replace(/<script[^>]*>/, '').replace(/<\/script>/, '');
        const data = JSON.parse(jsonContent);
        if (data.review && Array.isArray(data.review)) {
          for (const review of data.review) {
            testimonials.push({
              name: review.author?.name || 'Client',
              rating: parseInt(review.reviewRating?.ratingValue) || 5,
              text: review.reviewBody || review.description || '',
              date: review.datePublished,
            });
          }
        }
      } catch (e) {
        // Continue with other patterns
      }
    }
  }
  
  // Pattern 2: Parse from markdown format
  // Reviews on Houzz often appear in a structured format
  const reviewBlocks = markdown.split(/(?=\*\*\d+ étoiles?\*\*|\*\*5\.0\*\*|\*\*★)/);
  
  for (const block of reviewBlocks) {
    if (block.length < 50) continue;
    
    // Try to extract rating
    const ratingMatch = block.match(/(\d+(?:\.\d+)?)\s*(?:étoiles?|\/5|★)/i);
    const rating = ratingMatch ? Math.round(parseFloat(ratingMatch[1])) : 5;
    
    // Try to extract name - often at the start or after "par" or "by"
    const nameMatch = block.match(/(?:par|by|—|–)\s*\*?\*?([A-ZÀ-ÿ][a-zà-ÿ]+(?:\s+[A-ZÀ-ÿ]\.?)?)/i) ||
                      block.match(/^\s*\*?\*?([A-ZÀ-ÿ][a-zà-ÿ]+(?:\s+[A-ZÀ-ÿ]\.?)?)\s*\*?\*?/m);
    const name = nameMatch ? nameMatch[1].trim() : null;
    
    // Try to extract date
    const dateMatch = block.match(/(\d{1,2})\s*(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s*(\d{4})/i) ||
                      block.match(/(\d{4}-\d{2}-\d{2})/);
    const date = dateMatch ? dateMatch[0] : null;
    
    // Try to extract project type
    const projectTypeMatch = block.match(/(?:projet|type|catégorie)\s*:?\s*([^,\n]+)/i) ||
                             block.match(/(salle de bain|cuisine|rénovation complète|appartement|maison)/i);
    const projectType = projectTypeMatch ? projectTypeMatch[1].trim() : null;
    
    // Extract the main review text - remove metadata
    let text = block
      .replace(/\*\*/g, '')
      .replace(/\d+(?:\.\d+)?\s*(?:étoiles?|\/5|★)/gi, '')
      .replace(/(?:par|by)\s+[A-ZÀ-ÿ][a-zà-ÿ]+(?:\s+[A-ZÀ-ÿ]\.?)?/gi, '')
      .replace(/\d{1,2}\s*(?:janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s*\d{4}/gi, '')
      .replace(/\[.*?\]\(.*?\)/g, '')
      .replace(/#{1,6}\s*/g, '')
      .trim();
    
    // Clean up and validate
    if (text.length > 30 && name) {
      testimonials.push({
        name,
        rating: rating > 5 ? 5 : rating,
        text: text.substring(0, 2000),
        date: date || undefined,
        project_type: projectType || undefined,
      });
    }
  }
  
  // Pattern 3: Look for specific Houzz review patterns in HTML
  const reviewPatterns = [
    /"reviewerName":\s*"([^"]+)"[\s\S]*?"rating":\s*(\d+)[\s\S]*?"text":\s*"([^"]+)"/g,
    /data-review-author="([^"]+)"[\s\S]*?data-rating="(\d+)"[\s\S]*?<p[^>]*>([^<]+)/g,
  ];
  
  for (const pattern of reviewPatterns) {
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(html)) !== null) {
      const exists = testimonials.some(t => t.name === match![1] || t.text.includes(match![3].substring(0, 50)));
      if (!exists && match[3].length > 30) {
        testimonials.push({
          name: match[1],
          rating: parseInt(match[2]) || 5,
          text: match[3].substring(0, 2000),
        });
      }
    }
  }
  
  console.log('[Extract] Found', testimonials.length, 'testimonials');
  return testimonials;
}

// Save testimonials to database
async function saveTestimonialsToDatabase(supabase: any, testimonials: HouzzTestimonial[]): Promise<{ imported: number; errors: number }> {
  let imported = 0;
  let errors = 0;

  for (const testimonial of testimonials) {
    try {
      // Check if testimonial already exists (by name and first 100 chars of text)
      const textPrefix = testimonial.text.substring(0, 100);
      const { data: existing } = await supabase
        .from('houzz_testimonials')
        .select('id')
        .eq('name', testimonial.name)
        .ilike('text', `${textPrefix}%`)
        .maybeSingle();

      if (existing) {
        console.log('[DB] Testimonial already exists:', testimonial.name);
        continue;
      }

      const { error: insertError } = await supabase
        .from('houzz_testimonials')
        .insert({
          name: testimonial.name,
          role: testimonial.role,
          rating: testimonial.rating,
          text: testimonial.text,
          date: testimonial.date,
          project_type: testimonial.project_type,
          hidden: false,
        });

      if (insertError) throw insertError;
      imported++;
      console.log('[DB] Saved testimonial from:', testimonial.name);
    } catch (error) {
      console.error('[DB] Error saving testimonial:', testimonial.name, error);
      errors++;
    }
  }

  return { imported, errors };
}

// Convert Houzz image URL to high resolution
function toHighResolution(url: string): string {
  let highRes = url;
  highRes = highRes.replace(/-w\d+-h\d+-[^.]+/, '-w1920-h1440-b1-p0--');
  highRes = highRes.replace('/simgs/', '/fimgs/');
  highRes = highRes.replace(/\/pictures\/[^/]+\//, '/fimgs/');
  return highRes;
}

function extractImagesFromHtml(html: string): { url: string; caption?: string }[] {
  const images: { url: string; caption?: string }[] = [];
  const seenBaseIds = new Set<string>();
  
  const patterns = [
    /"imageUrl":"([^"]+)"/g,
    /"fullUrl":"([^"]+)"/g,
    /"url":"(https:\/\/st\.hzcdn\.com[^"]+)"/g,
    /data-src="(https:\/\/[^"]*st\.hzcdn\.com[^"]+)"/gi,
    /src="(https:\/\/[^"]*st\.hzcdn\.com[^"]+\.(?:jpg|jpeg|png|webp)[^"]*)"/gi,
    /srcset="([^"\s,]+)/g,
  ];
  
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(html)) !== null) {
      let url = match[1];
      url = url.replace(/\\u002F/g, '/').replace(/\\/g, '');
      
      if (!url.startsWith('http')) continue;
      if (!url.includes('st.hzcdn.com')) continue;
      if (url.includes('avatar') || url.includes('profile') || url.includes('logo')) continue;
      if (url.includes('.svg') || url.includes('.gif')) continue;
      
      const baseIdMatch = url.match(/\/([a-f0-9]+)_\d+-w/i) || url.match(/\/fimgs\/([a-f0-9]+)/i);
      const baseId = baseIdMatch ? baseIdMatch[1] : url;
      
      if (seenBaseIds.has(baseId)) continue;
      seenBaseIds.add(baseId);
      
      const highResUrl = toHighResolution(url);
      images.push({ url: highResUrl });
    }
  }
  
  console.log('[Extract] Found', images.length, 'unique high-res images');
  return images.slice(0, 20);
}

function extractProjectDetails(data: any, url: string): HouzzProject {
  const html = data.html || '';
  const markdown = data.markdown || '';
  const metadata = data.metadata || {};
  
  let title = '';
  const urlMatch = url.match(/\/projets\/([^/]+?)(?:-pj-vj)?~?\d*$/);
  if (urlMatch) {
    title = urlMatch[1]
      .replace(/-pj-vj.*$/, '')
      .replace(/-%E2%9C%A8/g, '')
      .replace(/%E2%9C%A8/g, '')
      .replace(/-+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    title = title.charAt(0).toUpperCase() + title.slice(1);
  }
  
  if (!title) {
    title = metadata.title || '';
    title = title.replace(/ \| Houzz.*$/i, '').trim();
    title = title.replace(/QUALIRENOVATION by Qualiconcept/i, '').trim();
  }
  
  if (!title) {
    const titleMatch = markdown.match(/^#\s+(.+)$/m);
    title = titleMatch ? titleMatch[1] : 'Projet sans titre';
  }
  
  console.log('[Extract] Title from URL:', title);
  
  let description = metadata.description || '';
  const descMatch = markdown.match(/##.*Description.*\n+([\s\S]*?)(?=\n##|\n\n\n|$)/i);
  if (descMatch) {
    description = descMatch[1].trim().substring(0, 1000);
  }
  
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
  
  let location = '';
  const locationMatch = markdown.match(/Paris|Lyon|Marseille|Bordeaux|Nantes|France/i);
  if (locationMatch) {
    location = locationMatch[0];
  }
  
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

async function saveProjectsToDatabase(supabase: any, projects: HouzzProject[]): Promise<{ imported: number; errors: number }> {
  let imported = 0;
  let errors = 0;

  for (const project of projects) {
    try {
      const slug = generateSlug(project.title);
      
      const { data: existing } = await supabase
        .from('houzz_projects')
        .select('id')
        .eq('slug', slug)
        .single();

      let projectId: string;

      if (existing) {
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
        
        await supabase
          .from('houzz_project_images')
          .delete()
          .eq('project_id', projectId);
      } else {
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

    const { action, urls } = await req.json();
    console.log('[Handler] Action:', action);

    switch (action) {
      case 'import-testimonials': {
        console.log('[Handler] Importing testimonials from Houzz reviews page');
        
        // Scrape the reviews page
        const reviewsData = await scrapeWithFirecrawl(HOUZZ_REVIEWS_URL, FIRECRAWL_API_KEY);
        
        // Extract testimonials
        const testimonials = extractTestimonialsFromHtml(
          reviewsData.html || '',
          reviewsData.markdown || ''
        );
        
        if (testimonials.length === 0) {
          return new Response(
            JSON.stringify({
              success: false,
              error: 'Aucun avis trouvé sur la page Houzz. Le format de la page a peut-être changé.',
              debug: {
                htmlLength: (reviewsData.html || '').length,
                markdownLength: (reviewsData.markdown || '').length,
              }
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        // Save to database
        const result = await saveTestimonialsToDatabase(supabase, testimonials);
        
        return new Response(
          JSON.stringify({
            success: true,
            found: testimonials.length,
            imported: result.imported,
            errors: result.errors,
            message: `${result.imported} avis importés sur ${testimonials.length} trouvés`,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'import-urls': {
        if (!urls || !Array.isArray(urls) || urls.length === 0) {
          return new Response(
            JSON.stringify({
              success: false,
              error: 'Aucune URL fournie',
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        console.log('[Handler] Importing', urls.length, 'projects from provided URLs');
        
        console.log('[Handler] Deleting existing projects and images...');
        await supabase.from('houzz_project_images').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await supabase.from('houzz_projects').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        console.log('[Handler] Existing data deleted');
        
        const projects: HouzzProject[] = [];
        for (const url of urls) {
          try {
            console.log('[Handler] Scraping project:', url);
            const projectData = await scrapeWithFirecrawl(url, FIRECRAWL_API_KEY);
            const project = extractProjectDetails(projectData, url);
            projects.push(project);
            
            await new Promise(resolve => setTimeout(resolve, 1000));
          } catch (error) {
            console.error('[Handler] Error scraping project:', url, error);
          }
        }
        
        console.log('[Handler] Saving', projects.length, 'projects to database...');
        const result = await saveProjectsToDatabase(supabase, projects);

        return new Response(
          JSON.stringify({
            success: true,
            total: urls.length,
            scraped: projects.length,
            imported: result.imported,
            errors: result.errors,
            houzzProfileUrl: HOUZZ_PROFILE_URL,
            message: `${result.imported} projets importés sur ${urls.length} (anciens projets supprimés)`,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'queue-status': {
        const { count: projectCount } = await supabase
          .from('houzz_projects')
          .select('*', { count: 'exact', head: true });

        const { count: imageCount } = await supabase
          .from('houzz_project_images')
          .select('*', { count: 'exact', head: true });

        const { count: testimonialCount } = await supabase
          .from('houzz_testimonials')
          .select('*', { count: 'exact', head: true });

        return new Response(
          JSON.stringify({
            projects: projectCount || 0,
            images: imageCount || 0,
            testimonials: testimonialCount || 0,
            houzzProfileUrl: HOUZZ_PROFILE_URL,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ 
            error: 'Action inconnue. Disponibles: import-urls, import-testimonials, queue-status' 
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
