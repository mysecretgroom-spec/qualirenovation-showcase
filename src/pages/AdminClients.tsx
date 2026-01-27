import { useEffect, useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { 
  ArrowLeft, Plus, Search, User, MapPin, Phone, Mail, 
  Calendar, FileText, MoreVertical, Trash2, Edit, ExternalLink, FolderOpen, Settings2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import ClientFiles from "@/components/ClientFiles";
import ClientSimulationTab from "@/components/admin/ClientSimulationTab";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AddressAutocomplete from "@/components/AddressAutocomplete";

interface Client {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  latitude: number | null;
  longitude: number | null;
  project_description: string | null;
  status: string;
  budget: string | null;
  surface: string | null;
  notes: string | null;
  quote_request_id: string | null;
  google_drive_folder_url: string | null;
  created_at: string;
  updated_at: string;
}

interface QuoteRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  latitude: number | null;
  longitude: number | null;
  budget: string;
  surface: string;
  message: string;
  status: string;
  created_at: string;
}

const statusOptions = [
  { value: "prospect", label: "Prospect", color: "bg-blue-500/10 text-blue-600" },
  { value: "devis_envoye", label: "Devis envoyé", color: "bg-yellow-500/10 text-yellow-600" },
  { value: "en_cours", label: "En cours", color: "bg-primary/10 text-primary" },
  { value: "termine", label: "Terminé", color: "bg-green-500/10 text-green-600" },
  { value: "annule", label: "Annulé", color: "bg-red-500/10 text-red-600" },
];

const emptyFormData = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  postal_code: "",
  latitude: undefined as number | undefined,
  longitude: undefined as number | undefined,
  project_description: "",
  status: "prospect",
  budget: "",
  surface: "",
  notes: "",
  quote_request_id: null as string | null,
};

const AdminClients = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFromQuoteModalOpen, setIsFromQuoteModalOpen] = useState(false);
  const [isFilesModalOpen, setIsFilesModalOpen] = useState(false);
  const [selectedClientForFiles, setSelectedClientForFiles] = useState<Client | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState(emptyFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data: hasRole } = await supabase.rpc("has_role", {
        _user_id: session.user.id,
        _role: "admin",
      });

      if (!hasRole) {
        toast({
          title: "Accès refusé",
          description: "Vous n'avez pas les droits d'administration.",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      setIsAdmin(true);
      fetchClients();
      fetchPendingQuotes();
      
      // Check if we should open quote modal from URL params
      const fromQuote = searchParams.get("from_quote");
      if (fromQuote) {
        setIsFromQuoteModalOpen(true);
      }
    };

    checkAuth();
  }, [navigate, toast, searchParams]);

  const fetchClients = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching clients:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les clients.",
        variant: "destructive",
      });
    } else {
      setClients(data || []);
    }
    setLoading(false);
  };

  const fetchPendingQuotes = async () => {
    const { data, error } = await supabase
      .from("quote_requests")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching quotes:", error);
    } else {
      setQuoteRequests(data || []);
    }
  };

  const handleAddressChange = (result: { address: string; latitude: number; longitude: number; city?: string; postalCode?: string } | null) => {
    if (result) {
      setFormData((prev) => ({
        ...prev,
        address: result.address,
        latitude: result.latitude !== 0 ? result.latitude : prev.latitude,
        longitude: result.longitude !== 0 ? result.longitude : prev.longitude,
        city: result.city || prev.city,
        postal_code: result.postalCode || prev.postal_code,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        address: "",
        latitude: undefined,
        longitude: undefined,
        city: "",
        postal_code: "",
      }));
    }
  };

  const openNewClientModal = () => {
    setEditingClient(null);
    setFormData(emptyFormData);
    setIsModalOpen(true);
  };

  const openEditModal = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      email: client.email || "",
      phone: client.phone || "",
      address: client.address || "",
      city: client.city || "",
      postal_code: client.postal_code || "",
      latitude: client.latitude || undefined,
      longitude: client.longitude || undefined,
      project_description: client.project_description || "",
      status: client.status,
      budget: client.budget || "",
      surface: client.surface || "",
      notes: client.notes || "",
      quote_request_id: client.quote_request_id,
    });
    setIsModalOpen(true);
  };

  const createFromQuote = (quote: QuoteRequest) => {
    setEditingClient(null);
    setFormData({
      name: quote.name,
      email: quote.email,
      phone: quote.phone,
      address: quote.address || "",
      city: quote.city || "",
      postal_code: quote.postal_code || "",
      latitude: quote.latitude || undefined,
      longitude: quote.longitude || undefined,
      project_description: quote.message,
      status: "prospect",
      budget: quote.budget,
      surface: quote.surface,
      notes: "",
      quote_request_id: quote.id,
    });
    setIsFromQuoteModalOpen(false);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom du client est obligatoire.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const clientData = {
      name: formData.name,
      email: formData.email || null,
      phone: formData.phone || null,
      address: formData.address || null,
      city: formData.city || null,
      postal_code: formData.postal_code || null,
      latitude: formData.latitude || null,
      longitude: formData.longitude || null,
      project_description: formData.project_description || null,
      status: formData.status,
      budget: formData.budget || null,
      surface: formData.surface || null,
      notes: formData.notes || null,
      quote_request_id: formData.quote_request_id,
    };

    let error;
    if (editingClient) {
      const { error: updateError } = await supabase
        .from("clients")
        .update(clientData)
        .eq("id", editingClient.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from("clients")
        .insert(clientData);
      error = insertError;

      // Update quote status if created from quote
      if (!error && formData.quote_request_id) {
        await supabase
          .from("quote_requests")
          .update({ status: "converted" })
          .eq("id", formData.quote_request_id);
      }
    }

    if (error) {
      console.error("Error saving client:", error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le client.",
        variant: "destructive",
      });
    } else {
      toast({
        title: editingClient ? "Client modifié" : "Client créé",
        description: editingClient 
          ? "Les informations ont été mises à jour."
          : "La fiche client a été créée avec succès.",
      });
      setIsModalOpen(false);
      fetchClients();
      fetchPendingQuotes();
    }

    setIsSubmitting(false);
  };

  const deleteClient = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) return;

    const { error } = await supabase.from("clients").delete().eq("id", id);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le client.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Client supprimé",
        description: "La fiche client a été supprimée.",
      });
      fetchClients();
    }
  };

  const filteredClients = clients.filter((client) => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (client.email?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (client.address?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (client.city?.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === "all" || client.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusOption = statusOptions.find(s => s.value === status);
    return statusOption || { label: status, color: "bg-muted text-muted-foreground" };
  };

  if (isAdmin === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Vérification des accès...</div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Gestion Clients | QualiRénovation</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/admin">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Gestion Clients</h1>
                <p className="text-sm text-muted-foreground">{clients.length} clients</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {quoteRequests.length > 0 && (
                <Button 
                  variant="outline" 
                  onClick={() => setIsFromQuoteModalOpen(true)}
                  className="relative"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Depuis un devis
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                    {quoteRequests.length}
                  </span>
                </Button>
              )}
              <Button onClick={openNewClientModal}>
                <Plus className="w-4 h-4 mr-2" />
                Nouveau client
              </Button>
            </div>
          </div>
        </header>

        {/* Filters */}
        <div className="container mx-auto px-4 py-4 border-b border-border bg-card/50">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un client..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                {statusOptions.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Client list */}
        <main className="container mx-auto px-4 py-6">
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Chargement...</div>
          ) : filteredClients.length === 0 ? (
            <div className="text-center py-12">
              <User className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchQuery || statusFilter !== "all" 
                  ? "Aucun client trouvé avec ces critères" 
                  : "Aucun client pour le moment"}
              </p>
              <Button className="mt-4" onClick={openNewClientModal}>
                <Plus className="w-4 h-4 mr-2" />
                Créer un client
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredClients.map((client) => {
                const statusBadge = getStatusBadge(client.status);
                return (
                  <div
                    key={client.id}
                    className="p-4 rounded-lg border border-border bg-card hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-foreground truncate">
                            {client.name}
                          </h3>
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusBadge.color}`}>
                            {statusBadge.label}
                          </span>
                        </div>
                        
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm">
                          {client.email && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Mail className="w-4 h-4 flex-shrink-0" />
                              <span className="truncate">{client.email}</span>
                            </div>
                          )}
                          {client.phone && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Phone className="w-4 h-4 flex-shrink-0" />
                              <span>{client.phone}</span>
                            </div>
                          )}
                          {(client.city || client.postal_code) && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <MapPin className="w-4 h-4 flex-shrink-0" />
                              <span className="truncate">
                                {client.postal_code} {client.city}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-4 h-4 flex-shrink-0" />
                            <span>
                              {new Date(client.created_at).toLocaleDateString("fr-FR")}
                            </span>
                          </div>
                        </div>

                        {client.project_description && (
                          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                            {client.project_description}
                          </p>
                        )}
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditModal(client)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setSelectedClientForFiles(client);
                            setIsFilesModalOpen(true);
                          }}>
                            <FolderOpen className="w-4 h-4 mr-2" />
                            Fiche client
                          </DropdownMenuItem>
                          {client.google_drive_folder_url && (
                            <DropdownMenuItem asChild>
                              <a href={client.google_drive_folder_url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Ouvrir Google Drive
                              </a>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => deleteClient(client.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Client form modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingClient ? "Modifier le client" : "Nouveau client"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Nom *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nom du client"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Statut</label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@exemple.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Téléphone</label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="06 12 34 56 78"
                />
              </div>
            </div>

            <AddressAutocomplete
              value={formData.address}
              onChange={handleAddressChange}
            />

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Code postal</label>
                <Input
                  value={formData.postal_code}
                  onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                  placeholder="75001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Ville</label>
                <Input
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Paris"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Surface (m²)</label>
                <Input
                  value={formData.surface}
                  onChange={(e) => setFormData({ ...formData, surface: e.target.value })}
                  placeholder="80"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Budget</label>
                <Input
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  placeholder="50 000 €"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Description du projet</label>
              <Textarea
                value={formData.project_description}
                onChange={(e) => setFormData({ ...formData, project_description: e.target.value })}
                placeholder="Décrivez le projet du client..."
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Notes internes</label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Notes privées sur ce client..."
                rows={2}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Enregistrement..." : (editingClient ? "Mettre à jour" : "Créer le client")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* From quote modal */}
      <Dialog open={isFromQuoteModalOpen} onOpenChange={setIsFromQuoteModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Créer un client depuis une demande de devis</DialogTitle>
          </DialogHeader>

          {quoteRequests.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Aucune demande de devis en attente
            </p>
          ) : (
            <div className="space-y-3">
              {quoteRequests.map((quote) => (
                <div
                  key={quote.id}
                  className="p-4 rounded-lg border border-border hover:border-primary/50 cursor-pointer transition-colors"
                  onClick={() => createFromQuote(quote)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{quote.name}</h4>
                      <p className="text-sm text-muted-foreground">{quote.email}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(quote.created_at).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                  {quote.address && (
                    <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {quote.postal_code} {quote.city}
                    </p>
                  )}
                  <p className="text-sm mt-2 line-clamp-2">{quote.message}</p>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Client detail modal with tabs */}
      <Dialog open={isFilesModalOpen} onOpenChange={setIsFilesModalOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Fiche client - {selectedClientForFiles?.name}
            </DialogTitle>
          </DialogHeader>

          {selectedClientForFiles && (
            <Tabs defaultValue="documents" className="flex-1 overflow-hidden flex flex-col">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="documents" className="gap-2">
                  <FolderOpen className="w-4 h-4" />
                  Documents
                </TabsTrigger>
                <TabsTrigger value="simulation" className="gap-2">
                  <Settings2 className="w-4 h-4" />
                  Simulation Client
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="documents" className="flex-1 overflow-y-auto mt-4">
                <ClientFiles 
                  clientId={selectedClientForFiles.id} 
                  clientName={selectedClientForFiles.name} 
                />
              </TabsContent>
              
              <TabsContent value="simulation" className="flex-1 overflow-y-auto mt-4">
                <ClientSimulationTab 
                  clientId={selectedClientForFiles.id}
                  quoteRequestId={selectedClientForFiles.quote_request_id}
                />
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminClients;
