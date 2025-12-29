import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    postalCode: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast({
      title: "Message envoyé !",
      description: "Nous vous recontacterons dans les plus brefs délais.",
    });
    
    setFormData({ name: "", email: "", phone: "", postalCode: "", message: "" });
    setIsSubmitting(false);
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

                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-foreground mb-2">
                    Code postal du projet
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-sm border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                    placeholder="75016"
                  />
                </div>

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
                    placeholder="Rénovation salle de bain, cuisine ouverte, etc."
                  />
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? (
                    "Envoi en cours..."
                  ) : (
                    <>
                      Envoyer ma demande
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
