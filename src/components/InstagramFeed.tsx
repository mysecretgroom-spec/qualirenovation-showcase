import { useEffect } from "react";
import { Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

const InstagramFeed = () => {
  useEffect(() => {
    // Load LightWidget script
    const script = document.createElement("script");
    script.src = "https://cdn.lightwidget.com/widgets/lightwidget.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector('script[src="https://cdn.lightwidget.com/widgets/lightwidget.js"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

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
          <iframe 
            src="//lightwidget.com/widgets/c113904bb8ef52dfb7ce9b5337127d8c.html" 
            scrolling="no" 
            allowTransparency={true}
            className="lightwidget-widget w-full border-0 overflow-hidden"
            style={{ minHeight: "400px" }}
          />
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
