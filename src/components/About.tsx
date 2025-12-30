import { CheckCircle2, Users, Clock, Shield, Phone, PiggyBank, FileText, Layers, ClipboardCheck, Hammer, User } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import carinaPhoto from "@/assets/carina.jpg";

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

const steps = [
  {
    number: "1",
    icon: Phone,
    title: "Visite technique sur place",
    description: "Pour les appartements, ou appel après envoi des plans si vous rénovez une pièce.",
  },
  {
    number: "2",
    icon: PiggyBank,
    title: "Prise en charge rapide",
    description: "De votre demande, sans plans sur la comète.",
  },
  {
    number: "3",
    icon: FileText,
    title: "Devis détaillé",
    description: "Transparent et sans mauvaise surprise.",
  },
  {
    number: "4",
    icon: Layers,
    title: "Conception 2D et 3D",
    description: "À prix compétitifs pour visualiser votre futur espace.",
  },
  {
    number: "5",
    icon: ClipboardCheck,
    title: "Contre-visite",
    description: "Pour conforter l'agencement et optimiser le devis après validation du budget.",
  },
  {
    number: "6",
    icon: Hammer,
    title: "Démarrage des travaux",
    description: "Si votre motivation est à la hauteur de notre réactivité, on démarre dans 3 semaines !",
  },
];

const About = () => {
  const { ref, animationClasses } = useScrollAnimation();

  return (
    <section ref={ref} id="about" className={`section-padding bg-background ${animationClasses}`}>
      <div className="container-tight">
        {/* Introduction */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Text Content */}
          <div>
            <span className="text-accent font-medium text-sm tracking-widest uppercase mb-4 block">
              À propos
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold mb-6 text-foreground">
              Réalisez vos projets de rénovation
              <br />
              <span className="italic font-normal text-muted-foreground">avec simplicité et efficacité</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Rénovation, décoration, aménagement... autant de solutions pour améliorer 
              l'habitat et le confort. Nous nous mettons à votre écoute pour trouver 
              les solutions techniques adaptées, sourcer les produits correspondants, 
              avec l'attention toujours portée sur l'ergonomie et l'esthétique du projet.
            </p>

            {/* Signature */}
            <div className="flex items-center gap-4 pt-6 border-t border-border">
              <img 
                src={carinaPhoto} 
                alt="Carina - Maître d'œuvres" 
                className="w-20 h-20 rounded-full object-cover"
              />
              <div>
                <p className="font-display font-semibold text-foreground">Carina</p>
                <p className="text-muted-foreground text-sm">Maître d'œuvres</p>
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

        {/* 6 Steps Section */}
        <div className="bg-secondary/30 rounded-lg p-8 md:p-12">
          <div className="text-center mb-12">
            <span className="text-accent font-medium text-sm tracking-widest uppercase mb-4 block">
              Notre méthode
            </span>
            <h3 className="font-display text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground">
              6 étapes pour votre projet
            </h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="bg-card p-6 rounded-sm shadow-elegant hover:shadow-card hover:-translate-y-1 transition-all duration-300 relative"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Step number */}
                <span className="absolute -top-3 -left-3 w-10 h-10 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-display text-lg font-bold shadow-md">
                  {step.number}
                </span>
                
                <div className="flex flex-col items-center text-center pt-4">
                  <div className="w-14 h-14 rounded-sm bg-secondary flex items-center justify-center mb-4">
                    <step.icon className="w-7 h-7 text-accent" />
                  </div>
                  <h4 className="font-display text-lg font-semibold text-foreground mb-2">
                    {step.title}
                  </h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Single point of contact */}
          <div className="mt-10 bg-primary/10 border border-primary/20 rounded-sm p-6 flex flex-col md:flex-row items-center gap-4 justify-center">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <User className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="text-center md:text-left">
              <h4 className="font-display font-semibold text-foreground text-lg">
                Un interlocuteur unique
              </h4>
              <p className="text-muted-foreground">
                Pour gérer et suivre l'intégralité de votre chantier du début à la fin.
              </p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-accent hidden md:block" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
