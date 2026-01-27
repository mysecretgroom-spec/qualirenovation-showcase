import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// =============================================
// TYPES
// =============================================

interface LeadData {
  id?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  surface: string;
  budget: string;
  timeline: string;
  message: string;
}

interface RoomSelection {
  id: string;
  type: string;
  instanceNumber: number;
  data: Record<string, unknown>;
}

interface IsolationData {
  wantIsolation: string;
  isolationType?: string;
  zones?: string[];
  constraints?: string[];
  primaryGoal?: string;
  supportNeeds?: string[];
  wantFinancingInfo?: string;
}

interface SimulationData {
  propertyType: string;
  surface: string;
  constructionPeriod: string;
  city: string;
  hasArchitect: string;
  modifyLayout: string;
  projectTypes: string[];
  projectContexts: string[];
  hasDPE: string;
  occupyDuringWorks: string;
  constraints: string[];
  constraintDetails: string;
  startDate: string;
  startDateValue: string;
  endDateMax: string;
  selectedRooms: RoomSelection[];
  isolation: IsolationData;
}

interface RecapRequest {
  leadData: LeadData;
  simulationData: SimulationData;
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

const roomLabels: Record<string, string> = {
  'cuisine': 'Cuisine',
  'salle-de-bain': 'Salle de bain',
  'wc': 'WC',
  'salon-sejour': 'Salon / Séjour',
  'chambre': 'Chambre',
  'entree-couloir': 'Entrée / Couloir',
  'dressing-rangements': 'Dressing / Rangements',
  'bureau': 'Bureau',
  'autre': 'Autre pièce',
};

const projectTypeLabels: Record<string, string> = {
  'dpe': 'Amélioration DPE',
  'confort': 'Travaux de confort',
  'esthetique': 'Projet esthétique',
  'global': 'Rénovation globale',
  'valorisation': 'Valorisation immobilière',
  'remise-etat': 'Remise en état',
  'accompagnement': 'Accompagnement demandé',
};

const constructionPeriodLabels: Record<string, string> = {
  'avant-1949': 'Avant 1949',
  '1949-1974': '1949-1974',
  '1975-1999': '1975-1999',
  'apres-2000': 'Après 2000',
  'ne-sais-pas': 'Ne sait pas',
};

const startDateLabels: Record<string, string> = {
  'asap': 'Dès que possible',
  'from-date': 'À partir d\'une date',
  'flexible': 'Flexible',
};

const occupyLabels: Record<string, string> = {
  'oui': 'Oui',
  'non': 'Non',
  'partiellement': 'Partiellement',
};

// =============================================
// HELPER FUNCTIONS
// =============================================

const escapeHtml = (str: string): string => 
  str.replace(/&/g, '&amp;')
     .replace(/</g, '&lt;')
     .replace(/>/g, '&gt;')
     .replace(/"/g, '&quot;')
     .replace(/'/g, '&#039;');

const formatRoomName = (type: string, instanceNumber: number): string => {
  const baseName = roomLabels[type] || type;
  return instanceNumber > 1 ? `${baseName} ${instanceNumber}` : baseName;
};

const formatRoomData = (room: RoomSelection): string => {
  const data = room.data;
  let details = '';

  if (room.type === 'salle-de-bain' && data.bathroomData) {
    const bd = data.bathroomData as Record<string, unknown>;
    if (bd.bathroomType) details += `<li>Type: ${escapeHtml(String(bd.bathroomType))}</li>`;
    if (bd.installationType) details += `<li>Installation: ${escapeHtml(String(bd.installationType))}</li>`;
    if (bd.showerTrayType) details += `<li>Receveur: ${escapeHtml(String(bd.showerTrayType))}</li>`;
    if (bd.showerDoorType) details += `<li>Paroi: ${escapeHtml(String(bd.showerDoorType))}</li>`;
    if (bd.bathtubType) details += `<li>Baignoire: ${escapeHtml(String(bd.bathtubType))}</li>`;
    if (bd.vanityType) details += `<li>Meuble: ${escapeHtml(String(bd.vanityType))}</li>`;
    if (bd.toiletType) details += `<li>WC: ${escapeHtml(String(bd.toiletType))}</li>`;
    if (Array.isArray(bd.ambiance) && bd.ambiance.length) details += `<li>Ambiance: ${bd.ambiance.map(a => escapeHtml(String(a))).join(', ')}</li>`;
    if (bd.tileType) details += `<li>Carrelage: ${escapeHtml(String(bd.tileType))}</li>`;
  } else if (room.type === 'cuisine' && data.kitchenData) {
    const kd = data.kitchenData as Record<string, unknown>;
    if (kd.layoutType) details += `<li>Implantation: ${escapeHtml(String(kd.layoutType))}</li>`;
    if (kd.cabinetType) details += `<li>Meubles: ${escapeHtml(String(kd.cabinetType))}</li>`;
    if (kd.facadeFinish) details += `<li>Finition façades: ${escapeHtml(String(kd.facadeFinish))}</li>`;
    if (kd.countertopMaterial) details += `<li>Plan de travail: ${escapeHtml(String(kd.countertopMaterial))}</li>`;
    if (kd.backsplashType) details += `<li>Crédence: ${escapeHtml(String(kd.backsplashType))}</li>`;
  } else if (data.genericRoomData) {
    const gd = data.genericRoomData as Record<string, unknown>;
    if (gd.description) details += `<li>Description: ${escapeHtml(String(gd.description))}</li>`;
    if (Array.isArray(gd.workTypes) && gd.workTypes.length) details += `<li>Travaux: ${gd.workTypes.map(w => escapeHtml(String(w))).join(', ')}</li>`;
  } else if (data.customFurnitureData) {
    const cfd = data.customFurnitureData as Record<string, unknown>;
    if (Array.isArray(cfd.furnitureType) && cfd.furnitureType.length) details += `<li>Type: ${cfd.furnitureType.map(f => escapeHtml(String(f))).join(', ')}</li>`;
    if (cfd.approach) details += `<li>Approche: ${escapeHtml(String(cfd.approach))}</li>`;
  }

  // Check for painting, flooring, electricity data
  if (data.paintingData) {
    const pd = data.paintingData as Record<string, unknown>;
    if (Array.isArray(pd.surfaces) && pd.surfaces.length) details += `<li>Peinture surfaces: ${pd.surfaces.map(s => escapeHtml(String(s))).join(', ')}</li>`;
    if (pd.finish) details += `<li>Finition peinture: ${escapeHtml(String(pd.finish))}</li>`;
  }
  if (data.flooringData) {
    const fd = data.flooringData as Record<string, unknown>;
    if (fd.floorType) details += `<li>Type de sol: ${escapeHtml(String(fd.floorType))}</li>`;
    if (fd.layingPattern) details += `<li>Pose: ${escapeHtml(String(fd.layingPattern))}</li>`;
  }

  return details || '<li>Aucun détail configuré</li>';
};

// =============================================
// EMAIL TEMPLATE
// =============================================

const generateEmailHtml = (lead: LeadData, simulation: SimulationData): string => {
  const safeName = escapeHtml(lead.name);
  const safeEmail = escapeHtml(lead.email);
  const safePhone = escapeHtml(lead.phone);
  const safeAddress = escapeHtml(lead.address);
  const safeCity = escapeHtml(lead.city || '');
  const safePostalCode = escapeHtml(lead.postalCode || '');
  const safeMessage = escapeHtml(lead.message);
  const budgetLabel = budgetLabels[lead.budget] || lead.budget;
  const timelineLabel = timelineLabels[lead.timeline] || lead.timeline;

  const projectTypesHtml = simulation.projectTypes
    .map(t => `<span style="display:inline-block;background:#114a67;color:#fff;padding:4px 12px;border-radius:20px;margin:3px;font-size:13px;">${escapeHtml(projectTypeLabels[t] || t)}</span>`)
    .join('');

  const roomsHtml = simulation.selectedRooms.map(room => `
    <div style="margin-bottom:20px;padding:15px;background:#f8f6f3;border-radius:8px;border-left:3px solid #c9a961;">
      <h4 style="margin:0 0 10px 0;color:#114a67;font-size:16px;">${escapeHtml(formatRoomName(room.type, room.instanceNumber))}</h4>
      <ul style="margin:0;padding-left:20px;color:#4a4a4a;font-size:14px;">
        ${formatRoomData(room)}
      </ul>
    </div>
  `).join('');

  const constraintsHtml = simulation.constraints.length > 0 
    ? simulation.constraints.map(c => `<span style="display:inline-block;background:#fef3cd;color:#856404;padding:4px 12px;border-radius:20px;margin:3px;font-size:13px;">${escapeHtml(c)}</span>`).join('')
    : '<span style="color:#6c757d;">Aucune contrainte signalée</span>';

  let isolationHtml = '';
  if (simulation.isolation?.wantIsolation === 'oui') {
    isolationHtml = `
      <div style="margin-top:25px;padding:20px;background:#e8f4f8;border-radius:8px;border-left:3px solid #17a2b8;">
        <h3 style="margin:0 0 15px 0;color:#114a67;font-size:18px;">🌡️ Isolation thermique</h3>
        <p style="margin:5px 0;font-size:14px;"><strong>Type:</strong> ${escapeHtml(simulation.isolation.isolationType || 'Non précisé')}</p>
        ${simulation.isolation.zones?.length ? `<p style="margin:5px 0;font-size:14px;"><strong>Zones:</strong> ${simulation.isolation.zones.map(z => escapeHtml(z)).join(', ')}</p>` : ''}
        ${simulation.isolation.primaryGoal ? `<p style="margin:5px 0;font-size:14px;"><strong>Objectif:</strong> ${escapeHtml(simulation.isolation.primaryGoal)}</p>` : ''}
      </div>
    `;
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family:'Georgia','Times New Roman',serif;line-height:1.7;color:#1a1a1a;margin:0;padding:0;background-color:#f8f6f3;">
      <div style="background-color:#f8f6f3;padding:40px 20px;">
        <div style="max-width:700px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="background:#114a67;padding:30px;text-align:center;">
            <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:400;">Nouvelle simulation de projet</h1>
            <p style="margin:10px 0 0 0;color:#c9a961;font-size:16px;">Configuration détaillée reçue</p>
          </div>

          <!-- Lead Info -->
          <div style="padding:30px;border-bottom:1px solid #e0e0e0;">
            <h2 style="margin:0 0 20px 0;color:#114a67;font-size:20px;border-bottom:2px solid #c9a961;padding-bottom:10px;display:inline-block;">👤 Informations client</h2>
            
            <table style="width:100%;border-collapse:collapse;font-size:15px;">
              <tr>
                <td style="padding:8px 15px 8px 0;color:#6c757d;width:140px;">Nom</td>
                <td style="padding:8px 0;font-weight:600;">${safeName}</td>
              </tr>
              <tr>
                <td style="padding:8px 15px 8px 0;color:#6c757d;">Email</td>
                <td style="padding:8px 0;"><a href="mailto:${safeEmail}" style="color:#114a67;">${safeEmail}</a></td>
              </tr>
              <tr>
                <td style="padding:8px 15px 8px 0;color:#6c757d;">Téléphone</td>
                <td style="padding:8px 0;"><a href="tel:${safePhone}" style="color:#114a67;">${safePhone}</a></td>
              </tr>
              <tr>
                <td style="padding:8px 15px 8px 0;color:#6c757d;">Adresse</td>
                <td style="padding:8px 0;">${safeAddress}<br/>${safePostalCode} ${safeCity}</td>
              </tr>
              <tr>
                <td style="padding:8px 15px 8px 0;color:#6c757d;">Budget</td>
                <td style="padding:8px 0;color:#c9a961;font-weight:600;">${budgetLabel}</td>
              </tr>
              <tr>
                <td style="padding:8px 15px 8px 0;color:#6c757d;">Démarrage souhaité</td>
                <td style="padding:8px 0;">${timelineLabel}</td>
              </tr>
            </table>

            <div style="margin-top:20px;padding:15px;background:#f8f6f3;border-radius:8px;">
              <p style="margin:0;font-size:14px;color:#6c757d;"><strong>Message initial:</strong></p>
              <p style="margin:10px 0 0 0;font-size:14px;">${safeMessage}</p>
            </div>
          </div>

          <!-- Project Info -->
          <div style="padding:30px;border-bottom:1px solid #e0e0e0;">
            <h2 style="margin:0 0 20px 0;color:#114a67;font-size:20px;border-bottom:2px solid #c9a961;padding-bottom:10px;display:inline-block;">🏠 Le projet</h2>
            
            <table style="width:100%;border-collapse:collapse;font-size:15px;">
              <tr>
                <td style="padding:8px 15px 8px 0;color:#6c757d;width:180px;">Type de bien</td>
                <td style="padding:8px 0;text-transform:capitalize;">${escapeHtml(simulation.propertyType || 'Non précisé')}</td>
              </tr>
              <tr>
                <td style="padding:8px 15px 8px 0;color:#6c757d;">Surface</td>
                <td style="padding:8px 0;">${escapeHtml(simulation.surface || 'Non précisé')} m²</td>
              </tr>
              <tr>
                <td style="padding:8px 15px 8px 0;color:#6c757d;">Période de construction</td>
                <td style="padding:8px 0;">${constructionPeriodLabels[simulation.constructionPeriod] || simulation.constructionPeriod || 'Non précisé'}</td>
              </tr>
              <tr>
                <td style="padding:8px 15px 8px 0;color:#6c757d;">Architecte</td>
                <td style="padding:8px 0;">${simulation.hasArchitect === 'oui' ? 'Oui' : simulation.hasArchitect === 'en-reflexion' ? 'En réflexion' : 'Non'}</td>
              </tr>
              <tr>
                <td style="padding:8px 15px 8px 0;color:#6c757d;">Modifier l'agencement</td>
                <td style="padding:8px 0;">${simulation.modifyLayout === 'oui' ? 'Oui' : 'Non'}</td>
              </tr>
              <tr>
                <td style="padding:8px 15px 8px 0;color:#6c757d;">Occupation pendant travaux</td>
                <td style="padding:8px 0;">${occupyLabels[simulation.occupyDuringWorks] || simulation.occupyDuringWorks || 'Non précisé'}</td>
              </tr>
              <tr>
                <td style="padding:8px 15px 8px 0;color:#6c757d;">Démarrage</td>
                <td style="padding:8px 0;">${startDateLabels[simulation.startDate] || simulation.startDate || 'Non précisé'}${simulation.startDateValue ? ` (${escapeHtml(simulation.startDateValue)})` : ''}</td>
              </tr>
              ${simulation.endDateMax ? `<tr>
                <td style="padding:8px 15px 8px 0;color:#6c757d;">Date de fin max</td>
                <td style="padding:8px 0;">${escapeHtml(simulation.endDateMax)}</td>
              </tr>` : ''}
            </table>

            <div style="margin-top:20px;">
              <p style="margin:0 0 10px 0;font-size:14px;color:#6c757d;font-weight:600;">Types de projet:</p>
              ${projectTypesHtml || '<span style="color:#6c757d;">Aucun type sélectionné</span>'}
            </div>

            <div style="margin-top:20px;">
              <p style="margin:0 0 10px 0;font-size:14px;color:#6c757d;font-weight:600;">Contraintes:</p>
              ${constraintsHtml}
              ${simulation.constraintDetails ? `<p style="margin:10px 0 0 0;font-size:14px;font-style:italic;">${escapeHtml(simulation.constraintDetails)}</p>` : ''}
            </div>
          </div>

          <!-- Rooms -->
          <div style="padding:30px;border-bottom:1px solid #e0e0e0;">
            <h2 style="margin:0 0 20px 0;color:#114a67;font-size:20px;border-bottom:2px solid #c9a961;padding-bottom:10px;display:inline-block;">🚪 Pièces à rénover (${simulation.selectedRooms.length})</h2>
            ${roomsHtml || '<p style="color:#6c757d;">Aucune pièce configurée</p>'}
          </div>

          <!-- Isolation -->
          ${isolationHtml}

          <!-- Footer -->
          <div style="padding:25px 30px;background:#f8f6f3;text-align:center;">
            <p style="margin:0;font-size:14px;color:#6c757d;">
              Cette simulation a été soumise le ${new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
            <p style="margin:15px 0 0 0;">
              <a href="tel:+33659764685" style="display:inline-block;background:#c9a961;color:#fff;padding:12px 25px;border-radius:25px;text-decoration:none;font-size:14px;font-weight:600;">📞 Contacter le client</a>
            </p>
          </div>

        </div>
      </div>
    </body>
    </html>
  `;
};

// =============================================
// HANDLER
// =============================================

const handler = async (req: Request): Promise<Response> => {
  console.log("[send-simulation-recap] Received request:", req.method);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { leadData, simulationData }: RecapRequest = await req.json();

    if (!leadData || !simulationData) {
      return new Response(
        JSON.stringify({ error: "Missing leadData or simulationData" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("[send-simulation-recap] Processing for:", leadData.email);

    const emailHtml = generateEmailHtml(leadData, simulationData);

    // Send to team
    const teamEmailResponse = await resend.emails.send({
      from: "Qualirenovation <contact@qualiconcept.fr>",
      to: ["contact@qualirenovation.fr", "carina@qualirenovation.fr"],
      subject: `🏠 Simulation détaillée - ${leadData.name} (${leadData.city || 'Ville non précisée'})`,
      html: emailHtml,
    });

    console.log("[send-simulation-recap] Team email sent:", teamEmailResponse);

    return new Response(
      JSON.stringify({ success: true, message: "Simulation recap sent successfully" }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: unknown) {
    console.error("[send-simulation-recap] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
