import { Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

const InstagramFeed = () => {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container-tight">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-gold mb-4">
            <Instagram className="w-5 h-5" />
            <span className="text-sm font-medium uppercase tracking-wider">Suivez-nous</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-primary mb-4">
            @qualirenovation__travaux
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Découvrez nos dernières réalisations et l'envers du décor de nos chantiers sur Instagram
          </p>
        </div>

        {/* Instagram Widget Container */}
        <div className="relative">
          {/* LightWidget embed - Replace with your widget code */}
          <div 
            id="instagram-widget"
            className="min-h-[400px] flex items-center justify-center"
          >
            {/* Instructions for setup */}
            <div className="text-center p-8 border-2 border-dashed border-muted-foreground/30 rounded-lg max-w-xl mx-auto">
              <Instagram className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Widget Instagram</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Pour afficher automatiquement vos posts Instagram, créez un widget gratuit sur{" "}
                <a 
                  href="https://lightwidget.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gold hover:underline"
                >
                  LightWidget.com
                </a>{" "}
                et partagez le code d'intégration.
              </p>
              <Button 
                variant="outline" 
                asChild
              >
                <a 
                  href="https://www.instagram.com/qualirenovation__travaux/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  <Instagram className="w-4 h-4" />
                  Voir notre Instagram
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <Button 
            variant="default" 
            size="lg"
            asChild
          >
            <a 
              href="https://www.instagram.com/qualirenovation__travaux/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2"
            >
              <Instagram className="w-5 h-5" />
              Suivre sur Instagram
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default InstagramFeed;
