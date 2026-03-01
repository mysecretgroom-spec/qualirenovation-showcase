import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Droplets, ShowerHead, Bath, Paintbrush, Wrench, Shield, Clock, Star, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import CallButton from "@/components/CallButton";
import FloatingCTA from "@/components/FloatingCTA";
import QuoteModal from "@/components/QuoteModal";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import sdbImage from "@/assets/project-bathroom.jpg";

const RenoverSalleDeBain = () => {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  return (
    <>
      <Helmet>
        <title>Rénover ma Salle de Bain | QUALIRENOVATION Paris</title>
        <meta
          name="description"
          content="Rénovation de salle de bain à Paris et Île-de-France. Conception sur mesure, matériaux de qualité, accompagnement de A à Z. Devis gratuit."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        {/* Hero Section */}
        <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
          <div className="container-tight relative px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div className="animate-fade-in-up">
                <span className="text-accent font-medium text-sm tracking-widest uppercase mb-4 block">
                  Expertise Salle de Bain
                </span>
                <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-tight mb-6">
                  Un chantier heureux pour votre{" "}
                  <span className="text-accent">salle de bain</span>
                </h1>
                <p className="text-muted-foreground text-lg md:text-xl max-w-xl mb-8 leading-relaxed">
                  Rénover votre salle de bain sans stress, sans mauvaises surprises, grâce à une conception maîtrisée et un accompagnement de A à Z.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg px-8"
                    onClick={() => setIsQuoteModalOpen(true)}
                  >
                    Mon étude personnalisée
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full border-accent text-accent hover:bg-accent/10"
                    asChild
                  >
                    <a href="tel:+33XXXXXXXXX">
                      <Phone className="w-4 h-4" />
                      Nous appeler
                    </a>
                  </Button>
                </div>
              </div>
              <div className="animate-fade-in-up animation-delay-200">
                <div className="relative rounded-2xl overflow-hidden shadow-elegant aspect-[4/3]">
                  <img
                    src={sdbImage}
                    alt="Rénovation salle de bain Paris"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg px-4 py-2 text-sm text-foreground font-medium">
                    Paris & Île-de-France
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Engagements */}
        <EngagementsSection />

        {/* Douche ou Baignoire */}
        <DoucheOuBaignoireSection onDevis={() => setIsQuoteModalOpen(true)} />

        {/* Nos prestations */}
        <PrestationsSection />

        {/* Accompagnement */}
        <AccompagnementSection />

        {/* Réalisations CTA */}
        <RealisationsCtaSection onDevis={() => setIsQuoteModalOpen(true)} />

        {/* CTA Final */}
        <section className="py-16 md:py-24 bg-primary text-primary-foreground">
          <div className="container-tight px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold mb-4">
              Prêt(e) à transformer votre salle de bain ?
            </h2>
            <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto mb-8">
              Chaque projet commence par une étude sérieuse et personnalisée. Parlons de votre projet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="rounded-full px-8"
                onClick={() => setIsQuoteModalOpen(true)}
              >
                Mon étude personnalisée
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                asChild
              >
                <Link to="/#contact">
                  Nous contacter
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <Footer />
        <WhatsAppButton />
        <CallButton />
        <FloatingCTA />
      </div>

      <QuoteModal open={isQuoteModalOpen} onOpenChange={setIsQuoteModalOpen} />
    </>
  );
};

/* --- Sub-sections --- */

const EngagementsSection = () => {
  const { ref, animationClasses } = useScrollAnimation();
  const engagements = [
    { icon: Paintbrush, title: "Conception sur mesure", desc: "Des solutions personnalisées pour votre salle de bains" },
    { icon: Star, title: "Matériaux de qualité", desc: "Une sélection de matériaux durables et esthétiques" },
    { icon: Wrench, title: "Installation professionnelle", desc: "Des experts qualifiés pour des résultats fiables" },
    { icon: Shield, title: "Garantie décennale", desc: "Sérénité totale sur tous nos travaux" },
  ];

  return (
    <section ref={ref} className={`py-16 md:py-20 bg-secondary/30 ${animationClasses}`}>
      <div className="container-tight px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {engagements.map((e, i) => (
            <div key={i} className="text-center p-6 bg-background rounded-xl shadow-elegant hover:shadow-hover transition-shadow">
              <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <e.icon className="w-7 h-7 text-accent" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">{e.title}</h3>
              <p className="text-muted-foreground text-sm">{e.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const DoucheOuBaignoireSection = ({ onDevis }: { onDevis: () => void }) => {
  const { ref, animationClasses } = useScrollAnimation();

  return (
    <section ref={ref} className={`py-16 md:py-24 ${animationClasses}`}>
      <div className="container-tight px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Douche ou baignoire ?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            La vraie question : <strong>comment vivez-vous votre salle de bain ?</strong>
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Baignoire */}
          <div className="bg-background rounded-xl border border-border p-8 hover:shadow-elegant transition-shadow flex flex-col">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-5">
              <Bath className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground mb-4">Plutôt baignoire</h3>
            <ul className="space-y-2 text-muted-foreground text-sm mb-6 flex-1">
              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" /> Vous aimez prendre le temps</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" /> Vous avez des enfants</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" /> Côté cocooning et intemporel</li>
            </ul>
            <Button variant="outline" className="w-full rounded-full" onClick={onDevis}>
              Demander un devis
            </Button>
          </div>

          {/* Douche */}
          <div className="bg-background rounded-xl border border-border p-8 hover:shadow-elegant transition-shadow flex flex-col">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-5">
              <ShowerHead className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground mb-4">Plutôt douche</h3>
            <ul className="space-y-2 text-muted-foreground text-sm mb-6 flex-1">
              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" /> Praticité au quotidien</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" /> Gain d'espace</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" /> Accessibilité et fluidité</li>
            </ul>
            <Button variant="outline" className="w-full rounded-full" onClick={onDevis}>
              Demander un devis
            </Button>
          </div>

          {/* Notre rôle */}
          <div className="bg-primary rounded-xl p-8 text-primary-foreground flex flex-col">
            <div className="w-12 h-12 rounded-full bg-primary-foreground/10 flex items-center justify-center mb-5">
              <Droplets className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="font-display text-xl font-semibold mb-4">Notre rôle</h3>
            <p className="text-primary-foreground/80 text-sm mb-6 flex-1">
              Vous guider vers le bon choix pour vous. Chaque projet est unique — nous adaptons nos solutions à votre mode de vie, votre espace et votre budget.
            </p>
            <Button variant="secondary" className="w-full rounded-full" asChild>
              <Link to="/#about">
                Découvrir notre approche
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

const PrestationsSection = () => {
  const { ref, animationClasses } = useScrollAnimation();
  const prestations = [
    { title: "Plomberie complète", desc: "Alimentation, évacuation, raccordement. Tout est repensé." },
    { title: "Carrelage & revêtements", desc: "Zellige, grès cérame, marbre, terrazzo — posés dans les règles de l'art." },
    { title: "Électricité aux normes", desc: "NF C 15-100, spots encastrés, prises sécurisées." },
    { title: "Menuiserie sur mesure", desc: "Meubles vasque, rangements, niches intégrées." },
    { title: "Étanchéité DTU", desc: "SEL et SPEC sous carrelage, norme obligatoire respectée." },
    { title: "Peinture & finitions", desc: "Peinture anti-humidité, joints silicone, détails soignés." },
  ];

  return (
    <section ref={ref} className={`py-16 md:py-24 bg-secondary/30 ${animationClasses}`}>
      <div className="container-tight px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-accent font-medium text-sm tracking-widest uppercase mb-3 block">
            Nos prestations
          </span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Tout ce qu'il faut pour votre salle de bain
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            De la plomberie à la peinture, nous gérons chaque détail.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {prestations.map((p, i) => (
            <div key={i} className="bg-background rounded-xl p-6 shadow-elegant hover:shadow-hover transition-shadow">
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">{p.title}</h3>
              <p className="text-muted-foreground text-sm">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const AccompagnementSection = () => {
  const { ref, animationClasses } = useScrollAnimation();
  const steps = [
    { num: "01", title: "Étude personnalisée", desc: "Visite, prise de cotes, compréhension de vos besoins et de votre budget." },
    { num: "02", title: "Conception & devis", desc: "Plans, choix des matériaux, devis détaillé sous 48h." },
    { num: "03", title: "Réalisation", desc: "Coordination des artisans, suivi quotidien avec photos." },
    { num: "04", title: "Livraison", desc: "Réception du chantier, garantie décennale, SAV réactif." },
  ];

  return (
    <section ref={ref} className={`py-16 md:py-24 ${animationClasses}`}>
      <div className="container-tight px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-accent font-medium text-sm tracking-widest uppercase mb-3 block">
            Accompagnement
          </span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Nous vous accompagnons de A à Z
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div key={i} className="relative p-6">
              <span className="font-display text-5xl font-bold text-accent/15 absolute top-2 left-4">{s.num}</span>
              <div className="relative pt-8">
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-sm">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const RealisationsCtaSection = ({ onDevis }: { onDevis: () => void }) => {
  const { ref, animationClasses } = useScrollAnimation();

  return (
    <section ref={ref} className={`py-16 md:py-24 bg-secondary/30 ${animationClasses}`}>
      <div className="container-tight px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-accent font-medium text-sm tracking-widest uppercase mb-3 block">
          Inspirez-vous
        </span>
        <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground mb-4">
          Nos plus belles réalisations
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
          Découvrez nos projets de salles de bain réalisés avec soin et élégance.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="rounded-full" asChild>
            <Link to="/#projects">
              Voir tous nos projets
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="rounded-full" onClick={onDevis}>
            Demander un devis gratuit
          </Button>
        </div>
      </div>
    </section>
  );
};

export default RenoverSalleDeBain;
