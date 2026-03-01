import { Helmet } from "react-helmet-async";
import { ArrowRight, ExternalLink, Home, Lightbulb, Diamond } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import CallButton from "@/components/CallButton";
import FloatingCTA from "@/components/FloatingCTA";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import sdbImage from "@/assets/project-bathroom.jpg";

const SITE_DEDIE_URL = "https://renovermasalledebain.com/qualirenovation";

const RenoverSalleDeBain = () => {
  const { ref, animationClasses } = useScrollAnimation();

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
        <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
          <div className="container-tight relative px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div className="animate-fade-in-up">
                <span className="text-accent font-medium text-sm tracking-widest uppercase mb-4 block">
                  Nouveau
                </span>
                <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-tight mb-6">
                  Découvrez notre site dédié à la{" "}
                  <span className="text-accent">salle de bain</span>
                </h1>
                <p className="text-muted-foreground text-lg md:text-xl max-w-xl mb-8 leading-relaxed">
                  Un espace entièrement consacré à votre projet de rénovation de salle de bain : simulateur, inspirations, matériaux et accompagnement sur mesure.
                </p>
                <Button
                  size="lg"
                  className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg px-8"
                  asChild
                >
                  <a href={SITE_DEDIE_URL} target="_blank" rel="noopener noreferrer">
                    Visiter le site dédié
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </Button>
              </div>
              <div className="animate-fade-in-up animation-delay-200">
                <a href={SITE_DEDIE_URL} target="_blank" rel="noopener noreferrer" className="block">
                  <div className="relative rounded-2xl overflow-hidden shadow-elegant aspect-[4/3] group cursor-pointer">
                    <img
                      src={sdbImage}
                      alt="Rénovation salle de bain Paris"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-primary/30 group-hover:bg-primary/10 transition-colors flex items-center justify-center">
                      <span className="bg-background/90 backdrop-blur-sm rounded-full px-6 py-3 text-foreground font-medium flex items-center gap-2 shadow-lg">
                        Découvrir le site
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </a>
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
                <a href={SITE_DEDIE_URL} target="_blank" rel="noopener noreferrer">
                  Accéder au site salle de bain
                  <ExternalLink className="w-5 h-5" />
                </a>
              </Button>
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
