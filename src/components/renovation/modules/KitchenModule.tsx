import React from 'react';
import { useRenovationForm } from '../RenovationFormContext';
import { FormSection } from '../FormSection';
import { FormQuestion } from '../FormQuestion';
import { SelectableCard } from '../SelectableCard';
import { KitchenData } from '../types';
import { 
  ChefHat, Clock, Users, DoorOpen, DoorClosed,
  HelpCircle, CheckCircle
} from 'lucide-react';

// Import kitchen images
import implantationLineaire from '@/assets/kitchen/implantation-lineaire.jpg';
import implantationL from '@/assets/kitchen/implantation-l.jpg';
import implantationU from '@/assets/kitchen/implantation-u.jpg';
import implantationIlot from '@/assets/kitchen/implantation-ilot.jpg';
import planStratifie from '@/assets/kitchen/plan-stratifie.jpg';
import planQuartz from '@/assets/kitchen/plan-quartz.jpg';
import planCeramique from '@/assets/kitchen/plan-ceramique.jpg';
import planBois from '@/assets/kitchen/plan-bois.jpg';
import facadeBois from '@/assets/kitchen/facade-bois.jpg';
import facadeLaque from '@/assets/kitchen/facade-laque.jpg';
import facadeMat from '@/assets/kitchen/facade-mat.jpg';
import facadeEffetMatiere from '@/assets/kitchen/facade-effet-matiere.jpg';

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
    { value: 'lineaire', label: 'Linéaire', image: implantationLineaire },
    { value: 'en-l', label: 'En L', image: implantationL },
    { value: 'en-u', label: 'En U', image: implantationU },
    { value: 'avec-ilot', label: 'Avec îlot', image: implantationIlot },
  ];

  const cabinetTypes = [
    { value: 'standard', label: 'Standard' },
    { value: 'sur-mesure', label: 'Sur mesure' },
    { value: 'optimisation', label: "Optimisation de l'existant" },
    { value: 'ne-sais-pas', label: 'Je ne sais pas encore' },
  ];

  const facadeFinishes = [
    { value: 'bois', label: 'Bois', image: facadeBois },
    { value: 'laque', label: 'Laqué', image: facadeLaque },
    { value: 'mat', label: 'Mat', image: facadeMat },
    { value: 'effet-matiere', label: 'Effet matière', image: facadeEffetMatiere },
  ];

  const countertopMaterials = [
    { value: 'stratifie', label: 'Stratifié', image: planStratifie },
    { value: 'quartz', label: 'Quartz', image: planQuartz },
    { value: 'ceramique', label: 'Céramique', image: planCeramique },
    { value: 'bois', label: 'Bois', image: planBois },
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {layoutTypes.map((type) => (
            <SelectableCard
              key={type.value}
              selected={data.layoutType === type.value}
              onClick={() => updateData({ layoutType: type.value })}
              image={type.image}
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {facadeFinishes.map((finish) => (
            <SelectableCard
              key={finish.value}
              selected={data.facadeFinish === finish.value}
              onClick={() => updateData({ facadeFinish: finish.value })}
              image={finish.image}
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {countertopMaterials.map((material) => (
            <SelectableCard
              key={material.value}
              selected={data.countertopMaterial === material.value}
              onClick={() => updateData({ countertopMaterial: material.value })}
              image={material.image}
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
