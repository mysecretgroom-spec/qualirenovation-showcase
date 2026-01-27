const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { colorNumber, colorName } = await req.json();

    if (!colorNumber && !colorName) {
      return new Response(
        JSON.stringify({ success: false, error: 'Color number or name is required' }),
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

    // Build search query - prioritize color number if available
    const searchQuery = colorNumber 
      ? `No.${colorNumber.trim()}` 
      : colorName?.trim();
    
    // Search on the Farrow & Ball colors page
    const searchUrl = `https://www.farrow-ball.com/fr/peinture/toutes-les-couleurs-de-peinture?q=${encodeURIComponent(searchQuery)}`;
    
    console.log('Scraping Farrow & Ball:', searchQuery, 'URL:', searchUrl);

    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: searchUrl,
        formats: ['html', 'links'],
        waitFor: 3000, // Wait for dynamic content to load
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

    // Try to extract color swatch image URL from the scraped content
    let imageUrl = null;
    let hexColor = null;
    const html = data.data?.html || data.html || '';
    
    // Look for Farrow & Ball color swatch images
    // F&B typically uses specific patterns for their color swatches
    const imgPatterns = [
      // Pattern for F&B color swatch images on their CDN
      /https:\/\/[^"'\s]*farrow-ball[^"'\s]*swatch[^"'\s]*\.(jpg|jpeg|png|webp)/gi,
      // Pattern for color images
      /https:\/\/[^"'\s]*farrow-ball[^"'\s]*color[^"'\s]*\.(jpg|jpeg|png|webp)/gi,
      // General CDN pattern for F&B
      /https:\/\/[^"'\s]*cdn[^"'\s]*farrow[^"'\s]*\.(jpg|jpeg|png|webp)/gi,
      // Cloudinary pattern (often used by F&B)
      /https:\/\/[^"'\s]*cloudinary[^"'\s]*farrow[^"'\s]*\.(jpg|jpeg|png|webp)/gi,
      // Any F&B related image
      /https:\/\/[^"'\s]*f-ball[^"'\s]*\.(jpg|jpeg|png|webp)/gi,
    ];
    
    for (const pattern of imgPatterns) {
      const matches = html.match(pattern);
      if (matches && matches.length > 0) {
        // Filter to find the most relevant image
        imageUrl = matches[0];
        break;
      }
    }

    // Try to extract hex color from the HTML
    // F&B often includes hex colors in their page data
    const hexPattern = /background-color:\s*#([A-Fa-f0-9]{6})/gi;
    const hexMatches = html.match(hexPattern);
    if (hexMatches && hexMatches.length > 0) {
      const match = hexMatches[0].match(/#([A-Fa-f0-9]{6})/i);
      if (match) {
        hexColor = `#${match[1].toUpperCase()}`;
      }
    }

    // Alternative: look for data attributes with color values
    if (!hexColor) {
      const dataColorPattern = /data-color[^=]*=["']#?([A-Fa-f0-9]{6})["']/gi;
      const dataMatches = html.match(dataColorPattern);
      if (dataMatches && dataMatches.length > 0) {
        const match = dataMatches[0].match(/([A-Fa-f0-9]{6})/i);
        if (match) {
          hexColor = `#${match[1].toUpperCase()}`;
        }
      }
    }

    console.log('Found image URL:', imageUrl, 'Hex color:', hexColor);

    return new Response(
      JSON.stringify({ 
        success: true, 
        colorNumber: colorNumber?.trim(),
        colorName: colorName?.trim(),
        imageUrl,
        hexColor,
        searchUrl,
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
