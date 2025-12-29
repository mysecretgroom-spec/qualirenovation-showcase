import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Download, CheckCircle, AlertCircle, Search, Play, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

interface QueueStatus {
  pending: number;
  processing: number;
  completed: number;
  failed: number;
  total: number;
}

interface DiscoverResult {
  discovered: number;
  urls: string[];
}

const AdminImport = () => {
  const { toast } = useToast();
  
  // Discovery state
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [discoverResult, setDiscoverResult] = useState<DiscoverResult | null>(null);
  
  // Batch import state
  const [isImporting, setIsImporting] = useState(false);
  const [queueStatus, setQueueStatus] = useState<QueueStatus | null>(null);
  const [batchResult, setBatchResult] = useState<any>(null);
  
  // Legacy full import state
  const [isImportingProjects, setIsImportingProjects] = useState(false);
  const [projectsResult, setProjectsResult] = useState<any>(null);
  
  // Testimonials state
  const [isImportingTestimonials, setIsImportingTestimonials] = useState(false);
  const [testimonialsResult, setTestimonialsResult] = useState<any>(null);

  // Fetch queue status
  const fetchQueueStatus = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke('import-houzz', {
        body: { action: 'queue-status' },
      });

      if (error) throw error;
      setQueueStatus(data);
    } catch (error) {
      console.error('Error fetching queue status:', error);
    }
  }, []);

  useEffect(() => {
    fetchQueueStatus();
  }, [fetchQueueStatus]);

  // Step 1: Discover projects
  const handleDiscoverProjects = async () => {
    setIsDiscovering(true);
    setDiscoverResult(null);
    setBatchResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('import-houzz', {
        body: { action: 'discover-projects' },
      });

      if (error) throw error;

      setDiscoverResult(data);
      await fetchQueueStatus();
      
      toast({
        title: "Découverte terminée",
        description: `${data.discovered} projets trouvés`,
      });
    } catch (error: any) {
      console.error('Error discovering projects:', error);
      toast({
        title: "Erreur",
        description: error.message || "Échec de la découverte des projets",
        variant: "destructive",
      });
    } finally {
      setIsDiscovering(false);
    }
  };

  // Step 2: Import batch
  const handleImportBatch = async () => {
    setIsImporting(true);
    setBatchResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('import-houzz', {
        body: { action: 'import-batch', batchSize: 5 },
      });

      if (error) throw error;

      setBatchResult(data);
      await fetchQueueStatus();
      
      if (data.remaining > 0) {
        toast({
          title: "Lot importé",
          description: `${data.imported} projets importés, ${data.remaining} restants`,
        });
      } else {
        toast({
          title: "Import terminé",
          description: `Tous les projets ont été importés`,
        });
      }
    } catch (error: any) {
      console.error('Error importing batch:', error);
      toast({
        title: "Erreur",
        description: error.message || "Échec de l'import du lot",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  // Legacy full import
  const handleImportProjects = async () => {
    setIsImportingProjects(true);
    setProjectsResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('import-houzz', {
        body: { action: 'import-projects' },
      });

      if (error) throw error;

      setProjectsResult(data);
      toast({
        title: "Import terminé",
        description: data.message,
      });
    } catch (error: any) {
      console.error('Error importing projects:', error);
      toast({
        title: "Erreur",
        description: error.message || "Échec de l'import des projets",
        variant: "destructive",
      });
    } finally {
      setIsImportingProjects(false);
    }
  };

  const handleImportTestimonials = async () => {
    setIsImportingTestimonials(true);
    setTestimonialsResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('import-houzz', {
        body: { action: 'import-testimonials' },
      });

      if (error) throw error;

      setTestimonialsResult(data);
      toast({
        title: "Import terminé",
        description: data.message,
      });
    } catch (error: any) {
      console.error('Error importing testimonials:', error);
      toast({
        title: "Erreur",
        description: error.message || "Échec de l'import des témoignages",
        variant: "destructive",
      });
    } finally {
      setIsImportingTestimonials(false);
    }
  };

  const progressPercentage = queueStatus && queueStatus.total > 0
    ? ((queueStatus.completed + queueStatus.failed) / queueStatus.total) * 100
    : 0;

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <Link to="/" className="text-accent hover:underline">← Retour au site</Link>
        </div>
        
        <h1 className="text-3xl font-display font-bold mb-8">Administration - Import Houzz</h1>
        
        {/* Batch Import Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5" />
              Import par lots (Recommandé)
            </CardTitle>
            <CardDescription>
              Processus en 2 étapes pour éviter les timeouts : découverte puis import par lots de 5 projets
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Queue Status */}
            {queueStatus && queueStatus.total > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progression</span>
                  <span>{queueStatus.completed + queueStatus.failed} / {queueStatus.total}</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span className="text-yellow-500">⏳ En attente: {queueStatus.pending}</span>
                  <span className="text-blue-500">🔄 En cours: {queueStatus.processing}</span>
                  <span className="text-green-500">✅ Terminés: {queueStatus.completed}</span>
                  <span className="text-red-500">❌ Échecs: {queueStatus.failed}</span>
                </div>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              {/* Step 1: Discover */}
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Étape 1 : Découverte
                </h4>
                <p className="text-sm text-muted-foreground">
                  Utilise l'API Map de Firecrawl pour trouver tous les URLs de projets automatiquement.
                </p>
                <Button 
                  onClick={handleDiscoverProjects} 
                  disabled={isDiscovering || isImporting}
                  variant="outline"
                  className="w-full"
                >
                  {isDiscovering ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Découverte en cours...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Découvrir les projets
                    </>
                  )}
                </Button>
                
                {discoverResult && (
                  <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 inline mr-2" />
                    {discoverResult.discovered} projets découverts
                  </div>
                )}
              </div>

              {/* Step 2: Import Batch */}
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  Étape 2 : Import par lots
                </h4>
                <p className="text-sm text-muted-foreground">
                  Importe 5 projets à la fois avec waitFor pour le contenu dynamique.
                </p>
                <Button 
                  onClick={handleImportBatch} 
                  disabled={isImporting || isDiscovering || (queueStatus?.pending === 0)}
                  className="w-full"
                >
                  {isImporting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Import en cours...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Importer le prochain lot
                    </>
                  )}
                </Button>
                
                {batchResult && (
                  <div className={`p-3 rounded-lg text-sm ${batchResult.success ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                    {batchResult.success ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-500 inline mr-2" />
                        {batchResult.imported} importés, {batchResult.remaining} restants
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-red-500 inline mr-2" />
                        {batchResult.error}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Import Projects Card (Legacy) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Import rapide (Legacy)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-sm">
                Import direct de tous les projets en une seule requête. Peut échouer sur les gros profils.
              </p>
              
              <Button 
                onClick={handleImportProjects} 
                disabled={isImportingProjects}
                variant="secondary"
                className="w-full"
              >
                {isImportingProjects ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Import en cours...
                  </>
                ) : (
                  "Lancer l'import direct"
                )}
              </Button>

              {projectsResult && (
                <div className={`p-4 rounded-lg ${projectsResult.success ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                  {projectsResult.success ? (
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-green-700 dark:text-green-400">Import réussi</p>
                        <p className="text-sm text-muted-foreground">
                          {projectsResult.imported} projets importés sur {projectsResult.total}
                          {projectsResult.errors > 0 && ` (${projectsResult.errors} erreurs)`}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-red-700 dark:text-red-400">Erreur</p>
                        <p className="text-sm text-muted-foreground">{projectsResult.error}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Import Testimonials Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Importer les Témoignages
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-sm">
                Récupère tous les avis clients depuis votre profil Houzz avec waitFor pour le contenu dynamique.
              </p>
              
              <Button 
                onClick={handleImportTestimonials} 
                disabled={isImportingTestimonials}
                className="w-full"
              >
                {isImportingTestimonials ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Import en cours...
                  </>
                ) : (
                  "Lancer l'import des témoignages"
                )}
              </Button>

              {testimonialsResult && (
                <div className={`p-4 rounded-lg ${testimonialsResult.success ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                  {testimonialsResult.success ? (
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-green-700 dark:text-green-400">Import réussi</p>
                        <p className="text-sm text-muted-foreground">
                          {testimonialsResult.imported} témoignages importés
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-red-700 dark:text-red-400">Erreur</p>
                        <p className="text-sm text-muted-foreground">{testimonialsResult.error}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 p-4 bg-secondary/50 rounded-lg">
          <h3 className="font-semibold mb-2">🚀 Améliorations du scraper</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• <strong>waitFor: 3s</strong> - Attend le chargement du contenu JavaScript</li>
            <li>• <strong>Map API</strong> - Découvre automatiquement tous les URLs de projets</li>
            <li>• <strong>Traitement par lots</strong> - 5 projets à la fois pour éviter les timeouts</li>
            <li>• <strong>Extraction HD améliorée</strong> - Récupère les images en 1920x1440</li>
            <li>• <strong>Catégories automatiques</strong> - Détection de Salle de bain, Cuisine, etc.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminImport;
