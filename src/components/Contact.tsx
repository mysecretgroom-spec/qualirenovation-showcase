import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock, ArrowRight } from "lucide-react";
import QuoteModal from "./QuoteModal";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const contactInfo = [
  {
    icon: MapPin,
    title: "Adresse",
    details: ["6 rue d'Armaillé", "75017 Paris"],
  },
  {
    icon: Phone,
    title: "Téléphone",
    details: ["Appelez-nous pour un devis"],
  },
  {
    icon: Mail,
    title: "Email",
    details: ["contact@qualiconcept.fr"],
  },
  {
    icon: Clock,
    title: "Horaires",
    details: ["Lun - Ven: 9h00 - 18h00", "Sam: Sur rendez-vous"],
  },
];

const Contact = () => {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const { ref, animationClasses } = useScrollAnimation();

  return (
    <>
      <section ref={ref} id="contact" className={`section-padding bg-background ${animationClasses}`}>
        <div className="container-tight px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left Column - Info */}
            <div>
              <span className="text-accent font-medium text-xs sm:text-sm tracking-widest uppercase mb-3 sm:mb-4 block">
                Contact
              </span>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-4 sm:mb-6">
                Parlons de votre
                <br />
                <span className="italic font-normal text-muted-foreground">projet</span>
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-8 sm:mb-10">
                Consultation gratuite, devis détaillé sous 48h. 
                Décrivez-nous votre projet et nous vous recontacterons rapidement.
              </p>

              {/* Contact Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 sm:gap-6">
                {contactInfo.map((info) => (
                  <div key={info.title} className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-sm bg-secondary flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm sm:text-base mb-0.5 sm:mb-1">{info.title}</h4>
                      {info.details.map((detail, i) => (
                        <p key={i} className="text-muted-foreground text-xs sm:text-sm">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Company Info */}
              <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-border">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  <strong className="text-foreground">QUALIRENOVATION BY QUALICONCEPT</strong>
                  <br />
                  SIRET : 85286728200034
                  <br />
                  Assuré par MIC Assurance
                </p>
              </div>
            </div>

            {/* Right Column - CTA Card */}
            <div>
              <div className="bg-card p-6 sm:p-8 md:p-12 rounded-sm shadow-card text-center">
                <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-semibold text-foreground mb-3 sm:mb-4">
                  Demande de devis gratuit
                </h3>
                <p className="text-muted-foreground mb-6 sm:mb-8 max-w-md mx-auto text-sm sm:text-base">
                  Obtenez une estimation personnalisée pour votre projet de rénovation. 
                  Réponse garantie sous 48h.
                </p>
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6"
                  onClick={() => setIsQuoteModalOpen(true)}
                >
                  Demander un devis
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-4 sm:mt-6">
                  Consultation gratuite • Sans engagement
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <QuoteModal open={isQuoteModalOpen} onOpenChange={setIsQuoteModalOpen} />
    </>
  );
};

export default Contact;
