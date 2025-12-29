import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Download, CheckCircle, AlertCircle, Database, ExternalLink, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface QueueStatus {
  projects: number;
  images: number;
  houzzProfileUrl: string;
}

const DEFAULT_URLS = `https://www.houzz.fr/hznb/projets/un-appartement-transforme-pour-mieux-louer-confort-et-dpe-ameliore-pj-vj~7739460
https://www.houzz.fr/hznb/projets/reinventer-un-appartement-parisien-pour-des-clients-en-province-pj-vj~7738195
https://www.houzz.fr/hznb/projets/au-gobelins-cet-ancien-f4-a-ete-entierement-reorchestre-pour-offrir-une-nouvel-pj-vj~7738188
https://www.houzz.fr/hznb/projets/vous-voulez-ouvrir-deux-pieces-mais-zut-il-y-a-un-mur-porteur-pj-vj~7738106
https://www.houzz.fr/hznb/projets/paris-19-de-l-ancien-au-contemporain-une-renovation-sur-mesure-pj-vj~7704321
https://www.houzz.fr/hznb/projets/projet-la-muette-pj-vj~7738134
https://www.houzz.fr/hznb/projets/projet-rueil-la-suite-parentale-%E2%9C%A8-pj-vj~7692838
https://www.houzz.fr/hznb/projets/avant-apres-une-maison-de-maitre-se-reinvente-avec-brio-pj-vj~7580205
https://www.houzz.fr/hznb/projets/parlons-de-votre-projet-pj-vj~7497684
https://www.houzz.fr/hznb/projets/projet-rueil-la-piece-de-vie-principale-%E2%9C%A8-pj-vj~7692819
https://www.houzz.fr/hznb/projets/projet-rueil-l-entree-pj-vj~7692820
https://www.houzz.fr/hznb/projets/projet-convention-3-en-1-mission-accomplie-%E2%9C%A8-pj-vj~7693030`;

const AdminImport = () => {
  const { toast } = useToast();
  
  // Database stats
  const [queueStatus, setQueueStatus] = useState<QueueStatus | null>(null);
  
  // Import state
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);
  const [urlsInput, setUrlsInput] = useState(DEFAULT_URLS);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Fetch database stats
  const fetchQueueStatus = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke('import-houzz', {
        body: { action: 'queue-status' },
      });

      if (error) throw error;
      setQueueStatus(data);
      return data;
    } catch (error) {
      console.error('Error fetching queue status:', error);
      return null;
    }
  }, []);

  useEffect(() => {
    fetchQueueStatus();
  }, [fetchQueueStatus]);

  // Parse URLs from textarea
  const parseUrls = (): string[] => {
    return urlsInput
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0 && url.startsWith('http'));
  };

  const handleImportClick = () => {
    const urls = parseUrls();
    
    if (urls.length === 0) {
      toast({
        title: "Erreur",
        description: "Aucune URL valide trouvée",
        variant: "destructive",
      });
      return;
    }

    // Show confirmation dialog if there are existing projects
    if (queueStatus && queueStatus.projects > 0) {
      setShowConfirmDialog(true);
    } else {
      handleImportUrls();
    }
  };

  // Import URLs
  const handleImportUrls = async () => {
    setShowConfirmDialog(false);
    const urls = parseUrls();

    setIsImporting(true);
    setImportResult(null);

    toast({
      title: "Import en cours...",
      description: `Récupération de ${urls.length} projets Houzz (peut prendre quelques minutes)`,
    });

    try {
      const { data, error } = await supabase.functions.invoke('import-houzz', {
        body: { action: 'import-urls', urls },
      });

      if (error) throw error;

      setImportResult(data);
      await fetchQueueStatus();
      
      if (data.success) {
        toast({
          title: "Import terminé ! 🎉",
          description: data.message,
        });
      } else {
        toast({
          title: "Erreur",
          description: data.error,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Error importing:', error);
      toast({
        title: "Erreur",
        description: error.message || "Échec de l'import",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const urlCount = parseUrls().length;

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <Link to="/" className="text-accent hover:underline">← Retour au site</Link>
          <nav className="flex gap-4 text-sm">
            <Link to="/admin/avis" className="text-muted-foreground hover:text-foreground">Avis</Link>
            <Link to="/admin/devis" className="text-muted-foreground hover:text-foreground">Devis</Link>
          </nav>
        </div>
        
        <h1 className="text-3xl font-display font-bold mb-2">Administration - Import Houzz</h1>
        <p className="text-muted-foreground mb-8">Importe les projets Houzz à partir des URLs fournies</p>
        
        {/* Database Stats */}
        {queueStatus && (
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Database className="w-5 h-5" />
                Base de données
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-6 mb-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{queueStatus.projects}</div>
                  <div className="text-sm text-muted-foreground">Projets</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent">{queueStatus.images}</div>
                  <div className="text-sm text-muted-foreground">Images</div>
                </div>
              </div>
              
              <a 
                href={queueStatus.houzzProfileUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-accent hover:underline"
              >
                <ExternalLink className="w-4 h-4" />
                Voir le profil Houzz complet
              </a>
            </CardContent>
          </Card>
        )}

        {/* Import Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Importer des projets
            </CardTitle>
            <CardDescription>
              Collez les URLs des projets Houzz à importer (une par ligne)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Textarea
                value={urlsInput}
                onChange={(e) => setUrlsInput(e.target.value)}
                placeholder="https://www.houzz.fr/hznb/projets/..."
                className="min-h-[200px] font-mono text-sm"
                disabled={isImporting}
              />
              <p className="text-sm text-muted-foreground mt-2">
                {urlCount} URL{urlCount > 1 ? 's' : ''} détectée{urlCount > 1 ? 's' : ''}
              </p>
            </div>

            <Button 
              onClick={handleImportClick} 
              disabled={isImporting || urlCount === 0}
              size="lg"
              className="w-full"
            >
              {isImporting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Import en cours... (peut prendre 1-2 min)
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Importer {urlCount} projet{urlCount > 1 ? 's' : ''}
                </>
              )}
            </Button>

            {/* Confirmation Dialog */}
            <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                    Confirmer le remplacement
                  </AlertDialogTitle>
                  <AlertDialogDescription className="space-y-2">
                    <p>
                      Cette action va <strong>supprimer les {queueStatus?.projects} projets existants</strong> et leurs {queueStatus?.images} images avant d'importer les nouveaux.
                    </p>
                    <p>Cette action est irréversible.</p>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction onClick={handleImportUrls} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Supprimer et importer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Import Result */}
            {importResult && (
              <div className={`p-4 rounded-lg ${importResult.success ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                {importResult.success ? (
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-700 dark:text-green-400">Import réussi !</p>
                      <p className="text-sm text-muted-foreground">{importResult.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Total: {importResult.total} | Scrapés: {importResult.scraped} | Importés: {importResult.imported} | Erreurs: {importResult.errors}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-700 dark:text-red-400">Erreur</p>
                      <p className="text-sm text-muted-foreground">{importResult.error}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">ℹ️ Comment ça marche</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              <strong>1.</strong> Collez les URLs des projets Houzz que vous souhaitez importer
            </p>
            <p>
              <strong>2.</strong> Cliquez sur "Importer" - chaque projet sera scrapé avec Firecrawl
            </p>
            <p>
              <strong>3.</strong> Les projets et leurs images seront enregistrés dans la base de données
            </p>
            <p>
              <strong>Note :</strong> L'import peut prendre 1-2 minutes pour 10+ projets (délai entre chaque requête)
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminImport;
