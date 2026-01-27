import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { RenovationForm } from '@/components/renovation/RenovationForm';
import { useLeadContext } from '@/contexts/LeadContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileText, Clock, CheckCircle, ArrowLeft, Shield } from 'lucide-react';
import QuoteModal from '@/components/QuoteModal';

const RenovationComplete: React.FC = () => {
  const { hasLead, leadData, initFromAdminSession } = useLeadContext();
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isAdminMode = searchParams.get('admin') === 'true';

  // Initialize from admin session if in admin mode
  useEffect(() => {
    if (isAdminMode && !hasLead) {
      const success = initFromAdminSession();
      if (!success) {
        // No admin session data, redirect back
        navigate('/admin/clients');
      }
    }
  }, [isAdminMode, hasLead, initFromAdminSession, navigate]);

  // If no lead data, show a prompt to fill the quote form first
  if (!hasLead) {
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
            <div className="bg-primary text-primary-foreground py-16 md:py-24">
              <div className="container-tight text-center">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold mb-6">
                  Configurez votre projet de rénovation
                </h1>
                <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto mb-8">
                  Définissez les détails de chaque pièce pour recevoir une estimation précise 
                  et un accompagnement personnalisé.
                </p>

                {/* Benefits */}
                <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-10">
                  <div className="flex flex-col items-center gap-2 text-primary-foreground/80">
                    <Clock className="w-8 h-8 text-accent" />
                    <span className="text-sm">10-15 minutes</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 text-primary-foreground/80">
                    <FileText className="w-8 h-8 text-accent" />
                    <span className="text-sm">Devis détaillé</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 text-primary-foreground/80">
                    <CheckCircle className="w-8 h-8 text-accent" />
                    <span className="text-sm">Sans engagement</span>
                  </div>
                </div>

                {/* CTA */}
                <div className="bg-background/10 backdrop-blur-sm rounded-lg p-8 max-w-xl mx-auto">
                  <h2 className="text-xl font-semibold mb-3">
                    Commençons par vos coordonnées
                  </h2>
                  <p className="text-primary-foreground/80 mb-6 text-sm">
                    Avant de configurer votre projet en détail, remplissez une demande de devis rapide. 
                    Cela nous permet de vous recontacter et de préparer votre dossier.
                  </p>
                  <Button 
                    variant="heroSolid" 
                    size="lg"
                    onClick={() => setShowQuoteModal(true)}
                  >
                    Commencer ma demande
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </main>
          <Footer />
        </div>

        <QuoteModal 
          open={showQuoteModal} 
          onOpenChange={setShowQuoteModal}
          showConfigurationOption={true}
        />
      </>
    );
  }

  // If we have lead data, show the configuration form
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
          {/* Hero section with lead info */}
          <div className="bg-primary text-primary-foreground py-8 md:py-12">
            <div className="container-tight">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  {isAdminMode && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => navigate('/admin/clients')}
                      className="text-primary-foreground/70 hover:text-primary-foreground mb-2 -ml-2"
                    >
                      <ArrowLeft className="w-4 h-4 mr-1" />
                      Retour admin
                    </Button>
                  )}
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-semibold mb-2">
                    Configuration de votre projet
                  </h1>
                  <p className="text-primary-foreground/90">
                    {leadData?.name} • {leadData?.city} • {leadData?.surface}m²
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-primary-foreground/70">
                  {leadData?.isAdminSimulation ? (
                    <>
                      <Shield className="w-4 h-4" />
                      Mode administrateur
                    </>
                  ) : (
                    "Nous vous recontacterons sous 48h"
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <RenovationForm isAdminMode={isAdminMode} />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default RenovationComplete;
