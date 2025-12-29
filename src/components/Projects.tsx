import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Images, Loader2, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProjects } from "@/hooks/use-projects";

const Projects = () => {
  const { projects, categories, isLoading, isFromDB } = useProjects();
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [visibleCount, setVisibleCount] = useState(6);

  // Reset visible count when projects change
  useEffect(() => {
    setVisibleCount(6);
  }, [projects]);

  const filteredProjects =
    activeCategory === "Tous"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

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
    <section id="projects" className="section-padding bg-secondary/30">
      <div className="container-tight">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <span className="text-accent font-medium text-sm tracking-widest uppercase mb-4 block">
            Portfolio
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-4">
            Nos réalisations
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
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
            <div className="flex flex-wrap justify-center gap-3 mb-12 animate-fade-in-up animation-delay-200">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-5 py-2.5 rounded-sm text-sm font-medium transition-all duration-300 ${
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleProjects.map((project, index) => (
                <Link
                  key={project.id}
                  to={`/projet/${project.slug}`}
                  className="group relative overflow-hidden rounded-sm shadow-elegant hover:shadow-hover transition-all duration-500 animate-fade-in-up block"
                  style={{ animationDelay: `${(index % 6) * 100}ms` }}
                >
                  <div className="aspect-[3/2] overflow-hidden bg-muted">
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
                  <div className="absolute top-4 right-4 bg-charcoal/70 backdrop-blur-sm text-cream px-3 py-1.5 rounded-sm text-xs font-medium flex items-center gap-1.5">
                    <Images className="w-3.5 h-3.5" />
                    {project.photoCount}
                  </div>
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <span className="text-gold-light text-sm font-medium mb-2 block">
                        {project.category} • {project.location}
                      </span>
                      <h3 className="font-display text-lg text-cream font-semibold mb-3 line-clamp-2">
                        {project.title}
                      </h3>
                      <span className="inline-flex items-center gap-2 text-cream text-sm font-medium">
                        Voir le projet
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>

                  {/* Static Label */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-charcoal/80 to-transparent group-hover:opacity-0 transition-opacity duration-500">
                    <span className="text-gold-light text-xs font-medium">
                      {project.location}
                    </span>
                    <h3 className="font-display text-base text-cream font-semibold line-clamp-2">
                      {project.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>

            {/* Load More / View All on Houzz */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 animate-fade-in-up">
              {hasMore && (
                <Button variant="outline" size="lg" onClick={loadMore}>
                  Afficher plus de projets
                </Button>
              )}
              <Button 
                variant="default" 
                size="lg"
                asChild
              >
                <a 
                  href="https://www.houzz.fr/professionnels/artisan-et-entreprise-generale-de-batiment/qualirenovation-by-qualiconcept-pfvwfr-pf~1259357618" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Voir les 115 projets sur Houzz
                  <ArrowRight className="w-5 h-5" />
                </a>
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Projects;
