import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Logo Qualirénovation
const logoUrl = `https://sktxyflbvfhxkaeaebnr.supabase.co/storage/v1/object/public/email-assets/logo-qualirenovation.svg`;

// Icônes base64
const whatsappIconBase64 = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAR0SURBVHgB7VlNbBtFEJ7Z9drOrxMIJFJQaQkVRSByoOJSpRIHJG6oEhcOSD1x4kSFBBIHTqByoPxISK0qVOAACIpUQCIJB8oB5dLUooS0VmKnjeM4trO7M+x6d9e74/Wuvc6vlfikvXi98877ZndmZleIWghvIWSEDDNI6TjCLuCH3AEh3ApCA3gIAA1gOJTLkwAeIYoNhFDAEGBBLhCw3hgQXgdBJYCe+B8YQP8XhDRCfQB/DZQb+Aaf8HkCyP0vvwlMEvvHoB/3gT/4b5B9/H9HoDNPHOWG3gkM8AtOJGDe+B9QKf1fIxoB++x/ADQB2gH+EQJgP7wCRHHqEXj9IZDA/wEIVKv9rwNIh3SAegJ/HUCDJHAJcBNyMY0A/hxcMoC6IA4hj1AHqA/gDoPcAbgCNIYOQz0AvwLwMr4DCHV/V/L4AWjd+bSB3AcZ8D8Yg/cD8MqmXIi0GwZ6APiFX3IAzI7/+wAV4P8BwGoAnvNzoQWA/g0hwNv4bYmAWOkG/YCFVL+AHOB/AfAK/wPw2kP/xwAK7g8B4j/+l/AdQL/+P4AARf/HAArEfxEAfv3/BbIjAP8PAPAX/J8D1P6/j0D/DcC/9n8dIPb/HEA6IPAcoDz8D2AwPxSAWvyHAMBTQN4BqP+/B9Dx/88BLr/9t0bglv+7AFDB/wFAhfgvAhC7/18BlP9/B1D/f2cAVPAfAATy3wuA0/79AUjG/x0Avvb/MID+/L8AIO8BUuf/XQBU8F8EgGz8NwDpgEAdALIf/7cFoML/O4Fk/A8BIPT/dwFo5v+XAOR/CKD9/y6AXP6HAER5/18Akv3fAoCT/80AurH/FYC8/28A0I3/bwHI5X8LQDb+a4As/g8DSPu/DSD//x4Aof+PAFDx3wYA/wOAC0DS/0cASP/fA5D/fxcAPf7/HqD7/z8DRCQBvANA8wBe/D8GQNr/dwBA/r8LAPF/dADB/L8AIOH/EwDQ/38EoBv/twFQ/fcAIJX/bQA0+P8vAAn6PwJAq/8bAdD/fwaAwP0PAyjl/xAAov/fA6DH/+8AwNH/NQD0/x0AdP5/A4CK/98AUO7/GwAi/z8AIHf/LQCBm/8TAMTy/zYA+B8I4H8AYHf/HwGovP9bAGLu/08AsP3/CkA1/+8C0P7/HwDI+/8rgNb+fwBA9v8/A5D+fxmA1vd/B4D+/xUAJAE/AlBOf+n8fwqg7/+bAHThvwWAIPdfApDL/xsAJO5/AgB5/P8cgGz+twDk8v8wANn8bwFQ8X8IQLj/NwDo8P83AET+XwWgq//TAFT+fwuA6v8mAB3/PwWgev8PAOTifwCg+n8EgHz/9wAoyv8RABX/7wFQ+e0CkNb/swBk9X8DQGX+Vwa1/78bgM7/rwNQ+f8aAPr/7wDA+f/mALLzvw5A/v8nAZDVfwqA/P+vACj//wQAD/8vAZD7/xCAbP5vA4j8/w4A+v93Af/0/+cBVP73HaD2/y8A5P9fAsj//waAMv8vABC4/wIA/f8bAPn/HwHQ/r8BIH//XwK08v8qAKX+/wwA/f/3A8j8fxYAFfdfBSCr/0MAqv5/CkDk/98BoPv/CgCF/L8MoO//4wBq/f8SgPL/vwKg/P8mAP3/9wCq/L8fQP7/jwOQ/f8ugML/3wNQ/v8bAPr+PwZA/H8UQCH/XwKQ8z8AgMb/bwOQ/38JAI7+KwAU/f8cgMZ//P/bAwj9fw3A3/xvAhDG/+cA5O+/BkCS/0cA4vsBAIT/3wdAPAT/n/93AEj+/xcASP//O4AS/58EoM//OwBk+X8XAHr9bwLI/f87ACr/LwIg+/8BAGr/7wIg+v8yALH/DQAV/58EoH//nwAgav87AJT/n4D+F94/AoAj0QAAAABJRU5ErkJggg==`;
const instagramIconBase64 = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAApUSURBVHgB7Z1bbBRVGMe/md3tdi+0tNBKKRQKVAIIGBQvkaCgD4YYLxEJRo2Jlxcf1AfCi8GYGBNj4pPxwRtxjYkmGi8YiREjV0HkUhC5FQq03S7dbre7292ZOd+Z2dlt6WV2O9udZvf/S5rO7s5e5vzP951zZjpDhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgiprJWS9y8kZycZEQGKkOqToPigZCqQn0p2hHR30uReInQXqVD5qZQM2QjQE6JJ3Q+oPLdtR+6T67SIUFEp2S3gKZ1B3AGxMXuFMw0pSqXynUSkPJWabqNwG0IJH2qk7fCRxIvbQjhP5SKDQnhPp1J/JpI+LE+lMpX8qFZVgKlU0kqZqZSN5MK3ZOfHrG1LnKVG80D+D2ZPpZJJL5a0O5XyjpEy8lEpD+lASM4a5edQH/J/w6n9gJAyKhxKJcvI2a7kf03pnzNXVj5k+7MfI4SQMoJIIYQQQgghhBBC3sHxoJjPpzrfj86k8RCVTP+m2r/dHxXjc4SiAl1aSQgZOxBZYyHKNUHLb2dFkqkNb2e0VfI1gB+RfK0T+8kwAb2N2WJRSSEFGUe+C09GFGoOaKGfg4vVqPaUBJQ7o6EJQCW7k6rVAKu2GglXpRL2bQeYQ5QAzjEr3ZQZl2zSKuFMSppWVbSi4SH1hm24F9MqoN3BRa+LN2wvt+UxZ7RqNQ4wgU+F+olqiUqlbMrfSMHGMlpR2P0m7LdqeAE8d3jDhOpC3k/H8LX4EKXS3xNAjF5MpUNB4nshbXcyaJUIqxTsIjJq1g+q0F/YG4Qw7AxlOH/7JLI1oNv+caqJnuAzknUBkPZhegGOxjq/4lxM59NZnkLtB+DmGSlgd2kJ3W+O5nZ+I+XBYwg/yvdDyp7nZzPO5QVLgBT8OQHEI0oJBZIKJQ6R/bz+gKfwUklVYu/oPBLAOYAkFEoqpKAM6p8I4BnJpEJRQqHkQooJ4i08R/IDPB9oCEf3/agf0H/+PJr/9bSQvwQQqn8G/cz/SJB6vWh3RH+A87P+N3z/kPkQ/XcO5p0yBQAAAABJRU5ErkJggg==`;
const houzzIconBase64 = `data:image/png;base64,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`;

const WHATSAPP_NUMBER = "33659764685";
const MATERIAL_FORM_URL = "https://renovermasalledebain.fr";
const RENOVATION_FORM_URL = "https://qualirenovation.fr/renovation-complete";

// Email HTML template
const getEmailTemplate = (content: string, name: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: 'Georgia', 'Times New Roman', serif; line-height: 1.7; color: #1a1a1a; margin: 0; padding: 0; background-color: #f8f6f3; }
    .wrapper { background-color: #f8f6f3; padding: 40px 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; overflow: hidden; }
    .header { background: #114a67; padding: 40px 30px; text-align: center; }
    .logo-image { max-width: 280px; height: auto; }
    .content { padding: 40px 35px; }
    .greeting { font-size: 22px; color: #1a1a1a; margin-bottom: 25px; font-weight: 400; }
    .greeting strong { color: #c9a961; }
    .text { color: #4a4a4a; margin: 18px 0; font-size: 15px; }
    .highlight { color: #c9a961; font-weight: 600; }
    .divider { width: 60px; height: 2px; background: linear-gradient(90deg, #c9a961, #e8d5a3); margin: 30px 0; }
    .cta-section { text-align: center; margin: 35px 0; padding: 30px; background: #114a67; }
    .cta-text { color: #ffffff; margin: 0 0 20px 0; font-size: 16px; font-style: italic; }
    .cta-button { display: inline-block; padding: 14px 35px; background: linear-gradient(135deg, #c9a961 0%, #e8d5a3 100%); color: #114a67; text-decoration: none; font-weight: 600; font-size: 13px; letter-spacing: 2px; text-transform: uppercase; margin: 10px; }
    .cta-whatsapp { display: inline-block; padding: 14px 35px; background: #25D366; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 13px; letter-spacing: 2px; text-transform: uppercase; margin: 10px; }
    .signature-section { margin-top: 35px; padding: 30px; background: #faf9f7; display: table; width: 100%; box-sizing: border-box; }
    .signature-photo { display: table-cell; vertical-align: top; width: 90px; padding-right: 25px; }
    .signature-photo img { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 3px solid #c9a961; }
    .signature-content { display: table-cell; vertical-align: middle; }
    .signature-greeting { color: #4a4a4a; font-size: 15px; margin: 0 0 8px 0; font-style: italic; }
    .signature-name { color: #1a1a1a; font-size: 18px; font-weight: 600; margin: 0 0 5px 0; }
    .signature-role { color: #c9a961; font-size: 13px; margin: 0 0 12px 0; letter-spacing: 1px; }
    .signature-phone { color: #1a1a1a; font-size: 14px; margin: 0; }
    .signature-phone a { color: #1a1a1a; text-decoration: none; font-weight: 600; }
    .footer { background: #114a67; padding: 35px; text-align: center; }
    .footer-logo { max-width: 200px; height: auto; margin-bottom: 15px; }
    .footer-divider { width: 40px; height: 1px; background: #c9a961; margin: 20px auto; }
    .footer-info { color: rgba(255,255,255,0.8); font-size: 12px; line-height: 2; font-family: Arial, sans-serif; }
    .footer-link { color: #c9a961; text-decoration: none; }
    .social-title { color: rgba(255,255,255,0.9); font-size: 14px; font-family: Arial, sans-serif; margin-bottom: 15px; }
    .social-links { margin: 20px 0; }
    .social-icon { width: 36px; height: 36px; margin: 0 8px; vertical-align: middle; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <img src="${logoUrl}" alt="Qualirénovation by Qualiconcept" class="logo-image" />
      </div>
      
      <div class="content">
        <h2 class="greeting">Bonjour <strong>${name}</strong>,</h2>
        <div class="divider"></div>
        ${content}
        
        <div class="signature-section">
          <div class="signature-photo">
            <img src="https://qualirenovation.fr/carina-profile.jpg" alt="Carina" />
          </div>
          <div class="signature-content">
            <p class="signature-greeting">À très bientôt,</p>
            <p class="signature-name">Carina</p>
            <p class="signature-role">Chargée de Projets Qualirenovation</p>
            <p class="signature-phone">📞 <a href="tel:+33659764685">+33 6 59 76 46 85</a></p>
          </div>
        </div>
      </div>
      
      <div class="footer">
        <img src="${logoUrl}" alt="Qualirénovation" class="footer-logo" />
        <div class="footer-divider"></div>
        <p class="social-title">Nos réseaux sociaux</p>
        <div class="social-links">
          <a href="https://wa.me/${WHATSAPP_NUMBER}" target="_blank" title="WhatsApp">
            <img src="${whatsappIconBase64}" alt="WhatsApp" class="social-icon" />
          </a>
          <a href="https://www.instagram.com/qualirenovation__travaux/" target="_blank" title="Instagram">
            <img src="${instagramIconBase64}" alt="Instagram" class="social-icon" />
          </a>
          <a href="https://www.houzz.fr/pro/qualiconcept/qualirenovation-by-qualiconcept" target="_blank" title="Houzz">
            <img src="${houzzIconBase64}" alt="Houzz" class="social-icon" />
          </a>
        </div>
        <p class="footer-info">
          QUALIRÉNOVATION BY QUALICONCEPT<br>
          6 rue d'Armaillé - 75017 Paris<br>
          SIRET : 85286728200034<br>
          Assuré par MIC Insurance<br>
          <a href="mailto:gestion@qualiconcept.fr" class="footer-link">gestion@qualiconcept.fr</a><br>
          <a href="https://qualirenovation.fr" class="footer-link">qualirenovation.fr</a>
        </p>
      </div>
    </div>
  </div>
</body>
</html>
`;

// Material choice follow-up email content
const getMaterialFollowupContent = () => `
<p class="text">Suite à votre demande de devis, nous souhaitions prendre de vos nouvelles concernant votre projet de rénovation.</p>

<p class="text"><span class="highlight">Avez-vous finalisé vos choix de matériaux ?</span></p>

<p class="text">La sélection des matériaux (sanitaires, robinetteries, carrelages, etc.) est une étape cruciale pour établir un devis précis et définitif.</p>

<div class="cta-section">
  <p class="cta-text">Si vos choix sont aboutis, accédez à notre formulaire de sélection :</p>
  <a href="${MATERIAL_FORM_URL}" class="cta-button">Formulaire Matériaux</a>
  
  <p class="cta-text" style="margin-top: 30px;">Besoin d'aide pour choisir ? Échangeons directement :</p>
  <a href="https://wa.me/${WHATSAPP_NUMBER}?text=Bonjour,%20j'ai%20besoin%20d'aide%20pour%20mes%20choix%20de%20matériaux" class="cta-whatsapp">💬 WhatsApp</a>
</div>

<p class="text">Notre équipe est à votre disposition pour vous accompagner dans cette réflexion et vous conseiller sur les meilleures options adaptées à votre projet et votre budget.</p>
`;

interface FollowupRequest {
  email: string;
  name: string;
  type: 'material_followup' | 'custom';
  subject?: string;
  customContent?: string;
  attachments?: Array<{
    filename: string;
    content: string; // base64
    contentType: string;
  }>;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("[send-prospect-followup] Received request:", req.method);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: FollowupRequest = await req.json();
    
    if (!data.email || !data.name || !data.type) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: email, name, type" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    let subject: string;
    let htmlContent: string;

    if (data.type === 'material_followup') {
      subject = "Où en êtes-vous dans vos choix de matériaux ? - Qualirénovation";
      htmlContent = getEmailTemplate(getMaterialFollowupContent(), data.name);
    } else if (data.type === 'custom') {
      if (!data.subject || !data.customContent) {
        return new Response(
          JSON.stringify({ error: "Custom emails require subject and customContent" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
      subject = data.subject;
      // Convert markdown-like content to HTML paragraphs
      const formattedContent = data.customContent
        .split('\n\n')
        .map(p => `<p class="text">${p.replace(/\n/g, '<br>')}</p>`)
        .join('');
      htmlContent = getEmailTemplate(formattedContent, data.name);
    } else {
      return new Response(
        JSON.stringify({ error: "Invalid email type" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Prepare attachments if any
    const emailAttachments = data.attachments?.map(att => ({
      filename: att.filename,
      content: att.content,
      type: att.contentType,
    })) || [];

    const emailResponse = await resend.emails.send({
      from: "Qualirenovation <contact@qualiconcept.fr>",
      to: [data.email],
      subject: subject,
      html: htmlContent,
      attachments: emailAttachments.length > 0 ? emailAttachments : undefined,
    });

    console.log("[send-prospect-followup] Email sent:", emailResponse);

    return new Response(
      JSON.stringify({ success: true, emailResponse }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("[send-prospect-followup] Error:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
