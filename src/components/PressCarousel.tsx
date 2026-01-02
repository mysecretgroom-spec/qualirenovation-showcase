import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ExternalLink, ArrowRight, Sparkles } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

interface PressMention {
  id: string;
  date: string | null;
  source: string;
  title: string;
  article_url: string;
  featured: boolean;
}

// Logos and brand colors for each source
const sourceLogos: Record<string, { logo: string; color: string; bgColor: string }> = {
  "Houzz": { 
    logo: "/houzz-icon.png", 
    color: "#4caf50", 
    bgColor: "bg-[#4caf50]/10" 
  },
  "Houzz UK": { 
    logo: "/houzz-icon.png", 
    color: "#4caf50", 
    bgColor: "bg-[#4caf50]/10" 
  },
  "Elle Déco": { 
    logo: "", 
    color: "#000000", 
    bgColor: "bg-black/5" 
  },
  "Marie Claire Maison": { 
    logo: "", 
    color: "#e53935", 
    bgColor: "bg-red-500/10" 
  },
  "Huffington Post": { 
    logo: "", 
    color: "#0dbe98", 
    bgColor: "bg-emerald-500/10" 
  },
  "18h39": { 
    logo: "", 
    color: "#ff6b35", 
    bgColor: "bg-orange-500/10" 
  },
  "LinkedIn": { 
    logo: "", 
    color: "#0a66c2", 
    bgColor: "bg-blue-600/10" 
  },
};

const PressCarousel = () => {
  const [mentions, setMentions] = useState<PressMention[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMentions = async () => {
      const { data, error } = await supabase
        .from("press_mentions")
        .select("id, date, source, title, article_url, featured")
        .eq("featured", true)
        .order("display_order", { ascending: true })
        .limit(10);

      if (!error && data) {
        setMentions(data);
      }
      setLoading(false);
    };

    fetchMentions();
  }, []);

  const getSourceInfo = (source: string) => {
    return sourceLogos[source] || { logo: "", color: "#888888", bgColor: "bg-muted" };
  };

  // Get unique sources for the logo banner
  const sources = [...new Set(mentions.map(m => m.source))];

  if (loading || mentions.length === 0) return null;

  return (
    <section className="py-20 bg-gradient-to-br from-muted/50 via-background to-primary/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.06),transparent_50%)]" />
      
      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
              <Sparkles className="w-4 h-4" />
              Presse & Médias
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              On parle de nous
            </h2>
            <p className="text-muted-foreground mt-2 max-w-md">
              Nos réalisations mises en avant dans les médias de la décoration
            </p>
          </div>
          <Link 
            to="/on-parle-de-nous" 
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25 group"
          >
            Voir toutes les publications
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Carousel */}
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 4000,
              stopOnInteraction: true,
            }),
          ]}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {mentions.map((mention) => {
              const info = getSourceInfo(mention.source);
              return (
                <CarouselItem key={mention.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <a
                    href={mention.article_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block h-full bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all duration-300"
                  >
                    {/* Gradient top bar */}
                    <div 
                      className="h-1.5 w-full"
                      style={{ backgroundColor: info.color }}
                    />
                    
                    <div className="p-6">
                      {/* Source header */}
                      <div className="flex items-center gap-3 mb-4">
                        {info.logo ? (
                          <div className="w-11 h-11 rounded-xl bg-white shadow-sm flex items-center justify-center p-2 border border-border/50">
                            <img 
                              src={info.logo} 
                              alt={mention.source} 
                              className="w-full h-full object-contain"
                            />
                          </div>
                        ) : (
                          <div 
                            className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm"
                            style={{ backgroundColor: info.color }}
                          >
                            {mention.source.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-foreground">{mention.source}</p>
                          {mention.date && (
                            <p className="text-sm text-muted-foreground">{mention.date}</p>
                          )}
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-3 mb-4 leading-relaxed">
                        {mention.title}
                      </h3>

                      {/* CTA */}
                      <div className="flex items-center gap-2 text-primary font-medium text-sm">
                        <span>Lire l'article</span>
                        <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </a>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-4 bg-card border-border hover:bg-muted" />
          <CarouselNext className="hidden md:flex -right-4 bg-card border-border hover:bg-muted" />
        </Carousel>

        {/* Source logos banner */}
        <div className="mt-12 pt-8 border-t border-border/50">
          <p className="text-center text-xs text-muted-foreground mb-6 uppercase tracking-wider">
            Ils parlent de nous
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
            {["Houzz", "Elle Déco", "Marie Claire Maison", "Huffington Post", "18h39"].map((source) => {
              const info = getSourceInfo(source);
              return (
                <div 
                  key={source}
                  className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity"
                >
                  {info.logo ? (
                    <img src={info.logo} alt={source} className="w-6 h-6 object-contain" />
                  ) : (
                    <div 
                      className="w-6 h-6 rounded-md flex items-center justify-center text-white font-bold text-xs"
                      style={{ backgroundColor: info.color }}
                    >
                      {source.charAt(0)}
                    </div>
                  )}
                  <span className="font-medium text-foreground text-sm">{source}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PressCarousel;
