import { ArrowRight, ExternalLink, Images } from "lucide-react";
import { Button } from "@/components/ui/button";

const bathroomProjects = [
  {
    title: "Zellige bejmat vert Saint-Laurent et laiton",
    location: "Paris 13ᵉ",
    image: "https://renovermasalledebain.com/assets/nicolas-roret-5-sPIECMtd.jpg",
    photoCount: 15,
    url: "https://renovermasalledebain.com/realisations/salle-de-bain-paris-13-renovation-zellige-turquoise-or",
    finition: "Zellige",
  },
  {
    title: "Du dégât des eaux à l'écrin de marbre noir mat",
    location: "Paris 8ᵉ",
    image: "https://renovermasalledebain.com/assets/st-honore-1-BOEvoCJc.jpg",
    photoCount: 7,
    url: "https://renovermasalledebain.com/realisations/salle-de-bain-paris-8-renovation-degat-des-eaux-marbre-noir-mat",
    finition: "Marbre",
  },
  {
    title: "Optimisation maximale d'un petit espace",
    location: "Paris 5ᵉ",
    image: "https://renovermasalledebain.com/assets/buffon-1-gC1Mas3y.jpg",
    photoCount: 9,
    url: "https://renovermasalledebain.com/realisations/salle-de-bain-paris-5-renovation-optimisation-petit-espace",
    finition: "Effet pierre",
  },
  {
    title: "Bleu minéral et béton urbain à Reuilly",
    location: "Paris 12ᵉ",
    image: "https://renovermasalledebain.com/assets/place-daumesnil-2-BYesmOOF.jpg",
    photoCount: 7,
    url: "https://renovermasalledebain.com/realisations/salle-de-bain-paris-12-renovation-bleu-mineral-beton-reuilly",
    finition: "Béton",
  },
  {
    title: "Terrazzo minéral, vert d'eau et laiton",
    location: "Bois-Colombes (92)",
    image: "https://renovermasalledebain.com/assets/bois-colombes-11-DwF86NRM.jpg",
    photoCount: 11,
    url: "https://renovermasalledebain.com/realisations/salle-de-bain-bois-colombes-92-terrazzo-mineral-vert-eau-laiton",
    finition: "Terrazzo",
  },
  {
    title: "Zellige blanc et sol Patrimony bleu",
    location: "Paris 5ᵉ",
    image: "https://renovermasalledebain.com/assets/stgermain-1-NTISpA4U.jpg",
    photoCount: 8,
    url: "https://renovermasalledebain.com/realisations/salle-de-bain-paris-5-renovation-baignoire-saint-germain",
    finition: "Zellige",
  },
];

const BathroomProjectsSection = () => {
  return (
    <section id="realisations-salle-de-bain" className="section-padding bg-background">
      <div className="container-tight px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <span className="text-accent font-nunito font-bold text-sm sm:text-base tracking-widest uppercase mb-3 sm:mb-4 block">
            Salle de Bain
          </span>
          <h2 className="font-nunito text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground mb-3 sm:mb-4">
            Nos réalisations salle de bain
          </h2>
          <p className="text-muted-foreground font-nunito text-lg sm:text-xl max-w-2xl mx-auto">
            Plus de 54 salles de bain rénovées à Paris et Île-de-France.
            Découvrez nos projets sur notre site dédié.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {bathroomProjects.map((project, index) => (
            <a
              key={index}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-sm shadow-elegant hover:shadow-hover transition-all duration-500 block"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="aspect-[4/3] sm:aspect-[3/2] overflow-hidden bg-muted">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Photo count badge */}
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-charcoal/70 backdrop-blur-sm text-cream px-2 py-1 sm:px-3 sm:py-1.5 rounded-sm text-[10px] sm:text-xs font-medium flex items-center gap-1">
                <Images className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                {project.photoCount}
              </div>

              {/* External link icon */}
              <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-accent/80 backdrop-blur-sm text-accent-foreground p-1 sm:p-1.5 rounded-sm">
                <ExternalLink className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
              </div>

              {/* Overlay - Desktop */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden sm:block">
                <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="text-gold-light text-sm font-nunito font-semibold mb-2 block">
                    Salle de Bain • {project.location}
                  </span>
                  <h3 className="font-nunito text-xl text-cream font-bold mb-2 line-clamp-2">
                    {project.title}
                  </h3>
                  <span className="text-xs text-cream/70 font-medium">{project.finition}</span>
                  <span className="mt-3 inline-flex items-center gap-2 text-cream text-sm font-medium">
                    Voir sur renovermasalledebain.com
                    <ExternalLink className="w-4 h-4" />
                  </span>
                </div>
              </div>

              {/* Static label - Mobile */}
              <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-5 bg-gradient-to-t from-charcoal/90 to-transparent sm:from-charcoal/80 sm:group-hover:opacity-0 transition-opacity duration-500">
                <span className="text-gold-light text-[10px] sm:text-xs font-nunito font-semibold hidden sm:block">
                  {project.location}
                </span>
                <h3 className="font-nunito text-sm sm:text-lg text-cream font-bold line-clamp-2">
                  {project.title}
                </h3>
              </div>
            </a>
          ))}
        </div>

        <div className="flex justify-center mt-8 sm:mt-12">
          <Button variant="default" size="lg" asChild className="text-sm sm:text-base">
            <a
              href="https://renovermasalledebain.com/realisations"
              target="_blank"
              rel="noopener noreferrer"
            >
              Voir les 54 réalisations salle de bain
              <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BathroomProjectsSection;
