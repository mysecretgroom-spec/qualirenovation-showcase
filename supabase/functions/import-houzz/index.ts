import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const HOUZZ_PROFILE_URL = "https://www.houzz.fr/pro/qualirenovation";
const HOUZZ_REVIEWS_URL = "https://www.houzz.fr/professionnels/artisan-et-entreprise-generale-de-batiment/qualirenovation-by-qualiconcept-pfvwfr-pf~1259357618/avis";

// =============================================
// URL VALIDATION
// =============================================

const ALLOWED_HOUZZ_DOMAINS = [
  'www.houzz.fr',
  'houzz.fr',
];

const MAX_URLS_PER_REQUEST = 50;

function isValidHouzzUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    // Check domain is allowed
    if (!ALLOWED_HOUZZ_DOMAINS.includes(parsed.hostname)) {
      return false;
    }
    // Check it's a project URL
    if (!parsed.pathname.includes('/projets/')) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

function validateAndFilterUrls(urls: unknown): { valid: string[]; invalid: string[] } {
  const valid: string[] = [];
  const invalid: string[] = [];
  
  if (!Array.isArray(urls)) {
    return { valid: [], invalid: [] };
  }
  
  for (const url of urls) {
    if (typeof url !== 'string') {
      invalid.push(String(url));
      continue;
    }
    
    const trimmedUrl = url.trim();
    if (isValidHouzzUrl(trimmedUrl)) {
      valid.push(trimmedUrl);
    } else {
      invalid.push(trimmedUrl);
    }
  }
  
  return { valid, invalid };
}

// =============================================
// INTERFACES
// =============================================

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
  houzz_user_url?: string;
  has_photos?: boolean;
  photo_urls?: string[];
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
async function scrapeWithFirecrawl(url: string, apiKey: string, waitTime: number = 15000): Promise<any> {
  console.log('[Firecrawl] Scraping:', url, 'with wait:', waitTime);
  
  const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url,
      formats: ['markdown', 'html', 'links', 'rawHtml', 'screenshot'],
      onlyMainContent: false,
      waitFor: waitTime,
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

// Check if we only got generic placeholder images
function hasOnlyPlaceholders(images: { url: string; caption?: string }[]): boolean {
  if (images.length === 0) return true;
  
  // If all images are filtered out as generic, we only have placeholders
  const realImages = images.filter(img => !isGenericImage(img.url));
  return realImages.length === 0;
}

// Scrape with retry logic - if only placeholders found, retry with longer wait
async function scrapeWithRetry(url: string, apiKey: string, maxRetries: number = 3): Promise<any> {
  const waitTimes = [15000, 20000, 25000]; // Increasing wait times
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const waitTime = waitTimes[attempt] || 25000;
    console.log(`[Retry] Attempt ${attempt + 1}/${maxRetries} for ${url}`);
    
    const data = await scrapeWithFirecrawl(url, apiKey, waitTime);
    
    // Extract images to check if we got real ones
    const images = extractImagesFromHtml(
      data.html || '', 
      data.markdown || '', 
      data.rawHtml || '', 
      data.links || []
    );
    
    if (!hasOnlyPlaceholders(images)) {
      console.log(`[Retry] Found ${images.length} real images on attempt ${attempt + 1}`);
      return data;
    }
    
    console.log(`[Retry] Only placeholders found on attempt ${attempt + 1}, waiting before retry...`);
    
    if (attempt < maxRetries - 1) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // 5s delay between retries
    }
  }
  
  console.log('[Retry] Max retries reached, returning last result');
  return await scrapeWithFirecrawl(url, apiKey, 25000);
}

// Extract photo IDs from project URL and build gallery URLs
function extractPhotoIdsFromUrl(url: string): string[] {
  // Houzz project URLs contain photo IDs we can use
  // Pattern: /projets/title-pj-vj~PROJECTID
  const match = url.match(/~(\d+)$/);
  return match ? [match[1]] : [];
}

// Scrape Houzz gallery page to get all photo URLs
async function scrapeHouzzGallery(projectUrl: string, apiKey: string): Promise<string[]> {
  const images: string[] = [];
  
  // Try to get the gallery/photos page variant
  // Houzz has URLs like: /projets/name-pj-vj~ID -> photos at /projets/name-phvw-vp~ID
  const galleryUrl = projectUrl
    .replace('-pj-vj~', '-phvw-vp~')
    .replace('/hznb/projets/', '/photos/');
  
  console.log('[Gallery] Trying gallery URL:', galleryUrl);
  
  try {
    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: galleryUrl,
        formats: ['html', 'rawHtml', 'links'],
        onlyMainContent: false,
        waitFor: 5000,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const result = data.data || data;
      
      // Extract image URLs from the gallery HTML
      const html = result.rawHtml || result.html || '';
      const links = result.links || [];
      
      // Find image URLs in links
      for (const link of links) {
        if (typeof link === 'string' && link.includes('st.hzcdn.com') && 
            (link.includes('/fimgs/') || link.includes('/simgs/'))) {
          if (!link.includes('c2a344b60455efef_5281')) { // Skip logo
            images.push(toHighResolution(link));
          }
        }
      }
      
      // Also extract from HTML
      const imgPattern = /https:\/\/st\.hzcdn\.com\/(?:fimgs|simgs)\/[a-f0-9]+[^"'\s)]+/gi;
      let match;
      while ((match = imgPattern.exec(html)) !== null) {
        const imgUrl = match[0];
        if (!imgUrl.includes('c2a344b60455efef_5281')) {
          images.push(toHighResolution(imgUrl));
        }
      }
      
      console.log('[Gallery] Found', images.length, 'images from gallery');
    }
  } catch (error) {
    console.log('[Gallery] Could not scrape gallery:', error);
  }
  
  return [...new Set(images)]; // Deduplicate
}

// Extract testimonials from markdown
function extractTestimonialsFromMarkdown(markdown: string): HouzzTestimonial[] {
  const testimonials: HouzzTestimonial[] = [];
  
  console.log('[Extract] Parsing testimonials from markdown...');
  console.log('[Extract] Markdown length:', markdown.length);
  
  // Split by user profile links - each review starts with a user link
  // Pattern: [Username](https://www.houzz.fr/user/...) followed by rating and text
  const lines = markdown.split('\n');
  
  let currentName: string | null = null;
  let currentUserUrl: string | null = null;
  let currentRating: number = 5;
  let currentText: string[] = [];
  let currentDate: string | null = null;
  let isCollectingText = false;
  let hasPhotos = false;
  let photoUrls: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check for user profile link - marks start of a new review
    // Pattern: [Name](https://www.houzz.fr/user/username)
    const userMatch = line.match(/^\[([^\]]+)\]\((https:\/\/www\.houzz\.fr\/user\/[^)]+)\)$/);
    
    if (userMatch) {
      // Save previous testimonial if we have one
      if (currentName && currentText.length > 0) {
        const text = currentText.join('\n').trim();
        // Filter out navigation/menu content
        if (text.length > 30 && !text.includes('COIN REPAS') && !text.includes('PIÈCES À VIVRE') && !text.includes('Voir toutes les photos')) {
          testimonials.push({
            name: currentName,
            rating: currentRating,
            text: text.substring(0, 2000),
            date: currentDate || undefined,
            houzz_user_url: currentUserUrl || undefined,
            has_photos: hasPhotos,
            photo_urls: photoUrls.length > 0 ? photoUrls : undefined,
          });
        }
      }
      
      // Start new review
      currentName = userMatch[1];
      currentUserUrl = userMatch[2];
      currentRating = 5;
      currentText = [];
      currentDate = null;
      isCollectingText = false;
      hasPhotos = false;
      photoUrls = [];
      
      // Skip "Utilisateur Houzz - XXXXX" type names (anonymous), keep the actual name
      if (currentName.startsWith('Utilisateur Houzz')) {
        // Check next line for the actual display name
        if (i + 2 < lines.length) {
          const nextUserMatch = lines[i + 2].trim().match(/^\[([^\]]+)\]\((https:\/\/www\.houzz\.fr\/user\/[^)]+)\)$/);
          if (nextUserMatch) {
            currentName = nextUserMatch[1];
            currentUserUrl = nextUserMatch[2];
            i += 2; // Skip to after the second user link
          }
        }
      }
      
      continue;
    }
    
    // Check for rating line
    const ratingMatch = line.match(/Note moyenne\s*:\s*(\d+)\s*étoiles?\s*sur\s*5/i);
    if (ratingMatch && currentName) {
      currentRating = parseInt(ratingMatch[1]);
      isCollectingText = true;
      continue;
    }
    
    // Check for "Utile" line - marks end of review text
    if (line.match(/^Utile(\s*\(\d+\))?$/i) && currentName && isCollectingText) {
      isCollectingText = false;
      continue;
    }
    
    // Check for date line (after "Utile")
    const dateMatch = line.match(/^(\d{1,2}\s+(?:Janvier|Février|Mars|Avril|Mai|Juin|Juillet|Août|Septembre|Octobre|Novembre|Décembre)\s+\d{4})/i);
    if (dateMatch && currentName && !isCollectingText) {
      currentDate = dateMatch[1];
      continue;
    }
    
    // Check for photo URLs in the review
    const photoMatch = line.match(/!\[.*?\]\((https:\/\/st\.hzcdn\.com\/fimgs\/[^)]+)\)/g);
    if (photoMatch && currentName) {
      for (const photo of photoMatch) {
        const urlMatch = photo.match(/\((https:\/\/[^)]+)\)/);
        if (urlMatch) {
          photoUrls.push(urlMatch[1]);
          hasPhotos = true;
        }
      }
      continue;
    }
    
    // Skip company response blocks
    if (line.includes('Commentaire de QUALIRENOVATION')) {
      isCollectingText = false;
      continue;
    }
    
    // Skip "Lire plus" lines
    if (line === 'Lire plus') {
      continue;
    }
    
    // Collect review text
    if (isCollectingText && currentName && line.length > 0) {
      // Skip image links and navigation elements
      if (!line.startsWith('![') && !line.match(/^\[.*\]\(https:\/\//)) {
        currentText.push(line);
      }
    }
  }
  
  // Don't forget the last testimonial
  if (currentName && currentText.length > 0) {
    const text = currentText.join('\n').trim();
    if (text.length > 30 && !text.includes('COIN REPAS') && !text.includes('PIÈCES À VIVRE')) {
      testimonials.push({
        name: currentName,
        rating: currentRating,
        text: text.substring(0, 2000),
        date: currentDate || undefined,
        houzz_user_url: currentUserUrl || undefined,
        has_photos: hasPhotos,
        photo_urls: photoUrls.length > 0 ? photoUrls : undefined,
      });
    }
  }
  
  console.log('[Extract] Found', testimonials.length, 'testimonials');
  
  // Log first testimonial for debugging
  if (testimonials.length > 0) {
    console.log('[Extract] First testimonial:', JSON.stringify(testimonials[0]).substring(0, 300));
  }
  
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
          houzz_user_url: testimonial.houzz_user_url,
          has_photos: testimonial.has_photos || false,
          photo_urls: testimonial.photo_urls,
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

// Known generic/placeholder image IDs to skip (appear on all Houzz pages)
const GENERIC_IMAGE_IDS = [
  'c2a344b60455efef_5281', // Qualirenovation logo  
  '81912ca803582c51_9-2898', // Houzz placeholder 1
  '15e1f4c30358399f_16-6307', // Houzz generic image
  '221176c101fc2cf7_16-6566', // Houzz generic image
  '4fd134ac03585a99_16-4748', // Houzz generic image
  '91219cfa02d8687c_16-9774', // Houzz generic image
  '975135c203d2e0c8_9-4489', // Houzz generic image
  'b231ddda0321f9f3_14-1064', // Houzz generic image
  'aea5f95808ab2bc8_9-8332', // Houzz generic image
  'home-design', // Generic placeholder indicator
];

function isGenericImage(url: string): boolean {
  // Check for known generic IDs
  if (GENERIC_IMAGE_IDS.some(id => url.includes(id))) return true;
  
  // Also reject /home-design.jpg placeholder images
  if (url.includes('/home-design.jpg')) return true;
  
  return false;
}

function extractImagesFromHtml(html: string, markdown?: string, rawHtml?: string, links?: string[]): { url: string; caption?: string }[] {
  const images: { url: string; caption?: string }[] = [];
  const seenBaseIds = new Set<string>();
  
  // Helper to add image if unique
  const addImage = (url: string, caption?: string) => {
    if (!url || !url.includes('st.hzcdn.com')) return;
    if (isGenericImage(url)) return; // Skip generic Houzz images
    if (url.includes('avatar') || url.includes('profile') || url.includes('logo')) return;
    if (url.includes('.svg') || url.includes('.gif')) return;
    
    const baseIdMatch = url.match(/\/([a-f0-9]+)_\d+-w/i) || url.match(/\/fimgs\/([a-f0-9]+)/i) || url.match(/\/simgs\/([a-f0-9]+)/i);
    const baseId = baseIdMatch ? baseIdMatch[1] : url;
    
    if (seenBaseIds.has(baseId)) return;
    seenBaseIds.add(baseId);
    
    const highResUrl = toHighResolution(url);
    images.push({ url: highResUrl, caption });
  };
  
  // 1. Extract from links array (most reliable for Firecrawl)
  if (links && Array.isArray(links)) {
    for (const link of links) {
      if (typeof link === 'string' && link.includes('st.hzcdn.com')) {
        addImage(link);
      }
    }
    console.log('[Extract] Found', images.length, 'images from links array');
  }
  
  // 2. Extract from markdown
  if (markdown) {
    const mdImagePattern = /!\[([^\]]*)\]\((https:\/\/st\.hzcdn\.com\/(?:fimgs|simgs)\/[^)]+)\)/g;
    let mdMatch;
    while ((mdMatch = mdImagePattern.exec(markdown)) !== null) {
      addImage(mdMatch[2], mdMatch[1] || undefined);
    }
    
    // Also look for raw URLs in markdown
    const rawUrlPattern = /https:\/\/st\.hzcdn\.com\/(?:fimgs|simgs)\/[a-f0-9][^\s"'<>)]+/gi;
    let rawMatch;
    while ((rawMatch = rawUrlPattern.exec(markdown)) !== null) {
      addImage(rawMatch[0]);
    }
  }
  
  // 3. Extract from rawHtml (has more data than processed html)
  const htmlToSearch = rawHtml || html || '';
  
  // Look for JSON data embedded in the page (Houzz stores image data in JSON)
  const jsonPatterns = [
    /"imageUrl"\s*:\s*"([^"]+)"/g,
    /"fullUrl"\s*:\s*"([^"]+)"/g,
    /"url"\s*:\s*"(https:\/\/st\.hzcdn\.com[^"]+)"/g,
    /"src"\s*:\s*"(https:\/\/st\.hzcdn\.com[^"]+)"/g,
    /"image"\s*:\s*"(https:\/\/st\.hzcdn\.com[^"]+)"/g,
  ];
  
  for (const pattern of jsonPatterns) {
    let match;
    while ((match = pattern.exec(htmlToSearch)) !== null) {
      let url = match[1];
      url = url.replace(/\\u002F/g, '/').replace(/\\/g, '');
      addImage(url);
    }
  }
  
  // 4. Standard HTML patterns
  const htmlPatterns = [
    /data-src="(https:\/\/[^"]*st\.hzcdn\.com[^"]+)"/gi,
    /src="(https:\/\/[^"]*st\.hzcdn\.com[^"]+\.(?:jpg|jpeg|png|webp)[^"]*)"/gi,
    /srcset="([^"\s,]+st\.hzcdn\.com[^"\s,]+)/g,
    /background-image:\s*url\(['"]?(https:\/\/[^'")\s]*st\.hzcdn\.com[^'")\s]+)['"]?\)/gi,
  ];
  
  for (const pattern of htmlPatterns) {
    let match;
    while ((match = pattern.exec(htmlToSearch)) !== null) {
      let url = match[1];
      url = url.replace(/\\u002F/g, '/').replace(/\\/g, '');
      addImage(url);
    }
  }
  
  console.log('[Extract] Total unique images found:', images.length);
  return images.slice(0, 50); // Allow more images
}

function extractProjectDetails(data: any, url: string): HouzzProject {
  const html = data.html || '';
  const rawHtml = data.rawHtml || '';
  const markdown = data.markdown || '';
  const metadata = data.metadata || {};
  const links = data.links || [];
  
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
  
  // Pass rawHtml and links to extraction function
  const images = extractImagesFromHtml(html, markdown, rawHtml, links);
  
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
        
        // Extract testimonials from markdown
        const testimonials = extractTestimonialsFromMarkdown(
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

        // Validate URLs - only allow houzz.fr domain
        const { valid: validUrls, invalid: invalidUrls } = validateAndFilterUrls(urls);
        
        if (validUrls.length === 0) {
          return new Response(
            JSON.stringify({
              success: false,
              error: 'Aucune URL Houzz valide. Les URLs doivent être du domaine houzz.fr et pointer vers /projets/',
              invalidUrls,
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        if (validUrls.length > MAX_URLS_PER_REQUEST) {
          return new Response(
            JSON.stringify({
              success: false,
              error: `Maximum ${MAX_URLS_PER_REQUEST} URLs par requête.`,
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log('[Handler] Importing', validUrls.length, 'validated projects');
        
        console.log('[Handler] Deleting existing projects and images...');
        await supabase.from('houzz_project_images').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await supabase.from('houzz_projects').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        console.log('[Handler] Existing data deleted');
        
        const projects: HouzzProject[] = [];
        for (const url of validUrls) {
          try {
            console.log('[Handler] Scraping project with retry logic:', url);
            // Use retry logic to ensure we get real images
            const projectData = await scrapeWithRetry(url, FIRECRAWL_API_KEY, 3);
            const project = extractProjectDetails(projectData, url);
            
            console.log(`[Handler] Initial scrape found ${project.images.length} images`);
            
            // If still few images or only placeholders, try gallery
            if (project.images.length < 3 || hasOnlyPlaceholders(project.images)) {
              console.log('[Handler] Few/placeholder images, trying gallery scrape...');
              const galleryImages = await scrapeHouzzGallery(url, FIRECRAWL_API_KEY);
              if (galleryImages.length > 0) {
                const existingUrls = new Set(project.images.map(i => i.url));
                for (const imgUrl of galleryImages) {
                  if (!existingUrls.has(imgUrl) && !isGenericImage(imgUrl)) {
                    project.images.push({ url: imgUrl });
                  }
                }
                console.log('[Handler] Total images after gallery:', project.images.length);
              }
              await new Promise(resolve => setTimeout(resolve, 2000)); // Delay for gallery
            }
            
            // Final filter to remove any remaining generic images
            project.images = project.images.filter(img => !isGenericImage(img.url));
            console.log(`[Handler] Final image count after filtering: ${project.images.length}`);
            
            projects.push(project);
            
            // Longer delay between projects to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 2000));
          } catch (error) {
            console.error('[Handler] Error scraping project:', url, error);
          }
        }
        
        console.log('[Handler] Saving', projects.length, 'projects to database...');
        const result = await saveProjectsToDatabase(supabase, projects);

        return new Response(
          JSON.stringify({
            success: true,
            total: validUrls.length,
            scraped: projects.length,
            imported: result.imported,
            errors: result.errors,
            skippedInvalidUrls: invalidUrls.length,
            houzzProfileUrl: HOUZZ_PROFILE_URL,
            message: `${result.imported} projets importés sur ${validUrls.length}`,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'reimport-projects': {
        // Re-import specific projects without deleting others
        if (!urls || !Array.isArray(urls) || urls.length === 0) {
          return new Response(
            JSON.stringify({
              success: false,
              error: 'Aucune URL fournie',
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { valid: validUrls, invalid: invalidUrls } = validateAndFilterUrls(urls);
        
        if (validUrls.length === 0) {
          return new Response(
            JSON.stringify({
              success: false,
              error: 'Aucune URL Houzz valide.',
              invalidUrls,
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log('[Handler] Re-importing', validUrls.length, 'projects (update mode)');
        
        const projects: HouzzProject[] = [];
        for (const url of validUrls) {
          try {
            console.log('[Handler] Re-scraping project with retry logic:', url);
            const projectData = await scrapeWithRetry(url, FIRECRAWL_API_KEY, 3);
            const project = extractProjectDetails(projectData, url);
            
            console.log(`[Handler] Initial scrape found ${project.images.length} images`);
            
            // If still few images or only placeholders, try gallery
            if (project.images.length < 3 || hasOnlyPlaceholders(project.images)) {
              console.log('[Handler] Few/placeholder images, trying gallery scrape...');
              const galleryImages = await scrapeHouzzGallery(url, FIRECRAWL_API_KEY);
              if (galleryImages.length > 0) {
                const existingUrls = new Set(project.images.map(i => i.url));
                for (const imgUrl of galleryImages) {
                  if (!existingUrls.has(imgUrl) && !isGenericImage(imgUrl)) {
                    project.images.push({ url: imgUrl });
                  }
                }
                console.log('[Handler] Total images after gallery:', project.images.length);
              }
              await new Promise(resolve => setTimeout(resolve, 2000));
            }
            
            // Final filter
            project.images = project.images.filter(img => !isGenericImage(img.url));
            console.log(`[Handler] Final image count after filtering: ${project.images.length}`);
            
            projects.push(project);
            
            await new Promise(resolve => setTimeout(resolve, 2000));
          } catch (error) {
            console.error('[Handler] Error scraping project:', url, error);
          }
        }
        
        console.log('[Handler] Updating', projects.length, 'projects in database...');
        const result = await saveProjectsToDatabase(supabase, projects);

        return new Response(
          JSON.stringify({
            success: true,
            total: validUrls.length,
            scraped: projects.length,
            updated: result.imported,
            errors: result.errors,
            message: `${result.imported} projets mis à jour sur ${validUrls.length}`,
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
