import React from 'react';
import { useRenovationForm } from '../RenovationFormContext';
import { FormSection } from '../FormSection';
import { FormQuestion } from '../FormQuestion';
import { SelectableCard } from '../SelectableCard';
import { Textarea } from '@/components/ui/textarea';
import { GenericRoomData, initialPaintingData } from '../types';
import { CheckCircle, HelpCircle, Users } from 'lucide-react';
import { PaintingModule } from './PaintingModule';

interface GenericRoomModuleProps {
  roomId: string;
  roomName: string;
  instanceNumber: number;
  data: GenericRoomData;
  onSkip?: () => void;
}

export const GenericRoomModule: React.FC<GenericRoomModuleProps> = ({ 
  roomId, 
  roomName, 
  instanceNumber,
  data,
  onSkip 
}) => {
  const { updateRoomData, formData } = useRenovationForm();

  // Get painting data for this room
  const room = formData.selectedRooms.find(r => r.id === roomId);
  const paintingData = room?.data.paintingData || initialPaintingData;

  const updateData = (updates: Partial<GenericRoomData>) => {
    updateRoomData(roomId, { genericRoomData: { ...data, ...updates } });
  };

  const toggleWorkType = (value: string) => {
    const current = data.workTypes;
    if (current.includes(value)) {
      updateData({ workTypes: current.filter(v => v !== value) });
    } else {
      updateData({ workTypes: [...current, value] });
    }
  };

  const workTypes = [
    { value: 'peinture', label: 'Peinture', emoji: '🎨' },
    { value: 'electricite', label: 'Électricité', emoji: '⚡' },
    { value: 'sols', label: 'Sols', emoji: '🪵' },
    { value: 'plomberie', label: 'Plomberie', emoji: '🔧' },
    { value: 'moulures', label: 'Moulures', emoji: '🏛️' },
    { value: 'amenagement', label: 'Aménagement', emoji: '📐' },
    { value: 'autre', label: 'Autre', emoji: '✨' },
  ];

  const certaintyLevels = [
    { value: 'tout-clair', label: 'Tout est clair', icon: <CheckCircle className="w-5 h-5" /> },
    { value: 'idee-generale', label: "J'ai une idée générale", icon: <HelpCircle className="w-5 h-5" /> },
    { value: 'besoin-aide', label: "J'ai besoin d'aide", icon: <Users className="w-5 h-5" /> },
  ];

  const showPaintingModule = data.workTypes.includes('peinture');

  return (
    <>
      <FormSection
        title={`${roomName}${instanceNumber > 1 ? ` #${instanceNumber}` : ''}`}
        subtitle="Décrivez vos besoins pour cette pièce"
        showSkip={!!onSkip}
        onSkip={onSkip}
      >
        <FormQuestion label="Quels types de travaux sont envisagés ?">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {workTypes.map((type) => (
              <SelectableCard
                key={type.value}
                selected={data.workTypes.includes(type.value)}
                onClick={() => toggleWorkType(type.value)}
                emoji={type.emoji}
                title={type.label}
                size="sm"
              />
            ))}
          </div>
        </FormQuestion>

        <FormQuestion label="Décrivez votre projet pour cette pièce (facultatif) :">
          <Textarea
            value={data.description}
            onChange={(e) => updateData({ description: e.target.value })}
            placeholder="Décrivez vos besoins, vos envies, vos contraintes..."
            className="min-h-[120px]"
          />
        </FormQuestion>

        <FormQuestion label="Où en êtes-vous pour cette pièce ?">
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

      {/* Show PaintingModule when peinture is selected */}
      {showPaintingModule && (
        <PaintingModule
          roomId={roomId}
          roomName={roomName}
          data={paintingData}
        />
      )}
    </>
  );
};
