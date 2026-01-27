import React from 'react';
import { useRenovationForm } from '../RenovationFormContext';
import { FormSection } from '../FormSection';
import { FormQuestion } from '../FormQuestion';
import { SelectableCard } from '../SelectableCard';
import { MouldingsData } from '../types';

interface MouldingsModuleProps {
  roomId: string;
  roomName: string;
  data: MouldingsData;
}

export const MouldingsModule: React.FC<MouldingsModuleProps> = ({ roomId, roomName, data }) => {
  const { updateRoomData } = useRenovationForm();

  const updateData = (updates: Partial<MouldingsData>) => {
    updateRoomData(roomId, { mouldingsData: { ...data, ...updates } });
  };

  const intentions = [
    { value: 'conserver', label: "Conserver l'existant" },
    { value: 'creer', label: 'Créer de nouvelles moulures' },
    { value: 'renover', label: "Rénover l'existant" },
    { value: 'ne-sais-pas', label: 'Je ne sais pas' },
  ];

  const styles = [
    { value: 'haussmannien', label: 'Haussmannien', emoji: '🏛️' },
    { value: 'contemporain', label: 'Contemporain', emoji: '🔳' },
    { value: 'minimal', label: 'Minimal', emoji: '➖' },
    { value: 'a-definir', label: 'À définir', emoji: '❓' },
  ];

  return (
    <FormSection
      title={`Moulures & modénatures - ${roomName}`}
      subtitle="Définissez vos besoins en moulures pour cette pièce"
    >
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

      {(data.intention === 'creer' || data.intention === 'renover') && (
        <FormQuestion label="Style recherché :">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {styles.map((style) => (
              <SelectableCard
                key={style.value}
                selected={data.style === style.value}
                onClick={() => updateData({ style: style.value })}
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
