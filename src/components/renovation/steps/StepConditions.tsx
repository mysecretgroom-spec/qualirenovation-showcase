import React from 'react';
import { useRenovationForm } from '../RenovationFormContext';
import { FormSection } from '../FormSection';
import { FormQuestion } from '../FormQuestion';
import { SelectableCard } from '../SelectableCard';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Home, UserX, Clock, Building2, Truck, Calendar, Zap, HelpCircle } from 'lucide-react';

export const StepConditions: React.FC = () => {
  const { formData, updateFormData } = useRenovationForm();

  const constraints = [
    { value: 'copropriete', label: 'Copropriété / syndic', icon: <Building2 className="w-5 h-5" /> },
    { value: 'acces', label: 'Accès / étage / ascenseur', icon: <Truck className="w-5 h-5" /> },
    { value: 'delais', label: 'Délais impératifs', icon: <Calendar className="w-5 h-5" /> },
  ];

  const toggleConstraint = (value: string) => {
    const current = formData.constraints;
    if (current.includes(value)) {
      updateFormData('constraints', current.filter(c => c !== value));
    } else {
      updateFormData('constraints', [...current, value]);
    }
  };

  return (
    <FormSection
      title="Anticipons les conditions des travaux"
      subtitle="Ces informations nous aident à planifier au mieux votre chantier"
    >
      {/* Occupy during works */}
      <FormQuestion label="Prévoyez-vous d'occuper le logement pendant les travaux ?">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SelectableCard
            selected={formData.occupyDuringWorks === 'oui'}
            onClick={() => updateFormData('occupyDuringWorks', 'oui')}
            icon={<Home className="w-6 h-6" />}
            title="Oui"
            description="Je resterai dans le logement"
          />
          <SelectableCard
            selected={formData.occupyDuringWorks === 'non'}
            onClick={() => updateFormData('occupyDuringWorks', 'non')}
            icon={<UserX className="w-6 h-6" />}
            title="Non"
            description="Le logement sera vide"
          />
          <SelectableCard
            selected={formData.occupyDuringWorks === 'partiellement'}
            onClick={() => updateFormData('occupyDuringWorks', 'partiellement')}
            icon={<Clock className="w-6 h-6" />}
            title="Partiellement"
            description="Selon les phases du chantier"
          />
        </div>
      </FormQuestion>

      {/* Constraints */}
      <FormQuestion label="Avez-vous des contraintes spécifiques ?">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {constraints.map((constraint) => (
            <SelectableCard
              key={constraint.value}
              selected={formData.constraints.includes(constraint.value)}
              onClick={() => toggleConstraint(constraint.value)}
              icon={constraint.icon}
              title={constraint.label}
              size="sm"
            />
          ))}
        </div>

        <Textarea
          value={formData.constraintDetails}
          onChange={(e) => updateFormData('constraintDetails', e.target.value)}
          placeholder="Autres contraintes ou précisions (facultatif)..."
          className="mt-4 min-h-[100px]"
        />
      </FormQuestion>

      {/* Start date */}
      <FormQuestion label="Date idéale de démarrage des travaux">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SelectableCard
            selected={formData.startDate === 'asap'}
            onClick={() => updateFormData('startDate', 'asap')}
            icon={<Zap className="w-6 h-6" />}
            title="Le plus tôt possible"
            size="sm"
          />
          <SelectableCard
            selected={formData.startDate === 'from-date'}
            onClick={() => updateFormData('startDate', 'from-date')}
            icon={<Calendar className="w-6 h-6" />}
            title="À partir de..."
            size="sm"
          />
          <SelectableCard
            selected={formData.startDate === 'flexible'}
            onClick={() => updateFormData('startDate', 'flexible')}
            icon={<HelpCircle className="w-6 h-6" />}
            title="Flexible"
            size="sm"
          />
        </div>

        {formData.startDate === 'from-date' && (
          <Input
            type="date"
            value={formData.startDateValue}
            onChange={(e) => updateFormData('startDateValue', e.target.value)}
            className="mt-4 max-w-xs"
          />
        )}
      </FormQuestion>
    </FormSection>
  );
};
