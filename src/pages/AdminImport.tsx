import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Download, CheckCircle, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

const AdminImport = () => {
  const { toast } = useToast();
  const [isImportingProjects, setIsImportingProjects] = useState(false);
  const [isImportingTestimonials, setIsImportingTestimonials] = useState(false);
  const [projectsResult, setProjectsResult] = useState<any>(null);
  const [testimonialsResult, setTestimonialsResult] = useState<any>(null);

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

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <Link to="/" className="text-accent hover:underline">← Retour au site</Link>
        </div>
        
        <h1 className="text-3xl font-display font-bold mb-8">Administration - Import Houzz</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Import Projects Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Importer les Projets
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-sm">
                Récupère tous les projets depuis votre profil Houzz avec leurs photos et descriptions.
              </p>
              
              <Button 
                onClick={handleImportProjects} 
                disabled={isImportingProjects}
                className="w-full"
              >
                {isImportingProjects ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Import en cours...
                  </>
                ) : (
                  "Lancer l'import des projets"
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
                Récupère tous les avis clients depuis votre profil Houzz.
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
          <h3 className="font-semibold mb-2">⚠️ Important</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• L'import des projets peut prendre plusieurs minutes (1 requête par projet)</li>
            <li>• Les projets existants seront mis à jour</li>
            <li>• Assurez-vous que le connecteur Firecrawl est bien configuré</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminImport;
