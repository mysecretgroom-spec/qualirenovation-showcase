import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Star, Eye, EyeOff, ArrowLeft, MessageSquare, Download, Loader2 } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { toast } from "sonner";

const AdminTestimonials = () => {
  const { user, isAdmin, loading, adminLoading } = useAuth();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<"all" | "visible" | "hidden">("all");
  const [isImporting, setIsImporting] = useState(false);

  const { data: testimonials, isLoading } = useQuery({
    queryKey: ["admin-testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("houzz_testimonials")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user && isAdmin,
  });

  const toggleVisibilityMutation = useMutation({
    mutationFn: async ({ id, hidden }: { id: string; hidden: boolean }) => {
      const { error } = await supabase
        .from("houzz_testimonials")
        .update({ hidden })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] });
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      toast.success("Avis mis à jour");
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour");
    },
  });

  const handleImportTestimonials = async () => {
    setIsImporting(true);
    toast.info("Import des avis en cours...");

    try {
      const { data, error } = await supabase.functions.invoke("import-houzz", {
        body: { action: "import-testimonials" },
      });

      if (error) throw error;

      if (data.success) {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] });
        queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      } else {
        toast.error(data.error || "Erreur lors de l'import");
      }
    } catch (err: any) {
      console.error("Import error:", err);
      toast.error(err.message || "Erreur lors de l'import");
    } finally {
      setIsImporting(false);
    }
  };

  if (loading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const filteredTestimonials = testimonials?.filter((t) => {
    if (filter === "visible") return !t.hidden;
    if (filter === "hidden") return t.hidden;
    return true;
  });

  const visibleCount = testimonials?.filter((t) => !t.hidden).length || 0;
  const hiddenCount = testimonials?.filter((t) => t.hidden).length || 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-4">
        <div className="container-tight flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="hover:opacity-80 transition-opacity">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-display font-semibold">Gestion des avis</h1>
          </div>
          <nav className="flex gap-4">
            <Link to="/admin/import" className="text-sm hover:underline">
              Import
            </Link>
            <Link to="/admin/devis" className="text-sm hover:underline">
              Devis
            </Link>
          </nav>
        </div>
      </header>

      <main className="container-tight py-8">
        {/* Import Button */}
        <div className="mb-6">
          <Button
            onClick={handleImportTestimonials}
            disabled={isImporting}
            className="w-full sm:w-auto"
          >
            {isImporting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Import en cours...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Importer les avis depuis Houzz
              </>
            )}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card
            className={`cursor-pointer transition-all ${filter === "all" ? "ring-2 ring-primary" : ""}`}
            onClick={() => setFilter("all")}
          >
            <CardContent className="pt-6 text-center">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-2xl font-bold">{testimonials?.length || 0}</p>
              <p className="text-sm text-muted-foreground">Total</p>
            </CardContent>
          </Card>
          <Card
            className={`cursor-pointer transition-all ${filter === "visible" ? "ring-2 ring-primary" : ""}`}
            onClick={() => setFilter("visible")}
          >
            <CardContent className="pt-6 text-center">
              <Eye className="w-8 h-8 mx-auto mb-2 text-accent" />
              <p className="text-2xl font-bold">{visibleCount}</p>
              <p className="text-sm text-muted-foreground">Visibles</p>
            </CardContent>
          </Card>
          <Card
            className={`cursor-pointer transition-all ${filter === "hidden" ? "ring-2 ring-primary" : ""}`}
            onClick={() => setFilter("hidden")}
          >
            <CardContent className="pt-6 text-center">
              <EyeOff className="w-8 h-8 mx-auto mb-2 text-destructive" />
              <p className="text-2xl font-bold">{hiddenCount}</p>
              <p className="text-sm text-muted-foreground">Masqués</p>
            </CardContent>
          </Card>
        </div>

        {/* Testimonials List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredTestimonials?.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Aucun avis trouvé
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredTestimonials?.map((testimonial) => (
              <Card
                key={testimonial.id}
                className={`transition-all ${testimonial.hidden ? "opacity-60" : ""}`}
              >
                <CardContent className="py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-semibold text-foreground">{testimonial.name}</p>
                        <div className="flex">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                          ))}
                        </div>
                        {testimonial.hidden && (
                          <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded">
                            Masqué
                          </span>
                        )}
                      </div>
                      {testimonial.project_type && (
                        <p className="text-xs text-muted-foreground mb-2">
                          {testimonial.project_type} • {testimonial.date}
                        </p>
                      )}
                      <p className="text-sm text-foreground line-clamp-3">{testimonial.text}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {testimonial.hidden ? "Masqué" : "Visible"}
                      </span>
                      <Switch
                        checked={!testimonial.hidden}
                        onCheckedChange={(checked) =>
                          toggleVisibilityMutation.mutate({
                            id: testimonial.id,
                            hidden: !checked,
                          })
                        }
                        disabled={toggleVisibilityMutation.isPending}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminTestimonials;
