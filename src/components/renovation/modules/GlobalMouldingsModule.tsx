import React from 'react';
import { FormSection } from '../FormSection';
import { FormQuestion } from '../FormQuestion';
import { SelectableCard } from '../SelectableCard';
import { GlobalMouldingsData } from '../types';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface GlobalMouldingsModuleProps {
  data: GlobalMouldingsData;
  onUpdate: (data: Partial<GlobalMouldingsData>) => void;
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
  { value: 'cuisine', label: 'Cuisine' },
  { value: 'salle-a-manger', label: 'Salle à manger' },
];

export const GlobalMouldingsModule: React.FC<GlobalMouldingsModuleProps> = ({ data, onUpdate }) => {
  const toggleRoom = (room: string) => {
    const current = data.selectedRooms;
    if (current.includes(room)) {
      onUpdate({ selectedRooms: current.filter(r => r !== room) });
    } else {
      onUpdate({ selectedRooms: [...current, room] });
    }
  };

  const intentions = [
    { value: 'conserver', label: "Conserver l'existant", emoji: '✓' },
    { value: 'creer', label: 'Créer de nouvelles moulures', emoji: '✨' },
    { value: 'renover', label: "Rénover l'existant", emoji: '🔧' },
    { value: 'ne-sais-pas', label: 'Je ne sais pas', emoji: '❓' },
  ];

  const styles = [
    { value: 'haussmannien', label: 'Haussmannien', emoji: '🏛️' },
    { value: 'contemporain', label: 'Contemporain', emoji: '🔳' },
    { value: 'minimal', label: 'Minimal', emoji: '➖' },
    { value: 'a-definir', label: 'À définir', emoji: '❓' },
  ];

  return (
    <FormSection
      title="Moulures & modénatures"
      subtitle="Définissez vos besoins en moulures"
    >
      {/* Room selection */}
      <FormQuestion label="Quelles pièces sont concernées ?">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {roomOptions.map((room) => (
            <div key={room.value} className="flex items-center space-x-2">
              <Checkbox
                id={`mouldings-room-${room.value}`}
                checked={data.selectedRooms.includes(room.value)}
                onCheckedChange={() => toggleRoom(room.value)}
              />
              <Label
                htmlFor={`mouldings-room-${room.value}`}
                className="text-sm font-normal cursor-pointer"
              >
                {room.label}
              </Label>
            </div>
          ))}
        </div>
      </FormQuestion>

      <FormQuestion label="Souhaitez-vous :">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
          {intentions.map((intention) => (
            <SelectableCard
              key={intention.value}
              selected={data.intention === intention.value}
              onClick={() => onUpdate({ intention: intention.value })}
              emoji={intention.emoji}
              title={intention.label}
              size="sm"
            />
          ))}
        </div>
      </FormQuestion>

      {(data.intention === 'creer' || data.intention === 'renover') && (
        <FormQuestion label="Style recherché :">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
            {styles.map((style) => (
              <SelectableCard
                key={style.value}
                selected={data.style === style.value}
                onClick={() => onUpdate({ style: style.value })}
                emoji={style.emoji}
                title={style.label}
                size="sm"
              />
            ))}
          </div>
        </FormQuestion>
      )}
    </FormSection>
  );
};
