import React from 'react';
import { useRenovationForm } from '../RenovationFormContext';
import { FormSection } from '../FormSection';
import { FormQuestion } from '../FormQuestion';
import { SelectableCard } from '../SelectableCard';
import { GlassPanelData } from '../types';

interface GlassPanelModuleProps {
  roomId: string;
  roomName: string;
  data: GlassPanelData;
}

export const GlassPanelModule: React.FC<GlassPanelModuleProps> = ({ roomId, roomName, data }) => {
  const { updateRoomData } = useRenovationForm();

  const updateData = (updates: Partial<GlassPanelData>) => {
    updateRoomData(roomId, { glassPanelData: { ...data, ...updates } });
  };

  const togglePurpose = (value: string) => {
    const current = data.purpose;
    if (current.includes(value)) {
      updateData({ purpose: current.filter(v => v !== value) });
    } else {
      updateData({ purpose: [...current, value] });
    }
  };

  const purposes = [
    { value: 'lumiere', label: 'Apporter de la lumière', emoji: '☀️' },
    { value: 'separer', label: 'Séparer des espaces', emoji: '🚪' },
    { value: 'decoratif', label: 'Créer un élément décoratif', emoji: '🎨' },
  ];

  const panelTypes = [
    { value: 'verriere-atelier', label: 'Verrière atelier', emoji: '🏭' },
    { value: 'verriere-hauteur', label: 'Verrière toute hauteur', emoji: '🪟' },
    { value: 'claustra-bois-metal', label: 'Claustra bois / métal', emoji: '🪵' },
    { value: 'ne-sais-pas', label: 'Je ne sais pas', emoji: '❓' },
  ];

  return (
    <FormSection
      title={`Verrière / Claustra - ${roomName}`}
      subtitle="Définissez vos besoins en verrière ou claustra"
    >
      <FormQuestion label="Cette verrière / claustra servira à :">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {purposes.map((purpose) => (
            <SelectableCard
              key={purpose.value}
              selected={data.purpose.includes(purpose.value)}
              onClick={() => togglePurpose(purpose.value)}
              emoji={purpose.emoji}
              title={purpose.label}
            />
          ))}
        </div>
      </FormQuestion>

      <FormQuestion label="Type souhaité :">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {panelTypes.map((type) => (
            <SelectableCard
              key={type.value}
              selected={data.panelType === type.value}
              onClick={() => updateData({ panelType: type.value })}
              emoji={type.emoji}
              title={type.label}
              size="sm"
            />
          ))}
        </div>
      </FormQuestion>
    </FormSection>
  );
};
