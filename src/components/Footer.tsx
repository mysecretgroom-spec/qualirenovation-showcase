import { MapPin, Phone, Mail, Instagram, Facebook, Linkedin } from "lucide-react";

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

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="container-tight py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-sm bg-primary-foreground flex items-center justify-center">
                <span className="font-display font-bold text-lg text-primary">QR</span>
              </div>
              <span className="font-display font-semibold text-lg">QUALIRENOVATION</span>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed mb-6">
              Rénovation, décoration et aménagement d'intérieur à Paris et en Île-de-France. 
              Plus de 10 ans d'expérience au service de votre habitat.
            </p>
            <div className="flex gap-3">
              <a 
                href="#" 
                className="w-9 h-9 rounded-sm bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                className="w-9 h-9 rounded-sm bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                className="w-9 h-9 rounded-sm bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
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
            <a href="#" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
              Mentions légales
            </a>
            <a href="#" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
              Politique de confidentialité
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
