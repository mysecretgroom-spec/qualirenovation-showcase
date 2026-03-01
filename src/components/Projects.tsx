import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Images, Loader2, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProjects } from "@/hooks/use-projects";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import QuoteModal from "./QuoteModal";

const projectTaglines: Record<string, string[]> = {
  "Rénovation complète": [
    "Transformation totale",
    "Rénovation sur-mesure",
    "Un intérieur repensé",
    "Nouvelle vie, même adresse",
  ],
  "Salle de Bain": [
    "Élégance & bien-être",
    "Finitions soignées",
    "Un espace détente unique",
    "Design & fonctionnalité",
  ],
  "Cuisine": [
    "Cuisine pensée pour vous",
    "Convivialité & design",
    "L'art de recevoir",
  ],
  "Salon": [
    "Un espace de vie repensé",
    "Confort & élégance",
  ],
  "Chambre": [
    "Un cocon sur mesure",
    "Repos & raffinement",
  ],
  "Menuiserie": [
    "Savoir-faire artisanal",
    "Bois & finitions nobles",
  ],
  "Parquet": [
    "Le charme du bois",
    "Un sol d'exception",
  ],
  "Boiseries murale": [
    "Cachet & caractère",
    "L'art du détail",
  ],
  default: [
    "Un projet d'exception",
    "Savoir-faire artisanal",
    "Qualité & exigence",
  ],
};

const getTagline = (category: string, index: number) => {
  const lines = projectTaglines[category] || projectTaglines.default;
  return lines[index % lines.length];
};

const Projects = () => {
  const { projects, categories, isLoading, isFromDB } = useProjects();
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [visibleCount, setVisibleCount] = useState(6);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const { ref, animationClasses } = useScrollAnimation();

  // Reset visible count when projects change
  useEffect(() => {
    setVisibleCount(6);
  }, [projects]);

  const filteredProjects =
    activeCategory === "Tous"
      ? projects
      : projects.filter((p) => p.category === activeCategory || (p.tags && p.tags.includes(activeCategory)));

  const visibleProjects = filteredProjects.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProjects.length;

  const loadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setVisibleCount(6);
  };

  return (
    <section ref={ref} id="projects" className={`section-padding bg-secondary/30 ${animationClasses}`}>
      <div className="container-tight px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <span className="text-accent font-nunito font-bold text-sm sm:text-base tracking-widest uppercase mb-3 sm:mb-4 block">
            Nos Réalisations
          </span>
          <h2 className="font-nunito text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-3 sm:mb-4">
            Nos réalisations
          </h2>
          <p className="text-muted-foreground font-nunito text-lg sm:text-xl max-w-2xl mx-auto">
            Découvrez nos {projects.length} projets de rénovation à Paris et en Île-de-France. 
            Plus de 115 réalisations sur Houzz.
          </p>
          {isFromDB && (
            <p className="text-xs text-accent mt-2 flex items-center justify-center gap-1">
              <Database className="w-3 h-3" />
              Projets synchronisés depuis Houzz
            </p>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
            <span className="ml-3 text-muted-foreground">Chargement des projets...</span>
          </div>
        )}

        {!isLoading && (
          <>
            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-sm text-xs sm:text-sm font-medium transition-all duration-300 ${
                    activeCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "bg-background text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {visibleProjects.map((project, index) => (
                <div key={project.id} className="flex flex-col">
                  <Link
                    to={`/projet/${project.slug}`}
                    className="group relative overflow-hidden rounded-t-sm shadow-elegant hover:shadow-hover transition-all duration-500 block"
                    style={{ transitionDelay: `${(index % 6) * 100}ms` }}
                  >
                    <div className="aspect-[4/3] sm:aspect-[3/2] overflow-hidden bg-muted">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder.svg";
                        }}
                      />
                    </div>
                    
                    {/* Photo count badge */}
                    <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-charcoal/70 backdrop-blur-sm text-cream px-2 py-1 sm:px-3 sm:py-1.5 rounded-sm text-[10px] sm:text-xs font-medium flex items-center gap-1">
                      <Images className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                      {project.photoCount}
                    </div>
                    
                    {/* Overlay - Hidden on mobile */}
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden sm:block">
                      <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <span className="text-gold-light text-sm font-nunito font-semibold mb-2 block">
                          {project.category} • {project.location}
                        </span>
                        <h3 className="font-nunito text-xl text-cream font-bold mb-3 line-clamp-2">
                          {project.title}
                        </h3>
                        <span className="inline-flex items-center gap-2 text-cream text-sm font-medium">
                          Voir le projet
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>

                    {/* Static Label - Always visible on mobile, fade on hover desktop */}
                    <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-5 bg-gradient-to-t from-charcoal/90 to-transparent sm:from-charcoal/80 sm:group-hover:opacity-0 transition-opacity duration-500">
                      <span className="text-gold-light text-[10px] sm:text-xs font-nunito font-semibold hidden sm:block">
                        {project.location}
                      </span>
                      <h3 className="font-nunito text-sm sm:text-lg text-cream font-bold line-clamp-2">
                        {project.title}
                      </h3>
                    </div>
                  </Link>

                  {/* CTA tagline under each card */}
                  <button
                    onClick={() => setIsQuoteModalOpen(true)}
                    className="bg-primary/5 border border-border rounded-b-sm px-3 py-2.5 sm:px-4 sm:py-3 flex items-center justify-between gap-2 hover:bg-primary/10 transition-colors duration-300 group/cta"
                  >
                    <span className="text-xs sm:text-sm text-foreground/80 font-nunito font-semibold">
                      {getTagline(project.category, index)}
                    </span>
                    <span className="text-[10px] sm:text-xs text-accent font-semibold whitespace-nowrap flex items-center gap-1 group-hover/cta:gap-2 transition-all">
                      Devis gratuit
                      <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </span>
                  </button>
                </div>
              ))}
            </div>

            {/* Load More / View All on Houzz */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-8 sm:mt-12">
              {hasMore && (
                <Button variant="outline" size="lg" onClick={loadMore} className="w-full sm:w-auto text-sm sm:text-base">
                  Afficher plus de projets
                </Button>
              )}
              <Button 
                variant="default" 
                size="lg"
                asChild
                className="w-full sm:w-auto text-sm sm:text-base"
              >
                <a 
                  href="https://www.houzz.fr/professionnels/artisan-et-entreprise-generale-de-batiment/qualirenovation-by-qualiconcept-pfvwfr-pf~1259357618" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <span className="hidden sm:inline">Voir les 115 projets sur Houzz</span>
                  <span className="sm:hidden">Tous les projets</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              </Button>
            </div>
          </>
        )}
      </div>

      <QuoteModal open={isQuoteModalOpen} onOpenChange={setIsQuoteModalOpen} />
    </section>
  );
};

export default Projects;
