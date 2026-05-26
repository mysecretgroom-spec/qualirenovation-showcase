import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'

Deno.serve((req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  const siteKey = Deno.env.get('HCAPTCHA_SITE_KEY') ?? ''
  return new Response(JSON.stringify({ siteKey }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})