import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const MentionsLegales = () => {
  return (
    <>
      <Helmet>
        <title>Mentions Légales | QualiRénovation</title>
        <meta name="description" content="Mentions légales de QualiRénovation - Informations sur la société QUALICONCEPT, propriétaire de la marque QR QualiRénovation®." />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
            Mentions Légales
          </h1>

          <div className="prose prose-lg max-w-none space-y-8">
            {/* Marque déposée */}
            <section className="bg-card rounded-lg p-6 border border-border">
              <h2 className="text-xl font-semibold text-foreground mb-4">Marque déposée</h2>
              <p className="text-muted-foreground">
                <strong className="text-foreground">QR QualiRénovation®</strong> est une marque déposée et enregistrée auprès de l'INPI 
                (marque n° 5056128).
              </p>
            </section>

            {/* Société */}
            <section className="bg-card rounded-lg p-6 border border-border">
              <h2 className="text-xl font-semibold text-foreground mb-4">Éditeur du site</h2>
              <p className="text-muted-foreground mb-2">
                La société <strong className="text-foreground">QUALIRENOVATION by Qualiconcept</strong> exploite la marque QR QualiRénovation®.
              </p>
              <address className="text-muted-foreground not-italic">
                6 rue d'Armaillé<br />
                75017 Paris<br />
                France
              </address>
            </section>

            {/* Partenaire */}
            <section className="bg-card rounded-lg p-6 border border-border">
              <h2 className="text-xl font-semibold text-foreground mb-4">Partenaire de gestion</h2>
              <p className="text-muted-foreground">
                Les devis sont réalisés avec l'appui de <strong className="text-foreground">Graneet</strong>, 
                notre partenaire de gestion, afin de garantir des devis précis, structurés et transparents.
              </p>
            </section>

            {/* Assurances */}
            <section className="bg-card rounded-lg p-6 border border-border">
              <h2 className="text-xl font-semibold text-foreground mb-4">Assurances</h2>
              <p className="text-muted-foreground">
                QUALICONCEPT est titulaire d'une <strong className="text-foreground">assurance responsabilité civile professionnelle et décennale</strong> souscrite auprès de MIC Insurance.
              </p>
              <p className="text-muted-foreground mt-2">
                Numéro de police : <strong className="text-foreground">LUN2401859</strong>
              </p>
            </section>

            {/* Hébergement */}
            <section className="bg-card rounded-lg p-6 border border-border">
              <h2 className="text-xl font-semibold text-foreground mb-4">Hébergement</h2>
              <p className="text-muted-foreground">
                Le site est hébergé par <strong className="text-foreground">OVH</strong>.
              </p>
              <address className="text-muted-foreground not-italic mt-2">
                OVH SAS<br />
                2 rue Kellermann<br />
                59100 Roubaix<br />
                France
              </address>
            </section>

            {/* Responsable */}
            <section className="bg-card rounded-lg p-6 border border-border">
              <h2 className="text-xl font-semibold text-foreground mb-4">Responsable du site</h2>
              <p className="text-muted-foreground">
                <strong className="text-foreground">Mimouni Rubens</strong>
              </p>
              <p className="text-muted-foreground mt-2">
                Contact : <a href="mailto:gestion@qualiconcept.fr" className="text-primary hover:underline">
                  gestion@qualiconcept.fr
                </a>
              </p>
            </section>

            {/* Liens vers autres pages légales */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/cgv" className="text-primary hover:underline">
                Conditions Générales de Vente
              </Link>
              <Link to="/politique-confidentialite" className="text-primary hover:underline">
                Politique de Confidentialité
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default MentionsLegales;
