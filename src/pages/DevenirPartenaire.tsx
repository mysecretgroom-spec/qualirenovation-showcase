import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Wrench, Search, Sparkles, Send, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

const partnerSchema = z.object({
  profile_type: z.string().min(1, "Veuillez sélectionner un profil"),
  company_name: z.string().trim().min(1, "Nom de l'entreprise requis").max(200),
  contact_name: z.string().trim().min(1, "Nom du contact requis").max(200),
  email: z.string().trim().email("Email invalide").max(255),
  phone: z.string().trim().max(20).optional(),
  message: z.string().trim().max(2000).optional(),
});

const profiles = [
  {
    id: "sous-traitant",
    icon: Wrench,
    title: "Sous-traitant",
    description: "Vous êtes artisan ou entreprise du bâtiment et souhaitez collaborer sur nos chantiers de rénovation.",
  },
  {
    id: "installateur",
    icon: Search,
    title: "Installateur (recherche de prestation)",
    description: "Vous êtes installateur et recherchez un prestataire qualifié pour vos projets clients.",
  },
  {
    id: "marque",
    icon: Sparkles,
    title: "Marque / Site / Point de vente / Site déco",
    description: "Vous êtes une marque, fabricant, distributeur, showroom ou site déco souhaitant collaborer.",
  },
];

const DevenirPartenaire = () => {
  const { ref, animationClasses } = useScrollAnimation();
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    company_name: "",
    contact_name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const payload = { ...formData, profile_type: selectedProfile || "" };
    const result = partnerSchema.safeParse(payload);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("partner_requests" as any).insert(result.data as any);
      if (error) throw error;
      setSubmitted(true);
      toast.success("Votre demande a bien été envoyée !");
    } catch {
      toast.error("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <>
        <Helmet>
          <title>Devenir partenaire | QUALIRENOVATION</title>
        </Helmet>
        <div className="min-h-screen bg-background">
          <Header />
          <main className="pt-24 pb-16">
            <div className="container-tight px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto text-center">
              <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-accent" />
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
                Merci pour votre demande !
              </h1>
              <p className="text-muted-foreground text-lg mb-8">
                Nous avons bien reçu votre candidature partenaire. Notre équipe vous recontactera dans les meilleurs délais.
              </p>
              <Button asChild>
                <a href="/">Retour à l'accueil</a>
              </Button>
            </div>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Devenir Partenaire | QualiRénovation Paris</title>
        <meta
          name="description"
          content="Rejoignez le réseau de partenaires QualiRénovation. Sous-traitants, installateurs, marques : collaborez avec nous sur des projets de rénovation de qualité à Paris."
        />
        <link rel="canonical" href="https://qualirenovation.fr/devenir-partenaire" />
        <meta property="og:title" content="Devenir Partenaire | QualiRénovation" />
        <meta property="og:description" content="Rejoignez notre réseau de partenaires et développez votre activité avec des projets de rénovation de qualité à Paris." />
        <meta property="og:url" content="https://qualirenovation.fr/devenir-partenaire" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-24 pb-16">
          {/* Hero */}
          <div className="container-tight px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto text-center mb-12 sm:mb-16">
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-4">
              Devenir partenaire
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Rejoignez notre réseau de partenaires et développez votre activité avec des projets de qualité.
            </p>
          </div>

          {/* Profile Selection */}
          <section ref={ref} className={`container-tight px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto mb-12 ${animationClasses}`}>
            <h2 className="font-display text-xl sm:text-2xl font-semibold text-foreground text-center mb-2">
              Quel est votre profil ?
            </h2>
            <p className="text-muted-foreground text-center mb-8">
              Sélectionnez la catégorie qui correspond le mieux à votre activité.
            </p>
            {errors.profile_type && (
              <p className="text-destructive text-sm text-center mb-4">{errors.profile_type}</p>
            )}
            <div className="flex flex-col gap-4">
              {profiles.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedProfile(p.id)}
                  className={`flex items-start gap-4 p-5 sm:p-6 rounded-xl border-2 transition-all text-left ${
                    selectedProfile === p.id
                      ? "border-accent bg-accent/5 shadow-elegant"
                      : "border-border bg-background hover:border-accent/40 hover:shadow-sm"
                  }`}
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                    selectedProfile === p.id ? "bg-accent/20" : "bg-secondary"
                  }`}>
                    <p.icon className="w-5 h-5 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display font-semibold text-foreground mb-1">{p.title}</h3>
                    <p className="text-muted-foreground text-sm">{p.description}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-1 transition-colors ${
                    selectedProfile === p.id ? "border-accent bg-accent" : "border-muted-foreground/30"
                  }`}>
                    {selectedProfile === p.id && (
                      <svg viewBox="0 0 20 20" fill="white" className="w-full h-full p-0.5">
                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Contact Form */}
          {selectedProfile && (
            <section className="container-tight px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
              <div className="bg-card p-6 sm:p-8 md:p-10 rounded-sm shadow-card">
                <h2 className="font-display text-xl sm:text-2xl font-semibold text-foreground mb-6">
                  Vos coordonnées
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Entreprise *</label>
                      <Input
                        value={formData.company_name}
                        onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                        placeholder="Nom de votre entreprise"
                        maxLength={200}
                      />
                      {errors.company_name && <p className="text-destructive text-xs mt-1">{errors.company_name}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Nom du contact *</label>
                      <Input
                        value={formData.contact_name}
                        onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                        placeholder="Prénom et nom"
                        maxLength={200}
                      />
                      {errors.contact_name && <p className="text-destructive text-xs mt-1">{errors.contact_name}</p>}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Email *</label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="contact@entreprise.fr"
                        maxLength={255}
                      />
                      {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Téléphone</label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="06 00 00 00 00"
                        maxLength={20}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Message</label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Décrivez brièvement votre activité et ce que vous recherchez..."
                      rows={4}
                      maxLength={2000}
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={submitting}>
                    {submitting ? "Envoi en cours..." : "Envoyer ma demande"}
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </section>
          )}
        </main>

        <Footer />
        <FloatingCTA />
      </div>
    </>
  );
};

export default DevenirPartenaire;
