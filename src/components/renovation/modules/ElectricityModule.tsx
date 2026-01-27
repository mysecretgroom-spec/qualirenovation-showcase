import React from 'react';
import { useRenovationForm } from '../RenovationFormContext';
import { FormSection } from '../FormSection';
import { FormQuestion } from '../FormQuestion';
import { SelectableCard } from '../SelectableCard';
import { ElectricityData } from '../types';

interface ElectricityModuleProps {
  roomId: string;
  roomName: string;
  data: ElectricityData;
}

export const ElectricityModule: React.FC<ElectricityModuleProps> = ({ roomId, roomName, data }) => {
  const { updateRoomData } = useRenovationForm();

  const updateData = (updates: Partial<ElectricityData>) => {
    updateRoomData(roomId, { electricityData: { ...data, ...updates } });
  };

  const toggleArrayValue = (key: 'workType' | 'additionalNeeds', value: string) => {
    const current = data[key];
    if (current.includes(value)) {
      updateData({ [key]: current.filter(v => v !== value) });
    } else {
      updateData({ [key]: [...current, value] });
    }
  };

  const workTypes = [
    { value: 'creation', label: 'Création' },
    { value: 'modification', label: 'Modification' },
    { value: 'remplacement', label: 'Remplacement' },
    { value: 'mise-aux-normes', label: 'Mise aux normes' },
    { value: 'ne-sais-pas', label: 'Je ne sais pas' },
  ];

  const switchStyles = [
    { value: 'blanc', label: 'Blanc' },
    { value: 'noir', label: 'Noir' },
    { value: 'laiton', label: 'Laiton' },
    { value: 'autre', label: 'Autre' },
    { value: 'indifferent', label: 'Indifférent' },
  ];

  const additionalNeeds = [
    { value: 'plus-prises', label: 'Plus de prises' },
    { value: 'prises-speciales', label: 'Prises spécifiques (USB, RJ45)' },
    { value: 'eclairage-repense', label: 'Un éclairage repensé' },
    { value: 'ne-sais-pas', label: 'Je ne sais pas encore' },
  ];

  return (
    <FormSection
      title={`Électricité - ${roomName}`}
      subtitle="Définissez vos besoins électriques pour cette pièce"
    >
      <FormQuestion label="Nature des travaux :">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {workTypes.map((type) => (
            <SelectableCard
              key={type.value}
              selected={data.workType.includes(type.value)}
              onClick={() => toggleArrayValue('workType', type.value)}
              title={type.label}
              size="sm"
            />
          ))}
        </div>
      </FormQuestion>

      <FormQuestion label="Style d'appareillage souhaité :">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {switchStyles.map((style) => (
            <SelectableCard
              key={style.value}
              selected={data.switchStyle === style.value}
              onClick={() => updateData({ switchStyle: style.value })}
              title={style.label}
              size="sm"
            />
          ))}
        </div>
      </FormQuestion>

      <FormQuestion label="Souhaitez-vous :">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {additionalNeeds.map((need) => (
            <SelectableCard
              key={need.value}
              selected={data.additionalNeeds.includes(need.value)}
              onClick={() => toggleArrayValue('additionalNeeds', need.value)}
              title={need.label}
              size="sm"
            />
          ))}
        </div>
      </FormQuestion>
    </FormSection>
  );
};
