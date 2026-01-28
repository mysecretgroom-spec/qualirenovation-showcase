import React from 'react';
import { FormSection } from '../FormSection';
import { FormQuestion } from '../FormQuestion';
import { SelectableCard } from '../SelectableCard';
import { Textarea } from '@/components/ui/textarea';
import { GlobalFurnitureData } from '../types';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface GlobalFurnitureModuleProps {
  data: GlobalFurnitureData;
  onUpdate: (data: Partial<GlobalFurnitureData>) => void;
}

const roomOptions = [
  { value: 'salon', label: 'Salon' },
  { value: 'sejour', label: 'Séjour' },
  { value: 'chambre-1', label: 'Chambre 1' },
  { value: 'chambre-2', label: 'Chambre 2' },
  { value: 'chambre-3', label: 'Chambre 3' },
  { value: 'bureau', label: 'Bureau' },
  { value: 'entree', label: 'Entrée' },
  { value: 'couloir', label: 'Couloir' },
  { value: 'buanderie', label: 'Buanderie' },
  { value: 'cellier', label: 'Cellier' },
];

export const GlobalFurnitureModule: React.FC<GlobalFurnitureModuleProps> = ({ data, onUpdate }) => {
  const toggleRoom = (room: string) => {
    const current = data.selectedRooms;
    if (current.includes(room)) {
      onUpdate({ selectedRooms: current.filter(r => r !== room) });
    } else {
      onUpdate({ selectedRooms: [...current, room] });
    }
  };

  const toggleFurnitureType = (type: string) => {
    const current = data.furnitureType;
    if (current.includes(type)) {
      onUpdate({ furnitureType: current.filter(t => t !== type) });
    } else {
      onUpdate({ furnitureType: [...current, type] });
    }
  };

  const furnitureTypes = [
    { value: 'dressing', label: 'Dressing', emoji: '👔' },
    { value: 'placard', label: 'Placard / Rangement', emoji: '🚪' },
    { value: 'bibliotheque', label: 'Bibliothèque', emoji: '📚' },
    { value: 'meuble-tv', label: 'Meuble TV', emoji: '📺' },
    { value: 'bureau', label: 'Bureau sur mesure', emoji: '🖥️' },
    { value: 'verriere', label: 'Verrière / Claustra', emoji: '🪟' },
    { value: 'estrade', label: 'Estrade / Mezzanine', emoji: '🪜' },
    { value: 'autre', label: 'Autre', emoji: '✨' },
  ];

  const approaches = [
    { value: 'sur-mesure', label: 'Entièrement sur mesure', description: 'Conception et fabrication personnalisées' },
    { value: 'semi-sur-mesure', label: 'Semi sur mesure', description: 'Adaptation de solutions existantes' },
    { value: 'ne-sais-pas', label: 'Je ne sais pas', description: "J'ai besoin de conseils" },
  ];

  return (
    <FormSection
      title="Aménagements sur mesure"
      subtitle="Définissez vos besoins en mobilier et rangements"
    >
      {/* Room selection */}
      <FormQuestion label="Quelles pièces sont concernées ?">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {roomOptions.map((room) => (
            <div key={room.value} className="flex items-center space-x-2">
              <Checkbox
                id={`furniture-room-${room.value}`}
                checked={data.selectedRooms.includes(room.value)}
                onCheckedChange={() => toggleRoom(room.value)}
              />
              <Label
                htmlFor={`furniture-room-${room.value}`}
                className="text-sm font-normal cursor-pointer"
              >
                {room.label}
              </Label>
            </div>
          ))}
        </div>
      </FormQuestion>

      <FormQuestion label="Quels types d'aménagements souhaitez-vous ?">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
          {furnitureTypes.map((type) => (
            <SelectableCard
              key={type.value}
              selected={data.furnitureType.includes(type.value)}
              onClick={() => toggleFurnitureType(type.value)}
              emoji={type.emoji}
              title={type.label}
              size="sm"
            />
          ))}
        </div>
      </FormQuestion>

      <FormQuestion label="Quelle approche préférez-vous ?">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {approaches.map((approach) => (
            <SelectableCard
              key={approach.value}
              selected={data.approach === approach.value}
              onClick={() => onUpdate({ approach: approach.value })}
              title={approach.label}
              description={approach.description}
              size="md"
            />
          ))}
        </div>
      </FormQuestion>

      <FormQuestion label="Décrivez vos besoins en détail (facultatif) :">
        <Textarea
          value={data.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          placeholder="Ex: Je souhaite un dressing de 2m de large avec penderies et étagères, une bibliothèque murale dans le salon..."
          className="min-h-[100px]"
        />
      </FormQuestion>
    </FormSection>
  );
};
