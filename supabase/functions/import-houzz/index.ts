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

// ============ HOUZZ INTERNAL API APPROACH ============
// Use multiple discovery methods including Map API and direct pattern matching

async function discoverAllProjectsViaMap(apiKey: string, profileUrl: string): Promise<string[]> {
  console.log('Using Firecrawl Map API to discover ALL project URLs...')
  
  const allUrls: string[] = []
  
  try {
    // Map the professional profile page - this should discover all linked project URLs
    const mapResponse = await fetch('https://api.firecrawl.dev/v1/map', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: profileUrl,
        search: 'projets',
        limit: 500,
        includeSubdomains: false,
      }),
    })

    if (mapResponse.ok) {
      const mapData = await mapResponse.json()
      console.log('Map API response:', JSON.stringify(mapData).substring(0, 500))
      
      const links = mapData.links || mapData.data?.links || []
      console.log(`Map found ${links.length} total links`)
      
      for (const link of links) {
        const url = typeof link === 'string' ? link : link.url
        if (url && url.includes('/hznb/projets/') && url.includes('pj-vj~')) {
          allUrls.push(url)
        }
      }
    } else {
      console.error('Map API failed:', mapResponse.status, await mapResponse.text())
    }
  } catch (error) {
    console.error('Map API error:', error)
  }
  
  console.log(`Map discovered ${allUrls.length} project URLs`)
  return allUrls
}

// Scrape project page with multiple image extraction strategies
async function scrapeProjectPage(url: string, apiKey: string): Promise<{ 
  description: string, 
  images: string[], 
  category: string, 
  location: string, 
  year: string 
}> {
  console.log('Scraping project page:', url)
  
  try {
    // Strategy 1: Get full HTML with long wait time
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
        waitFor: 8000, // Wait 8 seconds for all images to load
      }),
    })

    if (!response.ok) {
      console.error('Failed to scrape project page:', response.status)
      return { description: '', images: [], category: 'Rénovation', location: 'Paris', year: '' }
    }

    const data = await response.json()
    const html = data.data?.html || ''
    const markdown = data.data?.markdown || ''
    const links = data.data?.links || []
    
    console.log(`Got HTML: ${html.length} chars, Markdown: ${markdown.length} chars, Links: ${links.length}`)
    
    // ============ MULTI-STRATEGY IMAGE EXTRACTION ============
    const imageUrls = new Set<string>()
    
    // Pattern 1: Standard Houzz image URLs from fimgs
    const fimsPattern = /https:\/\/st\.hzcdn\.com\/fimgs\/[a-f0-9]+_\d+[^"'\s<>)]+/gi
    const fimsMatches = (html + markdown).match(fimsPattern) || []
    fimsMatches.forEach((url: string) => imageUrls.add(url))
    
    // Pattern 2: simgs pattern (another Houzz image format)
    const simgsPattern = /https:\/\/st\.hzcdn\.com\/simgs\/[a-f0-9]+[^"'\s<>)]+/gi
    const simgsMatches = (html + markdown).match(simgsPattern) || []
    simgsMatches.forEach((url: string) => imageUrls.add(url))
    
    // Pattern 3: Look for data-src or srcset attributes with hzcdn URLs
    const dataSrcPattern = /(?:data-src|srcset)=["']([^"']*st\.hzcdn\.com[^"'\s,]+)/gi
    let match
    while ((match = dataSrcPattern.exec(html)) !== null) {
      const imgUrl = match[1]
      if (imgUrl.includes('fimgs') || imgUrl.includes('simgs')) {
        imageUrls.add(imgUrl)
      }
    }
    
    // Pattern 4: Check links array for image URLs
    for (const link of links) {
      const linkUrl = typeof link === 'string' ? link : link.url || link.href
      if (linkUrl && linkUrl.includes('st.hzcdn.com') && (linkUrl.includes('fimgs') || linkUrl.includes('simgs'))) {
        imageUrls.add(linkUrl)
      }
    }
    
    // Pattern 5: Extract from picture and img elements
    const imgSrcPattern = /<img[^>]+src=["']([^"']+st\.hzcdn\.com[^"']+)["']/gi
    while ((match = imgSrcPattern.exec(html)) !== null) {
      imageUrls.add(match[1])
    }
    
    console.log(`Raw image matches: ${imageUrls.size}`)
    
    // Process and deduplicate by hash
    const seenHashes = new Map<string, string>()
    
    for (const imgUrl of imageUrls) {
      // Skip tiny thumbnails (navigation, avatars)
      if (/-w(?:40|48|60|80|100)-/.test(imgUrl)) continue
      if (/w40-h40|w48-h48|w80-h80/.test(imgUrl)) continue
      
      // Extract unique hash
      const hashMatch = imgUrl.match(/(?:fimgs|simgs)\/([a-f0-9]+(?:_\d+)?)/i)
      if (hashMatch) {
        const hash = hashMatch[1]
        if (!seenHashes.has(hash)) {
          // Convert to high resolution
          let hdUrl = imgUrl
            .replace(/-w\d+-h\d+/, '-w1920-h1440')
            .replace(/\?.*$/, '') // Remove query params
          
          // Ensure it's a proper HD image
          if (!hdUrl.includes('-w1920')) {
            hdUrl = hdUrl.replace(/\.jpg/i, '-w1920-h1440.jpg')
          }
          
          seenHashes.set(hash, hdUrl)
        }
      }
    }
    
    const uniqueImages = Array.from(seenHashes.values()).slice(0, 50)
    console.log(`Found ${uniqueImages.length} unique HD images`)
    
    // ============ EXTRACT DESCRIPTION ============
    let description = ''
    const lines = markdown.split('\n').map((l: string) => l.trim()).filter((l: string) => l.length > 0)
    
    let contentStarted = false
    const descriptionLines: string[] = []
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      
      // Skip navigation and UI elements
      if (line.includes('Passer au contenu') || line.includes('Page d\'accueil')) continue
      if (line.includes('Se connecter') || line.includes('S\'inscrire')) continue
      if (line.startsWith('[') && line.includes('Photos')) continue
      if (line.startsWith('[') && line.includes('Magazine')) continue
      if (line.startsWith('![') && line.includes('Logo')) continue
      if (line.includes('Charger plus') || line.includes('Afficher')) continue
      
      // Start capturing after project title patterns
      if (!contentStarted) {
        if (line.match(/^PROJET\s/i) || line.match(/^#+ /)) {
          contentStarted = true
        }
        if (line.startsWith('Dans ') || line.startsWith('Ce ') || line.startsWith('Notre ') || line.startsWith('Projet ')) {
          contentStarted = true
        }
        if (line.startsWith('Rénovation') || line.startsWith('Transformation')) {
          contentStarted = true
        }
      }
      
      if (contentStarted) {
        // Stop markers
        if (line === 'Lire plus' || line === 'Partager le projet') break
        if (line.startsWith('Année du projet')) break
        if (line.includes('Best of Houzz')) break
        
        // Skip links and small images
        if (line.startsWith('[') && line.includes('](http')) continue
        if (line.startsWith('![') && line.includes('-w40-')) continue
        
        // Add substantial content
        if (line.length > 30) {
          descriptionLines.push(line)
          if (descriptionLines.join(' ').length > 1500) break
        }
      }
    }
    
    description = descriptionLines.join('\n\n').substring(0, 2000)
    
    // ============ EXTRACT METADATA ============
    let year = ''
    let location = 'Paris'
    
    const yearMatch = markdown.match(/Année du projet\s*[:\s]*(\d{4})/i) || 
                      markdown.match(/(\d{4})\s*$/m)
    if (yearMatch) year = yearMatch[1]
    
    const postalMatch = markdown.match(/Code postal\s*[:\s]*(\d{5})/i) ||
                        markdown.match(/(\d{5})\s*Paris/i)
    if (postalMatch) {
      const postal = postalMatch[1]
      if (postal.startsWith('75')) {
        const arr = parseInt(postal.substring(3), 10)
        location = `Paris ${arr}e`
      }
    }
    
    if (location === 'Paris') {
      location = extractLocation(markdown)
    }
    
    const category = extractCategory(url, description || markdown)

    return { 
      description: description || 'Projet de rénovation réalisé par QualiRénovation.', 
      images: uniqueImages, 
      category, 
      location,
      year,
    }
  } catch (error) {
    console.error('Error scraping project page:', error)
    return { description: '', images: [], category: 'Rénovation', location: 'Paris', year: '' }
  }
}

// Scrape profile page with pagination to get ALL project URLs
async function scrapeProfileWithPagination(apiKey: string, profileUrl: string): Promise<string[]> {
  console.log('Scraping profile page for all projects...')
  
  const allProjectUrls: string[] = []
  
  // Scrape the main projects page
  try {
    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: `${profileUrl}/projets`,
        formats: ['html', 'links'],
        onlyMainContent: false,
        waitFor: 10000, // Wait 10 seconds for JavaScript to load
      }),
    })

    if (response.ok) {
      const data = await response.json()
      const html = data.data?.html || ''
      const links = data.data?.links || []
      
      console.log(`Profile page: HTML ${html.length} chars, ${links.length} links`)
      
      // Extract from links array
      for (const link of links) {
        const url = typeof link === 'string' ? link : link.url || link.href
        if (url && url.includes('/hznb/projets/') && url.includes('pj-vj~')) {
          allProjectUrls.push(url)
        }
      }
      
      // Also extract from HTML using multiple patterns
      const patterns = [
        /https:\/\/www\.houzz\.fr\/hznb\/projets\/[^"'\s<>]+pj-vj~\d+/gi,
        /href=["']([^"']*\/hznb\/projets\/[^"']*pj-vj~\d+)/gi,
        /data-href=["']([^"']*projets[^"']*pj-vj~\d+)/gi,
      ]
      
      for (const pattern of patterns) {
        const matches = html.matchAll(pattern)
        for (const match of matches) {
          let url = match[1] || match[0]
          if (!url.startsWith('http')) {
            url = `https://www.houzz.fr${url.startsWith('/') ? '' : '/'}${url}`
          }
          if (url.includes('pj-vj~')) {
            allProjectUrls.push(url)
          }
        }
      }
    }
  } catch (error) {
    console.error('Error scraping profile:', error)
  }
  
  // Deduplicate
  const uniqueUrls = [...new Set(allProjectUrls)]
  console.log(`Profile scrape found ${uniqueUrls.length} project URLs`)
  
  return uniqueUrls
}

// Use Search API to find projects
async function searchForProjects(apiKey: string): Promise<string[]> {
  console.log('Searching for QualiRenovation projects...')
  
  const projectUrls: string[] = []
  
  try {
    // Multiple search queries to cover more projects
    const queries = [
      'site:houzz.fr qualirenovation projets',
      'site:houzz.fr "qualirenovation" "pj-vj"',
      'site:houzz.fr qualirenovation rénovation',
    ]
    
    for (const query of queries) {
      const searchResponse = await fetch('https://api.firecrawl.dev/v1/search', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          limit: 50,
        }),
      })
      
      if (searchResponse.ok) {
        const searchData = await searchResponse.json()
        const results = searchData.data || searchData.results || []
        
        for (const result of results) {
          const url = result.url || result.link
          if (url && url.includes('/hznb/projets/') && url.includes('pj-vj~')) {
            projectUrls.push(url)
          }
        }
      }
      
      // Small delay between searches
      await new Promise(r => setTimeout(r, 500))
    }
  } catch (error) {
    console.error('Search error:', error)
  }
  
  const uniqueUrls = [...new Set(projectUrls)]
  console.log(`Search found ${uniqueUrls.length} project URLs`)
  
  return uniqueUrls
}

// Main discovery function combining all methods
async function discoverAllProjects(apiKey: string, profileUrl: string): Promise<string[]> {
  console.log('Starting comprehensive project discovery...')
  
  const allUrls: string[] = []
  
  // Method 1: Map API
  const mapUrls = await discoverAllProjectsViaMap(apiKey, profileUrl)
  allUrls.push(...mapUrls)
  
  // Method 2: Profile scraping with wait
  const profileUrls = await scrapeProfileWithPagination(apiKey, profileUrl)
  allUrls.push(...profileUrls)
  
  // Method 3: Search API
  const searchUrls = await searchForProjects(apiKey)
  allUrls.push(...searchUrls)
  
  // Deduplicate
  const uniqueUrls = [...new Set(allUrls)]
  console.log(`Total discovered: ${uniqueUrls.length} unique project URLs`)
  
  return uniqueUrls
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
        formats: ['markdown'],
        onlyMainContent: false,
        waitFor: 5000,
      }),
    })

    if (!response.ok) {
      console.error('Failed to scrape testimonials:', response.status)
      return []
    }

    const data = await response.json()
    const markdown = data.data?.markdown || ''
    
    const testimonials: HouzzTestimonial[] = []
    
    // Parse testimonials from markdown
    const lines = markdown.split('\n')
    let currentTestimonial: Partial<HouzzTestimonial> = {}
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      
      // Look for ratings
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
      const dateMatch = line.match(/(\d{1,2})\s*(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s*(\d{4})/i)
      if (dateMatch) {
        currentTestimonial.date = line
      }
      
      // Look for review text
      if (line.length > 50 && !line.startsWith('#') && !line.startsWith('[')) {
        currentTestimonial.text = line.substring(0, 1000)
      }
      
      // Look for names
      if (line.length > 3 && line.length < 50 && currentTestimonial.text && !currentTestimonial.name) {
        if (!line.includes('Houzz') && !line.includes('avis') && !line.match(/^\d/)) {
          currentTestimonial.name = line
        }
      }
    }
    
    // Add last testimonial
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
    
    console.log(`Found ${testimonials.length} testimonials`)
    return testimonials
  } catch (error) {
    console.error('Error scraping testimonials:', error)
    return []
  }
}

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
      console.log('Discovering project URLs using all methods...')
      
      // Clear existing queue
      await supabase.from('import_queue').delete().eq('type', 'project')
      
      // Discover all projects
      const projectUrls = await discoverAllProjects(firecrawlApiKey, baseProfileUrl)
      
      console.log(`Total unique project URLs: ${projectUrls.length}`)
      
      // Insert URLs into queue
      const queueRecords = projectUrls.map(url => ({
        url,
        type: 'project',
        status: 'pending',
        title: url.split('/').pop()?.replace(/pj-vj~\d+$/, '').replace(/-/g, ' ') || 'Projet',
      }))
      
      if (queueRecords.length > 0) {
        const { error: insertError } = await supabase
          .from('import_queue')
          .insert(queueRecords)
        
        if (insertError) {
          console.error('Error inserting queue:', insertError)
        }
      }
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `Discovered ${projectUrls.length} projects`,
          discovered: projectUrls.length,
          urls: projectUrls.slice(0, 20),
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // ==================== IMPORT BATCH ====================
    if (action === 'import-batch') {
      console.log(`Importing batch of ${batchSize} projects...`)
      
      // Get pending projects from queue
      const { data: pendingProjects, error: fetchError } = await supabase
        .from('import_queue')
        .select('*')
        .eq('type', 'project')
        .eq('status', 'pending')
        .order('created_at')
        .limit(batchSize)
      
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
          const { description, images, category, location, year } = await scrapeProjectPage(queueItem.url, firecrawlApiKey)
          
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
                year: year || null,
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
                year: year || null,
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
      JSON.stringify({ success: false, error: 'Invalid action. Use "discover-projects", "import-batch", "import-testimonials", or "queue-status"' }),
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
