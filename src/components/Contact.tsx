import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Phone, Mail, Clock, MapPin, ArrowRight, MessageCircle } from "lucide-react";
import QuoteModal from "./QuoteModal";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const Contact = () => {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const { ref, animationClasses } = useScrollAnimation();

  return (
    <>
      <section ref={ref} id="contact" className={`section-padding bg-background ${animationClasses}`}>
        <div className="container-tight px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8 sm:mb-10">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-2 sm:mb-3">
              Parlons de votre
              <br />
              <span className="italic font-normal text-muted-foreground">projet</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-xl">
              Consultation gratuite, devis détaillé sous 48h. Décrivez-nous votre projet et nous vous recontacterons rapidement.
            </p>
          </div>

          {/* Contact Grid 2x2 */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-6 sm:gap-y-8 mb-8 sm:mb-10">
            {/* Adresse */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                <MapPin className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground text-sm sm:text-base mb-0.5">Adresse</h3>
                <p className="text-muted-foreground text-xs sm:text-sm">6 rue d'Armaillé<br />75017 Paris</p>
              </div>
            </div>

            {/* Téléphone */}
            <a href="tel:0659764685" className="flex items-start gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-accent/10 transition-colors">
                <Phone className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground text-sm sm:text-base mb-0.5 group-hover:text-accent transition-colors">Téléphone</h3>
                <p className="text-muted-foreground text-xs sm:text-sm">Appelez-nous pour un<br />devis</p>
              </div>
            </a>

            {/* Email */}
            <a href="mailto:contact@qualiconcept.fr" className="flex items-start gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-accent/10 transition-colors">
                <Mail className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground text-sm sm:text-base mb-0.5 group-hover:text-accent transition-colors">Email</h3>
                <p className="text-muted-foreground text-xs sm:text-sm">contact@qualiconcept.fr</p>
              </div>
            </a>

            {/* Horaires */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                <Clock className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground text-sm sm:text-base mb-0.5">Horaires</h3>
                <p className="text-muted-foreground text-xs sm:text-sm">Lun – Ven : 9h00 – 18h00<br />Sam : Sur rendez-vous</p>
              </div>
            </div>
          </div>

          {/* CTA + Phone + WhatsApp */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            <Button 
              size="lg" 
              className="w-full sm:w-auto text-base px-8 py-5"
              onClick={() => setIsQuoteModalOpen(true)}
            >
              Demander un devis
              <ArrowRight className="w-5 h-5" />
            </Button>
            <a 
              href="tel:0659764685"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-border bg-background text-foreground px-8 py-3.5 rounded-sm font-medium hover:bg-secondary transition-colors text-base"
            >
              <Phone className="w-4 h-4 text-accent" />
              06 59 76 46 85
            </a>
            <a 
              href="https://wa.me/33659764685"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-border bg-background text-foreground px-8 py-3.5 rounded-sm font-medium hover:bg-secondary transition-colors text-base"
            >
              <MessageCircle className="w-4 h-4 text-accent" />
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      <QuoteModal open={isQuoteModalOpen} onOpenChange={setIsQuoteModalOpen} />
    </>
  );
};

export default Contact;
