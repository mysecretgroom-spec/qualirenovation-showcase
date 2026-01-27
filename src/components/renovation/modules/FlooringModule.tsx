import React from 'react';
import { useRenovationForm } from '../RenovationFormContext';
import { FormSection } from '../FormSection';
import { FormQuestion } from '../FormQuestion';
import { SelectableCard } from '../SelectableCard';
import { FlooringData } from '../types';

interface FlooringModuleProps {
  roomId: string;
  roomName: string;
  data: FlooringData;
}

export const FlooringModule: React.FC<FlooringModuleProps> = ({ roomId, roomName, data }) => {
  const { updateRoomData } = useRenovationForm();

  const updateData = (updates: Partial<FlooringData>) => {
    updateRoomData(roomId, { flooringData: { ...data, ...updates } });
  };

  const floorTypes = [
    { value: 'parquet', label: 'Parquet', emoji: '🪵' },
    { value: 'carrelage', label: 'Carrelage', emoji: '🔲' },
    { value: 'sol-souple', label: 'Sol souple', emoji: '🏠' },
    { value: 'a-definir', label: 'À définir', emoji: '❓' },
  ];

  const layingPatterns = [
    { value: 'droite', label: 'Droite' },
    { value: 'chevron', label: 'Chevron' },
    { value: 'point-hongrie', label: 'Point de Hongrie' },
    { value: 'autre', label: 'Autre' },
  ];

  const existingActions = [
    { value: 'conserver', label: 'Conserver' },
    { value: 'remplacer', label: 'Remplacer' },
    { value: 'etudier', label: 'Étudier la faisabilité' },
  ];

  return (
    <FormSection
      title={`Sols - ${roomName}`}
      subtitle="Définissez vos besoins en revêtements de sol pour cette pièce"
    >
      <FormQuestion label="Type de sol souhaité :">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {floorTypes.map((type) => (
            <SelectableCard
              key={type.value}
              selected={data.floorType === type.value}
              onClick={() => updateData({ floorType: type.value })}
              emoji={type.emoji}
              title={type.label}
              size="sm"
            />
          ))}
        </div>
      </FormQuestion>

      {data.floorType === 'parquet' && (
        <FormQuestion label="Type de pose :">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {layingPatterns.map((pattern) => (
              <SelectableCard
                key={pattern.value}
                selected={data.layingPattern === pattern.value}
                onClick={() => updateData({ layingPattern: pattern.value })}
                title={pattern.label}
                size="sm"
              />
            ))}
          </div>
        </FormQuestion>
      )}

      <FormQuestion label="Souhaitez-vous :">
        <div className="grid grid-cols-3 gap-3 max-w-md">
          {existingActions.map((action) => (
            <SelectableCard
              key={action.value}
              selected={data.existingAction === action.value}
              onClick={() => updateData({ existingAction: action.value })}
              title={action.label}
              size="sm"
            />
          ))}
        </div>
      </FormQuestion>
    </FormSection>
  );
};
