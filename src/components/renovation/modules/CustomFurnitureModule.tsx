import React from 'react';
import { useRenovationForm } from '../RenovationFormContext';
import { FormSection } from '../FormSection';
import { FormQuestion } from '../FormQuestion';
import { SelectableCard } from '../SelectableCard';
import { CustomFurnitureData } from '../types';
import { Shirt, BookOpen, Tv, DoorOpen, HelpCircle } from 'lucide-react';

interface CustomFurnitureModuleProps {
  roomId: string;
  roomName: string;
  data: CustomFurnitureData;
}

export const CustomFurnitureModule: React.FC<CustomFurnitureModuleProps> = ({ 
  roomId, 
  roomName, 
  data 
}) => {
  const { updateRoomData } = useRenovationForm();

  const updateData = (updates: Partial<CustomFurnitureData>) => {
    updateRoomData(roomId, { customFurnitureData: { ...data, ...updates } });
  };

  const toggleFurnitureType = (value: string) => {
    const current = data.furnitureType;
    if (current.includes(value)) {
      updateData({ furnitureType: current.filter(v => v !== value) });
    } else {
      updateData({ furnitureType: [...current, value] });
    }
  };

  const furnitureTypes = [
    { value: 'dressing', label: 'Dressing', icon: <Shirt className="w-6 h-6" /> },
    { value: 'bibliotheque', label: 'Bibliothèque', icon: <BookOpen className="w-6 h-6" /> },
    { value: 'meuble-tv', label: 'Meuble TV', icon: <Tv className="w-6 h-6" /> },
    { value: 'entree', label: 'Entrée', icon: <DoorOpen className="w-6 h-6" /> },
    { value: 'autre', label: 'Autre', icon: <HelpCircle className="w-6 h-6" /> },
  ];

  const approaches = [
    { value: 'sur-mesure', label: 'Du sur mesure' },
    { value: 'optimisation', label: "Optimisation de l'existant" },
    { value: 'conseille', label: 'Être conseillé' },
  ];

  const supportLevels = [
    { value: 'execution', label: 'Exécution' },
    { value: 'conception-realisation', label: 'Conception + réalisation' },
    { value: 'aide-decision', label: 'Aide à la décision' },
    { value: 'ne-sais-pas', label: 'Je ne sais pas encore' },
  ];

  return (
    <FormSection
      title={roomName}
      subtitle="Définissez vos besoins en aménagements sur mesure"
    >
      <FormQuestion label="Quel type d'aménagement ?">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {furnitureTypes.map((type) => (
            <SelectableCard
              key={type.value}
              selected={data.furnitureType.includes(type.value)}
              onClick={() => toggleFurnitureType(type.value)}
              icon={type.icon}
              title={type.label}
            />
          ))}
        </div>
      </FormQuestion>

      <FormQuestion label="Souhaitez-vous :">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {approaches.map((approach) => (
            <SelectableCard
              key={approach.value}
              selected={data.approach === approach.value}
              onClick={() => updateData({ approach: approach.value })}
              title={approach.label}
            />
          ))}
        </div>
      </FormQuestion>

      <FormQuestion label="Niveau d'accompagnement :">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {supportLevels.map((level) => (
            <SelectableCard
              key={level.value}
              selected={data.supportLevel === level.value}
              onClick={() => updateData({ supportLevel: level.value })}
              title={level.label}
              size="sm"
            />
          ))}
        </div>
      </FormQuestion>
    </FormSection>
  );
};
