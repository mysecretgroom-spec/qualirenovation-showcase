import { 
  Bath, 
  ChefHat, 
  Sofa, 
  Bed, 
  Paintbrush, 
  Hammer,
  Layers,
  Wrench
} from "lucide-react";

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
  return (
    <section id="services" className="section-padding bg-background">
      <div className="container-tight">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <span className="text-accent font-medium text-sm tracking-widest uppercase mb-4 block">
            Services
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-4">
            Nos prestations
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Tous les corps de métiers réunis pour votre projet de rénovation, 
            de la conception à la livraison.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="group bg-card p-6 rounded-sm shadow-elegant hover:shadow-card hover:-translate-y-1 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 75}ms` }}
            >
              <div className="w-14 h-14 rounded-sm bg-secondary flex items-center justify-center mb-5 group-hover:bg-accent transition-colors duration-300">
                <service.icon className="w-7 h-7 text-accent group-hover:text-accent-foreground transition-colors duration-300" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                {service.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 bg-primary rounded-sm p-8 md:p-12 text-center animate-fade-in-up">
          <h3 className="font-display text-2xl md:text-3xl font-semibold text-primary-foreground mb-4">
            Vous avez un projet en tête ?
          </h3>
          <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">
            Consultation gratuite, devis détaillé et accompagnement personnalisé. 
            Discutons de votre projet ensemble.
          </p>
          <a 
            href="#contact"
            className="inline-flex items-center gap-2 bg-background text-foreground px-8 py-3.5 rounded-sm font-medium hover:bg-background/90 transition-colors duration-300"
          >
            Prendre rendez-vous
          </a>
        </div>
      </div>
    </section>
  );
};

export default Services;
