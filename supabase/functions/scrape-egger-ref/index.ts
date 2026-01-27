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
    // Expected format: "H1312 ST10" -> "H1312_10"
    const cleanRef = reference.trim().toUpperCase();
    
    // Parse reference to get the EGGER URL format
    // EGGER uses format like H1312_10 (decor code + surface code without ST)
    const match = cleanRef.match(/^([A-Z]\d+)\s*(?:ST)?(\d+)?$/i);
    
    let eggerUrlRef = cleanRef.replace(/\s+/g, '_');
    if (match) {
      const decorCode = match[1];
      const surfaceCode = match[2] || '';
      eggerUrlRef = surfaceCode ? `${decorCode}_${surfaceCode}` : decorCode;
    }
    
    // Use the official EGGER website with the correct URL format
    const decorUrl = `https://www.egger.com/en/furniture-interior-design/decors/${eggerUrlRef}?country=GB`;
    
    console.log('Scraping EGGER reference:', cleanRef, 'URL:', decorUrl);

    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: decorUrl,
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

    // Try to extract image URL from the scraped content
    let imageUrl = null;
    let decorName = null;
    const html = data.data?.html || data.html || '';
    
    console.log('HTML length:', html.length);
    
    // Check if it's a 404 page
    if (html.includes('404_error_page') || html.includes('Page introuvable') || html.includes('Page not found')) {
      console.log('404 page detected');
      return new Response(
        JSON.stringify({ 
          success: true, 
          reference: cleanRef,
          imageUrl: null,
          decorName: null,
          decorUrl,
          error: 'Decor not found'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Extract decor name from title (format: "H1312 ST10 Sand Beige Whiteriver Oak")
    const titleMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
    if (titleMatch) {
      decorName = titleMatch[1].trim();
    }
    
    // Look for EGGER CDN product images - they use a specific pattern
    // Pattern: https://cdn.egger.com/img/pim/XXXXX/XXXXX/original.png (or .jpg, .webp)
    const cdnPatterns = [
      // Main decor texture image (usually the second one is the close-up decor swatch)
      /https:\/\/cdn\.egger\.com\/img\/pim\/\d+\/\d+\/(?:AR_\d+_\d+\.webp|original\.(?:png|jpg))/gi,
    ];
    
    const allMatches: string[] = [];
    for (const pattern of cdnPatterns) {
      const matches = html.match(pattern);
      if (matches) {
        allMatches.push(...matches);
      }
    }
    
    console.log('Found CDN matches:', allMatches.length);
    
    if (allMatches.length > 0) {
      // Prefer AR_16_9 or AR_4_3 formats for a better thumbnail, or original.png
      // The second image is usually the decor texture (first is the board)
      const uniqueImages = [...new Set(allMatches)];
      
      // Find the best image - prefer the decor close-up (usually has AR_4_3)
      const ar43Image = uniqueImages.find(img => img.includes('AR_4_3'));
      const ar169Image = uniqueImages.find(img => img.includes('AR_16_9'));
      const originalImage = uniqueImages.find(img => img.includes('/original.'));
      
      // Get the second unique base path (decor swatch, not the board)
      const basePaths = uniqueImages
        .map(img => {
          const match = img.match(/https:\/\/cdn\.egger\.com\/img\/pim\/(\d+)\/(\d+)/);
          return match ? `${match[1]}/${match[2]}` : null;
        })
        .filter((v, i, a) => v && a.indexOf(v) === i);
      
      if (basePaths.length > 1) {
        // Use the second image (decor swatch)
        imageUrl = `https://cdn.egger.com/img/pim/${basePaths[1]}/AR_4_3.webp?width=300&srcext=png`;
      } else if (ar43Image) {
        // Add width parameter for thumbnail
        imageUrl = ar43Image.includes('?') ? ar43Image : `${ar43Image}?width=300`;
      } else if (ar169Image) {
        imageUrl = ar169Image.includes('?') ? ar169Image : `${ar169Image}?width=400`;
      } else if (originalImage) {
        imageUrl = `${originalImage}?width=300`;
      } else {
        imageUrl = uniqueImages[0];
      }
    }

    console.log('Found image URL:', imageUrl);
    console.log('Found decor name:', decorName);

    return new Response(
      JSON.stringify({ 
        success: true, 
        reference: cleanRef,
        imageUrl,
        decorName,
        decorUrl,
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
