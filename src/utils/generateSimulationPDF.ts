import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { RenovationFormData, InspirationImage, EggerReference, PlaniziaReference, FarrowBallColor } from '@/components/renovation/types';
import { LeadData } from '@/contexts/LeadContext';
import { supabase } from '@/integrations/supabase/client';

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

// Helper to load image as base64 with dimensions
const loadImageAsBase64WithDimensions = async (url: string): Promise<{ base64: string; width: number; height: number } | null> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        // Create image to get natural dimensions
        const img = new Image();
        img.onload = () => resolve({ base64, width: img.naturalWidth, height: img.naturalHeight });
        img.onerror = () => resolve({ base64, width: 300, height: 100 }); // Default fallback
        img.src = base64;
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
};

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

// Strip HTML tags from text
const stripHtml = (text: string): string => {
  if (!text) return '';
  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
    .replace(/&amp;/g, '&') // Replace &amp; with &
    .replace(/&lt;/g, '<') // Replace &lt; with <
    .replace(/&gt;/g, '>') // Replace &gt; with >
    .replace(/&quot;/g, '"') // Replace &quot; with "
    .replace(/&#39;/g, "'") // Replace &#39; with '
    .trim();
};

// Add section title (no emojis - jsPDF has limited unicode support)
const addSectionTitle = (doc: jsPDF, title: string, y: number): number => {
  const cleanTitle = stripHtml(title);
  doc.setFillColor(...PRIMARY_COLOR);
  doc.rect(15, y, 180, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(cleanTitle.toUpperCase(), 20, y + 7);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  return y + 14;
};

// Add subsection title
const addSubsectionTitle = (doc: jsPDF, title: string, y: number): number => {
  const cleanTitle = stripHtml(title);
  doc.setFillColor(...SECONDARY_COLOR);
  doc.rect(15, y, 180, 7, 'F');
  doc.setTextColor(...PRIMARY_COLOR);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(cleanTitle, 20, y + 5);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  return y + 10;
};

// Add key-value row
const addInfoRow = (doc: jsPDF, label: string, value: string, y: number, labelWidth: number = 55): number => {
  const cleanLabel = stripHtml(label);
  const cleanValue = stripHtml(value);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(80, 80, 80);
  doc.text(cleanLabel, 20, y);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  
  const maxWidth = 175 - labelWidth;
  const lines = doc.splitTextToSize(cleanValue || '-', maxWidth);
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

// Add reference cards (EGGER, Planizia, F&B) with color swatches
const addReferenceCards = async (
  doc: jsPDF,
  references: { imageUrl?: string; hexColor?: string; label: string; sublabel?: string }[],
  y: number,
  title: string
): Promise<number> => {
  if (!references || references.length === 0) return y;
  
  let currentY = checkNewPage(doc, y, 60);
  
  // Subsection title with icon
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...PRIMARY_COLOR);
  doc.text(title, 20, currentY);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  currentY += 8;
  
  const cardWidth = 42;
  const cardHeight = 50;
  const cols = 4;
  const margin = 6;
  const swatchHeight = 28;
  
  for (let i = 0; i < references.length; i++) {
    const col = i % cols;
    if (col === 0 && i > 0) {
      currentY = checkNewPage(doc, currentY + cardHeight + 8, cardHeight + 15);
    }
    
    const x = 18 + col * (cardWidth + margin);
    const ref = references[i];
    
    // Card shadow effect
    doc.setFillColor(235, 235, 235);
    doc.roundedRect(x + 1, currentY + 1, cardWidth, cardHeight, 3, 3, 'F');
    
    // Card background
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(200, 200, 200);
    doc.roundedRect(x, currentY, cardWidth, cardHeight, 3, 3, 'FD');
    
    // Try to add image swatch first
    let hasVisual = false;
    if (ref.imageUrl) {
      try {
        const base64 = await loadImageAsBase64(ref.imageUrl);
        if (base64) {
          // Clip to rounded rectangle area
          doc.addImage(base64, 'JPEG', x + 2, currentY + 2, cardWidth - 4, swatchHeight);
          hasVisual = true;
        }
      } catch {
        // Try hex color fallback
      }
    }
    
    // If no image, try hex color swatch
    if (!hasVisual && ref.hexColor) {
      const hex = ref.hexColor.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      
      doc.setFillColor(r, g, b);
      doc.roundedRect(x + 2, currentY + 2, cardWidth - 4, swatchHeight, 2, 2, 'F');
      hasVisual = true;
    }
    
    // If still no visual, show placeholder
    if (!hasVisual) {
      doc.setFillColor(245, 245, 245);
      doc.roundedRect(x + 2, currentY + 2, cardWidth - 4, swatchHeight, 2, 2, 'F');
      doc.setFontSize(6);
      doc.setTextColor(180, 180, 180);
      doc.text('Aperçu non disponible', x + cardWidth / 2, currentY + swatchHeight / 2 + 2, { align: 'center' });
      doc.setTextColor(0, 0, 0);
    }
    
    // Label (reference name)
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(50, 50, 50);
    const labelLines = doc.splitTextToSize(ref.label || 'Référence', cardWidth - 4);
    doc.text(labelLines.slice(0, 2), x + cardWidth / 2, currentY + swatchHeight + 6, { align: 'center' });
    
    // Sublabel (rooms or brand)
    if (ref.sublabel) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6);
      doc.setTextColor(120, 120, 120);
      const sublabelLines = doc.splitTextToSize(ref.sublabel, cardWidth - 4);
      doc.text(sublabelLines.slice(0, 1), x + cardWidth / 2, currentY + swatchHeight + 14, { align: 'center' });
      doc.setTextColor(0, 0, 0);
    }
  }
  
  const totalRows = Math.ceil(references.length / cols);
  return currentY + totalRows * (cardHeight + 8) + 5;
};

// Image URL mappings for visual selections
const bathroomImageMappings: Record<string, Record<string, string>> = {
  showerTrayType: {
    'a-poser': '/assets/bathroom/receveur-a-poser.jpg',
    'encastre': '/assets/bathroom/receveur-encastre.jpg',
    'carreler': '/assets/bathroom/receveur-carreler.jpg',
    'resine': '/assets/bathroom/receveur-resine.jpg',
  },
  showerDoorType: {
    'fixe': '/assets/bathroom/paroi-fixe.jpg',
    'battante': '/assets/bathroom/paroi-battante.jpg',
    'coulissante': '/assets/bathroom/paroi-coulissante.jpg',
    'pliante': '/assets/bathroom/paroi-pliante.jpg',
  },
  bathtubType: {
    'encastree': '/assets/bathroom/baignoire-encastree.jpg',
    'ilot': '/assets/bathroom/baignoire-ilot.jpg',
    'angle': '/assets/bathroom/baignoire-angle.jpg',
    'droite': '/assets/bathroom/baignoire-droite.jpg',
    'balneo': '/assets/bathroom/baignoire-balneo.jpg',
  },
  bathtubScreenType: {
    'fixe': '/assets/bathroom/pare-bain-fixe.jpg',
    'pivotant': '/assets/bathroom/pare-bain-pivotant.jpg',
    'coulissant': '/assets/bathroom/pare-bain-coulissant.jpg',
    'rideau': '/assets/bathroom/pare-bain-rideau.jpg',
  },
  vanityType: {
    'vasque-seule': '/assets/bathroom/vasque-seule.jpg',
    'suspendu': '/assets/bathroom/meuble-suspendu.jpg',
    'pieds': '/assets/bathroom/meuble-pieds.jpg',
  },
  mirrorType: {
    'led': '/assets/bathroom/miroir-led.jpg',
    'cadre': '/assets/bathroom/miroir-cadre.jpg',
    'rond': '/assets/bathroom/miroir-rond.jpg',
    'armoire': '/assets/bathroom/miroir-armoire.jpg',
  },
  faucetFinish: {
    'chrome': '/assets/bathroom/finition-chrome-chatelet.jpg',
    'noir-mat': '/assets/bathroom/finition-noir-mat.jpg',
    'laiton-brosse': '/assets/bathroom/finition-laiton-brosse.jpg',
    'or-brosse': '/assets/bathroom/finition-or-brosse.jpg',
    'nickel-brosse': '/assets/bathroom/finition-nickel-brosse.jpg',
    'cuivre': '/assets/bathroom/finition-cuivre.jpg',
  },
  toiletType: {
    'suspendu': '/assets/bathroom/wc-suspendu.jpg',
    'sol': '/assets/bathroom/wc-sol.jpg',
  },
  showerFaucetType: {
    'apparente': '/assets/bathroom/robinetterie-apparente.jpg',
    'encastree': '/assets/bathroom/robinetterie-encastree.jpg',
  },
  showerheadType: {
    'fixe': '/assets/bathroom/pommeau-fixe.jpg',
    'douchette': '/assets/bathroom/pommeau-douchette.jpg',
    'combo': '/assets/bathroom/pommeau-combo.jpg',
  },
  ambiance: {
    'moderne': '/assets/bathroom/ambiance-moderne.jpg',
    'epure': '/assets/bathroom/ambiance-epure.jpg',
    'classique': '/assets/bathroom/ambiance-classique.jpg',
    'nature': '/assets/bathroom/ambiance-nature.jpg',
    'luxe': '/assets/bathroom/ambiance-luxe.jpg',
    'zellige': '/assets/bathroom/ambiance-zellige.jpg',
    'marbre': '/assets/bathroom/ambiance-marbre.jpg',
    'beton-cire': '/assets/bathroom/ambiance-beton-cire.jpg',
    'terrazzo': '/assets/bathroom/ambiance-terrazzo.jpg',
    'graphique': '/assets/bathroom/ambiance-graphique.jpg',
  },
};

const tileImageMappings: Record<string, string> = {
  'zellige': '/assets/flooring/carrelage-zellige-new.jpg',
  'marbre': '/assets/flooring/carrelage-marbre.jpg',
  'travertin': '/assets/flooring/carrelage-travertin.jpg',
  'pierre': '/assets/flooring/carrelage-pierre.jpg',
  'ciment': '/assets/flooring/carrelage-ciment.jpg',
  'beton': '/assets/flooring/carrelage-beton.jpg',
  'unicolore': '/assets/flooring/carrelage-unicolore.jpg',
  'terracotta': '/assets/flooring/carrelage-terracotta.jpg',
  'gres-cerame': '/assets/flooring/carrelage-gres-cerame.jpg',
  'imitation-bois': '/assets/flooring/carrelage-imitation-bois.jpg',
  'terrazzo': '/assets/flooring/carrelage-terrazzo.jpg',
  'mosaique': '/assets/flooring/carrelage-mosaique.jpg',
};

const tileFormatMappings: Record<string, string> = {
  'grand-format': '/assets/flooring/carrelage-grand-format.jpg',
  'rectangulaire': '/assets/flooring/carrelage-rectangulaire.jpg',
  'hexagonal': '/assets/flooring/carrelage-hexagonal.jpg',
  'metro': '/assets/flooring/carrelage-metro.jpg',
  'carre': '/assets/flooring/carrelage-carre.jpg',
};

// Format bathroom data with images
const formatBathroomDataWithImages = (data: any): { rows: string[][]; images: { url: string; caption: string }[] } => {
  const rows: string[][] = [];
  const images: { url: string; caption: string }[] = [];
  
  const getLabel = (category: string, value: string) => bathroomLabels[category]?.[value] || value;
  const addImage = (category: string, value: string, label: string) => {
    const url = bathroomImageMappings[category]?.[value];
    if (url) images.push({ url, caption: label });
  };
  
  if (data.bathroomType) rows.push(['Configuration', data.bathroomType === 'douche' ? 'Douche' : data.bathroomType === 'baignoire' ? 'Baignoire' : 'Douche + Baignoire']);
  
  if (data.showerTrayType) {
    const label = getLabel('showerTrayType', data.showerTrayType);
    rows.push(['Receveur de douche', label]);
    addImage('showerTrayType', data.showerTrayType, label);
  }
  if (data.showerDoorType) {
    const label = getLabel('showerDoorType', data.showerDoorType);
    rows.push(['Paroi de douche', label]);
    addImage('showerDoorType', data.showerDoorType, label);
  }
  if (data.showerheadType) {
    const label = data.showerheadType === 'fixe' ? 'Pommeau fixe' : data.showerheadType === 'douchette' ? 'Douchette' : 'Combine fixe + douchette';
    rows.push(['Pommeau de douche', label]);
    addImage('showerheadType', data.showerheadType, label);
  }
  if (data.bathtubType) {
    const label = getLabel('bathtubType', data.bathtubType);
    rows.push(['Type de baignoire', label]);
    addImage('bathtubType', data.bathtubType, label);
  }
  if (data.bathtubScreenType) {
    const label = getLabel('bathtubScreenType', data.bathtubScreenType);
    rows.push(['Pare-baignoire', label]);
    addImage('bathtubScreenType', data.bathtubScreenType, label);
  }
  if (data.vanityType) {
    const label = getLabel('vanityType', data.vanityType);
    rows.push(['Meuble vasque', label]);
    addImage('vanityType', data.vanityType, label);
  }
  if (data.vanityCount) rows.push(['Nombre de vasques', data.vanityCount === '1' ? 'Simple vasque' : 'Double vasque']);
  if (data.siphonType) rows.push(['Type de siphon', bathroomLabels.siphonType?.[data.siphonType] || data.siphonType]);
  if (data.mirrorType) {
    const label = getLabel('mirrorType', data.mirrorType);
    rows.push(['Miroir', label]);
    addImage('mirrorType', data.mirrorType, label);
  }
  if (data.showerFaucetType) {
    const label = data.showerFaucetType === 'apparente' ? 'Apparente' : 'Encastree';
    rows.push(['Robinetterie douche', label]);
    addImage('showerFaucetType', data.showerFaucetType, label);
  }
  if (data.faucetFinish) {
    const label = getLabel('faucetFinish', data.faucetFinish);
    rows.push(['Finition robinetterie', label]);
    addImage('faucetFinish', data.faucetFinish, label);
  }
  if (data.toiletType && data.toiletType !== 'conserver') {
    const label = getLabel('toiletType', data.toiletType);
    rows.push(['Toilettes', label]);
    addImage('toiletType', data.toiletType, label);
  } else if (data.toiletType === 'conserver') {
    rows.push(['Toilettes', 'Conserver existant']);
  }
  if (data.ambiance?.length > 0) {
    rows.push(['Ambiances', data.ambiance.map((a: string) => getLabel('ambiance', a)).join(', ')]);
    data.ambiance.forEach((a: string) => addImage('ambiance', a, getLabel('ambiance', a)));
  }
  if (data.tileTypes?.length > 0) {
    rows.push(['Types de carrelage', data.tileTypes.join(', ')]);
    data.tileTypes.forEach((t: string) => {
      const url = tileImageMappings[t];
      if (url) images.push({ url, caption: t });
    });
  }
  if (data.tileFormat) {
    rows.push(['Format carrelage', data.tileFormat]);
    const url = tileFormatMappings[data.tileFormat];
    if (url) images.push({ url, caption: data.tileFormat });
  }
  if (data.certaintyLevel) rows.push(['Niveau de certitude', data.certaintyLevel === 'sur' ? 'Sur de mes choix' : data.certaintyLevel === 'besoin-conseil' ? 'Besoin de conseils' : 'A definir']);
  
  return { rows, images };
};

// Siphon type labels
const siphonTypeLabels: Record<string, string> = {
  'design': 'Siphon design',
  'gain-place': 'Siphon gain de place',
  'classique': 'Siphon classique',
};

// Add siphon labels to bathroom
bathroomLabels.siphonType = siphonTypeLabels;

// Kitchen image mappings
const kitchenImageMappings: Record<string, Record<string, string>> = {
  layoutType: {
    'lineaire': '/assets/kitchen/implantation-lineaire-3d.jpg',
    'l': '/assets/kitchen/implantation-l-3d.jpg',
    'u': '/assets/kitchen/implantation-u-3d-v2.jpg',
    'ilot': '/assets/kitchen/implantation-ilot-3d.jpg',
  },
  facadeFinish: {
    'bois': '/assets/kitchen/facade-bois.jpg',
    'laque': '/assets/kitchen/facade-laque.jpg',
    'mat': '/assets/kitchen/facade-mat.jpg',
    'effet-matiere': '/assets/kitchen/facade-effet-matiere.jpg',
  },
  countertopMaterial: {
    'stratifie': '/assets/kitchen/plan-stratifie.jpg',
    'quartz': '/assets/kitchen/plan-quartz.jpg',
    'ceramique': '/assets/kitchen/plan-ceramique.jpg',
    'bois': '/assets/kitchen/plan-bois.jpg',
  },
  backsplashType: {
    'carrelage': '/assets/kitchen/credence-carrelage.jpg',
    'pleine-hauteur': '/assets/kitchen/credence-pleine-hauteur.jpg',
    'verre': '/assets/kitchen/credence-verre.jpg',
  },
};

// WC image mappings
const wcImageMappings: Record<string, Record<string, string>> = {
  toiletType: {
    'suspendu': '/assets/bathroom/wc-suspendu.jpg',
    'sol': '/assets/bathroom/wc-sol.jpg',
  },
  handWashType: {
    'angle': '/assets/wc/lave-main-angle.jpg',
    'suspendu': '/assets/wc/lave-main-suspendu.jpg',
    'totem': '/assets/wc/lave-main-totem.jpg',
    'plan-vasque': '/assets/wc/plan-vasque.jpg',
  },
  siphonType: {
    'design': '/assets/wc/siphon-design.jpg',
    'gain-place': '/assets/wc/siphon-gain-place.jpg',
    'classique': '/assets/wc/siphon-classique.jpg',
  },
};

// Format kitchen data
const formatKitchenDataWithImages = (data: any): { rows: string[][]; images: { url: string; caption: string }[] } => {
  const rows: string[][] = [];
  const images: { url: string; caption: string }[] = [];
  
  const getLabel = (category: string, value: string) => kitchenLabels[category]?.[value] || value;
  const addImage = (category: string, value: string, label: string) => {
    const url = kitchenImageMappings[category]?.[value];
    if (url) images.push({ url, caption: label });
  };
  
  if (data.layoutType) {
    const label = getLabel('layoutType', data.layoutType);
    rows.push(['Implantation', label]);
    addImage('layoutType', data.layoutType, label);
  }
  if (data.facadeFinish) {
    const label = getLabel('facadeFinish', data.facadeFinish);
    rows.push(['Finition facades', label]);
    addImage('facadeFinish', data.facadeFinish, label);
  }
  if (data.hasHandles) rows.push(['Poignees', data.hasHandles === 'oui' ? 'Avec poignees' : 'Sans poignees (push-to-open)']);
  if (data.countertopMaterial) {
    const label = getLabel('countertopMaterial', data.countertopMaterial);
    rows.push(['Plan de travail', label]);
    addImage('countertopMaterial', data.countertopMaterial, label);
  }
  if (data.backsplashType) {
    const label = getLabel('backsplashType', data.backsplashType);
    rows.push(['Credence', label]);
    addImage('backsplashType', data.backsplashType, label);
  }
  if (data.backsplashTileType) {
    rows.push(['Type carrelage credence', data.backsplashTileType]);
    const url = tileImageMappings[data.backsplashTileType];
    if (url) images.push({ url, caption: data.backsplashTileType });
  }
  if (data.certaintyLevel) rows.push(['Niveau de certitude', data.certaintyLevel === 'sur' ? 'Sur de mes choix' : 'Besoin de conseils']);
  
  return { rows, images };
};

// Format WC data
const formatWCDataWithImages = (data: any): { rows: string[][]; images: { url: string; caption: string }[] } => {
  const rows: string[][] = [];
  const images: { url: string; caption: string }[] = [];
  
  const getLabel = (category: string, value: string) => wcLabels[category]?.[value] || value;
  const addImage = (category: string, value: string, label: string) => {
    const url = wcImageMappings[category]?.[value];
    if (url) images.push({ url, caption: label });
  };
  
  if (data.toiletType) {
    const label = getLabel('toiletType', data.toiletType);
    rows.push(['Toilettes', label]);
    addImage('toiletType', data.toiletType, label);
  }
  if (data.existingSanibroyeur) rows.push(['Sanibroyeur existant', yesNoLabels[data.existingSanibroyeur] || data.existingSanibroyeur]);
  if (data.wantHandWash) rows.push(['Lave-mains souhaite', yesNoLabels[data.wantHandWash] || data.wantHandWash]);
  if (data.handWashType) {
    const label = getLabel('handWashType', data.handWashType);
    rows.push(['Type de lave-mains', label]);
    addImage('handWashType', data.handWashType, label);
  }
  if (data.faucetFinish) {
    const label = bathroomLabels.faucetFinish?.[data.faucetFinish] || data.faucetFinish;
    rows.push(['Finition robinetterie', label]);
    const url = bathroomImageMappings.faucetFinish?.[data.faucetFinish];
    if (url) images.push({ url, caption: label });
  }
  if (data.siphonType) {
    const label = siphonTypeLabels[data.siphonType] || data.siphonType;
    rows.push(['Type de siphon', label]);
    addImage('siphonType', data.siphonType, label);
  }
  
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
  
  // ========== HEADER - Increased height for larger logo ==========
  doc.setFillColor(...PRIMARY_COLOR);
  doc.rect(0, 0, 210, 55, 'F');
  
  // Load and add logo with proper aspect ratio - 2x larger
  try {
    const logoUrl = '/logo-qualirenovation-email.png';
    const logoData = await loadImageAsBase64WithDimensions(logoUrl);
    if (logoData) {
      // Calculate dimensions preserving aspect ratio - doubled from 18 to 36
      const maxHeight = 36;
      const maxWidth = 160;
      const aspectRatio = logoData.width / logoData.height;
      
      let logoWidth = maxHeight * aspectRatio;
      let logoHeight = maxHeight;
      
      // If width exceeds max, scale down
      if (logoWidth > maxWidth) {
        logoWidth = maxWidth;
        logoHeight = maxWidth / aspectRatio;
      }
      
      // Center horizontally
      const logoX = (210 - logoWidth) / 2;
      doc.addImage(logoData.base64, 'PNG', logoX, 4, logoWidth, logoHeight);
    }
  } catch (e) {
    // Fallback: just text if logo fails
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('QUALIRENOVATION', 105, 18, { align: 'center' });
  }
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(255, 255, 255);
  doc.text('Dossier de Simulation de Projet', 105, 42, { align: 'center' });
  
  // Client name badge - moved down for larger logo
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(60, 47, 90, 10, 2, 2, 'F');
  doc.setTextColor(...PRIMARY_COLOR);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(leadData.name || 'Client', 105, 53.5, { align: 'center' });
  
  doc.setTextColor(0, 0, 0);
  y = 65;
  
  // Date - adjusted for larger header
  doc.setFontSize(9);
  doc.setTextColor(128, 128, 128);
  doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}`, 195, 63, { align: 'right' });
  doc.setTextColor(0, 0, 0);
  
  // ========== CLIENT INFO ==========
  y = addSectionTitle(doc, 'Informations Client', y);
  
  // Two columns for client info
  const col1X = 20;
  const col2X = 110;
  let col1Y = y;
  let col2Y = y;
  
  if (leadData.name) { doc.setFontSize(10); doc.setFont('helvetica', 'bold'); doc.text('Nom :', col1X, col1Y); doc.setFont('helvetica', 'normal'); doc.text(leadData.name, col1X + 30, col1Y); col1Y += 6; }
  if (leadData.email) { doc.setFont('helvetica', 'bold'); doc.text('Email :', col1X, col1Y); doc.setFont('helvetica', 'normal'); doc.text(leadData.email, col1X + 30, col1Y); col1Y += 6; }
  if (leadData.phone) { doc.setFont('helvetica', 'bold'); doc.text('Téléphone :', col1X, col1Y); doc.setFont('helvetica', 'normal'); doc.text(leadData.phone, col1X + 30, col1Y); col1Y += 6; }
  
  // Full address with postal code and city
  const fullAddress = formData.address || leadData.address || '';
  const addressParts = [
    fullAddress,
    formData.postalCode ? `${formData.postalCode} ${formData.city}` : formData.city,
  ].filter(Boolean);
  
  if (addressParts.length > 0) { 
    doc.setFont('helvetica', 'bold'); 
    doc.text('Adresse :', col2X, col2Y); 
    doc.setFont('helvetica', 'normal'); 
    const addressLines = doc.splitTextToSize(addressParts.join('\n'), 80);
    doc.text(addressLines, col2X + 30, col2Y); 
    col2Y += addressLines.length * 5 + 1; 
  }
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
  y = addSectionTitle(doc, 'Details du Projet', y);
  
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
    y = addSectionTitle(doc, 'Travaux Transversaux', y);
    
    // Global Painting with F&B colors
    if (formData.needsGlobalPainting === 'oui' && formData.globalPainting) {
      y = addSubsectionTitle(doc, 'Peinture', y);
      
      if (formData.globalPainting.selectedRooms?.length > 0) {
        y = addInfoRow(doc, 'Pièces', formData.globalPainting.selectedRooms.join(', '), y, 40);
      }
      if (formData.globalPainting.finish) {
        y = addInfoRow(doc, 'Finition', formData.globalPainting.finish, y, 40);
      }
      
      // Farrow & Ball colors as visual cards with swatches
      if (includeImages && formData.globalPainting.farrowBallColors?.length > 0) {
        const fbColors = formData.globalPainting.farrowBallColors
          .filter((c: FarrowBallColor) => !c.error)
          .map((c: FarrowBallColor) => ({
            imageUrl: c.imageUrl,
            hexColor: c.hexColor,
            label: c.colorNumber ? `No.${c.colorNumber} ${c.colorName}` : c.colorName || 'Couleur',
            sublabel: c.rooms?.join(', ') || '',
          }));
        
        if (fbColors.length > 0) {
          y = await addReferenceCards(doc, fbColors, y, 'Couleurs Farrow & Ball');
        }
      }
      y += 3;
    }
    
    // Global Flooring
    if (formData.needsGlobalFlooring === 'oui' && formData.globalFlooring) {
      y = checkNewPage(doc, y, 30);
      y = addSubsectionTitle(doc, 'Revetements de sol', y);
      
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
      y = addSubsectionTitle(doc, 'Electricite', y);
      
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
      y = addSubsectionTitle(doc, 'Moulures', y);
      
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
      y = addSubsectionTitle(doc, 'Amenagements sur mesure', y);
      
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
    // Note: Emojis removed - jsPDF has limited unicode support and emojis cause spacing issues
    
    let tableData: string[][] = [];
    let selectionImages: { url: string; caption: string }[] = [];
    let eggerRefs: EggerReference[] = [];
    let planiziaRefs: PlaniziaReference[] = [];
    let fbColors: FarrowBallColor[] = [];
    
    if (room.data.bathroomData) {
      const { rows, images } = formatBathroomDataWithImages(room.data.bathroomData);
      tableData = rows;
      selectionImages = images;
      eggerRefs = room.data.bathroomData.eggerReferences || [];
    } else if (room.data.kitchenData) {
      const { rows, images } = formatKitchenDataWithImages(room.data.kitchenData);
      tableData = rows;
      selectionImages = images;
      eggerRefs = room.data.kitchenData.eggerReferences || [];
      planiziaRefs = room.data.kitchenData.planiziaReferences || [];
    } else if (room.data.wcData) {
      const { rows, images } = formatWCDataWithImages(room.data.wcData);
      tableData = rows;
      selectionImages = images;
    } else if (room.data.paintingData) {
      // Handle room-specific painting data
      const paintData = room.data.paintingData;
      if (paintData.surfaces?.length > 0) tableData.push(['Surfaces', paintData.surfaces.join(', ')]);
      if (paintData.intention) tableData.push(['Intention', paintData.intention]);
      if (paintData.finish) tableData.push(['Finition', paintData.finish]);
      if (paintData.wallCondition) tableData.push(['Etat des murs', paintData.wallCondition]);
      fbColors = paintData.farrowBallColors || [];
    }
    
    // Skip rooms with no configuration data
    if (tableData.length === 0 && eggerRefs.length === 0 && planiziaRefs.length === 0 && fbColors.length === 0) {
      // Still show section but with "Not configured" message
      y = addSectionTitle(doc, roomTitle, y);
      doc.setFontSize(9);
      doc.setTextColor(150, 150, 150);
      doc.setFont('helvetica', 'italic');
      doc.text('Configuration non renseignée', 20, y);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      y += 10;
      continue;
    }
    
    y = addSectionTitle(doc, roomTitle, y);
    
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
        alternateRowStyles: { fillColor: SECONDARY_COLOR },
        columnStyles: {
          0: { cellWidth: 55, fontStyle: 'bold', textColor: [80, 80, 80] },
          1: { cellWidth: 'auto' },
        },
        margin: { left: 20, right: 20 },
      });
      
      y = (doc as any).lastAutoTable.finalY + 8;
    }
    
    // Selection images grid (bathroom fixtures, kitchen layouts, etc.)
    if (includeImages && selectionImages.length > 0) {
      y = checkNewPage(doc, y, 60);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...PRIMARY_COLOR);
      doc.text('Visuels des selections', 20, y);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      y += 6;
      y = await addImagesGrid(doc, selectionImages, y, 4, 42, 32);
    }
    
    // EGGER references for this room (vanity finishes, countertops)
    if (includeImages && eggerRefs.length > 0) {
      const validRefs = eggerRefs
        .filter(r => !r.error)
        .map(r => ({
          imageUrl: r.imageUrl,
          label: r.reference || 'Référence EGGER',
          sublabel: r.decorName || '',
        }));
      
      if (validRefs.length > 0) {
        y = checkNewPage(doc, y, 60);
        y = await addReferenceCards(doc, validRefs, y, 'Finitions EGGER');
      }
    }
    
    // Planizia references for kitchen (quartz/ceramic countertops)
    if (includeImages && planiziaRefs.length > 0) {
      const validRefs = planiziaRefs
        .filter(r => !r.error)
        .map(r => ({
          imageUrl: r.imageUrl,
          label: r.reference || 'Référence Planizia',
          sublabel: r.brand || '',
        }));
      
      if (validRefs.length > 0) {
        y = checkNewPage(doc, y, 60);
        y = await addReferenceCards(doc, validRefs, y, 'Plans de travail Planizia');
      }
    }
    
    // Farrow & Ball colors for room-specific painting
    if (includeImages && fbColors.length > 0) {
      const validColors = fbColors
        .filter((c: FarrowBallColor) => !c.error)
        .map((c: FarrowBallColor) => ({
          imageUrl: c.imageUrl,
          hexColor: c.hexColor,
          label: c.colorNumber ? `No.${c.colorNumber} ${c.colorName}` : c.colorName || 'Couleur',
          sublabel: c.rooms?.join(', ') || '',
        }));
      
      if (validColors.length > 0) {
        y = checkNewPage(doc, y, 60);
        y = await addReferenceCards(doc, validColors, y, 'Couleurs Farrow & Ball');
      }
    }
    
    y += 5;
  }
  
  // ========== ISOLATION ==========
  if (formData.projectTypes.includes('dpe') && formData.isolation?.wantIsolation) {
    y = checkNewPage(doc, y, 45);
    y = addSectionTitle(doc, 'Isolation', y);
    
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
    y = addSectionTitle(doc, 'Photos d\'Inspiration', y);
    
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
