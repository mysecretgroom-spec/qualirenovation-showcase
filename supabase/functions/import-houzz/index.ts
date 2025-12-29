import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface HouzzProject {
  title: string
  slug: string
  description: string
  location: string
  category: string
  imageCount: number
  houzzUrl: string
  images: string[]
}

interface HouzzTestimonial {
  name: string
  text: string
  rating: number
  date: string
  projectType: string
  role: string
  houzzUserUrl: string
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .substring(0, 100)
}

// Extract category from URL or content
function extractCategory(url: string, content: string): string {
  const categoryKeywords = {
    'salle-de-bain': 'Salle de bain',
    'bathroom': 'Salle de bain',
    'cuisine': 'Cuisine',
    'kitchen': 'Cuisine',
    'salon': 'Salon',
    'living': 'Salon',
    'chambre': 'Chambre',
    'bedroom': 'Chambre',
    'terrasse': 'Terrasse',
    'outdoor': 'Extérieur',
    'renovation': 'Rénovation',
    'appartement': 'Appartement',
  }
  
  const lowerUrl = url.toLowerCase()
  const lowerContent = content.toLowerCase()
  
  for (const [keyword, category] of Object.entries(categoryKeywords)) {
    if (lowerUrl.includes(keyword) || lowerContent.includes(keyword)) {
      return category
    }
  }
  
  return 'Rénovation'
}

// Extract location from content
function extractLocation(content: string): string {
  const locationPatterns = [
    /paris\s*\d{1,2}/gi,
    /paris/gi,
    /clamart/gi,
    /boulogne/gi,
    /neuilly/gi,
    /ile-de-france/gi,
  ]
  
  for (const pattern of locationPatterns) {
    const match = content.match(pattern)
    if (match) {
      return match[0].charAt(0).toUpperCase() + match[0].slice(1).toLowerCase()
    }
  }
  
  return 'Paris'
}

// Scrape a single project page with waitFor for dynamic content
async function scrapeProjectPage(url: string, apiKey: string): Promise<{ description: string, images: string[], category: string, location: string }> {
  console.log('Scraping project page with waitFor:', url)
  
  try {
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
        waitFor: 3000, // Wait 3 seconds for JavaScript to load
      }),
    })

    if (!response.ok) {
      console.error('Failed to scrape project page:', response.status)
      return { description: '', images: [], category: 'Rénovation', location: 'Paris' }
    }

    const data = await response.json()
    const html = data.data?.html || ''
    const markdown = data.data?.markdown || ''
    const links = data.data?.links || []
    
    // Extract images from HTML - multiple patterns for HD images
    const imagePatterns = [
      // High-res Houzz CDN images
      /https:\/\/st\.hzcdn\.com\/fimgs\/[a-zA-Z0-9_-]+[^"'\s<>)]+\.(jpg|jpeg|png|webp)/gi,
      /https:\/\/st\.hzcdn\.com\/simgs\/[a-zA-Z0-9_-]+[^"'\s<>)]+\.(jpg|jpeg|png|webp)/gi,
      // Pictures with various sizes
      /https:\/\/st\.hzcdn\.com\/simgs\/pictures\/[a-zA-Z0-9_/-]+\.(jpg|jpeg|png|webp)/gi,
      // Original size images
      /https:\/\/[^"'\s<>]+\.hzcdn\.com\/[^"'\s<>]+\.(jpg|jpeg|png|webp)/gi,
    ]
    
    let allImages: string[] = []
    for (const pattern of imagePatterns) {
      const matches = html.match(pattern) || []
      allImages = [...allImages, ...matches]
    }
    
    // Also extract from srcset for highest resolution
    const srcsetPattern = /srcset="([^"]+)"/gi
    let srcsetMatch
    while ((srcsetMatch = srcsetPattern.exec(html)) !== null) {
      const srcset = srcsetMatch[1]
      const sources = srcset.split(',').map(s => s.trim().split(' ')[0])
      allImages = [...allImages, ...sources.filter(s => s.includes('hzcdn.com'))]
    }
    
    // Deduplicate and filter out thumbnails
    const uniqueImages = [...new Set(allImages)]
      .filter(img => 
        !img.includes('-w40-') && 
        !img.includes('-w80-') && 
        !img.includes('-w48-') &&
        !img.includes('-w100-') &&
        !img.includes('avatar') &&
        !img.includes('icon')
      )
      .map(img => {
        // Try to get higher resolution version - replace width parameters
        return img
          .replace(/-w\d+-h\d+/, '-w1920-h1440')
          .replace(/\/w\d+\//, '/w1920/')
          .replace(/\?.*$/, '') // Remove query params
      })
      .slice(0, 100) // Max 100 images per project

    // Extract description from markdown - look for substantial text
    let description = ''
    const lines = markdown.split('\n').filter((line: string) => line.trim())
    for (const line of lines) {
      // Find descriptive text that's not a link or header
      if (
        line.length > 100 && 
        !line.startsWith('#') && 
        !line.startsWith('[') && 
        !line.startsWith('!') && 
        !line.includes('Houzz') &&
        !line.includes('cookie') &&
        !line.includes('©')
      ) {
        description = line.trim().substring(0, 2000)
        break
      }
    }
    
    // If no long description found, try combining shorter lines
    if (!description) {
      const shortLines = lines.filter((line: string) => 
        line.length > 30 && 
        line.length < 500 &&
        !line.startsWith('#') && 
        !line.startsWith('[') &&
        !line.includes('Houzz')
      )
      description = shortLines.slice(0, 3).join(' ').substring(0, 2000)
    }

    const category = extractCategory(url, markdown)
    const location = extractLocation(markdown)

    console.log(`Found ${uniqueImages.length} HD images, category: ${category}, location: ${location}`)
    return { description, images: uniqueImages, category, location }
  } catch (error) {
    console.error('Error scraping project page:', error)
    return { description: '', images: [], category: 'Rénovation', location: 'Paris' }
  }
}

// Use Firecrawl Map API to discover all project URLs
async function discoverProjectUrls(apiKey: string, baseUrl: string): Promise<string[]> {
  console.log('Using Map API to discover project URLs...')
  
  try {
    const response = await fetch('https://api.firecrawl.dev/v1/map', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: baseUrl,
        search: 'projets',
        limit: 500,
        includeSubdomains: false,
      }),
    })

    if (!response.ok) {
      console.error('Map API failed:', response.status)
      return []
    }

    const data = await response.json()
    console.log('Map API response:', JSON.stringify(data).substring(0, 500))
    
    const links = data.links || data.data?.links || []
    
    // Filter to only project URLs
    const projectUrls: string[] = links.filter((link: string) => 
      link.includes('/hznb/projets/') || 
      link.includes('pj-vj~') ||
      (link.includes('/projets/') && !link.includes('/professionnels/'))
    )
    
    console.log(`Map API found ${projectUrls.length} project URLs`)
    return [...new Set(projectUrls)] as string[]
  } catch (error) {
    console.error('Error using Map API:', error)
    return []
  }
}

// Scrape the profile page to find project URLs as fallback
async function scrapeProfileForProjects(apiKey: string, profileUrl: string): Promise<string[]> {
  console.log('Scraping profile page for projects:', profileUrl)
  
  try {
    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: profileUrl,
        formats: ['html', 'links'],
        onlyMainContent: false,
        waitFor: 3000,
      }),
    })

    if (!response.ok) {
      console.error('Failed to scrape profile:', response.status)
      return []
    }

    const data = await response.json()
    const html = data.data?.html || ''
    const links = data.data?.links || []
    
    // Extract project URLs from links
    let projectUrls: string[] = links.filter((link: string) => 
      link.includes('/hznb/projets/') || link.includes('pj-vj~')
    )
    
    // Also extract from HTML directly
    const projectUrlPattern = /https:\/\/www\.houzz\.fr\/hznb\/projets\/[^"'\s<>]+/gi
    const htmlProjectUrls = html.match(projectUrlPattern) || []
    projectUrls = [...new Set([...projectUrls, ...htmlProjectUrls])]
    
    console.log(`Found ${projectUrls.length} project URLs from profile`)
    return projectUrls
  } catch (error) {
    console.error('Error scraping profile:', error)
    return []
  }
}

// Scrape testimonials from reviews page
async function scrapeTestimonials(apiKey: string): Promise<HouzzTestimonial[]> {
  console.log('Scraping testimonials...')
  
  const reviewsUrl = 'https://www.houzz.fr/professionnels/artisan-et-entreprise-generale-de-batiment/qualirenovation-by-qualiconcept-pfvwfr-pf~1259357618/avis'
  
  try {
    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: reviewsUrl,
        formats: ['html', 'markdown'],
        onlyMainContent: false,
        waitFor: 3000,
      }),
    })

    if (!response.ok) {
      console.error('Failed to scrape testimonials:', response.status)
      return []
    }

    const data = await response.json()
    const html = data.data?.html || ''
    const markdown = data.data?.markdown || ''
    
    const testimonials: HouzzTestimonial[] = []
    
    // Parse testimonials from HTML structure
    // Look for review blocks
    const reviewPattern = /<div[^>]*class="[^"]*review[^"]*"[^>]*>([\s\S]*?)<\/div>/gi
    const ratingPattern = /(\d)\s*(?:étoiles?|stars?)/gi
    const datePattern = /(\d{1,2})\s*(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s*(\d{4})/gi
    const namePattern = /<[^>]*class="[^"]*(?:author|reviewer|name)[^"]*"[^>]*>([^<]+)</gi
    
    // Alternative: parse from markdown
    const lines = markdown.split('\n')
    let currentTestimonial: Partial<HouzzTestimonial> = {}
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      
      // Look for ratings (5 stars, etc.)
      const ratingMatch = line.match(/(\d)\s*(?:étoiles?|stars?|★)/i)
      if (ratingMatch) {
        if (currentTestimonial.text && currentTestimonial.name) {
          testimonials.push({
            name: currentTestimonial.name || 'Client',
            text: currentTestimonial.text || '',
            rating: currentTestimonial.rating || 5,
            date: currentTestimonial.date || '',
            projectType: currentTestimonial.projectType || 'Rénovation',
            role: currentTestimonial.role || 'Propriétaire',
            houzzUserUrl: currentTestimonial.houzzUserUrl || '',
          })
        }
        currentTestimonial = { rating: parseInt(ratingMatch[1]) }
      }
      
      // Look for dates
      const dateMatch = line.match(/(\d{1,2})\s*(janv|févr|mars|avr|mai|juin|juil|août|sept|oct|nov|déc)/i)
      if (dateMatch) {
        currentTestimonial.date = line
      }
      
      // Look for review text (longer lines)
      if (line.length > 50 && !line.startsWith('#') && !line.startsWith('[')) {
        currentTestimonial.text = line.substring(0, 1000)
      }
      
      // Look for names (shorter lines after review text)
      if (line.length > 3 && line.length < 50 && currentTestimonial.text && !currentTestimonial.name) {
        if (!line.includes('Houzz') && !line.includes('avis') && !line.match(/^\d/)) {
          currentTestimonial.name = line
        }
      }
    }
    
    // Add last testimonial
    if (currentTestimonial.text) {
      testimonials.push({
        name: currentTestimonial.name || 'Client',
        text: currentTestimonial.text || '',
        rating: currentTestimonial.rating || 5,
        date: currentTestimonial.date || '',
        projectType: currentTestimonial.projectType || 'Rénovation',
        role: currentTestimonial.role || 'Propriétaire',
        houzzUserUrl: currentTestimonial.houzzUserUrl || '',
      })
    }
    
    console.log(`Found ${testimonials.length} testimonials`)
    return testimonials
  } catch (error) {
    console.error('Error scraping testimonials:', error)
    return []
  }
}

// Known project URLs as fallback
const KNOWN_PROJECT_URLS = [
  'https://www.houzz.fr/hznb/projets/un-appartement-transforme-pour-mieux-louer-confort-et-dpe-ameliore-pj-vj~7739460',
  'https://www.houzz.fr/hznb/projets/reinventer-un-appartement-parisien-pour-des-clients-en-province-pj-vj~7738195',
  'https://www.houzz.fr/hznb/projets/au-gobelins-cet-ancien-f4-a-ete-entierement-reorchestre-pour-offrir-une-nouvel-pj-vj~7738188',
  'https://www.houzz.fr/hznb/projets/vous-voulez-ouvrir-deux-pieces-mais-zut-il-y-a-un-mur-porteur-pj-vj~7738106',
  'https://www.houzz.fr/hznb/projets/paris-19-de-l-ancien-au-contemporain-une-renovation-sur-mesure-pj-vj~7704321',
  'https://www.houzz.fr/hznb/projets/projet-la-muette-pj-vj~7738134',
  'https://www.houzz.fr/hznb/projets/vue-d-ensemble-d-une-renovation-complete-pj-vj~7738171',
  'https://www.houzz.fr/hznb/projets/renovation-maison-clamart-pj-vj~7738150',
  'https://www.houzz.fr/hznb/projets/une-salle-de-bain-xxl-pj-vj~3112605',
  'https://www.houzz.fr/hznb/projets/paris-13-pj-vj~4411193',
  'https://www.houzz.fr/hznb/projets/avant-apres-renovation-salle-de-bain-pj-vj~3112613',
  'https://www.houzz.fr/hznb/projets/parlons-de-votre-projet-pj-vj~3112601',
]

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const firecrawlApiKey = Deno.env.get('FIRECRAWL_API_KEY')
    if (!firecrawlApiKey) {
      console.error('FIRECRAWL_API_KEY not configured')
      return new Response(
        JSON.stringify({ success: false, error: 'Firecrawl API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { action, batchSize = 5, startIndex = 0 } = await req.json()

    const baseProfileUrl = 'https://www.houzz.fr/professionnels/artisan-et-entreprise-generale-de-batiment/qualirenovation-by-qualiconcept-pfvwfr-pf~1259357618'

    // ==================== DISCOVER PROJECTS ====================
    if (action === 'discover-projects') {
      console.log('Discovering project URLs...')
      
      // Clear existing queue
      await supabase.from('import_queue').delete().eq('type', 'project')
      
      // Try Map API first
      let projectUrls = await discoverProjectUrls(firecrawlApiKey, baseProfileUrl)
      
      // Fallback to profile scraping
      if (projectUrls.length === 0) {
        projectUrls = await scrapeProfileForProjects(firecrawlApiKey, `${baseProfileUrl}/projets`)
      }
      
      // Use known URLs as final fallback
      if (projectUrls.length === 0) {
        projectUrls = KNOWN_PROJECT_URLS
      }
      
      // Insert URLs into queue
      const queueRecords = projectUrls.map(url => ({
        url,
        type: 'project',
        status: 'pending',
        title: url.split('/').pop()?.replace(/pj-vj~\d+$/, '').replace(/-/g, ' ') || 'Projet',
      }))
      
      const { error: insertError } = await supabase
        .from('import_queue')
        .insert(queueRecords)
      
      if (insertError) {
        console.error('Error inserting queue:', insertError)
      }
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `Discovered ${projectUrls.length} projects`,
          discovered: projectUrls.length,
          urls: projectUrls.slice(0, 10), // Return first 10 for preview
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // ==================== IMPORT BATCH ====================
    if (action === 'import-batch') {
      console.log(`Importing batch of ${batchSize} projects starting at index ${startIndex}...`)
      
      // Get pending projects from queue
      const { data: pendingProjects, error: fetchError } = await supabase
        .from('import_queue')
        .select('*')
        .eq('type', 'project')
        .eq('status', 'pending')
        .order('created_at')
        .range(startIndex, startIndex + batchSize - 1)
      
      if (fetchError) {
        throw fetchError
      }
      
      if (!pendingProjects || pendingProjects.length === 0) {
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'No more projects to import',
            imported: 0,
            remaining: 0,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      let imported = 0
      let errors = 0
      
      for (const queueItem of pendingProjects) {
        try {
          // Mark as processing
          await supabase
            .from('import_queue')
            .update({ status: 'processing' })
            .eq('id', queueItem.id)
          
          // Scrape the project
          const { description, images, category, location } = await scrapeProjectPage(queueItem.url, firecrawlApiKey)
          
          // Extract title from URL
          const urlParts = queueItem.url.split('/')
          let lastPart = urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2]
          lastPart = lastPart.split('?')[0]
          
          const title = lastPart
            .replace(/pj-vj~\d+$/, '')
            .replace(/-/g, ' ')
            .trim()
          
          const slug = slugify(title) || `projet-${Date.now()}`
          
          // Check if project already exists
          const { data: existing } = await supabase
            .from('houzz_projects')
            .select('id')
            .eq('slug', slug)
            .maybeSingle()
          
          let projectId: string
          
          if (existing) {
            // Update existing project
            const { error: updateError } = await supabase
              .from('houzz_projects')
              .update({
                title: title.charAt(0).toUpperCase() + title.slice(1),
                description: description || 'Projet de rénovation réalisé par QualiRénovation.',
                location,
                category,
                image_count: images.length,
                houzz_url: queueItem.url,
              })
              .eq('id', existing.id)
            
            if (updateError) throw updateError
            projectId = existing.id
            
            // Delete old images
            await supabase
              .from('houzz_project_images')
              .delete()
              .eq('project_id', projectId)
          } else {
            // Insert new project
            const { data: newProject, error: insertError } = await supabase
              .from('houzz_projects')
              .insert({
                slug,
                title: title.charAt(0).toUpperCase() + title.slice(1),
                description: description || 'Projet de rénovation réalisé par QualiRénovation.',
                location,
                category,
                image_count: images.length,
                houzz_url: queueItem.url,
              })
              .select()
              .single()
            
            if (insertError) throw insertError
            projectId = newProject.id
          }
          
          // Insert images
          if (images.length > 0) {
            const imageRecords = images.map((url, index) => ({
              project_id: projectId,
              image_url: url,
              image_order: index,
            }))
            
            const { error: imagesError } = await supabase
              .from('houzz_project_images')
              .insert(imageRecords)
            
            if (imagesError) {
              console.error('Error inserting images:', imagesError)
            }
          }
          
          // Mark as completed
          await supabase
            .from('import_queue')
            .update({ status: 'completed', processed_at: new Date().toISOString() })
            .eq('id', queueItem.id)
          
          imported++
          console.log(`Imported: ${title} with ${images.length} images`)
          
          // Rate limiting
          await new Promise(resolve => setTimeout(resolve, 2000))
          
        } catch (error) {
          console.error(`Error importing ${queueItem.url}:`, error)
          
          await supabase
            .from('import_queue')
            .update({ 
              status: 'failed', 
              error_message: error instanceof Error ? error.message : 'Unknown error',
              processed_at: new Date().toISOString(),
            })
            .eq('id', queueItem.id)
          
          errors++
        }
      }
      
      // Get remaining count
      const { count: remaining } = await supabase
        .from('import_queue')
        .select('*', { count: 'exact', head: true })
        .eq('type', 'project')
        .eq('status', 'pending')
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `Imported ${imported} projects with ${errors} errors`,
          imported,
          errors,
          remaining: remaining || 0,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // ==================== IMPORT ALL PROJECTS (Original action) ====================
    if (action === 'import-projects') {
      console.log('Starting full projects import...')
      
      // Discover URLs
      let projectUrls = await discoverProjectUrls(firecrawlApiKey, baseProfileUrl)
      if (projectUrls.length === 0) {
        projectUrls = await scrapeProfileForProjects(firecrawlApiKey, `${baseProfileUrl}/projets`)
      }
      if (projectUrls.length === 0) {
        projectUrls = KNOWN_PROJECT_URLS
      }
      
      console.log(`Found ${projectUrls.length} project URLs to import`)
      
      let imported = 0
      let errors = 0
      const maxProjects = Math.min(projectUrls.length, 30) // Limit to avoid timeout
      
      for (let i = 0; i < maxProjects; i++) {
        const url = projectUrls[i]
        console.log(`Processing ${i + 1}/${maxProjects}: ${url}`)
        
        try {
          const { description, images, category, location } = await scrapeProjectPage(url, firecrawlApiKey)
          
          const urlParts = url.split('/')
          let lastPart = urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2]
          lastPart = lastPart.split('?')[0]
          
          const title = lastPart
            .replace(/pj-vj~\d+$/, '')
            .replace(/-/g, ' ')
            .trim()
          
          const slug = slugify(title) || `projet-${i + 1}`
          
          // Check if exists
          const { data: existing } = await supabase
            .from('houzz_projects')
            .select('id')
            .eq('slug', slug)
            .maybeSingle()
          
          let projectId: string
          
          if (existing) {
            const { error: updateError } = await supabase
              .from('houzz_projects')
              .update({
                title: title.charAt(0).toUpperCase() + title.slice(1),
                description: description || 'Projet de rénovation réalisé par QualiRénovation.',
                location,
                category,
                image_count: images.length,
                houzz_url: url,
              })
              .eq('id', existing.id)
            
            if (updateError) throw updateError
            projectId = existing.id
            
            await supabase
              .from('houzz_project_images')
              .delete()
              .eq('project_id', projectId)
          } else {
            const { data: newProject, error: insertError } = await supabase
              .from('houzz_projects')
              .insert({
                slug,
                title: title.charAt(0).toUpperCase() + title.slice(1),
                description: description || 'Projet de rénovation réalisé par QualiRénovation.',
                location,
                category,
                image_count: images.length,
                houzz_url: url,
              })
              .select()
              .single()
            
            if (insertError) throw insertError
            projectId = newProject.id
          }
          
          if (images.length > 0) {
            const imageRecords = images.map((imgUrl, index) => ({
              project_id: projectId,
              image_url: imgUrl,
              image_order: index,
            }))
            
            await supabase
              .from('houzz_project_images')
              .insert(imageRecords)
          }
          
          imported++
          
          // Rate limiting
          await new Promise(resolve => setTimeout(resolve, 2000))
          
        } catch (error) {
          console.error(`Error importing ${url}:`, error)
          errors++
        }
      }
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `Imported ${imported} projects with ${errors} errors`,
          imported,
          errors,
          total: maxProjects,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // ==================== IMPORT TESTIMONIALS ====================
    if (action === 'import-testimonials') {
      console.log('Starting testimonials import...')
      
      const testimonials = await scrapeTestimonials(firecrawlApiKey)
      
      let imported = 0
      let errors = 0
      
      for (const testimonial of testimonials) {
        try {
          const { error: insertError } = await supabase
            .from('houzz_testimonials')
            .insert({
              name: testimonial.name,
              text: testimonial.text,
              rating: testimonial.rating,
              date: testimonial.date,
              project_type: testimonial.projectType,
              role: testimonial.role,
              houzz_user_url: testimonial.houzzUserUrl,
            })
          
          if (insertError) {
            // Might be duplicate, try update
            console.log('Insert failed, might be duplicate:', insertError.message)
          } else {
            imported++
          }
        } catch (error) {
          console.error(`Error importing testimonial from ${testimonial.name}:`, error)
          errors++
        }
      }
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `Imported ${imported} testimonials with ${errors} errors`,
          imported,
          errors,
          total: testimonials.length,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // ==================== GET QUEUE STATUS ====================
    if (action === 'queue-status') {
      const { data: stats } = await supabase
        .from('import_queue')
        .select('status')
      
      const counts = {
        pending: 0,
        processing: 0,
        completed: 0,
        failed: 0,
      }
      
      if (stats) {
        for (const item of stats) {
          if (item.status in counts) {
            counts[item.status as keyof typeof counts]++
          }
        }
      }
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          ...counts,
          total: (stats?.length || 0),
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Invalid action. Use "discover-projects", "import-batch", "import-projects", "import-testimonials", or "queue-status"' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in import-houzz function:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
