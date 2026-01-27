import React from 'react';
import { useRenovationForm } from '../RenovationFormContext';
import { FormSection } from '../FormSection';
import { FormQuestion } from '../FormQuestion';
import { SelectableCard } from '../SelectableCard';
import { FlooringData } from '../types';

// Import flooring images
import parquetImg from '@/assets/flooring/parquet.jpg';
import carrelageImg from '@/assets/flooring/carrelage.jpg';
import solSoupleImg from '@/assets/flooring/sol-souple.jpg';
import parquetChevron from '@/assets/flooring/parquet-chevron.jpg';
import parquetPointHongrie from '@/assets/flooring/parquet-point-hongrie.jpg';
import parquetDroit from '@/assets/flooring/parquet-droit.jpg';
import carrelageGrandFormat from '@/assets/flooring/carrelage-grand-format.jpg';

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
    { value: 'parquet', label: 'Parquet', image: parquetImg },
    { value: 'carrelage', label: 'Carrelage', image: carrelageImg },
    { value: 'sol-souple', label: 'Sol souple', image: solSoupleImg },
    { value: 'a-definir', label: 'À définir', emoji: '❓' },
  ];

  const layingPatterns = [
    { value: 'droite', label: 'Pose droite', image: parquetDroit },
    { value: 'chevron', label: 'Chevron', image: parquetChevron },
    { value: 'point-hongrie', label: 'Point de Hongrie', image: parquetPointHongrie },
    { value: 'autre', label: 'Autre' },
  ];

  const tileFormats = [
    { value: 'grand-format', label: 'Grand format', image: carrelageGrandFormat },
    { value: 'standard', label: 'Standard', image: carrelageImg },
    { value: 'autre', label: 'Autre format' },
    { value: 'a-definir', label: 'À définir' },
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {floorTypes.map((type) => (
            <SelectableCard
              key={type.value}
              selected={data.floorType === type.value}
              onClick={() => updateData({ floorType: type.value })}
              image={type.image}
              emoji={type.emoji}
              title={type.label}
              size="md"
            />
          ))}
        </div>
      </FormQuestion>

      {data.floorType === 'parquet' && (
        <FormQuestion label="Type de pose :">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {layingPatterns.map((pattern) => (
              <SelectableCard
                key={pattern.value}
                selected={data.layingPattern === pattern.value}
                onClick={() => updateData({ layingPattern: pattern.value })}
                image={pattern.image}
                title={pattern.label}
                size="md"
              />
            ))}
          </div>
        </FormQuestion>
      )}

      {data.floorType === 'carrelage' && (
        <FormQuestion label="Format de carrelage :">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {tileFormats.map((format) => (
              <SelectableCard
                key={format.value}
                selected={data.layingPattern === format.value}
                onClick={() => updateData({ layingPattern: format.value })}
                image={format.image}
                title={format.label}
                size="md"
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
