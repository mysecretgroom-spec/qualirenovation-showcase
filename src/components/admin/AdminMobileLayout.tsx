import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Home, Users, FileText, Settings, Menu, X, 
  Download, LogOut, ChevronLeft, MoreHorizontal,
  MessageSquare, Upload, Newspaper
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface AdminMobileLayoutProps {
  children: ReactNode;
  title?: string;
  showBackButton?: boolean;
  rightAction?: ReactNode;
}

const mainNavItems = [
  { href: "/admin", icon: Home, label: "Accueil" },
  { href: "/admin/clients", icon: Users, label: "Clients" },
  { href: "/admin/devis", icon: FileText, label: "Devis" },
  { href: "/admin/avis", icon: MessageSquare, label: "Avis" },
];

const moreNavItems = [
  { href: "/admin/import", icon: Upload, label: "Import Houzz" },
  { href: "/admin/presse", icon: Newspaper, label: "Presse" },
  { href: "/admin/liens", icon: Settings, label: "Liens" },
  { href: "/admin/visual", icon: Settings, label: "Tests" },
];

export const AdminMobileLayout = ({ 
  children, 
  title,
  showBackButton = false,
  rightAction,
}: AdminMobileLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };
    
    window.addEventListener('beforeinstallprompt', handler);
    
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstallable(false);
    }
    
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstallable(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const isActive = (href: string) => {
    if (href === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-[100svh] bg-background flex flex-col">
      {/* Top Header - Mobile optimized */}
      <header className="sticky top-0 z-50 bg-card border-b border-border safe-area-top">
        <div className="flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-2">
            {showBackButton ? (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9"
                onClick={() => navigate(-1)}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">QR</span>
                </div>
              </div>
            )}
            {title && (
              <h1 className="font-semibold text-foreground text-lg truncate max-w-[200px]">
                {title}
              </h1>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            {rightAction}
            
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 p-0">
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                        <span className="text-primary-foreground font-bold">QR</span>
                      </div>
                      <div>
                        <h2 className="font-semibold">Administration</h2>
                        <p className="text-xs text-muted-foreground">QualiRénovation</p>
                      </div>
                    </div>
                  </div>
                  
                  <nav className="flex-1 p-2 space-y-1">
                    {[...mainNavItems, ...moreNavItems].map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                          isActive(item.href)
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-muted"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    ))}
                  </nav>
                  
                  <div className="p-4 border-t border-border space-y-2">
                    {isInstallable && (
                      <Button 
                        variant="outline" 
                        className="w-full justify-start" 
                        onClick={handleInstall}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Installer l'app
                      </Button>
                    )}
                    <Link to="/" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full justify-start">
                        <Home className="h-4 w-4 mr-2" />
                        Voir le site
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-destructive hover:text-destructive"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Déconnexion
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto pb-20 md:pb-4">
        {children}
      </main>

      {/* Bottom Navigation - Mobile only */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border safe-area-bottom md:hidden z-40">
        <div className="flex items-center justify-around h-16">
          {mainNavItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              >
                <item.icon className={cn("h-5 w-5", active && "scale-110")} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
          <Sheet>
            <SheetTrigger asChild>
              <button className="flex flex-col items-center justify-center w-full h-full gap-1 text-muted-foreground">
                <MoreHorizontal className="h-5 w-5" />
                <span className="text-[10px] font-medium">Plus</span>
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-auto rounded-t-2xl">
              <div className="pt-2 pb-safe">
                <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-4" />
                <nav className="grid grid-cols-2 gap-2">
                  {moreNavItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={cn(
                        "flex items-center gap-3 p-4 rounded-xl transition-colors",
                        isActive(item.href)
                          ? "bg-primary/10 text-primary"
                          : "bg-muted/50 text-foreground hover:bg-muted"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium text-sm">{item.label}</span>
                    </Link>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </div>
  );
};

export default AdminMobileLayout;
