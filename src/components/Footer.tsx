import { MapPin, Phone, Mail, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import logoNeg from "@/assets/logo-hor-neg.svg";

// Houzz icon component
const HouzzIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.01 2L5 5.5v13l7.01 3.5L19 18.5v-13L12.01 2zm0 2.25l5.01 2.5v10l-5.01 2.5-5.01-2.5v-10l5.01-2.5z"/>
    <path d="M12.01 8.5v7l3.5-1.75v-3.5L12.01 8.5z"/>
  </svg>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const services = [
    "Rénovation complète",
    "Salle de bain",
    "Cuisine",
    "Ouverture mur porteur",
    "Parquet & Carrelage",
    "Peinture & Finitions",
  ];

  const zones = [
    "Paris intramuros",
    "Hauts-de-Seine",
    "Val-de-Marne",
    "Seine-Saint-Denis",
    "Île-de-France",
  ];

  const socialLinks = [
    { icon: HouzzIcon, href: "https://www.houzz.fr/professionnels/artisan-et-entreprise-generale-de-batiment/qualirenovation-by-qualiconcept-pfvwfr-pf~1259357618", label: "Houzz", isComponent: true },
    { icon: Instagram, href: "https://www.instagram.com/qualirenovation__travaux/", label: "Instagram", isComponent: false },
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="container-tight py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-2 lg:col-span-1">
            <div className="mb-4 sm:mb-6">
              <img 
                src={logoNeg} 
                alt="QualiRénovation" 
                className="h-12 sm:h-14 w-auto"
              />
            </div>
            <p className="text-primary-foreground/70 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6">
              Rénovation, décoration et aménagement d'intérieur à Paris et en Île-de-France. 
              Plus de 10 ans d'expérience au service de votre habitat.
            </p>
            <div className="flex gap-2 sm:gap-3">
              {socialLinks.map((social) => (
                <a 
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-sm bg-primary-foreground/10 flex items-center justify-center hover:bg-gold hover:text-primary transition-colors"
                  aria-label={social.label}
                >
                  {social.isComponent ? (
                    <social.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  ) : (
                    <social.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="col-span-1">
            <h4 className="font-display font-semibold text-base sm:text-lg mb-3 sm:mb-5">Services</h4>
            <ul className="space-y-2 sm:space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <a 
                    href="#services" 
                    className="text-primary-foreground/70 text-xs sm:text-sm hover:text-primary-foreground transition-colors"
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Zones */}
          <div className="col-span-1">
            <h4 className="font-display font-semibold text-base sm:text-lg mb-3 sm:mb-5">Zones d'intervention</h4>
            <ul className="space-y-2 sm:space-y-3">
              {zones.map((zone) => (
                <li key={zone}>
                  <span className="text-primary-foreground/70 text-xs sm:text-sm">{zone}</span>
                </li>
              ))}
            </ul>

            {/* Site dédié */}
            <div className="mt-6 pt-4 border-t border-primary-foreground/10">
              <h4 className="font-display font-semibold text-sm sm:text-base mb-2">Site dédié</h4>
              <a
                href="https://renover-salle-de-bain.qualirenovation.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-gold-light hover:text-gold text-xs sm:text-sm transition-colors"
              >
                🛁 Rénover ma salle de bain
              </a>
            </div>
          </div>

          {/* Contact */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="font-display font-semibold text-base sm:text-lg mb-3 sm:mb-5">Contact</h4>
            <ul className="space-y-3 sm:space-y-4">
              <li className="flex items-start gap-2 sm:gap-3">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gold-light flex-shrink-0 mt-0.5" />
                <span className="text-primary-foreground/70 text-xs sm:text-sm">
                  6 rue d'Armaillé<br />75017 Paris
                </span>
              </li>
              <li className="flex items-center gap-2 sm:gap-3">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-gold-light" />
                <span className="text-primary-foreground/70 text-xs sm:text-sm">
                  Sur rendez-vous
                </span>
              </li>
              <li className="flex items-center gap-2 sm:gap-3">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-gold-light" />
                <span className="text-primary-foreground/70 text-xs sm:text-sm">
                  gestion@qualiconcept.fr
                </span>
              </li>
            </ul>
            <p className="text-primary-foreground/60 text-[10px] sm:text-xs mt-4 sm:mt-6">
              Assuré par MIC Assurance
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container-tight py-4 sm:py-6 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
          <p className="text-primary-foreground/60 text-[10px] sm:text-sm text-center md:text-left">
            © {currentYear} QUALIRENOVATION by Qualiconcept. Tous droits réservés.
          </p>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 text-[10px] sm:text-sm">
            <Link to="/faq" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
              FAQ
            </Link>
            <Link to="/mentions-legales" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
              Mentions légales
            </Link>
            <Link to="/cgv" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
              CGV
            </Link>
            <Link to="/politique-confidentialite" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
              Confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
