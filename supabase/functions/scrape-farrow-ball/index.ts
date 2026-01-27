const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    let colorReference = body.colorReference;
    
    // Fallback to old format if colorReference not provided
    if (!colorReference) {
      const { colorNumber, colorName } = body;
      if (colorNumber && colorName) {
        colorReference = `${colorNumber} ${colorName}`;
      } else if (colorNumber) {
        colorReference = colorNumber;
      } else if (colorName) {
        colorReference = colorName;
      }
    }

    if (!colorReference) {
      return new Response(
        JSON.stringify({ success: false, error: 'Color reference is required' }),
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

    // Parse the reference to extract number and name
    const cleanRef = colorReference.trim();
    const match = cleanRef.match(/^(?:No\.?\s*)?(\d+)?\s*(.+)?$/i);
    const colorNumber = match?.[1] || '';
    const colorName = match?.[2]?.trim() || '';
    
    console.log('Searching for Farrow & Ball color:', { colorNumber, colorName, cleanRef });

    // Use Firecrawl search to find the color page on F&B site
    const searchQuery = colorNumber 
      ? `site:farrow-ball.com/fr No.${colorNumber} ${colorName}`.trim()
      : `site:farrow-ball.com/fr ${colorName || cleanRef}`;
    
    console.log('Search query:', searchQuery);

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
          formats: ['html'],
        },
      }),
    });

    const searchData = await searchResponse.json();
    const results = searchData.data || [];
    
    console.log('Search results count:', results.length);
    
    let imageUrl = null;
    let hexColor = null;
    let productUrl = null;
    let foundColorNumber = colorNumber;
    let foundColorName = colorName;

    // Find the best matching result (color page)
    for (const result of results) {
      const url = result.url || '';
      const html = result.html || '';
      
      // Skip non-color pages
      if (url.includes('/inspiration') || url.includes('/blog') || url.includes('/recherche')) {
        continue;
      }
      
      console.log('Checking result URL:', url);
      
      // Look for color swatch images in the HTML
      // F&B uses specific patterns for color swatches
      const imgPatterns = [
        // OG image (usually high quality color swatch)
        /property="og:image"\s+content="([^"]+)"/gi,
        /content="([^"]+)"\s+property="og:image"/gi,
        // Product images with color
        /(https:\/\/[^"'\s]*(?:swatch|colour|color|paint)[^"'\s]*\.(?:jpg|jpeg|png|webp))/gi,
        // CDN images
        /(https:\/\/[^"'\s]*media[^"'\s]*farrow[^"'\s]*\.(?:jpg|jpeg|png|webp))/gi,
        /(https:\/\/[^"'\s]*cdn[^"'\s]*\.(?:jpg|jpeg|png|webp))/gi,
      ];
      
      for (const pattern of imgPatterns) {
        let imgMatch;
        while ((imgMatch = pattern.exec(html)) !== null) {
          const potentialUrl = imgMatch[1];
          // Skip tiny icons and logos
          if (potentialUrl.includes('logo') || potentialUrl.includes('icon') || potentialUrl.includes('favicon')) {
            continue;
          }
          if (!imageUrl) {
            imageUrl = potentialUrl;
            console.log('Found image URL:', imageUrl);
          }
          break;
        }
        if (imageUrl) break;
      }

      // Extract hex color from CSS or meta tags
      const hexPatterns = [
        // Meta theme color
        /name="theme-color"\s+content="#([A-Fa-f0-9]{6})"/gi,
        /content="#([A-Fa-f0-9]{6})"\s+name="theme-color"/gi,
        // CSS background colors
        /background(?:-color)?\s*:\s*#([A-Fa-f0-9]{6})/gi,
        // Data attributes
        /data-(?:color|hex|bg)[^=]*=["']#?([A-Fa-f0-9]{6})["']/gi,
        // Inline styles
        /style="[^"]*(?:background|color)[^:]*:\s*#([A-Fa-f0-9]{6})/gi,
      ];
      
      for (const pattern of hexPatterns) {
        let hexMatch;
        while ((hexMatch = pattern.exec(html)) !== null) {
          const foundHex = hexMatch[1].toUpperCase();
          // Skip common neutral colors
          if (['FFFFFF', '000000', 'F5F5F5', 'EEEEEE', 'E5E5E5', 'CCCCCC'].includes(foundHex)) {
            continue;
          }
          if (!hexColor) {
            hexColor = `#${foundHex}`;
            console.log('Found hex color:', hexColor);
          }
          break;
        }
        if (hexColor) break;
      }

      // Extract title for color name if needed
      if (!foundColorName) {
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        if (titleMatch) {
          const title = titleMatch[1];
          const numMatch = title.match(/No\.?\s*(\d+)/i);
          const nameMatch = title.match(/No\.?\s*\d+\s+([A-Za-zÀ-ÿ\s]+)/i) || title.match(/^([A-Za-zÀ-ÿ\s]+)\s*[|–-]/i);
          if (numMatch && !foundColorNumber) {
            foundColorNumber = numMatch[1];
          }
          if (nameMatch) {
            foundColorName = nameMatch[1].trim().replace(/\s*[|–-].*$/, '');
          }
        }
      }

      // Save product URL
      if (!productUrl && (url.includes('/peinture/') || url.includes('/couleur'))) {
        productUrl = url;
      }

      // If we found both image and color, we're done
      if ((imageUrl || hexColor) && productUrl) {
        break;
      }
    }

    // If no image found but we have results, try to scrape the product page directly
    if (!imageUrl && productUrl) {
      console.log('Trying direct scrape of product page:', productUrl);
      
      const scrapeResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: productUrl,
          formats: ['html', 'screenshot'],
          waitFor: 3000,
        }),
      });

      const scrapeData = await scrapeResponse.json();
      const html = scrapeData.data?.html || '';
      
      // Try to find OG image first
      const ogMatch = html.match(/property="og:image"\s+content="([^"]+)"/i) || 
                      html.match(/content="([^"]+)"\s+property="og:image"/i);
      if (ogMatch) {
        imageUrl = ogMatch[1];
        console.log('Found OG image:', imageUrl);
      }
      
      // Use screenshot URL as fallback (not base64)
      if (!imageUrl && scrapeData.data?.screenshot) {
        // Firecrawl returns a URL to the screenshot, not base64
        imageUrl = scrapeData.data.screenshot;
        console.log('Using screenshot URL as image:', imageUrl);
      }
    }

    console.log('Final result:', { imageUrl: !!imageUrl, hexColor, productUrl });

    return new Response(
      JSON.stringify({ 
        success: true, 
        colorNumber: foundColorNumber,
        colorName: foundColorName || cleanRef,
        imageUrl,
        hexColor,
        productUrl,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error scraping Farrow & Ball:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to scrape';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
