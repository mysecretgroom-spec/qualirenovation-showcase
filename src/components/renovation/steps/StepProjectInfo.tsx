import React from 'react';
import { useRenovationForm } from '../RenovationFormContext';
import { FormSection } from '../FormSection';
import { FormQuestion } from '../FormQuestion';
import { SelectableCard } from '../SelectableCard';
import { Input } from '@/components/ui/input';
import { Building2, Home } from 'lucide-react';

export const StepProjectInfo: React.FC = () => {
  const { formData, updateFormData } = useRenovationForm();

  const constructionPeriods = [
    { value: 'avant-1949', label: 'Avant 1949' },
    { value: '1949-1974', label: '1949 – 1974' },
    { value: '1975-1999', label: '1975 – 1999' },
    { value: 'apres-2000', label: 'Après 2000' },
    { value: 'ne-sais-pas', label: 'Je ne sais pas' },
  ];

  return (
    <FormSection
      title="Parlons de votre projet dans sa globalité"
      subtitle="Quelques informations essentielles pour bien comprendre votre bien"
    >
      {/* Property Type */}
      <FormQuestion label="Quel type de bien est concerné ?" required>
        <div className="grid grid-cols-2 gap-4">
          <SelectableCard
            selected={formData.propertyType === 'appartement'}
            onClick={() => updateFormData('propertyType', 'appartement')}
            icon={<Building2 className="w-8 h-8" />}
            title="Appartement"
          />
          <SelectableCard
            selected={formData.propertyType === 'maison'}
            onClick={() => updateFormData('propertyType', 'maison')}
            icon={<Home className="w-8 h-8" />}
            title="Maison"
          />
        </div>
      </FormQuestion>

      {/* Surface */}
      <FormQuestion 
        label="Quelle est la surface approximative du logement ?" 
        required
        hint="Une estimation suffit à ce stade"
      >
        <div className="flex items-center gap-2 max-w-xs">
          <Input
            type="number"
            value={formData.surface}
            onChange={(e) => updateFormData('surface', e.target.value)}
            placeholder="Ex: 75"
            className="text-center"
          />
          <span className="text-muted-foreground">m²</span>
        </div>
      </FormQuestion>

      {/* Construction Period */}
      <FormQuestion label="Année de construction (ou période)">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {constructionPeriods.map((period) => (
            <SelectableCard
              key={period.value}
              selected={formData.constructionPeriod === period.value}
              onClick={() => updateFormData('constructionPeriod', period.value as typeof formData.constructionPeriod)}
              title={period.label}
              size="sm"
            />
          ))}
        </div>
      </FormQuestion>

      {/* City */}
      <FormQuestion label="Ville du projet" required>
        <Input
          type="text"
          value={formData.city}
          onChange={(e) => updateFormData('city', e.target.value)}
          placeholder="Ex: Paris 16ème, Neuilly-sur-Seine..."
          className="max-w-md"
        />
      </FormQuestion>
    </FormSection>
  );
};
