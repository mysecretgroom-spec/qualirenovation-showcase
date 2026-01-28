import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Upload, File, Image, FileText, Trash2, Download, Loader2, Share2, Eye, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ClientFile {
  id: string;
  file_name: string;
  file_path: string;
  file_type: string | null;
  file_size: number | null;
  created_at: string;
}

interface ClientFilesProps {
  clientId: string;
  clientName: string;
}

const getFileIcon = (fileType: string | null) => {
  if (!fileType) return <File className="w-5 h-5" />;
  if (fileType.startsWith("image/")) return <Image className="w-5 h-5 text-blue-500" />;
  if (fileType.includes("pdf")) return <FileText className="w-5 h-5 text-red-500" />;
  return <File className="w-5 h-5 text-muted-foreground" />;
};

const formatFileSize = (bytes: number | null) => {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// Extract category from file name (e.g., "[Inspiration_projet] photo.jpg" -> "Inspiration projet")
const extractCategory = (fileName: string): string | null => {
  const match = fileName.match(/^\[([^\]]+)\]/);
  if (match) {
    return match[1].replace(/_/g, ' ');
  }
  return null;
};

// Group files by category
const groupFilesByCategory = (files: ClientFile[]): Record<string, ClientFile[]> => {
  const groups: Record<string, ClientFile[]> = {};
  
  for (const file of files) {
    const category = extractCategory(file.file_name) || 'Documents';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(file);
  }
  
  return groups;
};

const ClientFiles = ({ clientId, clientName }: ClientFilesProps) => {
  const [files, setFiles] = useState<ClientFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [previewFile, setPreviewFile] = useState<{ url: string; name: string; type: string } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchFiles();
  }, [clientId]);

  const fetchFiles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("client_files")
      .select("*")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching files:", error);
    } else {
      setFiles(data || []);
    }
    setLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    setUploading(true);

    try {
      for (const file of Array.from(selectedFiles)) {
        const filePath = `${clientId}/${Date.now()}_${file.name}`;

        // Upload to storage
        const { error: uploadError } = await supabase.storage
          .from("client-files")
          .upload(filePath, file);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          toast({
            title: "Erreur d'upload",
            description: `Impossible d'uploader ${file.name}`,
            variant: "destructive",
          });
          continue;
        }

        // Get current user
        const { data: { user } } = await supabase.auth.getUser();

        // Save file reference to database
        const { error: dbError } = await supabase.from("client_files").insert({
          client_id: clientId,
          file_name: file.name,
          file_path: filePath,
          file_type: file.type,
          file_size: file.size,
          uploaded_by: user?.id,
        });

        if (dbError) {
          console.error("DB error:", dbError);
          toast({
            title: "Erreur",
            description: `Erreur lors de l'enregistrement de ${file.name}`,
            variant: "destructive",
          });
        }
      }

      toast({
        title: "Fichiers uploadés",
        description: "Les fichiers ont été ajoutés au dossier client.",
      });

      fetchFiles();
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'upload.",
        variant: "destructive",
      });
    }

    setUploading(false);
    e.target.value = "";
  };

  const getSignedUrl = async (filePath: string, expiresIn: number = 3600): Promise<string | null> => {
    const { data, error } = await supabase.storage
      .from("client-files")
      .createSignedUrl(filePath, expiresIn);

    if (error || !data) {
      console.error("Error creating signed URL:", error);
      return null;
    }
    return data.signedUrl;
  };

  const handlePreview = async (file: ClientFile) => {
    const url = await getSignedUrl(file.file_path);
    if (url) {
      setPreviewFile({
        url,
        name: file.file_name,
        type: file.file_type || '',
      });
    } else {
      toast({
        title: "Erreur",
        description: "Impossible de prévisualiser le fichier.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async (file: ClientFile) => {
    const url = await getSignedUrl(file.file_path, 60);
    if (url) {
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = file.file_name.replace(/^\[[^\]]+\]\s*/, ''); // Remove category prefix
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le fichier.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async (file: ClientFile) => {
    const url = await getSignedUrl(file.file_path, 86400 * 7); // 7 days
    if (url) {
      if (navigator.share) {
        try {
          await navigator.share({
            title: file.file_name,
            url: url,
          });
        } catch (err) {
          // Fallback to clipboard
          await navigator.clipboard.writeText(url);
          toast({
            title: "Lien copié",
            description: "Le lien de partage a été copié (valide 7 jours).",
          });
        }
      } else {
        await navigator.clipboard.writeText(url);
        toast({
          title: "Lien copié",
          description: "Le lien de partage a été copié (valide 7 jours).",
        });
      }
    } else {
      toast({
        title: "Erreur",
        description: "Impossible de créer le lien de partage.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (file: ClientFile) => {
    if (!confirm(`Supprimer "${file.file_name.replace(/^\[[^\]]+\]\s*/, '')}" ?`)) return;

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from("client-files")
      .remove([file.file_path]);

    if (storageError) {
      console.error("Storage delete error:", storageError);
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from("client_files")
      .delete()
      .eq("id", file.id);

    if (dbError) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le fichier.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Fichier supprimé",
      description: `Le fichier a été supprimé.`,
    });

    fetchFiles();
  };

  const groupedFiles = groupFilesByCategory(files);
  const categories = Object.keys(groupedFiles).sort((a, b) => {
    // Put "Documents" last
    if (a === 'Documents') return 1;
    if (b === 'Documents') return -1;
    return a.localeCompare(b);
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Documents & Photos</h3>
        <div className="relative">
          <input
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.dwg,.dxf"
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={uploading}
          />
          <Button size="sm" variant="outline" disabled={uploading}>
            {uploading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Upload className="w-4 h-4 mr-2" />
            )}
            {uploading ? "Upload..." : "Ajouter"}
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-4 text-muted-foreground text-sm">
          Chargement...
        </div>
      ) : files.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
          <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            Aucun fichier. Cliquez sur "Ajouter" pour uploader.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {categories.map((category) => (
            <div key={category}>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                {category} ({groupedFiles[category].length})
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {groupedFiles[category].map((file) => (
                  <FileCard
                    key={file.id}
                    file={file}
                    onPreview={() => handlePreview(file)}
                    onDownload={() => handleDownload(file)}
                    onShare={() => handleShare(file)}
                    onDelete={() => handleDelete(file)}
                    getSignedUrl={getSignedUrl}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Dialog */}
      <Dialog open={!!previewFile} onOpenChange={() => setPreviewFile(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="pr-8 truncate">
              {previewFile?.name.replace(/^\[[^\]]+\]\s*/, '')}
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center bg-muted rounded-lg overflow-hidden min-h-[300px] max-h-[70vh]">
            {previewFile?.type.startsWith("image/") ? (
              <img
                src={previewFile.url}
                alt={previewFile.name}
                className="max-w-full max-h-[70vh] object-contain"
              />
            ) : previewFile?.type.includes("pdf") ? (
              <iframe
                src={previewFile.url}
                className="w-full h-[70vh]"
                title={previewFile.name}
              />
            ) : (
              <div className="flex flex-col items-center gap-4 p-8">
                <File className="w-16 h-16 text-muted-foreground" />
                <p className="text-muted-foreground">Prévisualisation non disponible</p>
                <Button onClick={() => window.open(previewFile?.url, '_blank')}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Ouvrir dans un nouvel onglet
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface FileCardProps {
  file: ClientFile;
  onPreview: () => void;
  onDownload: () => void;
  onShare: () => void;
  onDelete: () => void;
  getSignedUrl: (path: string, expires?: number) => Promise<string | null>;
}

const FileCard = ({ file, onPreview, onDownload, onShare, onDelete, getSignedUrl }: FileCardProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const displayName = file.file_name.replace(/^\[[^\]]+\]\s*/, ''); // Remove category prefix

  useEffect(() => {
    if (file.file_type?.startsWith("image/")) {
      getSignedUrl(file.file_path, 3600).then(setPreviewUrl);
    }
  }, [file]);

  return (
    <div className="group relative border border-border rounded-lg overflow-hidden bg-card hover:shadow-md transition-shadow">
      {/* Thumbnail */}
      <div 
        className="aspect-square bg-muted cursor-pointer"
        onClick={onPreview}
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt={displayName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {getFileIcon(file.file_type)}
          </div>
        )}
        
        {/* Preview overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Eye className="w-8 h-8 text-white" />
        </div>
      </div>
      
      {/* File info */}
      <div className="p-2">
        <p className="text-xs font-medium truncate" title={displayName}>
          {displayName}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatFileSize(file.file_size)}
        </p>
      </div>

      {/* Action buttons */}
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          size="icon"
          variant="secondary"
          className="h-7 w-7"
          onClick={(e) => { e.stopPropagation(); onShare(); }}
          title="Partager"
        >
          <Share2 className="w-3.5 h-3.5" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          className="h-7 w-7"
          onClick={(e) => { e.stopPropagation(); onDownload(); }}
          title="Télécharger"
        >
          <Download className="w-3.5 h-3.5" />
        </Button>
        <Button
          size="icon"
          variant="destructive"
          className="h-7 w-7"
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          title="Supprimer"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
};

export default ClientFiles;
