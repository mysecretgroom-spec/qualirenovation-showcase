import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ExternalLink, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import CallButton from "@/components/CallButton";
import FloatingCTA from "@/components/FloatingCTA";
import BathroomGalleryCarousel from "@/components/BathroomGalleryCarousel";
import sdbImage from "@/assets/sdb-hero.png";

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "renovermasalledebain.com",
  url: "https://renovermasalledebain.com/",
  description:
    "Rénovation de salle de bain à Paris & Île-de-France : prix au m², douche italienne, étanchéité DTU 52.2, planning, réalisations et accompagnement maître d'œuvre.",
  areaServed: [
    { "@type": "City", name: "Paris" },
    { "@type": "AdministrativeArea", name: "Île-de-France" },
  ],
  serviceType: "Rénovation de salle de bain",
  provider: {
    "@type": "Organization",
    name: "QualiRénovation",
    url: "https://qualirenovation.fr",
  },
  employee: {
    "@type": "Person",
    name: "Carina Nahmani",
    jobTitle: "Maître d'œuvre",
  },
};

const RenoverSalleDeBain = () => {
  return (
    <>
      <Helmet>
        <title>Rénovation salle de bain Paris – Prix, étapes & réalisations</title>
        <meta
          name="description"
          content="Rénovation de salle de bain à Paris & Île-de-France : prix au m², douche italienne, étanchéité DTU 52.2, planning, réalisations et accompagnement maître d'œuvre."
        />
        <link rel="canonical" href="https://qualirenovation-showcase.lovable.app/renover-salle-de-bain" />
        <script type="application/ld+json">{JSON.stringify(JSON_LD)}</script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        {/* Hero */}
        <section className="relative pt-20 md:pt-24 overflow-hidden">
          <div className="relative w-full aspect-[16/9] md:aspect-[21/9] max-h-[60vh]">
            <img
              src={sdbImage}
              alt="Rénovation salle de bain à Paris – QualiRénovation"
              className="w-full h-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
              <div className="container-tight">
                <h1 className="font-display text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-semibold text-background leading-tight mb-3">
                  Rénovation salle de bain à{" "}
                  <span className="font-script text-[1.1em]">Paris & Île-de-France</span>
                </h1>
                <p className="text-background/90 text-lg md:text-xl font-display mb-2">
                  Un chantier heureux, du devis à la réception.
                </p>
                <p className="text-background/70 text-sm md:text-base max-w-xl mb-6">
                  Rénover votre salle de bain sans stress, sans imprévus, grâce à une coordination maîtrisée et un accompagnement maître d'œuvre de A à Z.
                </p>
                <Button
                  size="lg"
                  className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg px-8"
                  asChild
                >
                  <a href="/#contact">
                    Demander mon étude personnalisée
                    <ArrowRight className="w-5 h-5" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content: Text Left + Gallery Right */}
        <section className="py-12 md:py-20 bg-background">
          <div className="container-tight px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-5 gap-10 lg:gap-16">
              {/* LEFT COLUMN – SEO Pillar Content */}
              <div className="lg:col-span-3 space-y-10">

                {/* H2: Expertise Paris */}
                <article>
                  <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-4">
                    Pourquoi rénover une salle de bain à Paris demande une vraie expertise ?
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    Un <strong>appartement ancien</strong> parisien concentre des contraintes spécifiques : <strong>copropriété</strong> avec règlement strict, <strong>colonnes en fonte</strong> partagées, hauteurs sous plafond variables et <strong>contraintes d'évacuation</strong> complexes.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Notre rôle de maître d'œuvre est d'anticiper chaque point technique — y compris l'<strong>optimisation des petites surfaces</strong> — pour garantir un chantier fluide, sans mauvaise surprise pour vous ni pour vos voisins.
                  </p>
                </article>

                {/* H2: Prix */}
                <article>
                  <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-4">
                    Prix d'une rénovation de salle de bain à Paris
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    Le budget moyen pour une rénovation de salle de bain à Paris se situe entre <strong>800 et 1 500 €/m²</strong>, selon les contraintes techniques, le niveau de finitions et les équipements choisis.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Ce prix inclut la dépose, la plomberie, l'étanchéité, le carrelage, les sanitaires et la coordination de l'ensemble des corps de métier.
                  </p>
                  <Link
                    to="/faq"
                    className="inline-flex items-center gap-1 text-accent hover:text-accent/80 font-medium text-sm mt-2 transition-colors"
                  >
                    Voir les questions fréquentes sur les prix
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </article>

                {/* H2: Étapes */}
                <article>
                  <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-4">
                    Les étapes clés d'une rénovation de salle de bain
                  </h2>
                  <ol className="list-decimal list-inside space-y-2 text-muted-foreground leading-relaxed">
                    <li><strong>Étude & conception</strong> — Relevé technique, plan d'aménagement et choix des matériaux.</li>
                    <li><strong>Dépose & préparation</strong> — Démolition maîtrisée, protection des parties communes.</li>
                    <li><strong>Plomberie & évacuations</strong> — Reprise ou création des alimentations et évacuations.</li>
                    <li><strong>Étanchéité & carrelage</strong> — Mise en œuvre conforme au DTU, pose soignée.</li>
                    <li><strong>Équipements sanitaires</strong> — Installation douche, baignoire, meuble vasque, WC.</li>
                    <li><strong>Finitions & réception</strong> — Peinture, joints, mise en service et procès-verbal de réception.</li>
                  </ol>
                  <Link
                    to="/renovation-complete"
                    className="inline-flex items-center gap-1 text-accent hover:text-accent/80 font-medium text-sm mt-3 transition-colors"
                  >
                    Découvrir le guide complet des travaux
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </article>

                {/* H2: Douche italienne */}
                <article>
                  <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-4">
                    Douche à l'italienne en appartement : faisabilité & alternatives
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    La douche à l'italienne (douche de plain-pied) nécessite une <strong>hauteur d'évacuation suffisante</strong> entre le sol et le plafond de l'étage inférieur. En copropriété, cette hauteur est souvent limitée.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Lorsque l'encastrement total n'est pas réalisable, nous proposons des alternatives performantes : <strong>receveur extra-plat</strong> (3 cm de hauteur), <strong>receveur sur pieds réglables</strong> avec habillage discret, ou <strong>receveur à carreler</strong> pour un rendu personnalisé.
                  </p>
                  <Link
                    to="/renovation-complete"
                    className="inline-flex items-center gap-1 text-accent hover:text-accent/80 font-medium text-sm mt-2 transition-colors"
                  >
                    En savoir plus sur les receveurs et douches
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </article>

                {/* H2: Étanchéité, normes */}
                <article>
                  <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-4">
                    Étanchéité, normes et garanties
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    Toute rénovation de salle de bain doit respecter le <strong>DTU 52.2</strong> (système d'étanchéité liquide sous carrelage en locaux humides). C'est la base d'un chantier pérenne et conforme.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Nos travaux sont couverts par une <strong>assurance décennale</strong>. À la fin du chantier, un <strong>procès-verbal de réception</strong> formalise la conformité et ouvre vos droits de garantie.
                  </p>
                  <Link
                    to="/faq"
                    className="inline-flex items-center gap-1 text-accent hover:text-accent/80 font-medium text-sm mt-2 transition-colors"
                  >
                    Questions fréquentes sur les assurances et garanties
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </article>

                {/* H2: Réalisations */}
                <article>
                  <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-4">
                    Réalisations – salles de bain à Paris
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    Découvrez nos projets de rénovation de salles de bain réalisés à Paris et en Île-de-France : petites surfaces optimisées, douches à l'italienne, baignoires îlot et finitions haut de gamme.
                  </p>
                  <Link
                    to="/#projects"
                    className="inline-flex items-center gap-1 text-accent hover:text-accent/80 font-medium text-sm transition-colors"
                  >
                    Voir toutes nos réalisations
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </article>

                {/* Passerelle QualiRénovation */}
                <div className="border-t border-border pt-8">
                  <p className="text-muted-foreground leading-relaxed">
                    QualiRénovation pilote également des rénovations globales d'appartements et de maisons à Paris et en Île-de-France.{" "}
                    Pour un projet d'ampleur,{" "}
                    <a
                      href="https://qualirenovation.fr"
                      className="text-accent hover:text-accent/80 font-medium transition-colors"
                      rel="dofollow"
                    >
                      découvrir qualirenovation.fr
                    </a>.
                  </p>
                </div>

                {/* CTA final */}
                <div className="bg-secondary/40 rounded-xl p-6 md:p-8">
                  <h3 className="font-display text-xl md:text-2xl font-semibold text-foreground mb-3">
                    Votre projet de salle de bain commence ici
                  </h3>
                  <p className="text-muted-foreground mb-5">
                    Étude personnalisée, devis détaillé et accompagnement maître d'œuvre de A à Z.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button size="lg" className="rounded-full px-8" asChild>
                      <a href="/#contact">
                        Demander mon étude personnalisée
                        <ArrowRight className="w-5 h-5" />
                      </a>
                    </Button>
                    <Button size="lg" variant="outline" className="rounded-full px-8" asChild>
                      <a href="https://renovermasalledebain.com/" target="_blank" rel="noopener noreferrer">
                        Visiter le site dédié
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN – Gallery Carousel */}
              <aside className="lg:col-span-2">
                <div className="lg:sticky lg:top-28">
                  <BathroomGalleryCarousel />
                </div>
              </aside>
            </div>
          </div>
        </section>

        <Footer />
        <WhatsAppButton />
        <CallButton />
        <FloatingCTA />
      </div>
    </>
  );
};

export default RenoverSalleDeBain;
