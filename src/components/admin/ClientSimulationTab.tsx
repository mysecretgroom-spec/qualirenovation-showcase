import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  FileText, Home, Calendar, MapPin, Ruler, 
  ChevronDown, ChevronRight, Bath, CookingPot, 
  Bed, Sofa, DoorOpen, Briefcase, Palette
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";

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

interface ClientSimulationTabProps {
  clientId: string;
  quoteRequestId: string | null;
}

const roomTypeLabels: Record<string, { label: string; icon: React.ComponentType<any> }> = {
  'cuisine': { label: 'Cuisine', icon: CookingPot },
  'salle-de-bain': { label: 'Salle de bain', icon: Bath },
  'wc': { label: 'WC', icon: DoorOpen },
  'salon-sejour': { label: 'Salon / Séjour', icon: Sofa },
  'chambre': { label: 'Chambre', icon: Bed },
  'entree-couloir': { label: 'Entrée / Couloir', icon: DoorOpen },
  'dressing-rangements': { label: 'Dressing / Rangements', icon: DoorOpen },
  'bureau': { label: 'Bureau', icon: Briefcase },
  'autre': { label: 'Autre pièce', icon: Palette },
};

const projectTypeLabels: Record<string, string> = {
  'renovation-complete': 'Rénovation complète',
  'renovation-partielle': 'Rénovation partielle',
  'extension': 'Extension',
  'amenagement': 'Aménagement',
  'dpe': 'Amélioration DPE',
};

const constructionPeriodLabels: Record<string, string> = {
  'avant-1949': 'Avant 1949',
  '1949-1974': '1949-1974',
  '1975-1999': '1975-1999',
  'apres-2000': 'Après 2000',
  'ne-sais-pas': 'Ne sait pas',
};

const ClientSimulationTab = ({ clientId, quoteRequestId }: ClientSimulationTabProps) => {
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRooms, setExpandedRooms] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchSimulations = async () => {
      setLoading(true);
      
      // Fetch simulations by client_id OR quote_request_id
      let query = supabase
        .from("renovation_simulations")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (quoteRequestId) {
        query = query.or(`client_id.eq.${clientId},quote_request_id.eq.${quoteRequestId}`);
      } else {
        query = query.eq("client_id", clientId);
      }
      
      const { data, error } = await query;

      if (error) {
        console.error("Error fetching simulations:", error);
      } else {
        // Parse JSONB fields properly
        const parsedData = (data || []).map(sim => ({
          ...sim,
          selected_rooms: Array.isArray(sim.selected_rooms) ? sim.selected_rooms : [],
          isolation_data: typeof sim.isolation_data === 'object' ? sim.isolation_data : {},
        }));
        setSimulations(parsedData);
      }
      setLoading(false);
    };

    fetchSimulations();
  }, [clientId, quoteRequestId]);

  const toggleRoom = (roomId: string) => {
    setExpandedRooms(prev => ({ ...prev, [roomId]: !prev[roomId] }));
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (simulations.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Aucune simulation de rénovation</p>
        <p className="text-sm text-muted-foreground mt-1">
          Le client n'a pas encore rempli de formulaire de configuration détaillée.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {simulations.map((simulation) => (
        <div key={simulation.id} className="border border-border rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-muted/50 px-4 py-3 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                <span className="font-medium">Simulation du {new Date(simulation.created_at).toLocaleDateString("fr-FR")}</span>
              </div>
              <Badge variant="outline">
                {simulation.selected_rooms?.length || 0} pièce(s)
              </Badge>
            </div>
          </div>

          {/* Project Info */}
          <div className="p-4 space-y-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {simulation.property_type && (
                <div className="flex items-center gap-2 text-sm">
                  <Home className="w-4 h-4 text-muted-foreground" />
                  <span className="capitalize">{simulation.property_type}</span>
                </div>
              )}
              {simulation.surface && (
                <div className="flex items-center gap-2 text-sm">
                  <Ruler className="w-4 h-4 text-muted-foreground" />
                  <span>{simulation.surface} m²</span>
                </div>
              )}
              {simulation.city && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{simulation.city}</span>
                </div>
              )}
              {simulation.construction_period && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>{constructionPeriodLabels[simulation.construction_period] || simulation.construction_period}</span>
                </div>
              )}
            </div>

            {/* Project Types */}
            {simulation.project_types && simulation.project_types.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Types de projet</h4>
                <div className="flex flex-wrap gap-2">
                  {simulation.project_types.map((type) => (
                    <Badge key={type} variant="secondary">
                      {projectTypeLabels[type] || type}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Conception */}
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              {simulation.has_architect && (
                <div>
                  <span className="text-muted-foreground">Architecte : </span>
                  <span className="font-medium">
                    {simulation.has_architect === 'oui' ? 'Oui' : simulation.has_architect === 'non' ? 'Non' : 'En réflexion'}
                  </span>
                </div>
              )}
              {simulation.modify_layout && (
                <div>
                  <span className="text-muted-foreground">Modifier l'agencement : </span>
                  <span className="font-medium">
                    {simulation.modify_layout === 'oui' ? 'Oui' : 'Non'}
                  </span>
                </div>
              )}
              {simulation.occupy_during_works && (
                <div>
                  <span className="text-muted-foreground">Occuper pendant les travaux : </span>
                  <span className="font-medium capitalize">
                    {simulation.occupy_during_works}
                  </span>
                </div>
              )}
              {simulation.start_date && (
                <div>
                  <span className="text-muted-foreground">Démarrage : </span>
                  <span className="font-medium">
                    {simulation.start_date === 'asap' ? 'Dès que possible' : 
                     simulation.start_date === 'flexible' ? 'Flexible' :
                     simulation.start_date_value || 'Date à définir'}
                  </span>
                </div>
              )}
            </div>

            {/* Constraints */}
            {simulation.constraints && simulation.constraints.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Contraintes</h4>
                <div className="flex flex-wrap gap-2">
                  {simulation.constraints.map((constraint) => (
                    <Badge key={constraint} variant="outline" className="text-yellow-600 border-yellow-300 bg-yellow-50">
                      {constraint}
                    </Badge>
                  ))}
                </div>
                {simulation.constraint_details && (
                  <p className="text-sm text-muted-foreground mt-2">{simulation.constraint_details}</p>
                )}
              </div>
            )}

            {/* Rooms */}
            {simulation.selected_rooms && simulation.selected_rooms.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-3">Pièces à rénover</h4>
                <div className="space-y-2">
                  {simulation.selected_rooms.map((room: any) => {
                    const roomInfo = roomTypeLabels[room.type] || { label: room.type, icon: Palette };
                    const RoomIcon = roomInfo.icon;
                    const isExpanded = expandedRooms[room.id];
                    
                    return (
                      <Collapsible key={room.id} open={isExpanded} onOpenChange={() => toggleRoom(room.id)}>
                        <CollapsibleTrigger className="w-full">
                          <div className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                            <RoomIcon className="w-5 h-5 text-primary" />
                            <span className="font-medium flex-1 text-left">
                              {roomInfo.label} {room.instanceNumber > 1 ? room.instanceNumber : ''}
                            </span>
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-muted-foreground" />
                            )}
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="ml-8 p-3 border-l-2 border-muted mt-1">
                            <RoomDataDisplay roomType={room.type} data={room.data} />
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Isolation */}
            {simulation.isolation_data && simulation.isolation_data.wantIsolation && (
              <div className="pt-4 border-t border-border">
                <h4 className="text-sm font-medium mb-2">Isolation</h4>
                <div className="text-sm space-y-1">
                  <p>
                    <span className="text-muted-foreground">Souhaite isolation : </span>
                    <span className="font-medium">
                      {simulation.isolation_data.wantIsolation === 'oui' ? 'Oui' : 
                       simulation.isolation_data.wantIsolation === 'non' ? 'Non' : 'Ne sait pas'}
                    </span>
                  </p>
                  {simulation.isolation_data.zones && simulation.isolation_data.zones.length > 0 && (
                    <p>
                      <span className="text-muted-foreground">Zones : </span>
                      <span>{simulation.isolation_data.zones.join(', ')}</span>
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// Component to display room-specific data
const RoomDataDisplay = ({ roomType, data }: { roomType: string; data: any }) => {
  if (!data) return <p className="text-sm text-muted-foreground">Aucune donnée configurée</p>;

  const renderKeyValue = (label: string, value: any) => {
    if (!value || (Array.isArray(value) && value.length === 0)) return null;
    return (
      <div className="text-sm">
        <span className="text-muted-foreground">{label} : </span>
        <span>{Array.isArray(value) ? value.join(', ') : value}</span>
      </div>
    );
  };

  switch (roomType) {
    case 'salle-de-bain':
      const bathroom = data.bathroomData;
      if (!bathroom) return null;
      return (
        <div className="space-y-1">
          {renderKeyValue('Usage', bathroom.usage)}
          {renderKeyValue('Type', bathroom.bathroomType)}
          {renderKeyValue('Installation', bathroom.installationType)}
          {renderKeyValue('Type de receveur', bathroom.showerTrayType)}
          {renderKeyValue('Paroi de douche', bathroom.showerDoorType)}
          {renderKeyValue('Baignoire', bathroom.bathtubType)}
          {renderKeyValue('Meuble vasque', bathroom.vanityType)}
          {renderKeyValue('Style vasque', bathroom.sinkStyle)}
          {renderKeyValue('WC', bathroom.toiletType)}
          {renderKeyValue('Ambiance', bathroom.ambiance)}
          {renderKeyValue('Carrelage', bathroom.tileType)}
          {renderKeyValue('Format carrelage', bathroom.tileFormat)}
        </div>
      );

    case 'cuisine':
      const kitchen = data.kitchenData;
      if (!kitchen) return null;
      return (
        <div className="space-y-1">
          {renderKeyValue('Usage', kitchen.usage)}
          {renderKeyValue('Implantation', kitchen.layoutType)}
          {renderKeyValue('Type de meubles', kitchen.cabinetType)}
          {renderKeyValue('Finition façades', kitchen.facadeFinish)}
          {renderKeyValue('Plan de travail', kitchen.countertopMaterial)}
          {renderKeyValue('Crédence', kitchen.backsplashType)}
          {renderKeyValue('Carrelage crédence', kitchen.backsplashTileType)}
        </div>
      );

    case 'salon-sejour':
    case 'chambre':
    case 'entree-couloir':
    case 'bureau':
      return (
        <div className="space-y-2">
          {data.paintingData && (
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase mb-1">Peinture</p>
              {renderKeyValue('Surfaces', data.paintingData.surfaces)}
              {renderKeyValue('Intention', data.paintingData.intention)}
              {renderKeyValue('Finition', data.paintingData.finish)}
            </div>
          )}
          {data.flooringData && data.flooringData.floorType && (
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase mb-1">Sol</p>
              {renderKeyValue('Type', data.flooringData.floorType)}
              {renderKeyValue('Carrelage', data.flooringData.tileType)}
              {renderKeyValue('Pose parquet', data.flooringData.layingPattern)}
              {renderKeyValue('Essence', data.flooringData.woodType)}
            </div>
          )}
          {data.electricityData && data.electricityData.workType?.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase mb-1">Électricité</p>
              {renderKeyValue('Travaux', data.electricityData.workType)}
              {renderKeyValue('Style interrupteurs', data.electricityData.switchStyle)}
            </div>
          )}
        </div>
      );

    case 'dressing-rangements':
      const furniture = data.customFurnitureData;
      if (!furniture) return null;
      return (
        <div className="space-y-1">
          {renderKeyValue('Type de meuble', furniture.furnitureType)}
          {renderKeyValue('Approche', furniture.approach)}
          {renderKeyValue('Niveau d\'accompagnement', furniture.supportLevel)}
        </div>
      );

    default:
      const generic = data.genericRoomData;
      if (!generic) return null;
      return (
        <div className="space-y-1">
          {renderKeyValue('Description', generic.description)}
          {renderKeyValue('Types de travaux', generic.workTypes)}
        </div>
      );
  }
};

export default ClientSimulationTab;