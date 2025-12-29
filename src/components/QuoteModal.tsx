import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Send, X } from "lucide-react";

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

interface QuoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const QuoteModal = ({ open, onOpenChange }: QuoteModalProps) => {
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
        message: "",
      });
      onOpenChange(false);
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-semibold text-foreground">
            Demande de devis gratuit
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Nom */}
          <div>
            <label htmlFor="modal-name" className="block text-sm font-medium text-foreground mb-1.5">
              Votre nom *
            </label>
            <input
              type="text"
              id="modal-name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-sm border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all"
              placeholder="Jean Dupont"
            />
          </div>

          {/* Email & Téléphone */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="modal-email" className="block text-sm font-medium text-foreground mb-1.5">
                Email *
              </label>
              <input
                type="email"
                id="modal-email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-sm border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                placeholder="jean@exemple.fr"
              />
            </div>
            <div>
              <label htmlFor="modal-phone" className="block text-sm font-medium text-foreground mb-1.5">
                Téléphone *
              </label>
              <input
                type="tel"
                id="modal-phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-sm border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                placeholder="06 12 34 56 78"
              />
            </div>
          </div>

          {/* Ville & Surface */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="modal-city" className="block text-sm font-medium text-foreground mb-1.5">
                Ville du bien *
              </label>
              <input
                type="text"
                id="modal-city"
                name="city"
                required
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-sm border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                placeholder="Paris 16ème"
              />
            </div>
            <div>
              <label htmlFor="modal-surface" className="block text-sm font-medium text-foreground mb-1.5">
                Surface (m²) *
              </label>
              <input
                type="text"
                id="modal-surface"
                name="surface"
                required
                value={formData.surface}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-sm border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                placeholder="85"
              />
            </div>
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Fourchette de budget *
            </label>
            <Select
              value={formData.budget}
              onValueChange={(value) => handleSelectChange("budget", value)}
              required
            >
              <SelectTrigger className="w-full px-4 py-2.5 h-auto rounded-sm border border-input bg-background text-foreground">
                <SelectValue placeholder="Sélectionnez votre budget" />
              </SelectTrigger>
              <SelectContent className="bg-card border border-input z-[100]">
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
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Quand démarrer ? *
            </label>
            <Select
              value={formData.timeline}
              onValueChange={(value) => handleSelectChange("timeline", value)}
              required
            >
              <SelectTrigger className="w-full px-4 py-2.5 h-auto rounded-sm border border-input bg-background text-foreground">
                <SelectValue placeholder="Sélectionnez une période" />
              </SelectTrigger>
              <SelectContent className="bg-card border border-input z-[100]">
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

          {/* Description */}
          <div>
            <label htmlFor="modal-message" className="block text-sm font-medium text-foreground mb-1.5">
              Décrivez votre projet *
            </label>
            <textarea
              id="modal-message"
              name="message"
              required
              rows={3}
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-sm border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all resize-none"
              placeholder="Type de travaux, pièces concernées..."
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

          <p className="text-xs text-muted-foreground text-center">
            En soumettant ce formulaire, vous acceptez d'être recontacté par notre équipe.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default QuoteModal;
