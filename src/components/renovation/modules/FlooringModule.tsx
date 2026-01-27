import React from 'react';
import { useRenovationForm } from '../RenovationFormContext';
import { FormSection } from '../FormSection';
import { FormQuestion } from '../FormQuestion';
import { SelectableCard } from '../SelectableCard';
import { FlooringData } from '../types';
import { tileTypes, tileFormats } from '../tileOptions';

// Import flooring images - Floor types
import parquetImg from '@/assets/flooring/parquet.jpg';
import carrelageImg from '@/assets/flooring/carrelage.jpg';
import solSoupleImg from '@/assets/flooring/sol-souple.jpg';

// Import parquet laying patterns
import parquetChevron from '@/assets/flooring/parquet-chevron.jpg';
import parquetPointHongrie from '@/assets/flooring/parquet-point-hongrie.jpg';
import parquetDroit from '@/assets/flooring/parquet-droit.jpg';

// Import parquet wood types/colors
import parquetCheneClair from '@/assets/flooring/parquet-chene-clair.jpg';
import parquetCheneMoyen from '@/assets/flooring/parquet-chene-moyen.jpg';
import parquetCheneFonce from '@/assets/flooring/parquet-chene-fonce.jpg';
import parquetNoyer from '@/assets/flooring/parquet-noyer.jpg';

// Import parquet plank widths
import parquetLamesEtroites from '@/assets/flooring/parquet-lames-etroites.jpg';
import parquetLamesMoyennes from '@/assets/flooring/parquet-lames-moyennes.jpg';
import parquetLamesLarges from '@/assets/flooring/parquet-lames-larges.jpg';

// Import parquet finishes
import parquetBrillant from '@/assets/flooring/parquet-brillant.jpg';
import parquetMat from '@/assets/flooring/parquet-mat.jpg';
import parquetNaturel from '@/assets/flooring/parquet-naturel.jpg';

interface FlooringModuleProps {
  roomId: string;
  roomName: string;
  data: FlooringData;
}

export const FlooringModule: React.FC<FlooringModuleProps> = ({ roomId, roomName, data }) => {
  const { updateRoomData } = useRenovationForm();

  const updateData = (updates: Partial<FlooringData>) => {
    updateRoomData(roomId, { flooringData: { ...data, ...updates } });
  };

  const floorTypes = [
    { value: 'parquet', label: 'Parquet', image: parquetImg },
    { value: 'carrelage', label: 'Carrelage', image: carrelageImg },
    { value: 'sol-souple', label: 'Sol souple', image: solSoupleImg },
    { value: 'a-definir', label: 'À définir', emoji: '❓' },
  ];

  // Parquet options
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

  const existingActions = [
    { value: 'conserver', label: 'Conserver' },
    { value: 'remplacer', label: 'Remplacer' },
    { value: 'etudier', label: 'Étudier la faisabilité' },
  ];

  return (
    <FormSection
      title={`Sols - ${roomName}`}
      subtitle="Définissez vos besoins en revêtements de sol pour cette pièce"
    >
      <FormQuestion label="Type de sol souhaité :">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {floorTypes.map((type) => (
            <SelectableCard
              key={type.value}
              selected={data.floorType === type.value}
              onClick={() => updateData({ floorType: type.value })}
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
                  onClick={() => updateData({ tileType: type.value })}
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
                  onClick={() => updateData({ tileFormat: format.value })}
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
                  onClick={() => updateData({ woodType: wood.value })}
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
                  onClick={() => updateData({ layingPattern: pattern.value })}
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
                  onClick={() => updateData({ plankWidth: width.value })}
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
                  onClick={() => updateData({ finish: finish.value })}
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

      <FormQuestion label="Souhaitez-vous :">
        <div className="grid grid-cols-3 gap-3 max-w-md">
          {existingActions.map((action) => (
            <SelectableCard
              key={action.value}
              selected={data.existingAction === action.value}
              onClick={() => updateData({ existingAction: action.value })}
              title={action.label}
              size="sm"
            />
          ))}
        </div>
      </FormQuestion>
    </FormSection>
  );
};
