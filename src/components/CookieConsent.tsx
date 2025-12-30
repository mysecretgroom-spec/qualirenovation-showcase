import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Cookie, X } from "lucide-react";

const COOKIE_CONSENT_KEY = "cookie-consent";

type ConsentValue = "accepted" | "rejected" | null;

const CookieConsent = () => {
  const [consent, setConsent] = useState<ConsentValue>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const savedConsent = localStorage.getItem(COOKIE_CONSENT_KEY) as ConsentValue;
    if (!savedConsent) {
      // Delay showing banner for better UX
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
    setConsent(savedConsent);
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    setConsent("accepted");
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "rejected");
    setConsent("rejected");
    setIsVisible(false);
  };

  if (!isVisible || consent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom-5 duration-500">
      <div className="container-tight">
        <div className="bg-card border border-border rounded-lg shadow-xl p-6 md:flex md:items-center md:justify-between gap-6">
          <div className="flex items-start gap-4 mb-4 md:mb-0">
            <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
              <Cookie className="w-5 h-5 text-gold" />
            </div>
            <div className="flex-1">
              <h3 className="font-display font-semibold text-foreground mb-1">
                Nous utilisons des cookies
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Ce site utilise des cookies pour améliorer votre expérience de navigation. 
                En continuant, vous acceptez notre{" "}
                <Link 
                  to="/politique-confidentialite" 
                  className="text-gold hover:underline"
                >
                  politique de confidentialité
                </Link>
                .
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReject}
              className="text-muted-foreground"
            >
              Refuser
            </Button>
            <Button
              size="sm"
              onClick={handleAccept}
              className="bg-gold hover:bg-gold-dark text-primary"
            >
              Accepter
            </Button>
          </div>

          <button
            onClick={handleReject}
            className="absolute top-3 right-3 md:hidden text-muted-foreground hover:text-foreground"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
