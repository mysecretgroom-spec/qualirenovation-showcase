import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const contactInfo = [
  {
    icon: MapPin,
    title: "Zone d'intervention",
    details: ["Paris & Île-de-France", "Neuilly, Boulogne, Levallois...", "Créteil, Ivry, Alfortville..."],
  },
  {
    icon: Phone,
    title: "Téléphone",
    details: ["Appelez-nous pour un devis"],
  },
  {
    icon: Mail,
    title: "Email",
    details: ["contact@qualirenovation.fr"],
  },
  {
    icon: Clock,
    title: "Horaires",
    details: ["Lun - Ven: 9h00 - 18h00", "Sam: Sur rendez-vous"],
  },
];

const budgetRanges = [
  { value: "2000-10000", label: "2 000 € - 10 000 €" },
  { value: "10000-30000", label: "10 000 € - 30 000 €" },
  { value: "30000-50000", label: "30 000 € - 50 000 €" },
  { value: "50000-100000", label: "50 000 € - 100 000 €" },
  { value: "100000-200000", label: "100 000 € - 200 000 €" },
  { value: "200000+", label: "Supérieur à 200 000 €" },
];

const timelineOptions = [
  { value: "urgent", label: "Dès que possible" },
  { value: "1-month", label: "Dans le mois" },
  { value: "1-3-months", label: "Dans 1 à 3 mois" },
  { value: "3-6-months", label: "Dans 3 à 6 mois" },
  { value: "6-months+", label: "Dans plus de 6 mois" },
  { value: "undetermined", label: "Pas encore déterminé" },
];

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    surface: "",
    budget: "",
    timeline: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('send-quote-confirmation', {
        body: formData,
      });

      if (error) {
        console.error('Error sending quote request:', error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue. Veuillez réessayer ou nous contacter directement.",
          variant: "destructive",
        });
        return;
      }

      console.log('Quote request sent successfully:', data);
      toast({
        title: "Demande de devis envoyée !",
        description: "Un email de confirmation vous a été envoyé. Nous vous recontacterons sous 48h.",
      });
      
      setFormData({ 
        name: "", 
        email: "", 
        phone: "", 
        city: "", 
        surface: "",
        budget: "",
        timeline: "",
        message: "" 
      });
    } catch (err) {
      console.error('Unexpected error:', err);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section-padding bg-background">
      <div className="container-tight">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left Column - Info */}
          <div className="animate-fade-in-up">
            <span className="text-accent font-medium text-sm tracking-widest uppercase mb-4 block">
              Contact
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-6">
              Parlons de votre
              <br />
              <span className="italic font-normal text-muted-foreground">projet</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-10">
              Consultation gratuite, devis détaillé sous 48h. 
              Décrivez-nous votre projet et nous vous recontacterons rapidement.
            </p>

            {/* Contact Info Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              {contactInfo.map((info) => (
                <div key={info.title} className="flex gap-4">
                  <div className="w-12 h-12 rounded-sm bg-secondary flex items-center justify-center flex-shrink-0">
                    <info.icon className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">{info.title}</h4>
                    {info.details.map((detail, i) => (
                      <p key={i} className="text-muted-foreground text-sm">
                        {detail}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Company Info */}
            <div className="mt-10 pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">QUALIRENOVATION BY QUALICONCEPT</strong>
                <br />
                SIRET : 85286728200034
              </p>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="animate-fade-in-up animation-delay-200">
            <form 
              onSubmit={handleSubmit}
              className="bg-card p-8 md:p-10 rounded-sm shadow-card"
            >
              <h3 className="font-display text-2xl font-semibold text-foreground mb-6">
                Demande de devis gratuit
              </h3>

              <div className="space-y-5">
                {/* Nom */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Votre nom *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-sm border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                    placeholder="Jean Dupont"
                  />
                </div>

                {/* Email & Téléphone */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-sm border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                      placeholder="jean@exemple.fr"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                      Téléphone *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-sm border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                      placeholder="06 12 34 56 78"
                    />
                  </div>
                </div>

                {/* Ville & Surface */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-foreground mb-2">
                      Ville du bien à rénover *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-sm border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                      placeholder="Paris 16ème"
                    />
                  </div>
                  <div>
                    <label htmlFor="surface" className="block text-sm font-medium text-foreground mb-2">
                      Surface des travaux (m²) *
                    </label>
                    <input
                      type="text"
                      id="surface"
                      name="surface"
                      required
                      value={formData.surface}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-sm border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                      placeholder="85"
                    />
                  </div>
                </div>

                {/* Budget */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Fourchette de budget *
                  </label>
                  <Select 
                    value={formData.budget} 
                    onValueChange={(value) => handleSelectChange("budget", value)}
                    required
                  >
                    <SelectTrigger className="w-full px-4 py-3 h-auto rounded-sm border border-input bg-background text-foreground">
                      <SelectValue placeholder="Sélectionnez votre budget" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border border-input">
                      {budgetRanges.map((range) => (
                        <SelectItem 
                          key={range.value} 
                          value={range.value}
                          className="cursor-pointer hover:bg-secondary"
                        >
                          {range.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Timeline */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Quand souhaitez-vous démarrer les travaux ? *
                  </label>
                  <Select 
                    value={formData.timeline} 
                    onValueChange={(value) => handleSelectChange("timeline", value)}
                    required
                  >
                    <SelectTrigger className="w-full px-4 py-3 h-auto rounded-sm border border-input bg-background text-foreground">
                      <SelectValue placeholder="Sélectionnez une période" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border border-input">
                      {timelineOptions.map((option) => (
                        <SelectItem 
                          key={option.value} 
                          value={option.value}
                          className="cursor-pointer hover:bg-secondary"
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Description du projet */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                    Décrivez votre projet *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-sm border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all resize-none"
                    placeholder="Décrivez votre projet de rénovation : type de travaux, pièces concernées, contraintes particulières..."
                  />
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? (
                    "Envoi en cours..."
                  ) : (
                    <>
                      Demander mon devis gratuit
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center mt-4">
                En soumettant ce formulaire, vous acceptez d'être recontacté par notre équipe.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
