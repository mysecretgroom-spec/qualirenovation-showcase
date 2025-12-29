import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Award, Star } from "lucide-react";
import heroImage from "@/assets/hero-renovation.jpg";
import QuoteModal from "./QuoteModal";

const Hero = () => {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Rénovation d'intérieur luxueuse à Paris"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-hero" />
        </div>

        {/* Content */}
        <div className="relative z-10 container-tight text-center text-background pt-20">
          {/* Badge */}
          <a 
            href="https://www.houzz.fr/pro/qualiconcept/qualirenovation-by-qualiconcept"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-background/10 backdrop-blur-sm border border-background/20 rounded-full px-5 py-2 mb-8 animate-fade-in hover:bg-background/20 hover:border-gold-light/50 transition-all cursor-pointer group"
          >
            <Award className="w-4 h-4 text-gold-light group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">Lauréat de 11 Best of Houzz</span>
            <span className="text-xs text-background/60 group-hover:text-gold-light transition-colors">→ Voir le profil</span>
          </a>

          {/* Title */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-tight mb-6 animate-fade-in-up">
            Rénovation d'excellence
            <br />
            <span className="italic font-normal">à Paris & Île-de-France</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-background/80 max-w-2xl mx-auto mb-10 animate-fade-in-up animation-delay-200">
            Une rénovation de qualité en toute sérénité. Depuis plus de 10 ans, 
            nous transformons vos espaces avec passion et expertise.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up animation-delay-300">
            <Button 
              variant="heroSolid" 
              size="lg"
              onClick={() => setIsQuoteModalOpen(true)}
            >
              Demander un devis gratuit
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button 
              variant="hero" 
              size="lg"
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Découvrir nos projets
            </Button>
          </div>

          {/* Rating */}
          <div className="flex items-center justify-center gap-6 animate-fade-in-up animation-delay-400">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i < 4 ? "fill-gold-light text-gold-light" : "fill-gold-light/50 text-gold-light/50"}`}
                />
              ))}
            </div>
            <span className="text-background/80">
              <strong className="text-background">4.5/5</strong> basé sur 53 avis
            </span>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-float">
          <div className="w-6 h-10 border-2 border-background/30 rounded-full flex items-start justify-center p-1.5">
            <div className="w-1.5 h-2.5 bg-background/50 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      <QuoteModal open={isQuoteModalOpen} onOpenChange={setIsQuoteModalOpen} />
    </>
  );
};

export default Hero;
