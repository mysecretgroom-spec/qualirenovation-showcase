import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Download, CheckCircle, AlertCircle, Database, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

interface QueueStatus {
  projects: number;
  images: number;
  houzzProfileUrl: string;
}

const AdminImport = () => {
  const { toast } = useToast();
  
  // Database stats
  const [queueStatus, setQueueStatus] = useState<QueueStatus | null>(null);
  
  // Import state
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);

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

  // Import latest projects
  const handleImportLatest = async () => {
    setIsImporting(true);
    setImportResult(null);

    toast({
      title: "Import en cours...",
      description: "Récupération des 10 derniers projets Houzz",
    });

    try {
      const { data, error } = await supabase.functions.invoke('import-houzz', {
        body: { action: 'import-latest', limit: 10 },
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

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <Link to="/" className="text-accent hover:underline">← Retour au site</Link>
        </div>
        
        <h1 className="text-3xl font-display font-bold mb-2">Administration - Import Houzz</h1>
        <p className="text-muted-foreground mb-8">Importe les 10 derniers projets avec un lien vers le profil Houzz complet</p>
        
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
              Importer les derniers projets
            </CardTitle>
            <CardDescription>
              Utilise Firecrawl pour récupérer les 10 derniers projets avec toutes leurs images
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <h4 className="font-medium mb-2">📸 Import rapide</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Récupère les 10 derniers projets Houzz avec leurs photos en haute résolution.
                Un lien vers le profil Houzz complet sera affiché pour voir les 115 réalisations.
              </p>
              <Button 
                onClick={handleImportLatest} 
                disabled={isImporting}
                size="lg"
                className="w-full"
              >
                {isImporting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Import en cours...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Importer les 10 derniers projets
                  </>
                )}
              </Button>
            </div>

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
                        Découverts: {importResult.discovered} | Importés: {importResult.imported} | Erreurs: {importResult.errors}
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
            <CardTitle className="text-lg">ℹ️ Fonctionnement</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              <strong>Approche simplifiée :</strong> Au lieu d'importer les 115 projets, 
              on affiche les 10 derniers avec un lien vers Houzz pour voir le reste.
            </p>
            <p>
              <strong>Avantage :</strong> Import rapide et fiable avec Firecrawl (déjà connecté).
            </p>
            <p>
              <strong>Sur le site :</strong> Un bouton "Voir toutes nos réalisations sur Houzz" 
              redirige les visiteurs vers le profil complet.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminImport;
