import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone } from "lucide-react";
import logoNeg from "@/assets/logo-full-neg.svg";
import QuoteModal from "./QuoteModal";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleAnchorClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    if (location.pathname !== "/") {
      navigate("/" + href);
    } else {
      const el = document.querySelector(href);
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#about", label: "À propos" },
    { href: "#projects", label: "Projets" },
    { href: "#services", label: "Services" },
    { href: "#testimonials", label: "Avis" },
    { href: "/on-parle-de-nous", label: "Presse", isPage: true },
    { href: "/faq", label: "FAQ", isPage: true },
    { href: "/guide-travaux", label: "Guide Travaux", isPage: true },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-primary/75 backdrop-blur-md shadow-elegant py-2 md:py-3"
            : "bg-primary/50 backdrop-blur-sm py-3 md:py-6"
        }`}
      >
        <div className="container-tight flex items-center justify-between px-4 md:px-6 lg:px-8">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src={logoNeg} 
              alt="QualiRénovation" 
              className="h-16 sm:h-20 md:h-24 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              link.isPage ? (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-sm font-medium transition-colors duration-300 text-primary-foreground/90 hover:text-gold whitespace-nowrap"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleAnchorClick(e, link.href)}
                  className="text-sm font-medium transition-colors duration-300 text-primary-foreground/90 hover:text-gold whitespace-nowrap"
                >
                  {link.label}
                </a>
              )
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center gap-3 xl:gap-4">
            <a 
              href="tel:+33XXXXXXXXX" 
              className="flex items-center gap-2 text-sm font-medium transition-colors duration-300 text-primary-foreground/90 hover:text-gold"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden xl:inline">Nous appeler</span>
            </a>
            <Button 
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 py-3 text-base font-semibold shadow-lg"
              onClick={() => setIsQuoteModalOpen(true)}
            >
              Devis gratuit
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 -mr-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-primary-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-primary-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden absolute top-full left-0 right-0 bg-primary/95 backdrop-blur-md shadow-elegant transition-all duration-300 max-h-[calc(100vh-60px)] overflow-y-auto ${
            isMobileMenuOpen ? "animate-slide-down" : "opacity-0 invisible"
          }`}
        >
          <nav className="px-4 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              link.isPage ? (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-primary-foreground/90 text-base font-medium py-3 px-2 hover:text-gold hover:bg-primary-foreground/5 rounded-sm transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-primary-foreground/90 text-base font-medium py-3 px-2 hover:text-gold hover:bg-primary-foreground/5 rounded-sm transition-colors"
                  onClick={(e) => { handleAnchorClick(e, link.href); setIsMobileMenuOpen(false); }}
                >
                  {link.label}
                </a>
              )
            ))}
            <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-primary-foreground/10">
              <a 
                href="tel:+33XXXXXXXXX" 
                className="flex items-center justify-center gap-2 text-primary-foreground/90 py-3 hover:text-gold transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Phone className="w-4 h-4" />
                <span>Nous appeler</span>
              </a>
              <Button 
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full shadow-lg" 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsQuoteModalOpen(true);
                }}
              >
                Devis gratuit
              </Button>
            </div>
          </nav>
        </div>
      </header>

      <QuoteModal open={isQuoteModalOpen} onOpenChange={setIsQuoteModalOpen} />
    </>
  );
};

export default Header;
