import React, { useState } from 'react';
import { useRenovationForm } from '../RenovationFormContext';
import { FormSection } from '../FormSection';
import { FormQuestion } from '../FormQuestion';
import { SelectableCard } from '../SelectableCard';
import { BathroomData, EggerReference } from '../types';
import { tileTypes, tileFormats } from '../tileOptions';
import { 
  User, Users, Users2, Baby, UserCheck,
  Home, Building2, Bed, Bath,
  Droplets, Square, HelpCircle, CheckCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ReferenceInput } from '../ReferenceInput';

// Import bathroom images
import ambianceModerne from '@/assets/bathroom/ambiance-moderne.jpg';
import ambianceEpure from '@/assets/bathroom/ambiance-epure.jpg';
import ambianceClassique from '@/assets/bathroom/ambiance-classique.jpg';
import ambianceNature from '@/assets/bathroom/ambiance-nature.jpg';
import ambianceLuxe from '@/assets/bathroom/ambiance-luxe.jpg';
import receveurAPoser from '@/assets/bathroom/receveur-a-poser.jpg';
import receveurEncastre from '@/assets/bathroom/receveur-encastre.jpg';
import receveurCarreler from '@/assets/bathroom/receveur-carreler.jpg';
import receveurResine from '@/assets/bathroom/receveur-resine.jpg';
import baignoireEncastree from '@/assets/bathroom/baignoire-encastree.jpg';
import baignoireIlot from '@/assets/bathroom/baignoire-ilot.jpg';
import baignoireAngle from '@/assets/bathroom/baignoire-angle.jpg';
import baignoireDroite from '@/assets/bathroom/baignoire-droite.jpg';
import baignoireBalneo from '@/assets/bathroom/baignoire-balneo.jpg';
import paroiFixe from '@/assets/bathroom/paroi-fixe.jpg';
import paroiBattante from '@/assets/bathroom/paroi-battante.jpg';
import paroiCoulissante from '@/assets/bathroom/paroi-coulissante.jpg';
import paroiPliante from '@/assets/bathroom/paroi-pliante.jpg';
import pareBainFixe from '@/assets/bathroom/pare-bain-fixe.jpg';
import pareBainPivotant from '@/assets/bathroom/pare-bain-pivotant.jpg';
import pareBainCoulissant from '@/assets/bathroom/pare-bain-coulissant.jpg';
import pareBainRideau from '@/assets/bathroom/pare-bain-rideau.jpg';
import vasqueSeule from '@/assets/bathroom/vasque-seule.jpg';
import meubleSuspendu from '@/assets/bathroom/meuble-suspendu.jpg';
import meublePieds from '@/assets/bathroom/meuble-pieds.jpg';

// Import faucet and fixture images
import robinetterieApparente from '@/assets/bathroom/robinetterie-apparente.jpg';
import robinetterieEncastree from '@/assets/bathroom/robinetterie-encastree.jpg';
import pommeauFixe from '@/assets/bathroom/pommeau-fixe.jpg';
import pommeauDouchette from '@/assets/bathroom/pommeau-douchette.jpg';
import pommeauCombo from '@/assets/bathroom/pommeau-combo.jpg';
import finitionChrome from '@/assets/bathroom/finition-chrome-chatelet.jpg';
import finitionNoir from '@/assets/bathroom/finition-noir-mat.jpg';
import finitionLaiton from '@/assets/bathroom/finition-laiton-brosse.jpg';
import finitionOr from '@/assets/bathroom/finition-or-brosse.jpg';
import finitionNickel from '@/assets/bathroom/finition-nickel-brosse.jpg';
import finitionCuivre from '@/assets/bathroom/finition-cuivre.jpg';
import wcSuspendu from '@/assets/bathroom/wc-suspendu.jpg';
import wcSol from '@/assets/bathroom/wc-sol.jpg';

// Import mirror images
import miroirLed from '@/assets/bathroom/miroir-led.jpg';
import miroirCadre from '@/assets/bathroom/miroir-cadre.jpg';
import miroirRond from '@/assets/bathroom/miroir-rond.jpg';
import miroirArmoire from '@/assets/bathroom/miroir-armoire.jpg';

interface BathroomModuleProps {
  roomId: string;
  roomName: string;
  data: BathroomData;
  onSkip?: () => void;
}

export const BathroomModule: React.FC<BathroomModuleProps> = ({ roomId, roomName, data, onSkip }) => {
  const { updateRoomData } = useRenovationForm();
  const [newReference, setNewReference] = useState('');

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

  const addEggerReference = async () => {
    if (!newReference.trim()) return;
    
    const cleanRef = newReference.trim().toUpperCase();
    
    if (data.eggerReferences?.some(r => r.reference === cleanRef)) {
      toast.error('Cette référence a déjà été ajoutée');
      return;
    }

    const newRef: EggerReference = {
      reference: cleanRef,
      isLoading: true,
    };
    
    updateData({ 
      eggerReferences: [...(data.eggerReferences || []), newRef] 
    });
    setNewReference('');

    try {
      const { data: scrapeData, error } = await supabase.functions.invoke('scrape-egger-ref', {
        body: { reference: cleanRef },
      });

      if (error) throw error;

      const updatedRefs = [...(data.eggerReferences || []), {
        reference: cleanRef,
        imageUrl: scrapeData?.imageUrl || undefined,
        decorName: scrapeData?.decorName || undefined,
        decorUrl: scrapeData?.decorUrl || undefined,
        isLoading: false,
      }].filter((r, i, arr) => 
        !(r.reference === cleanRef && r.isLoading) || i === arr.length - 1
      );

      updateData({ eggerReferences: updatedRefs });
      
      if (scrapeData?.imageUrl) {
        toast.success(`Image trouvée pour ${cleanRef}`);
      } else {
        toast.info(`Référence ${cleanRef} ajoutée (image non trouvée)`);
      }
    } catch (error) {
      console.error('Error scraping EGGER:', error);
      const updatedRefs = (data.eggerReferences || []).map(r => 
        r.reference === cleanRef && r.isLoading
          ? { ...r, isLoading: false, error: 'Erreur lors de la recherche' }
          : r
      );
      updateData({ eggerReferences: updatedRefs });
      toast.error('Erreur lors de la recherche de l\'image');
    }
  };

  const removeEggerReference = (reference: string) => {
    updateData({ 
      eggerReferences: (data.eggerReferences || []).filter(r => r.reference !== reference) 
    });
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

  // Ambiance options - style-based with images
  const ambianceOptions = [
    { value: 'moderne', label: 'Moderne', image: ambianceModerne },
    { value: 'epure', label: 'Épuré / Minimaliste', image: ambianceEpure },
    { value: 'classique', label: 'Classique / Intemporel', image: ambianceClassique },
    { value: 'nature', label: 'Naturel / Organique', image: ambianceNature },
    { value: 'luxe', label: 'Luxe / Hôtelier', image: ambianceLuxe },
    { value: 'autre', label: 'Autre', emoji: '🎨' },
  ];

  // Shower options with images
  const showerTrayTypes = [
    { value: 'a-poser', label: 'À poser', image: receveurAPoser },
    { value: 'a-encastrer', label: 'À encastrer', image: receveurEncastre },
    { value: 'a-carreler', label: 'À carreler', image: receveurCarreler },
    { value: 'resine', label: 'Résine', image: receveurResine },
    { value: 'ne-sais-pas', label: 'Je ne sais pas encore' },
  ];

  const showerDoorTypes = [
    { value: 'paroi-fixe', label: 'Paroi fixe', image: paroiFixe },
    { value: 'porte-battante', label: 'Porte battante', image: paroiBattante },
    { value: 'porte-coulissante', label: 'Porte coulissante', image: paroiCoulissante },
    { value: 'porte-pliante', label: 'Porte pliante', image: paroiPliante },
    { value: 'ne-sais-pas', label: 'Je ne sais pas encore' },
  ];

  // Bathtub options with images
  const bathtubTypes = [
    { value: 'encastree', label: 'Encastrée', image: baignoireEncastree },
    { value: 'ilot', label: 'Îlot', image: baignoireIlot },
    { value: 'angle', label: 'Angle', image: baignoireAngle },
    { value: 'droite', label: 'Droite classique', image: baignoireDroite },
    { value: 'balneo', label: 'Balnéo', image: baignoireBalneo },
    { value: 'ne-sais-pas', label: 'Je ne sais pas encore' },
  ];

  const bathtubScreenTypes = [
    { value: 'pare-bain-fixe', label: 'Fixe', image: pareBainFixe },
    { value: 'pare-bain-pivotant', label: 'Pivotant', image: pareBainPivotant },
    { value: 'pare-bain-coulissant', label: 'Coulissant', image: pareBainCoulissant },
    { value: 'rideau', label: 'Rideau de douche', image: pareBainRideau },
    { value: 'aucun', label: 'Aucun' },
    { value: 'ne-sais-pas', label: 'Je ne sais pas encore' },
  ];

  // Vanity options with images
  const vanityTypes = [
    { value: 'vasque-seule', label: 'Vasque seule', image: vasqueSeule },
    { value: 'meuble-suspendu', label: 'Meuble suspendu', image: meubleSuspendu },
    { value: 'meuble-pieds', label: 'Meuble sur pieds', image: meublePieds },
    { value: 'ne-sais-pas', label: 'Je ne sais pas encore' },
  ];

  // Sink style options with emojis
  const sinkStyleOptions = [
    { value: 'a-poser', label: 'À poser (sur le plan)', emoji: '🥣' },
    { value: 'encastree', label: 'Encastrée (sous le plan)', emoji: '📥' },
    { value: 'ne-sais-pas', label: 'Je ne sais pas encore', emoji: '❓' },
  ];

  const vanityCountOptions = [
    { value: 'simple', label: 'Simple' },
    { value: 'double', label: 'Double' },
    { value: 'a-definir', label: 'À définir ensemble' },
  ];

  // Faucet type options with images
  const faucetTypes = [
    { value: 'apparente', label: 'Apparente', image: robinetterieApparente },
    { value: 'encastree', label: 'Encastrée', image: robinetterieEncastree },
    { value: 'ne-sais-pas', label: 'Je ne sais pas encore', emoji: '❓' },
  ];

  // Showerhead styles with images
  const showerHeadStyles = [
    { value: 'fixe', label: 'Fixe (plafond/mural)', image: pommeauFixe },
    { value: 'douchette', label: 'Douchette', image: pommeauDouchette },
    { value: 'les-deux', label: 'Les deux', image: pommeauCombo },
  ];

  // Faucet finishes with images (inspired by Châtelet collection)
  const finishOptions = [
    { value: 'chrome', label: 'Chrome', image: finitionChrome },
    { value: 'noir', label: 'Noir mat', image: finitionNoir },
    { value: 'laiton-brosse', label: 'Laiton brossé', image: finitionLaiton },
    { value: 'or-brosse', label: 'Or brossé', image: finitionOr },
    { value: 'nickel-brosse', label: 'Nickel brossé', image: finitionNickel },
    { value: 'cuivre', label: 'Cuivre', image: finitionCuivre },
    { value: 'peu-importe', label: 'Peu importe', emoji: '🤷' },
  ];

  // Mirror types with images
  const mirrorTypes = [
    { value: 'led', label: 'Miroir LED', image: miroirLed },
    { value: 'cadre', label: 'Miroir avec cadre', image: miroirCadre },
    { value: 'rond', label: 'Miroir rond', image: miroirRond },
    { value: 'armoire', label: 'Armoire de toilette', image: miroirArmoire },
    { value: 'sans', label: 'Sans miroir', emoji: '❌' },
    { value: 'a-definir', label: 'À définir', emoji: '❓' },
  ];

  // Toilet types with images
  const toiletTypes = [
    { value: 'suspendu', label: 'WC suspendu', image: wcSuspendu },
    { value: 'au-sol', label: 'WC au sol', image: wcSol },
    { value: 'conserver', label: "Conserver l'existant", emoji: '✅' },
    { value: 'pas-de-wc', label: 'Ne pas intégrer de WC', emoji: '❌' },
  ];

  const certaintyLevels = [
    { value: 'tout-clair', label: 'Tout est clair', icon: <CheckCircle className="w-5 h-5" /> },
    { value: 'idee-generale', label: "J'ai une idée générale", icon: <HelpCircle className="w-5 h-5" /> },
    { value: 'besoin-aide', label: "J'ai besoin d'aide pour la concevoir", icon: <Users className="w-5 h-5" /> },
  ];

  return (
    <FormSection
      title={roomName}
      subtitle="Configurez cette salle de bain selon vos besoins"
      showSkip={!!onSkip}
      onSkip={onSkip}
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

      {/* Ambiance - moved higher in the form */}
      <FormQuestion label="Quel style vous inspire ?">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {ambianceOptions.map((option) => (
            <SelectableCard
              key={option.value}
              selected={data.ambiance.includes(option.value)}
              onClick={() => toggleArrayValue('ambiance', option.value)}
              image={option.image}
              emoji={option.emoji}
              title={option.label}
              size="lg"
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

      {/* Show shower options if shower selected */}
      {(data.installationType === 'douche' || data.installationType === 'douche-baignoire') && (
        <>
          <FormQuestion label="Type de receveur souhaité :">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {showerTrayTypes.map((type) => (
                <SelectableCard
                  key={type.value}
                  selected={data.showerTrayType === type.value}
                  onClick={() => updateData({ showerTrayType: type.value })}
                  image={type.image}
                  title={type.label}
                  size="lg"
                />
              ))}
            </div>
          </FormQuestion>

          <FormQuestion label="Type de paroi de douche :">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {showerDoorTypes.map((type) => (
                <SelectableCard
                  key={type.value}
                  selected={data.showerDoorType === type.value}
                  onClick={() => updateData({ showerDoorType: type.value })}
                  image={type.image}
                  title={type.label}
                  size="xl"
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
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {bathtubTypes.map((type) => (
                <SelectableCard
                  key={type.value}
                  selected={data.bathtubType === type.value}
                  onClick={() => updateData({ bathtubType: type.value })}
                  image={type.image}
                  title={type.label}
                  size="xl"
                />
              ))}
            </div>
          </FormQuestion>

          <FormQuestion label="Type de pare-bain :">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {bathtubScreenTypes.map((type) => (
                <SelectableCard
                  key={type.value}
                  selected={data.bathtubScreenType === type.value}
                  onClick={() => updateData({ bathtubScreenType: type.value })}
                  image={type.image}
                  title={type.label}
                  size="xl"
                />
              ))}
            </div>
          </FormQuestion>
        </>
      )}

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

      {/* Vanity with images */}
      <FormQuestion label="Type de meuble vasque :">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {vanityTypes.map((type) => (
            <SelectableCard
              key={type.value}
              selected={data.vanityType === type.value}
              onClick={() => updateData({ vanityType: type.value })}
              image={type.image}
              title={type.label}
              size="xl"
            />
          ))}
        </div>
      </FormQuestion>

      {/* Sink style with emoji visuals */}
      <FormQuestion label="Type de vasque :">
        <div className="grid grid-cols-3 gap-3 max-w-lg">
          {sinkStyleOptions.map((option) => (
            <SelectableCard
              key={option.value}
              selected={data.sinkStyle === option.value}
              onClick={() => updateData({ sinkStyle: option.value })}
              emoji={option.emoji}
              title={option.label}
              size="sm"
            />
          ))}
        </div>

        {/* EGGER Catalog References - directly below sink style when vessel sink selected */}
        {data.sinkStyle === 'a-poser' && (
          <div className="mt-6">
            <ReferenceInput
              type="egger"
              title="Références finitions EGGER pour plan sous vasque (optionnel) :"
              catalogUrl="https://www.vds-egger.com/?country=FR&language=fr"
              catalogLabel="Voir le catalogue EGGER pour choisir vos finitions de plan"
              placeholder="Ex: H3157 ST12"
              formatHint={
                <>
                  Entrez le <strong>code décor</strong> suivi de la <strong>structure</strong> (facultatif).
                  Ces codes se trouvent sur le catalogue EGGER sous chaque échantillon.
                </>
              }
              formatExamples={['H3157 ST12', 'U702 ST89', 'H1180 ST37', 'W1000']}
              value={newReference}
              onChange={setNewReference}
              onAdd={addEggerReference}
              references={(data.eggerReferences || []).map(r => ({
                reference: r.reference,
                isLoading: r.isLoading,
                imageUrl: r.imageUrl,
                decorName: r.decorName,
                decorUrl: r.decorUrl,
                error: r.error,
              }))}
              onRemove={(ref) => removeEggerReference(ref as string)}
            />
          </div>
        )}
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

      {/* Tile type */}
      <FormQuestion label="Type de carrelage sol / mur :">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {tileTypes.map((type) => (
            <SelectableCard
              key={type.value}
              selected={data.tileType === type.value}
              onClick={() => updateData({ tileType: type.value })}
              image={type.image}
              emoji={type.emoji}
              title={type.label}
              size="md"
            />
          ))}
        </div>
      </FormQuestion>

      {/* Tile format */}
      <FormQuestion label="Format de carrelage :">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {tileFormats.map((format) => (
            <SelectableCard
              key={format.value}
              selected={data.tileFormat === format.value}
              onClick={() => updateData({ tileFormat: format.value })}
              image={format.image}
              emoji={format.emoji}
              title={format.label}
              size="md"
            />
          ))}
        </div>
      </FormQuestion>

      {/* Faucet type with images */}
      <FormQuestion label="Type de robinetterie douche :">
        <div className="grid grid-cols-3 gap-4">
          {faucetTypes.map((type) => (
            <SelectableCard
              key={type.value}
              selected={data.showerFaucetType === type.value}
              onClick={() => updateData({ showerFaucetType: type.value })}
              image={type.image}
              emoji={type.emoji}
              title={type.label}
              size="lg"
            />
          ))}
        </div>
      </FormQuestion>

      {/* Showerhead style with images */}
      <FormQuestion label="Style de pommeau :">
        <div className="grid grid-cols-3 gap-4">
          {showerHeadStyles.map((style) => (
            <SelectableCard
              key={style.value}
              selected={data.showerHeadStyle.includes(style.value)}
              onClick={() => toggleArrayValue('showerHeadStyle', style.value)}
              image={style.image}
              title={style.label}
              size="lg"
            />
          ))}
        </div>
      </FormQuestion>

      {/* Faucet finish with images */}
      <FormQuestion label="Finition robinetterie souhaitée :">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {finishOptions.map((option) => (
            <SelectableCard
              key={option.value}
              selected={data.faucetFinish === option.value}
              onClick={() => updateData({ faucetFinish: option.value })}
              image={option.image}
              emoji={option.emoji}
              title={option.label}
              size="lg"
            />
          ))}
        </div>
      </FormQuestion>

      {/* Mirror & Lighting section */}
      <FormQuestion label="Type de miroir souhaité :">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {mirrorTypes.map((type) => (
            <SelectableCard
              key={type.value}
              selected={data.mirrorType === type.value}
              onClick={() => updateData({ mirrorType: type.value })}
              image={type.image}
              emoji={type.emoji}
              title={type.label}
              size="lg"
            />
          ))}
        </div>
      </FormQuestion>

      {/* Toilet with images */}
      <FormQuestion label="WC (si présents dans la pièce) :">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {toiletTypes.map((type) => (
            <SelectableCard
              key={type.value}
              selected={data.toiletType === type.value}
              onClick={() => updateData({ toiletType: type.value })}
              image={type.image}
              emoji={type.emoji}
              title={type.label}
              size="lg"
            />
          ))}
        </div>
      </FormQuestion>

      {/* Sanibroyeur question - only show if WC is selected */}
      {(data.toiletType === 'suspendu' || data.toiletType === 'au-sol') && (
        <FormQuestion label="Y a-t-il actuellement un sanibroyeur installé ?">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { value: 'oui', label: 'Oui, sanibroyeur existant' },
              { value: 'non', label: 'Non, évacuation classique' },
              { value: 'ne-sais-pas', label: 'Je ne sais pas' },
              { value: 'pas-de-wc', label: 'Pas de WC actuellement' },
            ].map((option) => (
              <SelectableCard
                key={option.value}
                selected={data.existingSanibroyeur === option.value}
                onClick={() => updateData({ existingSanibroyeur: option.value })}
                title={option.label}
                size="sm"
              />
            ))}
          </div>
        </FormQuestion>
      )}

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
