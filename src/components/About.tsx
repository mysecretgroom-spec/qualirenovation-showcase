import { CheckCircle2, Users, Clock, Shield } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const features = [
  {
    icon: Users,
    title: "Équipe complète",
    description: "Plombiers, maçons, électriciens, peintres, menuisiers, parqueteurs... tous les corps de métiers réunis.",
  },
  {
    icon: Clock,
    title: "+10 ans d'expérience",
    description: "Une expertise reconnue dans la rénovation d'appartements parisiens et maisons en Île-de-France.",
  },
  {
    icon: Shield,
    title: "Garantie qualité",
    description: "En contrôlant toutes les étapes du chantier, nous garantissons des réalisations belles et durables.",
  },
];

const certifications = [
  "Consultation gratuite",
  "Devis gratuits",
  "Plans 2D/3D sur mesure",
  "Suivi quotidien du chantier",
];

const About = () => {
  const { ref, animationClasses } = useScrollAnimation();

  return (
    <section ref={ref} id="about" className={`section-padding bg-background ${animationClasses}`}>
      <div className="container-tight">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div>
            <span className="text-accent font-medium text-sm tracking-widest uppercase mb-4 block">
              À propos
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold mb-6 text-foreground">
              Votre projet de rénovation
              <br />
              <span className="italic font-normal text-muted-foreground">en toute sérénité</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Rénovation, décoration, aménagement... autant de solutions pour améliorer 
              l'habitat et le confort. Nous nous mettons à votre écoute pour trouver 
              les solutions techniques adaptées, sourcer les produits correspondants, 
              avec l'attention toujours portée sur l'ergonomie et l'esthétique du projet.
            </p>

            {/* Certifications */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {certifications.map((cert) => (
                <div key={cert} className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                  <span className="text-foreground text-sm font-medium">{cert}</span>
                </div>
              ))}
            </div>

            {/* Signature */}
            <div className="flex items-center gap-4 pt-6 border-t border-border">
              <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center">
                <span className="font-display text-xl font-semibold text-foreground">C</span>
              </div>
              <div>
                <p className="font-display font-semibold text-foreground">Carina</p>
                <p className="text-muted-foreground text-sm">Fondatrice & Directrice des travaux</p>
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="space-y-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="bg-card p-6 rounded-sm shadow-elegant hover:shadow-card transition-all duration-300"
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-sm bg-secondary flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
