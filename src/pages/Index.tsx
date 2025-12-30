import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import InstagramFeed from "@/components/InstagramFeed";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
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
        <title>QUALIRENOVATION - Rénovation d'intérieur à Paris & Île-de-France</title>
        <meta 
          name="description" 
          content="Entreprise de rénovation d'intérieur à Paris. Salle de bain, cuisine, appartement complet. 10+ ans d'expérience, 53 avis clients, lauréat Best of Houzz. Devis gratuit." 
        />
        <meta name="keywords" content="rénovation paris, rénovation appartement, rénovation salle de bain, rénovation cuisine, entreprise rénovation île-de-france" />
        <link rel="canonical" href="https://qualirenovation.fr" />
        
        {/* Open Graph */}
        <meta property="og:title" content="QUALIRENOVATION - Rénovation d'intérieur à Paris" />
        <meta property="og:description" content="Rénovation de qualité en toute sérénité. Plus de 10 ans d'expérience à Paris et Île-de-France." />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="fr_FR" />
        
        {/* Schema.org */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HomeAndConstructionBusiness",
            "name": "QUALIRENOVATION by Qualiconcept",
            "description": "Entreprise de rénovation d'intérieur à Paris et Île-de-France",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Paris",
              "addressRegion": "Île-de-France",
              "addressCountry": "FR"
            },
            "areaServed": ["Paris", "Neuilly-sur-Seine", "Boulogne-Billancourt", "Levallois-Perret"],
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": String(avgRating),
              "reviewCount": String(reviewCount)
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
          <Projects />
          <Services />
          <Testimonials />
          <FAQ />
          <InstagramFeed />
          <Contact />
        </main>
        <Footer />
        <CookieConsent />
      </div>
    </>
  );
};

export default Index;
