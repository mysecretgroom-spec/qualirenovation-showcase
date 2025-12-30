import { MapPin, Phone, Mail, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import logoQualirenovation from "@/assets/logo-qualirenovation.webp";

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
    "Paris",
    "Neuilly-sur-Seine",
    "Boulogne-Billancourt",
    "Levallois-Perret",
    "Issy-les-Moulineaux",
    "Saint-Cloud",
  ];

  const socialLinks = [
    { icon: HouzzIcon, href: "https://www.houzz.fr/pro/qualiconcept/qualirenovation-by-qualiconcept", label: "Houzz", isComponent: true },
    { icon: Instagram, href: "https://www.instagram.com/qualirenovation__travaux/", label: "Instagram", isComponent: false },
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="container-tight py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <img 
                src={logoQualirenovation} 
                alt="Qualirénovation by Qualiconcept" 
                className="h-12 w-auto"
              />
              <div className="flex flex-col">
                <span className="font-display font-bold text-base tracking-wide">QUALIRÉNOVATION</span>
                <span className="text-[10px] font-medium text-primary-foreground/70">by Qualiconcept</span>
              </div>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed mb-6">
              Rénovation, décoration et aménagement d'intérieur à Paris et en Île-de-France. 
              Plus de 10 ans d'expérience au service de votre habitat.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a 
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-sm bg-primary-foreground/10 flex items-center justify-center hover:bg-gold hover:text-primary transition-colors"
                  aria-label={social.label}
                >
                  {social.isComponent ? (
                    <social.icon className="w-4 h-4" />
                  ) : (
                    <social.icon className="w-4 h-4" />
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-5">Services</h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <a 
                    href="#services" 
                    className="text-primary-foreground/70 text-sm hover:text-primary-foreground transition-colors"
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Zones */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-5">Zones d'intervention</h4>
            <ul className="space-y-3">
              {zones.map((zone) => (
                <li key={zone}>
                  <span className="text-primary-foreground/70 text-sm">{zone}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-5">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold-light flex-shrink-0 mt-0.5" />
                <span className="text-primary-foreground/70 text-sm">
                  Paris & Île-de-France
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gold-light" />
                <span className="text-primary-foreground/70 text-sm">
                  Sur rendez-vous
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gold-light" />
                <span className="text-primary-foreground/70 text-sm">
                  contact@qualirenovation.fr
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container-tight py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/60 text-sm">
            © {currentYear} QUALIRENOVATION by Qualiconcept. Tous droits réservés.
          </p>
          <div className="flex gap-6 text-sm">
            <Link to="/cgv" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
              CGV
            </Link>
            <Link to="/politique-confidentialite" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
              Politique de confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
