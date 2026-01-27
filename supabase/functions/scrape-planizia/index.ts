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
    
    // Search on Planizia coloris page
    const searchUrl = `https://www.planizia.fr/coloris/?search=${encodeURIComponent(cleanRef)}`;
    
    console.log('Scraping Planizia reference:', cleanRef, 'URL:', searchUrl);

    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: searchUrl,
        formats: ['html', 'links'],
        waitFor: 3000, // Wait for dynamic content
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
    let productUrl = null;
    let brand = null;
    const html = data.data?.html || data.html || '';
    
    console.log('HTML length:', html.length);
    
    // Check if no results found
    if (html.includes('Aucun résultat') || html.includes('no-results')) {
      console.log('No results found');
      return new Response(
        JSON.stringify({ 
          success: true, 
          reference: cleanRef,
          imageUrl: null,
          productName: null,
          productUrl: null,
          brand: null,
          error: 'Product not found'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Look for product cards in the results
    // Planizia uses product cards with images and links
    
    // Extract first product image - look for coloris images
    const imgPatterns = [
      // Planizia product images
      /https:\/\/[^"'\s]*planizia[^"'\s]*coloris[^"'\s]*\.(jpg|jpeg|png|webp)/gi,
      /https:\/\/[^"'\s]*planizia\.fr\/[^"'\s]*uploads[^"'\s]*\.(jpg|jpeg|png|webp)/gi,
      // CDN images
      /https:\/\/[^"'\s]*cdn[^"'\s]*planizia[^"'\s]*\.(jpg|jpeg|png|webp)/gi,
      // WordPress media uploads (common pattern)
      /https:\/\/www\.planizia\.fr\/wp-content\/uploads\/[^"'\s]+\.(jpg|jpeg|png|webp)/gi,
    ];
    
    for (const pattern of imgPatterns) {
      const matches = html.match(pattern);
      if (matches && matches.length > 0) {
        // Filter out thumbnails and icons, prefer larger images
        const filtered = matches.filter((url: string) => 
          !url.includes('thumbnail') && 
          !url.includes('icon') &&
          !url.includes('-150x') &&
          !url.includes('-100x') &&
          !url.includes('logo')
        );
        if (filtered.length > 0) {
          imageUrl = filtered[0];
          break;
        }
      }
    }
    
    // Try to extract product name from search results
    // Look for product titles that match the search
    const titlePatterns = [
      /<h[23][^>]*class="[^"]*product[^"]*"[^>]*>([^<]+)<\/h[23]>/gi,
      /<a[^>]*class="[^"]*product[^"]*"[^>]*>([^<]+)<\/a>/gi,
      /title="([^"]*(?:Silestone|Dekton|Neolith|Lapitec)[^"]*)"/gi,
    ];
    
    for (const pattern of titlePatterns) {
      const match = pattern.exec(html);
      if (match && match[1]) {
        productName = match[1].trim();
        break;
      }
    }
    
    // If no product name found, use the reference
    if (!productName) {
      productName = cleanRef;
    }
    
    // Extract brand from reference (Silestone, Dekton, Neolith, Lapitec, etc.)
    const brandMatch = cleanRef.match(/^(Silestone|Dekton|Neolith|Lapitec|Caesarstone)/i);
    if (brandMatch) {
      brand = brandMatch[1];
    }
    
    // Try to find product detail URL
    const urlPatterns = [
      /href="(https:\/\/www\.planizia\.fr\/coloris\/[^"]+)"/gi,
      /href="(\/coloris\/[^"]+)"/gi,
    ];
    
    for (const pattern of urlPatterns) {
      const match = pattern.exec(html);
      if (match && match[1]) {
        productUrl = match[1].startsWith('/') 
          ? `https://www.planizia.fr${match[1]}` 
          : match[1];
        break;
      }
    }

    console.log('Found image URL:', imageUrl);
    console.log('Found product name:', productName);
    console.log('Found product URL:', productUrl);
    console.log('Found brand:', brand);

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
