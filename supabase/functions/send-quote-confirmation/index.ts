import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

const handler = async (req: Request): Promise<Response> => {
  console.log("[send-quote-confirmation] Received request:", req.method);

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: QuoteRequestData = await req.json();
    console.log("[send-quote-confirmation] Processing quote request for:", data.email);

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
                <svg class="logo-svg" viewBox="0 0 320 60" xmlns="http://www.w3.org/2000/svg">
                  <text x="0" y="35" font-family="Georgia, serif" font-size="28" font-weight="700" letter-spacing="2">
                    <tspan fill="#ba8c1c">QUALI</tspan><tspan fill="#ffffff">RÉNOVATION</tspan>
                  </text>
                  <text x="0" y="52" font-family="Arial, sans-serif" font-size="10" fill="#ffffff" opacity="0.8" letter-spacing="3">BY QUALICONCEPT</text>
                </svg>
              </div>
              
              <img src="https://st.hzcdn.com/simgs/7461361a0ab3ba4b_8-2381/salons-hotel-particulier-saint-mande-olivier-berni-interieurs.jpg" alt="Rénovation d'intérieur de qualité" class="hero-image" />
              
              <div class="content">
                <h2 class="greeting">Bonjour ${data.name},</h2>
                
                <p class="text">Nous avons bien reçu votre demande de devis et nous vous en remercions chaleureusement.</p>
                
                <p class="text">Notre équipe d'experts étudie votre projet avec attention et vous recontactera <span class="highlight">sous 48 heures</span> avec une proposition personnalisée.</p>
                
                <div class="recap">
                  <h3 class="recap-title">Récapitulatif de votre demande</h3>
                  <div class="recap-item"><span class="recap-label">Ville du bien :</span> <span class="recap-value">${data.city}</span></div>
                  <div class="recap-item"><span class="recap-label">Surface :</span> <span class="recap-value">${data.surface} m²</span></div>
                  <div class="recap-item"><span class="recap-label">Budget envisagé :</span> <span class="recap-value">${budgetLabel}</span></div>
                  <div class="recap-item"><span class="recap-label">Démarrage :</span> <span class="recap-value">${timelineLabel}</span></div>
                  <div class="recap-item"><span class="recap-label">Description :</span> <span class="recap-value">${data.message}</span></div>
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
                <svg class="footer-logo-svg" viewBox="0 0 320 60" xmlns="http://www.w3.org/2000/svg">
                  <text x="60" y="35" font-family="Georgia, serif" font-size="24" font-weight="700" letter-spacing="1" text-anchor="middle">
                    <tspan fill="#ba8c1c">QUALI</tspan><tspan fill="#ffffff">RÉNOVATION</tspan>
                  </text>
                  <text x="160" y="52" font-family="Arial, sans-serif" font-size="9" fill="#ffffff" opacity="0.7" letter-spacing="2" text-anchor="middle">BY QUALICONCEPT</text>
                </svg>
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
      subject: `Nouvelle demande de devis - ${data.name} (${data.city})`,
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
                <tr><td>Nom</td><td><strong>${data.name}</strong></td></tr>
                <tr><td>Email</td><td><a href="mailto:${data.email}">${data.email}</a></td></tr>
                <tr><td>Téléphone</td><td><a href="tel:${data.phone}">${data.phone}</a></td></tr>
                <tr><td>Ville du bien</td><td>${data.city}</td></tr>
                <tr><td>Surface</td><td>${data.surface} m²</td></tr>
                <tr><td>Budget</td><td><strong>${budgetLabel}</strong></td></tr>
                <tr><td>Démarrage</td><td>${timelineLabel}</td></tr>
              </table>
              
              <h3>Description du projet :</h3>
              <div class="message-box">${data.message}</div>
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
  } catch (error: any) {
    console.error("[send-quote-confirmation] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
