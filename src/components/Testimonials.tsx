import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, Quote, Filter } from "lucide-react";
import { testimonials, testimonialStats } from "@/data/testimonials";
import { Button } from "./ui/button";

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filter, setFilter] = useState<string>("all");
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Get unique project types for filtering
  const projectTypes = ["all", ...new Set(testimonials.map(t => t.projectType).filter(Boolean))];
  
  // Filter testimonials based on selected type
  const filteredTestimonials = filter === "all" 
    ? testimonials 
    : testimonials.filter(t => t.projectType === filter);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredTestimonials.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, [isAutoPlaying, filteredTestimonials.length]);

  const nextTestimonial = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % filteredTestimonials.length);
  };

  const prevTestimonial = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + filteredTestimonials.length) % filteredTestimonials.length);
  };

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    setCurrentIndex(0);
  };

  // Ensure currentIndex is valid after filter change
  const safeIndex = Math.min(currentIndex, filteredTestimonials.length - 1);
  const currentTestimonial = filteredTestimonials[safeIndex];

  if (!currentTestimonial) return null;

  return (
    <section id="testimonials" className="section-padding bg-secondary/30">
      <div className="container-tight">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <span className="text-accent font-medium text-sm tracking-widest uppercase mb-4 block">
            Témoignages
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-4">
            Ce que disent nos clients
          </h2>
          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-6">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i < Math.floor(testimonialStats.averageRating) ? "fill-accent text-accent" : i < testimonialStats.averageRating ? "fill-accent/50 text-accent/50" : "fill-muted text-muted"}`}
                />
              ))}
            </div>
            <span className="font-medium">{testimonialStats.averageRating}/5</span>
            <span>•</span>
            <span>{testimonialStats.totalReviews} avis sur {testimonialStats.platform}</span>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Compétences:</span>
              <span className="font-semibold text-foreground">{testimonialStats.skills}/5</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Communication:</span>
              <span className="font-semibold text-foreground">{testimonialStats.communication}/5</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Qualité/Prix:</span>
              <span className="font-semibold text-foreground">{testimonialStats.valueForMoney}/5</span>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => handleFilterChange("all")}
            className="rounded-full"
          >
            Tous ({testimonials.length})
          </Button>
          {["Salle de bain", "Rénovation complète", "Cuisine", "Appartement"].map((type) => {
            const count = testimonials.filter(t => t.projectType?.includes(type) || t.role?.includes(type)).length;
            if (count === 0) return null;
            return (
              <Button
                key={type}
                variant={filter === type ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange(type)}
                className="rounded-full"
              >
                {type}
              </Button>
            );
          })}
        </div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-4xl mx-auto">
          {/* Quote Icon */}
          <Quote className="absolute -top-6 left-0 md:left-8 w-16 h-16 text-accent/20" />
          
          {/* Content */}
          <div className="bg-background rounded-sm shadow-card p-8 md:p-12 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <div className="flex">
                {[...Array(currentTestimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                ))}
              </div>
              {currentTestimonial.projectType && (
                <span className="text-xs bg-secondary px-3 py-1 rounded-full text-muted-foreground">
                  {currentTestimonial.projectType}
                </span>
              )}
            </div>
            
            <p className="text-foreground text-lg md:text-xl leading-relaxed mb-8 font-display italic">
              "{currentTestimonial.text}"
            </p>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-foreground">{currentTestimonial.name}</p>
                <p className="text-muted-foreground text-sm">{currentTestimonial.role}</p>
                <p className="text-muted-foreground text-xs mt-1">{currentTestimonial.date}</p>
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

          {/* Progress bar */}
          <div className="mt-6 flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {safeIndex + 1} / {filteredTestimonials.length}
            </span>
            <div className="flex-1 h-1 bg-border rounded-full overflow-hidden">
              <div 
                className="h-full bg-accent transition-all duration-300"
                style={{ width: `${((safeIndex + 1) / filteredTestimonials.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Quick navigation dots (show max 10) */}
          {filteredTestimonials.length <= 10 && (
            <div className="flex justify-center gap-2 mt-4">
              {filteredTestimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setCurrentIndex(index);
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    index === safeIndex ? "bg-accent w-8" : "bg-border hover:bg-muted-foreground"
                  }`}
                  aria-label={`Aller au témoignage ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="https://www.houzz.fr/professionnels/artisan-et-entreprise-generale-de-batiment/qualirenovation-by-qualiconcept-pfvwfr-pf~1259357618/avis"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-accent hover:underline font-medium"
          >
            Voir tous les avis sur Houzz
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
