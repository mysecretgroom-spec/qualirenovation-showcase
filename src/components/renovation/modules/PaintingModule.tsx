import React from 'react';
import { useRenovationForm } from '../RenovationFormContext';
import { FormSection } from '../FormSection';
import { FormQuestion } from '../FormQuestion';
import { SelectableCard } from '../SelectableCard';
import { PaintingData } from '../types';

interface PaintingModuleProps {
  roomId: string;
  roomName: string;
  data: PaintingData;
}

export const PaintingModule: React.FC<PaintingModuleProps> = ({ roomId, roomName, data }) => {
  const { updateRoomData } = useRenovationForm();

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

  const colorDefinitions = [
    { value: 'oui', label: 'Oui' },
    { value: 'non', label: 'Non' },
    { value: 'en-reflexion', label: 'En cours de réflexion' },
  ];

  const wallConditions = [
    { value: 'bon', label: 'Bon' },
    { value: 'moyen', label: 'Moyen' },
    { value: 'a-reprendre', label: 'À reprendre' },
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
