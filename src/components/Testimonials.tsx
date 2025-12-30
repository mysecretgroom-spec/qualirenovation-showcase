import { Star, Quote, ChevronRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  rating: number;
  text: string;
  date: string | null;
  project_type: string | null;
}

const Testimonials = () => {
  const { ref, animationClasses } = useScrollAnimation();
  const autoplayPlugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  // Fetch visible testimonials from database
  const { data: testimonials = [], isLoading, error } = useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      console.log("Fetching testimonials...");
      const { data, error } = await supabase
        .from("houzz_testimonials")
        .select("id, name, role, rating, text, date, project_type")
        .eq("hidden", false)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching testimonials:", error);
        throw error;
      }
      console.log("Testimonials fetched:", data?.length);
      return data as Testimonial[];
    },
    retry: 3,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Log any errors
  if (error) {
    console.error("Testimonials query error:", error);
  }

  // Calculate stats from testimonials
  const testimonialStats = {
    totalReviews: testimonials.length,
    averageRating: testimonials.length > 0 
      ? Math.round((testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length) * 10) / 10
      : 5,
    platform: "Houzz",
  };

  if (isLoading) {
    return (
      <section id="testimonials" className="section-padding bg-secondary/30">
        <div className="container-tight flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </section>
    );
  }

  // Always render the section, even if empty, to debug
  if (testimonials.length === 0) {
    console.warn("No testimonials to display");
    return (
      <section id="testimonials" className="section-padding bg-secondary/30">
        <div className="container-tight text-center py-12">
          <p className="text-muted-foreground">Chargement des avis...</p>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} id="testimonials" className={`section-padding bg-secondary/30 ${animationClasses}`}>
      <div className="container-tight">
        {/* Header */}
        <div className="text-center mb-12">
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
                  className={`w-5 h-5 ${i < Math.floor(testimonialStats.averageRating) ? "fill-accent text-accent" : "fill-muted text-muted"}`}
                />
              ))}
            </div>
            <span className="font-medium">{testimonialStats.averageRating}/5</span>
            <span>•</span>
            <span>{testimonialStats.totalReviews} avis sur {testimonialStats.platform}</span>
          </div>
        </div>

        {/* Carousel */}
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[autoplayPlugin.current]}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <div className="bg-background rounded-sm shadow-card p-6 h-full flex flex-col relative">
                  <Quote className="absolute top-4 right-4 w-8 h-8 text-accent/10" />
                  
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                    ))}
                  </div>
                  
                  <p className="text-foreground text-sm leading-relaxed mb-4 flex-1 font-display italic line-clamp-5">
                    "{testimonial.text}"
                  </p>
                  
                  <div className="border-t border-border pt-4 mt-auto">
                    <p className="font-semibold text-foreground text-sm">{testimonial.name}</p>
                    {testimonial.date && (
                      <p className="text-muted-foreground text-xs mt-1">{testimonial.date}</p>
                    )}
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-12" />
          <CarouselNext className="hidden md:flex -right-12" />
        </Carousel>

        {/* CTA */}
        <div className="text-center mt-10">
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
