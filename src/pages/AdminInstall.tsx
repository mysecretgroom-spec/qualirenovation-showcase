import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Download, Smartphone, Check, Share, Plus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AdminInstall = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

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
    };

    checkAuth();
  }, [navigate, toast]);

  useEffect(() => {
    // Detect iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Listen for install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    
    window.addEventListener('beforeinstallprompt', handler);
    
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        toast({
          title: "Application installée",
          description: "L'app a été ajoutée à votre écran d'accueil.",
        });
      }
      setDeferredPrompt(null);
    }
  };

  if (isAdmin === null) {
    return (
      <div className="min-h-[100svh] bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Vérification...</div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Installer l'app Admin | QualiRénovation</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-[100svh] bg-gradient-to-b from-primary/5 to-background flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-md mx-auto">
          {/* Logo / Icon */}
          <div className="w-24 h-24 rounded-3xl bg-primary shadow-lg flex items-center justify-center mb-8">
            <span className="text-4xl font-bold text-primary-foreground">QR</span>
          </div>

          <h1 className="text-2xl font-bold text-foreground text-center mb-2">
            QualiRénovation Admin
          </h1>
          <p className="text-muted-foreground text-center mb-8">
            Installez l'application pour un accès rapide à la gestion de vos clients
          </p>

          {isInstalled ? (
            <div className="w-full space-y-4">
              <div className="flex items-center gap-3 p-4 bg-green-500/10 rounded-xl">
                <Check className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-semibold text-green-600">Application installée</p>
                  <p className="text-sm text-muted-foreground">
                    Vous pouvez la retrouver sur votre écran d'accueil
                  </p>
                </div>
              </div>
              <Button 
                className="w-full h-12" 
                onClick={() => navigate("/admin")}
              >
                Accéder au tableau de bord
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          ) : isIOS ? (
            <div className="w-full space-y-6">
              <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
                <h2 className="font-semibold text-lg">Instructions pour iOS</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold text-sm">1</span>
                    </div>
                    <div>
                      <p className="font-medium">Appuyez sur le bouton Partager</p>
                      <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                        <Share className="w-5 h-5" />
                        <span className="text-sm">en bas de Safari</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold text-sm">2</span>
                    </div>
                    <div>
                      <p className="font-medium">Faites défiler et appuyez sur</p>
                      <div className="flex items-center gap-2 mt-1 bg-muted rounded-lg px-3 py-2">
                        <Plus className="w-5 h-5 text-primary" />
                        <span className="text-sm font-medium">Sur l'écran d'accueil</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold text-sm">3</span>
                    </div>
                    <div>
                      <p className="font-medium">Confirmez en appuyant sur "Ajouter"</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => navigate("/admin")}
              >
                Continuer sans installer
              </Button>
            </div>
          ) : deferredPrompt ? (
            <div className="w-full space-y-4">
              <Button 
                className="w-full h-14 text-lg"
                onClick={handleInstall}
              >
                <Download className="w-5 h-5 mr-2" />
                Installer l'application
              </Button>
              
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl">
                <Smartphone className="w-10 h-10 text-muted-foreground" />
                <div className="text-sm">
                  <p className="font-medium">Accès rapide</p>
                  <p className="text-muted-foreground">
                    L'app s'ouvre directement sans navigateur
                  </p>
                </div>
              </div>
              
              <Button 
                variant="ghost" 
                className="w-full" 
                onClick={() => navigate("/admin")}
              >
                Continuer sans installer
              </Button>
            </div>
          ) : (
            <div className="w-full space-y-4">
              <div className="bg-card rounded-2xl border border-border p-6">
                <h2 className="font-semibold mb-2">Installation non disponible</h2>
                <p className="text-sm text-muted-foreground">
                  L'installation PWA n'est pas disponible sur ce navigateur. 
                  Utilisez Chrome, Safari ou Edge pour une meilleure expérience.
                </p>
              </div>
              <Button 
                className="w-full" 
                onClick={() => navigate("/admin")}
              >
                Accéder au tableau de bord
              </Button>
            </div>
          )}

          {/* Features */}
          <div className="mt-12 w-full space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground text-center uppercase tracking-wide">
              Fonctionnalités
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Accès hors-ligne",
                "Notifications",
                "Chargement rapide",
                "Interface native",
              ].map((feature) => (
                <div 
                  key={feature}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <Check className="w-4 h-4 text-green-500" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminInstall;
