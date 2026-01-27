import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  LogOut, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Euro,
  Ruler,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowLeft,
  RefreshCw,
  MessageCircle
} from "lucide-react";
import ProspectEmailDialog from "@/components/admin/ProspectEmailDialog";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface QuoteRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string | null;
  postal_code: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  surface: string;
  budget: string;
  timeline: string;
  message: string;
  status: string;
  created_at: string;
}

// Mapbox token for static maps
const MAPBOX_TOKEN = 'pk.eyJ1IjoibWFwcHlxdWFsaXJlbm92IiwiYSI6ImNtanQ3aThpbzFxamozZHNkYWZ2Mmo3dnMifQ.91-sJuk41-nRTKs0OGYDfQ';

function getStaticMapUrl(lat: number, lng: number, zoom = 14, width = 300, height = 150): string {
  const marker = `pin-l-building+c9a961(${lng},${lat})`;
  return `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/${marker}/${lng},${lat},${zoom},0/${width}x${height}@2x?access_token=${MAPBOX_TOKEN}`;
}

const budgetLabels: Record<string, string> = {
  "2000-10000": "2 000 € - 10 000 €",
  "10000-30000": "10 000 € - 30 000 €",
  "30000-50000": "30 000 € - 50 000 €",
  "50000-100000": "50 000 € - 100 000 €",
  "100000-200000": "100 000 € - 200 000 €",
  "200000+": "> 200 000 €",
};

const timelineLabels: Record<string, string> = {
  "urgent": "Dès que possible",
  "1-month": "Dans le mois",
  "1-3-months": "1 à 3 mois",
  "3-6-months": "3 à 6 mois",
  "6-months+": "> 6 mois",
  "undetermined": "Non déterminé",
};

const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle }> = {
  pending: { label: "En attente", color: "bg-yellow-100 text-yellow-800", icon: AlertCircle },
  contacted: { label: "Contacté", color: "bg-blue-100 text-blue-800", icon: Clock },
  quoted: { label: "Devis envoyé", color: "bg-purple-100 text-purple-800", icon: Euro },
  accepted: { label: "Accepté", color: "bg-green-100 text-green-800", icon: CheckCircle },
  rejected: { label: "Refusé", color: "bg-red-100 text-red-800", icon: XCircle },
};

const AdminQuotes = () => {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
  const { user, isAdmin, loading: authLoading, adminLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const openEmailDialog = (quote: QuoteRequest) => {
    setSelectedQuote(quote);
    setEmailDialogOpen(true);
  };

  useEffect(() => {
    // Wait for both auth and admin check to complete
    if (!authLoading && !adminLoading) {
      if (!user) {
        navigate("/auth");
      } else if (!isAdmin) {
        console.log("[AdminQuotes] Access denied - isAdmin:", isAdmin);
        toast({
          title: "Accès refusé",
          description: "Vous n'avez pas les droits d'administration.",
          variant: "destructive",
        });
        navigate("/");
      }
    }
  }, [user, isAdmin, authLoading, adminLoading, navigate, toast]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchQuotes();
    }
  }, [user, isAdmin]);

  const fetchQuotes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("quote_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching quotes:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les demandes de devis.",
        variant: "destructive",
      });
    } else {
      setQuotes(data || []);
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    const { error } = await supabase
      .from("quote_requests")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut.",
        variant: "destructive",
      });
    } else {
      setQuotes(quotes.map(q => q.id === id ? { ...q, status: newStatus } : q));
      toast({
        title: "Statut mis à jour",
        description: `Demande passée en "${statusConfig[newStatus]?.label || newStatus}"`,
      });
    }
    setUpdatingId(null);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const filteredQuotes = statusFilter === "all" 
    ? quotes 
    : quotes.filter(q => q.status === statusFilter);

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <h1 className="font-display text-xl font-semibold text-foreground">
              Demandes de devis
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={fetchQuotes}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualiser
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters & Stats */}
        <div className="bg-card p-6 rounded-sm shadow-card mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div>
                <span className="text-3xl font-display font-semibold text-foreground">
                  {quotes.length}
                </span>
                <span className="text-muted-foreground ml-2">demandes au total</span>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="flex gap-3">
                {Object.entries(statusConfig).map(([key, { label, color }]) => {
                  const count = quotes.filter(q => q.status === key).length;
                  return (
                    <span key={key} className={`px-3 py-1 rounded-full text-xs font-medium ${color}`}>
                      {count} {label.toLowerCase()}
                    </span>
                  );
                })}
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent className="bg-card">
                <SelectItem value="all">Tous les statuts</SelectItem>
                {Object.entries(statusConfig).map(([key, { label }]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Quotes List */}
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Chargement...</div>
        ) : filteredQuotes.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            Aucune demande de devis pour le moment.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredQuotes.map((quote) => {
              const StatusIcon = statusConfig[quote.status]?.icon || AlertCircle;
              return (
                <div key={quote.id} className="bg-card p-6 rounded-sm shadow-card">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="font-display text-lg font-semibold text-foreground">
                        {quote.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Reçue le {format(new Date(quote.created_at), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${statusConfig[quote.status]?.color || 'bg-gray-100 text-gray-800'}`}>
                        <StatusIcon className="w-4 h-4" />
                        {statusConfig[quote.status]?.label || quote.status}
                      </span>
                      <Select 
                        value={quote.status} 
                        onValueChange={(value) => updateStatus(quote.id, value)}
                        disabled={updatingId === quote.id}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-card">
                          {Object.entries(statusConfig).map(([key, { label }]) => (
                            <SelectItem key={key} value={key}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-accent" />
                      <a href={`mailto:${quote.email}`} className="hover:text-accent">
                        {quote.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-accent" />
                      <a href={`tel:${quote.phone}`} className="hover:text-accent">
                        {quote.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-accent" />
                      <span>
                        {[quote.postal_code, quote.city].filter(Boolean).join(' ') || quote.city || 'Non renseigné'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Ruler className="w-4 h-4 text-accent" />
                      <span>{quote.surface} m²</span>
                    </div>
                  </div>

                  {/* Adresse complète */}
                  {quote.address && (
                    <div className="flex items-start gap-2 text-sm mb-4">
                      <MapPin className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{quote.address}</span>
                    </div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Euro className="w-4 h-4 text-accent" />
                      <span className="font-medium">{budgetLabels[quote.budget] || quote.budget}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-accent" />
                      <span>{timelineLabels[quote.timeline] || quote.timeline}</span>
                    </div>
                  </div>

                  {/* Mini-map si coordonnées disponibles */}
                  {quote.latitude && quote.longitude && (
                    <div className="mb-4">
                      <a 
                        href={`https://www.google.com/maps?q=${quote.latitude},${quote.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block overflow-hidden rounded-sm border border-border hover:border-accent transition-colors"
                      >
                        <img 
                          src={getStaticMapUrl(quote.latitude, quote.longitude, 15, 600, 200)}
                          alt="Carte du chantier"
                          className="w-full h-auto"
                          loading="lazy"
                        />
                      </a>
                      <p className="text-xs text-muted-foreground mt-1 text-center">
                        Cliquez pour ouvrir dans Google Maps
                      </p>
                    </div>
                  )}

                  <div className="bg-secondary p-4 rounded-sm">
                    <p className="text-sm text-foreground whitespace-pre-wrap">{quote.message}</p>
                  </div>

                  {/* Action buttons */}
                  <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEmailDialog(quote)}
                      className="flex items-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Discussion prospect
                    </Button>
                    <a
                      href={`mailto:${quote.email}`}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-border rounded-sm hover:bg-secondary transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      Email direct
                    </a>
                    <a
                      href={`tel:${quote.phone}`}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-border rounded-sm hover:bg-secondary transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      Appeler
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Prospect Email Dialog */}
      <ProspectEmailDialog
        open={emailDialogOpen}
        onOpenChange={setEmailDialogOpen}
        quote={selectedQuote}
        onEmailSent={fetchQuotes}
      />
    </div>
  );
};

export default AdminQuotes;
