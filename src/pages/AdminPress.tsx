import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Star, 
  StarOff,
  Pencil,
  Save,
  X,
  GripVertical,
  Newspaper
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface PressMention {
  id: string;
  date: string | null;
  source: string;
  source_url: string | null;
  title: string;
  article_url: string;
  logo_url: string | null;
  featured: boolean;
  display_order: number | null;
  created_at: string;
}

const sourceOptions = [
  "Houzz",
  "Houzz UK",
  "Elle Déco",
  "Marie Claire Maison",
  "Huffington Post",
  "18h39",
  "LinkedIn",
  "Autre",
];

const AdminPress = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [mentions, setMentions] = useState<PressMention[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    source: "Houzz",
    source_url: "",
    title: "",
    article_url: "",
    date: "",
    featured: false,
    logo_url: "",
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

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
    fetchMentions();
  };

  const fetchMentions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("press_mentions")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les publications.",
        variant: "destructive",
      });
    } else {
      setMentions(data || []);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      source: "Houzz",
      source_url: "",
      title: "",
      article_url: "",
      date: "",
      featured: false,
      logo_url: "",
    });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.article_url || !formData.source) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }

    const mentionData = {
      source: formData.source,
      source_url: formData.source_url || null,
      title: formData.title,
      article_url: formData.article_url,
      date: formData.date || null,
      featured: formData.featured,
      logo_url: formData.logo_url || null,
      display_order: editingId ? undefined : (mentions.length + 1),
    };

    if (editingId) {
      const { error } = await supabase
        .from("press_mentions")
        .update(mentionData)
        .eq("id", editingId);

      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour la publication.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Succès",
          description: "Publication mise à jour.",
        });
        fetchMentions();
        resetForm();
        setIsAddDialogOpen(false);
      }
    } else {
      const { error } = await supabase
        .from("press_mentions")
        .insert([mentionData]);

      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible d'ajouter la publication.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Succès",
          description: "Publication ajoutée.",
        });
        fetchMentions();
        resetForm();
        setIsAddDialogOpen(false);
      }
    }
  };

  const handleEdit = (mention: PressMention) => {
    setFormData({
      source: mention.source,
      source_url: mention.source_url || "",
      title: mention.title,
      article_url: mention.article_url,
      date: mention.date || "",
      featured: mention.featured,
      logo_url: mention.logo_url || "",
    });
    setEditingId(mention.id);
    setIsAddDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("press_mentions")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la publication.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Succès",
        description: "Publication supprimée.",
      });
      fetchMentions();
    }
  };

  const toggleFeatured = async (id: string, currentFeatured: boolean) => {
    const { error } = await supabase
      .from("press_mentions")
      .update({ featured: !currentFeatured })
      .eq("id", id);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut.",
        variant: "destructive",
      });
    } else {
      fetchMentions();
    }
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
        <title>Publications Presse | Administration QualiRénovation</title>
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
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-pink-500/10">
                  <Newspaper className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-foreground">Publications Presse</h1>
                  <p className="text-sm text-muted-foreground">{mentions.length} publications</p>
                </div>
              </div>
            </div>
            
            <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
              setIsAddDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>
                    {editingId ? "Modifier la publication" : "Nouvelle publication"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingId 
                      ? "Modifiez les informations de cette publication presse."
                      : "Ajoutez une nouvelle mention presse à afficher sur le site."
                    }
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="source">Source *</Label>
                      <select
                        id="source"
                        value={formData.source}
                        onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        {sourceOptions.map((source) => (
                          <option key={source} value={source}>{source}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date">Date (ex: Janvier 2025)</Label>
                      <Input
                        id="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        placeholder="Janvier 2025"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Titre de l'article *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Ex: 10 idées pour rénover votre cuisine"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="article_url">Lien de l'article *</Label>
                    <Input
                      id="article_url"
                      type="url"
                      value={formData.article_url}
                      onChange={(e) => setFormData({ ...formData, article_url: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="source_url">Site de la source</Label>
                    <Input
                      id="source_url"
                      type="url"
                      value={formData.source_url}
                      onChange={(e) => setFormData({ ...formData, source_url: e.target.value })}
                      placeholder="https://www.houzz.fr"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="logo_url">URL du logo (optionnel)</Label>
                    <Input
                      id="logo_url"
                      type="url"
                      value={formData.logo_url}
                      onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div>
                      <Label htmlFor="featured">Mettre en avant</Label>
                      <p className="text-xs text-muted-foreground">
                        Afficher dans le carrousel de la page d'accueil
                      </p>
                    </div>
                    <Switch
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setIsAddDialogOpen(false);
                        resetForm();
                      }}
                    >
                      Annuler
                    </Button>
                    <Button type="submit">
                      <Save className="w-4 h-4 mr-2" />
                      {editingId ? "Enregistrer" : "Ajouter"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        {/* Main content */}
        <main className="container mx-auto px-4 py-8">
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : mentions.length === 0 ? (
            <div className="text-center py-16">
              <Newspaper className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Aucune publication
              </h3>
              <p className="text-muted-foreground mb-6">
                Commencez par ajouter vos mentions presse.
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Ajouter une publication
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {mentions.map((mention, index) => (
                <div
                  key={mention.id}
                  className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg hover:border-primary/30 transition-colors"
                >
                  {/* Order indicator */}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <GripVertical className="w-4 h-4" />
                    <span className="text-sm w-6">{index + 1}</span>
                  </div>

                  {/* Featured star */}
                  <button
                    onClick={() => toggleFeatured(mention.id, mention.featured)}
                    className={`p-1.5 rounded-md transition-colors ${
                      mention.featured 
                        ? "text-gold hover:text-gold/80" 
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    title={mention.featured ? "Retirer de la une" : "Mettre à la une"}
                  >
                    {mention.featured ? (
                      <Star className="w-5 h-5 fill-current" />
                    ) : (
                      <StarOff className="w-5 h-5" />
                    )}
                  </button>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary">
                        {mention.source}
                      </span>
                      {mention.date && (
                        <span className="text-xs text-muted-foreground">
                          {mention.date}
                        </span>
                      )}
                    </div>
                    <h3 className="font-medium text-foreground truncate">
                      {mention.title}
                    </h3>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <a
                      href={mention.article_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-muted-foreground hover:text-primary transition-colors"
                      title="Voir l'article"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(mention)}
                      title="Modifier"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Supprimer cette publication ?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Cette action est irréversible. La publication sera définitivement supprimée.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(mention.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default AdminPress;
