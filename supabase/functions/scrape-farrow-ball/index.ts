const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Support both old format (colorNumber, colorName) and new format (colorReference)
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
    
    // Build search query - use the full reference
    const searchQuery = colorNumber ? `No.${colorNumber} ${colorName}`.trim() : colorName || cleanRef;
    
    console.log('Scraping Farrow & Ball:', searchQuery, 'Original:', colorReference);

    // Use search API instead of direct scrape for better results
    const response = await fetch('https://api.firecrawl.dev/v1/search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `site:farrow-ball.com ${searchQuery} couleur peinture`,
        limit: 5,
        scrapeOptions: {
          formats: ['html', 'links'],
        },
      }),
    });

    const searchData = await response.json();

    if (!response.ok) {
      console.error('Firecrawl API error:', searchData);
      return new Response(
        JSON.stringify({ success: false, error: searchData.error || `Request failed with status ${response.status}` }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Try to extract color swatch image URL from the scraped content
    let imageUrl = null;
    let hexColor = null;
    let foundColorNumber = colorNumber;
    let foundColorName = colorName;
    
    // Process search results
    const results = searchData.data || [];
    
    for (const result of results) {
      const html = result.html || '';
      const url = result.url || '';
      
      // Check if this is a color page
      if (url.includes('/couleur/') || url.includes('/colour/') || url.includes('/color/')) {
        // Look for Farrow & Ball color swatch images
        const imgPatterns = [
          // Pattern for F&B color swatch images
          /https:\/\/[^"'\s]*farrow-ball[^"'\s]*swatch[^"'\s]*\.(jpg|jpeg|png|webp)/gi,
          // Pattern for color images on CDN
          /https:\/\/[^"'\s]*cloudinary[^"'\s]*farrow[^"'\s]*\.(jpg|jpeg|png|webp)/gi,
          // Any F&B related image with color
          /https:\/\/[^"'\s]*f-?b(all)?[^"'\s]*color[^"'\s]*\.(jpg|jpeg|png|webp)/gi,
        ];
        
        for (const pattern of imgPatterns) {
          const matches = html.match(pattern);
          if (matches && matches.length > 0) {
            imageUrl = matches[0];
            break;
          }
        }

        // Try to extract hex color from the HTML
        const hexPatterns = [
          /background-color:\s*#([A-Fa-f0-9]{6})/gi,
          /background:\s*#([A-Fa-f0-9]{6})/gi,
          /data-color[^=]*=["']#?([A-Fa-f0-9]{6})["']/gi,
          /rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/gi,
        ];
        
        for (const pattern of hexPatterns) {
          const matches = html.match(pattern);
          if (matches && matches.length > 0) {
            const hexMatch = matches[0].match(/#([A-Fa-f0-9]{6})/i);
            if (hexMatch) {
              hexColor = `#${hexMatch[1].toUpperCase()}`;
              break;
            }
            // Handle RGB
            const rgbMatch = matches[0].match(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i);
            if (rgbMatch) {
              const r = parseInt(rgbMatch[1]).toString(16).padStart(2, '0');
              const g = parseInt(rgbMatch[2]).toString(16).padStart(2, '0');
              const b = parseInt(rgbMatch[3]).toString(16).padStart(2, '0');
              hexColor = `#${r}${g}${b}`.toUpperCase();
              break;
            }
          }
        }

        // Try to extract color name/number from page title or content
        if (!foundColorName || !foundColorNumber) {
          const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
          if (titleMatch) {
            const title = titleMatch[1];
            const numMatch = title.match(/No\.?\s*(\d+)/i);
            if (numMatch && !foundColorNumber) {
              foundColorNumber = numMatch[1];
            }
          }
        }

        if (imageUrl || hexColor) {
          break;
        }
      }
    }

    console.log('Found image URL:', imageUrl, 'Hex color:', hexColor);

    return new Response(
      JSON.stringify({ 
        success: true, 
        colorNumber: foundColorNumber,
        colorName: foundColorName || cleanRef,
        imageUrl,
        hexColor,
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
