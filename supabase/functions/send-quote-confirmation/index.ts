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
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
            .wrapper { background-color: #f5f5f5; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 30px; text-align: center; }
            .logo { margin-bottom: 10px; }
            .logo-text { font-size: 28px; font-weight: 700; letter-spacing: 2px; margin: 0; }
            .logo-qr { color: #d4af37; }
            .logo-rest { color: #ffffff; }
            .logo-subtitle { color: #888; font-size: 12px; letter-spacing: 1px; margin-top: 5px; }
            .hero-image { width: 100%; height: auto; display: block; }
            .content { padding: 30px; }
            .greeting { font-size: 20px; color: #1a1a1a; margin-bottom: 20px; }
            .text { color: #555; margin: 15px 0; }
            .highlight { color: #d4af37; font-weight: 600; }
            .recap { background: linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%); padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #d4af37; }
            .recap-title { margin: 0 0 20px 0; color: #1a1a1a; font-size: 18px; display: flex; align-items: center; }
            .recap-title::before { content: ""; display: inline-block; width: 8px; height: 8px; background: #d4af37; border-radius: 50%; margin-right: 10px; }
            .recap-item { margin: 12px 0; display: flex; }
            .recap-label { font-weight: 600; color: #1a1a1a; min-width: 140px; }
            .recap-value { color: #555; }
            .cta-section { text-align: center; margin: 30px 0; padding: 25px; background: #1a1a1a; border-radius: 8px; }
            .cta-text { color: #ffffff; margin: 0 0 15px 0; }
            .cta-button { display: inline-block; padding: 12px 30px; background: #d4af37; color: #1a1a1a; text-decoration: none; font-weight: 600; border-radius: 4px; }
            .signature { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
            .signature-name { color: #1a1a1a; font-weight: 600; }
            .footer { background: #1a1a1a; padding: 25px; text-align: center; }
            .footer-logo { font-size: 16px; font-weight: 700; letter-spacing: 1px; margin-bottom: 10px; }
            .footer-logo .qr { color: #d4af37; }
            .footer-logo .rest { color: #ffffff; }
            .footer-info { color: #888; font-size: 11px; line-height: 1.8; }
            .footer-link { color: #d4af37; text-decoration: none; }
            .social-bar { margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="container">
              <div class="header">
                <div class="logo">
                  <p class="logo-text"><span class="logo-qr">QR</span><span class="logo-rest">ALIRÉNOVATION</span></p>
                  <p class="logo-subtitle">BY QUALICONCEPT</p>
                </div>
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
                <div class="footer-logo"><span class="qr">QR</span><span class="rest">ALIRÉNOVATION</span></div>
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
