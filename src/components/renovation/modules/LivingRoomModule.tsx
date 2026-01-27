import React, { useState } from 'react';
import { useRenovationForm } from '../RenovationFormContext';
import { FormSection } from '../FormSection';
import { FormQuestion } from '../FormQuestion';
import { SelectableCard } from '../SelectableCard';
import { PaintingData, FlooringData, ElectricityData, GlassPanelData } from '../types';
import { PaintingModule } from './PaintingModule';
import { FlooringModule } from './FlooringModule';
import { ElectricityModule } from './ElectricityModule';
import { GlassPanelModule } from './GlassPanelModule';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Paintbrush, Layers, Zap, PanelTop } from 'lucide-react';

interface LivingRoomModuleProps {
  roomId: string;
  roomName: string;
  paintingData: PaintingData;
  flooringData: FlooringData;
  electricityData: ElectricityData;
  glassPanelData?: GlassPanelData;
  showGlassPanel?: boolean;
  onSkip?: () => void;
}

const initialGlassPanelData: GlassPanelData = {
  purpose: [],
  panelType: '',
};

export const LivingRoomModule: React.FC<LivingRoomModuleProps> = ({ 
  roomId, 
  roomName, 
  paintingData,
  flooringData,
  electricityData,
  glassPanelData = initialGlassPanelData,
  showGlassPanel = false,
  onSkip 
}) => {
  const { updateRoomData } = useRenovationForm();
  const [activeTab, setActiveTab] = useState('peinture');

  const [wantsGlassPanel, setWantsGlassPanel] = useState<string>('');

  const workTypesSelection = [
    { value: 'peinture', label: 'Peinture', icon: <Paintbrush className="w-5 h-5" /> },
    { value: 'sols', label: 'Revêtements de sol', icon: <Layers className="w-5 h-5" /> },
    { value: 'electricite', label: 'Électricité', icon: <Zap className="w-5 h-5" /> },
    { value: 'verriere', label: 'Verrière / Claustra', icon: <PanelTop className="w-5 h-5" />, optional: true },
  ];

  return (
    <FormSection
      title={roomName}
      subtitle="Configurez les travaux pour cette pièce"
      showSkip={!!onSkip}
      onSkip={onSkip}
    >
      {/* Question about verrière if applicable */}
      {showGlassPanel && (
        <FormQuestion label="Souhaitez-vous installer une verrière ou un claustra ?">
          <div className="grid grid-cols-3 gap-3 max-w-md">
            {[
              { value: 'oui', label: 'Oui' },
              { value: 'non', label: 'Non' },
              { value: 'peut-etre', label: 'À étudier' },
            ].map((option) => (
              <SelectableCard
                key={option.value}
                selected={wantsGlassPanel === option.value}
                onClick={() => setWantsGlassPanel(option.value)}
                title={option.label}
                size="sm"
              />
            ))}
          </div>
        </FormQuestion>
      )}

      {/* Tabs for different work types */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-4 mb-6">
          <TabsTrigger value="peinture" className="flex items-center gap-2">
            <Paintbrush className="w-4 h-4" />
            <span className="hidden sm:inline">Peinture</span>
          </TabsTrigger>
          <TabsTrigger value="sols" className="flex items-center gap-2">
            <Layers className="w-4 h-4" />
            <span className="hidden sm:inline">Sols</span>
          </TabsTrigger>
          <TabsTrigger value="electricite" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            <span className="hidden sm:inline">Électricité</span>
          </TabsTrigger>
          {(wantsGlassPanel === 'oui' || wantsGlassPanel === 'peut-etre') && (
            <TabsTrigger value="verriere" className="flex items-center gap-2">
              <PanelTop className="w-4 h-4" />
              <span className="hidden sm:inline">Verrière</span>
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="peinture">
          <PaintingModule
            roomId={roomId}
            roomName={roomName}
            data={paintingData}
          />
        </TabsContent>

        <TabsContent value="sols">
          <FlooringModule
            roomId={roomId}
            roomName={roomName}
            data={flooringData}
          />
        </TabsContent>

        <TabsContent value="electricite">
          <ElectricityModule
            roomId={roomId}
            roomName={roomName}
            data={electricityData}
          />
        </TabsContent>

        {(wantsGlassPanel === 'oui' || wantsGlassPanel === 'peut-etre') && (
          <TabsContent value="verriere">
            <GlassPanelModule
              roomId={roomId}
              roomName={roomName}
              data={glassPanelData}
            />
          </TabsContent>
        )}
      </Tabs>
    </FormSection>
  );
};
