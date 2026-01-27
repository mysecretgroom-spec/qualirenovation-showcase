import React from 'react';
import { useRenovationForm } from '../RenovationFormContext';
import { FormSection } from '../FormSection';
import { FormQuestion } from '../FormQuestion';
import { SelectableCard } from '../SelectableCard';
import { Badge } from '@/components/ui/badge';
import { tileTypes, tileFormats } from '../tileOptions';
import { Checkbox } from '@/components/ui/checkbox';

// Import flooring images
import parquetImg from '@/assets/flooring/parquet.jpg';
import carrelageImg from '@/assets/flooring/carrelage.jpg';
import solSoupleImg from '@/assets/flooring/sol-souple.jpg';

// Import parquet images
import parquetChevron from '@/assets/flooring/parquet-chevron.jpg';
import parquetPointHongrie from '@/assets/flooring/parquet-point-hongrie.jpg';
import parquetDroit from '@/assets/flooring/parquet-droit.jpg';
import parquetCheneClair from '@/assets/flooring/parquet-chene-clair.jpg';
import parquetCheneMoyen from '@/assets/flooring/parquet-chene-moyen.jpg';
import parquetCheneFonce from '@/assets/flooring/parquet-chene-fonce.jpg';
import parquetNoyer from '@/assets/flooring/parquet-noyer.jpg';
import parquetLamesEtroites from '@/assets/flooring/parquet-lames-etroites.jpg';
import parquetLamesMoyennes from '@/assets/flooring/parquet-lames-moyennes.jpg';
import parquetLamesLarges from '@/assets/flooring/parquet-lames-larges.jpg';
import parquetBrillant from '@/assets/flooring/parquet-brillant.jpg';
import parquetMat from '@/assets/flooring/parquet-mat.jpg';
import parquetNaturel from '@/assets/flooring/parquet-naturel.jpg';

export interface GlobalFlooringData {
  selectedRooms: string[];
  existingAction: 'conserver' | 'remplacer' | 'etudier' | '';
  // Conservation options
  hasLambourdes: 'oui' | 'non' | 'ne-sais-pas' | '';
  refinishType: string;
  // Remplacement options  
  floorType: string;
  tileType: string;
  tileFormat: string;
  layingPattern: string;
  woodType: string;
  plankWidth: string;
  finish: string;
}

interface GlobalFlooringModuleProps {
  data: GlobalFlooringData;
  onUpdate: (data: Partial<GlobalFlooringData>) => void;
  onSkip?: () => void;
}

export const GlobalFlooringModule: React.FC<GlobalFlooringModuleProps> = ({ 
  data, 
  onUpdate,
  onSkip 
}) => {
  const { formData } = useRenovationForm();

  const toggleRoom = (roomId: string) => {
    const current = data.selectedRooms || [];
    if (current.includes(roomId)) {
      onUpdate({ selectedRooms: current.filter(r => r !== roomId) });
    } else {
      onUpdate({ selectedRooms: [...current, roomId] });
    }
  };

  const getRoomLabel = (type: string, instanceNumber: number): string => {
    const labels: Record<string, string> = {
      'cuisine': 'Cuisine',
      'salle-de-bain': 'Salle de bain',
      'wc': 'WC',
      'salon-sejour': 'Salon/Séjour',
      'chambre': 'Chambre',
      'entree-couloir': 'Entrée/Couloir',
      'dressing-rangements': 'Dressing',
      'bureau': 'Bureau',
      'autre': 'Autre pièce',
    };
    const base = labels[type] || type;
    return instanceNumber > 1 ? `${base} ${instanceNumber}` : base;
  };

  const existingActions = [
    { value: 'conserver', label: 'Conserver / Rénover' },
    { value: 'remplacer', label: 'Remplacer' },
    { value: 'etudier', label: 'Étudier la faisabilité' },
  ];

  const refinishTypes = [
    { value: 'vernis-naturel', label: 'Vernis naturel' },
    { value: 'vernis-fonce', label: 'Vernis foncé' },
    { value: 'vernis-transparent', label: 'Vernis transparent' },
    { value: 'vernis-etanche', label: 'Vernis étanche' },
    { value: 'vernis-colore', label: 'Vernis coloré' },
    { value: 'huile', label: 'Huile' },
    { value: 'a-definir', label: 'À définir', emoji: '❓' },
  ];

  const floorTypes = [
    { value: 'parquet', label: 'Parquet', image: parquetImg },
    { value: 'carrelage', label: 'Carrelage', image: carrelageImg },
    { value: 'sol-souple', label: 'Sol souple', image: solSoupleImg },
    { value: 'a-definir', label: 'À définir', emoji: '❓' },
  ];

  const layingPatterns = [
    { value: 'droite', label: 'Pose droite', image: parquetDroit },
    { value: 'chevron', label: 'Chevron', image: parquetChevron },
    { value: 'point-hongrie', label: 'Point de Hongrie', image: parquetPointHongrie },
    { value: 'autre', label: 'Autre' },
  ];

  const woodTypes = [
    { value: 'chene-clair', label: 'Chêne clair', image: parquetCheneClair },
    { value: 'chene-moyen', label: 'Chêne moyen', image: parquetCheneMoyen },
    { value: 'chene-fonce', label: 'Chêne foncé', image: parquetCheneFonce },
    { value: 'noyer', label: 'Noyer', image: parquetNoyer },
    { value: 'a-definir', label: 'À définir', emoji: '❓' },
  ];

  const plankWidths = [
    { value: 'etroites', label: 'Lames étroites (70mm)', image: parquetLamesEtroites },
    { value: 'moyennes', label: 'Lames moyennes (140mm)', image: parquetLamesMoyennes },
    { value: 'larges', label: 'Lames larges (200mm+)', image: parquetLamesLarges },
    { value: 'a-definir', label: 'À définir', emoji: '❓' },
  ];

  const finishes = [
    { value: 'brillant', label: 'Brillant (verni)', image: parquetBrillant },
    { value: 'mat', label: 'Mat (satiné)', image: parquetMat },
    { value: 'naturel', label: 'Naturel (huilé)', image: parquetNaturel },
    { value: 'a-definir', label: 'À définir', emoji: '❓' },
  ];

  return (
    <FormSection
      title="Parquet & Sols"
      subtitle="Configurez les revêtements de sol pour votre projet"
      showSkip={!!onSkip}
      onSkip={onSkip}
    >
      {/* Room selection */}
      <FormQuestion label="Pièces concernées par les travaux de sol :">
        <div className="flex flex-wrap gap-2">
          {formData.selectedRooms.map((room) => (
            <Badge
              key={room.id}
              variant={(data.selectedRooms || []).includes(room.id) ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/80 transition-colors py-2 px-3"
              onClick={() => toggleRoom(room.id)}
            >
              {getRoomLabel(room.type, room.instanceNumber)}
            </Badge>
          ))}
        </div>
      </FormQuestion>

      {/* Existing action - First question */}
      <FormQuestion label="Souhaitez-vous :">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {existingActions.map((action) => (
            <SelectableCard
              key={action.value}
              selected={data.existingAction === action.value}
              onClick={() => onUpdate({ existingAction: action.value as any })}
              title={action.label}
              size="md"
            />
          ))}
        </div>
      </FormQuestion>

      {/* Conservation path - Lambourdes question */}
      {data.existingAction === 'conserver' && (
        <>
          <FormQuestion label="Y aura-t-il des lambourdes à remplacer ?">
            <div className="grid grid-cols-3 gap-3 max-w-md">
              {[
                { value: 'oui', label: 'Oui' },
                { value: 'non', label: 'Non' },
                { value: 'ne-sais-pas', label: 'Je ne sais pas' },
              ].map((option) => (
                <SelectableCard
                  key={option.value}
                  selected={data.hasLambourdes === option.value}
                  onClick={() => onUpdate({ hasLambourdes: option.value as any })}
                  title={option.label}
                  size="sm"
                />
              ))}
            </div>
          </FormQuestion>

          <FormQuestion label="Type de finition souhaité après ponçage :">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {refinishTypes.map((type) => (
                <SelectableCard
                  key={type.value}
                  selected={data.refinishType === type.value}
                  onClick={() => onUpdate({ refinishType: type.value })}
                  title={type.label}
                  emoji={type.emoji}
                  size="sm"
                />
              ))}
            </div>
          </FormQuestion>
        </>
      )}

      {/* Replacement path */}
      {data.existingAction === 'remplacer' && (
        <>
          <FormQuestion label="Type de sol souhaité :">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {floorTypes.map((type) => (
                <SelectableCard
                  key={type.value}
                  selected={data.floorType === type.value}
                  onClick={() => onUpdate({ floorType: type.value })}
                  image={type.image}
                  emoji={type.emoji}
                  title={type.label}
                  size="md"
                />
              ))}
            </div>
          </FormQuestion>

          {/* Carrelage options */}
          {data.floorType === 'carrelage' && (
            <>
              <FormQuestion label="Type de carrelage :">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {tileTypes.map((type) => (
                    <SelectableCard
                      key={type.value}
                      selected={data.tileType === type.value}
                      onClick={() => onUpdate({ tileType: type.value })}
                      image={type.image}
                      emoji={type.emoji}
                      title={type.label}
                      size="md"
                    />
                  ))}
                </div>
              </FormQuestion>

              <FormQuestion label="Format de carrelage :">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {tileFormats.map((format) => (
                    <SelectableCard
                      key={format.value}
                      selected={data.tileFormat === format.value}
                      onClick={() => onUpdate({ tileFormat: format.value })}
                      image={format.image}
                      emoji={format.emoji}
                      title={format.label}
                      size="md"
                    />
                  ))}
                </div>
              </FormQuestion>
            </>
          )}

          {/* Parquet options */}
          {data.floorType === 'parquet' && (
            <>
              <FormQuestion label="Coloris / Essence de bois :">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {woodTypes.map((wood) => (
                    <SelectableCard
                      key={wood.value}
                      selected={data.woodType === wood.value}
                      onClick={() => onUpdate({ woodType: wood.value })}
                      image={wood.image}
                      emoji={wood.emoji}
                      title={wood.label}
                      size="md"
                    />
                  ))}
                </div>
              </FormQuestion>

              <FormQuestion label="Type de pose :">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {layingPatterns.map((pattern) => (
                    <SelectableCard
                      key={pattern.value}
                      selected={data.layingPattern === pattern.value}
                      onClick={() => onUpdate({ layingPattern: pattern.value })}
                      image={pattern.image}
                      title={pattern.label}
                      size="md"
                    />
                  ))}
                </div>
              </FormQuestion>

              <FormQuestion label="Largeur des lames :">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {plankWidths.map((width) => (
                    <SelectableCard
                      key={width.value}
                      selected={data.plankWidth === width.value}
                      onClick={() => onUpdate({ plankWidth: width.value })}
                      image={width.image}
                      emoji={width.emoji}
                      title={width.label}
                      size="md"
                    />
                  ))}
                </div>
              </FormQuestion>

              <FormQuestion label="Finition :">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {finishes.map((finish) => (
                    <SelectableCard
                      key={finish.value}
                      selected={data.finish === finish.value}
                      onClick={() => onUpdate({ finish: finish.value })}
                      image={finish.image}
                      emoji={finish.emoji}
                      title={finish.label}
                      size="md"
                    />
                  ))}
                </div>
              </FormQuestion>
            </>
          )}
        </>
      )}
    </FormSection>
  );
};
