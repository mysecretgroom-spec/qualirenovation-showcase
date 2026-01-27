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
    
    console.log('Searching Planizia for:', cleanRef, 'Brand:', brand, 'Color:', colorName);

    // Use Firecrawl Search API to find the product on Planizia
    const searchQuery = `site:planizia.fr ${cleanRef}`;
    
    const searchResponse = await fetch('https://api.firecrawl.dev/v1/search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: searchQuery,
        limit: 5,
        scrapeOptions: {
          formats: ['html', 'links'],
        },
      }),
    });

    const searchData = await searchResponse.json();

    if (!searchResponse.ok) {
      console.error('Firecrawl Search API error:', searchData);
      return new Response(
        JSON.stringify({ success: false, error: searchData.error || `Search failed with status ${searchResponse.status}` }),
        { status: searchResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Search results count:', searchData.data?.length || 0);

    let imageUrl = null;
    let productName = null;
    let productUrl = null;

    // Process search results to find the best match
    const results = searchData.data || [];
    
    for (const result of results) {
      const url = result.url || '';
      const html = result.html || '';
      
      // Prioritize fiche-materiau pages (product detail pages)
      if (url.includes('/fiche-materiau/')) {
        productUrl = url;
        
        // Extract product name from title or H1
        const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
        if (titleMatch) {
          productName = titleMatch[1].replace(/\s*[-|].*$/, '').trim();
        }
        
        // Look for main product image (not carre_ thumbnails)
        // Pattern 1: Background image in style
        const bgPattern = /background:\s*url\(['"]?(https:\/\/www\.planizia\.fr\/references\/[^'")\s]+\.jpg)['"]?\)/gi;
        const bgMatches = html.match(bgPattern);
        if (bgMatches) {
          for (const match of bgMatches) {
            const urlMatch = match.match(/url\(['"]?([^'")\s]+)['"]?\)/i);
            if (urlMatch && !urlMatch[1].includes('carre_')) {
              imageUrl = urlMatch[1];
              break;
            }
          }
        }
        
        // Pattern 2: img src with references
        if (!imageUrl) {
          const imgPattern = /src="(https:\/\/www\.planizia\.fr\/references\/[^"]+\.jpg)"/gi;
          const imgMatches = html.match(imgPattern);
          if (imgMatches) {
            for (const match of imgMatches) {
              const srcMatch = match.match(/src="([^"]+)"/i);
              if (srcMatch && !srcMatch[1].includes('carre_')) {
                imageUrl = srcMatch[1];
                break;
              }
            }
          }
        }
        
        if (imageUrl) break;
      }
    }

    // Fallback: if no fiche-materiau found, look in coloris pages
    if (!imageUrl) {
      for (const result of results) {
        const html = result.html || '';
        const url = result.url || '';
        
        // Look for carre_ images as fallback (these are small but better than nothing)
        const colorSlug = colorName.toLowerCase().replace(/\s+/g, '[-_]?');
        const carrePattern = new RegExp(
          `https://www\\.planizia\\.fr/references/carre_[^"'\\s]*\\.jpg`,
          'gi'
        );
        
        const carreMatches = html.match(carrePattern);
        if (carreMatches && carreMatches.length > 0) {
          // Try to find one that matches our color name
          for (const img of carreMatches) {
            const imgLower = img.toLowerCase();
            const colorWords = colorName.toLowerCase().split(/\s+/);
            if (colorWords.some((word: string) => word.length > 2 && imgLower.includes(word))) {
              imageUrl = img;
              if (!productUrl && url.includes('/fiche-materiau/')) {
                productUrl = url;
              }
              break;
            }
          }
          
          // If no specific match, take the first one
          if (!imageUrl) {
            imageUrl = carreMatches[0];
          }
        }
        
        if (imageUrl) break;
      }
    }

    // Try to find product URL if still missing
    if (!productUrl) {
      for (const result of results) {
        if (result.url?.includes('/fiche-materiau/')) {
          productUrl = result.url;
          break;
        }
      }
    }

    // Set product name if not found
    if (!productName) {
      productName = cleanRef;
    }

    console.log('Final results - Image URL:', imageUrl);
    console.log('Product name:', productName);
    console.log('Product URL:', productUrl);
    console.log('Brand:', brand);

    return new Response(
      JSON.stringify({ 
        success: true, 
        reference: cleanRef,
        imageUrl,
        productName,
        productUrl,
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