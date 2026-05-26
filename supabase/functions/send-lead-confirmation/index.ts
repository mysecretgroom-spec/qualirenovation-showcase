import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const escapeHtml = (str: string) =>
  str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

interface LeadPayload {
  name?: string;
  email?: string;
  phone?: string;
  resourceLabel?: string;
  marketingConsent?: boolean;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = (await req.json()) as LeadPayload;
    const name = (body.name || "").toString().trim().slice(0, 100);
    const email = (body.email || "").toString().trim().toLowerCase().slice(0, 255);
    const phone = (body.phone || "").toString().trim().slice(0, 25);
    const resourceLabel = (body.resourceLabel || "votre guide PDF").toString().slice(0, 200);
    const marketingConsent = !!body.marketingConsent;

    if (!name || name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !phone) {
      return new Response(JSON.stringify({ error: "Invalid payload" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const safeName = escapeHtml(name);
    const safeResource = escapeHtml(resourceLabel);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone);

    const logoUrl = `https://sktxyflbvfhxkaeaebnr.supabase.co/storage/v1/object/public/email-assets/logo-qualirenovation.svg`;

    // Confirmation email to client
    const clientHtml = `
      <!DOCTYPE html>
      <html lang="fr">
      <head><meta charset="utf-8" /></head>
      <body style="margin:0;padding:0;background:#f8f6f3;font-family:Georgia,'Times New Roman',serif;color:#1a1a1a;">
        <div style="background:#f8f6f3;padding:40px 20px;">
          <div style="max-width:600px;margin:0 auto;background:#ffffff;">
            <div style="background:#114a67;padding:32px 24px;text-align:center;">
              <img src="${logoUrl}" alt="QUALIRENOVATION" style="max-width:260px;height:auto;" />
              <p style="color:#e6f1f8;font-style:italic;margin:12px 0 0;letter-spacing:2px;font-size:13px;">L'ART DE RÉNOVER</p>
            </div>
            <div style="padding:36px 32px;">
              <h1 style="margin:0 0 20px;font-size:24px;color:#114a67;font-weight:400;">Merci ${safeName},</h1>
              <p style="font-size:15px;line-height:1.7;color:#333;margin:0 0 16px;">
                Votre téléchargement de <strong>« ${safeResource} »</strong> a bien été enregistré.
                Le document s'est ouvert dans votre navigateur — n'hésitez pas à le conserver précieusement.
              </p>
              <div style="background:#faf9f7;border-left:3px solid #114a67;padding:20px 24px;margin:24px 0;">
                <p style="margin:0 0 10px;font-size:14px;color:#114a67;font-weight:600;letter-spacing:1px;text-transform:uppercase;">Récapitulatif</p>
                <p style="margin:6px 0;font-size:14px;color:#333;"><strong>Nom :</strong> ${safeName}</p>
                <p style="margin:6px 0;font-size:14px;color:#333;"><strong>Email :</strong> ${safeEmail}</p>
                <p style="margin:6px 0;font-size:14px;color:#333;"><strong>Téléphone :</strong> ${safePhone}</p>
                <p style="margin:6px 0;font-size:14px;color:#333;"><strong>Ressource :</strong> ${safeResource}</p>
              </div>
              <div style="background:#114a67;color:#ffffff;padding:24px;margin:24px 0;text-align:center;">
                <p style="margin:0 0 8px;font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#e6f1f8;">Prochaine étape</p>
                <p style="margin:0;font-size:17px;line-height:1.5;">
                  Notre équipe vous recontacte sous <strong>48 heures ouvrées</strong><br />
                  pour échanger sur votre projet de rénovation.
                </p>
              </div>
              <p style="font-size:14px;color:#666;margin:24px 0 0;line-height:1.6;">
                Une question urgente&nbsp;? Joignez-nous directement par WhatsApp au
                <a href="https://wa.me/33659764685" style="color:#114a67;font-weight:600;text-decoration:none;">+33 6 59 76 46 85</a>.
              </p>
              ${marketingConsent ? `<p style="font-size:13px;color:#888;margin-top:24px;font-style:italic;">Vous recevrez également nos inspirations et conseils rénovation. Désinscription possible à tout moment.</p>` : ""}
            </div>
            <div style="background:#0d3a52;color:#a8c5d4;padding:24px;text-align:center;font-size:12px;font-family:Arial,sans-serif;line-height:1.6;">
              <p style="margin:0 0 6px;color:#ffffff;font-weight:600;">QUALIRENOVATION by QUALICONCEPT</p>
              <p style="margin:0;">6 rue d'Armaillé, 75017 Paris — SIRET : 85286728200034</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const clientRes = await resend.emails.send({
      from: "Qualirenovation <contact@qualiconcept.fr>",
      to: [email],
      subject: "Votre téléchargement est confirmé — Qualirénovation",
      html: clientHtml,
    });

    // Internal notification
    try {
      await resend.emails.send({
        from: "Qualirenovation <contact@qualiconcept.fr>",
        to: ["contact@qualiconcept.fr"],
        subject: `Nouveau lead PDF : ${name}`,
        html: `<p>Nouveau téléchargement de ressource.</p>
          <ul>
            <li><strong>Nom :</strong> ${safeName}</li>
            <li><strong>Email :</strong> ${safeEmail}</li>
            <li><strong>Téléphone :</strong> ${safePhone}</li>
            <li><strong>Ressource :</strong> ${safeResource}</li>
            <li><strong>Consentement marketing :</strong> ${marketingConsent ? "Oui" : "Non"}</li>
          </ul>`,
      });
    } catch (e) {
      console.error("[send-lead-confirmation] Internal notify failed:", e);
    }

    return new Response(JSON.stringify({ success: true, id: clientRes.data?.id }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("[send-lead-confirmation] Error:", error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});