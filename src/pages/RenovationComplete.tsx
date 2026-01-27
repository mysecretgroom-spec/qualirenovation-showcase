import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { RenovationForm } from '@/components/renovation/RenovationForm';

const RenovationComplete: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Configurez votre projet de rénovation | Qualirénovation</title>
        <meta 
          name="description" 
          content="Configurez votre projet de rénovation complète. Appartement ou maison, salle de bain, cuisine, sols, électricité. Devis gratuit et accompagnement personnalisé." 
        />
        <link rel="canonical" href="https://qualirenovation.fr/renovation-complete" />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-20">
          {/* Hero section */}
          <div className="bg-primary text-primary-foreground py-12 md:py-16">
            <div className="container-tight text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold mb-4">
                Configurez votre projet de rénovation
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto">
                Guidé pas à pas, décrivez votre projet en quelques minutes. 
                Nous vous recontactons sous 48h pour une étude gratuite.
              </p>
            </div>
          </div>

          {/* Form */}
          <RenovationForm />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default RenovationComplete;
