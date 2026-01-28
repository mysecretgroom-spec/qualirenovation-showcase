import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  X, Save, Loader2, Home, Calendar, MapPin, Ruler, 
  ChevronRight, Bath, CookingPot, DoorOpen, Settings, 
  Clock, AlertTriangle, Paintbrush, Zap, Frame, Pencil,
  Plus, Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { uploadSimulationPDF } from "@/utils/generateSimulationPDF";
import { cn } from "@/lib/utils";
import RoomEditorPanel from "./RoomEditorPanel";

interface Simulation {
  id: string;
  property_type: string | null;
  surface: string | null;
  construction_period: string | null;
  city: string | null;
  has_architect: string | null;
  modify_layout: string | null;
  project_types: string[] | null;
  project_contexts: string[] | null;
  has_dpe: string | null;
  occupy_during_works: string | null;
  constraints: string[] | null;
  constraint_details: string | null;
  start_date: string | null;
  start_date_value: string | null;
  end_date_max: string | null;
  selected_rooms: any;
  isolation_data: any;
  created_at: string;
}

interface SimulationEditorProps {
  simulation: Simulation;
  clientId: string;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}

const SECTIONS = [
  { id: 'projet', label: 'Projet', icon: Home },
  { id: 'conception', label: 'Conception', icon: Settings },
  { id: 'conditions', label: 'Conditions', icon: Clock },
  { id: 'contraintes', label: 'Contraintes', icon: AlertTriangle },
  { id: 'pieces', label: 'Pièces', icon: DoorOpen },
] as const;

type SectionId = typeof SECTIONS[number]['id'];

const propertyTypeOptions = [
  { value: 'appartement', label: 'Appartement' },
  { value: 'maison', label: 'Maison' },
];

const constructionPeriodOptions = [
  { value: 'avant-1949', label: 'Avant 1949' },
  { value: '1949-1974', label: '1949-1974' },
  { value: '1975-1999', label: '1975-1999' },
  { value: 'apres-2000', label: 'Après 2000' },
  { value: 'ne-sais-pas', label: 'Ne sait pas' },
];

const projectTypeOptions = [
  { value: 'dpe', label: 'Amélioration DPE' },
  { value: 'confort', label: 'Travaux de confort' },
  { value: 'esthetique', label: 'Projet esthétique' },
  { value: 'global', label: 'Rénovation globale' },
  { value: 'valorisation', label: 'Valorisation immobilière' },
  { value: 'remise-etat', label: 'Remise en état' },
];

const projectContextOptions = [
  { value: 'residence-principale', label: 'Résidence principale' },
  { value: 'residence-secondaire', label: 'Résidence secondaire' },
  { value: 'location', label: 'Mise en location' },
  { value: 'revente', label: 'Préparation revente' },
];

const yesNoOptions = [
  { value: 'oui', label: 'Oui' },
  { value: 'non', label: 'Non' },
  { value: 'en-reflexion', label: 'En réflexion' },
];

const constraintOptions = [
  'Copropriété',
  'Syndic',
  'Voisinage',
  'Accessibilité',
  'Bâtiment classé',
  'Permis de construire',
  'PLU restrictif',
];

const startDateOptions = [
  { value: 'asap', label: 'Dès que possible' },
  { value: 'from-date', label: 'À partir d\'une date' },
  { value: 'flexible', label: 'Flexible' },
];

const roomTypeLabels: Record<string, string> = {
  'cuisine': 'Cuisine',
  'salle-de-bain': 'Salle de bain',
  'wc': 'WC',
  'salon-sejour': 'Salon / Séjour',
  'chambre': 'Chambre',
  'entree-couloir': 'Entrée / Couloir',
  'bureau': 'Bureau',
};

const SimulationEditor = ({ 
  simulation, 
  clientId, 
  clientName, 
  clientEmail, 
  clientPhone,
  open, 
  onOpenChange, 
  onSaved 
}: SimulationEditorProps) => {
  const [activeSection, setActiveSection] = useState<SectionId>('projet');
  const [saving, setSaving] = useState(false);
  const [formState, setFormState] = useState<Partial<Simulation>>({});
  const [editingRoom, setEditingRoom] = useState<any | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (open && simulation) {
      setFormState({
        property_type: simulation.property_type,
        surface: simulation.surface,
        construction_period: simulation.construction_period,
        city: simulation.city,
        has_architect: simulation.has_architect,
        modify_layout: simulation.modify_layout,
        project_types: simulation.project_types || [],
        project_contexts: simulation.project_contexts || [],
        has_dpe: simulation.has_dpe,
        occupy_during_works: simulation.occupy_during_works,
        constraints: simulation.constraints || [],
        constraint_details: simulation.constraint_details,
        start_date: simulation.start_date,
        start_date_value: simulation.start_date_value,
        end_date_max: simulation.end_date_max,
        selected_rooms: simulation.selected_rooms || [],
        isolation_data: simulation.isolation_data || {},
      });
      setActiveSection('projet');
    }
  }, [open, simulation]);

  const updateField = (field: keyof Simulation, value: any) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: 'project_types' | 'project_contexts' | 'constraints', value: string) => {
    const current = (formState[field] as string[]) || [];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    updateField(field, updated);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Update simulation in database
      const { error: updateError } = await supabase
        .from('renovation_simulations')
        .update({
          property_type: formState.property_type,
          surface: formState.surface,
          construction_period: formState.construction_period,
          city: formState.city,
          has_architect: formState.has_architect,
          modify_layout: formState.modify_layout,
          project_types: formState.project_types,
          project_contexts: formState.project_contexts,
          has_dpe: formState.has_dpe,
          occupy_during_works: formState.occupy_during_works,
          constraints: formState.constraints,
          constraint_details: formState.constraint_details,
          start_date: formState.start_date,
          start_date_value: formState.start_date_value,
          end_date_max: formState.end_date_max,
          selected_rooms: formState.selected_rooms,
          isolation_data: formState.isolation_data,
        })
        .eq('id', simulation.id);

      if (updateError) throw updateError;

      // Auto-regenerate PDF
      const pdfData = {
        leadData: {
          name: clientName || 'Client',
          email: clientEmail || '',
          phone: clientPhone || '',
          address: '',
          postalCode: '',
          city: formState.city || '',
          surface: formState.surface || '',
          budget: '',
          timeline: formState.start_date || '',
          message: '',
        },
        formData: {
          propertyType: formState.property_type || '',
          surface: formState.surface || '',
          constructionPeriod: formState.construction_period || '',
          city: formState.city || '',
          hasArchitect: formState.has_architect || '',
          modifyLayout: formState.modify_layout || '',
          projectTypes: formState.project_types || [],
          projectContexts: formState.project_contexts || [],
          hasDPE: formState.has_dpe || '',
          occupyDuringWorks: formState.occupy_during_works || '',
          constraints: formState.constraints || [],
          constraintDetails: formState.constraint_details || '',
          startDate: formState.start_date || '',
          startDateValue: formState.start_date_value || '',
          endDateMax: formState.end_date_max || '',
          selectedRooms: formState.selected_rooms || [],
          isolation: formState.isolation_data || {},
          inspirationImages: [],
          needsGlobalPainting: 'non',
          globalPainting: null,
          needsGlobalFlooring: 'non',
          globalFlooring: null,
          needsGlobalElectricity: 'non',
          globalElectricity: null,
          needsGlobalMouldings: 'non',
          globalMouldings: null,
          needsGlobalFurniture: 'non',
          globalFurniture: null,
        },
      };

      // Upload regenerated PDF
      await uploadSimulationPDF(clientId, pdfData as any);

      toast({
        title: "Simulation mise à jour",
        description: "Les modifications ont été enregistrées et le PDF a été régénéré.",
      });

      onSaved();
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving simulation:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer les modifications.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const renderBreadcrumbs = () => (
    <nav className="flex items-center gap-1 overflow-x-auto pb-2 border-b border-border mb-4">
      {SECTIONS.map((section, index) => {
        const Icon = section.icon;
        const isActive = activeSection === section.id;
        return (
          <div key={section.id} className="flex items-center">
            {index > 0 && <ChevronRight className="w-4 h-4 text-muted-foreground mx-1" />}
            <button
              onClick={() => setActiveSection(section.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-colors whitespace-nowrap",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-4 h-4" />
              {section.label}
            </button>
          </div>
        );
      })}
    </nav>
  );

  const renderProjetSection = () => (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Type de bien</Label>
          <Select
            value={formState.property_type || ''}
            onValueChange={(v) => updateField('property_type', v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner..." />
            </SelectTrigger>
            <SelectContent>
              {propertyTypeOptions.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Surface (m²)</Label>
          <Input
            type="text"
            value={formState.surface || ''}
            onChange={(e) => updateField('surface', e.target.value)}
            placeholder="Ex: 75"
          />
        </div>
        <div className="space-y-2">
          <Label>Ville</Label>
          <Input
            type="text"
            value={formState.city || ''}
            onChange={(e) => updateField('city', e.target.value)}
            placeholder="Ex: Paris"
          />
        </div>
        <div className="space-y-2">
          <Label>Période de construction</Label>
          <Select
            value={formState.construction_period || ''}
            onValueChange={(v) => updateField('construction_period', v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner..." />
            </SelectTrigger>
            <SelectContent>
              {constructionPeriodOptions.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Types de projet</Label>
        <div className="flex flex-wrap gap-2">
          {projectTypeOptions.map(opt => (
            <Badge
              key={opt.value}
              variant={(formState.project_types || []).includes(opt.value) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleArrayItem('project_types', opt.value)}
            >
              {opt.label}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Contexte du projet</Label>
        <div className="flex flex-wrap gap-2">
          {projectContextOptions.map(opt => (
            <Badge
              key={opt.value}
              variant={(formState.project_contexts || []).includes(opt.value) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleArrayItem('project_contexts', opt.value)}
            >
              {opt.label}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );

  const renderConceptionSection = () => (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Architecte</Label>
          <Select
            value={formState.has_architect || ''}
            onValueChange={(v) => updateField('has_architect', v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner..." />
            </SelectTrigger>
            <SelectContent>
              {yesNoOptions.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Modifier l'agencement</Label>
          <Select
            value={formState.modify_layout || ''}
            onValueChange={(v) => updateField('modify_layout', v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="oui">Oui</SelectItem>
              <SelectItem value="non">Non</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>DPE disponible</Label>
          <Select
            value={formState.has_dpe || ''}
            onValueChange={(v) => updateField('has_dpe', v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="oui-transmis">Oui (transmis)</SelectItem>
              <SelectItem value="oui-obsolete">Oui (obsolète)</SelectItem>
              <SelectItem value="non">Non</SelectItem>
              <SelectItem value="ne-sais-pas">Ne sait pas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderConditionsSection = () => (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Occupation pendant les travaux</Label>
          <Select
            value={formState.occupy_during_works || ''}
            onValueChange={(v) => updateField('occupy_during_works', v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="oui">Oui, sur place</SelectItem>
              <SelectItem value="non">Non, logement vide</SelectItem>
              <SelectItem value="partiellement">Partiellement</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Date de démarrage</Label>
          <Select
            value={formState.start_date || ''}
            onValueChange={(v) => updateField('start_date', v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner..." />
            </SelectTrigger>
            <SelectContent>
              {startDateOptions.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {formState.start_date === 'from-date' && (
        <div className="space-y-2">
          <Label>Date souhaitée</Label>
          <Input
            type="date"
            value={formState.start_date_value || ''}
            onChange={(e) => updateField('start_date_value', e.target.value)}
          />
        </div>
      )}
      
      <div className="space-y-2">
        <Label>Date de fin impérative</Label>
        <Input
          type="date"
          value={formState.end_date_max || ''}
          onChange={(e) => updateField('end_date_max', e.target.value)}
        />
      </div>
    </div>
  );

  const renderContraintesSection = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Contraintes</Label>
        <div className="flex flex-wrap gap-2">
          {constraintOptions.map(constraint => (
            <Badge
              key={constraint}
              variant={(formState.constraints || []).includes(constraint) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleArrayItem('constraints', constraint)}
            >
              {constraint}
            </Badge>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Détails des contraintes</Label>
        <Textarea
          value={formState.constraint_details || ''}
          onChange={(e) => updateField('constraint_details', e.target.value)}
          placeholder="Précisez les contraintes particulières..."
          rows={4}
        />
      </div>
    </div>
  );

  const handleRoomSave = (updatedRoom: any) => {
    const rooms = [...(formState.selected_rooms || [])];
    const index = rooms.findIndex((r: any) => r.id === updatedRoom.id);
    if (index >= 0) {
      rooms[index] = updatedRoom;
      setFormState(prev => ({ ...prev, selected_rooms: rooms }));
    }
    setEditingRoom(null);
  };

  const addRoom = (type: string) => {
    const rooms = [...(formState.selected_rooms || [])];
    // Calculate instance number for this room type
    const sameTypeRooms = rooms.filter((r: any) => r.type === type);
    const instanceNumber = sameTypeRooms.length + 1;
    
    const newRoom = {
      id: `${type}-${Date.now()}`,
      type,
      instanceNumber,
      data: {},
    };
    
    rooms.push(newRoom);
    setFormState(prev => ({ ...prev, selected_rooms: rooms }));
  };

  const removeRoom = (roomId: string) => {
    const rooms = (formState.selected_rooms || []).filter((r: any) => r.id !== roomId);
    // Recalculate instance numbers for each type
    const reindexedRooms = rooms.map((room: any, index: number) => {
      const sameTypeBefore = rooms.slice(0, index).filter((r: any) => r.type === room.type);
      return { ...room, instanceNumber: sameTypeBefore.length + 1 };
    });
    setFormState(prev => ({ ...prev, selected_rooms: reindexedRooms }));
  };

  const roomTypes = [
    { type: 'cuisine', label: 'Cuisine', icon: CookingPot },
    { type: 'salle-de-bain', label: 'Salle de bain', icon: Bath },
    { type: 'wc', label: 'WC', icon: DoorOpen },
  ];

  const renderPiecesSection = () => {
    const rooms = formState.selected_rooms || [];
    
    // If editing a specific room, show the room editor
    if (editingRoom) {
      return (
        <RoomEditorPanel
          room={editingRoom}
          onSave={handleRoomSave}
          onCancel={() => setEditingRoom(null)}
        />
      );
    }
    
    return (
      <div className="space-y-6">
        {/* Add room buttons */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Ajouter une pièce</Label>
          <div className="flex flex-wrap gap-2">
            {roomTypes.map(({ type, label, icon: Icon }) => (
              <Button
                key={type}
                variant="outline"
                size="sm"
                onClick={() => addRoom(type)}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                <Icon className="w-4 h-4" />
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Room list */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Pièces configurées ({rooms.length})
          </Label>
          
          {rooms.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-3">
              {rooms.map((room: any, index: number) => {
                const roomType = roomTypes.find(r => r.type === room.type);
                const Icon = roomType?.icon || DoorOpen;
                
                return (
                  <div 
                    key={room.id || index}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors group"
                  >
                    <Icon className="w-5 h-5 text-primary" />
                    <span className="font-medium flex-1">
                      {roomTypeLabels[room.type] || room.type}
                      {room.instanceNumber > 1 ? ` ${room.instanceNumber}` : ''}
                    </span>
                    {room.data && Object.keys(room.data).length > 0 && (
                      <Badge variant="secondary" className="text-xs">Configurée</Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => setEditingRoom(room)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeRoom(room.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground border border-dashed border-border rounded-lg">
              <DoorOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Aucune pièce sélectionnée</p>
              <p className="text-xs mt-1">Utilisez les boutons ci-dessus pour ajouter des pièces</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'projet': return renderProjetSection();
      case 'conception': return renderConceptionSection();
      case 'conditions': return renderConditionsSection();
      case 'contraintes': return renderContraintesSection();
      case 'pieces': return renderPiecesSection();
      default: return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Modifier la simulation
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto">
          {renderBreadcrumbs()}
          {renderActiveSection()}
        </div>
        
        <div className="flex justify-end gap-3 pt-4 border-t border-border mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Enregistrer
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SimulationEditor;
