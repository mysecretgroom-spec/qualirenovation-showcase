import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Send, ArrowRight, Settings2 } from "lucide-react";
import { z } from "zod";
import AddressAutocomplete from "./AddressAutocomplete";
import { useLeadContext } from "@/contexts/LeadContext";

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
    .max(100, "La ville ne peut pas dépasser 100 caractères")
    .optional()
    .transform(val => val?.trim() || ''),
  address: z
    .string()
    .min(5, "L'adresse doit contenir au moins 5 caractères")
    .max(500, "L'adresse ne peut pas dépasser 500 caractères")
    .transform(val => val.trim()),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
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
  showConfigurationOption?: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
  address?: string;
  surface?: string;
  budget?: string;
  timeline?: string;
  message?: string;
}

const QuoteModal = ({ open, onOpenChange, showConfigurationOption = true }: QuoteModalProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { setLeadData } = useLeadContext();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    postalCode: "",
    address: "",
    latitude: undefined as number | undefined,
    longitude: undefined as number | undefined,
    surface: "",
    budget: "",
    timeline: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessOptions, setShowSuccessOptions] = useState(false);
  const [submittedData, setSubmittedData] = useState<typeof formData | null>(null);
  const [website, setWebsite] = useState("");
  const [formOpenedAt] = useState(() => Date.now());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleAddressChange = (result: { address: string; latitude: number; longitude: number; city?: string; postalCode?: string } | null) => {
    if (result) {
      setFormData((prev) => ({
        ...prev,
        address: result.address,
        latitude: result.latitude !== 0 ? result.latitude : prev.latitude,
        longitude: result.longitude !== 0 ? result.longitude : prev.longitude,
        city: result.city || prev.city,
        postalCode: result.postalCode || prev.postalCode,
      }));
      if (errors.address) {
        setErrors((prev) => ({ ...prev, address: undefined }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        address: "",
        latitude: undefined,
        longitude: undefined,
        city: "",
        postalCode: "",
      }));
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
    if (!validateForm()) return;

    if (website) {
      toast({
        title: "Demande de devis envoyée !",
        description: "Un email de confirmation vous a été envoyé.",
      });
      onOpenChange(false);
      return;
    }

    const timeSpentMs = Date.now() - formOpenedAt;
    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke('send-quote-confirmation', {
        body: { 
          ...formData, 
          _hp: website,
          _ts: formOpenedAt,
          _duration: timeSpentMs,
        },
      });

      if (error) {
        toast({
          title: "Erreur",
          description: "Une erreur est survenue. Veuillez réessayer ou nous contacter directement.",
          variant: "destructive",
        });
        return;
      }

      setSubmittedData({ ...formData });
      
      if (showConfigurationOption) {
        setShowSuccessOptions(true);
      } else {
        toast({
          title: "Demande de devis envoyée !",
          description: "Un email de confirmation vous a été envoyé. Nous vous recontacterons sous 48h.",
        });
        resetAndClose();
      }
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      city: "",
      postalCode: "",
      address: "",
      latitude: undefined,
      longitude: undefined,
      surface: "",
      budget: "",
      timeline: "",
      message: "",
    });
    setErrors({});
    setShowSuccessOptions(false);
    setSubmittedData(null);
    onOpenChange(false);
  };

  const handleContinueToConfiguration = () => {
    if (submittedData) {
      setLeadData({
        name: submittedData.name,
        email: submittedData.email,
        phone: submittedData.phone,
        address: submittedData.address,
        city: submittedData.city,
        postalCode: submittedData.postalCode,
        latitude: submittedData.latitude,
        longitude: submittedData.longitude,
        surface: submittedData.surface,
        budget: submittedData.budget,
        timeline: submittedData.timeline,
        message: submittedData.message,
      });
    }
    resetAndClose();
    navigate('/renovation-complete');
  };

  const handleCloseWithoutConfig = () => {
    toast({
      title: "Demande de devis envoyée !",
      description: "Un email de confirmation vous a été envoyé. Nous vous recontacterons sous 48h.",
    });
    resetAndClose();
  };

  // Success options screen after form submission
  if (showSuccessOptions) {
    return (
      <Dialog open={open} onOpenChange={(isOpen) => {
        if (!isOpen) handleCloseWithoutConfig();
      }}>
        <DialogContent className="sm:max-w-lg bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl font-semibold text-foreground text-center">
              🎉 Demande envoyée !
            </DialogTitle>
          </DialogHeader>

          <div className="py-6 text-center space-y-4">
            <p className="text-muted-foreground">
              Un email de confirmation vous a été envoyé. 
              Nous vous recontacterons sous 48h.
            </p>

            <div className="bg-secondary/50 rounded-lg p-6 mt-6">
              <h3 className="font-semibold text-foreground mb-2 flex items-center justify-center gap-2">
                <Settings2 className="w-5 h-5 text-accent" />
                Aller plus loin
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Configurez les détails de chaque pièce (matériaux, finitions, équipements...) 
                pour recevoir une estimation plus précise.
              </p>
              <Button 
                onClick={handleContinueToConfiguration} 
                className="w-full"
                size="lg"
              >
                Configurer mon projet
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            <button
              type="button"
              onClick={handleCloseWithoutConfig}
              className="text-sm text-muted-foreground hover:text-foreground underline transition-colors"
            >
              Non merci, fermer
            </button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

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

          {/* Adresse du chantier */}
          <AddressAutocomplete
            value={formData.address}
            onChange={handleAddressChange}
            error={errors.address}
          />

          {/* Ville & Code postal */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="modal-postal-code" className="block text-sm font-medium text-foreground mb-1.5">
                Code postal
              </label>
              <input
                type="text"
                id="modal-postal-code"
                name="postalCode"
                value={formData.postalCode}
                readOnly
                className={`w-full px-4 py-2.5 rounded-sm border border-input text-foreground cursor-not-allowed ${
                  formData.postalCode ? 'bg-secondary' : 'bg-muted'
                }`}
                placeholder="Sélectionnez une adresse ci-dessus"
              />
            </div>
            <div>
              <label htmlFor="modal-city" className="block text-sm font-medium text-foreground mb-1.5">
                Ville
              </label>
              <input
                type="text"
                id="modal-city"
                name="city"
                value={formData.city}
                readOnly
                className={`w-full px-4 py-2.5 rounded-sm border border-input text-foreground cursor-not-allowed ${
                  formData.city ? 'bg-secondary' : 'bg-muted'
                }`}
                placeholder="Sélectionnez une adresse ci-dessus"
              />
            </div>
          </div>

          {/* Surface */}
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
                  <SelectItem key={range.value} value={range.value} className="cursor-pointer hover:bg-secondary">
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
                  <SelectItem key={option.value} value={option.value} className="cursor-pointer hover:bg-secondary">
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

          {/* Honeypot */}
          <div className="absolute -left-[9999px] opacity-0 h-0 overflow-hidden" aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input
              type="text"
              id="website"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            {isSubmitting ? "Envoi en cours..." : (
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
