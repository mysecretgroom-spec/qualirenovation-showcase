import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Projects from "@/components/Projects";
import BathroomProjectsSection from "@/components/BathroomProjectsSection";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import FloatingCTA from "@/components/FloatingCTA";

const NosRealisations = () => {
  return (
    <>
      <Helmet>
        <title>Nos Réalisations | Qualirénovation - Projets de Rénovation à Paris</title>
        <meta
          name="description"
          content="Découvrez nos réalisations de rénovation d'appartement à Paris et Île-de-France : salle de bain, cuisine, rénovation complète. Plus de 115 projets sur Houzz."
        />
        <link rel="canonical" href="https://qualirenovation.fr/nos-realisations" />
        <meta property="og:title" content="Nos Réalisations | Qualirénovation" />
        <meta property="og:description" content="Découvrez nos projets de rénovation à Paris. Salle de bain, cuisine, appartement complet. Best of Houzz." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://qualirenovation.fr/nos-realisations" />
      </Helmet>

      <div className="min-h-screen">
        <Header />
        <main className="pt-24">
          <nav aria-label="Fil d'Ariane" className="container-tight px-4 sm:px-6 lg:px-8 mb-4">
            <ol className="flex items-center gap-1.5 text-sm text-muted-foreground font-nunito">
              <li><Link to="/" className="hover:text-accent transition-colors">Accueil</Link></li>
              <li><ChevronRight className="w-3.5 h-3.5" /></li>
              <li className="text-foreground font-semibold">Nos Réalisations</li>
            </ol>
          </nav>
          <Projects />
          <BathroomProjectsSection />
        </main>
        <Footer />
        <CookieConsent />
        <FloatingCTA />
      </div>
    </>
  );
};

export default NosRealisations;
