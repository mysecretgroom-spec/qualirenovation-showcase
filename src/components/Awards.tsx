import { Award, Star, Trophy } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const awards = [
  {
    icon: Trophy,
    title: "Best of Houzz Service",
    year: "2024",
    description: "Élu meilleur service client par la communauté Houzz.",
  },
  {
    icon: Award,
    title: "Best of Houzz Design",
    year: "2023",
    description: "Reconnu pour l'excellence de nos réalisations.",
  },
  {
    icon: Star,
    title: "4.9/5 sur Houzz",
    year: "100+ avis",
    description: "Note exceptionnelle basée sur les retours clients vérifiés.",
  },
];

const Awards = () => {
  const { ref, animationClasses } = useScrollAnimation();

  return (
    <section ref={ref} id="recompenses" className={`section-padding bg-secondary/30 ${animationClasses}`}>
      <div className="container-tight px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-16">
          <span className="text-accent font-medium text-xs sm:text-sm tracking-widest uppercase mb-3 sm:mb-4 block">
            Récompenses
          </span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-3 sm:mb-4">
            Reconnus pour notre excellence
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            Nos distinctions témoignent de notre engagement envers la qualité et la satisfaction client.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {awards.map((award, index) => (
            <div
              key={award.title}
              className="group bg-background p-6 sm:p-8 rounded-sm shadow-elegant hover:shadow-card hover:-translate-y-1 transition-all duration-300 text-center"
              style={{ transitionDelay: `${index * 75}ms` }}
            >
              <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                <award.icon className="w-7 h-7 text-accent" />
              </div>
              <span className="inline-block text-xs font-semibold text-accent bg-accent/10 px-3 py-1 rounded-full mb-3">
                {award.year}
              </span>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">{award.title}</h3>
              <p className="text-muted-foreground text-sm">{award.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Awards;
