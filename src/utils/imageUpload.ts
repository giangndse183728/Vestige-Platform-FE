import { storage } from '@/libs/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'sonner';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}


export const uploadImage = async (
  file: File, 
  folder: string = 'products'
): Promise<UploadResult> => {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      return {
        success: false,
        error: 'File must be an image'
      };
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return {
        success: false,
        error: 'File size must be less than 5MB'
      };
    }

    // Create unique filename
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const storageRef = ref(storage, `${folder}/${fileName}`);

    // Upload file
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    return {
      success: true,
      url: downloadURL
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    return {
      success: false,
      error: 'Failed to upload image'
    };
  }
};


export const uploadMultipleImages = async (
  files: File[], 
  folder: string = 'products'
): Promise<UploadResult[]> => {
  const uploadPromises = files.map(file => uploadImage(file, folder));
  return Promise.all(uploadPromises);
};


export const uploadImageWithProgress = async (
  file: File,
  folder: string = 'products',
  onProgress?: (progress: number) => void
): Promise<UploadResult> => {
  try {
    // Show loading toast
    const loadingToast = toast.loading('Uploading image...');

    const result = await uploadImage(file, folder);

    // Dismiss loading toast
    toast.dismiss(loadingToast);

    if (result.success) {
      toast.success('Image uploaded successfully');
      onProgress?.(100);
    } else {
      toast.error(result.error || 'Failed to upload image');
    }

    return result;
  } catch (error) {
    console.error('Error uploading image:', error);
    toast.error('Failed to upload image');
    return {
      success: false,
      error: 'Failed to upload image'
    };
  }
}; 