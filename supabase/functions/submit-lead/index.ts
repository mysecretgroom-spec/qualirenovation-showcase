import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { z } from 'npm:zod@3.23.8'

const BodySchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().toLowerCase().email().max(255),
  phone: z.string().trim().min(8).max(25).regex(/^[+0-9\s().-]+$/),
  resourceLabel: z.string().trim().min(1).max(200),
  rgpdConsent: z.literal(true),
  marketingConsent: z.boolean().optional().default(false),
  captchaToken: z.string().min(10).max(5000),
})

const RATE_WINDOW_SECONDS = 60
const RATE_MAX_PER_WINDOW = 1 // same email/IP cannot submit more than once per minute
const HOURLY_MAX_PER_IP = 5

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const parsed = BodySchema.safeParse(await req.json())
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: 'Invalid payload', details: parsed.error.flatten().fieldErrors }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }
    const { name, email, phone, resourceLabel, rgpdConsent, marketingConsent, captchaToken } = parsed.data

    // Client IP (best-effort from edge proxy headers)
    const ip =
      req.headers.get('cf-connecting-ip') ||
      req.headers.get('x-real-ip') ||
      (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() ||
      'unknown'

    // ----- 1. Verify hCaptcha -----
    const hcSecret = Deno.env.get('HCAPTCHA_SECRET_KEY')
    if (!hcSecret) {
      console.error('[submit-lead] HCAPTCHA_SECRET_KEY not configured')
      return new Response(JSON.stringify({ error: 'Captcha not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    const form = new URLSearchParams()
    form.set('secret', hcSecret)
    form.set('response', captchaToken)
    if (ip !== 'unknown') form.set('remoteip', ip)
    const hcRes = await fetch('https://hcaptcha.com/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form.toString(),
    })
    const hcJson = (await hcRes.json()) as { success?: boolean; 'error-codes'?: string[] }
    if (!hcJson.success) {
      console.warn('[submit-lead] Captcha rejected', hcJson['error-codes'])
      return new Response(
        JSON.stringify({ error: 'Vérification anti-spam échouée. Réessayez.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    // ----- 2. Rate-limit via DB lookup -----
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const admin = createClient(supabaseUrl, serviceKey)

    const sinceWindow = new Date(Date.now() - RATE_WINDOW_SECONDS * 1000).toISOString()
    const { count: recentSame, error: rateErr } = await admin
      .from('quote_requests')
      .select('id', { count: 'exact', head: true })
      .eq('email', email)
      .gte('created_at', sinceWindow)
    if (rateErr) console.error('[submit-lead] Rate check error:', rateErr)
    if ((recentSame ?? 0) >= RATE_MAX_PER_WINDOW) {
      return new Response(
        JSON.stringify({ error: 'Trop de soumissions. Patientez quelques instants avant de réessayer.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    // Note: IP-based rate-limiting would require a dedicated table to persist counters.
    // For now we limit by email within the short window above.
    void HOURLY_MAX_PER_IP // referenced to avoid unused-const warnings; future use
    void ip

    // ----- 3. Insert lead -----
    const { data: inserted, error: insErr } = await admin
      .from('quote_requests')
      .insert({
        name,
        email,
        phone,
        message: `Téléchargement de la ressource : ${resourceLabel}`,
        surface: 'Non renseigné',
        budget: 'Non renseigné',
        timeline: 'Non renseigné',
        status: 'lead_pdf',
        rgpd_consent: rgpdConsent,
        marketing_consent: marketingConsent,
      })
      .select('id')
      .single()
    if (insErr || !inserted) {
      console.error('[submit-lead] Insert error:', insErr)
      return new Response(JSON.stringify({ error: 'Enregistrement impossible.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // ----- 4. Fire-and-forget confirmation email -----
    admin.functions
      .invoke('send-lead-confirmation', {
        body: { leadId: inserted.id, name, email, phone, resourceLabel, marketingConsent },
      })
      .catch((e) => console.error('[submit-lead] confirm email failed:', e))

    return new Response(JSON.stringify({ leadId: inserted.id }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    console.error('[submit-lead] Unexpected error:', e)
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})