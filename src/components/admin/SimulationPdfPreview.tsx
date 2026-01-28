import { useState, useEffect } from "react";
import { generateSimulationPDF } from "@/utils/generateSimulationPDF";
import { Loader2, FileText, Maximize2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SimulationPdfPreviewProps {
  pdfData: {
    leadData: any;
    formData: any;
  };
  simulationId: string;
}

const SimulationPdfPreview = ({ pdfData, simulationId }: SimulationPdfPreviewProps) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let currentUrl: string | null = null;

    const generatePreview = async () => {
      setLoading(true);
      setError(false);
      
      try {
        // Ensure we have valid data with defaults
        const safeLeadData = {
          name: pdfData.leadData?.name || 'Client',
          email: pdfData.leadData?.email || '',
          phone: pdfData.leadData?.phone || '',
          address: pdfData.leadData?.address || '',
          postalCode: pdfData.leadData?.postalCode || '',
          city: pdfData.leadData?.city || '',
          surface: pdfData.leadData?.surface || '',
          budget: pdfData.leadData?.budget || '',
          timeline: pdfData.leadData?.timeline || '',
          message: pdfData.leadData?.message || '',
        };
        
        const safeFormData = {
          ...pdfData.formData,
          propertyType: pdfData.formData?.propertyType || '',
          surface: pdfData.formData?.surface || '',
          constructionPeriod: pdfData.formData?.constructionPeriod || '',
          city: pdfData.formData?.city || '',
          selectedRooms: pdfData.formData?.selectedRooms || [],
          inspirationImages: [],
        };

        const blob = await generateSimulationPDF({
          leadData: safeLeadData,
          formData: safeFormData as any,
          includeImages: false, // Faster preview without images
        });
        
        if (!cancelled && blob) {
          currentUrl = URL.createObjectURL(blob);
          setPdfUrl(currentUrl);
        }
      } catch (err) {
        console.error("Error generating PDF preview:", err);
        if (!cancelled) {
          setError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    generatePreview();

    return () => {
      cancelled = true;
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }
    };
  }, [simulationId, pdfData]);

  if (loading) {
    return (
      <div className="w-full h-48 bg-muted rounded-lg flex flex-col items-center justify-center gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        <span className="text-xs text-muted-foreground">Génération aperçu...</span>
      </div>
    );
  }

  if (error || !pdfUrl) {
    return (
      <div className="w-full h-48 bg-muted rounded-lg flex flex-col items-center justify-center gap-2">
        <FileText className="w-8 h-8 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">Aperçu non disponible</span>
      </div>
    );
  }

  return (
    <>
      <div className="relative group">
        {/* PDF Thumbnail Preview */}
        <div 
          className="w-full h-48 bg-white rounded-lg border border-border overflow-hidden cursor-pointer hover:border-primary transition-colors"
          onClick={() => setFullscreenOpen(true)}
        >
          <iframe
            src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
            className="w-full h-full pointer-events-none"
            title="Aperçu PDF"
          />
        </div>
        
        {/* Hover overlay */}
        <div 
          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center cursor-pointer"
          onClick={() => setFullscreenOpen(true)}
        >
          <div className="flex items-center gap-2 text-white">
            <Maximize2 className="w-5 h-5" />
            <span className="text-sm font-medium">Agrandir</span>
          </div>
        </div>
      </div>

      {/* Fullscreen Dialog */}
      <Dialog open={fullscreenOpen} onOpenChange={setFullscreenOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] p-0">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Aperçu du PDF de Simulation
            </DialogTitle>
          </DialogHeader>
          <div className="p-4 pt-2">
            <div className="bg-muted rounded-lg overflow-hidden" style={{ height: "75vh" }}>
              <iframe
                src={`${pdfUrl}#toolbar=1&navpanes=0`}
                className="w-full h-full"
                title="Aperçu PDF complet"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SimulationPdfPreview;
