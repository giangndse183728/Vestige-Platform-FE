import { useState } from 'react';
import { uploadImage, uploadMultipleImages as uploadMultipleImagesUtil, UploadResult } from '@/utils/imageUpload';

interface UseImageUploadOptions {
  folder?: string;
  maxFiles?: number;
  maxFileSize?: number; // in bytes
}

interface UseImageUploadReturn {
  uploadSingleImage: (file: File) => Promise<UploadResult>;
  uploadMultipleImages: (files: File[]) => Promise<UploadResult[]>;
  isUploading: boolean;
  uploadProgress: number;
  resetProgress: () => void;
}

export const useImageUpload = (options: UseImageUploadOptions = {}): UseImageUploadReturn => {
  const {
    folder = 'products',
    maxFiles = 5,
    maxFileSize = 5 * 1024 * 1024 // 5MB default
  } = options;

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const resetProgress = () => {
    setUploadProgress(0);
  };

  const uploadSingleImage = async (file: File): Promise<UploadResult> => {
    // Validate file size
    if (file.size > maxFileSize) {
      return {
        success: false,
        error: `File size must be less than ${Math.round(maxFileSize / (1024 * 1024))}MB`
      };
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const result = await uploadImage(file, folder);
      
      if (result.success) {
        setUploadProgress(100);
      } else {
        // Don't show toast here, let the caller decide
      }
      
      return result;
    } catch (error) {
      console.error('Error in uploadSingleImage:', error);
      return {
        success: false,
        error: 'Failed to upload image'
      };
    } finally {
      setIsUploading(false);
    }
  };

  const uploadMultipleImages = async (files: File[]): Promise<UploadResult[]> => {
    if (files.length === 0) {
      return [];
    }
    // Validate number of files
    if (files.length > maxFiles) {
      const errorResult = {
        success: false,
        error: `Maximum ${maxFiles} files allowed`
      };
      return Array(files.length).fill(errorResult);
    }

    // Validate file sizes
    const areFilesValid = files.every(file => file.size <= maxFileSize);
    if (!areFilesValid) {
        return files.map(file => ({
            success: false,
            error: file.size > maxFileSize 
                ? `File size must be less than ${Math.round(maxFileSize / (1024 * 1024))}MB`
                : undefined
        }));
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const uploadPromises = files.map(file => uploadImage(file, folder));
      const results = await Promise.all(uploadPromises);
      
      // Calculate overall progress
      const successfulUploads = results.filter(r => r.success).length;
      const progress = files.length > 0 ? (successfulUploads / files.length) * 100 : 0;
      setUploadProgress(progress);
      
      return results;
    } catch (error) {
      console.error('Error in uploadMultipleImages:', error);
      return files.map(() => ({
        success: false,
        error: 'Failed to upload images'
      }));
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadSingleImage,
    uploadMultipleImages,
    isUploading,
    uploadProgress,
    resetProgress
  };
}; 