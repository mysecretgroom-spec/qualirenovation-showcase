import React from 'react';
import { useRenovationForm } from '../RenovationFormContext';
import { FormSection } from '../FormSection';
import { FormQuestion } from '../FormQuestion';
import { SelectableCard } from '../SelectableCard';
import { ElectricityData } from '../types';
import { Zap, Plus, RefreshCw, ShieldCheck, HelpCircle, Plug, Usb, Lightbulb } from 'lucide-react';

// Import electricity images
import electriciteInstallation from '@/assets/electricite/electricite-installation.jpg';
import spotsEncastres from '@/assets/electricite/spots-encastres.jpg';
import suspensions from '@/assets/electricite/suspensions.jpg';
import bandeauLed from '@/assets/electricite/bandeau-led.jpg';
import variateur from '@/assets/electricite/variateur.jpg';
import appareillageBlanc from '@/assets/electricite/appareillage-blanc.jpg';
import appareillageNoir from '@/assets/electricite/appareillage-noir.jpg';
import appareillageLaiton from '@/assets/electricite/appareillage-laiton.jpg';
import appareillageChrome from '@/assets/electricite/appareillage-chrome.jpg';

interface ElectricityModuleProps {
  roomId: string;
  roomName: string;
  data: ElectricityData;
  onSkip?: () => void;
}

export const ElectricityModule: React.FC<ElectricityModuleProps> = ({ roomId, roomName, data, onSkip }) => {
  const { updateRoomData } = useRenovationForm();

  const updateData = (updates: Partial<ElectricityData>) => {
    updateRoomData(roomId, { electricityData: { ...data, ...updates } });
  };

  const toggleArrayValue = (key: 'workType' | 'additionalNeeds' | 'lightingTypes', value: string) => {
    const current = data[key] || [];
    if (current.includes(value)) {
      updateData({ [key]: current.filter(v => v !== value) });
    } else {
      updateData({ [key]: [...current, value] });
    }
  };

  const workTypes = [
    { value: 'general', label: 'Révision générale', icon: <ShieldCheck className="w-5 h-5" /> },
    { value: 'creation', label: 'Création de points', icon: <Plus className="w-5 h-5" /> },
    { value: 'modification', label: 'Modifications', icon: <RefreshCw className="w-5 h-5" /> },
    { value: 'remplacement', label: 'Remplacement appareillages', icon: <Zap className="w-5 h-5" /> },
    { value: 'mise-aux-normes', label: 'Mise aux normes', icon: <ShieldCheck className="w-5 h-5" /> },
    { value: 'ne-sais-pas', label: 'Je ne sais pas', icon: <HelpCircle className="w-5 h-5" /> },
  ];

  const switchStyles = [
    { value: 'blanc', label: 'Blanc classique', image: appareillageBlanc },
    { value: 'noir', label: 'Noir', image: appareillageNoir },
    { value: 'laiton', label: 'Laiton', image: appareillageLaiton },
    { value: 'chrome', label: 'Chrome', image: appareillageChrome },
    { value: 'autre', label: 'Autre', emoji: '✨' },
    { value: 'indifferent', label: 'Indifférent', emoji: '❓' },
  ];

  const lightingOptions = [
    { value: 'spots-encastres', label: 'Spots encastrés', image: spotsEncastres },
    { value: 'suspensions', label: 'Suspensions', image: suspensions },
    { value: 'bandeau-led', label: 'Bandeaux LED', image: bandeauLed },
    { value: 'variateurs', label: 'Variateurs', image: variateur },
    { value: 'a-definir', label: 'À définir', emoji: '❓' },
  ];

  const additionalNeeds = [
    { value: 'plus-prises', label: 'Plus de prises', icon: <Plug className="w-5 h-5" /> },
    { value: 'prises-usb', label: 'Prises USB intégrées', icon: <Usb className="w-5 h-5" /> },
    { value: 'prises-rj45', label: 'Prises réseau (RJ45)', icon: <Plug className="w-5 h-5" /> },
    { value: 'eclairage-repense', label: 'Éclairage repensé', icon: <Lightbulb className="w-5 h-5" /> },
    { value: 'domotique', label: 'Préparation domotique' },
    { value: 'ne-sais-pas', label: 'Je ne sais pas encore' },
  ];

  return (
    <FormSection
      title={`Électricité - ${roomName}`}
      subtitle="Définissez vos besoins électriques pour cette pièce"
      showSkip={!!onSkip}
      onSkip={onSkip}
    >
      {/* Header image */}
      <div className="mb-6 rounded-lg overflow-hidden">
        <img 
          src={electriciteInstallation} 
          alt="Travaux électriques" 
          className="w-full h-48 object-cover"
        />
      </div>

      <FormQuestion label="Nature des travaux électriques :">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {workTypes.map((type) => (
            <SelectableCard
              key={type.value}
              selected={data.workType.includes(type.value)}
              onClick={() => toggleArrayValue('workType', type.value)}
              icon={type.icon}
              title={type.label}
              size="sm"
            />
          ))}
        </div>
      </FormQuestion>

      <FormQuestion label="Types d'éclairage souhaités :">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {lightingOptions.map((option) => (
            <SelectableCard
              key={option.value}
              selected={(data.lightingTypes || []).includes(option.value)}
              onClick={() => toggleArrayValue('lightingTypes', option.value)}
              image={option.image}
              emoji={option.emoji}
              title={option.label}
              size="md"
            />
          ))}
        </div>
      </FormQuestion>

      <FormQuestion label="Style d'appareillage souhaité (prises, interrupteurs) :">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {switchStyles.map((style) => (
            <SelectableCard
              key={style.value}
              selected={data.switchStyle === style.value}
              onClick={() => updateData({ switchStyle: style.value })}
              image={style.image}
              emoji={style.emoji}
              title={style.label}
              size="md"
            />
          ))}
        </div>
      </FormQuestion>

      <FormQuestion label="Besoins spécifiques :">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {additionalNeeds.map((need) => (
            <SelectableCard
              key={need.value}
              selected={data.additionalNeeds.includes(need.value)}
              onClick={() => toggleArrayValue('additionalNeeds', need.value)}
              icon={need.icon}
              title={need.label}
              size="sm"
            />
          ))}
        </div>
      </FormQuestion>
    </FormSection>
  );
};
