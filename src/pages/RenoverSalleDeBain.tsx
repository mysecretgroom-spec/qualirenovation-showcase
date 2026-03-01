import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { ExternalLink, Home, Lightbulb, Diamond, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import sdbImage from "@/assets/sdb-hero.png";

const SITE_DEDIE_URL = "https://renovermasalledebain.com";

const RenoverSalleDeBain = () => {
  const { ref, animationClasses } = useScrollAnimation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const features = [
    { icon: Home, title: "Adapté à votre vie", desc: "Nous étudions vos habitudes quotidiennes pour créer un espace parfaitement adapté à votre rythme de vie." },
    { icon: Lightbulb, title: "Solutions techniques", desc: "Notre expertise nous permet de proposer des solutions innovantes qui subliment votre projet initial." },
    { icon: Diamond, title: "Confort optimal", desc: "Chaque détail est pensé pour maximiser votre confort et votre bien-être au quotidien." },
  ];

  return (
    <>
      <Helmet>
        <title>Site dédié Salle de Bain | QUALIRENOVATION Paris</title>
        <meta
          name="description"
          content="Découvrez notre site entièrement dédié à la rénovation de salle de bain à Paris. Simulateur, inspirations, devis personnalisé."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        {/* Hero */}
        <section className="relative pt-20 md:pt-24 overflow-hidden">
          <div className="relative w-full aspect-[16/9] md:aspect-[21/9] max-h-[70vh]">
            <img
              src={sdbImage}
              alt="Rénovation salle de bain – Soisy-sous-Montmorency"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-primary/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
              <div className="container-tight">
                <h1 className="font-display text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-semibold text-background leading-tight mb-4">
                  Un chantier heureux pour votre{" "}
                  <span className="font-script text-[1.1em]">Salle de Bain</span>
                </h1>
                <p className="text-background/80 text-base md:text-lg max-w-xl mb-6">
                  Découvrez notre site entièrement dédié à la rénovation de salle de bain : simulateur, inspirations et accompagnement sur mesure.
                </p>
                <Button
                  size="lg"
                  className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg px-8"
                  asChild
                >
                  <a href={SITE_DEDIE_URL} target="_blank" rel="noopener noreferrer">
                    Découvrir le site dédié
                    <br />
                    <span className="text-sm opacity-80">renovermasalledebain.com</span>
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section ref={ref} className={`py-16 md:py-24 bg-secondary/30 ${animationClasses}`}>
          <div className="container-tight px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground mb-4">
                Ce que vous y trouverez
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Un site complet pour imaginer et préparer la rénovation de votre salle de bain.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {features.map((f, i) => (
                <div key={i} className="text-center p-6 bg-background rounded-xl shadow-elegant hover:shadow-hover transition-shadow">
                  <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <f.icon className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">{f.title}</h3>
                  <p className="text-muted-foreground text-sm">{f.desc}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Button size="lg" className="rounded-full px-8" asChild>
                <a href="/#contact">
                  Demander mon étude personnalisée
                  <FileText className="w-5 h-5" />
                </a>
              </Button>
            </div>
          </div>
        </section>

        <Footer />
        <FloatingCTA />
      </div>
    </>
  );
};

export default RenoverSalleDeBain;
