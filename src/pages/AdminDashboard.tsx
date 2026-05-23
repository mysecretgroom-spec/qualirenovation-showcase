import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { 
  FileText, Upload, MessageSquare, Link2, Eye, 
  Users, Newspaper, Download, ChevronRight, RefreshCw, Handshake, TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AdminMobileLayout } from "@/components/admin/AdminMobileLayout";

interface DashboardStats {
  pendingQuotes: number;
  totalQuotes: number;
  totalTestimonials: number;
  visibleTestimonials: number;
  totalProjects: number;
  pendingImports: number;
  totalClients: number;
  activeClients: number;
  totalPress: number;
  totalPartners: number;
}

const AdminDashboard = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [stats, setStats] = useState<DashboardStats>({
    pendingQuotes: 0,
    totalQuotes: 0,
    totalTestimonials: 0,
    visibleTestimonials: 0,
    totalProjects: 0,
    pendingImports: 0,
    totalClients: 0,
    activeClients: 0,
    totalPress: 0,
    totalPartners: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // PWA install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

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
      fetchStats();
    };

    checkAuth();
  }, [navigate, toast]);

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      // Fetch all stats in parallel
      const [
        quotesResult,
        pendingQuotesResult,
        testimonialsResult,
        visibleTestimonialsResult,
        projectsResult,
        pendingImportsResult,
        clientsResult,
        activeClientsResult,
        pressResult,
        partnersResult,
      ] = await Promise.all([
        supabase.from("quote_requests").select("id", { count: "exact", head: true }),
        supabase.from("quote_requests").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("houzz_testimonials").select("id", { count: "exact", head: true }),
        supabase.from("houzz_testimonials").select("id", { count: "exact", head: true }).eq("hidden", false),
        supabase.from("houzz_projects").select("id", { count: "exact", head: true }),
        supabase.from("import_queue").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("clients").select("id", { count: "exact", head: true }),
        supabase.from("clients").select("id", { count: "exact", head: true }).eq("status", "en_cours"),
        supabase.from("press_mentions").select("id", { count: "exact", head: true }),
        supabase.from("partner_requests" as any).select("id", { count: "exact", head: true }).eq("status", "new"),
      ]);

      setStats({
        totalQuotes: quotesResult.count || 0,
        pendingQuotes: pendingQuotesResult.count || 0,
        totalTestimonials: testimonialsResult.count || 0,
        visibleTestimonials: visibleTestimonialsResult.count || 0,
        totalProjects: projectsResult.count || 0,
        pendingImports: pendingImportsResult.count || 0,
        totalClients: clientsResult.count || 0,
        activeClients: activeClientsResult.count || 0,
        totalPress: pressResult.count || 0,
        totalPartners: partnersResult.count || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
    } else {
      navigate("/admin/install");
    }
  };

  const quickStats = [
    { 
      label: "Clients actifs", 
      value: stats.activeClients, 
      total: stats.totalClients,
      color: "bg-teal-500",
    },
    { 
      label: "Devis en attente", 
      value: stats.pendingQuotes,
      color: "bg-primary",
    },
  ];

  const adminSections = [
    {
      title: "Clients",
      description: "Gérer les fiches clients",
      href: "/admin/clients",
      icon: Users,
      color: "bg-teal-500/10 text-teal-600",
      badge: stats.activeClients > 0 ? stats.activeClients : null,
      badgeColor: "bg-teal-500 text-white",
    },
    {
      title: "Devis",
      description: "Demandes de devis",
      href: "/admin/devis",
      icon: FileText,
      color: "bg-primary/10 text-primary",
      badge: stats.pendingQuotes > 0 ? stats.pendingQuotes : null,
      badgeColor: "bg-primary text-primary-foreground",
    },
    {
      title: "Avis",
      description: "Témoignages clients",
      href: "/admin/avis",
      icon: MessageSquare,
      color: "bg-green-500/10 text-green-600",
      badge: null,
      badgeColor: "",
    },
    {
      title: "Import Houzz",
      description: "Importer des projets",
      href: "/admin/import",
      icon: Upload,
      color: "bg-orange-500/10 text-orange-600",
      badge: stats.pendingImports > 0 ? stats.pendingImports : null,
      badgeColor: "bg-orange-500 text-white",
    },
    {
      title: "Presse",
      description: "Mentions médias",
      href: "/admin/presse",
      icon: Newspaper,
      color: "bg-pink-500/10 text-pink-600",
      badge: null,
      badgeColor: "",
    },
    {
      title: "Partenaires",
      description: "Demandes partenaires",
      href: "/admin/partenaires",
      icon: Handshake,
      color: "bg-amber-500/10 text-amber-600",
      badge: stats.totalPartners > 0 ? stats.totalPartners : null,
      badgeColor: "bg-amber-500 text-white",
    },
    {
      title: "Conversions",
      description: "Stats & export CSV",
      href: "/admin/conversions",
      icon: TrendingUp,
      color: "bg-emerald-500/10 text-emerald-600",
      badge: null,
      badgeColor: "",
    },
    {
      title: "Liens",
      description: "Vérificateur de liens",
      href: "/admin/liens",
      icon: Link2,
      color: "bg-blue-500/10 text-blue-600",
      badge: null,
      badgeColor: "",
    },
    {
      title: "Tests",
      description: "Tests visuels",
      href: "/admin/visual",
      icon: Eye,
      color: "bg-purple-500/10 text-purple-600",
      badge: null,
      badgeColor: "",
    },
  ];

  if (isAdmin === null) {
    return (
      <div className="min-h-[100svh] bg-background flex items-center justify-center">
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

      <AdminMobileLayout 
        title="Tableau de bord"
        rightAction={
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9"
            onClick={fetchStats}
            disabled={loadingStats}
          >
            <RefreshCw className={`h-4 w-4 ${loadingStats ? 'animate-spin' : ''}`} />
          </Button>
        }
      >
        <div className="p-4 space-y-6">
          {/* Welcome Card with Install CTA */}
          {deferredPrompt && (
            <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-4 text-primary-foreground">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold mb-1">Installer l'application</h2>
                  <p className="text-sm opacity-90">Accès rapide depuis l'écran d'accueil</p>
                </div>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={handleInstall}
                  className="shrink-0"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Installer
                </Button>
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            {quickStats.map((stat) => (
              <div 
                key={stat.label}
                className="bg-card border border-border rounded-xl p-4"
              >
                <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-foreground">
                    {loadingStats ? "..." : stat.value}
                  </span>
                  {stat.total !== undefined && (
                    <span className="text-sm text-muted-foreground">
                      / {stat.total}
                    </span>
                  )}
                </div>
                <div className={`h-1 w-full ${stat.color} rounded-full mt-2 opacity-20`} />
              </div>
            ))}
          </div>

          {/* Admin Sections Grid - Mobile Optimized */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
              Accès rapide
            </h3>
            <div className="space-y-2">
              {adminSections.map((section) => (
                <Link
                  key={section.href + section.title}
                  to={section.href}
                  className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card active:bg-muted/50 transition-colors"
                >
                  <div className={`w-12 h-12 rounded-xl ${section.color} flex items-center justify-center shrink-0`}>
                    <section.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">
                        {section.title}
                      </h3>
                      {section.badge && (
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${section.badgeColor}`}>
                          {section.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {section.description}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                </Link>
              ))}
            </div>
          </div>

          {/* User Info Card */}
          <div className="bg-muted/30 rounded-xl p-4">
            <p className="text-xs text-muted-foreground">Connecté en tant que</p>
            <p className="font-medium text-foreground truncate">{userEmail}</p>
          </div>
        </div>
      </AdminMobileLayout>
    </>
  );
};

export default AdminDashboard;
