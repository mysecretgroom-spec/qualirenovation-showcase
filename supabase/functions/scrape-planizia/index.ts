const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { reference } = await req.json();

    if (!reference) {
      return new Response(
        JSON.stringify({ success: false, error: 'Reference is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!apiKey) {
      console.error('FIRECRAWL_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'Firecrawl connector not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Clean the reference - expected format: "Silestone Persian white"
    const cleanRef = reference.trim();
    
    // Extract brand and color name
    const brandMatch = cleanRef.match(/^(Silestone|Dekton|Neolith|Lapitec|Caesarstone|Ceraplak|Iquox|Granit|Zhennia)\s+(.+)$/i);
    const brand = brandMatch ? brandMatch[1] : null;
    const colorName = brandMatch ? brandMatch[2] : cleanRef;
    
    // Create slug for the product URL - Planizia uses format: /fiche-materiau/{color-slug}/
    // Convert color name to slug (lowercase, replace spaces with hyphens)
    const colorSlug = colorName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    // Try the direct product page first
    const productUrl = `https://www.planizia.fr/fiche-materiau/${colorSlug}/`;
    
    console.log('Scraping Planizia reference:', cleanRef, 'URL:', productUrl);

    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: productUrl,
        formats: ['html', 'links'],
        waitFor: 2000,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Firecrawl API error:', data);
      return new Response(
        JSON.stringify({ success: false, error: data.error || `Request failed with status ${response.status}` }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let imageUrl = null;
    let productName = null;
    let finalProductUrl: string | null = productUrl;
    const html = data.data?.html || data.html || '';
    
    console.log('HTML length:', html.length);
    
    // Check if page not found or no proper product image
    const hasMainProductImage = html.includes(`references/${colorSlug}`) || 
                                html.match(new RegExp(`references/[^"']*${colorSlug.replace(/-/g, '[-_]?')}`, 'i'));
    
    if (html.includes('Page introuvable') || html.includes('n\'avons pas trouvé') || !hasMainProductImage) {
      console.log('Page not found or no main image, trying coloris page');
      
      // Search in the coloris listing page
      const searchUrl = `https://www.planizia.fr/coloris/`;
      
      const searchResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: searchUrl,
          formats: ['html'],
          waitFor: 3000,
        }),
      });
      
      const searchData = await searchResponse.json();
      const searchHtml = searchData.data?.html || searchData.html || '';
      
      console.log('Coloris page HTML length:', searchHtml.length);
      
      // Look for product in the list - pattern: carre_{colorname}_-_{id}.jpg
      // Convert color name to a flexible regex pattern
      const colorParts = colorName.toLowerCase().split(/\s+/);
      
      // Try each word of the color name
      for (const part of colorParts) {
        if (part.length < 3) continue; // Skip short words
        
        const partPattern = new RegExp(
          `https://www\\.planizia\\.fr/references/carre_[^"'\\s]*${part}[^"'\\s]*\\.jpg`,
          'gi'
        );
        
        const matches = searchHtml.match(partPattern);
        if (matches && matches.length > 0) {
          imageUrl = matches[0];
          console.log('Found image via coloris search for part:', part, imageUrl);
          break;
        }
      }
      
      // Also look for product link
      for (const part of colorParts) {
        if (part.length < 3) continue;
        
        const linkPattern = new RegExp(
          `href="(https://www\\.planizia\\.fr/fiche-materiau/[^"]*${part}[^"]*)"`,
          'gi'
        );
        const linkMatch = linkPattern.exec(searchHtml);
        if (linkMatch) {
          finalProductUrl = linkMatch[1];
          break;
        }
      }
      
      // If still no image, try background-url pattern
      if (!imageUrl) {
        for (const part of colorParts) {
          if (part.length < 3) continue;
          
          const bgPattern = new RegExp(
            `background:\\s*url\\(['"]?(https://www\\.planizia\\.fr/references/[^'"\\)\\s]*${part}[^'"\\)\\s]*\\.jpg)['"]?\\)`,
            'gi'
          );
          const bgMatches = searchHtml.match(bgPattern);
          if (bgMatches && bgMatches.length > 0) {
            const urlMatch = bgMatches[0].match(/url\(['"]?([^'")\s]+)['"]?\)/i);
            if (urlMatch) {
              imageUrl = urlMatch[1];
              console.log('Found image via bg-url for part:', part, imageUrl);
              break;
            }
          }
        }
      }
    } else {
      // We have a valid product page with images
      // Extract product name from H1
      const titleMatch = html.match(/<h1[^>]*class="titreFicheProd"[^>]*>([^<]+)<\/h1>/i);
      if (titleMatch) {
        productName = titleMatch[1].trim();
      }
      
      // Look for product image in the page
      // Pattern 0: Background image in HTML comment (most reliable)
      const commentPattern = /<!--[^>]*background:\s*url\(['"]?(https:\/\/www\.planizia\.fr\/references\/[^'")\s]+\.jpg)['"]?\)/gi;
      const commentMatches = html.match(commentPattern);
      if (commentMatches && commentMatches.length > 0) {
        const urlMatch = commentMatches[0].match(/url\(['"]?([^'")\s]+)['"]?\)/i);
        if (urlMatch) {
          imageUrl = urlMatch[1];
        }
      }
      
      // Pattern 1: Background image in style (skip carre_ which are related products)
      if (!imageUrl) {
        const bgPattern = /background:\s*url\(['"]?(https:\/\/www\.planizia\.fr\/references\/[^'")\s]+\.jpg)['"]?\)/gi;
        const bgMatches = html.match(bgPattern);
        if (bgMatches && bgMatches.length > 0) {
          for (const match of bgMatches) {
            const urlMatch = match.match(/url\(['"]?([^'")\s]+)['"]?\)/i);
            if (urlMatch && !urlMatch[1].includes('carre_')) {
              imageUrl = urlMatch[1];
              break;
            }
          }
        }
      }
      
      // Pattern 2: img src with references that matches the color
      if (!imageUrl) {
        const colorSlugForImg = colorName.toLowerCase().replace(/\s+/g, '[-_]?');
        const specificImgPattern = new RegExp(
          `src="(https://www\\.planizia\\.fr/references/[^"]*${colorSlugForImg}[^"]*\\.jpg)"`,
          'gi'
        );
        const specificMatches = html.match(specificImgPattern);
        if (specificMatches && specificMatches.length > 0) {
          const srcMatch = specificMatches[0].match(/src="([^"]+)"/i);
          if (srcMatch) {
            imageUrl = srcMatch[1];
          }
        }
      }
    }

    // Set product name if not found
    if (!productName) {
      productName = cleanRef;
    }

    console.log('Found image URL:', imageUrl);
    console.log('Found product name:', productName);
    console.log('Found product URL:', finalProductUrl);
    console.log('Found brand:', brand);

    return new Response(
      JSON.stringify({ 
        success: true, 
        reference: cleanRef,
        imageUrl,
        productName,
        productUrl: finalProductUrl,
        brand,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error scraping Planizia:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to scrape';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
