import { useEffect } from "react";
import { Instagram } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const InstagramFeed = () => {
  const { ref, animationClasses } = useScrollAnimation();

  useEffect(() => {
    // Load LightWidget script
    const script = document.createElement("script");
    script.src = "https://cdn.lightwidget.com/widgets/lightwidget.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      const existingScript = document.querySelector('script[src="https://cdn.lightwidget.com/widgets/lightwidget.js"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return (
    <section 
      ref={ref}
      className={`py-20 bg-secondary/30 ${animationClasses}`}
    >
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
          src="https://cdn.lightwidget.com/widgets/2ee40805029b5806816cc8dd6ddc766f.html" 
          scrolling="no"
          allowTransparency={true}
          className="lightwidget-widget w-full border-0 overflow-hidden"
          style={{ minHeight: "400px" }}
        />
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <a 
            href="https://www.instagram.com/qualirenovation__travaux/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full text-white font-semibold text-lg
              bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737]
              hover:from-[#7232a0] hover:via-[#c9295f] hover:to-[#e06830]
              shadow-lg hover:shadow-xl hover:shadow-pink-500/25
              transform transition-all duration-300 ease-out
              hover:scale-105 hover:-translate-y-1"
          >
            <Instagram className="w-6 h-6 transition-transform duration-300 group-hover:rotate-12" />
            <span>Suivre sur Instagram</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default InstagramFeed;
