import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, ArrowRight, MapPin, Calendar, Euro, ExternalLink, CheckCircle2, Loader2, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useProject } from "@/hooks/use-projects";
import { useState } from "react";

const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { project, relatedProjects, isLoading, isFromDB } = useProject(slug || "");
  const [selectedImage, setSelectedImage] = useState(0);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-accent mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement du projet...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="font-display text-4xl font-semibold text-foreground mb-4">
            Projet non trouvé
          </h1>
          <p className="text-muted-foreground mb-6">
            Ce projet n'existe pas ou a été supprimé.
          </p>
          <Button onClick={() => navigate("/")}>
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  const allImages = [project.image, ...project.gallery];

  return (
    <>
      <Helmet>
        <title>{project.title} | QUALIRENOVATION Paris</title>
        <meta 
          name="description" 
          content={`${project.title} - ${project.category} à ${project.location}. Découvrez ce projet de rénovation par QUALIRENOVATION.`} 
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        {/* Hero Section */}
        <section className="pt-24 pb-8 bg-secondary/30">
          <div className="container-tight">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8 animate-fade-in">
              <Link to="/" className="hover:text-foreground transition-colors">
                Accueil
              </Link>
              <span>/</span>
              <Link to="/#projects" className="hover:text-foreground transition-colors">
                Projets
              </Link>
              <span>/</span>
              <span className="text-foreground">{project.category}</span>
              {isFromDB && (
                <span className="ml-2 text-xs text-accent flex items-center gap-1">
                  <Database className="w-3 h-3" />
                  DB
                </span>
              )}
            </nav>

            {/* Back Button */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate(-1)}
              className="mb-6 animate-fade-in"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Button>

            {/* Title & Meta */}
            <div className="grid lg:grid-cols-2 gap-8 items-start">
              <div className="animate-fade-in-up">
                <span className="text-accent font-medium text-sm tracking-widest uppercase mb-3 block">
                  {project.category}
                </span>
                <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-6 leading-tight">
                  {project.title}
                </h1>
                
                {/* Meta Info */}
                <div className="flex flex-wrap gap-6 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-accent" />
                    <span>{project.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-accent" />
                    <span>{project.year}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Euro className="w-5 h-5 text-accent" />
                    <span>{project.budget}</span>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4 lg:justify-end animate-fade-in-up animation-delay-200">
                <Button 
                  variant="outline" 
                  size="lg"
                  asChild
                >
                  <a href={project.houzzUrl} target="_blank" rel="noopener noreferrer">
                    Voir sur Houzz
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
                <Button 
                  size="lg"
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  asChild
                >
                  <Link to="/#contact">
                    Demander un devis
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Main Gallery */}
        <section className="py-12">
          <div className="container-tight">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Image */}
              <div className="lg:col-span-2 animate-fade-in-up">
                <div className="aspect-[4/3] rounded-sm overflow-hidden shadow-card bg-muted">
                  <img
                    src={allImages[selectedImage]}
                    alt={`${project.title} - Photo ${selectedImage + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                </div>
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-3 lg:grid-cols-2 gap-3 animate-fade-in-up animation-delay-200">
                {allImages.slice(0, 6).map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-sm overflow-hidden transition-all duration-300 bg-muted ${
                      selectedImage === index 
                        ? "ring-2 ring-accent ring-offset-2" 
                        : "opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${project.title} - Miniature ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Images Gallery */}
            {allImages.length > 6 && (
              <div className="mt-8">
                <h3 className="font-display text-xl font-semibold text-foreground mb-4">
                  Toutes les photos ({allImages.length})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {allImages.slice(6).map((img, index) => (
                    <button
                      key={index + 6}
                      onClick={() => setSelectedImage(index + 6)}
                      className={`aspect-square rounded-sm overflow-hidden transition-all duration-300 bg-muted ${
                        selectedImage === index + 6
                          ? "ring-2 ring-accent ring-offset-2" 
                          : "opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${project.title} - Photo ${index + 7}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder.svg";
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Project Details */}
        <section className="py-12 bg-secondary/30">
          <div className="container-tight">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Description */}
              <div className="lg:col-span-2 animate-fade-in-up">
                <h2 className="font-display text-2xl font-semibold text-foreground mb-6">
                  À propos du projet
                </h2>
                <div className="prose prose-lg max-w-none text-muted-foreground">
                  {project.description.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-8 animate-fade-in-up animation-delay-200">
                {/* Highlights */}
                <div className="bg-background p-6 rounded-sm shadow-elegant">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                    Points clés
                  </h3>
                  <ul className="space-y-3">
                    {project.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-foreground text-sm">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Services */}
                <div className="bg-background p-6 rounded-sm shadow-elegant">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                    Prestations réalisées
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.services.map((service, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1.5 bg-secondary text-secondary-foreground text-sm rounded-sm"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Contact CTA */}
                <div className="bg-primary p-6 rounded-sm text-primary-foreground">
                  <h3 className="font-display text-lg font-semibold mb-3">
                    Vous avez un projet similaire ?
                  </h3>
                  <p className="text-primary-foreground/80 text-sm mb-4">
                    Contactez-nous pour une consultation gratuite et un devis personnalisé.
                  </p>
                  <Button 
                    variant="secondary" 
                    className="w-full"
                    asChild
                  >
                    <Link to="/#contact">
                      Nous contacter
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <section className="py-16">
            <div className="container-tight">
              <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-8 animate-fade-in-up">
                Projets similaires
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedProjects.map((related, index) => (
                  <Link
                    key={related.id}
                    to={`/projet/${related.slug}`}
                    className="group block animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="aspect-[4/3] rounded-sm overflow-hidden shadow-elegant mb-4 bg-muted">
                      <img
                        src={related.image}
                        alt={related.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder.svg";
                        }}
                      />
                    </div>
                    <span className="text-accent text-sm font-medium">
                      {related.category}
                    </span>
                    <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-2">
                      {related.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <Footer />
      </div>
    </>
  );
};

export default ProjectDetail;
