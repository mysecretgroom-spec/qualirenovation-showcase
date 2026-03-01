import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Trash2 } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

type PartnerRequest = {
  id: string;
  profile_type: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string | null;
  message: string | null;
  status: string;
  notes: string | null;
  created_at: string;
};

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-yellow-100 text-yellow-800",
  accepted: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

const statusLabels: Record<string, string> = {
  new: "Nouveau",
  contacted: "Contacté",
  accepted: "Accepté",
  rejected: "Refusé",
};

const profileLabels: Record<string, string> = {
  "sous-traitant": "Sous-traitant",
  installateur: "Installateur",
  marque: "Marque / Site",
};

const AdminPartners = () => {
  const { isAdmin, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const [editingNotes, setEditingNotes] = useState<Record<string, string>>({});

  const { data: partners = [], isLoading } = useQuery({
    queryKey: ["partner-requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("partner_requests" as any)
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as unknown as PartnerRequest[];
    },
    enabled: isAdmin,
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<PartnerRequest> }) => {
      const { error } = await supabase
        .from("partner_requests" as any)
        .update(updates as any)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partner-requests"] });
      toast.success("Mis à jour");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("partner_requests" as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partner-requests"] });
      toast.success("Supprimé");
    },
  });

  if (authLoading) return <div className="flex items-center justify-center min-h-screen">Chargement...</div>;
  if (!isAdmin) return <Navigate to="/auth" />;

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/admin">
            <Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Demandes partenaires</h1>
            <p className="text-muted-foreground text-sm">{partners.length} demande(s)</p>
          </div>
        </div>

        {isLoading ? (
          <p className="text-muted-foreground">Chargement...</p>
        ) : partners.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">Aucune demande pour le moment.</p>
        ) : (
          <div className="space-y-4">
            {partners.map((p) => (
              <div key={p.id} className="bg-card rounded-lg shadow-sm border p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{p.company_name}</h3>
                      <Badge variant="outline">{profileLabels[p.profile_type] || p.profile_type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {p.contact_name} · {p.email} {p.phone && `· ${p.phone}`}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(p.created_at), "d MMM yyyy 'à' HH:mm", { locale: fr })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select
                      value={p.status}
                      onValueChange={(val) => updateMutation.mutate({ id: p.id, updates: { status: val } })}
                    >
                      <SelectTrigger className="w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(statusLabels).map(([k, v]) => (
                          <SelectItem key={k} value={k}>{v}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => {
                        if (confirm("Supprimer cette demande ?")) deleteMutation.mutate(p.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {p.message && (
                  <p className="text-sm text-foreground bg-secondary/50 rounded p-3 mb-3">{p.message}</p>
                )}

                <div className="flex gap-2 items-end">
                  <Textarea
                    placeholder="Notes internes..."
                    className="text-sm"
                    rows={2}
                    value={editingNotes[p.id] ?? p.notes ?? ""}
                    onChange={(e) => setEditingNotes({ ...editingNotes, [p.id]: e.target.value })}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={editingNotes[p.id] === undefined || editingNotes[p.id] === (p.notes ?? "")}
                    onClick={() => {
                      updateMutation.mutate({ id: p.id, updates: { notes: editingNotes[p.id] } });
                    }}
                  >
                    Sauver
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPartners;
