import React, { useState } from 'react';
import { useRenovationForm } from '../RenovationFormContext';
import { FormSection } from '../FormSection';
import { FormQuestion } from '../FormQuestion';
import { SelectableCard } from '../SelectableCard';
import { KitchenData, EggerReference, PlaniziaReference } from '../types';
import { backsplashTileTypes, tileFormats } from '../tileOptions';
import { 
  ChefHat, Clock, Users, DoorOpen, DoorClosed,
  HelpCircle, CheckCircle, ExternalLink, Plus, Trash2, Loader2, Image as ImageIcon
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Import kitchen images
import implantationLineaire from '@/assets/kitchen/implantation-lineaire.jpg';
import implantationL from '@/assets/kitchen/implantation-l.jpg';
import implantationU from '@/assets/kitchen/implantation-u.jpg';
import implantationIlot from '@/assets/kitchen/implantation-ilot.jpg';
import planStratifie from '@/assets/kitchen/plan-stratifie.jpg';
import planQuartz from '@/assets/kitchen/plan-quartz.jpg';
import planCeramique from '@/assets/kitchen/plan-ceramique.jpg';
import planBois from '@/assets/kitchen/plan-bois.jpg';
import facadeBois from '@/assets/kitchen/facade-bois.jpg';
import facadeLaque from '@/assets/kitchen/facade-laque.jpg';
import facadeMat from '@/assets/kitchen/facade-mat.jpg';
import facadeEffetMatiere from '@/assets/kitchen/facade-effet-matiere.jpg';

interface KitchenModuleProps {
  roomId: string;
  roomName: string;
  data: KitchenData;
}

export const KitchenModule: React.FC<KitchenModuleProps> = ({ roomId, roomName, data }) => {
  const { updateRoomData } = useRenovationForm();
  const [newReference, setNewReference] = useState('');
  const [newPlaniziaReference, setNewPlaniziaReference] = useState('');

  const updateData = (updates: Partial<KitchenData>) => {
    updateRoomData(roomId, { kitchenData: { ...data, ...updates } });
  };

  const toggleArrayValue = (key: keyof KitchenData, value: string) => {
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

      const updatedRefs = (data.eggerReferences || []).map(r => 
        r.reference === cleanRef && r.isLoading
          ? { 
              reference: cleanRef,
              decorName: scrapeData?.decorName || undefined,
              imageUrl: scrapeData?.imageUrl || undefined,
              decorUrl: scrapeData?.decorUrl || undefined,
              isLoading: false,
            }
          : r
      );

      updateData({ eggerReferences: updatedRefs });
      
      if (scrapeData?.imageUrl) {
        toast.success(`Image trouvée pour ${cleanRef}${scrapeData?.decorName ? ` - ${scrapeData.decorName.replace(cleanRef, '').trim()}` : ''}`);
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

  const addPlaniziaReference = async () => {
    if (!newPlaniziaReference.trim()) return;
    
    const cleanRef = newPlaniziaReference.trim();
    
    if (data.planiziaReferences?.some(r => r.reference.toLowerCase() === cleanRef.toLowerCase())) {
      toast.error('Cette référence a déjà été ajoutée');
      return;
    }

    const newRef: PlaniziaReference = {
      reference: cleanRef,
      isLoading: true,
    };
    
    updateData({ 
      planiziaReferences: [...(data.planiziaReferences || []), newRef] 
    });
    setNewPlaniziaReference('');

    try {
      const { data: scrapeData, error } = await supabase.functions.invoke('scrape-planizia', {
        body: { reference: cleanRef },
      });

      if (error) throw error;

      const updatedRefs = (data.planiziaReferences || []).map(r => 
        r.reference.toLowerCase() === cleanRef.toLowerCase() && r.isLoading
          ? { 
              reference: cleanRef,
              productName: scrapeData?.productName || undefined,
              imageUrl: scrapeData?.imageUrl || undefined,
              productUrl: scrapeData?.productUrl || undefined,
              brand: scrapeData?.brand || undefined,
              isLoading: false,
            }
          : r
      );

      updateData({ planiziaReferences: updatedRefs });
      
      if (scrapeData?.imageUrl) {
        toast.success(`Image trouvée pour ${cleanRef}`);
      } else {
        toast.info(`Référence ${cleanRef} ajoutée (image non trouvée)`);
      }
    } catch (error) {
      console.error('Error scraping Planizia:', error);
      const updatedRefs = (data.planiziaReferences || []).map(r => 
        r.reference.toLowerCase() === cleanRef.toLowerCase() && r.isLoading
          ? { ...r, isLoading: false, error: 'Erreur lors de la recherche' }
          : r
      );
      updateData({ planiziaReferences: updatedRefs });
      toast.error('Erreur lors de la recherche de l\'image');
    }
  };

  const removePlaniziaReference = (reference: string) => {
    updateData({ 
      planiziaReferences: (data.planiziaReferences || []).filter(r => r.reference !== reference) 
    });
  };

  const usageOptions = [
    { value: 'tres-utilisee', label: 'Très utilisée (quotidienne)', icon: <ChefHat className="w-5 h-5" /> },
    { value: 'occasionnelle', label: 'Occasionnelle', icon: <Clock className="w-5 h-5" /> },
    { value: 'familiale', label: 'Familiale', icon: <Users className="w-5 h-5" /> },
    { value: 'ouverte', label: 'Cuisine ouverte', icon: <DoorOpen className="w-5 h-5" /> },
    { value: 'fermee', label: 'Cuisine fermée', icon: <DoorClosed className="w-5 h-5" /> },
  ];

  const layoutTypes = [
    { value: 'lineaire', label: 'Linéaire', image: implantationLineaire },
    { value: 'en-l', label: 'En L', image: implantationL },
    { value: 'en-u', label: 'En U', image: implantationU },
    { value: 'avec-ilot', label: 'Avec îlot', image: implantationIlot },
  ];

  const cabinetTypes = [
    { value: 'standard', label: 'Standard' },
    { value: 'sur-mesure', label: 'Sur mesure' },
    { value: 'optimisation', label: "Optimisation de l'existant" },
    { value: 'ne-sais-pas', label: 'Je ne sais pas encore' },
  ];

  const facadeFinishes = [
    { value: 'bois', label: 'Bois', image: facadeBois },
    { value: 'laque', label: 'Laqué', image: facadeLaque },
    { value: 'mat', label: 'Mat', image: facadeMat },
    { value: 'effet-matiere', label: 'Effet matière', image: facadeEffetMatiere },
  ];

  const countertopMaterials = [
    { value: 'stratifie', label: 'Stratifié', image: planStratifie },
    { value: 'quartz', label: 'Quartz', image: planQuartz },
    { value: 'ceramique', label: 'Céramique', image: planCeramique },
    { value: 'bois', label: 'Bois', image: planBois },
  ];

  const backsplashTypes = [
    { value: 'carrelage', label: 'Carrelage' },
    { value: 'pleine-hauteur', label: 'Pleine hauteur' },
    { value: 'verre', label: 'Verre' },
    { value: 'autre', label: 'Autre' },
    { value: 'a-definir', label: 'À définir' },
  ];

  const certaintyLevels = [
    { value: 'tout-defini', label: 'Tout est défini', icon: <CheckCircle className="w-5 h-5" /> },
    { value: 'besoin-conseils', label: "J'ai besoin de conseils", icon: <HelpCircle className="w-5 h-5" /> },
    { value: 'accompagnement-complet', label: "J'ai besoin d'un accompagnement complet", icon: <Users className="w-5 h-5" /> },
  ];

  // Helper to render reference list with inline images
  const renderReferenceList = (
    references: EggerReference[] | PlaniziaReference[] | undefined,
    type: 'egger' | 'planizia'
  ) => {
    if (!references || references.length === 0) return null;

    return (
      <div className="space-y-2">
        {references.map((ref, index) => (
          <div 
            key={`${ref.reference}-${index}`}
            className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border"
          >
            {/* Image inline next to reference */}
            <div className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-muted flex items-center justify-center">
              {ref.isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              ) : ref.imageUrl ? (
                <img 
                  src={ref.imageUrl} 
                  alt={'decorName' in ref ? ref.decorName || ref.reference : 'productName' in ref ? ref.productName || ref.reference : ref.reference}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <ImageIcon className="w-6 h-6 text-muted-foreground" />
              )}
            </div>
            
            {/* Reference info */}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">{ref.reference}</p>
              {'decorName' in ref && ref.decorName && (
                <p className="text-xs text-muted-foreground truncate">
                  {ref.decorName.replace(ref.reference, '').trim()}
                </p>
              )}
              {'brand' in ref && ref.brand && (
                <p className="text-xs text-muted-foreground">{ref.brand}</p>
              )}
              {ref.error && (
                <p className="text-xs text-destructive">{ref.error}</p>
              )}
              {!ref.isLoading && !ref.imageUrl && !ref.error && (
                <p className="text-xs text-muted-foreground">Image non disponible</p>
              )}
              {'decorUrl' in ref && ref.decorUrl && (
                <a 
                  href={ref.decorUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                >
                  Voir sur EGGER <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {'productUrl' in ref && ref.productUrl && (
                <a 
                  href={ref.productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                >
                  Voir sur Planizia <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            
            {/* Remove button */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => type === 'egger' ? removeEggerReference(ref.reference) : removePlaniziaReference(ref.reference)}
              className="flex-shrink-0 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <FormSection
      title={roomName}
      subtitle="Configurez votre cuisine selon vos besoins"
    >
      {/* Usage */}
      <FormQuestion label="Cette cuisine sera :">
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

      {/* Layout type - increased image height */}
      <FormQuestion label="Type d'implantation envisagée :">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {layoutTypes.map((type) => (
            <SelectableCard
              key={type.value}
              selected={data.layoutType === type.value}
              onClick={() => updateData({ layoutType: type.value })}
              image={type.image}
              title={type.label}
              size="xl"
            />
          ))}
        </div>
      </FormQuestion>

      {/* Modify layout */}
      <FormQuestion label="Souhaitez-vous modifier l'implantation actuelle ?">
        <div className="grid grid-cols-3 gap-3 max-w-md">
          {[
            { value: 'oui', label: 'Oui' },
            { value: 'non', label: 'Non' },
            { value: 'a-etudier', label: 'À étudier' },
          ].map((option) => (
            <SelectableCard
              key={option.value}
              selected={data.modifyLayout === option.value}
              onClick={() => updateData({ modifyLayout: option.value })}
              title={option.label}
              size="sm"
            />
          ))}
        </div>
      </FormQuestion>

      {/* Cabinet type */}
      <FormQuestion label="Type de meubles :">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {cabinetTypes.map((type) => (
            <SelectableCard
              key={type.value}
              selected={data.cabinetType === type.value}
              onClick={() => updateData({ cabinetType: type.value })}
              title={type.label}
              size="sm"
            />
          ))}
        </div>
      </FormQuestion>

      {/* Facade finish */}
      <FormQuestion label="Finition des façades :">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {facadeFinishes.map((finish) => (
            <SelectableCard
              key={finish.value}
              selected={data.facadeFinish === finish.value}
              onClick={() => updateData({ facadeFinish: finish.value })}
              image={finish.image}
              title={finish.label}
              size="lg"
            />
          ))}
        </div>
      </FormQuestion>

      {/* Handles */}
      <FormQuestion label="Avec poignées ?">
        <div className="grid grid-cols-3 gap-3 max-w-md">
          {[
            { value: 'oui', label: 'Oui' },
            { value: 'non', label: 'Non' },
            { value: 'indifferent', label: 'Indifférent' },
          ].map((option) => (
            <SelectableCard
              key={option.value}
              selected={data.hasHandles === option.value}
              onClick={() => updateData({ hasHandles: option.value })}
              title={option.label}
              size="sm"
            />
          ))}
        </div>
      </FormQuestion>

      {/* Countertop material */}
      <FormQuestion label="Matériau du plan de travail souhaité :">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {countertopMaterials.map((material) => (
            <SelectableCard
              key={material.value}
              selected={data.countertopMaterial === material.value}
              onClick={() => updateData({ countertopMaterial: material.value })}
              image={material.image}
              title={material.label}
              size="lg"
            />
          ))}
        </div>

        {/* EGGER Catalog References - directly below for stratifié */}
        {data.countertopMaterial === 'stratifie' && (
          <div className="mt-6 space-y-4">
            <p className="text-sm font-medium text-foreground">
              Références finitions EGGER pour plan stratifié (optionnel) :
            </p>
            
            <a 
              href="https://www.vds-egger.com/?country=FR&language=fr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 underline transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Voir le catalogue EGGER pour choisir vos finitions stratifiées
            </a>
            
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                Format : code décor + structure (ex: H1312 ST10). Trouvez les références sur le catalogue EGGER.
              </p>
              <div className="flex gap-2">
                <Input
                  placeholder="Ex: H1312 ST10"
                  value={newReference}
                  onChange={(e) => setNewReference(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addEggerReference())}
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  onClick={addEggerReference}
                  disabled={!newReference.trim()}
                  size="icon"
                  variant="outline"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {renderReferenceList(data.eggerReferences, 'egger')}
          </div>
        )}

        {/* Planizia Catalog References - directly below for quartz or ceramique */}
        {(data.countertopMaterial === 'quartz' || data.countertopMaterial === 'ceramique') && (
          <div className="mt-6 space-y-4">
            <p className="text-sm font-medium text-foreground">
              Références Planizia pour plan {data.countertopMaterial === 'quartz' ? 'quartz' : 'céramique'} (optionnel) :
            </p>
            
            <a 
              href="https://www.planizia.fr/coloris/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 underline transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Voir le catalogue Planizia pour choisir vos coloris
            </a>
            
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                Format : marque + nom du coloris (ex: <strong>Silestone Persian white</strong>). 
                Marques disponibles : Silestone, Dekton, Neolith, Lapitec, Caesarstone...
              </p>
              <div className="flex gap-2">
                <Input
                  placeholder="Ex: Silestone Persian white"
                  value={newPlaniziaReference}
                  onChange={(e) => setNewPlaniziaReference(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addPlaniziaReference())}
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  onClick={addPlaniziaReference}
                  disabled={!newPlaniziaReference.trim()}
                  size="icon"
                  variant="outline"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {renderReferenceList(data.planiziaReferences, 'planizia')}
          </div>
        )}
      </FormQuestion>

      {/* Backsplash type */}
      <FormQuestion label="Type de crédence :">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {backsplashTypes.map((type) => (
            <SelectableCard
              key={type.value}
              selected={data.backsplashType === type.value}
              onClick={() => updateData({ backsplashType: type.value })}
              title={type.label}
              size="sm"
            />
          ))}
        </div>
      </FormQuestion>

      {/* Tile selection for carrelage backsplash */}
      {data.backsplashType === 'carrelage' && (
        <>
          <FormQuestion label="Type de carrelage pour la crédence :">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {backsplashTileTypes.map((type) => (
                <SelectableCard
                  key={type.value}
                  selected={data.backsplashTileType === type.value}
                  onClick={() => updateData({ backsplashTileType: type.value })}
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
                  selected={data.backsplashTileFormat === format.value}
                  onClick={() => updateData({ backsplashTileFormat: format.value })}
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

      {/* Certainty level */}
      <FormQuestion label="Pour cette cuisine :">
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
