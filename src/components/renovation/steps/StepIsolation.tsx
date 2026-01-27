import React from 'react';
import { useRenovationForm } from '../RenovationFormContext';
import { FormSection } from '../FormSection';
import { FormQuestion } from '../FormQuestion';
import { SelectableCard } from '../SelectableCard';
import { IsolationData } from '../types';
import { 
  Thermometer, ThermometerSnowflake, HelpCircle, CheckCircle, XCircle,
  Home, Building2, Layers, Volume2, TrendingUp, Wrench, FileText, Coins
} from 'lucide-react';

// Import isolation images
import isolationInterieur from '@/assets/isolation/isolation-interieur.jpg';
import isolationExterieur from '@/assets/isolation/isolation-exterieur.jpg';

export const StepIsolation: React.FC = () => {
  const { formData, updateFormData } = useRenovationForm();
  const isolation = formData.isolation;

  const updateIsolation = <K extends keyof IsolationData>(key: K, value: IsolationData[K]) => {
    updateFormData('isolation', { ...isolation, [key]: value });
  };

  const toggleArrayValue = (key: 'zones' | 'constraints' | 'supportNeeds', value: string) => {
    const current = isolation[key];
    if (current.includes(value)) {
      updateIsolation(key, current.filter(v => v !== value));
    } else {
      updateIsolation(key, [...current, value]);
    }
  };

  const isolationTypes = [
    { value: 'interieur', label: "Isolation par l'intérieur", image: isolationInterieur },
    { value: 'exterieur', label: "Isolation par l'extérieur", image: isolationExterieur },
    { value: 'les-deux', label: "Les deux, à étudier", emoji: '🔄' },
    { value: 'ne-sais-pas', label: "Je ne sais pas, j'ai besoin de conseils", emoji: '❓' },
  ];

  const zones = [
    { value: 'murs', label: 'Murs' },
    { value: 'plancher-bas', label: 'Plancher bas' },
    { value: 'plafonds-combles', label: 'Plafonds / combles' },
    { value: 'cloisons', label: 'Cloisons intérieures' },
    { value: 'ne-sais-pas', label: 'Je ne sais pas encore' },
  ];

  const constraints = [
    { value: 'copropriete', label: 'Copropriété / façade classée' },
    { value: 'surface', label: 'Perte de surface à éviter' },
    { value: 'hauteur', label: 'Hauteur sous plafond limitée' },
    { value: 'aucune', label: 'Aucune contrainte connue' },
    { value: 'ne-sais-pas', label: 'Je ne sais pas' },
  ];

  const goals = [
    { value: 'dpe', label: 'Améliorer le DPE', icon: <FileText className="w-5 h-5" /> },
    { value: 'conso', label: "Réduire les consommations d'énergie", icon: <Coins className="w-5 h-5" /> },
    { value: 'confort', label: 'Améliorer le confort thermique', icon: <Thermometer className="w-5 h-5" /> },
    { value: 'acoustique', label: 'Réduire les nuisances sonores', icon: <Volume2 className="w-5 h-5" /> },
    { value: 'valorisation', label: 'Valoriser le bien', icon: <TrendingUp className="w-5 h-5" /> },
    { value: 'ne-sais-pas', label: 'Je ne sais pas encore', icon: <HelpCircle className="w-5 h-5" /> },
  ];

  const supportOptions = [
    { value: 'diagnostic', label: 'Le diagnostic thermique' },
    { value: 'solutions', label: 'Les solutions techniques' },
    { value: 'coordination', label: 'La coordination des travaux' },
    { value: 'ensemble', label: "L'ensemble du projet" },
    { value: 'ne-sais-pas', label: 'Je ne sais pas encore' },
  ];

  return (
    <FormSection
      title="Isolation & performance thermique"
      subtitle="Améliorez le confort et la performance énergétique de votre logement"
      hint="Le choix dépend du logement, de la copropriété et des objectifs énergétiques."
    >
      {/* Want isolation */}
      <FormQuestion label="Souhaitez-vous améliorer l'isolation de votre logement ?" required>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SelectableCard
            selected={isolation.wantIsolation === 'oui'}
            onClick={() => updateIsolation('wantIsolation', 'oui')}
            icon={<CheckCircle className="w-6 h-6" />}
            title="Oui"
          />
          <SelectableCard
            selected={isolation.wantIsolation === 'non'}
            onClick={() => updateIsolation('wantIsolation', 'non')}
            icon={<XCircle className="w-6 h-6" />}
            title="Non"
          />
          <SelectableCard
            selected={isolation.wantIsolation === 'ne-sais-pas'}
            onClick={() => updateIsolation('wantIsolation', 'ne-sais-pas')}
            icon={<HelpCircle className="w-6 h-6" />}
            title="Je ne sais pas encore"
          />
        </div>
      </FormQuestion>

      {(isolation.wantIsolation === 'oui' || isolation.wantIsolation === 'ne-sais-pas') && (
        <>
          {/* Isolation type */}
          <FormQuestion label="Quel type d'isolation souhaitez-vous étudier ?">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isolationTypes.map((type) => (
                <SelectableCard
                  key={type.value}
                  selected={isolation.isolationType === type.value}
                  onClick={() => updateIsolation('isolationType', type.value)}
                  image={type.image}
                  emoji={type.emoji}
                  title={type.label}
                  size="lg"
                />
              ))}
            </div>
          </FormQuestion>

          {/* Zones */}
          <FormQuestion label="Quelles parties du logement sont concernées par l'isolation ?">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {zones.map((zone) => (
                <SelectableCard
                  key={zone.value}
                  selected={isolation.zones.includes(zone.value)}
                  onClick={() => toggleArrayValue('zones', zone.value)}
                  title={zone.label}
                  size="sm"
                />
              ))}
            </div>
          </FormQuestion>

          {/* Constraints */}
          <FormQuestion label="Avez-vous connaissance de contraintes spécifiques ?">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {constraints.map((constraint) => (
                <SelectableCard
                  key={constraint.value}
                  selected={isolation.constraints.includes(constraint.value)}
                  onClick={() => toggleArrayValue('constraints', constraint.value)}
                  title={constraint.label}
                  size="sm"
                />
              ))}
            </div>
          </FormQuestion>

          {/* Primary goal */}
          <FormQuestion label="Quel est votre objectif principal avec l'isolation ?">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {goals.map((goal) => (
                <SelectableCard
                  key={goal.value}
                  selected={isolation.primaryGoal === goal.value}
                  onClick={() => updateIsolation('primaryGoal', goal.value)}
                  icon={goal.icon}
                  title={goal.label}
                  size="sm"
                />
              ))}
            </div>
          </FormQuestion>

          {/* Support needs */}
          <FormQuestion label="Souhaitez-vous être accompagné(e) sur :">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {supportOptions.map((option) => (
                <SelectableCard
                  key={option.value}
                  selected={isolation.supportNeeds.includes(option.value)}
                  onClick={() => toggleArrayValue('supportNeeds', option.value)}
                  title={option.label}
                  size="sm"
                />
              ))}
            </div>
          </FormQuestion>

          {/* Financing info */}
          <FormQuestion label="Souhaitez-vous être informé(e) sur les aides et dispositifs possibles ?">
            <div className="grid grid-cols-3 gap-3 max-w-md">
              <SelectableCard
                selected={isolation.wantFinancingInfo === 'oui'}
                onClick={() => updateIsolation('wantFinancingInfo', 'oui')}
                title="Oui"
                size="sm"
              />
              <SelectableCard
                selected={isolation.wantFinancingInfo === 'non'}
                onClick={() => updateIsolation('wantFinancingInfo', 'non')}
                title="Non"
                size="sm"
              />
              <SelectableCard
                selected={isolation.wantFinancingInfo === 'peut-etre'}
                onClick={() => updateIsolation('wantFinancingInfo', 'peut-etre')}
                title="Peut-être"
                size="sm"
              />
            </div>
          </FormQuestion>
        </>
      )}
    </FormSection>
  );
};
