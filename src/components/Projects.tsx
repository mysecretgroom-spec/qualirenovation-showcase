import { useState } from "react";
import { ArrowRight, Images } from "lucide-react";
import { Button } from "@/components/ui/button";

// Import des images Houzz
import appartementTransforme from "@/assets/projects/appartement-transforme.jpg";
import appartementGobelins from "@/assets/projects/appartement-gobelins.jpg";
import f4Gobelins from "@/assets/projects/f4-gobelins.jpg";
import murPorteur from "@/assets/projects/mur-porteur.jpg";
import paris19 from "@/assets/projects/paris-19.jpg";
import laMuette from "@/assets/projects/la-muette.jpg";
import vueEnsemble from "@/assets/projects/vue-ensemble.jpg";
import renovationMaison from "@/assets/projects/renovation-maison.jpg";
import salleBainXxl from "@/assets/projects/salle-bain-xxl.jpg";
import paris13 from "@/assets/projects/paris-13.jpg";
import avantApresSdb from "@/assets/projects/avant-apres-sdb.jpg";
import parlonsProjet from "@/assets/projects/parlons-projet.jpg";

const categories = ["Tous", "Rénovation complète", "Salle de Bain", "Cuisine", "Salon", "Chambre"];

const projects = [
  {
    id: 1,
    title: "Un appartement transformé pour mieux louer : confort et DPE amélioré",
    category: "Rénovation complète",
    location: "Paris",
    image: appartementTransforme,
    photoCount: 27,
    houzzUrl: "https://www.houzz.fr/hznb/projets/un-appartement-transforme-pour-mieux-louer-confort-et-dpe-ameliore-pj-vj~7739460"
  },
  {
    id: 2,
    title: "Réinventer un appartement parisien pour des clients en province",
    category: "Rénovation complète",
    location: "Paris - Gobelins",
    image: appartementGobelins,
    photoCount: 7,
    houzzUrl: "https://www.houzz.fr/hznb/projets/reinventer-un-appartement-parisien-pour-des-clients-en-province-pj-vj~7738195"
  },
  {
    id: 3,
    title: "Au Gobelins : F4 entièrement réorchestré",
    category: "Rénovation complète",
    location: "Paris - Gobelins",
    image: f4Gobelins,
    photoCount: 12,
    houzzUrl: "https://www.houzz.fr/hznb/projets/au-gobelins-cet-ancien-f4-a-ete-entierement-reorchestre-pour-offrir-une-nouvel-pj-vj~7738188"
  },
  {
    id: 4,
    title: "Ouverture de mur porteur : ouvrir deux pièces en toute sécurité",
    category: "Rénovation complète",
    location: "Paris",
    image: murPorteur,
    photoCount: 6,
    houzzUrl: "https://www.houzz.fr/hznb/projets/vous-voulez-ouvrir-deux-pieces-mais-zut-il-y-a-un-mur-porteur-pj-vj~7738106"
  },
  {
    id: 5,
    title: "Paris 19 – De l'ancien au contemporain : une rénovation sur-mesure",
    category: "Rénovation complète",
    location: "Paris 19ème",
    image: paris19,
    photoCount: 28,
    houzzUrl: "https://www.houzz.fr/hznb/projets/paris-19-de-l-ancien-au-contemporain-une-renovation-sur-mesure-pj-vj~7704321"
  },
  {
    id: 6,
    title: "Projet La Muette",
    category: "Rénovation complète",
    location: "Paris 16ème",
    image: laMuette,
    photoCount: 8,
    houzzUrl: "https://www.houzz.fr/hznb/projets/projet-la-muette-pj-vj~7738134"
  },
  {
    id: 7,
    title: "Vue d'ensemble de l'entreprise",
    category: "Rénovation complète",
    location: "Paris",
    image: vueEnsemble,
    photoCount: 10,
    houzzUrl: "https://www.houzz.fr/professionnels/artisan-et-entreprise-generale-de-batiment/qualirenovation-by-qualiconcept-pfvwfr-pf~1259357618"
  },
  {
    id: 8,
    title: "Rénovation d'une maison : un projet ambitieux pour un résultat spectaculaire",
    category: "Rénovation complète",
    location: "Île-de-France",
    image: renovationMaison,
    photoCount: 15,
    houzzUrl: "https://www.houzz.fr/professionnels/artisan-et-entreprise-generale-de-batiment/qualirenovation-by-qualiconcept-pfvwfr-pf~1259357618"
  },
  {
    id: 9,
    title: "Une Salle de Bain XXL pour Monsieur : Élégance Pratique et Luxe Moderne",
    category: "Salle de Bain",
    location: "Paris",
    image: salleBainXxl,
    photoCount: 12,
    houzzUrl: "https://www.houzz.fr/professionnels/artisan-et-entreprise-generale-de-batiment/qualirenovation-by-qualiconcept-pfvwfr-pf~1259357618"
  },
  {
    id: 10,
    title: "L'Élégance Moderne Au Cœur de Paris 13",
    category: "Rénovation complète",
    location: "Paris 13ème",
    image: paris13,
    photoCount: 20,
    houzzUrl: "https://www.houzz.fr/professionnels/artisan-et-entreprise-generale-de-batiment/qualirenovation-by-qualiconcept-pfvwfr-pf~1259357618"
  },
  {
    id: 11,
    title: "AVANT/APRÈS : Élégante Salle de Bain Ivoire et Laiton Brossé",
    category: "Salle de Bain",
    location: "Paris",
    image: avantApresSdb,
    photoCount: 8,
    houzzUrl: "https://www.houzz.fr/professionnels/artisan-et-entreprise-generale-de-batiment/qualirenovation-by-qualiconcept-pfvwfr-pf~1259357618"
  },
  {
    id: 12,
    title: "Parlons de votre projet !",
    category: "Rénovation complète",
    location: "Paris & Île-de-France",
    image: parlonsProjet,
    photoCount: 5,
    houzzUrl: "https://www.houzz.fr/professionnels/artisan-et-entreprise-generale-de-batiment/qualirenovation-by-qualiconcept-pfvwfr-pf~1259357618"
  },
];

const Projects = () => {
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [visibleCount, setVisibleCount] = useState(6);

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
        </div>

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
            <a
              key={project.id}
              href={project.houzzUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-sm shadow-elegant hover:shadow-hover transition-all duration-500 animate-fade-in-up block"
              style={{ animationDelay: `${(index % 6) * 100}ms` }}
            >
              <div className="aspect-[3/2] overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
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
                    Voir sur Houzz
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
            </a>
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
      </div>
    </section>
  );
};

export default Projects;
