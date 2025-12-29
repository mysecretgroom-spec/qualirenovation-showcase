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
        onlyMainContent: true,
      }),
    })

    if (!response.ok) {
      console.error('Failed to scrape project page:', response.status)
      return { description: '', images: [] }
    }

    const data = await response.json()
    const html = data.data?.html || ''
    const markdown = data.data?.markdown || ''
    
    // Extract images from HTML
    const imageRegex = /https:\/\/st\.hzcdn\.com\/fimgs\/[a-zA-Z0-9_-]+-w\d+-h\d+-[^"'\s)]+\.(jpg|png|webp)/gi
    const rawImages = html.match(imageRegex) || []
    const images: string[] = [...new Set(rawImages)] as string[]
    
    // Get high-res versions of images
    const highResImages = images.map((img) => {
      // Convert to higher resolution
      return img.replace(/-w\d+-h\d+/, '-w1200-h800')
    })

    // Extract description from markdown
    let description = ''
    const lines = markdown.split('\n').filter((line: string) => line.trim())
    for (const line of lines) {
      if (line.length > 50 && !line.startsWith('#') && !line.startsWith('[') && !line.startsWith('!')) {
        description = line.trim()
        break
      }
    }

    console.log(`Found ${highResImages.length} images for project`)
    return { description, images: highResImages.slice(0, 50) } // Limit to 50 images per project
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
    // First, map the site to get all project URLs
    const mapResponse = await fetch('https://api.firecrawl.dev/v1/map', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: baseUrl,
        search: 'projets',
        limit: 200,
      }),
    })

    if (!mapResponse.ok) {
      console.error('Failed to map Houzz site:', mapResponse.status)
      return projects
    }

    const mapData = await mapResponse.json()
    const urls = mapData.links || []
    
    // Filter to only project URLs
    const projectUrls = urls.filter((url: string) => 
      url.includes('/hznb/projets/') || url.includes('/projects/')
    )

    console.log(`Found ${projectUrls.length} project URLs`)

    // Process each project URL
    for (let i = 0; i < Math.min(projectUrls.length, 120); i++) {
      const url = projectUrls[i]
      console.log(`Processing project ${i + 1}/${projectUrls.length}: ${url}`)
      
      // Extract project info from URL
      const urlParts = url.split('/')
      const lastPart = urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2]
      const title = lastPart
        .replace('pj-vj~', '')
        .replace(/-/g, ' ')
        .replace(/^\d+\s*/, '')
        .trim()
      
      const { description, images } = await scrapeProjectPage(url, apiKey)
      
      if (images.length > 0) {
        projects.push({
          title: title.charAt(0).toUpperCase() + title.slice(1),
          slug: slugify(title),
          description,
          location: 'Paris',
          category: 'Rénovation',
          imageCount: images.length,
          houzzUrl: url,
          images,
        })
      }
      
      // Rate limiting - wait 1 second between requests
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  } catch (error) {
    console.error('Error scraping projects list:', error)
  }

  return projects
}

async function scrapeTestimonials(apiKey: string): Promise<any[]> {
  console.log('Fetching testimonials from Houzz...')
  
  const testimonials: any[] = []
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
        onlyMainContent: true,
      }),
    })

    if (!response.ok) {
      console.error('Failed to scrape testimonials:', response.status)
      return testimonials
    }

    const data = await response.json()
    const markdown = data.data?.markdown || ''
    
    // Parse testimonials from markdown
    const lines = markdown.split('\n')
    let currentTestimonial: any = null
    
    for (const line of lines) {
      // Look for rating patterns
      if (line.includes('étoiles sur 5') || line.includes('stars')) {
        const ratingMatch = line.match(/(\d)\s*étoile/i)
        if (currentTestimonial && currentTestimonial.text) {
          testimonials.push(currentTestimonial)
        }
        currentTestimonial = {
          rating: ratingMatch ? parseInt(ratingMatch[1]) : 5,
          text: '',
          name: '',
          date: '',
        }
      }
      
      // Look for dates
      const dateMatch = line.match(/(\d{1,2}\s+\w+\s+20\d{2})/i)
      if (dateMatch && currentTestimonial) {
        currentTestimonial.date = dateMatch[1]
      }
      
      // Collect review text
      if (currentTestimonial && line.length > 30 && !line.includes('Houzz') && !line.startsWith('[')) {
        currentTestimonial.text += line + ' '
      }
    }
    
    if (currentTestimonial && currentTestimonial.text) {
      testimonials.push(currentTestimonial)
    }
    
    console.log(`Found ${testimonials.length} testimonials`)
  } catch (error) {
    console.error('Error scraping testimonials:', error)
  }

  return testimonials
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
    
    if (action === 'import-testimonials') {
      console.log('Starting testimonials import...')
      
      const testimonials = await scrapeTestimonials(firecrawlApiKey)
      
      let imported = 0
      for (const testimonial of testimonials) {
        if (testimonial.text && testimonial.text.length > 20) {
          const { error } = await supabase
            .from('houzz_testimonials')
            .insert({
              name: testimonial.name || 'Client satisfait',
              rating: testimonial.rating || 5,
              text: testimonial.text.trim().substring(0, 2000),
              date: testimonial.date,
              role: 'Rénovation',
            })
          
          if (!error) imported++
        }
      }
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `Imported ${imported} testimonials`,
          imported,
          total: testimonials.length
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Invalid action. Use "import-projects" or "import-testimonials"' }),
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
