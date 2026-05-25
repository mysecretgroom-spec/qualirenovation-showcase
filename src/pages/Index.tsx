import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import PressCarousel from "@/components/PressCarousel";
import InstagramFeed from "@/components/InstagramFeed";
import Contact from "@/components/Contact";
import Awards from "@/components/Awards";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import WhatsAppButton from "@/components/WhatsAppButton";
import FloatingCTA from "@/components/FloatingCTA";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  // Fetch testimonials stats for schema.org
  const { data: testimonialStats } = useQuery({
    queryKey: ["testimonials-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("houzz_testimonials")
        .select("rating")
        .eq("hidden", false);

      if (error) throw error;
      
      const count = data?.length || 0;
      const avgRating = count > 0 
        ? Math.round((data.reduce((sum, t) => sum + t.rating, 0) / count) * 10) / 10
        : 5;
      
      return { count, avgRating };
    },
  });

  const reviewCount = testimonialStats?.count || 45;
  const avgRating = testimonialStats?.avgRating || 4.9;

  return (
    <>
      <Helmet>
        <title>Rénovation Appartement Paris | Qualirénovation - Devis Gratuit</title>
        <meta 
          name="description" 
          content="QUALIRENOVATION by QUALICONCEPT — Rénovation d'appartements haut de gamme à Paris depuis 2003. Maître d'œuvre : Carina Nahmani. Gérant : Rubens Mimouni. 90+ parutions presse. Devis gratuit." 
        />
        <meta name="keywords" content="rénovation appartement paris, rénovation salle de bain paris, rénovation cuisine paris, entreprise rénovation île-de-france, travaux rénovation paris, devis rénovation gratuit" />
        <link rel="canonical" href="https://qualirenovation.fr" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Qualirénovation - Rénovation d'Appartement à Paris | Devis Gratuit" />
        <meta property="og:description" content="Rénovation d'appartements haut de gamme à Paris et Île-de-France. Plus de 20 ans d'expérience. Best of Houzz 2023. Devis gratuit." />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="fr_FR" />
        <meta property="og:url" content="https://qualirenovation.fr" />
        <meta property="og:site_name" content="Qualirénovation" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Qualirénovation - Rénovation d'Appartement à Paris" />
        <meta name="twitter:description" content="Rénovation de qualité à Paris. 20 ans d'expérience, Best of Houzz. Devis gratuit." />
        
        {/* Additional SEO */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Qualirénovation" />
        <meta name="geo.region" content="FR-IDF" />
        <meta name="geo.placename" content="Paris" />
        
        {/* Schema.org */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HomeAndConstructionBusiness",
            "name": "QUALIRÉNOVATION by Qualiconcept",
            "description": "Entreprise de rénovation d'intérieur à Paris et Île-de-France. Salle de bain, cuisine, appartement complet.",
            "url": "https://qualirenovation.fr",
            "telephone": "+33 1 XX XX XX XX",
            "email": "contact@qualirenovation.fr",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Paris",
              "addressRegion": "Île-de-France",
              "postalCode": "75000",
              "addressCountry": "FR"
            },
            "areaServed": [
              { "@type": "City", "name": "Paris" },
              { "@type": "City", "name": "Neuilly-sur-Seine" },
              { "@type": "City", "name": "Boulogne-Billancourt" },
              { "@type": "City", "name": "Levallois-Perret" },
              { "@type": "City", "name": "Issy-les-Moulineaux" },
              { "@type": "City", "name": "Saint-Cloud" }
            ],
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": String(avgRating),
              "reviewCount": String(reviewCount),
              "bestRating": "5",
              "worstRating": "1"
            },
            "priceRange": "€€",
            "openingHoursSpecification": {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
              "opens": "09:00",
              "closes": "18:00"
            },
            "sameAs": ["https://www.houzz.fr/professionnels/artisan-et-entreprise-generale-de-batiment/qualirenovation-by-qualiconcept-pfvwfr-pf~1259357618"]
          })}
        </script>
      </Helmet>
      
      <div className="min-h-screen">
        <Header />
        <main>
          <Hero />
          <About />
          <section id="nos-realisations" className="section-padding bg-secondary/30">
            <div className="container-tight px-4 sm:px-6 lg:px-8 text-center">
              <span className="text-accent font-nunito font-bold text-sm sm:text-base tracking-widest uppercase mb-3 sm:mb-4 block">
                Nos Réalisations
              </span>
              <h2 className="font-nunito text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-4">
                Découvrez nos projets
              </h2>
              <p className="text-muted-foreground font-nunito text-lg sm:text-xl max-w-2xl mx-auto mb-8">
                Plus de 115 réalisations de rénovation à Paris et en Île-de-France.
              </p>
              <Button size="lg" asChild className="text-base">
                <Link to="/nos-realisations">
                  Voir toutes nos réalisations
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </section>
          <Services />
          <Testimonials />
          <PressCarousel />
          <InstagramFeed />
          <Contact />
          <Awards />
        </main>
        <Footer />
        <CookieConsent />
        <FloatingCTA />
      </div>
    </>
  );
};

export default Index;
