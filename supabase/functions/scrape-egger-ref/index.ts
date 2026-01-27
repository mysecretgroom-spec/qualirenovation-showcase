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

    // Clean the reference (remove spaces, uppercase)
    const cleanRef = reference.trim().toUpperCase();
    
    // Search for the EGGER reference on their website
    const searchUrl = `https://www.vds-egger.com/?country=FR&language=fr&search=${encodeURIComponent(cleanRef)}`;
    
    console.log('Scraping EGGER reference:', cleanRef, 'URL:', searchUrl);

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

    // Try to extract image URL from the scraped content
    let imageUrl = null;
    const html = data.data?.html || data.html || '';
    
    // Look for product images in the HTML
    // EGGER typically uses specific patterns for their product images
    const imgPatterns = [
      // Pattern for EGGER decor images
      /https:\/\/[^"'\s]*egger[^"'\s]*decor[^"'\s]*\.(jpg|jpeg|png|webp)/gi,
      // Pattern for product thumbnails
      /https:\/\/[^"'\s]*egger[^"'\s]*product[^"'\s]*\.(jpg|jpeg|png|webp)/gi,
      // General EGGER image pattern
      /https:\/\/[^"'\s]*vds-egger[^"'\s]*\.(jpg|jpeg|png|webp)/gi,
      // CDN pattern
      /https:\/\/[^"'\s]*cdn[^"'\s]*egger[^"'\s]*\.(jpg|jpeg|png|webp)/gi,
    ];
    
    for (const pattern of imgPatterns) {
      const matches = html.match(pattern);
      if (matches && matches.length > 0) {
        // Filter to find the most relevant image (usually the first product image)
        imageUrl = matches[0];
        break;
      }
    }

    // If no specific pattern found, try to find any image with the reference in its URL
    if (!imageUrl) {
      const refPattern = new RegExp(`https://[^"'\\s]*${cleanRef.replace(/[^A-Z0-9]/g, '')}[^"'\\s]*\\.(jpg|jpeg|png|webp)`, 'gi');
      const refMatches = html.match(refPattern);
      if (refMatches && refMatches.length > 0) {
        imageUrl = refMatches[0];
      }
    }

    console.log('Found image URL:', imageUrl);

    return new Response(
      JSON.stringify({ 
        success: true, 
        reference: cleanRef,
        imageUrl,
        searchUrl,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error scraping EGGER:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to scrape';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
