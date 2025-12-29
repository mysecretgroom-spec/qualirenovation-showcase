import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Download, CheckCircle, AlertCircle, Play, RefreshCw, Zap, Database } from "lucide-react";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

interface QueueStatus {
  projects: number;
  images: number;
  pending: number;
  processing: number;
  completed: number;
  failed: number;
  total: number;
}

interface ScraperStatus {
  runId: string | null;
  status: string;
  isRunning: boolean;
}

const AdminImport = () => {
  const { toast } = useToast();
  
  // Database stats
  const [queueStatus, setQueueStatus] = useState<QueueStatus | null>(null);
  
  // Apify scraper state
  const [scraperStatus, setScraperStatus] = useState<ScraperStatus>({ 
    runId: null, 
    status: 'idle', 
    isRunning: false 
  });
  const [isStarting, setIsStarting] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isFullImport, setIsFullImport] = useState(false);
  
  // Results
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

  // Step 1: Start Apify scraper
  const handleStartScraper = async () => {
    setIsStarting(true);
    setImportResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('import-houzz', {
        body: { action: 'start-scraper' },
      });

      if (error) throw error;

      setScraperStatus({
        runId: data.runId,
        status: data.status,
        isRunning: true,
      });
      
      toast({
        title: "Scraper Apify démarré",
        description: `ID: ${data.runId}. Le scraping de Houzz est en cours...`,
      });
    } catch (error: any) {
      console.error('Error starting scraper:', error);
      toast({
        title: "Erreur",
        description: error.message || "Échec du démarrage du scraper",
        variant: "destructive",
      });
    } finally {
      setIsStarting(false);
    }
  };

  // Step 2: Check scraper status
  const handleCheckStatus = async () => {
    if (!scraperStatus.runId) {
      toast({
        title: "Erreur",
        description: "Aucun scraper en cours. Démarrez-en un d'abord.",
        variant: "destructive",
      });
      return;
    }

    setIsChecking(true);

    try {
      const { data, error } = await supabase.functions.invoke('import-houzz', {
        body: { action: 'check-status', runId: scraperStatus.runId },
      });

      if (error) throw error;

      setScraperStatus({
        runId: data.runId,
        status: data.status,
        isRunning: data.status === 'RUNNING' || data.status === 'READY',
      });
      
      toast({
        title: "Statut du scraper",
        description: `Statut: ${data.status}`,
      });
    } catch (error: any) {
      console.error('Error checking status:', error);
      toast({
        title: "Erreur",
        description: error.message || "Échec de la vérification du statut",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  // Step 3: Import results
  const handleImportResults = async () => {
    if (!scraperStatus.runId) {
      toast({
        title: "Erreur",
        description: "Aucun scraper terminé. Démarrez-en un et attendez qu'il finisse.",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);
    setImportResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('import-houzz', {
        body: { action: 'import-results', runId: scraperStatus.runId },
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
          title: "Import en attente",
          description: data.error,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Error importing results:', error);
      toast({
        title: "Erreur",
        description: error.message || "Échec de l'import",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  // Full automatic import
  const handleFullImport = async () => {
    setIsFullImport(true);
    setImportResult(null);

    toast({
      title: "Import complet démarré",
      description: "Le scraper Apify va récupérer tous les projets. Cela peut prendre plusieurs minutes...",
    });

    try {
      const { data, error } = await supabase.functions.invoke('import-houzz', {
        body: { action: 'full-import' },
      });

      if (error) throw error;

      setImportResult(data);
      await fetchQueueStatus();
      
      toast({
        title: "Import complet terminé ! 🎉",
        description: data.message,
      });
    } catch (error: any) {
      console.error('Error in full import:', error);
      toast({
        title: "Erreur",
        description: error.message || "Échec de l'import complet",
        variant: "destructive",
      });
    } finally {
      setIsFullImport(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUCCEEDED': return 'text-green-500';
      case 'RUNNING': case 'READY': return 'text-blue-500';
      case 'FAILED': case 'ABORTED': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <Link to="/" className="text-accent hover:underline">← Retour au site</Link>
        </div>
        
        <h1 className="text-3xl font-display font-bold mb-2">Administration - Import Houzz</h1>
        <p className="text-muted-foreground mb-8">Utilise Apify pour scraper automatiquement tous les projets QualiRenovation</p>
        
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
              <div className="flex gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{queueStatus.projects}</div>
                  <div className="text-sm text-muted-foreground">Projets</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent">{queueStatus.images}</div>
                  <div className="text-sm text-muted-foreground">Images</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Apify Import Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              Import automatique avec Apify
            </CardTitle>
            <CardDescription>
              Scrape automatiquement tous les 115 projets Houzz avec leurs images complètes (~$0.20 par run)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Full Import Button */}
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <h4 className="font-medium mb-2">🚀 Import en 1 clic (recommandé)</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Lance le scraper, attend qu'il finisse, et importe automatiquement tous les projets.
              </p>
              <Button 
                onClick={handleFullImport} 
                disabled={isFullImport || isStarting}
                size="lg"
                className="w-full"
              >
                {isFullImport ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Import en cours... (peut prendre 2-5 min)
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Lancer l'import complet Apify
                  </>
                )}
              </Button>
            </div>

            {/* Manual Steps */}
            <div className="border-t pt-6">
              <h4 className="font-medium mb-4">Ou import manuel en 3 étapes :</h4>
              
              <div className="grid gap-4 md:grid-cols-3">
                {/* Step 1 */}
                <div className="space-y-2">
                  <div className="text-sm font-medium">1. Démarrer le scraper</div>
                  <Button 
                    onClick={handleStartScraper} 
                    disabled={isStarting || scraperStatus.isRunning}
                    variant="outline"
                    className="w-full"
                  >
                    {isStarting ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Play className="w-4 h-4 mr-2" />
                    )}
                    Démarrer
                  </Button>
                </div>

                {/* Step 2 */}
                <div className="space-y-2">
                  <div className="text-sm font-medium">2. Vérifier le statut</div>
                  <Button 
                    onClick={handleCheckStatus} 
                    disabled={isChecking || !scraperStatus.runId}
                    variant="outline"
                    className="w-full"
                  >
                    {isChecking ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4 mr-2" />
                    )}
                    Vérifier
                  </Button>
                </div>

                {/* Step 3 */}
                <div className="space-y-2">
                  <div className="text-sm font-medium">3. Importer les résultats</div>
                  <Button 
                    onClick={handleImportResults} 
                    disabled={isImporting || scraperStatus.status !== 'SUCCEEDED'}
                    variant="outline"
                    className="w-full"
                  >
                    {isImporting ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4 mr-2" />
                    )}
                    Importer
                  </Button>
                </div>
              </div>

              {/* Scraper Status */}
              {scraperStatus.runId && (
                <div className="mt-4 p-3 bg-muted/50 rounded-lg text-sm">
                  <div className="flex justify-between items-center">
                    <span>Run ID: <code className="text-xs">{scraperStatus.runId}</code></span>
                    <span className={getStatusColor(scraperStatus.status)}>
                      {scraperStatus.status}
                    </span>
                  </div>
                </div>
              )}
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
                        Total: {importResult.total} | Importés: {importResult.imported} | Erreurs: {importResult.errors}
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
            <CardTitle className="text-lg">ℹ️ À propos d'Apify</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              <strong>Apify</strong> est un service professionnel de web scraping qui peut extraire 
              automatiquement tous les projets du profil Houzz, y compris les images en haute résolution.
            </p>
            <p>
              <strong>Coût estimé :</strong> ~$0.20 par import complet (115 projets)
            </p>
            <p>
              <strong>Temps :</strong> 2-5 minutes pour scraper tous les projets
            </p>
            <p>
              <strong>Avantages :</strong> Extraction fiable de toutes les images, descriptions, catégories et métadonnées.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminImport;
