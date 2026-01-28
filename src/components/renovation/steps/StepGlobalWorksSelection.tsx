import React from 'react';
import { useRenovationForm } from '../RenovationFormContext';
import { FormSection } from '../FormSection';
import { FormQuestion } from '../FormQuestion';
import { SelectableCard } from '../SelectableCard';
import { Paintbrush, Layers, Zap } from 'lucide-react';

export const StepGlobalWorksSelection: React.FC = () => {
  const { formData, updateFormData } = useRenovationForm();

  const yesNoOptions = [
    { value: 'oui', label: 'Oui' },
    { value: 'non', label: 'Non' },
  ];

  return (
    <FormSection
      title="Travaux transversaux"
      subtitle="Indiquez si vous avez besoin de travaux de peinture, sols ou électricité dans votre projet"
    >
      {/* Painting */}
      <FormQuestion label="Avez-vous besoin de travaux de peinture ?">
        <div className="flex items-center gap-2 mb-4">
          <Paintbrush className="w-5 h-5 text-primary" />
          <span className="text-muted-foreground text-sm">Murs, plafonds, boiseries...</span>
        </div>
        <div className="grid grid-cols-2 gap-4 max-w-xs">
          {yesNoOptions.map((option) => (
            <SelectableCard
              key={option.value}
              selected={formData.needsGlobalPainting === option.value}
              onClick={() => updateFormData('needsGlobalPainting', option.value as 'oui' | 'non')}
              title={option.label}
              size="sm"
            />
          ))}
        </div>
      </FormQuestion>

      {/* Flooring */}
      <FormQuestion label="Avez-vous besoin de travaux de sols ?">
        <div className="flex items-center gap-2 mb-4">
          <Layers className="w-5 h-5 text-primary" />
          <span className="text-muted-foreground text-sm">Parquet, carrelage, rénovation...</span>
        </div>
        <div className="grid grid-cols-2 gap-4 max-w-xs">
          {yesNoOptions.map((option) => (
            <SelectableCard
              key={option.value}
              selected={formData.needsGlobalFlooring === option.value}
              onClick={() => updateFormData('needsGlobalFlooring', option.value as 'oui' | 'non')}
              title={option.label}
              size="sm"
            />
          ))}
        </div>
      </FormQuestion>

      {/* Electricity */}
      <FormQuestion label="Avez-vous besoin de travaux d'électricité ?">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-primary" />
          <span className="text-muted-foreground text-sm">Prises, éclairage, mise aux normes...</span>
        </div>
        <div className="grid grid-cols-2 gap-4 max-w-xs">
          {yesNoOptions.map((option) => (
            <SelectableCard
              key={option.value}
              selected={formData.needsGlobalElectricity === option.value}
              onClick={() => updateFormData('needsGlobalElectricity', option.value as 'oui' | 'non')}
              title={option.label}
              size="sm"
            />
          ))}
        </div>
      </FormQuestion>
    </FormSection>
  );
};
