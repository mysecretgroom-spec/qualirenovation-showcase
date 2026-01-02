import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ExternalLink, ArrowRight, Newspaper } from "lucide-react";
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

const sourceColors: Record<string, string> = {
  "Houzz": "bg-green-500/10 text-green-700",
  "Houzz UK": "bg-green-500/10 text-green-700",
  "Elle Déco": "bg-pink-500/10 text-pink-700",
  "Marie Claire Maison": "bg-red-500/10 text-red-700",
  "Huffington Post": "bg-blue-500/10 text-blue-700",
  "18h39": "bg-orange-500/10 text-orange-700",
  "LinkedIn": "bg-sky-500/10 text-sky-700",
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

  const getSourceColor = (source: string) => {
    return sourceColors[source] || "bg-muted text-muted-foreground";
  };

  if (loading || mentions.length === 0) return null;

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-3">
              Presse
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              On parle de nous
            </h2>
            <p className="text-muted-foreground mt-2">
              Nos réalisations dans les médias de la décoration
            </p>
          </div>
          <Link 
            to="/on-parle-de-nous" 
            className="inline-flex items-center gap-2 text-primary hover:underline font-medium group"
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
            {mentions.map((mention) => (
              <CarouselItem key={mention.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <a
                  href={mention.article_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block h-full p-6 bg-card border border-border rounded-xl hover:border-primary/50 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                      <Newspaper className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getSourceColor(mention.source)}`}>
                        {mention.source}
                      </span>
                      {mention.date && (
                        <p className="text-xs text-muted-foreground mt-1">{mention.date}</p>
                      )}
                    </div>
                  </div>
                  <h3 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-3 mb-4">
                    {mention.title}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-primary">
                    <span>Lire l'article</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                </a>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-4" />
          <CarouselNext className="hidden md:flex -right-4" />
        </Carousel>

        {/* Source logos */}
        <div className="mt-10 flex flex-wrap justify-center gap-6 opacity-60">
          {["Houzz", "Elle Déco", "Marie Claire Maison", "Huffington Post", "18h39"].map((source) => (
            <span 
              key={source}
              className="text-sm font-medium text-muted-foreground"
            >
              {source}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PressCarousel;
