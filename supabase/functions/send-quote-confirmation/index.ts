import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

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

    const budgetLabel = budgetLabels[data.budget] || data.budget;
    const timelineLabel = timelineLabels[data.timeline] || data.timeline;

    // Email to client (confirmation)
    const clientEmailResponse = await resend.emails.send({
      from: "Qualirenovation <contact@qualiconcept.fr>",
      to: [data.email],
      subject: "Votre demande de devis a bien été reçue - Qualirenovation",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1a1a1a 0%, #333 100%); color: #fff; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; color: #d4af37; }
            .content { padding: 30px; background: #fff; }
            .recap { background: #f8f8f8; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .recap h3 { margin-top: 0; color: #1a1a1a; border-bottom: 2px solid #d4af37; padding-bottom: 10px; }
            .recap-item { margin: 10px 0; }
            .recap-label { font-weight: 600; color: #666; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .gold { color: #d4af37; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>QUALIRENOVATION</h1>
              <p style="margin: 10px 0 0; opacity: 0.9;">Rénovation d'excellence à Paris</p>
            </div>
            <div class="content">
              <h2>Bonjour ${data.name},</h2>
              <p>Nous avons bien reçu votre demande de devis et nous vous en remercions.</p>
              <p>Notre équipe étudie votre projet et vous recontactera <strong>sous 48 heures</strong> avec une proposition personnalisée.</p>
              
              <div class="recap">
                <h3>Récapitulatif de votre demande</h3>
                <div class="recap-item"><span class="recap-label">Ville :</span> ${data.city}</div>
                <div class="recap-item"><span class="recap-label">Surface :</span> ${data.surface} m²</div>
                <div class="recap-item"><span class="recap-label">Budget envisagé :</span> ${budgetLabel}</div>
                <div class="recap-item"><span class="recap-label">Démarrage souhaité :</span> ${timelineLabel}</div>
                <div class="recap-item"><span class="recap-label">Description :</span> ${data.message}</div>
              </div>

              <p>En attendant, n'hésitez pas à consulter nos <a href="https://qualirenovation.fr/#realisations" class="gold">réalisations</a> pour découvrir notre savoir-faire.</p>
              
              <p>À très bientôt,<br><strong>L'équipe Qualirenovation</strong></p>
            </div>
            <div class="footer">
              <p>QUALIRENOVATION BY QUALICONCEPT<br>
              SIRET : 85286728200034<br>
              contact@qualiconcept.fr</p>
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
