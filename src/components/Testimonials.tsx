import { useState } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "./ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  rating: number;
  text: string;
  date: string | null;
  project_type: string | null;
}

const ITEMS_PER_PAGE = 6;

const Testimonials = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<string>("all");
  const { ref, animationClasses } = useScrollAnimation();

  // Fetch visible testimonials from database
  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("houzz_testimonials")
        .select("id, name, role, rating, text, date, project_type")
        .eq("hidden", false)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Testimonial[];
    },
  });

  // Calculate stats from testimonials
  const testimonialStats = {
    totalReviews: testimonials.length,
    averageRating: testimonials.length > 0 
      ? Math.round((testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length) * 10) / 10
      : 5,
    platform: "Houzz",
  };

  // Filter testimonials based on selected type
  const filteredTestimonials = filter === "all" 
    ? testimonials 
    : testimonials.filter(t => t.project_type?.includes(filter) || t.role?.includes(filter));

  // Pagination
  const totalPages = Math.ceil(filteredTestimonials.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTestimonials = filteredTestimonials.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    // Scroll to testimonials section
    document.getElementById("testimonials")?.scrollIntoView({ behavior: "smooth" });
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

  if (testimonials.length === 0) {
    return null;
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
            const count = testimonials.filter(t => t.project_type?.includes(type) || t.role?.includes(type)).length;
            if (count === 0) return null;
            return (
              <Button
                key={type}
                variant={filter === type ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange(type)}
                className="rounded-full"
              >
                {type} ({count})
              </Button>
            );
          })}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedTestimonials.map((testimonial) => (
            <div 
              key={testimonial.id} 
              className="bg-background rounded-sm shadow-card p-6 relative flex flex-col"
            >
              <Quote className="absolute top-4 right-4 w-8 h-8 text-accent/10" />
              
              <div className="flex items-center justify-between mb-3">
                <div className="flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                {testimonial.project_type && (
                  <span className="text-xs bg-secondary px-2 py-1 rounded-full text-muted-foreground">
                    {testimonial.project_type}
                  </span>
                )}
              </div>
              
              <p className="text-foreground text-sm leading-relaxed mb-4 flex-1 font-display italic line-clamp-4">
                "{testimonial.text}"
              </p>
              
              <div className="border-t border-border pt-4 mt-auto">
                <p className="font-semibold text-foreground text-sm">{testimonial.name}</p>
                {testimonial.role && (
                  <p className="text-muted-foreground text-xs">{testimonial.role}</p>
                )}
                {testimonial.date && (
                  <p className="text-muted-foreground text-xs mt-1">{testimonial.date}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="rounded-sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => goToPage(page)}
                  className="w-8 h-8 rounded-sm p-0"
                >
                  {page}
                </Button>
              ))}
            </div>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="rounded-sm"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Results info */}
        <p className="text-center text-sm text-muted-foreground mt-4">
          Affichage de {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredTestimonials.length)} sur {filteredTestimonials.length} avis
        </p>

        {/* CTA */}
        <div className="text-center mt-8">
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
