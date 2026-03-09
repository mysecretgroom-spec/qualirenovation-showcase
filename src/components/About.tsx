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
      <div className="container-tight px-4 sm:px-6 lg:px-8">
        {/* Introduction */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-16 lg:mb-20">
          {/* Text Content */}
          <div>
            <span className="text-accent font-medium text-xs sm:text-sm tracking-widest uppercase mb-3 sm:mb-4 block">
              À propos
            </span>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 sm:mb-6 text-foreground">
              Réalisez vos projets de rénovation
              <br className="hidden sm:block" />
              <span className="italic font-normal text-muted-foreground">avec simplicité et efficacité</span>
            </h2>
            <p className="font-script text-2xl sm:text-3xl md:text-4xl text-muted-foreground/80 mb-4 sm:mb-6">
              Paris & Île-de-France
            </p>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-6 sm:mb-8">
              Rénovation, décoration, aménagement... autant de solutions pour améliorer 
              l'habitat et le confort. Nous nous mettons à votre écoute pour trouver 
              les solutions techniques adaptées, sourcer les produits correspondants, 
              avec l'attention toujours portée sur l'ergonomie et l'esthétique du projet.
            </p>

            {/* Signature */}
            <div className="flex items-center gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-border">
              <img 
                src={carinaPhoto} 
                alt="Carina - Maître d'œuvre" 
                className="w-14 h-14 sm:w-20 sm:h-20 rounded-full object-cover"
              />
              <div>
                <p className="font-display font-semibold text-foreground text-sm sm:text-base">Carina</p>
                <p className="text-muted-foreground text-xs sm:text-sm">Maître d'œuvre</p>
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="space-y-4 sm:space-y-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="bg-card p-4 sm:p-6 rounded-sm shadow-elegant hover:shadow-card transition-all duration-300"
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="flex items-start gap-3 sm:gap-5">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-sm bg-secondary flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-display text-base sm:text-xl font-semibold text-foreground mb-1 sm:mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6 Steps Section */}
        <div className="bg-secondary/30 rounded-lg p-4 sm:p-8 md:p-12">
          <div className="text-center mb-8 sm:mb-12">
            <span className="text-accent font-medium text-xs sm:text-sm tracking-widest uppercase mb-3 sm:mb-4 block">
              Notre méthode
            </span>
            <h3 className="font-display text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground">
              6 étapes pour votre projet
            </h3>
          </div>

          {/* Timeline Steps - Zigzag Layout */}
          <div className="relative max-w-5xl mx-auto">
            {/* Central Timeline Line - Only visible on lg+ */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent/20 via-accent to-accent/20 transform -translate-x-1/2" />
            
            {/* Animated dots on the timeline */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 transform -translate-x-1/2">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="absolute w-3 h-3 bg-accent rounded-full animate-pulse"
                  style={{ 
                    top: `${(i * 20) + 5}%`,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    animationDelay: `${i * 0.3}s`
                  }}
                />
              ))}
            </div>

            <div className="space-y-6 lg:space-y-12">
              {steps.map((step, index) => {
                const isEven = index % 2 === 0;
                
                return (
                  <div 
                    key={step.number}
                    className={`relative flex flex-col lg:flex-row items-center gap-6 lg:gap-12 ${
                      isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                    }`}
                    style={{ 
                      animationDelay: `${index * 150}ms`
                    }}
                  >
                    {/* Step Card */}
                    <div 
                      className={`w-full lg:w-[calc(50%-3rem)] group ${
                        isEven ? 'lg:text-right' : 'lg:text-left'
                      }`}
                    >
                      <div 
                        className="bg-card p-4 sm:p-6 rounded-lg shadow-elegant hover:shadow-card hover:-translate-y-1 transition-all duration-500 relative overflow-hidden"
                      >
                        {/* Decorative gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        <div className={`relative flex items-start gap-3 sm:gap-4 ${isEven ? 'lg:flex-row-reverse' : ''}`}>
                          <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                            <step.icon className="w-5 h-5 sm:w-7 sm:h-7 text-accent" />
                          </div>
                          <div className={`flex-1 ${isEven ? 'lg:text-right' : ''}`}>
                            <h4 className="font-display text-base sm:text-lg font-semibold text-foreground mb-1 sm:mb-2">
                              {step.title}
                            </h4>
                            <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Connector line to center - Desktop only */}
                      <div 
                        className={`hidden lg:block absolute top-1/2 h-0.5 w-12 bg-gradient-to-r ${
                          isEven 
                            ? 'right-0 translate-x-full from-accent/50 to-accent' 
                            : 'left-0 -translate-x-full from-accent to-accent/50'
                        }`}
                        style={{ transform: `translateY(-50%) ${isEven ? 'translateX(100%)' : 'translateX(-100%)'}` }}
                      />
                    </div>

                    {/* Center Number Badge */}
                    <div className="relative z-10 flex-shrink-0 order-first lg:order-none">
                      <div className="w-10 h-10 sm:w-14 sm:h-14 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-display text-lg sm:text-2xl font-bold shadow-lg ring-2 sm:ring-4 ring-background transition-transform duration-300 hover:scale-110">
                        {step.number}
                      </div>
                    </div>

                    {/* Empty space for zigzag layout on desktop */}
                    <div className="hidden lg:block w-[calc(50%-3rem)]" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Single point of contact */}
          <div className="mt-10 sm:mt-16 bg-primary/10 border border-primary/20 rounded-lg p-4 sm:p-6 md:p-8 flex flex-col md:flex-row items-center gap-4 sm:gap-6 justify-center max-w-2xl mx-auto relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-primary/10 rounded-full blur-xl" />
            
            <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary flex items-center justify-center flex-shrink-0 shadow-lg">
              <User className="w-6 h-6 sm:w-8 sm:h-8 text-primary-foreground" />
            </div>
            <div className="relative text-center md:text-left flex-1">
              <h4 className="font-display font-semibold text-foreground text-base sm:text-xl mb-1">
                Un interlocuteur unique
              </h4>
              <p className="text-muted-foreground text-sm sm:text-base">
                Pour gérer et suivre l'intégralité de votre chantier du début à la fin.
              </p>
            </div>
            <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-accent flex-shrink-0" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
