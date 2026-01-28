import React from 'react';
import { useRenovationForm } from '../RenovationFormContext';
import { FormSection } from '../FormSection';
import { SelectableCard } from '../SelectableCard';
import { Button } from '@/components/ui/button';
import { RoomType } from '../types';
import { Plus, Trash2, ChefHat, Bath, Toilet } from 'lucide-react';
import { cn } from '@/lib/utils';

const roomOptions: { type: RoomType; label: string; icon: React.ReactNode; emoji: string }[] = [
  { type: 'cuisine', label: 'Cuisine', icon: <ChefHat className="w-8 h-8" />, emoji: '🍳' },
  { type: 'salle-de-bain', label: 'Salle de bain', icon: <Bath className="w-8 h-8" />, emoji: '🛁' },
  { type: 'wc', label: 'WC', icon: <Toilet className="w-8 h-8" />, emoji: '🚽' },
];

export const StepRoomSelection: React.FC = () => {
  const { formData, addRoom, removeRoom } = useRenovationForm();

  const getRoomCount = (type: RoomType) => {
    return formData.selectedRooms.filter(r => r.type === type).length;
  };

  const getRoomLabel = (type: RoomType) => {
    return roomOptions.find(r => r.type === type)?.label || type;
  };

  const handleRoomToggle = (type: RoomType) => {
    const count = getRoomCount(type);
    if (count === 0) {
      addRoom(type);
    }
  };

  return (
    <FormSection
      title="Quelles pièces souhaitez-vous intégrer à votre projet ?"
      subtitle="Sélectionnez les pièces concernées par la rénovation"
      hint="Vous pourrez configurer chaque pièce en détail dans les étapes suivantes"
    >
      {/* Room selection grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {roomOptions.map((room) => {
          const count = getRoomCount(room.type);
          const isSelected = count > 0;

          return (
            <div key={room.type} className="relative">
              <SelectableCard
                selected={isSelected}
                onClick={() => handleRoomToggle(room.type)}
                emoji={room.emoji}
                title={room.label}
                size="lg"
                className="w-full"
              />
              
              {/* Room count badge and controls */}
              {isSelected && (
                <div className="absolute -top-2 -right-2 flex items-center gap-1">
                  <span className="bg-primary text-primary-foreground text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {count}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected rooms list */}
      {formData.selectedRooms.length > 0 && (
        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-medium text-foreground">
            Pièces sélectionnées ({formData.selectedRooms.length})
          </h3>
          <div className="space-y-2">
            {formData.selectedRooms.map((room) => (
              <div 
                key={room.id}
                className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">
                    {roomOptions.find(r => r.type === room.type)?.emoji}
                  </span>
                  <span className="font-medium">
                    {getRoomLabel(room.type)}
                    {room.instanceNumber > 1 && ` #${room.instanceNumber}`}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeRoom(room.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Add another room buttons */}
          <div className="pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground mb-3">
              Ajouter une pièce supplémentaire :
            </p>
            <div className="flex flex-wrap gap-2">
              {roomOptions.map((room) => (
                <Button
                  key={room.type}
                  variant="outline"
                  size="sm"
                  onClick={() => addRoom(room.type)}
                  className="gap-2"
                >
                  <Plus className="w-3 h-3" />
                  {room.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </FormSection>
  );
};
