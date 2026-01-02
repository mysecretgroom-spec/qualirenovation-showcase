import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone } from "lucide-react";
import logoQualirenovation from "@/assets/logo-qualirenovation.webp";
import QuoteModal from "./QuoteModal";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

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
    { href: "#contact", label: "Contact" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-primary/75 backdrop-blur-md shadow-elegant py-3"
            : "bg-primary/50 backdrop-blur-sm py-6"
        }`}
      >
        <div className="container-tight flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center">
            <img 
              src={logoQualirenovation} 
              alt="Qualirénovation by Qualiconcept" 
              className="h-14 w-auto"
            />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              link.isPage ? (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-sm font-medium transition-colors duration-300 text-primary-foreground/90 hover:text-gold"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium transition-colors duration-300 text-primary-foreground/90 hover:text-gold"
                >
                  {link.label}
                </a>
              )
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center gap-4">
            <a 
              href="tel:+33XXXXXXXXX" 
              className="flex items-center gap-2 text-sm font-medium transition-colors duration-300 text-primary-foreground/90 hover:text-gold"
            >
              <Phone className="w-4 h-4" />
              <span>Nous appeler</span>
            </a>
            <Button 
              variant="outline" 
              size="sm"
              className="border-gold text-gold hover:bg-gold hover:text-primary"
              onClick={() => setIsQuoteModalOpen(true)}
            >
              Devis gratuit
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
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
          className={`lg:hidden absolute top-full left-0 right-0 bg-primary/75 backdrop-blur-md shadow-elegant transition-all duration-300 ${
            isMobileMenuOpen ? "animate-slide-down" : "opacity-0 invisible"
          }`}
        >
          <nav className="container-tight py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              link.isPage ? (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-primary-foreground/90 text-lg font-medium py-2 hover:text-gold transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-primary-foreground/90 text-lg font-medium py-2 hover:text-gold transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              )
            ))}
            <Button 
              variant="outline"
              className="mt-4 border-gold text-gold hover:bg-gold hover:text-primary" 
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsQuoteModalOpen(true);
              }}
            >
              Devis gratuit
            </Button>
          </nav>
        </div>
      </header>

      <QuoteModal open={isQuoteModalOpen} onOpenChange={setIsQuoteModalOpen} />
    </>
  );
};

export default Header;
