import React from 'react';
import { FormSection } from '../FormSection';
import { FormQuestion } from '../FormQuestion';
import { SelectableCard } from '../SelectableCard';
import { useRenovationForm } from '../RenovationFormContext';
import { WCData } from '../types';

// Import images
import laveMainAngle from '@/assets/wc/lave-main-angle.jpg';
import laveMainSuspendu from '@/assets/wc/lave-main-suspendu.jpg';
import laveMainTotem from '@/assets/wc/lave-main-totem.jpg';
import planVasque from '@/assets/wc/plan-vasque.jpg';
import siphonDesign from '@/assets/wc/siphon-design.jpg';
import siphonGainPlace from '@/assets/wc/siphon-gain-place.jpg';
import siphonClassique from '@/assets/wc/siphon-classique.jpg';
import wcSol from '@/assets/bathroom/wc-sol.jpg';
import wcSuspendu from '@/assets/bathroom/wc-suspendu.jpg';

// Import faucet finishes from bathroom module
import finitionChrome from '@/assets/bathroom/finition-chrome-chatelet.jpg';
import finitionNoir from '@/assets/bathroom/finition-noir-mat.jpg';
import finitionLaiton from '@/assets/bathroom/finition-laiton-brosse.jpg';
import finitionOr from '@/assets/bathroom/finition-or-brosse.jpg';
import finitionNickel from '@/assets/bathroom/finition-nickel-brosse.jpg';
import finitionCuivre from '@/assets/bathroom/finition-cuivre.jpg';

const handWashTypes = [
  { value: 'angle', label: "Lave-main d'angle", image: laveMainAngle },
  { value: 'suspendu', label: 'Lave-main suspendu', image: laveMainSuspendu },
  { value: 'totem', label: 'Lave-main totem', image: laveMainTotem },
  { value: 'plan-vasque', label: 'Plan vasque', image: planVasque },
];

const toiletTypes = [
  { value: 'suspendu', label: 'WC suspendu', image: wcSuspendu },
  { value: 'sol', label: 'WC au sol', image: wcSol },
];

const siphonTypes = [
  { value: 'design', label: 'Design', image: siphonDesign, description: 'Siphon visible élégant' },
  { value: 'gain-place', label: 'Gain de place', image: siphonGainPlace, description: 'Compact et discret' },
  { value: 'classique', label: 'Classique', image: siphonClassique, description: 'Standard économique' },
];

const faucetFinishes = [
  { value: 'chrome', label: 'Chrome', image: finitionChrome },
  { value: 'noir-mat', label: 'Noir mat', image: finitionNoir },
  { value: 'laiton-brosse', label: 'Laiton brossé', image: finitionLaiton },
  { value: 'or-brosse', label: 'Or brossé', image: finitionOr },
  { value: 'nickel-brosse', label: 'Nickel brossé', image: finitionNickel },
  { value: 'cuivre', label: 'Cuivre', image: finitionCuivre },
];

interface WCModuleProps {
  roomId: string;
  roomName: string;
  data: WCData;
  onSkip?: () => void;
}

export const WCModule: React.FC<WCModuleProps> = ({
  roomId,
  roomName,
  data,
  onSkip,
}) => {
  const { updateRoomData } = useRenovationForm();

  const updateData = (updates: Partial<WCData>) => {
    updateRoomData(roomId, { wcData: { ...data, ...updates } });
  };

  return (
    <FormSection 
      title={roomName} 
      subtitle="Configurez les équipements de votre WC"
      onSkip={onSkip}
    >
      {/* Toilet type */}
      <FormQuestion label="Type de WC souhaité :">
        <div className="grid grid-cols-2 gap-4">
          {toiletTypes.map((type) => (
            <SelectableCard
              key={type.value}
              selected={data.toiletType === type.value}
              onClick={() => updateData({ toiletType: type.value })}
              image={type.image}
              title={type.label}
              size="xl"
            />
          ))}
        </div>
      </FormQuestion>

      {/* Existing sanibroyeur question */}
      <FormQuestion label="Y a-t-il actuellement un sanibroyeur installé ?">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: 'oui', label: 'Avec sanibroyeur', emoji: '⚡' },
            { value: 'non', label: 'Sans sanibroyeur', emoji: '🚽' },
            { value: 'ne-sais-pas', label: 'Je ne sais pas', emoji: '❓' },
          ].map((option) => (
            <SelectableCard
              key={option.value}
              selected={data.existingSanibroyeur === option.value}
              onClick={() => updateData({ existingSanibroyeur: option.value })}
              emoji={option.emoji}
              title={option.label}
            />
          ))}
        </div>
      </FormQuestion>

      {/* Want hand wash basin */}
      <FormQuestion label="Souhaitez-vous un lave-main ?">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { value: 'oui', label: 'Oui', emoji: '✓' },
            { value: 'non', label: 'Non', emoji: '✗' },
            { value: 'ne-sais-pas', label: 'Je ne sais pas', emoji: '❓' },
          ].map((option) => (
            <SelectableCard
              key={option.value}
              selected={data.wantHandWash === option.value}
              onClick={() => updateData({ wantHandWash: option.value })}
              emoji={option.emoji}
              title={option.label}
            />
          ))}
        </div>
      </FormQuestion>

      {/* Hand wash basin type - only show if wanted */}
      {data.wantHandWash === 'oui' && (
        <>
          <FormQuestion label="Type de lave-main / vasque :">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {handWashTypes.map((type) => (
                <SelectableCard
                  key={type.value}
                  selected={data.handWashType === type.value}
                  onClick={() => updateData({ handWashType: type.value })}
                  image={type.image}
                  title={type.label}
                  size="xl"
                />
              ))}
            </div>
          </FormQuestion>

          {/* Faucet finish */}
          <FormQuestion label="Finition du mitigeur :">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {faucetFinishes.map((finish) => (
                <SelectableCard
                  key={finish.value}
                  selected={data.faucetFinish === finish.value}
                  onClick={() => updateData({ faucetFinish: finish.value })}
                  image={finish.image}
                  title={finish.label}
                  size="lg"
                />
              ))}
            </div>
          </FormQuestion>

          {/* Siphon type - only for visible siphons (suspendu, angle, totem) */}
          {['suspendu', 'angle', 'totem'].includes(data.handWashType) && (
            <FormQuestion label="Type de siphon :">
              <div className="grid grid-cols-3 gap-4">
                {siphonTypes.map((type) => (
                  <SelectableCard
                    key={type.value}
                    selected={data.siphonType === type.value}
                    onClick={() => updateData({ siphonType: type.value })}
                    image={type.image}
                    title={type.label}
                    description={type.description}
                    size="xl"
                  />
                ))}
              </div>
            </FormQuestion>
          )}
        </>
      )}

      {/* Certainty level */}
      <FormQuestion label="Niveau de certitude sur vos choix :">
        <div className="grid grid-cols-3 gap-4">
          {[
            { value: 'certain', label: 'Certain', emoji: '✓' },
            { value: 'a-affiner', label: 'À affiner', emoji: '🔄' },
            { value: 'a-definir', label: 'À définir', emoji: '❓' },
          ].map((option) => (
            <SelectableCard
              key={option.value}
              selected={data.certaintyLevel === option.value}
              onClick={() => updateData({ certaintyLevel: option.value })}
              emoji={option.emoji}
              title={option.label}
            />
          ))}
        </div>
      </FormQuestion>
    </FormSection>
  );
};
