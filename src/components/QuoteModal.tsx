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
import { Send } from "lucide-react";
import { z } from "zod";

// =============================================
// VALIDATION SCHEMA
// =============================================

const quoteFormSchema = z.object({
  name: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Le nom ne peut pas dépasser 100 caractères")
    .transform(val => val.trim()),
  email: z
    .string()
    .email("Adresse email invalide")
    .max(255, "L'email ne peut pas dépasser 255 caractères")
    .transform(val => val.trim().toLowerCase()),
  phone: z
    .string()
    .min(10, "Numéro de téléphone invalide")
    .max(20, "Numéro de téléphone trop long")
    .refine(
      (val) => {
        const cleanPhone = val.replace(/[\s.\-]/g, '');
        return /^(?:(?:\+|00)33|0)[1-9](?:[0-9]{8})$/.test(cleanPhone);
      },
      "Numéro de téléphone français invalide"
    ),
  city: z
    .string()
    .min(2, "La ville doit contenir au moins 2 caractères")
    .max(100, "La ville ne peut pas dépasser 100 caractères")
    .transform(val => val.trim()),
  surface: z
    .string()
    .refine(val => /^\d+$/.test(val), "La surface doit être un nombre")
    .refine(val => parseInt(val) >= 1 && parseInt(val) <= 10000, "Surface entre 1 et 10 000 m²"),
  budget: z
    .string()
    .refine(
      val => ["2000-10000", "10000-30000", "30000-50000", "50000-100000", "100000-200000", "200000+"].includes(val),
      "Sélectionnez une fourchette de budget"
    ),
  timeline: z
    .string()
    .refine(
      val => ["urgent", "1-month", "1-3-months", "3-6-months", "6-months+", "undetermined"].includes(val),
      "Sélectionnez une période de démarrage"
    ),
  message: z
    .string()
    .min(10, "La description doit contenir au moins 10 caractères")
    .max(2000, "La description ne peut pas dépasser 2000 caractères")
    .transform(val => val.trim()),
});

type QuoteFormData = z.infer<typeof quoteFormSchema>;

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

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
  surface?: string;
  budget?: string;
  timeline?: string;
  message?: string;
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
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user selects
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const result = quoteFormSchema.safeParse(formData);
    
    if (!result.success) {
      const newErrors: FormErrors = {};
      for (const error of result.error.errors) {
        const field = error.path[0] as keyof FormErrors;
        if (!newErrors[field]) {
          newErrors[field] = error.message;
        }
      }
      setErrors(newErrors);
      return false;
    }
    
    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

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
      setErrors({});
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
              Votre nom * <span className="text-muted-foreground font-normal">(max 100 car.)</span>
            </label>
            <input
              type="text"
              id="modal-name"
              name="name"
              maxLength={100}
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 rounded-sm border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all ${
                errors.name ? 'border-destructive' : 'border-input'
              }`}
              placeholder="Jean Dupont"
            />
            {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
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
                maxLength={255}
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-sm border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all ${
                  errors.email ? 'border-destructive' : 'border-input'
                }`}
                placeholder="jean@exemple.fr"
              />
              {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="modal-phone" className="block text-sm font-medium text-foreground mb-1.5">
                Téléphone *
              </label>
              <input
                type="tel"
                id="modal-phone"
                name="phone"
                maxLength={20}
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-sm border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all ${
                  errors.phone ? 'border-destructive' : 'border-input'
                }`}
                placeholder="06 12 34 56 78"
              />
              {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone}</p>}
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
                maxLength={100}
                value={formData.city}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-sm border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all ${
                  errors.city ? 'border-destructive' : 'border-input'
                }`}
                placeholder="Paris 16ème"
              />
              {errors.city && <p className="text-sm text-destructive mt-1">{errors.city}</p>}
            </div>
            <div>
              <label htmlFor="modal-surface" className="block text-sm font-medium text-foreground mb-1.5">
                Surface (m²) *
              </label>
              <input
                type="text"
                id="modal-surface"
                name="surface"
                maxLength={5}
                value={formData.surface}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-sm border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all ${
                  errors.surface ? 'border-destructive' : 'border-input'
                }`}
                placeholder="85"
              />
              {errors.surface && <p className="text-sm text-destructive mt-1">{errors.surface}</p>}
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
            >
              <SelectTrigger className={`w-full px-4 py-2.5 h-auto rounded-sm border bg-background text-foreground ${
                errors.budget ? 'border-destructive' : 'border-input'
              }`}>
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
            {errors.budget && <p className="text-sm text-destructive mt-1">{errors.budget}</p>}
          </div>

          {/* Timeline */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Quand démarrer ? *
            </label>
            <Select
              value={formData.timeline}
              onValueChange={(value) => handleSelectChange("timeline", value)}
            >
              <SelectTrigger className={`w-full px-4 py-2.5 h-auto rounded-sm border bg-background text-foreground ${
                errors.timeline ? 'border-destructive' : 'border-input'
              }`}>
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
            {errors.timeline && <p className="text-sm text-destructive mt-1">{errors.timeline}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="modal-message" className="block text-sm font-medium text-foreground mb-1.5">
              Décrivez votre projet * <span className="text-muted-foreground font-normal">({formData.message.length}/2000)</span>
            </label>
            <textarea
              id="modal-message"
              name="message"
              rows={3}
              maxLength={2000}
              value={formData.message}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 rounded-sm border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all resize-none ${
                errors.message ? 'border-destructive' : 'border-input'
              }`}
              placeholder="Type de travaux, pièces concernées..."
            />
            {errors.message && <p className="text-sm text-destructive mt-1">{errors.message}</p>}
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
