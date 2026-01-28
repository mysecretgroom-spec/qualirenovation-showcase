import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { RenovationFormData, RoomSelection, InspirationImage } from '@/components/renovation/types';
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
};

const yesNoLabels: Record<string, string> = {
  'oui': 'Oui',
  'non': 'Non',
  'en-reflexion': 'En réflexion',
  'partiellement': 'Partiellement',
};

const startDateLabels: Record<string, string> = {
  'asap': 'Dès que possible',
  'from-date': 'À partir d\'une date',
  'flexible': 'Flexible',
};

// Primary color for headers
const PRIMARY_COLOR: [number, number, number] = [139, 90, 43]; // Bronze/gold color

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

// Add section title
const addSectionTitle = (doc: jsPDF, title: string, y: number): number => {
  doc.setFillColor(...PRIMARY_COLOR);
  doc.rect(15, y, 180, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(title.toUpperCase(), 20, y + 5.5);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  return y + 12;
};

// Add key-value row
const addInfoRow = (doc: jsPDF, label: string, value: string, y: number, labelWidth: number = 60): number => {
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(label + ' :', 20, y);
  doc.setFont('helvetica', 'normal');
  
  // Handle long text with wrapping
  const maxWidth = 180 - labelWidth - 5;
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

// Add images grid
const addImagesGrid = async (
  doc: jsPDF, 
  images: InspirationImage[], 
  y: number, 
  title: string
): Promise<number> => {
  if (!images || images.length === 0) return y;
  
  let currentY = checkNewPage(doc, y, 50);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 20, currentY);
  currentY += 5;
  
  const imgWidth = 40;
  const imgHeight = 30;
  const cols = 4;
  const margin = 5;
  
  for (let i = 0; i < images.length; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    
    if (col === 0 && row > 0) {
      currentY = checkNewPage(doc, currentY, imgHeight + 10);
    }
    
    const x = 20 + col * (imgWidth + margin);
    const imgY = currentY + row * (imgHeight + margin);
    
    try {
      const base64 = await loadImageAsBase64(images[i].url);
      if (base64) {
        doc.addImage(base64, 'JPEG', x, imgY, imgWidth, imgHeight);
      } else {
        doc.setDrawColor(200, 200, 200);
        doc.rect(x, imgY, imgWidth, imgHeight);
        doc.setFontSize(8);
        doc.text('Image', x + imgWidth/2 - 8, imgY + imgHeight/2);
      }
    } catch {
      doc.setDrawColor(200, 200, 200);
      doc.rect(x, imgY, imgWidth, imgHeight);
    }
  }
  
  const totalRows = Math.ceil(images.length / cols);
  return currentY + totalRows * (imgHeight + margin) + 5;
};

// Format bathroom data for display
const formatBathroomData = (data: any): string[][] => {
  const rows: string[][] = [];
  
  if (data.bathtubType) rows.push(['Type de baignoire', data.bathtubType]);
  if (data.showerType) rows.push(['Type de receveur', data.showerType]);
  if (data.showerDoorType) rows.push(['Paroi de douche', data.showerDoorType]);
  if (data.showerHeadType) rows.push(['Pommeau', data.showerHeadType]);
  if (data.bathtubScreenType) rows.push(['Pare-baignoire', data.bathtubScreenType]);
  if (data.vanityType) rows.push(['Meuble vasque', data.vanityType]);
  if (data.mirrorType) rows.push(['Miroir', data.mirrorType]);
  if (data.faucetType) rows.push(['Robinetterie', data.faucetType]);
  if (data.faucetFinish) rows.push(['Finition robinetterie', data.faucetFinish]);
  if (data.toiletType) rows.push(['WC', data.toiletType]);
  if (data.ambiance) rows.push(['Ambiance', data.ambiance]);
  if (data.tileFormat) rows.push(['Format carrelage', data.tileFormat]);
  if (data.certaintyLevel) rows.push(['Niveau de certitude', data.certaintyLevel]);
  
  return rows;
};

// Format kitchen data for display
const formatKitchenData = (data: any): string[][] => {
  const rows: string[][] = [];
  
  if (data.layoutType) rows.push(['Implantation', data.layoutType]);
  if (data.facadeType) rows.push(['Type de façade', data.facadeType]);
  if (data.countertopMaterial) rows.push(['Plan de travail', data.countertopMaterial]);
  if (data.backsplashType) rows.push(['Crédence', data.backsplashType]);
  if (data.appliancesIncluded) rows.push(['Électroménager inclus', data.appliancesIncluded]);
  if (data.certaintyLevel) rows.push(['Niveau de certitude', data.certaintyLevel]);
  
  return rows;
};

// Format WC data for display
const formatWCData = (data: any): string[][] => {
  const rows: string[][] = [];
  
  if (data.toiletType) rows.push(['Type de WC', data.toiletType]);
  if (data.existingSanibroyeur) rows.push(['Sanibroyeur existant', data.existingSanibroyeur]);
  if (data.wantHandWash) rows.push(['Lave-mains souhaité', data.wantHandWash]);
  if (data.handWashType) rows.push(['Type de lave-mains', data.handWashType]);
  if (data.faucetFinish) rows.push(['Finition robinetterie', data.faucetFinish]);
  if (data.siphonType) rows.push(['Type de siphon', data.siphonType]);
  
  return rows;
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
  doc.rect(0, 0, 210, 35, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('QUALIRENOVATION', 105, 15, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Simulation de Projet de Rénovation', 105, 25, { align: 'center' });
  
  doc.setTextColor(0, 0, 0);
  y = 45;
  
  // Date
  doc.setFontSize(9);
  doc.setTextColor(128, 128, 128);
  doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}`, 195, 42, { align: 'right' });
  doc.setTextColor(0, 0, 0);
  
  // ========== CLIENT INFO ==========
  y = addSectionTitle(doc, 'Informations Client', y);
  
  y = addInfoRow(doc, 'Nom', leadData.name, y);
  y = addInfoRow(doc, 'Email', leadData.email, y);
  y = addInfoRow(doc, 'Téléphone', leadData.phone, y);
  if (leadData.address) y = addInfoRow(doc, 'Adresse', `${leadData.address}, ${leadData.postalCode} ${leadData.city}`, y);
  if (leadData.surface) y = addInfoRow(doc, 'Surface', `${leadData.surface} m²`, y);
  if (leadData.budget) y = addInfoRow(doc, 'Budget', leadData.budget, y);
  if (leadData.timeline) y = addInfoRow(doc, 'Délai souhaité', leadData.timeline, y);
  if (leadData.message) y = addInfoRow(doc, 'Message', leadData.message, y);
  
  y += 5;
  
  // ========== PROJECT INFO ==========
  y = checkNewPage(doc, y, 40);
  y = addSectionTitle(doc, 'Caractéristiques du Bien', y);
  
  if (formData.propertyType) y = addInfoRow(doc, 'Type de bien', propertyTypeLabels[formData.propertyType] || formData.propertyType, y);
  if (formData.surface) y = addInfoRow(doc, 'Surface', `${formData.surface} m²`, y);
  if (formData.constructionPeriod) y = addInfoRow(doc, 'Période de construction', constructionPeriodLabels[formData.constructionPeriod] || formData.constructionPeriod, y);
  if (formData.city) y = addInfoRow(doc, 'Ville', formData.city, y);
  
  y += 5;
  
  // ========== PROJECT TYPE ==========
  y = checkNewPage(doc, y, 40);
  y = addSectionTitle(doc, 'Nature du Projet', y);
  
  if (formData.projectTypes.length > 0) {
    const types = formData.projectTypes.map(t => projectTypeLabels[t] || t).join(', ');
    y = addInfoRow(doc, 'Types de travaux', types, y);
  }
  
  if (formData.projectContexts.length > 0) {
    const contexts = formData.projectContexts.map(c => projectContextLabels[c] || c).join(', ');
    y = addInfoRow(doc, 'Contexte', contexts, y);
  }
  
  if (formData.hasDPE) y = addInfoRow(doc, 'DPE disponible', formData.hasDPE.replace('-', ' '), y);
  
  y += 5;
  
  // ========== CONCEPTION ==========
  y = checkNewPage(doc, y, 40);
  y = addSectionTitle(doc, 'Conception & Organisation', y);
  
  if (formData.hasArchitect) y = addInfoRow(doc, 'Architecte', yesNoLabels[formData.hasArchitect] || formData.hasArchitect, y);
  if (formData.modifyLayout) y = addInfoRow(doc, 'Modification de l\'agencement', yesNoLabels[formData.modifyLayout] || formData.modifyLayout, y);
  
  y += 5;
  
  // ========== CONDITIONS ==========
  y = checkNewPage(doc, y, 40);
  y = addSectionTitle(doc, 'Conditions de Réalisation', y);
  
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
    y = addInfoRow(doc, 'Date de début', startInfo, y);
  }
  
  if (formData.endDateMax) y = addInfoRow(doc, 'Date de fin max', formData.endDateMax, y);
  
  y += 5;
  
  // ========== GLOBAL WORKS ==========
  const hasGlobalWorks = formData.needsGlobalPainting === 'oui' || 
                         formData.needsGlobalFlooring === 'oui' || 
                         formData.needsGlobalElectricity === 'oui' ||
                         formData.needsGlobalMouldings === 'oui' ||
                         formData.needsGlobalFurniture === 'oui';
  
  if (hasGlobalWorks) {
    y = checkNewPage(doc, y, 50);
    y = addSectionTitle(doc, 'Travaux Transversaux', y);
    
    if (formData.needsGlobalPainting === 'oui' && formData.globalPainting) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('🎨 Peinture', 20, y);
      y += 5;
      doc.setFont('helvetica', 'normal');
      
      if (formData.globalPainting.selectedRooms?.length > 0) {
        y = addInfoRow(doc, 'Pièces', formData.globalPainting.selectedRooms.join(', '), y, 40);
      }
      if (formData.globalPainting.finish) {
        y = addInfoRow(doc, 'Finition', formData.globalPainting.finish, y, 40);
      }
      if (formData.globalPainting.farrowBallColors?.length > 0) {
        const colors = formData.globalPainting.farrowBallColors
          .map((c: any) => `${c.colorName}${c.colorNumber ? ` (${c.colorNumber})` : ''}`)
          .join(', ');
        y = addInfoRow(doc, 'Couleurs F&B', colors, y, 40);
      }
      y += 3;
    }
    
    if (formData.needsGlobalFlooring === 'oui' && formData.globalFlooring) {
      doc.setFont('helvetica', 'bold');
      doc.text('🪵 Sols', 20, y);
      y += 5;
      doc.setFont('helvetica', 'normal');
      
      if (formData.globalFlooring.selectedRooms?.length > 0) {
        y = addInfoRow(doc, 'Pièces', formData.globalFlooring.selectedRooms.join(', '), y, 40);
      }
      if (formData.globalFlooring.floorType) {
        y = addInfoRow(doc, 'Type', formData.globalFlooring.floorType, y, 40);
      }
      y += 3;
    }
    
    if (formData.needsGlobalElectricity === 'oui' && formData.globalElectricity) {
      doc.setFont('helvetica', 'bold');
      doc.text('⚡ Électricité', 20, y);
      y += 5;
      doc.setFont('helvetica', 'normal');
      
      if (formData.globalElectricity.selectedRooms?.length > 0) {
        y = addInfoRow(doc, 'Pièces', formData.globalElectricity.selectedRooms.join(', '), y, 40);
      }
      y += 3;
    }
    
    if (formData.needsGlobalMouldings === 'oui' && formData.globalMouldings) {
      doc.setFont('helvetica', 'bold');
      doc.text('🏛️ Moulures', 20, y);
      y += 5;
      doc.setFont('helvetica', 'normal');
      
      if (formData.globalMouldings.selectedRooms?.length > 0) {
        y = addInfoRow(doc, 'Pièces', formData.globalMouldings.selectedRooms.join(', '), y, 40);
      }
      y += 3;
    }
    
    if (formData.needsGlobalFurniture === 'oui' && formData.globalFurniture) {
      doc.setFont('helvetica', 'bold');
      doc.text('🪑 Aménagements sur mesure', 20, y);
      y += 5;
      doc.setFont('helvetica', 'normal');
      
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
    y = checkNewPage(doc, y, 60);
    
    const roomLabel = roomTypeLabels[room.type] || room.type;
    const roomTitle = room.instanceNumber > 1 ? `${roomLabel} ${room.instanceNumber}` : roomLabel;
    
    y = addSectionTitle(doc, roomTitle, y);
    
    let tableData: string[][] = [];
    
    if (room.data.bathroomData) {
      tableData = formatBathroomData(room.data.bathroomData);
    } else if (room.data.kitchenData) {
      tableData = formatKitchenData(room.data.kitchenData);
    } else if (room.data.wcData) {
      tableData = formatWCData(room.data.wcData);
    }
    
    if (tableData.length > 0) {
      autoTable(doc, {
        startY: y,
        head: [['Élément', 'Choix']],
        body: tableData,
        theme: 'striped',
        headStyles: { 
          fillColor: PRIMARY_COLOR,
          fontSize: 9,
        },
        bodyStyles: { fontSize: 9 },
        columnStyles: {
          0: { cellWidth: 60, fontStyle: 'bold' },
          1: { cellWidth: 'auto' },
        },
        margin: { left: 20, right: 20 },
      });
      
      y = (doc as any).lastAutoTable.finalY + 10;
    }
    
    // Room inspiration images - check for images in room data
    // Note: inspirationImages may not exist in all room types, so we skip this safely
  }
  
  // ========== ISOLATION ==========
  if (formData.projectTypes.includes('dpe') && formData.isolation) {
    y = checkNewPage(doc, y, 40);
    y = addSectionTitle(doc, 'Isolation', y);
    
    if (formData.isolation.isolationType) {
      y = addInfoRow(doc, 'Type d\'isolation', formData.isolation.isolationType, y);
    }
    if (formData.isolation.zones?.length > 0) {
      y = addInfoRow(doc, 'Zones', formData.isolation.zones.join(', '), y);
    }
    if (formData.isolation.primaryGoal) {
      y = addInfoRow(doc, 'Objectif principal', formData.isolation.primaryGoal, y);
    }
    
    y += 5;
  }
  
  // ========== GLOBAL INSPIRATION IMAGES ==========
  if (includeImages && formData.inspirationImages.length > 0) {
    y = checkNewPage(doc, y, 60);
    y = addSectionTitle(doc, 'Photos d\'Inspiration Globales', y);
    y = await addImagesGrid(doc, formData.inspirationImages, y, '');
  }
  
  // ========== FOOTER ON EACH PAGE ==========
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `QualiRénovation - www.qualirenovation.fr - Page ${i}/${pageCount}`,
      105, 
      292, 
      { align: 'center' }
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
