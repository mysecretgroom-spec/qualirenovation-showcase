import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Bath, 
  ChefHat, 
  Sofa, 
  Bed, 
  Paintbrush, 
  Hammer,
  Layers,
  Wrench,
  Handshake
} from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import QuoteModal from "./QuoteModal";

const services = [
  {
    icon: Bath,
    title: "Salle de Bain",
    description: "Rénovation complète, pose de carrelage, plomberie, douche à l'italienne.",
  },
  {
    icon: ChefHat,
    title: "Cuisine",
    description: "Aménagement sur mesure, installation d'îlot central, électroménager intégré.",
  },
  {
    icon: Sofa,
    title: "Salon & Séjour",
    description: "Ouverture de murs porteurs, parquet, peinture, éclairage d'ambiance.",
  },
  {
    icon: Bed,
    title: "Chambre & Dressing",
    description: "Suite parentale, rangements sur mesure, isolation phonique.",
  },
  {
    icon: Paintbrush,
    title: "Peinture & Finitions",
    description: "Peinture décorative, boiseries, ravalement de façade.",
  },
  {
    icon: Hammer,
    title: "Maçonnerie",
    description: "Ouverture de murs porteurs, ragréage, terrassement.",
  },
  {
    icon: Layers,
    title: "Revêtements",
    description: "Carrelage, parquet, faïence, sols techniques.",
  },
  {
    icon: Wrench,
    title: "Plomberie & Électricité",
    description: "Mise aux normes, installation complète, dépannage.",
  },
];

const Services = () => {
  const { ref, animationClasses } = useScrollAnimation();
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  return (
    <>
      <section ref={ref} id="services" className={`section-padding bg-background ${animationClasses}`}>
        <div className="container-tight px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-10 sm:mb-16">
            <span className="text-accent font-medium text-xs sm:text-sm tracking-widest uppercase mb-3 sm:mb-4 block">
              Services
            </span>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-3 sm:mb-4">
              Nos prestations
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              Tous les corps de métiers réunis pour votre projet de rénovation, 
              de la conception à la livraison.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {services.map((service, index) => (
              <div
                key={service.title}
                className="group bg-card p-3 sm:p-6 rounded-sm shadow-elegant hover:shadow-card hover:-translate-y-1 transition-all duration-300"
                style={{ transitionDelay: `${index * 75}ms` }}
              >
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-sm bg-secondary flex items-center justify-center mb-3 sm:mb-5 group-hover:bg-accent transition-colors duration-300">
                  <service.icon className="w-5 h-5 sm:w-7 sm:h-7 text-accent group-hover:text-accent-foreground transition-colors duration-300" />
                </div>
                <h3 className="font-display text-sm sm:text-lg font-semibold text-foreground mb-1 sm:mb-2">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed hidden sm:block">
                  {service.description}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-10 sm:mt-16 bg-primary rounded-sm p-6 sm:p-8 md:p-12 text-center">
            <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-semibold text-primary-foreground mb-3 sm:mb-4">
              Vous avez un projet en tête ?
            </h3>
            <p className="text-primary-foreground/80 mb-5 sm:mb-6 max-w-xl mx-auto text-sm sm:text-base">
              Consultation gratuite, devis détaillé et accompagnement personnalisé. 
              Discutons de votre projet ensemble.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <button 
                onClick={() => setShowQuoteModal(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground px-6 sm:px-8 py-3 sm:py-3.5 rounded-sm font-medium hover:bg-accent/90 transition-colors duration-300 text-sm sm:text-base"
              >
                Configurer mon projet
              </button>
              <a 
                href="#contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-background text-foreground px-6 sm:px-8 py-3 sm:py-3.5 rounded-sm font-medium hover:bg-background/90 transition-colors duration-300 text-sm sm:text-base"
              >
                Prendre rendez-vous
              </a>
            </div>
          </div>

          {/* Partner CTA */}
          <div className="mt-10 sm:mt-16 bg-secondary/50 rounded-sm p-6 sm:p-8 md:p-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
              <Handshake className="w-7 h-7 text-accent" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-display text-lg sm:text-xl font-semibold text-foreground mb-1">
                Devenir partenaire
              </h3>
              <p className="text-muted-foreground text-sm">
                Artisan, installateur ou marque ? Rejoignez notre réseau de partenaires de confiance.
              </p>
            </div>
            <Link
              to="/devenir-partenaire"
              className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-6 py-3 rounded-sm font-medium hover:bg-accent/90 transition-colors text-sm whitespace-nowrap"
            >
              En savoir plus
            </Link>
          </div>
        </div>
      </section>

      <QuoteModal 
        open={showQuoteModal} 
        onOpenChange={setShowQuoteModal}
        showConfigurationOption={true}
      />
    </>
  );
};

export default Services;
