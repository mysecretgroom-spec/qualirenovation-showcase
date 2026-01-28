import React from 'react';
import { useRenovationForm } from '../RenovationFormContext';
import { FormSection } from '../FormSection';
import { FormQuestion } from '../FormQuestion';
import { SelectableCard } from '../SelectableCard';
import AddressAutocomplete from '@/components/AddressAutocomplete';
import { Input } from '@/components/ui/input';
import { Building2, Home } from 'lucide-react';

export const StepProjectInfo: React.FC = () => {
  const { formData, updateFormData } = useRenovationForm();

  return (
    <FormSection
      title="Parlons de votre projet dans sa globalité"
      subtitle="Quelques informations essentielles pour bien comprendre votre bien"
    >
      {/* Property Type */}
      <FormQuestion label="Quel type de bien est concerné ?" required>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <SelectableCard
            selected={formData.propertyType === 'appartement'}
            onClick={() => updateFormData('propertyType', 'appartement')}
            icon={<Building2 className="w-6 h-6 sm:w-8 sm:h-8" />}
            title="Appartement"
          />
          <SelectableCard
            selected={formData.propertyType === 'maison'}
            onClick={() => updateFormData('propertyType', 'maison')}
            icon={<Home className="w-6 h-6 sm:w-8 sm:h-8" />}
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
        <div className="flex items-center gap-2 max-w-[200px] sm:max-w-xs">
          <Input
            type="number"
            value={formData.surface}
            onChange={(e) => updateFormData('surface', e.target.value)}
            placeholder="Ex: 75"
            className="text-center text-base"
          />
          <span className="text-muted-foreground text-sm">m²</span>
        </div>
      </FormQuestion>

      {/* Address */}
      <FormQuestion label="Adresse complète du projet" required>
        <AddressAutocomplete
          value={formData.address}
          onChange={(result) => {
            if (result) {
              updateFormData('address', result.address);
              updateFormData('city', result.city || '');
              updateFormData('postalCode', result.postalCode || '');
              if (result.latitude) updateFormData('latitude', result.latitude);
              if (result.longitude) updateFormData('longitude', result.longitude);
            } else {
              updateFormData('address', '');
              updateFormData('city', '');
              updateFormData('postalCode', '');
              updateFormData('latitude', undefined);
              updateFormData('longitude', undefined);
            }
          }}
          className="max-w-lg"
        />
      </FormQuestion>
    </FormSection>
  );
};
