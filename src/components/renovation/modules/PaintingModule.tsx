import React, { useState } from 'react';
import { useRenovationForm } from '../RenovationFormContext';
import { FormSection } from '../FormSection';
import { FormQuestion } from '../FormQuestion';
import { SelectableCard } from '../SelectableCard';
import { PaintingData, FarrowBallColor } from '../types';
import { ExternalLink, Plus, Trash2, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Import finish images
import finitionMat from '@/assets/painting/finition-mat.jpg';
import finitionSatine from '@/assets/painting/finition-satine.jpg';
import finitionBrillant from '@/assets/painting/finition-brillant.jpg';
import finitionVelours from '@/assets/painting/finition-velours.jpg';

interface PaintingModuleProps {
  roomId: string;
  roomName: string;
  data: PaintingData;
}

export const PaintingModule: React.FC<PaintingModuleProps> = ({ roomId, roomName, data }) => {
  const { updateRoomData, formData } = useRenovationForm();
  const [newColorNumber, setNewColorNumber] = useState('');
  const [newColorName, setNewColorName] = useState('');
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);

  const updateData = (updates: Partial<PaintingData>) => {
    updateRoomData(roomId, { paintingData: { ...data, ...updates } });
  };

  const toggleSurface = (value: string) => {
    const current = data.surfaces;
    if (current.includes(value)) {
      updateData({ surfaces: current.filter(v => v !== value) });
    } else {
      updateData({ surfaces: [...current, value] });
    }
  };

  // Get available rooms from form data
  const availableRooms = formData.selectedRooms.map(room => ({
    id: room.id,
    label: getRoomLabel(room.type, room.instanceNumber),
  }));

  function getRoomLabel(type: string, instanceNumber: number): string {
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
    return instanceNumber > 1 ? `${base} #${instanceNumber}` : base;
  }

  const toggleSelectedRoom = (roomId: string) => {
    if (selectedRooms.includes(roomId)) {
      setSelectedRooms(selectedRooms.filter(r => r !== roomId));
    } else {
      setSelectedRooms([...selectedRooms, roomId]);
    }
  };

  const addFarrowBallColor = () => {
    if (!newColorNumber.trim() && !newColorName.trim()) return;
    
    const newColor: FarrowBallColor = {
      colorNumber: newColorNumber.trim(),
      colorName: newColorName.trim(),
      rooms: selectedRooms,
    };
    
    updateData({ 
      farrowBallColors: [...(data.farrowBallColors || []), newColor] 
    });
    
    // Reset form
    setNewColorNumber('');
    setNewColorName('');
    setSelectedRooms([]);
  };

  const removeFarrowBallColor = (index: number) => {
    const updated = [...(data.farrowBallColors || [])];
    updated.splice(index, 1);
    updateData({ farrowBallColors: updated });
  };

  const surfaces = [
    { value: 'murs', label: 'Murs' },
    { value: 'plafonds', label: 'Plafonds' },
    { value: 'boiseries', label: 'Boiseries' },
    { value: 'tout', label: "Tout l'espace" },
  ];

  const intentions = [
    { value: 'neutre', label: 'Un rendu neutre' },
    { value: 'ambiance-marquee', label: 'Une ambiance marquée' },
    { value: 'decorative', label: 'Une peinture décorative' },
    { value: 'ne-sais-pas', label: 'Je ne sais pas encore' },
  ];

  const finishes = [
    { value: 'mat', label: 'Mat', image: finitionMat },
    { value: 'satine', label: 'Satiné', image: finitionSatine },
    { value: 'brillant', label: 'Brillant', image: finitionBrillant },
    { value: 'velours', label: 'Velours', image: finitionVelours },
    { value: 'a-definir', label: 'À définir', emoji: '❓' },
  ];

  const colorDefinitions = [
    { value: 'oui', label: 'Oui' },
    { value: 'non', label: 'Non' },
    { value: 'en-reflexion', label: 'En cours de réflexion' },
  ];

  const wallConditions = [
    { value: 'bon', label: 'Bon' },
    { value: 'moyen', label: 'Moyen' },
    { value: 'a-reprendre', label: 'À reprendre' },
    { value: 'ne-sais-pas', label: 'Je ne sais pas' },
  ];

  return (
    <FormSection
      title={`Peinture - ${roomName}`}
      subtitle="Définissez vos besoins en peinture pour cette pièce"
    >
      <FormQuestion label="Quelles surfaces sont concernées ?">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {surfaces.map((surface) => (
            <SelectableCard
              key={surface.value}
              selected={data.surfaces.includes(surface.value)}
              onClick={() => toggleSurface(surface.value)}
              title={surface.label}
              size="sm"
            />
          ))}
        </div>
      </FormQuestion>

      <FormQuestion label="Souhaitez-vous :">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {intentions.map((intention) => (
            <SelectableCard
              key={intention.value}
              selected={data.intention === intention.value}
              onClick={() => updateData({ intention: intention.value })}
              title={intention.label}
              size="sm"
            />
          ))}
        </div>
      </FormQuestion>

      <FormQuestion label="Finition souhaitée :">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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

      <FormQuestion label="Avez-vous déjà des couleurs définies ?">
        <div className="grid grid-cols-3 gap-3 max-w-md">
          {colorDefinitions.map((option) => (
            <SelectableCard
              key={option.value}
              selected={data.hasDefinedColors === option.value}
              onClick={() => updateData({ hasDefinedColors: option.value })}
              title={option.label}
              size="sm"
            />
          ))}
        </div>
      </FormQuestion>

      {/* Farrow & Ball color references */}
      {(data.hasDefinedColors === 'oui' || data.hasDefinedColors === 'en-reflexion') && (
        <FormQuestion label="Références couleurs Farrow & Ball (optionnel) :">
          <div className="space-y-4">
            {/* Link to Farrow & Ball catalog */}
            <a 
              href="https://www.farrow-ball.com/fr/peinture/toutes-les-couleurs-de-peinture"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 underline transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Voir le nuancier Farrow & Ball
            </a>
            
            {/* Color input form */}
            <div className="space-y-3 p-4 bg-muted/30 rounded-lg border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  placeholder="N° du coloris (ex: 26)"
                  value={newColorNumber}
                  onChange={(e) => setNewColorNumber(e.target.value)}
                  className="flex-1"
                />
                <Input
                  placeholder="Nom du coloris (ex: Down Pipe)"
                  value={newColorName}
                  onChange={(e) => setNewColorName(e.target.value)}
                  className="flex-1"
                />
              </div>
              
              {/* Room selection */}
              {availableRooms.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Pièce(s) concernée(s) :</p>
                  <div className="flex flex-wrap gap-2">
                    {availableRooms.map((room) => (
                      <Badge
                        key={room.id}
                        variant={selectedRooms.includes(room.id) ? "default" : "outline"}
                        className="cursor-pointer hover:bg-primary/80 transition-colors"
                        onClick={() => toggleSelectedRoom(room.id)}
                      >
                        {room.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <Button 
                type="button" 
                onClick={addFarrowBallColor}
                disabled={!newColorNumber.trim() && !newColorName.trim()}
                variant="outline"
                className="w-full md:w-auto"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter cette couleur
              </Button>
            </div>
            
            {/* Colors list */}
            {data.farrowBallColors && data.farrowBallColors.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Couleurs sélectionnées :</p>
                {data.farrowBallColors.map((color, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border"
                  >
                    {/* Color info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">
                        {color.colorNumber && `N° ${color.colorNumber}`}
                        {color.colorNumber && color.colorName && ' - '}
                        {color.colorName}
                      </p>
                      {color.rooms.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {color.rooms.map((roomId) => {
                            const room = availableRooms.find(r => r.id === roomId);
                            return room ? (
                              <Badge key={roomId} variant="secondary" className="text-xs">
                                {room.label}
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      )}
                    </div>
                    
                    {/* Remove button */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFarrowBallColor(index)}
                      className="flex-shrink-0 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </FormQuestion>
      )}

      <FormQuestion label="L'état des murs est :">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {wallConditions.map((condition) => (
            <SelectableCard
              key={condition.value}
              selected={data.wallCondition === condition.value}
              onClick={() => updateData({ wallCondition: condition.value })}
              title={condition.label}
              size="sm"
            />
          ))}
        </div>
      </FormQuestion>
    </FormSection>
  );
};
