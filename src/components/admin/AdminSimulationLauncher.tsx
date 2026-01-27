import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, User, Play, MapPin, Ruler } from "lucide-react";

interface Client {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  surface: string | null;
  quote_request_id: string | null;
}

interface AdminSimulationLauncherProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedClient?: Client | null;
}

const AdminSimulationLauncher = ({ 
  open, 
  onOpenChange, 
  preselectedClient 
}: AdminSimulationLauncherProps) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(preselectedClient || null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchClients = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("clients")
      .select("id, name, email, phone, address, city, postal_code, surface, quote_request_id")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Error fetching clients:", error);
    } else {
      setClients(data || []);
    }
    setLoading(false);
  };

  const handleOpen = (isOpen: boolean) => {
    if (isOpen && !preselectedClient) {
      fetchClients();
    }
    if (isOpen && preselectedClient) {
      setSelectedClient(preselectedClient);
    }
    onOpenChange(isOpen);
  };

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.city?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const launchSimulation = () => {
    if (!selectedClient) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un client.",
        variant: "destructive",
      });
      return;
    }

    // Store client data in sessionStorage for the simulation form
    sessionStorage.setItem('admin_simulation_client', JSON.stringify({
      clientId: selectedClient.id,
      quoteRequestId: selectedClient.quote_request_id,
      name: selectedClient.name,
      email: selectedClient.email || '',
      phone: selectedClient.phone || '',
      address: selectedClient.address || '',
      city: selectedClient.city || '',
      postalCode: selectedClient.postal_code || '',
      surface: selectedClient.surface || '',
    }));

    onOpenChange(false);
    
    // Navigate to renovation form in admin mode
    navigate('/renovation-complete?admin=true');
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Play className="w-5 h-5 text-primary" />
            Lancer une simulation de projet
          </DialogTitle>
          <DialogDescription>
            Sélectionnez un client pour configurer son projet de rénovation
          </DialogDescription>
        </DialogHeader>

        {preselectedClient ? (
          <div className="space-y-4">
            <div className="p-4 rounded-lg border border-primary bg-primary/5">
              <div className="flex items-center gap-3">
                <User className="w-8 h-8 text-primary" />
                <div className="flex-1">
                  <h4 className="font-semibold">{preselectedClient.name}</h4>
                  <p className="text-sm text-muted-foreground">{preselectedClient.email}</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
                {preselectedClient.city && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {preselectedClient.postal_code} {preselectedClient.city}
                  </span>
                )}
                {preselectedClient.surface && (
                  <span className="flex items-center gap-1">
                    <Ruler className="w-4 h-4" />
                    {preselectedClient.surface} m²
                  </span>
                )}
              </div>
            </div>

            <Button onClick={launchSimulation} className="w-full" size="lg">
              <Play className="w-4 h-4 mr-2" />
              Lancer la simulation
            </Button>
          </div>
        ) : (
          <>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un client..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 py-2">
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Chargement...
                </div>
              ) : filteredClients.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Aucun client trouvé
                </div>
              ) : (
                filteredClients.map((client) => (
                  <div
                    key={client.id}
                    onClick={() => setSelectedClient(client)}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedClient?.id === client.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{client.name}</h4>
                        <p className="text-sm text-muted-foreground">{client.email}</p>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        {client.city && <div>{client.city}</div>}
                        {client.surface && <div>{client.surface} m²</div>}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-4 border-t border-border flex justify-end gap-3">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button onClick={launchSimulation} disabled={!selectedClient}>
                <Play className="w-4 h-4 mr-2" />
                Lancer la simulation
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AdminSimulationLauncher;
