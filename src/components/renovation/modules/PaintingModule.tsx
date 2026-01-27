import React, { useState } from 'react';
import { useRenovationForm } from '../RenovationFormContext';
import { FormSection } from '../FormSection';
import { FormQuestion } from '../FormQuestion';
import { SelectableCard } from '../SelectableCard';
import { PaintingData, FarrowBallColor } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ReferenceInput } from '../ReferenceInput';

// Import finish images
import finitionMat from '@/assets/painting/finition-mat.jpg';
import finitionSatine from '@/assets/painting/finition-satine.jpg';
import finitionBrillant from '@/assets/painting/finition-brillant.jpg';
import finitionVelours from '@/assets/painting/finition-velours.jpg';

interface PaintingModuleProps {
  roomId: string;
  roomName: string;
  data: PaintingData;
}

export const PaintingModule: React.FC<PaintingModuleProps> = ({ roomId, roomName, data }) => {
  const { updateRoomData, formData } = useRenovationForm();
  const [newColorRef, setNewColorRef] = useState('');
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);

  const updateData = (updates: Partial<PaintingData>) => {
    updateRoomData(roomId, { paintingData: { ...data, ...updates } });
  };

  const toggleSurface = (value: string) => {
    const current = data.surfaces;
    if (current.includes(value)) {
      updateData({ surfaces: current.filter(v => v !== value) });
    } else {
      updateData({ surfaces: [...current, value] });
    }
  };

  // Get available rooms from form data
  const availableRooms = formData.selectedRooms.map(room => ({
    id: room.id,
    label: getRoomLabel(room.type, room.instanceNumber),
  }));

  function getRoomLabel(type: string, instanceNumber: number): string {
    const labels: Record<string, string> = {
      'cuisine': 'Cuisine',
      'salle-de-bain': 'Salle de bain',
      'wc': 'WC',
      'salon-sejour': 'Salon/Séjour',
      'chambre': 'Chambre',
      'entree-couloir': 'Entrée/Couloir',
      'dressing-rangements': 'Dressing',
      'bureau': 'Bureau',
      'autre': 'Autre pièce',
    };
    const base = labels[type] || type;
    return instanceNumber > 1 ? `${base} ${instanceNumber}` : base;
  }

  const toggleSelectedRoom = (roomId: string) => {
    if (selectedRooms.includes(roomId)) {
      setSelectedRooms(selectedRooms.filter(r => r !== roomId));
    } else {
      setSelectedRooms([...selectedRooms, roomId]);
    }
  };

  const addFarrowBallColor = async () => {
    if (!newColorRef.trim()) return;
    
    const colorRef = newColorRef.trim();
    
    // Parse the reference to extract number and name
    // Format examples: "No.311 Scallop", "311 Scallop", "Scallop", "311"
    const match = colorRef.match(/^(?:No\.?\s*)?(\d+)?\s*(.+)?$/i);
    const colorNumber = match?.[1] || '';
    const colorName = match?.[2]?.trim() || '';
    
    // Add color with loading state
    const newColor: FarrowBallColor = {
      colorNumber: colorNumber,
      colorName: colorName || colorRef,
      rooms: selectedRooms,
      isLoading: true,
    };
    
    updateData({ 
      farrowBallColors: [...(data.farrowBallColors || []), newColor] 
    });
    
    // Reset form
    setNewColorRef('');
    setSelectedRooms([]);

    // Try to scrape the color
    try {
      const { data: scrapeData, error } = await supabase.functions.invoke('scrape-farrow-ball', {
        body: { colorReference: colorRef },
      });

      if (error) throw error;

      // Update the color with the scraped data
      const currentColors = data.farrowBallColors || [];
      const updatedColors = currentColors.map((c, i) => {
        if (i === currentColors.length - 1 && c.isLoading) {
          return {
            ...c,
            colorNumber: scrapeData?.colorNumber || colorNumber,
            colorName: scrapeData?.colorName || colorName || colorRef,
            imageUrl: scrapeData?.imageUrl || undefined,
            hexColor: scrapeData?.hexColor || undefined,
            isLoading: false,
          };
        }
        return c;
      });

      updateData({ farrowBallColors: updatedColors });
      
      if (scrapeData?.imageUrl || scrapeData?.hexColor) {
        toast.success(`Couleur trouvée: ${colorRef}`);
      } else {
        toast.info(`Couleur ${colorRef} ajoutée`);
      }
    } catch (error) {
      console.error('Error scraping Farrow & Ball:', error);
      // Keep the color but mark as error
      const currentColors = data.farrowBallColors || [];
      const updatedColors = currentColors.map((c, i) => {
        if (i === currentColors.length - 1 && c.isLoading) {
          return {
            ...c,
            isLoading: false,
            error: 'Couleur non trouvée',
          };
        }
        return c;
      });
      updateData({ farrowBallColors: updatedColors });
    }
  };

  const removeFarrowBallColor = (index: number) => {
    const updated = [...(data.farrowBallColors || [])];
    updated.splice(index, 1);
    updateData({ farrowBallColors: updated });
  };

  const surfaces = [
    { value: 'murs', label: 'Murs' },
    { value: 'plafonds', label: 'Plafonds' },
    { value: 'boiseries', label: 'Boiseries' },
    { value: 'tout', label: "Tout l'espace" },
  ];

  const intentions = [
    { value: 'neutre', label: 'Un rendu neutre' },
    { value: 'ambiance-marquee', label: 'Une ambiance marquée' },
    { value: 'decorative', label: 'Une peinture décorative' },
    { value: 'ne-sais-pas', label: 'Je ne sais pas encore' },
  ];

  const finishes = [
    { value: 'mat', label: 'Mat', image: finitionMat, badge: 'Plafonds' },
    { value: 'satine', label: 'Satiné', image: finitionSatine, badge: 'Murs' },
    { value: 'brillant', label: 'Brillant', image: finitionBrillant },
    { value: 'velours', label: 'Velours', image: finitionVelours, badge: 'SDB / WC' },
    { value: 'a-definir', label: 'À définir', emoji: '❓' },
  ];

  const colorDefinitions = [
    { value: 'oui', label: 'Oui' },
    { value: 'non', label: 'Non' },
    { value: 'en-reflexion', label: 'En cours de réflexion' },
  ];

  const wallConditions = [
    { value: 'bon', label: 'Bon' },
    { value: 'moyen', label: 'Moyen' },
    { value: 'fissures', label: 'Fissurés' },
    { value: 'ne-sais-pas', label: 'Je ne sais pas' },
  ];

  return (
    <FormSection
      title={`Peinture - ${roomName}`}
      subtitle="Définissez vos besoins en peinture pour cette pièce"
    >
      <FormQuestion label="Quelles surfaces sont concernées ?">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {surfaces.map((surface) => (
            <SelectableCard
              key={surface.value}
              selected={data.surfaces.includes(surface.value)}
              onClick={() => toggleSurface(surface.value)}
              title={surface.label}
              size="sm"
            />
          ))}
        </div>
      </FormQuestion>

      <FormQuestion label="Souhaitez-vous :">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {intentions.map((intention) => (
            <SelectableCard
              key={intention.value}
              selected={data.intention === intention.value}
              onClick={() => updateData({ intention: intention.value })}
              title={intention.label}
              size="sm"
            />
          ))}
        </div>
      </FormQuestion>

      <FormQuestion label="Finition souhaitée :">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {finishes.map((finish) => (
            <SelectableCard
              key={finish.value}
              selected={data.finish === finish.value}
              onClick={() => updateData({ finish: finish.value })}
              image={finish.image}
              emoji={finish.emoji}
              title={finish.label}
              badge={finish.badge}
              size="md"
            />
          ))}
        </div>
      </FormQuestion>

      <FormQuestion label="Avez-vous déjà des couleurs définies ?">
        <div className="grid grid-cols-3 gap-3 max-w-md">
          {colorDefinitions.map((option) => (
            <SelectableCard
              key={option.value}
              selected={data.hasDefinedColors === option.value}
              onClick={() => updateData({ hasDefinedColors: option.value })}
              title={option.label}
              size="sm"
            />
          ))}
        </div>

        {/* Farrow & Ball color references - using the improved ReferenceInput */}
        {(data.hasDefinedColors === 'oui' || data.hasDefinedColors === 'en-reflexion') && (
          <div className="mt-6">
            <ReferenceInput
              type="farrow-ball"
              title="Références couleurs Farrow & Ball (optionnel) :"
              catalogUrl="https://www.farrow-ball.com/fr/peinture/toutes-les-couleurs-de-peinture"
              catalogLabel="Voir le nuancier Farrow & Ball"
              placeholder="Ex: No.311 Scallop"
              formatHint={
                <>
                  Entrez le <strong>numéro</strong> et/ou le <strong>nom de la couleur</strong>.
                  L'outil recherchera automatiquement l'échantillon correspondant sur le nuancier Farrow & Ball.
                </>
              }
              formatExamples={['No.311 Scallop', '311', 'Hague Blue', 'No.2001 Strong White']}
              value={newColorRef}
              onChange={setNewColorRef}
              onAdd={addFarrowBallColor}
              references={(data.farrowBallColors || []).map(c => ({
                reference: c.colorNumber ? `No.${c.colorNumber} ${c.colorName}` : c.colorName,
                isLoading: c.isLoading,
                imageUrl: c.imageUrl,
                hexColor: c.hexColor,
                colorNumber: c.colorNumber,
                colorName: c.colorName,
                rooms: c.rooms,
                error: c.error,
              }))}
              onRemove={(index) => removeFarrowBallColor(index as number)}
              rooms={availableRooms}
              selectedRooms={selectedRooms}
              onToggleRoom={toggleSelectedRoom}
            />
          </div>
        )}
      </FormQuestion>

      <FormQuestion label="L'état des murs est :">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {wallConditions.map((condition) => (
            <SelectableCard
              key={condition.value}
              selected={data.wallCondition === condition.value}
              onClick={() => updateData({ wallCondition: condition.value })}
              title={condition.label}
              size="sm"
            />
          ))}
        </div>
      </FormQuestion>
    </FormSection>
  );
};
