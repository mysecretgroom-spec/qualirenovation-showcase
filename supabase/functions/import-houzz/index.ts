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

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .substring(0, 100)
}

async function scrapeProjectPage(url: string, apiKey: string): Promise<{ description: string, images: string[] }> {
  console.log('Scraping project page:', url)
  
  try {
    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        formats: ['markdown', 'html'],
        onlyMainContent: false,
      }),
    })

    if (!response.ok) {
      console.error('Failed to scrape project page:', response.status)
      return { description: '', images: [] }
    }

    const data = await response.json()
    const html = data.data?.html || ''
    const markdown = data.data?.markdown || ''
    
    // Extract images from HTML - look for high-res Houzz CDN images
    const imagePatterns = [
      /https:\/\/st\.hzcdn\.com\/fimgs\/[a-zA-Z0-9_-]+[^"'\s<>)]+\.(jpg|jpeg|png|webp)/gi,
      /https:\/\/st\.hzcdn\.com\/simgs\/[a-zA-Z0-9_-]+[^"'\s<>)]+\.(jpg|jpeg|png|webp)/gi,
    ]
    
    let allImages: string[] = []
    for (const pattern of imagePatterns) {
      const matches = html.match(pattern) || []
      allImages = [...allImages, ...matches]
    }
    
    // Deduplicate and filter
    const uniqueImages = [...new Set(allImages)]
      .filter(img => !img.includes('-w40-') && !img.includes('-w80-') && !img.includes('-w48-'))
      .map(img => {
        // Try to get higher resolution version
        return img.replace(/-w\d+-h\d+/, '-w1200-h900')
      })

    // Extract description from markdown
    let description = ''
    const lines = markdown.split('\n').filter((line: string) => line.trim())
    for (const line of lines) {
      if (line.length > 80 && !line.startsWith('#') && !line.startsWith('[') && !line.startsWith('!') && !line.includes('Houzz')) {
        description = line.trim().substring(0, 1000)
        break
      }
    }

    console.log(`Found ${uniqueImages.length} images for project`)
    return { description, images: uniqueImages.slice(0, 50) }
  } catch (error) {
    console.error('Error scraping project page:', error)
    return { description: '', images: [] }
  }
}

async function scrapeProjectsList(apiKey: string): Promise<HouzzProject[]> {
  console.log('Fetching projects list from Houzz...')
  
  const projects: HouzzProject[] = []
  const baseUrl = 'https://www.houzz.fr/professionnels/artisan-et-entreprise-generale-de-batiment/qualirenovation-by-qualiconcept-pfvwfr-pf~1259357618/projets'
  
  try {
    // Scrape the projects page to get all project links
    console.log('Scraping main projects page...')
    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: baseUrl,
        formats: ['html', 'links'],
        onlyMainContent: false,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Failed to scrape projects page:', response.status, errorText)
      return projects
    }

    const data = await response.json()
    const html = data.data?.html || ''
    const links = data.data?.links || []
    
    console.log(`Got ${links.length} links from page`)
    
    // Extract project URLs from links
    let projectUrls: string[] = links.filter((link: string) => 
      link.includes('/hznb/projets/') || link.includes('pj-vj~')
    )
    
    // Also try to extract from HTML directly
    const projectUrlPattern = /https:\/\/www\.houzz\.fr\/hznb\/projets\/[^"'\s<>]+/gi
    const htmlProjectUrls = html.match(projectUrlPattern) || []
    projectUrls = [...new Set([...projectUrls, ...htmlProjectUrls])]
    
    console.log(`Found ${projectUrls.length} project URLs`)

    // If still no projects, try crawling
    if (projectUrls.length === 0) {
      console.log('Trying crawl approach...')
      const crawlResponse = await fetch('https://api.firecrawl.dev/v1/crawl', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: baseUrl,
          limit: 50,
          maxDepth: 2,
          includePaths: ['/hznb/projets/', '/projets/'],
          scrapeOptions: {
            formats: ['links'],
          },
        }),
      })
      
      if (crawlResponse.ok) {
        const crawlData = await crawlResponse.json()
        console.log('Crawl response:', JSON.stringify(crawlData).substring(0, 500))
        
        // The crawl is async, we get a job ID
        if (crawlData.id) {
          console.log('Crawl job started:', crawlData.id)
          // For now, we'll use the known project URLs from the Houzz page we scraped earlier
        }
      }
    }

    // If we still have no URLs, use the known projects from the profile
    if (projectUrls.length === 0) {
      console.log('Using known project URLs...')
      projectUrls = [
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
    }

    // Process each project URL (limit to avoid timeout)
    const maxProjects = Math.min(projectUrls.length, 20)
    for (let i = 0; i < maxProjects; i++) {
      const url = projectUrls[i]
      console.log(`Processing project ${i + 1}/${maxProjects}: ${url}`)
      
      // Extract project info from URL
      const urlParts = url.split('/')
      let lastPart = urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2]
      lastPart = lastPart.split('?')[0] // Remove query params
      
      const title = lastPart
        .replace(/pj-vj~\d+$/, '')
        .replace(/-/g, ' ')
        .trim()
      
      const { description, images } = await scrapeProjectPage(url, apiKey)
      
      const project: HouzzProject = {
        title: title.charAt(0).toUpperCase() + title.slice(1) || 'Projet de rénovation',
        slug: slugify(title) || `projet-${i + 1}`,
        description: description || 'Projet de rénovation réalisé par QualiRénovation.',
        location: 'Paris',
        category: 'Rénovation',
        imageCount: images.length,
        houzzUrl: url,
        images,
      }
      
      if (images.length > 0 || description) {
        projects.push(project)
        console.log(`Added project: ${project.title} with ${images.length} images`)
      }
      
      // Rate limiting - wait between requests
      await new Promise(resolve => setTimeout(resolve, 1500))
    }
  } catch (error) {
    console.error('Error scraping projects list:', error)
  }

  console.log(`Total projects scraped: ${projects.length}`)
  return projects
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

    const { action } = await req.json()

    if (action === 'import-projects') {
      console.log('Starting projects import...')
      
      const projects = await scrapeProjectsList(firecrawlApiKey)
      console.log(`Scraped ${projects.length} projects`)
      
      let imported = 0
      let errors = 0
      
      for (const project of projects) {
        try {
          // Check if project already exists
          const { data: existing } = await supabase
            .from('houzz_projects')
            .select('id')
            .eq('slug', project.slug)
            .single()
          
          let projectId: string
          
          if (existing) {
            // Update existing project
            const { error: updateError } = await supabase
              .from('houzz_projects')
              .update({
                title: project.title,
                description: project.description,
                location: project.location,
                category: project.category,
                image_count: project.imageCount,
                houzz_url: project.houzzUrl,
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
                slug: project.slug,
                title: project.title,
                description: project.description,
                location: project.location,
                category: project.category,
                image_count: project.imageCount,
                houzz_url: project.houzzUrl,
              })
              .select()
              .single()
            
            if (insertError) throw insertError
            projectId = newProject.id
          }
          
          // Insert images
          if (project.images.length > 0) {
            const imageRecords = project.images.map((url, index) => ({
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
          
          imported++
          console.log(`Imported project: ${project.title}`)
        } catch (error) {
          console.error(`Error importing project ${project.title}:`, error)
          errors++
        }
      }
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `Imported ${imported} projects with ${errors} errors`,
          imported,
          errors,
          total: projects.length
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Invalid action. Use "import-projects"' }),
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
