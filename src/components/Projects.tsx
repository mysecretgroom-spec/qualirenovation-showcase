import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import projectBathroom from "@/assets/project-bathroom.jpg";
import projectKitchen from "@/assets/project-kitchen.jpg";
import projectLiving from "@/assets/project-living.jpg";
import projectBedroom from "@/assets/project-bedroom.jpg";

const categories = ["Tous", "Salle de Bain", "Cuisine", "Salon", "Chambre"];

const projects = [
  {
    id: 1,
    title: "Élégante Salle de Bain Ivoire et Laiton Brossé",
    category: "Salle de Bain",
    location: "Paris 16ème",
    image: projectBathroom,
  },
  {
    id: 2,
    title: "Cuisine Contemporaine Ouverte sur Séjour",
    category: "Cuisine",
    location: "Neuilly-sur-Seine",
    image: projectKitchen,
  },
  {
    id: 3,
    title: "Salon Haussmannien Modernisé",
    category: "Salon",
    location: "Paris 8ème",
    image: projectLiving,
  },
  {
    id: 4,
    title: "Suite Parentale Luxueuse",
    category: "Chambre",
    location: "Boulogne-Billancourt",
    image: projectBedroom,
  },
];

const Projects = () => {
  const [activeCategory, setActiveCategory] = useState("Tous");

  const filteredProjects =
    activeCategory === "Tous"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

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
            Découvrez une sélection de nos projets de rénovation à Paris et en Île-de-France.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 animate-fade-in-up animation-delay-200">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
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
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className="group relative overflow-hidden rounded-sm shadow-elegant hover:shadow-hover transition-all duration-500 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="text-gold-light text-sm font-medium mb-2 block">
                    {project.category} • {project.location}
                  </span>
                  <h3 className="font-display text-xl text-cream font-semibold mb-4">
                    {project.title}
                  </h3>
                  <Button variant="hero" size="sm">
                    Voir le projet
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Static Label */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-charcoal/80 to-transparent group-hover:opacity-0 transition-opacity duration-500">
                <span className="text-gold-light text-sm font-medium">
                  {project.category}
                </span>
                <h3 className="font-display text-lg text-cream font-semibold">
                  {project.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12 animate-fade-in-up">
          <Button variant="default" size="lg">
            Voir tous les projets
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Projects;
