import React from 'react';
import { useRenovationForm } from '../RenovationFormContext';
import { FormSection } from '../FormSection';
import { FormQuestion } from '../FormQuestion';
import { SelectableCard } from '../SelectableCard';
import { BathroomData } from '../types';
import { 
  User, Users, Users2, Baby, UserCheck,
  Home, Building2, Bed, Bath,
  Droplets, Square, HelpCircle, CheckCircle
} from 'lucide-react';

interface BathroomModuleProps {
  roomId: string;
  instanceNumber: number;
  data: BathroomData;
}

export const BathroomModule: React.FC<BathroomModuleProps> = ({ roomId, instanceNumber, data }) => {
  const { updateRoomData } = useRenovationForm();

  const updateData = (updates: Partial<BathroomData>) => {
    updateRoomData(roomId, { bathroomData: { ...data, ...updates } });
  };

  const toggleArrayValue = (key: keyof BathroomData, value: string) => {
    const current = data[key] as string[];
    if (current.includes(value)) {
      updateData({ [key]: current.filter(v => v !== value) });
    } else {
      updateData({ [key]: [...current, value] });
    }
  };

  const usageOptions = [
    { value: 'une-personne', label: 'Une personne', icon: <User className="w-5 h-5" /> },
    { value: 'couple', label: 'Un couple', icon: <Users className="w-5 h-5" /> },
    { value: 'famille', label: 'Une famille', icon: <Users2 className="w-5 h-5" /> },
    { value: 'enfants', label: 'Des enfants', icon: <Baby className="w-5 h-5" /> },
    { value: 'invites', label: 'Usage ponctuel / invités', icon: <UserCheck className="w-5 h-5" /> },
  ];

  const bathroomTypes = [
    { value: 'principale', label: 'Principale', icon: <Home className="w-5 h-5" /> },
    { value: 'secondaire', label: 'Secondaire', icon: <Building2 className="w-5 h-5" /> },
    { value: 'parentale', label: 'Parentale', icon: <Bed className="w-5 h-5" /> },
    { value: 'attenante', label: "Salle d'eau attenante", icon: <Bath className="w-5 h-5" /> },
  ];

  const installationTypes = [
    { value: 'douche', label: 'Une douche', emoji: '🚿' },
    { value: 'baignoire', label: 'Une baignoire', emoji: '🛁' },
    { value: 'douche-baignoire', label: 'Douche + baignoire', emoji: '🚿🛁' },
    { value: 'ne-sais-pas', label: 'Je ne sais pas encore', emoji: '❓' },
  ];

  const storageTypes = [
    { value: 'colonne', label: 'Colonne' },
    { value: 'meuble-hauteur', label: 'Meuble toute hauteur' },
    { value: 'niches', label: 'Niche(s)' },
    { value: 'ne-sais-pas', label: 'Je ne sais pas encore' },
  ];

  // Shower options
  const showerTrayTypes = [
    { value: 'a-poser', label: 'À poser' },
    { value: 'a-encastrer', label: 'À encastrer' },
    { value: 'a-carreler', label: 'À carreler' },
    { value: 'resine', label: 'Résine' },
    { value: 'acrylique', label: 'Acrylique' },
    { value: 'ne-sais-pas', label: 'Je ne sais pas encore' },
  ];

  const showerDoorTypes = [
    { value: 'paroi-fixe', label: 'Paroi fixe' },
    { value: 'porte-battante', label: 'Porte battante' },
    { value: 'porte-coulissante', label: 'Porte coulissante' },
    { value: 'porte-pliante', label: 'Porte pliante' },
    { value: 'ne-sais-pas', label: 'Je ne sais pas encore' },
  ];

  // Bathtub options
  const bathtubTypes = [
    { value: 'encastree', label: 'Encastrée' },
    { value: 'ilot', label: 'Îlot' },
    { value: 'angle', label: 'Angle' },
    { value: 'droite', label: 'Droite classique' },
    { value: 'balneo', label: 'Balnéo' },
    { value: 'ne-sais-pas', label: 'Je ne sais pas encore' },
  ];

  const bathtubScreenTypes = [
    { value: 'pare-bain-fixe', label: 'Pare-bain fixe' },
    { value: 'pare-bain-pivotant', label: 'Pare-bain pivotant' },
    { value: 'pare-bain-coulissant', label: 'Pare-bain coulissant' },
    { value: 'rideau', label: 'Rideau de douche' },
    { value: 'aucun', label: 'Aucun' },
    { value: 'ne-sais-pas', label: 'Je ne sais pas encore' },
  ];

  const vanityTypes = [
    { value: 'vasque-seule', label: 'Vasque seule (sans meuble)' },
    { value: 'meuble-suspendu', label: 'Meuble suspendu' },
    { value: 'meuble-pieds', label: 'Meuble sur pieds' },
    { value: 'ne-sais-pas', label: 'Je ne sais pas encore' },
  ];

  const vanityCountOptions = [
    { value: 'simple', label: 'Simple' },
    { value: 'double', label: 'Double' },
    { value: 'a-definir', label: 'À définir ensemble' },
  ];

  const faucetTypes = [
    { value: 'apparente', label: 'Apparente' },
    { value: 'encastree', label: 'Encastrée' },
    { value: 'ne-sais-pas', label: 'Je ne sais pas encore' },
  ];

  const showerHeadStyles = [
    { value: 'fixe', label: 'Fixe (plafond ou mural)' },
    { value: 'douchette', label: 'Douchette' },
    { value: 'les-deux', label: 'Les deux' },
  ];

  const finishOptions = [
    { value: 'chrome', label: 'Chrome' },
    { value: 'noir', label: 'Noir' },
    { value: 'laiton', label: 'Laiton' },
    { value: 'autre', label: 'Autre' },
    { value: 'peu-importe', label: 'Peu importe' },
  ];

  const toiletTypes = [
    { value: 'suspendu', label: 'WC suspendu' },
    { value: 'au-sol', label: 'WC au sol' },
    { value: 'conserver', label: "Conserver l'existant" },
    { value: 'pas-de-wc', label: 'Ne pas intégrer de WC' },
  ];

  const ambianceOptions = [
    { value: 'zellige', label: 'Zellige', emoji: '🔷' },
    { value: 'marbre', label: 'Effet marbre', emoji: '🪨' },
    { value: 'beton-cire', label: 'Béton ciré', emoji: '🏗️' },
    { value: 'terrazzo', label: 'Terrazzo', emoji: '🎨' },
    { value: 'graphique', label: 'Graphique / géométrique', emoji: '📐' },
    { value: 'naturel', label: 'Naturel (pierre, sable, bois)', emoji: '🌿' },
    { value: 'autre', label: 'Autre', emoji: '✨' },
  ];

  const certaintyLevels = [
    { value: 'tout-clair', label: 'Tout est clair', icon: <CheckCircle className="w-5 h-5" /> },
    { value: 'idee-generale', label: "J'ai une idée générale", icon: <HelpCircle className="w-5 h-5" /> },
    { value: 'besoin-aide', label: "J'ai besoin d'aide pour la concevoir", icon: <Users className="w-5 h-5" /> },
  ];

  return (
    <FormSection
      title={`Salle de bain${instanceNumber > 1 ? ` #${instanceNumber}` : ''}`}
      subtitle="Configurez cette salle de bain selon vos besoins"
    >
      {/* Usage */}
      <FormQuestion label="Cette salle de bain sera utilisée par :">
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

      {/* Bathroom type */}
      <FormQuestion label="Cette salle de bain est :">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {bathroomTypes.map((type) => (
            <SelectableCard
              key={type.value}
              selected={data.bathroomType === type.value}
              onClick={() => updateData({ bathroomType: type.value })}
              icon={type.icon}
              title={type.label}
              size="sm"
            />
          ))}
        </div>
      </FormQuestion>

      {/* Installation type */}
      <FormQuestion label="Quel type d'installation souhaitez-vous privilégier ?">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {installationTypes.map((type) => (
            <SelectableCard
              key={type.value}
              selected={data.installationType === type.value}
              onClick={() => updateData({ installationType: type.value })}
              emoji={type.emoji}
              title={type.label}
              size="sm"
            />
          ))}
        </div>
      </FormQuestion>

      {/* Washing machine */}
      <FormQuestion label="Souhaitez-vous intégrer une machine à laver ?">
        <div className="grid grid-cols-3 gap-3 max-w-md">
          {['oui', 'non', 'ne-sais-pas'].map((value) => (
            <SelectableCard
              key={value}
              selected={data.hasWashingMachine === value}
              onClick={() => updateData({ hasWashingMachine: value })}
              title={value === 'oui' ? 'Oui' : value === 'non' ? 'Non' : 'Je ne sais pas'}
              size="sm"
            />
          ))}
        </div>
      </FormQuestion>

      {/* Storage type */}
      <FormQuestion label="Souhaitez-vous intégrer des rangements spécifiques ?">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {storageTypes.map((type) => (
            <SelectableCard
              key={type.value}
              selected={data.storageType.includes(type.value)}
              onClick={() => toggleArrayValue('storageType', type.value)}
              title={type.label}
              size="sm"
            />
          ))}
        </div>
      </FormQuestion>

      {/* Show shower options if shower selected */}
      {(data.installationType === 'douche' || data.installationType === 'douche-baignoire') && (
        <>
          <FormQuestion label="Type de receveur souhaité :">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {showerTrayTypes.map((type) => (
                <SelectableCard
                  key={type.value}
                  selected={data.showerTrayType === type.value}
                  onClick={() => updateData({ showerTrayType: type.value })}
                  title={type.label}
                  size="sm"
                />
              ))}
            </div>
          </FormQuestion>

          <FormQuestion label="Type de paroi de douche :">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {showerDoorTypes.map((type) => (
                <SelectableCard
                  key={type.value}
                  selected={data.showerDoorType === type.value}
                  onClick={() => updateData({ showerDoorType: type.value })}
                  title={type.label}
                  size="sm"
                />
              ))}
            </div>
          </FormQuestion>
        </>
      )}

      {/* Show bathtub options if bathtub selected */}
      {(data.installationType === 'baignoire' || data.installationType === 'douche-baignoire') && (
        <>
          <FormQuestion label="Type de baignoire souhaité :">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {bathtubTypes.map((type) => (
                <SelectableCard
                  key={type.value}
                  selected={data.bathtubType === type.value}
                  onClick={() => updateData({ bathtubType: type.value })}
                  title={type.label}
                  size="sm"
                />
              ))}
            </div>
          </FormQuestion>

          <FormQuestion label="Type de pare-bain :">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {bathtubScreenTypes.map((type) => (
                <SelectableCard
                  key={type.value}
                  selected={data.bathtubScreenType === type.value}
                  onClick={() => updateData({ bathtubScreenType: type.value })}
                  title={type.label}
                  size="sm"
                />
              ))}
            </div>
          </FormQuestion>
        </>
      )}

      {/* Vanity */}
      <FormQuestion label="Type de meuble vasque :">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {vanityTypes.map((type) => (
            <SelectableCard
              key={type.value}
              selected={data.vanityType === type.value}
              onClick={() => updateData({ vanityType: type.value })}
              title={type.label}
              size="sm"
            />
          ))}
        </div>
      </FormQuestion>

      <FormQuestion label="Nombre de vasques :">
        <div className="grid grid-cols-3 gap-3 max-w-md">
          {vanityCountOptions.map((option) => (
            <SelectableCard
              key={option.value}
              selected={data.vanityCount === option.value}
              onClick={() => updateData({ vanityCount: option.value })}
              title={option.label}
              size="sm"
            />
          ))}
        </div>
      </FormQuestion>

      {/* Faucet */}
      <FormQuestion label="Type de robinetterie douche :">
        <div className="grid grid-cols-3 gap-3 max-w-md">
          {faucetTypes.map((type) => (
            <SelectableCard
              key={type.value}
              selected={data.showerFaucetType === type.value}
              onClick={() => updateData({ showerFaucetType: type.value })}
              title={type.label}
              size="sm"
            />
          ))}
        </div>
      </FormQuestion>

      <FormQuestion label="Style de pommeau :">
        <div className="grid grid-cols-3 gap-3 max-w-md">
          {showerHeadStyles.map((style) => (
            <SelectableCard
              key={style.value}
              selected={data.showerHeadStyle.includes(style.value)}
              onClick={() => toggleArrayValue('showerHeadStyle', style.value)}
              title={style.label}
              size="sm"
            />
          ))}
        </div>
      </FormQuestion>

      <FormQuestion label="Finition souhaitée :">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {finishOptions.map((option) => (
            <SelectableCard
              key={option.value}
              selected={data.faucetFinish === option.value}
              onClick={() => updateData({ faucetFinish: option.value })}
              title={option.label}
              size="sm"
            />
          ))}
        </div>
      </FormQuestion>

      {/* Toilet */}
      <FormQuestion label="WC (si présents dans la pièce) :">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {toiletTypes.map((type) => (
            <SelectableCard
              key={type.value}
              selected={data.toiletType === type.value}
              onClick={() => updateData({ toiletType: type.value })}
              title={type.label}
              size="sm"
            />
          ))}
        </div>
      </FormQuestion>

      {/* Ambiance */}
      <FormQuestion label="Quelles ambiances vous inspirent ?">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {ambianceOptions.map((option) => (
            <SelectableCard
              key={option.value}
              selected={data.ambiance.includes(option.value)}
              onClick={() => toggleArrayValue('ambiance', option.value)}
              emoji={option.emoji}
              title={option.label}
              size="sm"
            />
          ))}
        </div>
      </FormQuestion>

      {/* Certainty level */}
      <FormQuestion label="Où en êtes-vous pour cette salle de bain ?">
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
