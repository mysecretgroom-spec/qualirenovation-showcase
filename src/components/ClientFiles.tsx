import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Upload, File, Image, FileText, Trash2, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

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

const ClientFiles = ({ clientId, clientName }: ClientFilesProps) => {
  const [files, setFiles] = useState<ClientFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
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
        // Create a safe folder path using client name
        const safeName = clientName.replace(/[^a-zA-Z0-9-_]/g, "_");
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

  const handleDownload = async (file: ClientFile) => {
    const { data, error } = await supabase.storage
      .from("client-files")
      .createSignedUrl(file.file_path, 60);

    if (error || !data) {
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le fichier.",
        variant: "destructive",
      });
      return;
    }

    window.open(data.signedUrl, "_blank");
  };

  const handleDelete = async (file: ClientFile) => {
    if (!confirm(`Supprimer "${file.file_name}" ?`)) return;

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
      description: `"${file.file_name}" a été supprimé.`,
    });

    fetchFiles();
  };

  const getPreviewUrl = async (file: ClientFile): Promise<string | null> => {
    if (!file.file_type?.startsWith("image/")) return null;
    
    const { data } = await supabase.storage
      .from("client-files")
      .createSignedUrl(file.file_path, 3600);
    
    return data?.signedUrl || null;
  };

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
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {files.map((file) => (
            <FileCard
              key={file.id}
              file={file}
              onDownload={() => handleDownload(file)}
              onDelete={() => handleDelete(file)}
              getPreviewUrl={getPreviewUrl}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface FileCardProps {
  file: ClientFile;
  onDownload: () => void;
  onDelete: () => void;
  getPreviewUrl: (file: ClientFile) => Promise<string | null>;
}

const FileCard = ({ file, onDownload, onDelete, getPreviewUrl }: FileCardProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (file.file_type?.startsWith("image/")) {
      getPreviewUrl(file).then(setPreviewUrl);
    }
  }, [file]);

  return (
    <div className="group relative border border-border rounded-lg overflow-hidden bg-card hover:shadow-md transition-shadow">
      {previewUrl ? (
        <div className="aspect-square bg-muted">
          <img
            src={previewUrl}
            alt={file.file_name}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="aspect-square bg-muted flex items-center justify-center">
          {getFileIcon(file.file_type)}
        </div>
      )}
      
      <div className="p-2">
        <p className="text-xs font-medium truncate" title={file.file_name}>
          {file.file_name}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatFileSize(file.file_size)}
        </p>
      </div>

      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          size="icon"
          variant="secondary"
          className="h-7 w-7"
          onClick={onDownload}
        >
          <Download className="w-3.5 h-3.5" />
        </Button>
        <Button
          size="icon"
          variant="destructive"
          className="h-7 w-7"
          onClick={onDelete}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
};

export default ClientFiles;
