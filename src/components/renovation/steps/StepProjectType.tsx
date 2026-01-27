import React from 'react';
import { useRenovationForm } from '../RenovationFormContext';
import { FormSection } from '../FormSection';
import { FormQuestion } from '../FormQuestion';
import { SelectableCard } from '../SelectableCard';
import { 
  Battery, Sofa, Palette, Home, TrendingUp, RefreshCw, HelpCircle,
  Building2, KeyRound, DollarSign, FileText
} from 'lucide-react';

export const StepProjectType: React.FC = () => {
  const { formData, updateFormData } = useRenovationForm();

  const projectTypes = [
    { value: 'dpe', label: "Amélioration de la performance énergétique (DPE)", icon: <Battery className="w-6 h-6" />, emoji: '🔋' },
    { value: 'confort', label: "Travaux de confort au quotidien", icon: <Sofa className="w-6 h-6" />, emoji: '🛋️' },
    { value: 'esthetique', label: "Projet esthétique / décoratif", icon: <Palette className="w-6 h-6" />, emoji: '🎨' },
    { value: 'global', label: "Rénovation globale du logement", icon: <Home className="w-6 h-6" />, emoji: '🏠' },
    { value: 'valorisation', label: "Valorisation immobilière (revente ou location)", icon: <TrendingUp className="w-6 h-6" />, emoji: '💰' },
    { value: 'remise-etat', label: "Remise en état / rénovation après plusieurs années", icon: <RefreshCw className="w-6 h-6" />, emoji: '🔄' },
    { value: 'accompagnement', label: "Je ne sais pas encore, j'ai besoin d'être accompagné(e)", icon: <HelpCircle className="w-6 h-6" />, emoji: '❓' },
  ];

  const projectContexts = [
    { value: 'residence-principale', label: "Résidence principale", icon: <Home className="w-5 h-5" /> },
    { value: 'residence-secondaire', label: "Résidence secondaire", icon: <Building2 className="w-5 h-5" /> },
    { value: 'location', label: "Mise en location", icon: <KeyRound className="w-5 h-5" /> },
    { value: 'revente', label: "Préparation à la revente", icon: <DollarSign className="w-5 h-5" /> },
    { value: 'autre', label: "Autre situation", icon: <HelpCircle className="w-5 h-5" /> },
  ];

  const dpeOptions = [
    { value: 'oui-transmis', label: "Oui, je peux le transmettre" },
    { value: 'oui-obsolete', label: "Oui, mais il n'est plus à jour" },
    { value: 'non', label: "Non" },
    { value: 'ne-sais-pas', label: "Je ne sais pas" },
  ];

  const toggleProjectType = (value: string) => {
    const current = formData.projectTypes;
    if (current.includes(value)) {
      updateFormData('projectTypes', current.filter(t => t !== value));
    } else {
      updateFormData('projectTypes', [...current, value]);
    }
  };

  return (
    <FormSection
      title="Quel est le projet que vous souhaitez mener ?"
      hint="Vous pouvez sélectionner plusieurs réponses. Il n'est pas nécessaire d'avoir tout défini à ce stade."
    >
      {/* Project types - multi-select */}
      <FormQuestion label="Ce projet concerne principalement :" required>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {projectTypes.map((type) => (
            <SelectableCard
              key={type.value}
              selected={formData.projectTypes.includes(type.value)}
              onClick={() => toggleProjectType(type.value)}
              emoji={type.emoji}
              title={type.label}
              size="sm"
              className="text-left justify-start flex-row gap-3 px-4"
            />
          ))}
        </div>
      </FormQuestion>

      {/* Project context */}
      <FormQuestion label="Ce projet est envisagé dans quel contexte ?">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {projectContexts.map((ctx) => (
            <SelectableCard
              key={ctx.value}
              selected={formData.projectContext === ctx.value}
              onClick={() => updateFormData('projectContext', ctx.value as typeof formData.projectContext)}
              icon={ctx.icon}
              title={ctx.label}
              size="sm"
            />
          ))}
        </div>
      </FormQuestion>

      {/* DPE question */}
      <FormQuestion 
        label="Disposez-vous d'un DPE récent pour ce logement ?"
        hint="Le diagnostic de performance énergétique nous aide à évaluer les besoins"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {dpeOptions.map((opt) => (
            <SelectableCard
              key={opt.value}
              selected={formData.hasDPE === opt.value}
              onClick={() => updateFormData('hasDPE', opt.value as typeof formData.hasDPE)}
              title={opt.label}
              size="sm"
            />
          ))}
        </div>
        {(formData.hasDPE === 'non' || formData.hasDPE === 'ne-sais-pas') && (
          <p className="text-sm text-muted-foreground mt-3 p-3 bg-secondary/50 rounded-lg">
            💡 Pas d'inquiétude, nous pouvons vous accompagner dans cette démarche.
          </p>
        )}
      </FormQuestion>
    </FormSection>
  );
};
