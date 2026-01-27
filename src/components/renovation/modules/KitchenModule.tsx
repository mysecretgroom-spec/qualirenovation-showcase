import React from 'react';
import { useRenovationForm } from '../RenovationFormContext';
import { FormSection } from '../FormSection';
import { FormQuestion } from '../FormQuestion';
import { SelectableCard } from '../SelectableCard';
import { KitchenData } from '../types';
import { 
  ChefHat, Clock, Users, DoorOpen, DoorClosed,
  Square, LayoutGrid, Boxes, HelpCircle, CheckCircle
} from 'lucide-react';

interface KitchenModuleProps {
  roomId: string;
  instanceNumber: number;
  data: KitchenData;
}

export const KitchenModule: React.FC<KitchenModuleProps> = ({ roomId, instanceNumber, data }) => {
  const { updateRoomData } = useRenovationForm();

  const updateData = (updates: Partial<KitchenData>) => {
    updateRoomData(roomId, { kitchenData: { ...data, ...updates } });
  };

  const toggleArrayValue = (key: keyof KitchenData, value: string) => {
    const current = data[key] as string[];
    if (current.includes(value)) {
      updateData({ [key]: current.filter(v => v !== value) });
    } else {
      updateData({ [key]: [...current, value] });
    }
  };

  const usageOptions = [
    { value: 'tres-utilisee', label: 'Très utilisée (quotidienne)', icon: <ChefHat className="w-5 h-5" /> },
    { value: 'occasionnelle', label: 'Occasionnelle', icon: <Clock className="w-5 h-5" /> },
    { value: 'familiale', label: 'Familiale', icon: <Users className="w-5 h-5" /> },
    { value: 'ouverte', label: 'Cuisine ouverte', icon: <DoorOpen className="w-5 h-5" /> },
    { value: 'fermee', label: 'Cuisine fermée', icon: <DoorClosed className="w-5 h-5" /> },
  ];

  const layoutTypes = [
    { value: 'lineaire', label: 'Linéaire', emoji: '▬' },
    { value: 'en-l', label: 'En L', emoji: '⌐' },
    { value: 'en-u', label: 'En U', emoji: '⊔' },
    { value: 'avec-ilot', label: 'Avec îlot', emoji: '▣' },
    { value: 'ne-sais-pas', label: 'Je ne sais pas encore', emoji: '❓' },
  ];

  const cabinetTypes = [
    { value: 'standard', label: 'Standard' },
    { value: 'sur-mesure', label: 'Sur mesure' },
    { value: 'optimisation', label: "Optimisation de l'existant" },
    { value: 'ne-sais-pas', label: 'Je ne sais pas encore' },
  ];

  const facadeFinishes = [
    { value: 'bois', label: 'Bois' },
    { value: 'laque', label: 'Laqué' },
    { value: 'mat', label: 'Mat' },
    { value: 'effet-matiere', label: 'Effet matière' },
    { value: 'a-definir', label: 'À définir' },
  ];

  const countertopMaterials = [
    { value: 'stratifie', label: 'Stratifié' },
    { value: 'quartz', label: 'Quartz' },
    { value: 'ceramique', label: 'Céramique' },
    { value: 'bois', label: 'Bois' },
    { value: 'autre', label: 'Autre' },
    { value: 'ne-sais-pas', label: 'Je ne sais pas encore' },
  ];

  const backsplashTypes = [
    { value: 'carrelage', label: 'Carrelage' },
    { value: 'pleine-hauteur', label: 'Pleine hauteur' },
    { value: 'verre', label: 'Verre' },
    { value: 'autre', label: 'Autre' },
    { value: 'a-definir', label: 'À définir' },
  ];

  const certaintyLevels = [
    { value: 'tout-defini', label: 'Tout est défini', icon: <CheckCircle className="w-5 h-5" /> },
    { value: 'besoin-conseils', label: "J'ai besoin de conseils", icon: <HelpCircle className="w-5 h-5" /> },
    { value: 'accompagnement-complet', label: "J'ai besoin d'un accompagnement complet", icon: <Users className="w-5 h-5" /> },
  ];

  return (
    <FormSection
      title={`Cuisine${instanceNumber > 1 ? ` #${instanceNumber}` : ''}`}
      subtitle="Configurez votre cuisine selon vos besoins"
    >
      {/* Usage */}
      <FormQuestion label="Cette cuisine sera :">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {usageOptions.map((option) => (
            <SelectableCard
              key={option.value}
              selected={data.usage.includes(option.value)}
              onClick={() => toggleArrayValue('usage', option.value)}
              icon={option.icon}
              title={option.label}
              size="sm"
            />
          ))}
        </div>
      </FormQuestion>

      {/* Layout type */}
      <FormQuestion label="Type d'implantation envisagée :">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {layoutTypes.map((type) => (
            <SelectableCard
              key={type.value}
              selected={data.layoutType === type.value}
              onClick={() => updateData({ layoutType: type.value })}
              emoji={type.emoji}
              title={type.label}
              size="sm"
            />
          ))}
        </div>
      </FormQuestion>

      {/* Modify layout */}
      <FormQuestion label="Souhaitez-vous modifier l'implantation actuelle ?">
        <div className="grid grid-cols-3 gap-3 max-w-md">
          {[
            { value: 'oui', label: 'Oui' },
            { value: 'non', label: 'Non' },
            { value: 'a-etudier', label: 'À étudier' },
          ].map((option) => (
            <SelectableCard
              key={option.value}
              selected={data.modifyLayout === option.value}
              onClick={() => updateData({ modifyLayout: option.value })}
              title={option.label}
              size="sm"
            />
          ))}
        </div>
      </FormQuestion>

      {/* Cabinet type */}
      <FormQuestion label="Type de meubles :">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {cabinetTypes.map((type) => (
            <SelectableCard
              key={type.value}
              selected={data.cabinetType === type.value}
              onClick={() => updateData({ cabinetType: type.value })}
              title={type.label}
              size="sm"
            />
          ))}
        </div>
      </FormQuestion>

      {/* Facade finish */}
      <FormQuestion label="Finition des façades :">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {facadeFinishes.map((finish) => (
            <SelectableCard
              key={finish.value}
              selected={data.facadeFinish === finish.value}
              onClick={() => updateData({ facadeFinish: finish.value })}
              title={finish.label}
              size="sm"
            />
          ))}
        </div>
      </FormQuestion>

      {/* Handles */}
      <FormQuestion label="Avec poignées ?">
        <div className="grid grid-cols-3 gap-3 max-w-md">
          {[
            { value: 'oui', label: 'Oui' },
            { value: 'non', label: 'Non' },
            { value: 'indifferent', label: 'Indifférent' },
          ].map((option) => (
            <SelectableCard
              key={option.value}
              selected={data.hasHandles === option.value}
              onClick={() => updateData({ hasHandles: option.value })}
              title={option.label}
              size="sm"
            />
          ))}
        </div>
      </FormQuestion>

      {/* Countertop material */}
      <FormQuestion label="Matériau du plan de travail souhaité :">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {countertopMaterials.map((material) => (
            <SelectableCard
              key={material.value}
              selected={data.countertopMaterial === material.value}
              onClick={() => updateData({ countertopMaterial: material.value })}
              title={material.label}
              size="sm"
            />
          ))}
        </div>
      </FormQuestion>

      {/* 3D visualization */}
      <FormQuestion label="Souhaitez-vous visualiser les finitions ?">
        <div className="grid grid-cols-2 gap-3 max-w-xs">
          {[
            { value: 'oui', label: 'Oui (outil 3D)' },
            { value: 'non', label: 'Non' },
          ].map((option) => (
            <SelectableCard
              key={option.value}
              selected={data.wantVisualization === option.value}
              onClick={() => updateData({ wantVisualization: option.value })}
              title={option.label}
              size="sm"
            />
          ))}
        </div>
      </FormQuestion>

      {/* Backsplash type */}
      <FormQuestion label="Type de crédence :">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {backsplashTypes.map((type) => (
            <SelectableCard
              key={type.value}
              selected={data.backsplashType === type.value}
              onClick={() => updateData({ backsplashType: type.value })}
              title={type.label}
              size="sm"
            />
          ))}
        </div>
      </FormQuestion>

      {/* Certainty level */}
      <FormQuestion label="Pour cette cuisine :">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {certaintyLevels.map((level) => (
            <SelectableCard
              key={level.value}
              selected={data.certaintyLevel === level.value}
              onClick={() => updateData({ certaintyLevel: level.value })}
              icon={level.icon}
              title={level.label}
            />
          ))}
        </div>
      </FormQuestion>
    </FormSection>
  );
};
