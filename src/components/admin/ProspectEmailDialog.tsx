import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  MessageCircle, 
  Send, 
  FileText, 
  Image, 
  Paperclip, 
  X, 
  Loader2,
  ClipboardList,
  Phone
} from "lucide-react";

interface QuoteRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface Attachment {
  file: File;
  preview?: string;
}

interface ProspectEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quote: QuoteRequest | null;
  onEmailSent?: () => void;
}

const WHATSAPP_NUMBER = "33659764685";

const ProspectEmailDialog = ({ 
  open, 
  onOpenChange, 
  quote,
  onEmailSent 
}: ProspectEmailDialogProps) => {
  const [activeTab, setActiveTab] = useState<string>("followup");
  const [sending, setSending] = useState(false);
  const [customSubject, setCustomSubject] = useState("");
  const [customContent, setCustomContent] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const { toast } = useToast();

  const handleSendMaterialFollowup = async () => {
    if (!quote) return;
    
    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-prospect-followup', {
        body: {
          email: quote.email,
          name: quote.name,
          type: 'material_followup'
        }
      });

      if (error) throw error;

      toast({
        title: "Email envoyé",
        description: `L'email de suivi matériaux a été envoyé à ${quote.name}.`,
      });
      
      onOpenChange(false);
      onEmailSent?.();
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer l'email. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const handleSendCustomEmail = async () => {
    if (!quote || !customSubject || !customContent) {
      toast({
        title: "Champs manquants",
        description: "Veuillez remplir le sujet et le contenu de l'email.",
        variant: "destructive",
      });
      return;
    }
    
    setSending(true);
    try {
      // Convert attachments to base64
      const attachmentsData = await Promise.all(
        attachments.map(async (att) => {
          const base64 = await fileToBase64(att.file);
          return {
            filename: att.file.name,
            content: base64,
            contentType: att.file.type
          };
        })
      );

      const { data, error } = await supabase.functions.invoke('send-prospect-followup', {
        body: {
          email: quote.email,
          name: quote.name,
          type: 'custom',
          subject: customSubject,
          customContent: customContent,
          attachments: attachmentsData.length > 0 ? attachmentsData : undefined
        }
      });

      if (error) throw error;

      toast({
        title: "Email envoyé",
        description: `L'email personnalisé a été envoyé à ${quote.name}.`,
      });
      
      // Reset form
      setCustomSubject("");
      setCustomContent("");
      setAttachments([]);
      onOpenChange(false);
      onEmailSent?.();
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer l'email. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data URL prefix
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newAttachments: Attachment[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Limit file size to 5MB
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Fichier trop volumineux",
          description: `${file.name} dépasse la limite de 5 Mo.`,
          variant: "destructive",
        });
        continue;
      }
      
      const attachment: Attachment = { file };
      if (file.type.startsWith('image/')) {
        attachment.preview = URL.createObjectURL(file);
      }
      newAttachments.push(attachment);
    }

    setAttachments(prev => [...prev, ...newAttachments]);
    // Reset input
    e.target.value = '';
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => {
      const newAttachments = [...prev];
      if (newAttachments[index].preview) {
        URL.revokeObjectURL(newAttachments[index].preview!);
      }
      newAttachments.splice(index, 1);
      return newAttachments;
    });
  };

  const openWhatsApp = () => {
    if (!quote) return;
    const message = encodeURIComponent(
      `Bonjour ${quote.name}, suite à votre demande de devis, je souhaitais savoir si vous aviez besoin d'aide pour vos choix de matériaux ?`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  if (!quote) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-accent" />
            Discussion avec {quote.name}
          </DialogTitle>
          <DialogDescription>
            Email : {quote.email} | Tél : {quote.phone}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="followup" className="flex items-center gap-2">
              <ClipboardList className="w-4 h-4" />
              Suivi Matériaux
            </TabsTrigger>
            <TabsTrigger value="custom" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Email Personnalisé
            </TabsTrigger>
          </TabsList>

          <TabsContent value="followup" className="mt-4 space-y-4">
            <div className="bg-secondary p-4 rounded-sm">
              <h4 className="font-semibold text-foreground mb-2">Contenu de l'email :</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Cet email demande au prospect s'il a finalisé ses choix de matériaux et propose :
              </p>
              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                <li>Un lien vers le formulaire de sélection matériaux (renovermasalledebain.fr)</li>
                <li>Un bouton WhatsApp pour une assistance directe</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={handleSendMaterialFollowup} 
                disabled={sending}
                className="flex-1"
              >
                {sending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                Envoyer l'email de suivi
              </Button>
              
              <Button 
                variant="outline" 
                onClick={openWhatsApp}
                className="flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                WhatsApp
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="custom" className="mt-4 space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="subject">Objet de l'email</Label>
                <Input
                  id="subject"
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  placeholder="Ex: Suite à votre demande de devis..."
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="content">Contenu de l'email</Label>
                <Textarea
                  id="content"
                  value={customContent}
                  onChange={(e) => setCustomContent(e.target.value)}
                  placeholder="Rédigez votre message ici...

Le style et la signature seront automatiquement ajoutés."
                  rows={8}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Le format HTML (en-tête, signature, pied de page) sera appliqué automatiquement.
                </p>
              </div>

              {/* Attachments section */}
              <div>
                <Label>Pièces jointes</Label>
                <div className="mt-2 space-y-2">
                  {attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 p-3 bg-secondary rounded-sm">
                      {attachments.map((att, index) => (
                        <div 
                          key={index} 
                          className="flex items-center gap-2 bg-background px-3 py-2 rounded-sm border border-border"
                        >
                          {att.preview ? (
                            <img 
                              src={att.preview} 
                              alt={att.file.name} 
                              className="w-8 h-8 object-cover rounded"
                            />
                          ) : att.file.type === 'application/pdf' ? (
                            <FileText className="w-5 h-5 text-red-500" />
                          ) : (
                            <Paperclip className="w-5 h-5 text-muted-foreground" />
                          )}
                          <span className="text-sm truncate max-w-[150px]">{att.file.name}</span>
                          <span className="text-xs text-muted-foreground">
                            ({(att.file.size / 1024).toFixed(0)} Ko)
                          </span>
                          <button 
                            onClick={() => removeAttachment(index)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Label 
                      htmlFor="file-upload" 
                      className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-border rounded-sm hover:bg-secondary transition-colors"
                    >
                      <Image className="w-4 h-4" />
                      Image
                    </Label>
                    <Label 
                      htmlFor="pdf-upload" 
                      className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-border rounded-sm hover:bg-secondary transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      PDF
                    </Label>
                    <input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <input
                      id="pdf-upload"
                      type="file"
                      accept=".pdf"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Taille max par fichier : 5 Mo
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={handleSendCustomEmail} 
                disabled={sending || !customSubject || !customContent}
                className="flex-1"
              >
                {sending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                Envoyer l'email
              </Button>
              
              <Button 
                variant="outline" 
                onClick={openWhatsApp}
                className="flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                WhatsApp
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ProspectEmailDialog;
