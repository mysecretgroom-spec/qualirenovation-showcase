import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Download, Loader2 } from "lucide-react";
import HCaptcha from "@hcaptcha/react-hcaptcha";

const leadSchema = z.object({
  name: z.string().trim().min(2, "Nom trop court").max(100, "Nom trop long"),
  email: z.string().trim().email("Email invalide").max(255),
  phone: z
    .string()
    .trim()
    .min(8, "Téléphone invalide")
    .max(25, "Téléphone trop long")
    .regex(/^[+0-9\s().-]+$/, "Format de téléphone invalide"),
  rgpdConsent: z.literal(true, {
    errorMap: () => ({ message: "Vous devez accepter la collecte de vos données pour continuer." }),
  }),
  marketingConsent: z.boolean().optional(),
});

interface LeadCaptureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Label of the resource being downloaded — stored on the lead for context. */
  resourceLabel: string;
  /** Triggered after the lead is saved. Receives the generated lead id for traceability. */
  onSuccess: (leadId: string) => void;
}

const LeadCaptureDialog = ({ open, onOpenChange, resourceLabel, onSuccess }: LeadCaptureDialogProps) => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [rgpdConsent, setRgpdConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<"name" | "email" | "phone" | "rgpdConsent", string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [siteKey, setSiteKey] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaRef = useRef<HCaptcha | null>(null);

  // Fetch hCaptcha site key when dialog opens (once)
  useEffect(() => {
    if (!open || siteKey) return;
    supabase.functions
      .invoke("lead-public-config")
      .then(({ data, error }) => {
        if (error) {
          console.error("lead-public-config:", error);
          return;
        }
        if (data?.siteKey) setSiteKey(data.siteKey);
      })
      .catch((err) => console.error("lead-public-config failed:", err));
  }, [open, siteKey]);

  const reset = () => {
    setName("");
    setEmail("");
    setPhone("");
    setRgpdConsent(false);
    setMarketingConsent(false);
    setErrors({});
    setCaptchaToken(null);
    captchaRef.current?.resetCaptcha();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = leadSchema.safeParse({ name, email, phone, rgpdConsent, marketingConsent });
    if (!parsed.success) {
      const flat = parsed.error.flatten().fieldErrors;
      setErrors({
        name: flat.name?.[0],
        email: flat.email?.[0],
        phone: flat.phone?.[0],
        rgpdConsent: flat.rgpdConsent?.[0],
      });
      return;
    }
    if (!captchaToken) {
      toast({
        title: "Vérification anti-spam",
        description: "Merci de valider le captcha avant de continuer.",
        variant: "destructive",
      });
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("submit-lead", {
        body: {
          name: parsed.data.name,
          email: parsed.data.email,
          phone: parsed.data.phone,
          resourceLabel,
          rgpdConsent: parsed.data.rgpdConsent,
          marketingConsent: parsed.data.marketingConsent ?? false,
          captchaToken,
        },
      });
      if (error || !data?.leadId) {
        const msg = (data as any)?.error || error?.message || "Enregistrement impossible.";
        toast({ title: "Erreur", description: msg, variant: "destructive" });
        captchaRef.current?.resetCaptcha();
        setCaptchaToken(null);
        setSubmitting(false);
        return;
      }
      const leadId: string = data.leadId;
      toast({
        title: "Merci !",
        description:
          "Votre téléchargement démarre. Un email de confirmation vous a été envoyé. Nous vous recontactons sous 48 h ouvrées.",
      });
      onSuccess(leadId);
      reset();
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer vos informations. Réessayez.",
        variant: "destructive",
      });
      captchaRef.current?.resetCaptcha();
      setCaptchaToken(null);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!submitting) onOpenChange(o); }}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto p-4 sm:p-6">
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

          <div className="space-y-3 pt-1">
            <div className="flex items-start gap-2.5">
              <Checkbox
                id="rgpd-consent"
                checked={rgpdConsent}
                onCheckedChange={(checked) => setRgpdConsent(checked === true)}
                aria-describedby="rgpd-consent-error"
              />
              <div className="grid gap-1 leading-none">
                <label
                  htmlFor="rgpd-consent"
                  className="text-sm font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  J'accepte que mes données personnelles soient collectées pour être recontacté par QUALIRENOVATION{" "}
                  <span className="text-destructive">*</span>
                </label>
                <p className="text-xs text-muted-foreground">
                  Vos données ne sont jamais cédées à des tiers. Vous pouvez demander leur suppression à tout moment.
                </p>
                {errors.rgpdConsent && (
                  <p id="rgpd-consent-error" className="text-xs text-destructive">{errors.rgpdConsent}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Checkbox
                id="marketing-consent"
                checked={marketingConsent}
                onCheckedChange={(checked) => setMarketingConsent(checked === true)}
              />
              <div className="grid gap-1 leading-none">
                <label
                  htmlFor="marketing-consent"
                  className="text-sm font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  J'accepte de recevoir des communications marketing (offres, inspirations, conseils rénovation)
                </label>
                <p className="text-xs text-muted-foreground">
                  Optionnel — vous pouvez vous désinscrire à tout moment.
                </p>
              </div>
            </div>
          </div>

          {siteKey && (
            <div className="flex justify-center pt-1">
              <HCaptcha
                ref={captchaRef}
                sitekey={siteKey}
                onVerify={(token) => setCaptchaToken(token)}
                onExpire={() => setCaptchaToken(null)}
                onError={() => setCaptchaToken(null)}
              />
            </div>
          )}
          {!siteKey && (
            <p className="text-xs text-muted-foreground text-center">
              Chargement de la vérification anti-spam…
            </p>
          )}
          {siteKey && !captchaToken && (
            <p className="text-xs text-muted-foreground text-center">
              Cochez la case de vérification ci-dessus pour activer le téléchargement.
            </p>
          )}

          <DialogFooter>
            <Button
              type="submit"
              disabled={submitting || !rgpdConsent}
              className="w-full"
            >
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
