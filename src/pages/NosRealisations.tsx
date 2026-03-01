import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Projects from "@/components/Projects";
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
        <main className="pt-20">
          <Projects />
        </main>
        <Footer />
        <CookieConsent />
        <FloatingCTA />
      </div>
    </>
  );
};

export default NosRealisations;
