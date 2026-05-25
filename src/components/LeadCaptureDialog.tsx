import { useState } from "react";
import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Download, Loader2 } from "lucide-react";

const leadSchema = z.object({
  name: z.string().trim().min(2, "Nom trop court").max(100, "Nom trop long"),
  email: z.string().trim().email("Email invalide").max(255),
  phone: z
    .string()
    .trim()
    .min(8, "Téléphone invalide")
    .max(25, "Téléphone trop long")
    .regex(/^[+0-9\s().-]+$/, "Format de téléphone invalide"),
});

interface LeadCaptureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Label of the resource being downloaded — stored on the lead for context. */
  resourceLabel: string;
  /** Triggered after the lead is saved. Should perform the actual download. */
  onSuccess: () => void;
}

const LeadCaptureDialog = ({ open, onOpenChange, resourceLabel, onSuccess }: LeadCaptureDialogProps) => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<Partial<Record<"name" | "email" | "phone", string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setName("");
    setEmail("");
    setPhone("");
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = leadSchema.safeParse({ name, email, phone });
    if (!parsed.success) {
      const flat = parsed.error.flatten().fieldErrors;
      setErrors({
        name: flat.name?.[0],
        email: flat.email?.[0],
        phone: flat.phone?.[0],
      });
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const { error } = await supabase.from("quote_requests").insert({
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        message: `Téléchargement de la ressource : ${resourceLabel}`,
        surface: "Non renseigné",
        budget: "Non renseigné",
        timeline: "Non renseigné",
        status: "lead_pdf",
      });
      if (error) throw error;
      toast({
        title: "Merci !",
        description: "Votre téléchargement démarre. Nous vous recontactons rapidement.",
      });
      onSuccess();
      reset();
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer vos informations. Réessayez.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!submitting) onOpenChange(o); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Recevez votre guide PDF</DialogTitle>
          <DialogDescription>
            Renseignez vos coordonnées pour télécharger « {resourceLabel} ». Nous vous
            recontactons sous 48 h si vous avez un projet de rénovation.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="lead-name">Nom complet</Label>
            <Input
              id="lead-name"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
              required
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lead-email">Email</Label>
            <Input
              id="lead-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={255}
              required
            />
            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lead-phone">Téléphone</Label>
            <Input
              id="lead-phone"
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength={25}
              placeholder="+33 6 12 34 56 78"
              required
            />
            {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
          </div>
          <p className="text-xs text-muted-foreground">
            En soumettant ce formulaire, vous acceptez d'être recontacté par
            QUALIRENOVATION. Vos données ne sont jamais cédées à des tiers.
          </p>
          <DialogFooter>
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Envoi…</>
              ) : (
                <><Download className="w-4 h-4 mr-2" /> Télécharger le PDF</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LeadCaptureDialog;