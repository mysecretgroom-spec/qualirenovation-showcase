import { supabase } from '@/integrations/supabase/client';
import { InspirationImage } from '@/components/renovation/types';

interface SaveFilesParams {
  clientId: string;
  inspirationImages?: InspirationImage[];
  uploadedPlan?: File | null;
  uploadedDPE?: File | null;
  roomInspirationImages?: { roomId: string; roomName: string; images: InspirationImage[] }[];
}

interface SavedFile {
  fileName: string;
  filePath: string;
  fileType: string;
  fileSize: number;
}

/**
 * Transfers inspiration images from 'assets' bucket to 'client-files' bucket
 * and registers them in client_files table
 */
export const transferInspirationImage = async (
  clientId: string,
  image: InspirationImage,
  category: string
): Promise<SavedFile | null> => {
  try {
    // Extract path from public URL
    const urlParts = image.url.split('/assets/');
    if (urlParts.length < 2) {
      console.error('Could not parse image URL:', image.url);
      return null;
    }
    
    const sourcePath = urlParts[1];
    
    // Download from assets bucket
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('assets')
      .download(sourcePath);
    
    if (downloadError || !fileData) {
      console.error('Error downloading from assets:', downloadError);
      return null;
    }
    
    // Create destination path in client-files
    const timestamp = Date.now();
    const extension = image.fileName.split('.').pop() || 'jpg';
    const sanitizedCategory = category.replace(/[^a-zA-Z0-9-]/g, '_');
    const destPath = `${clientId}/${sanitizedCategory}/${timestamp}_${image.fileName}`;
    
    // Upload to client-files bucket
    const { error: uploadError } = await supabase.storage
      .from('client-files')
      .upload(destPath, fileData, {
        contentType: fileData.type || 'image/jpeg',
        upsert: false,
      });
    
    if (uploadError) {
      console.error('Error uploading to client-files:', uploadError);
      return null;
    }
    
    return {
      fileName: `[${category}] ${image.fileName}`,
      filePath: destPath,
      fileType: fileData.type || 'image/jpeg',
      fileSize: fileData.size,
    };
  } catch (error) {
    console.error('Error transferring inspiration image:', error);
    return null;
  }
};

/**
 * Uploads a File object to client-files bucket
 */
export const uploadFileToClientFiles = async (
  clientId: string,
  file: File,
  category: string
): Promise<SavedFile | null> => {
  try {
    const timestamp = Date.now();
    const sanitizedCategory = category.replace(/[^a-zA-Z0-9-]/g, '_');
    const destPath = `${clientId}/${sanitizedCategory}/${timestamp}_${file.name}`;
    
    const { error: uploadError } = await supabase.storage
      .from('client-files')
      .upload(destPath, file, {
        contentType: file.type,
        upsert: false,
      });
    
    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      return null;
    }
    
    return {
      fileName: `[${category}] ${file.name}`,
      filePath: destPath,
      fileType: file.type,
      fileSize: file.size,
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    return null;
  }
};

/**
 * Saves all simulation files to client_files table
 */
export const saveSimulationFilesToClient = async ({
  clientId,
  inspirationImages = [],
  uploadedPlan,
  uploadedDPE,
  roomInspirationImages = [],
}: SaveFilesParams): Promise<{ success: boolean; savedCount: number }> => {
  const savedFiles: SavedFile[] = [];
  
  try {
    // 1. Transfer global inspiration images
    for (const image of inspirationImages) {
      const saved = await transferInspirationImage(clientId, image, 'Inspiration_projet');
      if (saved) savedFiles.push(saved);
    }
    
    // 2. Transfer room-specific inspiration images
    for (const room of roomInspirationImages) {
      for (const image of room.images) {
        const saved = await transferInspirationImage(clientId, image, `Inspiration_${room.roomName}`);
        if (saved) savedFiles.push(saved);
      }
    }
    
    // 3. Upload plan if present
    if (uploadedPlan) {
      const saved = await uploadFileToClientFiles(clientId, uploadedPlan, 'Plan');
      if (saved) savedFiles.push(saved);
    }
    
    // 4. Upload DPE if present
    if (uploadedDPE) {
      const saved = await uploadFileToClientFiles(clientId, uploadedDPE, 'DPE');
      if (saved) savedFiles.push(saved);
    }
    
    // 5. Insert all saved files into database
    if (savedFiles.length > 0) {
      const { data: { user } } = await supabase.auth.getUser();
      
      const fileRecords = savedFiles.map(file => ({
        client_id: clientId,
        file_name: file.fileName,
        file_path: file.filePath,
        file_type: file.fileType,
        file_size: file.fileSize,
        uploaded_by: user?.id || null,
      }));
      
      const { error: insertError } = await supabase
        .from('client_files')
        .insert(fileRecords);
      
      if (insertError) {
        console.error('Error inserting file records:', insertError);
        return { success: false, savedCount: 0 };
      }
    }
    
    return { success: true, savedCount: savedFiles.length };
  } catch (error) {
    console.error('Error saving simulation files:', error);
    return { success: false, savedCount: 0 };
  }
};

/**
 * Extracts inspiration images from room modules
 */
export const extractRoomInspirationImages = (
  selectedRooms: { id: string; type: string; instanceNumber: number; data: any }[]
): { roomId: string; roomName: string; images: InspirationImage[] }[] => {
  const result: { roomId: string; roomName: string; images: InspirationImage[] }[] = [];
  
  const roomLabels: Record<string, string> = {
    'cuisine': 'Cuisine',
    'salle-de-bain': 'Salle_de_bain',
    'wc': 'WC',
  };
  
  for (const room of selectedRooms) {
    const data = room.data;
    const roomName = roomLabels[room.type] || room.type;
    const displayName = `${roomName}${room.instanceNumber > 1 ? `_${room.instanceNumber}` : ''}`;
    
    // Check for inspiration images in various module data
    const sources = [
      data.bathroomData?.inspirationImages,
      data.kitchenData?.inspirationImages,
      data.wcData?.inspirationImages,
    ].filter(Boolean);
    
    for (const images of sources) {
      if (images && images.length > 0) {
        result.push({
          roomId: room.id,
          roomName: displayName,
          images: images as InspirationImage[],
        });
      }
    }
  }
  
  return result;
};
