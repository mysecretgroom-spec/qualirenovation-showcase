import React, { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Upload, X, Image, Loader2, Camera, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface InspirationImage {
  id: string;
  url: string;
  fileName: string;
  uploadedAt: string;
}

interface InspirationUploadProps {
  images: InspirationImage[];
  onImagesChange: (images: InspirationImage[]) => void;
  maxImages?: number;
  context?: string; // e.g., room name for better organization
}

export const InspirationUpload: React.FC<InspirationUploadProps> = ({
  images,
  onImagesChange,
  maxImages = 10,
  context = 'general',
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const uploadFile = async (file: File): Promise<InspirationImage | null> => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Seules les images sont acceptées');
      return null;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('L\'image ne doit pas dépasser 5 Mo');
      return null;
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 8);
    const extension = file.name.split('.').pop() || 'jpg';
    const sanitizedContext = context.replace(/[^a-zA-Z0-9-]/g, '_');
    const fileName = `inspiration/${sanitizedContext}/${timestamp}-${randomId}.${extension}`;

    try {
      const { data, error } = await supabase.storage
        .from('assets')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.error('Upload error:', error);
        toast.error('Erreur lors de l\'upload');
        return null;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('assets')
        .getPublicUrl(data.path);

      return {
        id: randomId,
        url: urlData.publicUrl,
        fileName: file.name,
        uploadedAt: new Date().toISOString(),
      };
    } catch (err) {
      console.error('Upload exception:', err);
      toast.error('Erreur lors de l\'upload');
      return null;
    }
  };

  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const remainingSlots = maxImages - images.length;
    
    if (fileArray.length > remainingSlots) {
      toast.error(`Vous pouvez ajouter ${remainingSlots} image(s) supplémentaire(s)`);
      return;
    }

    setIsUploading(true);

    const uploadPromises = fileArray.slice(0, remainingSlots).map(uploadFile);
    const results = await Promise.all(uploadPromises);
    const successfulUploads = results.filter((r): r is InspirationImage => r !== null);

    if (successfulUploads.length > 0) {
      onImagesChange([...images, ...successfulUploads]);
      toast.success(`${successfulUploads.length} photo(s) ajoutée(s)`);
    }

    setIsUploading(false);
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [images, maxImages]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const removeImage = async (imageToRemove: InspirationImage) => {
    // Extract path from URL for deletion
    try {
      const urlParts = imageToRemove.url.split('/assets/');
      if (urlParts.length > 1) {
        const filePath = urlParts[1];
        await supabase.storage.from('assets').remove([filePath]);
      }
    } catch (err) {
      console.error('Error removing file:', err);
    }

    onImagesChange(images.filter(img => img.id !== imageToRemove.id));
    toast.success('Photo supprimée');
  };

  const canAddMore = images.length < maxImages;

  return (
    <div className="space-y-4">
      {/* Upload zone */}
      {canAddMore && (
        <div
          className={cn(
            'relative border-2 border-dashed rounded-lg p-6 transition-all duration-200',
            'hover:border-primary/50 hover:bg-primary/5',
            dragActive ? 'border-primary bg-primary/10' : 'border-border',
            isUploading && 'opacity-50 pointer-events-none'
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="inspiration-upload"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            disabled={isUploading}
          />
          
          <div className="flex flex-col items-center justify-center text-center">
            {isUploading ? (
              <>
                <Loader2 className="w-10 h-10 text-primary animate-spin mb-3" />
                <p className="text-sm text-muted-foreground">Upload en cours...</p>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-3">
                  <Camera className="w-8 h-8 text-muted-foreground" />
                  <Upload className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground mb-1">
                  Glissez vos photos d'inspiration ici
                </p>
                <p className="text-xs text-muted-foreground">
                  ou cliquez pour sélectionner (max {maxImages - images.length} photos, 5 Mo chacune)
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Uploaded images grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((image) => (
            <div
              key={image.id}
              className="relative group aspect-square rounded-lg overflow-hidden border border-border bg-muted"
            >
              <img
                src={image.url}
                alt={image.fileName}
                className="w-full h-full object-cover"
              />
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeImage(image)}
                  className="flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  Supprimer
                </Button>
              </div>
              
              {/* File name tooltip */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-xs text-white truncate">{image.fileName}</p>
              </div>
            </div>
          ))}

          {/* Add more button */}
          {canAddMore && (
            <label
              htmlFor="inspiration-upload-more"
              className={cn(
                'aspect-square rounded-lg border-2 border-dashed border-border',
                'flex flex-col items-center justify-center gap-2 cursor-pointer',
                'hover:border-primary/50 hover:bg-primary/5 transition-all',
                isUploading && 'opacity-50 pointer-events-none'
              )}
            >
              <input
                type="file"
                id="inspiration-upload-more"
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                disabled={isUploading}
              />
              <Plus className="w-6 h-6 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Ajouter</span>
            </label>
          )}
        </div>
      )}

      {/* Empty state */}
      {images.length === 0 && !canAddMore && (
        <div className="flex items-center justify-center p-8 text-center text-muted-foreground">
          <Image className="w-8 h-8 mr-3" />
          <span>Aucune photo d'inspiration ajoutée</span>
        </div>
      )}
    </div>
  );
};
