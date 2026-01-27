import React, { useState } from 'react';
import { useRenovationForm } from '../RenovationFormContext';
import { FormSection } from '../FormSection';
import { FormQuestion } from '../FormQuestion';
import { SelectableCard } from '../SelectableCard';
import { Badge } from '@/components/ui/badge';
import { FarrowBallColor } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ReferenceInput } from '../ReferenceInput';

// Import finish images
import finitionMat from '@/assets/painting/finition-mat.jpg';
import finitionSatine from '@/assets/painting/finition-satine.jpg';
import finitionBrillant from '@/assets/painting/finition-brillant.jpg';
import finitionVelours from '@/assets/painting/finition-velours.jpg';

export interface GlobalPaintingData {
  selectedRooms: string[];
  surfaces: string[];
  intention: string;
  finish: string;
  hasDefinedColors: string;
  wallCondition: string;
  farrowBallColors: FarrowBallColor[];
}

interface GlobalPaintingModuleProps {
  data: GlobalPaintingData;
  onUpdate: (data: Partial<GlobalPaintingData>) => void;
  onSkip?: () => void;
}

export const GlobalPaintingModule: React.FC<GlobalPaintingModuleProps> = ({ 
  data, 
  onUpdate,
  onSkip 
}) => {
  const { formData } = useRenovationForm();
  const [newColorRef, setNewColorRef] = useState('');
  const [selectedColorRooms, setSelectedColorRooms] = useState<string[]>([]);

  const toggleRoom = (roomId: string) => {
    const current = data.selectedRooms || [];
    if (current.includes(roomId)) {
      onUpdate({ selectedRooms: current.filter(r => r !== roomId) });
    } else {
      onUpdate({ selectedRooms: [...current, roomId] });
    }
  };

  const toggleSurface = (value: string) => {
    const current = data.surfaces || [];
    if (current.includes(value)) {
      onUpdate({ surfaces: current.filter(v => v !== value) });
    } else {
      onUpdate({ surfaces: [...current, value] });
    }
  };

  const toggleColorRoom = (roomId: string) => {
    if (selectedColorRooms.includes(roomId)) {
      setSelectedColorRooms(selectedColorRooms.filter(r => r !== roomId));
    } else {
      setSelectedColorRooms([...selectedColorRooms, roomId]);
    }
  };

  const getRoomLabel = (type: string, instanceNumber: number): string => {
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
  };

  const availableRooms = formData.selectedRooms.map(room => ({
    id: room.id,
    label: getRoomLabel(room.type, room.instanceNumber),
  }));

  const addFarrowBallColor = async () => {
    if (!newColorRef.trim()) return;
    
    const colorRef = newColorRef.trim();
    const match = colorRef.match(/^(?:No\.?\s*)?(\d+)?\s*(.+)?$/i);
    const colorNumber = match?.[1] || '';
    const colorName = match?.[2]?.trim() || '';
    
    const newColor: FarrowBallColor = {
      colorNumber: colorNumber,
      colorName: colorName || colorRef,
      rooms: selectedColorRooms,
      isLoading: true,
    };
    
    onUpdate({ 
      farrowBallColors: [...(data.farrowBallColors || []), newColor] 
    });
    
    setNewColorRef('');
    setSelectedColorRooms([]);

    try {
      const { data: scrapeData, error } = await supabase.functions.invoke('scrape-farrow-ball', {
        body: { colorReference: colorRef },
      });

      if (error) throw error;

      const currentColors = data.farrowBallColors || [];
      const updatedColors = [...currentColors, {
        colorNumber: scrapeData?.colorNumber || colorNumber,
        colorName: scrapeData?.colorName || colorName || colorRef,
        rooms: selectedColorRooms,
        imageUrl: scrapeData?.imageUrl || undefined,
        hexColor: scrapeData?.hexColor || undefined,
        productUrl: scrapeData?.productUrl || undefined,
        isLoading: false,
      }].filter((c, i, arr) => !(i < arr.length - 1 && c.isLoading));

      onUpdate({ farrowBallColors: updatedColors });
      
      if (scrapeData?.imageUrl || scrapeData?.hexColor) {
        toast.success(`Couleur trouvée: ${colorRef}`);
      } else {
        toast.info(`Couleur ${colorRef} ajoutée`);
      }
    } catch (error) {
      console.error('Error scraping Farrow & Ball:', error);
      const currentColors = data.farrowBallColors || [];
      const updatedColors = currentColors.map((c, i) => {
        if (i === currentColors.length - 1 && c.isLoading) {
          return { ...c, isLoading: false, error: 'Couleur non trouvée' };
        }
        return c;
      });
      onUpdate({ farrowBallColors: updatedColors });
    }
  };

  const removeFarrowBallColor = (index: number) => {
    const updated = [...(data.farrowBallColors || [])];
    updated.splice(index, 1);
    onUpdate({ farrowBallColors: updated });
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
      title="Peinture"
      subtitle="Configurez les travaux de peinture pour votre projet"
      showSkip={!!onSkip}
      onSkip={onSkip}
    >
      {/* Room selection */}
      <FormQuestion label="Pièces concernées par les travaux de peinture :">
        <div className="flex flex-wrap gap-2">
          {formData.selectedRooms.map((room) => (
            <Badge
              key={room.id}
              variant={(data.selectedRooms || []).includes(room.id) ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/80 transition-colors py-2 px-3"
              onClick={() => toggleRoom(room.id)}
            >
              {getRoomLabel(room.type, room.instanceNumber)}
            </Badge>
          ))}
        </div>
      </FormQuestion>

      <FormQuestion label="Quelles surfaces sont concernées ?">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {surfaces.map((surface) => (
            <SelectableCard
              key={surface.value}
              selected={(data.surfaces || []).includes(surface.value)}
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
              onClick={() => onUpdate({ intention: intention.value })}
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
              onClick={() => onUpdate({ finish: finish.value })}
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
              onClick={() => onUpdate({ hasDefinedColors: option.value })}
              title={option.label}
              size="sm"
            />
          ))}
        </div>

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
                  L'outil recherchera automatiquement l'échantillon correspondant.
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
                productUrl: c.productUrl,
                colorNumber: c.colorNumber,
                colorName: c.colorName,
                rooms: c.rooms,
                error: c.error,
              }))}
              onRemove={(index) => removeFarrowBallColor(index as number)}
              rooms={availableRooms}
              selectedRooms={selectedColorRooms}
              onToggleRoom={toggleColorRoom}
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
              onClick={() => onUpdate({ wallCondition: condition.value })}
              title={condition.label}
              size="sm"
            />
          ))}
        </div>
      </FormQuestion>
    </FormSection>
  );
};