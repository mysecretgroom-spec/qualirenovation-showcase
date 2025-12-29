import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// =============================================
// INPUT VALIDATION
// =============================================

interface ValidationError {
  field: string;
  message: string;
}

interface QuoteRequestData {
  name: string;
  email: string;
  phone: string;
  city: string;
  surface: string;
  budget: string;
  timeline: string;
  message: string;
}

const VALID_BUDGETS = [
  "2000-10000", "10000-30000", "30000-50000", 
  "50000-100000", "100000-200000", "200000+"
];

const VALID_TIMELINES = [
  "urgent", "1-month", "1-3-months", 
  "3-6-months", "6-months+", "undetermined"
];

function sanitizeString(input: unknown, maxLength: number): string {
  if (typeof input !== 'string') return '';
  // Remove any HTML tags and trim
  return input.replace(/<[^>]*>/g, '').trim().substring(0, maxLength);
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

function validatePhone(phone: string): boolean {
  // French phone: 10 digits, may have spaces, dots, dashes
  const cleanPhone = phone.replace(/[\s.\-]/g, '');
  return /^(?:(?:\+|00)33|0)[1-9](?:[0-9]{8})$/.test(cleanPhone);
}

function validateQuoteData(data: unknown): { valid: true; data: QuoteRequestData } | { valid: false; errors: ValidationError[] } {
  const errors: ValidationError[] = [];
  
  if (!data || typeof data !== 'object') {
    return { valid: false, errors: [{ field: 'body', message: 'Invalid request body' }] };
  }

  const input = data as Record<string, unknown>;

  // Name validation
  const name = sanitizeString(input.name, 100);
  if (!name || name.length < 2) {
    errors.push({ field: 'name', message: 'Le nom doit contenir au moins 2 caractères' });
  }

  // Email validation
  const email = sanitizeString(input.email, 255).toLowerCase();
  if (!email || !validateEmail(email)) {
    errors.push({ field: 'email', message: 'Adresse email invalide' });
  }

  // Phone validation
  const phone = sanitizeString(input.phone, 20);
  if (!phone || !validatePhone(phone)) {
    errors.push({ field: 'phone', message: 'Numéro de téléphone invalide (format français attendu)' });
  }

  // City validation
  const city = sanitizeString(input.city, 100);
  if (!city || city.length < 2) {
    errors.push({ field: 'city', message: 'La ville doit contenir au moins 2 caractères' });
  }

  // Surface validation
  const surface = sanitizeString(input.surface, 10);
  if (!surface || !/^\d+$/.test(surface) || parseInt(surface) < 1 || parseInt(surface) > 10000) {
    errors.push({ field: 'surface', message: 'Surface invalide (1-10000 m²)' });
  }

  // Budget validation
  const budget = sanitizeString(input.budget, 50);
  if (!budget || !VALID_BUDGETS.includes(budget)) {
    errors.push({ field: 'budget', message: 'Fourchette de budget invalide' });
  }

  // Timeline validation
  const timeline = sanitizeString(input.timeline, 50);
  if (!timeline || !VALID_TIMELINES.includes(timeline)) {
    errors.push({ field: 'timeline', message: 'Période de démarrage invalide' });
  }

  // Message validation
  const message = sanitizeString(input.message, 2000);
  if (!message || message.length < 10) {
    errors.push({ field: 'message', message: 'La description doit contenir au moins 10 caractères' });
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    data: { name, email, phone, city, surface, budget, timeline, message }
  };
}

// =============================================
// LABELS
// =============================================

const budgetLabels: Record<string, string> = {
  "2000-10000": "2 000 € - 10 000 €",
  "10000-30000": "10 000 € - 30 000 €",
  "30000-50000": "30 000 € - 50 000 €",
  "50000-100000": "50 000 € - 100 000 €",
  "100000-200000": "100 000 € - 200 000 €",
  "200000+": "Supérieur à 200 000 €",
};

const timelineLabels: Record<string, string> = {
  "urgent": "Dès que possible",
  "1-month": "Dans le mois",
  "1-3-months": "Dans 1 à 3 mois",
  "3-6-months": "Dans 3 à 6 mois",
  "6-months+": "Dans plus de 6 mois",
  "undetermined": "Pas encore déterminé",
};

// Logo en base64 - SVG encodé pour compatibilité email
const logoBase64 = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMjAgNjAiPjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iNjAiIGZpbGw9IiMxMTRhNjUiLz48dGV4dCB4PSIxMCIgeT0iMzUiIGZvbnQtZmFtaWx5PSJHZW9yZ2lhLCBzZXJpZiIgZm9udC1zaXplPSIyNCIgZm9udC13ZWlnaHQ9IjcwMCIgbGV0dGVyLXNwYWNpbmc9IjIiPjx0c3BhbiBmaWxsPSIjYmE4YzFjIj5RVUFMSTWVC3Bhbj48dHNwYW4gZmlsbD0iI2ZmZmZmZiI+UsOJTk9WQVRJT048L3RzcGFuPjwvdGV4dD48dGV4dCB4PSIxMCIgeT0iNTIiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSI5IiBmaWxsPSIjZmZmZmZmIiBvcGFjaXR5PSIwLjgiIGxldHRlci1zcGFjaW5nPSIyIj5CWSBRVUFMSUNPTkNFUFQ8L3RleHQ+PC9zdmc+`;

// =============================================
// HANDLER
// =============================================

const handler = async (req: Request): Promise<Response> => {
  console.log("[send-quote-confirmation] Received request:", req.method);

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse and validate input
    let rawData: unknown;
    try {
      rawData = await req.json();
    } catch {
      console.error("[send-quote-confirmation] Invalid JSON in request body");
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request body" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Verify hCaptcha token first
    const captchaToken = (rawData as Record<string, unknown>)?.captchaToken;
    if (!captchaToken || typeof captchaToken !== 'string') {
      console.error("[send-quote-confirmation] Missing captcha token");
      return new Response(
        JSON.stringify({ error: "Captcha verification required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const hcaptchaSecret = Deno.env.get("HCAPTCHA_SECRET_KEY");
    if (hcaptchaSecret) {
      const captchaResponse = await fetch("https://api.hcaptcha.com/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `response=${captchaToken}&secret=${hcaptchaSecret}`,
      });
      
      const captchaResult = await captchaResponse.json();
      console.log("[send-quote-confirmation] hCaptcha verification result:", captchaResult.success);
      
      if (!captchaResult.success) {
        console.error("[send-quote-confirmation] hCaptcha verification failed:", captchaResult);
        return new Response(
          JSON.stringify({ error: "Captcha verification failed" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
    }

    const validationResult = validateQuoteData(rawData);
    
    if (!validationResult.valid) {
      console.error("[send-quote-confirmation] Validation errors:", validationResult.errors);
      return new Response(
        JSON.stringify({ 
          error: "Validation failed", 
          details: validationResult.errors 
        }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const data = validationResult.data;
    console.log("[send-quote-confirmation] Processing validated quote request for:", data.email);

    // Save to database using service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: savedQuote, error: dbError } = await supabase
      .from("quote_requests")
      .insert({
        name: data.name,
        email: data.email,
        phone: data.phone,
        city: data.city,
        surface: data.surface,
        budget: data.budget,
        timeline: data.timeline,
        message: data.message,
      })
      .select()
      .single();

    if (dbError) {
      console.error("[send-quote-confirmation] Database error:", dbError);
    } else {
      console.log("[send-quote-confirmation] Quote saved to database:", savedQuote.id);
    }

    const budgetLabel = budgetLabels[data.budget] || data.budget;
    const timelineLabel = timelineLabels[data.timeline] || data.timeline;

    // Escape HTML in user-provided content for emails
    const escapeHtml = (str: string) => 
      str.replace(/&/g, '&amp;')
         .replace(/</g, '&lt;')
         .replace(/>/g, '&gt;')
         .replace(/"/g, '&quot;')
         .replace(/'/g, '&#039;');

    const safeName = escapeHtml(data.name);
    const safeCity = escapeHtml(data.city);
    const safeSurface = escapeHtml(data.surface);
    const safeMessage = escapeHtml(data.message);
    const safeEmail = escapeHtml(data.email);
    const safePhone = escapeHtml(data.phone);

    // Email to client (confirmation)
    const clientEmailResponse = await resend.emails.send({
      from: "Qualirenovation <contact@qualiconcept.fr>",
      to: [data.email],
      subject: "Votre demande de devis a bien été reçue - Qualirénovation",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #000000; margin: 0; padding: 0; background-color: #f5f5f5; }
            .wrapper { background-color: #f5f5f5; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
            .header { background: #114a65; padding: 30px; text-align: center; }
            .logo-svg { width: 280px; height: auto; margin: 0 auto; display: block; }
            .hero-image { width: 100%; height: auto; display: block; }
            .content { padding: 30px; }
            .greeting { font-size: 20px; color: #114a65; margin-bottom: 20px; }
            .text { color: #000000; margin: 15px 0; }
            .highlight { color: #ba8c1c; font-weight: 600; }
            .recap { background: linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%); padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #ba8c1c; }
            .recap-title { margin: 0 0 20px 0; color: #114a65; font-size: 18px; display: flex; align-items: center; }
            .recap-title::before { content: ""; display: inline-block; width: 8px; height: 8px; background: #ba8c1c; border-radius: 50%; margin-right: 10px; }
            .recap-item { margin: 12px 0; display: flex; }
            .recap-label { font-weight: 600; color: #114a65; min-width: 140px; }
            .recap-value { color: #000000; }
            .cta-section { text-align: center; margin: 30px 0; padding: 25px; background: #114a65; border-radius: 8px; }
            .cta-text { color: #ffffff; margin: 0 0 15px 0; }
            .cta-button { display: inline-block; padding: 12px 30px; background: #ba8c1c; color: #ffffff; text-decoration: none; font-weight: 600; border-radius: 4px; }
            .signature { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
            .signature-name { color: #114a65; font-weight: 600; }
            .footer { background: #114a65; padding: 25px; text-align: center; }
            .footer-logo-svg { width: 200px; height: auto; margin: 0 auto 15px auto; display: block; }
            .footer-info { color: #ffffff; font-size: 11px; line-height: 1.8; opacity: 0.9; }
            .footer-link { color: #ba8c1c; text-decoration: none; }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="container">
              <div class="header">
                <img src="${logoBase64}" alt="Qualirénovation by Qualiconcept" class="logo-svg" style="width: 260px; height: auto;" />
              </div>
              
              <img src="https://st.hzcdn.com/simgs/7461361a0ab3ba4b_8-2381/salons-hotel-particulier-saint-mande-olivier-berni-interieurs.jpg" alt="Rénovation d'intérieur de qualité" class="hero-image" />
              
              <div class="content">
                <h2 class="greeting">Bonjour ${safeName},</h2>
                
                <p class="text">Nous avons bien reçu votre demande de devis et nous vous en remercions chaleureusement.</p>
                
                <p class="text">Notre équipe d'experts étudie votre projet avec attention et vous recontactera <span class="highlight">sous 48 heures</span> avec une proposition personnalisée.</p>
                
                <div class="recap">
                  <h3 class="recap-title">Récapitulatif de votre demande</h3>
                  <div class="recap-item"><span class="recap-label">Ville du bien :</span> <span class="recap-value">${safeCity}</span></div>
                  <div class="recap-item"><span class="recap-label">Surface :</span> <span class="recap-value">${safeSurface} m²</span></div>
                  <div class="recap-item"><span class="recap-label">Budget envisagé :</span> <span class="recap-value">${budgetLabel}</span></div>
                  <div class="recap-item"><span class="recap-label">Démarrage :</span> <span class="recap-value">${timelineLabel}</span></div>
                  <div class="recap-item"><span class="recap-label">Description :</span> <span class="recap-value">${safeMessage}</span></div>
                </div>

                <div class="cta-section">
                  <p class="cta-text">Découvrez nos réalisations en attendant notre réponse</p>
                  <a href="https://qualirenovation.fr/#realisations" class="cta-button">Voir nos projets</a>
                </div>
                
                <div class="signature">
                  <p class="text">À très bientôt,</p>
                  <p class="signature-name">L'équipe Qualirénovation</p>
                </div>
              </div>
              
              <div class="footer">
                <img src="${logoBase64}" alt="Qualirénovation by Qualiconcept" class="footer-logo-svg" style="width: 180px; height: auto; margin-bottom: 15px;" />
                <div style="margin-bottom: 20px;">
                  <a href="https://www.houzz.fr/pro/qualiconcept/qualirenovation-by-qualiconcept" target="_blank" style="display: inline-block; width: 36px; height: 36px; background: rgba(255,255,255,0.1); border-radius: 4px; margin: 0 5px; text-align: center; line-height: 36px;">
                    <img src="https://st.hzcdn.com/static/econ/icon/houzz-icon-white.svg" alt="Houzz" style="width: 18px; height: 18px; vertical-align: middle;" />
                  </a>
                  <a href="https://www.instagram.com/qualirenovation__travaux/" target="_blank" style="display: inline-block; width: 36px; height: 36px; background: rgba(255,255,255,0.1); border-radius: 4px; margin: 0 5px; text-align: center; line-height: 36px; color: #fff; text-decoration: none; font-size: 16px;">📷</a>
                </div>
                <p class="footer-info">
                  QUALIRÉNOVATION BY QUALICONCEPT<br>
                  SIRET : 85286728200034<br>
                  <a href="mailto:contact@qualiconcept.fr" class="footer-link">contact@qualiconcept.fr</a><br>
                  <a href="https://qualirenovation.fr" class="footer-link">qualirenovation.fr</a>
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("[send-quote-confirmation] Client email sent:", clientEmailResponse);

    // Email to team (notification)
    const teamEmailResponse = await resend.emails.send({
      from: "Qualirenovation <contact@qualiconcept.fr>",
      to: ["contact@qualiconcept.fr"],
      subject: `Nouvelle demande de devis - ${safeName} (${safeCity})`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1a1a1a; color: #d4af37; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #fff; }
            .info-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .info-table td { padding: 12px; border-bottom: 1px solid #eee; }
            .info-table td:first-child { font-weight: 600; width: 40%; color: #666; }
            .message-box { background: #f8f8f8; padding: 15px; border-left: 4px solid #d4af37; margin: 20px 0; }
            .priority { display: inline-block; padding: 5px 15px; background: #d4af37; color: #1a1a1a; font-weight: 600; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin: 0;">📋 Nouvelle demande de devis</h2>
            </div>
            <div class="content">
              <p><span class="priority">${timelineLabel}</span></p>
              
              <table class="info-table">
                <tr><td>Nom</td><td><strong>${safeName}</strong></td></tr>
                <tr><td>Email</td><td><a href="mailto:${safeEmail}">${safeEmail}</a></td></tr>
                <tr><td>Téléphone</td><td><a href="tel:${safePhone}">${safePhone}</a></td></tr>
                <tr><td>Ville du bien</td><td>${safeCity}</td></tr>
                <tr><td>Surface</td><td>${safeSurface} m²</td></tr>
                <tr><td>Budget</td><td><strong>${budgetLabel}</strong></td></tr>
                <tr><td>Démarrage</td><td>${timelineLabel}</td></tr>
              </table>
              
              <h3>Description du projet :</h3>
              <div class="message-box">${safeMessage}</div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("[send-quote-confirmation] Team email sent:", teamEmailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        clientEmail: clientEmailResponse,
        teamEmail: teamEmailResponse 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("[send-quote-confirmation] Error:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);