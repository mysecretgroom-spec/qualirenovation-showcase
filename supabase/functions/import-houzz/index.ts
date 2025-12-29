import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const HOUZZ_PROFILE_URL = "https://www.houzz.fr/pro/qualirenovation";
const APIFY_ACTOR_ID = "easyapi/houzz-professional-scraper";

interface ApifyRunResult {
  id: string;
  status: string;
  defaultDatasetId: string;
}

interface HouzzProject {
  url: string;
  title: string;
  description?: string;
  category?: string;
  images?: { url: string; caption?: string }[];
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

// Start Apify actor run
async function startApifyScraper(apiKey: string): Promise<ApifyRunResult> {
  console.log('[Apify] Starting Houzz scraper actor...');
  
  const response = await fetch(`https://api.apify.com/v2/acts/${APIFY_ACTOR_ID}/runs?token=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      startUrls: [{ url: HOUZZ_PROFILE_URL }],
      maxRequestsPerCrawl: 200,
      proxyConfiguration: { useApifyProxy: true },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('[Apify] Failed to start actor:', error);
    throw new Error(`Apify actor start failed: ${response.status}`);
  }

  const result = await response.json();
  console.log('[Apify] Actor started, run ID:', result.data.id);
  return result.data;
}

// Check actor run status
async function checkRunStatus(apiKey: string, runId: string): Promise<ApifyRunResult> {
  const response = await fetch(`https://api.apify.com/v2/actor-runs/${runId}?token=${apiKey}`);
  
  if (!response.ok) {
    throw new Error(`Failed to check run status: ${response.status}`);
  }

  const result = await response.json();
  return result.data;
}

// Get dataset items
async function getDatasetItems(apiKey: string, datasetId: string): Promise<any[]> {
  console.log('[Apify] Fetching dataset items from:', datasetId);
  
  const response = await fetch(
    `https://api.apify.com/v2/datasets/${datasetId}/items?token=${apiKey}&format=json`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch dataset: ${response.status}`);
  }

  const items = await response.json();
  console.log('[Apify] Retrieved', items.length, 'items from dataset');
  return items;
}

// Wait for run to complete with polling
async function waitForRunCompletion(apiKey: string, runId: string, maxWaitMs = 300000): Promise<ApifyRunResult> {
  const startTime = Date.now();
  const pollInterval = 5000; // 5 seconds

  while (Date.now() - startTime < maxWaitMs) {
    const status = await checkRunStatus(apiKey, runId);
    console.log('[Apify] Run status:', status.status);

    if (status.status === 'SUCCEEDED') {
      return status;
    } else if (status.status === 'FAILED' || status.status === 'ABORTED') {
      throw new Error(`Apify run ${status.status}`);
    }

    await new Promise(resolve => setTimeout(resolve, pollInterval));
  }

  throw new Error('Apify run timed out');
}

// Extract projects from Apify data
function extractProjectsFromApifyData(items: any[]): HouzzProject[] {
  const projects: HouzzProject[] = [];
  
  for (const item of items) {
    console.log('[Apify] Processing item:', JSON.stringify(item).substring(0, 500));
    
    // Handle professional data format
    if (item.professional?.projects) {
      for (const project of item.professional.projects) {
        projects.push({
          url: project.url || project.projectUrl || '',
          title: project.title || project.name || 'Projet sans titre',
          description: project.description || '',
          category: project.category || project.style || 'Rénovation',
          images: (project.images || project.photos || []).map((img: any) => ({
            url: typeof img === 'string' ? img : (img.url || img.imageUrl || img.src),
            caption: typeof img === 'string' ? '' : (img.caption || img.alt || ''),
          })),
          location: project.location || item.professional?.formattedAddress || '',
          year: project.year || '',
        });
      }
    }
    
    // Handle projects array directly
    if (item.projects && Array.isArray(item.projects)) {
      for (const project of item.projects) {
        projects.push({
          url: project.url || project.projectUrl || '',
          title: project.title || project.name || 'Projet sans titre',
          description: project.description || '',
          category: project.category || project.style || 'Rénovation',
          images: (project.images || project.photos || []).map((img: any) => ({
            url: typeof img === 'string' ? img : (img.url || img.imageUrl || img.src),
            caption: typeof img === 'string' ? '' : (img.caption || img.alt || ''),
          })),
          location: project.location || '',
          year: project.year || '',
        });
      }
    }
    
    // Handle direct project format
    if (item.projectUrl || item.url?.includes('/projets/')) {
      projects.push({
        url: item.projectUrl || item.url || '',
        title: item.title || item.projectTitle || 'Projet sans titre',
        description: item.description || '',
        category: item.category || item.style || 'Rénovation',
        images: (item.images || item.photos || []).map((img: any) => ({
          url: typeof img === 'string' ? img : (img.url || img.imageUrl || img.src),
          caption: typeof img === 'string' ? '' : (img.caption || img.alt || ''),
        })),
        location: item.location || '',
        year: item.year || '',
      });
    }
  }

  console.log('[Apify] Extracted', projects.length, 'projects from data');
  return projects;
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
    const APIFY_API_KEY = Deno.env.get('APIFY_API_KEY');
    if (!APIFY_API_KEY) {
      throw new Error('APIFY_API_KEY not configured');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { action, runId } = await req.json();
    console.log('[Handler] Action:', action);

    switch (action) {
      case 'start-scraper': {
        // Start the Apify scraper
        const run = await startApifyScraper(APIFY_API_KEY);
        return new Response(
          JSON.stringify({
            success: true,
            runId: run.id,
            status: run.status,
            message: 'Scraper Apify démarré. Utilisez check-status pour suivre la progression.',
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'check-status': {
        if (!runId) {
          throw new Error('runId is required for check-status');
        }
        const status = await checkRunStatus(APIFY_API_KEY, runId);
        return new Response(
          JSON.stringify({
            success: true,
            runId: status.id,
            status: status.status,
            datasetId: status.defaultDatasetId,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'import-results': {
        if (!runId) {
          throw new Error('runId is required for import-results');
        }
        
        // Get run status to get dataset ID
        const status = await checkRunStatus(APIFY_API_KEY, runId);
        
        if (status.status !== 'SUCCEEDED') {
          return new Response(
            JSON.stringify({
              success: false,
              error: `Le scraper n'est pas terminé. Statut: ${status.status}`,
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Get dataset items
        const items = await getDatasetItems(APIFY_API_KEY, status.defaultDatasetId);
        
        // Extract projects
        const projects = extractProjectsFromApifyData(items);
        
        // Save to database
        const result = await saveProjectsToDatabase(supabase, projects);

        return new Response(
          JSON.stringify({
            success: true,
            total: projects.length,
            imported: result.imported,
            errors: result.errors,
            message: `${result.imported} projets importés avec ${result.errors} erreurs`,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'full-import': {
        // Start scraper and wait for completion, then import
        console.log('[Handler] Starting full import process...');
        
        const run = await startApifyScraper(APIFY_API_KEY);
        console.log('[Handler] Waiting for scraper to complete...');
        
        const completedRun = await waitForRunCompletion(APIFY_API_KEY, run.id);
        console.log('[Handler] Scraper completed, fetching results...');
        
        const items = await getDatasetItems(APIFY_API_KEY, completedRun.defaultDatasetId);
        const projects = extractProjectsFromApifyData(items);
        const result = await saveProjectsToDatabase(supabase, projects);

        return new Response(
          JSON.stringify({
            success: true,
            total: projects.length,
            imported: result.imported,
            errors: result.errors,
            message: `Import complet: ${result.imported} projets importés`,
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
            pending: 0,
            processing: 0,
            completed: projectCount || 0,
            failed: 0,
            total: projectCount || 0,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ 
            error: 'Action inconnue. Disponibles: start-scraper, check-status, import-results, full-import, queue-status' 
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
