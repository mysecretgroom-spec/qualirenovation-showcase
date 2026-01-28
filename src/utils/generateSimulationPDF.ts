import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { RenovationFormData, InspirationImage, EggerReference, PlaniziaReference, FarrowBallColor } from '@/components/renovation/types';
import { LeadData } from '@/contexts/LeadContext';

interface PDFGeneratorOptions {
  leadData: LeadData;
  formData: RenovationFormData;
  includeImages?: boolean;
}

// Labels for display
const propertyTypeLabels: Record<string, string> = {
  'appartement': 'Appartement',
  'maison': 'Maison',
};

const constructionPeriodLabels: Record<string, string> = {
  'avant-1949': 'Avant 1949',
  '1949-1974': '1949-1974',
  '1975-1999': '1975-1999',
  'apres-2000': 'Après 2000',
  'ne-sais-pas': 'Ne sait pas',
};

const projectTypeLabels: Record<string, string> = {
  'dpe': 'Amélioration DPE',
  'confort': 'Travaux de confort',
  'esthetique': 'Projet esthétique',
  'global': 'Rénovation globale',
  'valorisation': 'Valorisation immobilière',
  'remise-etat': 'Remise en état',
  'accompagnement': 'Besoin d\'accompagnement',
};

const projectContextLabels: Record<string, string> = {
  'residence-principale': 'Résidence principale',
  'residence-secondaire': 'Résidence secondaire',
  'location': 'Mise en location',
  'revente': 'Préparation revente',
  'autre': 'Autre situation',
};

const roomTypeLabels: Record<string, string> = {
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

const yesNoLabels: Record<string, string> = {
  'oui': 'Oui',
  'non': 'Non',
  'en-reflexion': 'En réflexion',
  'partiellement': 'Partiellement',
  'oui-transmis': 'Oui (transmis)',
  'oui-obsolete': 'Oui (obsolète)',
  'ne-sais-pas': 'Ne sait pas',
};

const startDateLabels: Record<string, string> = {
  'asap': 'Dès que possible',
  'from-date': 'À partir d\'une date',
  'flexible': 'Flexible',
};

// Bathroom option labels
const bathroomLabels: Record<string, Record<string, string>> = {
  showerTrayType: {
    'a-poser': 'Receveur à poser',
    'encastre': 'Receveur encastré',
    'carreler': 'Receveur à carreler',
    'resine': 'Receveur résine',
  },
  showerDoorType: {
    'fixe': 'Paroi fixe',
    'battante': 'Paroi battante',
    'coulissante': 'Paroi coulissante',
    'pliante': 'Paroi pliante',
  },
  bathtubType: {
    'encastree': 'Baignoire encastrée',
    'ilot': 'Baignoire îlot',
    'angle': 'Baignoire d\'angle',
    'droite': 'Baignoire droite',
    'balneo': 'Baignoire balnéo',
  },
  bathtubScreenType: {
    'fixe': 'Pare-baignoire fixe',
    'pivotant': 'Pare-baignoire pivotant',
    'coulissant': 'Pare-baignoire coulissant',
    'rideau': 'Rideau de douche',
  },
  vanityType: {
    'vasque-seule': 'Vasque seule (plan sur mesure)',
    'suspendu': 'Meuble suspendu',
    'pieds': 'Meuble sur pieds',
  },
  mirrorType: {
    'led': 'Miroir LED intégré',
    'cadre': 'Miroir avec cadre',
    'rond': 'Miroir rond',
    'armoire': 'Armoire de toilette',
  },
  faucetFinish: {
    'chrome': 'Chrome',
    'noir-mat': 'Noir mat',
    'laiton-brosse': 'Laiton brossé',
    'or-brosse': 'Or brossé',
    'nickel-brosse': 'Nickel brossé',
    'cuivre': 'Cuivre',
  },
  toiletType: {
    'suspendu': 'WC suspendu',
    'sol': 'WC au sol',
  },
  ambiance: {
    'moderne': 'Moderne',
    'epure': 'Épuré',
    'classique': 'Classique',
    'nature': 'Nature',
    'luxe': 'Luxe',
    'zellige': 'Zellige',
    'marbre': 'Effet marbre',
    'beton-cire': 'Béton ciré',
    'terrazzo': 'Terrazzo',
    'graphique': 'Graphique',
  },
};

// Kitchen option labels
const kitchenLabels: Record<string, Record<string, string>> = {
  layoutType: {
    'lineaire': 'Linéaire',
    'l': 'En L',
    'u': 'En U',
    'ilot': 'Avec îlot',
  },
  facadeFinish: {
    'bois': 'Bois',
    'laque': 'Laqué',
    'mat': 'Mat',
    'effet-matiere': 'Effet matière',
  },
  countertopMaterial: {
    'stratifie': 'Stratifié',
    'quartz': 'Quartz',
    'ceramique': 'Céramique',
    'bois': 'Bois massif',
  },
  backsplashType: {
    'carrelage': 'Carrelage',
    'pleine-hauteur': 'Pleine hauteur (même matériau)',
    'verre': 'Verre laqué',
  },
};

// WC option labels
const wcLabels: Record<string, Record<string, string>> = {
  toiletType: {
    'suspendu': 'WC suspendu',
    'sol': 'WC au sol',
  },
  handWashType: {
    'angle': 'Lave-mains d\'angle',
    'suspendu': 'Lave-mains suspendu',
    'totem': 'Lave-mains totem',
    'plan-vasque': 'Plan vasque compact',
  },
  siphonType: {
    'design': 'Siphon design',
    'gain-place': 'Siphon gain de place',
    'classique': 'Siphon classique',
  },
};

// Brand colors - QualiRénovation blue (#114a67)
const PRIMARY_COLOR: [number, number, number] = [17, 74, 103];
const SECONDARY_COLOR: [number, number, number] = [230, 241, 248];

// Helper to load image as base64
const loadImageAsBase64 = async (url: string): Promise<string | null> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
};

// Add section title with icon
const addSectionTitle = (doc: jsPDF, title: string, y: number, icon?: string): number => {
  doc.setFillColor(...PRIMARY_COLOR);
  doc.rect(15, y, 180, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  const displayTitle = icon ? `${icon}  ${title.toUpperCase()}` : title.toUpperCase();
  doc.text(displayTitle, 20, y + 7);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  return y + 14;
};

// Add subsection title
const addSubsectionTitle = (doc: jsPDF, title: string, y: number): number => {
  doc.setFillColor(...SECONDARY_COLOR);
  doc.rect(15, y, 180, 7, 'F');
  doc.setTextColor(...PRIMARY_COLOR);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 20, y + 5);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  return y + 10;
};

// Add key-value row
const addInfoRow = (doc: jsPDF, label: string, value: string, y: number, labelWidth: number = 55): number => {
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(80, 80, 80);
  doc.text(label, 20, y);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  
  const maxWidth = 175 - labelWidth;
  const lines = doc.splitTextToSize(value || '-', maxWidth);
  doc.text(lines, 20 + labelWidth, y);
  
  return y + (lines.length * 5) + 2;
};

// Check if we need a new page
const checkNewPage = (doc: jsPDF, currentY: number, neededSpace: number = 30): number => {
  if (currentY + neededSpace > 280) {
    doc.addPage();
    return 20;
  }
  return currentY;
};

// Add a single image with caption
const addImageWithCaption = async (
  doc: jsPDF,
  imageUrl: string,
  caption: string,
  x: number,
  y: number,
  width: number,
  height: number
): Promise<boolean> => {
  try {
    const base64 = await loadImageAsBase64(imageUrl);
    if (base64) {
      // Add subtle border
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.5);
      doc.rect(x, y, width, height);
      doc.addImage(base64, 'JPEG', x, y, width, height);
      
      // Add caption below
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      const captionLines = doc.splitTextToSize(caption, width);
      doc.text(captionLines, x + width / 2, y + height + 3, { align: 'center' });
      doc.setTextColor(0, 0, 0);
      return true;
    }
  } catch {
    // Silent fail
  }
  return false;
};

// Add images grid with captions
const addImagesGrid = async (
  doc: jsPDF, 
  images: { url: string; caption: string }[], 
  y: number,
  cols: number = 3,
  imgWidth: number = 55,
  imgHeight: number = 40
): Promise<number> => {
  if (!images || images.length === 0) return y;
  
  let currentY = y;
  const margin = 5;
  const startX = 20;
  
  for (let i = 0; i < images.length; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    
    if (col === 0 && row > 0) {
      currentY = checkNewPage(doc, currentY + imgHeight + 12, imgHeight + 20);
    }
    
    const x = startX + col * (imgWidth + margin);
    const imgY = currentY;
    
    await addImageWithCaption(doc, images[i].url, images[i].caption, x, imgY, imgWidth, imgHeight);
  }
  
  const totalRows = Math.ceil(images.length / cols);
  return currentY + totalRows * (imgHeight + 15);
};

// Add reference cards (EGGER, Planizia, F&B)
const addReferenceCards = async (
  doc: jsPDF,
  references: { imageUrl?: string; label: string; sublabel?: string }[],
  y: number,
  title: string
): Promise<number> => {
  if (!references || references.length === 0) return y;
  
  let currentY = checkNewPage(doc, y, 50);
  
  // Subsection title
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...PRIMARY_COLOR);
  doc.text(title, 20, currentY);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  currentY += 5;
  
  const cardWidth = 40;
  const cardHeight = 35;
  const cols = 4;
  const margin = 5;
  
  for (let i = 0; i < references.length; i++) {
    const col = i % cols;
    if (col === 0 && i > 0) {
      currentY = checkNewPage(doc, currentY + cardHeight + 10, cardHeight + 15);
    }
    
    const x = 20 + col * (cardWidth + margin);
    const ref = references[i];
    
    // Card background
    doc.setFillColor(250, 250, 250);
    doc.setDrawColor(220, 220, 220);
    doc.roundedRect(x, currentY, cardWidth, cardHeight, 2, 2, 'FD');
    
    if (ref.imageUrl) {
      try {
        const base64 = await loadImageAsBase64(ref.imageUrl);
        if (base64) {
          doc.addImage(base64, 'JPEG', x + 2, currentY + 2, cardWidth - 4, 20);
        }
      } catch {
        // Silent fail
      }
    }
    
    // Label
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    const labelLines = doc.splitTextToSize(ref.label, cardWidth - 4);
    doc.text(labelLines, x + cardWidth / 2, currentY + 25, { align: 'center' });
    
    if (ref.sublabel) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6);
      doc.setTextColor(100, 100, 100);
      doc.text(ref.sublabel, x + cardWidth / 2, currentY + 31, { align: 'center' });
      doc.setTextColor(0, 0, 0);
    }
  }
  
  const totalRows = Math.ceil(references.length / cols);
  return currentY + totalRows * (cardHeight + 5) + 5;
};

// Format bathroom data with images
const formatBathroomDataWithImages = (data: any): { rows: string[][]; images: { url: string; caption: string }[] } => {
  const rows: string[][] = [];
  const images: { url: string; caption: string }[] = [];
  
  // Map selection values to images (these would need actual image URLs from assets)
  const getLabel = (category: string, value: string) => bathroomLabels[category]?.[value] || value;
  
  if (data.bathroomType) rows.push(['Configuration', data.bathroomType === 'douche' ? 'Douche' : data.bathroomType === 'baignoire' ? 'Baignoire' : 'Douche + Baignoire']);
  if (data.showerTrayType) rows.push(['Receveur de douche', getLabel('showerTrayType', data.showerTrayType)]);
  if (data.showerDoorType) rows.push(['Paroi de douche', getLabel('showerDoorType', data.showerDoorType)]);
  if (data.bathtubType) rows.push(['Type de baignoire', getLabel('bathtubType', data.bathtubType)]);
  if (data.bathtubScreenType) rows.push(['Pare-baignoire', getLabel('bathtubScreenType', data.bathtubScreenType)]);
  if (data.vanityType) rows.push(['Meuble vasque', getLabel('vanityType', data.vanityType)]);
  if (data.vanityCount) rows.push(['Nombre de vasques', data.vanityCount === '1' ? 'Simple vasque' : 'Double vasque']);
  if (data.mirrorType) rows.push(['Miroir', getLabel('mirrorType', data.mirrorType)]);
  if (data.showerFaucetType) rows.push(['Robinetterie douche', data.showerFaucetType === 'apparente' ? 'Apparente' : 'Encastrée']);
  if (data.faucetFinish) rows.push(['Finition robinetterie', getLabel('faucetFinish', data.faucetFinish)]);
  if (data.toiletType) rows.push(['WC', getLabel('toiletType', data.toiletType)]);
  if (data.ambiance?.length > 0) rows.push(['Ambiances', data.ambiance.map((a: string) => getLabel('ambiance', a)).join(', ')]);
  if (data.tileTypes?.length > 0) rows.push(['Types de carrelage', data.tileTypes.join(', ')]);
  if (data.tileFormat) rows.push(['Format carrelage', data.tileFormat]);
  if (data.certaintyLevel) rows.push(['Niveau de certitude', data.certaintyLevel === 'sur' ? 'Sûr de mes choix' : data.certaintyLevel === 'besoin-conseil' ? 'Besoin de conseils' : 'À définir']);
  
  return { rows, images };
};

// Format kitchen data
const formatKitchenDataWithImages = (data: any): { rows: string[][]; images: { url: string; caption: string }[] } => {
  const rows: string[][] = [];
  const images: { url: string; caption: string }[] = [];
  
  const getLabel = (category: string, value: string) => kitchenLabels[category]?.[value] || value;
  
  if (data.layoutType) rows.push(['Implantation', getLabel('layoutType', data.layoutType)]);
  if (data.facadeFinish) rows.push(['Finition façades', getLabel('facadeFinish', data.facadeFinish)]);
  if (data.hasHandles) rows.push(['Poignées', data.hasHandles === 'oui' ? 'Avec poignées' : 'Sans poignées (push-to-open)']);
  if (data.countertopMaterial) rows.push(['Plan de travail', getLabel('countertopMaterial', data.countertopMaterial)]);
  if (data.backsplashType) rows.push(['Crédence', getLabel('backsplashType', data.backsplashType)]);
  if (data.backsplashTileType) rows.push(['Type carrelage crédence', data.backsplashTileType]);
  if (data.certaintyLevel) rows.push(['Niveau de certitude', data.certaintyLevel === 'sur' ? 'Sûr de mes choix' : 'Besoin de conseils']);
  
  return { rows, images };
};

// Format WC data
const formatWCDataWithImages = (data: any): { rows: string[][]; images: { url: string; caption: string }[] } => {
  const rows: string[][] = [];
  const images: { url: string; caption: string }[] = [];
  
  const getLabel = (category: string, value: string) => wcLabels[category]?.[value] || value;
  
  if (data.toiletType) rows.push(['Type de WC', getLabel('toiletType', data.toiletType)]);
  if (data.existingSanibroyeur) rows.push(['Sanibroyeur existant', yesNoLabels[data.existingSanibroyeur] || data.existingSanibroyeur]);
  if (data.wantHandWash) rows.push(['Lave-mains souhaité', yesNoLabels[data.wantHandWash] || data.wantHandWash]);
  if (data.handWashType) rows.push(['Type de lave-mains', getLabel('handWashType', data.handWashType)]);
  if (data.faucetFinish) rows.push(['Finition robinetterie', bathroomLabels.faucetFinish?.[data.faucetFinish] || data.faucetFinish]);
  if (data.siphonType) rows.push(['Type de siphon', getLabel('siphonType', data.siphonType)]);
  
  return { rows, images };
};

// Main PDF generation function
export const generateSimulationPDF = async ({
  leadData,
  formData,
  includeImages = true,
}: PDFGeneratorOptions): Promise<Blob> => {
  const doc = new jsPDF();
  let y = 20;
  
  // ========== HEADER ==========
  doc.setFillColor(...PRIMARY_COLOR);
  doc.rect(0, 0, 210, 45, 'F');
  
  // Load and add logo
  try {
    const logoUrl = '/logo-qualirenovation-email.png';
    const logoBase64 = await loadImageAsBase64(logoUrl);
    if (logoBase64) {
      // Add logo centered in header (adjust dimensions as needed)
      doc.addImage(logoBase64, 'PNG', 75, 5, 60, 20);
    }
  } catch (e) {
    // Fallback: just text if logo fails
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('QUALIRENOVATION', 105, 18, { align: 'center' });
  }
  
  doc.setFontSize(13);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(255, 255, 255);
  doc.text('Dossier de Simulation de Projet', 105, 32, { align: 'center' });
  
  // Client name badge
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(60, 37, 90, 10, 2, 2, 'F');
  doc.setTextColor(...PRIMARY_COLOR);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(leadData.name || 'Client', 105, 43.5, { align: 'center' });
  
  doc.setTextColor(0, 0, 0);
  y = 55;
  
  // Date
  doc.setFontSize(9);
  doc.setTextColor(128, 128, 128);
  doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}`, 195, 53, { align: 'right' });
  doc.setTextColor(0, 0, 0);
  
  // ========== CLIENT INFO ==========
  y = addSectionTitle(doc, 'Informations Client', y, '👤');
  
  // Two columns for client info
  const col1X = 20;
  const col2X = 110;
  let col1Y = y;
  let col2Y = y;
  
  if (leadData.name) { doc.setFontSize(10); doc.setFont('helvetica', 'bold'); doc.text('Nom :', col1X, col1Y); doc.setFont('helvetica', 'normal'); doc.text(leadData.name, col1X + 30, col1Y); col1Y += 6; }
  if (leadData.email) { doc.setFont('helvetica', 'bold'); doc.text('Email :', col1X, col1Y); doc.setFont('helvetica', 'normal'); doc.text(leadData.email, col1X + 30, col1Y); col1Y += 6; }
  if (leadData.phone) { doc.setFont('helvetica', 'bold'); doc.text('Téléphone :', col1X, col1Y); doc.setFont('helvetica', 'normal'); doc.text(leadData.phone, col1X + 30, col1Y); col1Y += 6; }
  
  if (formData.city) { doc.setFont('helvetica', 'bold'); doc.text('Ville :', col2X, col2Y); doc.setFont('helvetica', 'normal'); doc.text(formData.city, col2X + 30, col2Y); col2Y += 6; }
  if (formData.surface) { doc.setFont('helvetica', 'bold'); doc.text('Surface :', col2X, col2Y); doc.setFont('helvetica', 'normal'); doc.text(`${formData.surface} m²`, col2X + 30, col2Y); col2Y += 6; }
  if (leadData.budget) { doc.setFont('helvetica', 'bold'); doc.text('Budget :', col2X, col2Y); doc.setFont('helvetica', 'normal'); doc.text(leadData.budget, col2X + 30, col2Y); col2Y += 6; }
  
  y = Math.max(col1Y, col2Y) + 5;
  
  // ========== PROJECT SUMMARY BOX ==========
  y = checkNewPage(doc, y, 45);
  
  doc.setFillColor(...SECONDARY_COLOR);
  doc.roundedRect(15, y, 180, 35, 3, 3, 'F');
  
  let boxY = y + 8;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...PRIMARY_COLOR);
  doc.text('Résumé du Projet', 20, boxY);
  doc.setTextColor(0, 0, 0);
  boxY += 7;
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  
  const summaryItems = [];
  if (formData.propertyType) summaryItems.push(propertyTypeLabels[formData.propertyType] || formData.propertyType);
  if (formData.surface) summaryItems.push(`${formData.surface} m²`);
  if (formData.constructionPeriod) summaryItems.push(constructionPeriodLabels[formData.constructionPeriod] || formData.constructionPeriod);
  if (formData.projectTypes.length > 0) {
    summaryItems.push(formData.projectTypes.map(t => projectTypeLabels[t] || t).join(', '));
  }
  
  doc.text(summaryItems.join(' • '), 20, boxY);
  boxY += 6;
  
  if (formData.selectedRooms.length > 0) {
    const roomSummary = formData.selectedRooms.map(r => {
      const label = roomTypeLabels[r.type] || r.type;
      return r.instanceNumber > 1 ? `${label} ${r.instanceNumber}` : label;
    }).join(', ');
    doc.text(`Pièces : ${roomSummary}`, 20, boxY);
  }
  
  y += 42;
  
  // ========== PROJECT DETAILS ==========
  y = checkNewPage(doc, y, 50);
  y = addSectionTitle(doc, 'Détails du Projet', y, '📋');
  
  if (formData.propertyType) y = addInfoRow(doc, 'Type de bien', propertyTypeLabels[formData.propertyType] || formData.propertyType, y);
  if (formData.constructionPeriod) y = addInfoRow(doc, 'Période de construction', constructionPeriodLabels[formData.constructionPeriod] || formData.constructionPeriod, y);
  if (formData.hasArchitect) y = addInfoRow(doc, 'Architecte', yesNoLabels[formData.hasArchitect] || formData.hasArchitect, y);
  if (formData.modifyLayout) y = addInfoRow(doc, 'Modification agencement', yesNoLabels[formData.modifyLayout] || formData.modifyLayout, y);
  
  if (formData.projectContexts.length > 0) {
    y = addInfoRow(doc, 'Contexte', formData.projectContexts.map(c => projectContextLabels[c] || c).join(', '), y);
  }
  
  if (formData.hasDPE) y = addInfoRow(doc, 'DPE disponible', yesNoLabels[formData.hasDPE] || formData.hasDPE, y);
  if (formData.occupyDuringWorks) y = addInfoRow(doc, 'Occupation pendant travaux', yesNoLabels[formData.occupyDuringWorks] || formData.occupyDuringWorks, y);
  
  if (formData.constraints.length > 0) {
    y = addInfoRow(doc, 'Contraintes', formData.constraints.join(', '), y);
  }
  if (formData.constraintDetails) {
    y = addInfoRow(doc, 'Détails contraintes', formData.constraintDetails, y);
  }
  
  if (formData.startDate) {
    let startInfo = startDateLabels[formData.startDate] || formData.startDate;
    if (formData.startDateValue) startInfo += ` (${formData.startDateValue})`;
    y = addInfoRow(doc, 'Date de début souhaitée', startInfo, y);
  }
  if (formData.endDateMax) y = addInfoRow(doc, 'Date de fin impérative', formData.endDateMax, y);
  
  y += 5;
  
  // ========== GLOBAL WORKS ==========
  const hasGlobalWorks = formData.needsGlobalPainting === 'oui' || 
                         formData.needsGlobalFlooring === 'oui' || 
                         formData.needsGlobalElectricity === 'oui' ||
                         formData.needsGlobalMouldings === 'oui' ||
                         formData.needsGlobalFurniture === 'oui';
  
  if (hasGlobalWorks) {
    y = checkNewPage(doc, y, 60);
    y = addSectionTitle(doc, 'Travaux Transversaux', y, '🔧');
    
    // Global Painting with F&B colors
    if (formData.needsGlobalPainting === 'oui' && formData.globalPainting) {
      y = addSubsectionTitle(doc, '🎨 Peinture', y);
      
      if (formData.globalPainting.selectedRooms?.length > 0) {
        y = addInfoRow(doc, 'Pièces', formData.globalPainting.selectedRooms.join(', '), y, 40);
      }
      if (formData.globalPainting.finish) {
        y = addInfoRow(doc, 'Finition', formData.globalPainting.finish, y, 40);
      }
      
      // Farrow & Ball colors as visual cards
      if (includeImages && formData.globalPainting.farrowBallColors?.length > 0) {
        const fbColors = formData.globalPainting.farrowBallColors
          .filter((c: FarrowBallColor) => !c.error)
          .map((c: FarrowBallColor) => ({
            imageUrl: c.imageUrl,
            label: c.colorName || c.colorNumber,
            sublabel: c.rooms?.join(', '),
          }));
        
        if (fbColors.length > 0) {
          y = await addReferenceCards(doc, fbColors, y, 'Couleurs Farrow & Ball sélectionnées');
        }
      }
      y += 3;
    }
    
    // Global Flooring
    if (formData.needsGlobalFlooring === 'oui' && formData.globalFlooring) {
      y = checkNewPage(doc, y, 30);
      y = addSubsectionTitle(doc, '🪵 Revêtements de sol', y);
      
      if (formData.globalFlooring.selectedRooms?.length > 0) {
        y = addInfoRow(doc, 'Pièces', formData.globalFlooring.selectedRooms.join(', '), y, 40);
      }
      if (formData.globalFlooring.floorType) {
        y = addInfoRow(doc, 'Type', formData.globalFlooring.floorType === 'parquet' ? 'Parquet' : formData.globalFlooring.floorType === 'carrelage' ? 'Carrelage' : formData.globalFlooring.floorType, y, 40);
      }
      if (formData.globalFlooring.woodType) {
        y = addInfoRow(doc, 'Essence', formData.globalFlooring.woodType, y, 40);
      }
      if (formData.globalFlooring.layingPattern) {
        y = addInfoRow(doc, 'Pose', formData.globalFlooring.layingPattern, y, 40);
      }
      if (formData.globalFlooring.tileTypes?.length > 0) {
        y = addInfoRow(doc, 'Type carrelage', formData.globalFlooring.tileTypes.join(', '), y, 40);
      }
      y += 3;
    }
    
    // Global Electricity
    if (formData.needsGlobalElectricity === 'oui' && formData.globalElectricity) {
      y = checkNewPage(doc, y, 30);
      y = addSubsectionTitle(doc, '⚡ Électricité', y);
      
      if (formData.globalElectricity.selectedRooms?.length > 0) {
        y = addInfoRow(doc, 'Pièces', formData.globalElectricity.selectedRooms.join(', '), y, 40);
      }
      if (formData.globalElectricity.workType?.length > 0) {
        y = addInfoRow(doc, 'Travaux', formData.globalElectricity.workType.join(', '), y, 40);
      }
      if (formData.globalElectricity.lightingTypes?.length > 0) {
        y = addInfoRow(doc, 'Éclairages', formData.globalElectricity.lightingTypes.join(', '), y, 40);
      }
      if (formData.globalElectricity.switchStyle) {
        y = addInfoRow(doc, 'Style appareillage', formData.globalElectricity.switchStyle, y, 40);
      }
      y += 3;
    }
    
    // Global Mouldings
    if (formData.needsGlobalMouldings === 'oui' && formData.globalMouldings) {
      y = checkNewPage(doc, y, 25);
      y = addSubsectionTitle(doc, '🏛️ Moulures', y);
      
      if (formData.globalMouldings.selectedRooms?.length > 0) {
        y = addInfoRow(doc, 'Pièces', formData.globalMouldings.selectedRooms.join(', '), y, 40);
      }
      if (formData.globalMouldings.intention) {
        y = addInfoRow(doc, 'Intention', formData.globalMouldings.intention, y, 40);
      }
      y += 3;
    }
    
    // Global Furniture
    if (formData.needsGlobalFurniture === 'oui' && formData.globalFurniture) {
      y = checkNewPage(doc, y, 25);
      y = addSubsectionTitle(doc, '🪑 Aménagements sur mesure', y);
      
      if (formData.globalFurniture.selectedRooms?.length > 0) {
        y = addInfoRow(doc, 'Pièces', formData.globalFurniture.selectedRooms.join(', '), y, 40);
      }
      if (formData.globalFurniture.furnitureType?.length > 0) {
        y = addInfoRow(doc, 'Types', formData.globalFurniture.furnitureType.join(', '), y, 40);
      }
      y += 3;
    }
    
    y += 5;
  }
  
  // ========== ROOMS ==========
  for (const room of formData.selectedRooms) {
    y = checkNewPage(doc, y, 70);
    
    const roomLabel = roomTypeLabels[room.type] || room.type;
    const roomTitle = room.instanceNumber > 1 ? `${roomLabel} ${room.instanceNumber}` : roomLabel;
    const roomIcon = room.type === 'cuisine' ? '🍳' : room.type === 'salle-de-bain' ? '🚿' : room.type === 'wc' ? '🚽' : '🏠';
    
    y = addSectionTitle(doc, roomTitle, y, roomIcon);
    
    let tableData: string[][] = [];
    let eggerRefs: EggerReference[] = [];
    let planiziaRefs: PlaniziaReference[] = [];
    
    if (room.data.bathroomData) {
      const { rows } = formatBathroomDataWithImages(room.data.bathroomData);
      tableData = rows;
      eggerRefs = room.data.bathroomData.eggerReferences || [];
    } else if (room.data.kitchenData) {
      const { rows } = formatKitchenDataWithImages(room.data.kitchenData);
      tableData = rows;
      eggerRefs = room.data.kitchenData.eggerReferences || [];
      planiziaRefs = room.data.kitchenData.planiziaReferences || [];
    } else if (room.data.wcData) {
      const { rows } = formatWCDataWithImages(room.data.wcData);
      tableData = rows;
    }
    
    // Room configuration table
    if (tableData.length > 0) {
      autoTable(doc, {
        startY: y,
        head: [['Élément', 'Configuration']],
        body: tableData,
        theme: 'striped',
        headStyles: { 
          fillColor: PRIMARY_COLOR,
          fontSize: 9,
          fontStyle: 'bold',
        },
        bodyStyles: { fontSize: 9 },
        alternateRowStyles: { fillColor: [252, 250, 248] },
        columnStyles: {
          0: { cellWidth: 55, fontStyle: 'bold', textColor: [80, 80, 80] },
          1: { cellWidth: 'auto' },
        },
        margin: { left: 20, right: 20 },
      });
      
      y = (doc as any).lastAutoTable.finalY + 8;
    }
    
    // EGGER references for this room
    if (includeImages && eggerRefs.length > 0) {
      const validRefs = eggerRefs
        .filter(r => !r.error && r.imageUrl)
        .map(r => ({
          imageUrl: r.imageUrl,
          label: r.reference,
          sublabel: r.decorName,
        }));
      
      if (validRefs.length > 0) {
        y = checkNewPage(doc, y, 50);
        y = await addReferenceCards(doc, validRefs, y, '📦 Références EGGER sélectionnées');
      }
    }
    
    // Planizia references for kitchen
    if (includeImages && planiziaRefs.length > 0) {
      const validRefs = planiziaRefs
        .filter(r => !r.error && r.imageUrl)
        .map(r => ({
          imageUrl: r.imageUrl,
          label: r.reference,
          sublabel: r.brand,
        }));
      
      if (validRefs.length > 0) {
        y = checkNewPage(doc, y, 50);
        y = await addReferenceCards(doc, validRefs, y, '🪨 Références Planizia sélectionnées');
      }
    }
    
    y += 5;
  }
  
  // ========== ISOLATION ==========
  if (formData.projectTypes.includes('dpe') && formData.isolation?.wantIsolation) {
    y = checkNewPage(doc, y, 45);
    y = addSectionTitle(doc, 'Isolation', y, '🌡️');
    
    y = addInfoRow(doc, 'Souhaite isolation', yesNoLabels[formData.isolation.wantIsolation] || formData.isolation.wantIsolation, y);
    if (formData.isolation.isolationType) {
      y = addInfoRow(doc, 'Type d\'isolation', formData.isolation.isolationType, y);
    }
    if (formData.isolation.zones?.length > 0) {
      y = addInfoRow(doc, 'Zones concernées', formData.isolation.zones.join(', '), y);
    }
    if (formData.isolation.primaryGoal) {
      y = addInfoRow(doc, 'Objectif principal', formData.isolation.primaryGoal, y);
    }
    
    y += 5;
  }
  
  // ========== GLOBAL INSPIRATION IMAGES ==========
  if (includeImages && formData.inspirationImages && formData.inspirationImages.length > 0) {
    y = checkNewPage(doc, y, 70);
    y = addSectionTitle(doc, 'Photos d\'Inspiration', y, '📸');
    
    const inspirationImagesForPdf = formData.inspirationImages.map((img: InspirationImage) => ({
      url: img.url,
      caption: img.fileName || 'Inspiration',
    }));
    
    y = await addImagesGrid(doc, inspirationImagesForPdf, y, 3, 55, 40);
  }
  
  // ========== FOOTER ON EACH PAGE ==========
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    // Footer line
    doc.setDrawColor(...PRIMARY_COLOR);
    doc.setLineWidth(0.5);
    doc.line(15, 287, 195, 287);
    
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `QualiRénovation • www.qualirenovation.fr`,
      20, 
      292
    );
    doc.text(
      `Page ${i}/${pageCount}`,
      190, 
      292,
      { align: 'right' }
    );
  }
  
  return doc.output('blob');
};

// Helper to trigger download
export const downloadSimulationPDF = async (options: PDFGeneratorOptions, fileName?: string): Promise<void> => {
  const blob = await generateSimulationPDF(options);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName || `simulation-${options.leadData.name.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Helper to upload PDF to storage
export const uploadSimulationPDF = async (
  clientId: string, 
  options: PDFGeneratorOptions
): Promise<{ success: boolean; filePath?: string }> => {
  try {
    const blob = await generateSimulationPDF(options);
    const fileName = `simulation-${new Date().toISOString().split('T')[0]}.pdf`;
    const filePath = `${clientId}/Simulation/${Date.now()}_${fileName}`;
    
    const { supabase } = await import('@/integrations/supabase/client');
    
    const { error: uploadError } = await supabase.storage
      .from('client-files')
      .upload(filePath, blob, {
        contentType: 'application/pdf',
        upsert: false,
      });
    
    if (uploadError) {
      console.error('Error uploading PDF:', uploadError);
      return { success: false };
    }
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    // Save file reference to database
    const { error: dbError } = await supabase.from('client_files').insert({
      client_id: clientId,
      file_name: `[Simulation] ${fileName}`,
      file_path: filePath,
      file_type: 'application/pdf',
      file_size: blob.size,
      uploaded_by: user?.id || null,
    });
    
    if (dbError) {
      console.error('Error saving PDF reference:', dbError);
      return { success: false };
    }
    
    return { success: true, filePath };
  } catch (error) {
    console.error('Error generating/uploading PDF:', error);
    return { success: false };
  }
};
