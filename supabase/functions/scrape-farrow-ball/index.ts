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
    
    // Build the direct URL to the Farrow & Ball color page
    // F&B uses slug format like "hague-blue" or "no-311-scallop"
    let colorSlug = '';
    if (colorNumber && colorName) {
      colorSlug = `no-${colorNumber}-${colorName.toLowerCase().replace(/\s+/g, '-')}`;
    } else if (colorName) {
      colorSlug = colorName.toLowerCase().replace(/\s+/g, '-');
    } else if (colorNumber) {
      colorSlug = `no-${colorNumber}`;
    }
    
    // Try the French version of the site first
    const directUrl = `https://www.farrow-ball.com/fr/peinture/couleurs-de-peinture/${colorSlug}`;
    
    console.log('Trying direct URL for Farrow & Ball:', directUrl);

    // First, try to scrape the direct URL
    const directResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: directUrl,
        formats: ['html'],
        waitFor: 2000,
      }),
    });

    const directData = await directResponse.json();
    let html = directData.data?.html || directData.html || '';
    let productUrl = directUrl;
    
    console.log('Direct scrape HTML length:', html.length);
    
    // Check if it's a 404 or redirect page - if so, try search
    const is404 = html.includes('404') || html.includes('Page introuvable') || 
                  html.includes('page not found') || html.length < 5000;
    
    if (is404 || !directResponse.ok) {
      console.log('Direct URL failed, trying search...');
      
      // Fallback to search
      const searchQuery = colorNumber ? `No.${colorNumber} ${colorName}`.trim() : colorName || cleanRef;
      
      const searchResponse = await fetch('https://api.firecrawl.dev/v1/search', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `site:farrow-ball.com/fr ${searchQuery}`,
          limit: 3,
          scrapeOptions: {
            formats: ['html'],
          },
        }),
      });

      const searchData = await searchResponse.json();
      const results = searchData.data || [];
      
      console.log('Search results count:', results.length);
      
      // Find the best matching result
      for (const result of results) {
        const url = result.url || '';
        if (url.includes('/couleur') || url.includes('/color') || url.includes('/peinture')) {
          html = result.html || '';
          productUrl = url;
          console.log('Found color page:', url);
          break;
        }
      }
    }

    // Extract color information from HTML
    let imageUrl = null;
    let hexColor = null;
    let foundColorNumber = colorNumber;
    let foundColorName = colorName;

    // Look for the color swatch image
    // Pattern 1: Main color image with high quality
    const imgPatterns = [
      // F&B product images with color swatch
      /(https:\/\/[^"'\s]*farrow-ball\.com[^"'\s]*\/Colour[^"'\s]*\.(jpg|jpeg|png|webp))/gi,
      // CDN images
      /(https:\/\/[^"'\s]*cdn[^"'\s]*farrow[^"'\s]*\.(jpg|jpeg|png|webp))/gi,
      // Any image containing the color name or number
      /(https:\/\/[^"'\s]*\.(jpg|jpeg|png|webp))/gi,
    ];
    
    for (const pattern of imgPatterns) {
      const matches = html.match(pattern);
      if (matches) {
        // Filter to find color-related images
        for (const imgUrl of matches) {
          const lowerUrl = imgUrl.toLowerCase();
          if (lowerUrl.includes('colour') || lowerUrl.includes('color') || 
              lowerUrl.includes('swatch') || lowerUrl.includes('paint') ||
              (colorName && lowerUrl.includes(colorName.toLowerCase().split(' ')[0]))) {
            imageUrl = imgUrl;
            break;
          }
        }
        if (imageUrl) break;
      }
    }

    // Extract hex color from CSS or data attributes
    // Look for inline styles with background color that might be the actual color
    const hexPatterns = [
      // data-color attribute
      /data-(?:color|hex)[^=]*=["']#?([A-Fa-f0-9]{6})["']/gi,
      // CSS background with hex
      /(?:background-color|background)\s*:\s*#([A-Fa-f0-9]{6})/gi,
      // style attribute with background
      /style="[^"]*background[^:]*:\s*#([A-Fa-f0-9]{6})/gi,
    ];
    
    for (const pattern of hexPatterns) {
      let hexMatch;
      while ((hexMatch = pattern.exec(html)) !== null) {
        const foundHex = hexMatch[1].toUpperCase();
        // Skip pure white and black
        if (foundHex !== 'FFFFFF' && foundHex !== '000000' && foundHex !== 'F5F5F5') {
          hexColor = `#${foundHex}`;
          break;
        }
      }
      if (hexColor) break;
    }
    
    // Also look for RGB
    if (!hexColor) {
      const rgbPattern = /(?:background-color|background)\s*:\s*rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/gi;
      let rgbMatch;
      while ((rgbMatch = rgbPattern.exec(html)) !== null) {
        const r = parseInt(rgbMatch[1]);
        const g = parseInt(rgbMatch[2]);
        const b = parseInt(rgbMatch[3]);
        // Skip white/black/grey
        if (!(r > 240 && g > 240 && b > 240) && !(r < 15 && g < 15 && b < 15)) {
          const hex = ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
          hexColor = `#${hex}`;
          break;
        }
      }
    }

    // Extract title if we don't have the full name
    if (!foundColorName) {
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      if (titleMatch) {
        const title = titleMatch[1];
        const numMatch = title.match(/No\.?\s*(\d+)/i);
        const nameMatch = title.match(/No\.?\s*\d+\s+([A-Za-z\s]+)/i);
        if (numMatch && !foundColorNumber) {
          foundColorNumber = numMatch[1];
        }
        if (nameMatch) {
          foundColorName = nameMatch[1].trim();
        }
      }
    }

    console.log('Found - Image URL:', imageUrl, 'Hex color:', hexColor, 'Product URL:', productUrl);

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
