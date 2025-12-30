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

    // Anti-spam checks
    const honeypot = (rawData as Record<string, unknown>)?._hp;
    const formTimestamp = (rawData as Record<string, unknown>)?._ts;
    const formDuration = (rawData as Record<string, unknown>)?._duration;
    
    // Check honeypot - if filled, reject silently (bot detected)
    if (honeypot && typeof honeypot === 'string' && honeypot.length > 0) {
      console.log("[send-quote-confirmation] Honeypot triggered - bot detected, rejecting silently");
      return new Response(
        JSON.stringify({ success: true, message: "Quote request received" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    
    // Check time spent on form - if less than 3 seconds, likely a bot
    const MIN_FORM_TIME_MS = 3000; // 3 seconds minimum
    if (formDuration && typeof formDuration === 'number' && formDuration < MIN_FORM_TIME_MS) {
      console.log(`[send-quote-confirmation] Form submitted too quickly (${formDuration}ms) - possible bot`);
      return new Response(
        JSON.stringify({ success: true, message: "Quote request received" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    
    console.log(`[send-quote-confirmation] Anti-spam checks passed. Form duration: ${formDuration}ms`);

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

    // Email to client (confirmation) - Design cohérent avec le site
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
            body { font-family: 'Georgia', 'Times New Roman', serif; line-height: 1.7; color: #1a1a1a; margin: 0; padding: 0; background-color: #f8f6f3; }
            .wrapper { background-color: #f8f6f3; padding: 40px 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; overflow: hidden; }
            .header { background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%); padding: 40px 30px; text-align: center; }
            .logo-container { margin-bottom: 10px; }
            .logo-quali { font-family: 'Georgia', serif; font-size: 28px; font-weight: 700; letter-spacing: 3px; color: #c9a961; display: inline; }
            .logo-renovation { font-family: 'Georgia', serif; font-size: 28px; font-weight: 700; letter-spacing: 3px; color: #ffffff; display: inline; }
            .logo-tagline { font-family: Arial, sans-serif; font-size: 10px; color: rgba(255,255,255,0.7); letter-spacing: 4px; text-transform: uppercase; margin-top: 8px; }
            .hero-section { position: relative; }
            .hero-image { width: 100%; height: auto; display: block; }
            .content { padding: 40px 35px; }
            .greeting { font-size: 22px; color: #1a1a1a; margin-bottom: 25px; font-weight: 400; }
            .greeting strong { color: #c9a961; }
            .text { color: #4a4a4a; margin: 18px 0; font-size: 15px; }
            .highlight { color: #c9a961; font-weight: 600; }
            .divider { width: 60px; height: 2px; background: linear-gradient(90deg, #c9a961, #e8d5a3); margin: 30px 0; }
            .recap { background: #faf9f7; padding: 30px; margin: 30px 0; border-left: 3px solid #c9a961; }
            .recap-title { margin: 0 0 25px 0; color: #1a1a1a; font-size: 18px; font-weight: 600; letter-spacing: 1px; }
            .recap-item { margin: 14px 0; display: flex; font-size: 14px; }
            .recap-label { font-weight: 600; color: #1a1a1a; min-width: 150px; }
            .recap-value { color: #4a4a4a; }
            .cta-section { text-align: center; margin: 35px 0; padding: 30px; background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%); }
            .cta-text { color: #ffffff; margin: 0 0 20px 0; font-size: 16px; font-style: italic; }
            .cta-button { display: inline-block; padding: 14px 35px; background: linear-gradient(135deg, #c9a961 0%, #e8d5a3 100%); color: #1a1a1a; text-decoration: none; font-weight: 600; font-size: 13px; letter-spacing: 2px; text-transform: uppercase; }
            .signature-section { margin-top: 35px; padding: 30px; background: #faf9f7; display: table; width: 100%; box-sizing: border-box; }
            .signature-photo { display: table-cell; vertical-align: top; width: 90px; padding-right: 25px; }
            .signature-photo img { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 3px solid #c9a961; }
            .signature-content { display: table-cell; vertical-align: middle; }
            .signature-greeting { color: #4a4a4a; font-size: 15px; margin: 0 0 8px 0; font-style: italic; }
            .signature-name { color: #1a1a1a; font-size: 18px; font-weight: 600; margin: 0 0 5px 0; }
            .signature-role { color: #c9a961; font-size: 13px; margin: 0 0 12px 0; letter-spacing: 1px; }
            .signature-phone { color: #1a1a1a; font-size: 14px; margin: 0; }
            .signature-phone a { color: #1a1a1a; text-decoration: none; font-weight: 600; }
            .footer { background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%); padding: 35px; text-align: center; }
            .footer-logo-quali { font-family: 'Georgia', serif; font-size: 20px; font-weight: 700; letter-spacing: 2px; color: #c9a961; display: inline; }
            .footer-logo-renovation { font-family: 'Georgia', serif; font-size: 20px; font-weight: 700; letter-spacing: 2px; color: #ffffff; display: inline; }
            .footer-divider { width: 40px; height: 1px; background: #c9a961; margin: 20px auto; }
            .footer-info { color: rgba(255,255,255,0.8); font-size: 12px; line-height: 2; font-family: Arial, sans-serif; }
            .footer-link { color: #c9a961; text-decoration: none; }
            .social-links { margin: 20px 0; }
            .social-link { display: inline-block; width: 40px; height: 40px; background: rgba(255,255,255,0.1); margin: 0 8px; text-align: center; line-height: 40px; color: #ffffff; text-decoration: none; font-size: 18px; }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="container">
              <!-- Header avec logo HTML -->
              <div class="header">
                <div class="logo-container">
                  <span class="logo-quali">QUALI</span><span class="logo-renovation">RÉNOVATION</span>
                </div>
                <div class="logo-tagline">by Qualiconcept</div>
              </div>
              
              <!-- Image hero -->
              <div class="hero-section">
                <img src="https://st.hzcdn.com/simgs/7461361a0ab3ba4b_8-2381/salons-hotel-particulier-saint-mande-olivier-berni-interieurs.jpg" alt="Rénovation d'intérieur de qualité" class="hero-image" />
              </div>
              
              <!-- Contenu principal -->
              <div class="content">
                <h2 class="greeting">Bonjour <strong>${safeName}</strong>,</h2>
                
                <div class="divider"></div>
                
                <p class="text">Nous avons bien reçu votre demande de devis et nous vous en remercions chaleureusement.</p>
                
                <p class="text">Notre équipe d'experts étudie votre projet avec attention et vous recontactera <span class="highlight">sous 48 heures</span> avec une proposition personnalisée.</p>
                
                <!-- Récapitulatif -->
                <div class="recap">
                  <h3 class="recap-title">RÉCAPITULATIF DE VOTRE DEMANDE</h3>
                  <div class="recap-item"><span class="recap-label">Ville du bien</span> <span class="recap-value">${safeCity}</span></div>
                  <div class="recap-item"><span class="recap-label">Surface</span> <span class="recap-value">${safeSurface} m²</span></div>
                  <div class="recap-item"><span class="recap-label">Budget envisagé</span> <span class="recap-value">${budgetLabel}</span></div>
                  <div class="recap-item"><span class="recap-label">Démarrage souhaité</span> <span class="recap-value">${timelineLabel}</span></div>
                  <div class="recap-item"><span class="recap-label">Votre projet</span> <span class="recap-value">${safeMessage}</span></div>
                </div>

                <!-- CTA -->
                <div class="cta-section">
                  <p class="cta-text">Découvrez nos réalisations en attendant notre réponse</p>
                  <a href="https://qualirenovation.fr/#realisations" class="cta-button">Voir nos projets</a>
                </div>
                
                <!-- Signature Carina -->
                <div class="signature-section">
                  <div class="signature-photo">
                    <img src="https://qualirenovation.fr/carina-profile.jpg" alt="Carina" />
                  </div>
                  <div class="signature-content">
                    <p class="signature-greeting">À très bientôt,</p>
                    <p class="signature-name">Carina</p>
                    <p class="signature-role">Fondatrice de Qualirénovation</p>
                    <p class="signature-phone">📞 <a href="tel:+33659764685">+33 6 59 76 46 85</a></p>
                  </div>
                </div>
              </div>
              
              <!-- Footer -->
              <div class="footer">
                <div>
                  <span class="footer-logo-quali">QUALI</span><span class="footer-logo-renovation">RÉNOVATION</span>
                </div>
                <div class="footer-divider"></div>
                <div class="social-links">
                  <a href="https://www.houzz.fr/pro/qualiconcept/qualirenovation-by-qualiconcept" target="_blank" class="social-link">🏠</a>
                  <a href="https://www.instagram.com/qualirenovation__travaux/" target="_blank" class="social-link">📷</a>
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