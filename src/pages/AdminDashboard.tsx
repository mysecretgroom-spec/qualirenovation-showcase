import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Upload, MessageSquare, Link2, Eye, LogOut, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const adminSections = [
  {
    title: "Devis",
    description: "Gérer les demandes de devis reçues",
    href: "/admin/devis",
    icon: FileText,
    color: "bg-primary/10 text-primary",
  },
  {
    title: "Import Houzz",
    description: "Importer des projets et avis depuis Houzz",
    href: "/admin/import",
    icon: Upload,
    color: "bg-accent/20 text-accent",
  },
  {
    title: "Avis",
    description: "Gérer les témoignages clients",
    href: "/admin/avis",
    icon: MessageSquare,
    color: "bg-green-500/10 text-green-600",
  },
  {
    title: "Vérificateur de liens",
    description: "Vérifier les liens cassés du site",
    href: "/admin/liens",
    icon: Link2,
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    title: "Tests visuels",
    description: "Tester l'affichage des composants",
    href: "/admin/visual",
    icon: Eye,
    color: "bg-purple-500/10 text-purple-600",
  },
];

const AdminDashboard = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      setUserEmail(session.user.email || "");

      // Check if user has admin role
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
    };

    checkAuth();
  }, [navigate, toast]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
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
        <title>Administration | QualiRénovation</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Administration</h1>
                <p className="text-sm text-muted-foreground">{userEmail}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/">
                <Button variant="outline" size="sm">
                  Voir le site
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                Tableau de bord
              </h2>
              <p className="text-muted-foreground">
                Sélectionnez une section pour gérer votre site
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {adminSections.map((section) => (
                <Link
                  key={section.href}
                  to={section.href}
                  className="group p-6 rounded-lg border border-border bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-200"
                >
                  <div className={`w-12 h-12 rounded-lg ${section.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <section.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {section.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {section.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;
