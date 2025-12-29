import { useState } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Olivier G.",
    role: "Rénovation salle de bain",
    rating: 5,
    text: "J'ai sollicité Carina de QUALIRENOVATION pour la rénovation de ma salle de bain. En moins de deux semaines, j'ai reçu une évaluation détaillée et un devis. La rénovation a été complète : plomberie, électricité, remplacement de la baignoire par une douche. Le résultat dépasse mes attentes initiales.",
    date: "Octobre 2024",
  },
  {
    id: 2,
    name: "Marie C.",
    role: "Transformation salle de bains et chambre",
    rating: 5,
    text: "Je recommande avec beaucoup d'enthousiasme les prestations de QualiConcept. Carina a géré mon chantier avec beaucoup de professionnalisme et de rigueur. Le chantier a été livré dans le délai imparti, avec un sens du détail et des finitions soignées.",
    date: "Septembre 2024",
  },
  {
    id: 3,
    name: "Yoann de M.",
    role: "Rénovation complète appartement",
    rating: 5,
    text: "Je ne peux que recommander avec enthousiasme Qualirenovation et sa 'bonne fée' Carina, joignable aux heures les plus improbables et toujours sur le pont pour trouver des solutions. Elle a supervisé toute la rénovation intérieure avec une efficacité redoutable.",
    date: "Juillet 2024",
  },
  {
    id: 4,
    name: "Patricia G.",
    role: "Rénovation deux pièces",
    rating: 5,
    text: "Je dois à Carina la réussite des travaux de rénovation de mon deux pièces où tout était à refaire du sol au plafond ! Je me suis entièrement reposée sur son savoir-faire. Avec Carina, qui maîtrise tous les corps de métier, pas un problème qui n'ait sa solution.",
    date: "Juillet 2024",
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonials" className="section-padding bg-secondary/30">
      <div className="container-tight">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <span className="text-accent font-medium text-sm tracking-widest uppercase mb-4 block">
            Témoignages
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-4">
            Ce que disent nos clients
          </h2>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i < 4 ? "fill-accent text-accent" : "fill-accent/50 text-accent/50"}`}
                />
              ))}
            </div>
            <span className="font-medium">4.5/5</span>
            <span>•</span>
            <span>53 avis sur Houzz</span>
          </div>
        </div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-4xl mx-auto">
          {/* Quote Icon */}
          <Quote className="absolute -top-6 left-0 md:left-8 w-16 h-16 text-accent/20" />
          
          {/* Content */}
          <div className="bg-background rounded-sm shadow-card p-8 md:p-12 animate-fade-in">
            <div className="flex mb-4">
              {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-accent text-accent" />
              ))}
            </div>
            
            <p className="text-foreground text-lg md:text-xl leading-relaxed mb-8 font-display italic">
              "{testimonials[currentIndex].text}"
            </p>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-foreground">{testimonials[currentIndex].name}</p>
                <p className="text-muted-foreground text-sm">{testimonials[currentIndex].role}</p>
                <p className="text-muted-foreground text-xs mt-1">{testimonials[currentIndex].date}</p>
              </div>
              
              {/* Navigation */}
              <div className="flex gap-2">
                <button
                  onClick={prevTestimonial}
                  className="w-10 h-10 rounded-sm border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                  aria-label="Témoignage précédent"
                >
                  <ChevronLeft className="w-5 h-5 text-foreground" />
                </button>
                <button
                  onClick={nextTestimonial}
                  className="w-10 h-10 rounded-sm border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                  aria-label="Témoignage suivant"
                >
                  <ChevronRight className="w-5 h-5 text-foreground" />
                </button>
              </div>
            </div>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "bg-accent w-8" : "bg-border hover:bg-muted-foreground"
                }`}
                aria-label={`Aller au témoignage ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
