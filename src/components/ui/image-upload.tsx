'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Upload } from 'lucide-react';
import Image from 'next/image';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface ImageUploadProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  existingImageUrls?: string[];
  onRemoveExistingUrl?: (url: string) => void;
  maxFiles?: number;
  folder?: string;
  maxFileSize?: number;
  disabled?: boolean;
  className?: string;
  isUploading?: boolean;
  uploadProgress?: number;
}

export function ImageUpload({
  files = [],
  onFilesChange,
  existingImageUrls = [],
  onRemoveExistingUrl,
  maxFiles = 8,
  folder = 'products',
  maxFileSize = 5 * 1024 * 1024, // 5MB
  disabled = false,
  className = '',
  isUploading = false,
  uploadProgress = 0,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newFilePreviewUrls, setNewFilePreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    const newUrls = files.map(file => URL.createObjectURL(file));
    setNewFilePreviewUrls(newUrls);

    // Cleanup object URLs on unmount
    return () => {
      newUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [files]);
  
  const totalImageCount = existingImageUrls.length + files.length;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    const availableSlots = maxFiles - totalImageCount;
    if (selectedFiles.length > availableSlots) {
        toast.error(`You can only upload ${availableSlots} more image(s).`);
    }

    const filesToProcess = selectedFiles.slice(0, availableSlots);
    
    const validFiles = filesToProcess.filter(file => {
      if (file.size > maxFileSize) {
        toast.error(`File "${file.name}" is too large and will not be added.`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      onFilesChange([...files, ...validFiles]);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeNewFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
  };

  const removeExistingUrl = (urlToRemove: string) => {
    onRemoveExistingUrl?.(urlToRemove);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled || isUploading) return;

    const availableSlots = maxFiles - totalImageCount;
    if (availableSlots <= 0) {
      toast.error(`Maximum ${maxFiles} images allowed.`);
      return;
    }

    const droppedFiles = Array.from(e.dataTransfer.files);
    const imageFiles = droppedFiles.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) return;

    if (imageFiles.length > availableSlots) {
        toast.warning(`You can only add ${availableSlots} more images.`);
    }

    const filesToAdd = imageFiles.slice(0, availableSlots);

    const validFiles = filesToAdd.filter(file => {
        if (file.size > maxFileSize) {
            toast.error(`File "${file.name}" is too large and was not added.`);
            return false;
        }
        return true;
    });

    if (validFiles.length > 0) {
        onFilesChange([...files, ...validFiles]);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex justify-between items-center">
        <Label className="font-metal text-lg">Product Images</Label>
        <span className="text-sm text-gray-500 font-mono">
          {totalImageCount}/{maxFiles} images
        </span>
      </div>
      
      {/* Upload Area */}
      <div
        className={`
          border-2 border-dashed border-gray-300 rounded-lg p-6 text-center
          hover:border-gray-400 transition-colors cursor-pointer
          ${disabled || isUploading ? 'opacity-50 cursor-not-allowed' : ''}
          ${totalImageCount >= maxFiles ? 'border-gray-200 bg-gray-50 cursor-not-allowed' : ''}
        `}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => !disabled && !isUploading && totalImageCount < maxFiles && fileInputRef.current?.click()}
      >
        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-600">
          {isUploading ? 'Uploading...' : totalImageCount >= maxFiles ? 'Maximum images reached' : 'Click to upload or drag and drop'}
        </p>
        <p className="text-xs text-gray-500 mt-1">
        The first uploaded image will be used as the primary image
        </p>
      </div>

      {/* Progress Bar */}
      {isUploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Uploading images...</span>
            <span>{Math.round(uploadProgress)}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}

      {/* Hidden file input */}
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading || totalImageCount >= maxFiles}
        multiple
      />

      {/* Image Preview Grid */}
      {totalImageCount > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 border-2 border-black  overflow-hidden">
          {existingImageUrls.map((url, index) => (
            <div key={`existing-${index}`} className={`relative group border-r border-black-300 last:border-r-0`}>
              <div className="aspect-square bg-gray-100 overflow-hidden">
                <Image
                  src={url}
                  alt={`Existing Image ${index + 1}`}
                  fill
                  className="object-cover"
                  onError={() => console.error('Failed to load existing image:', url)}
                />
              </div>
              
              {/* Primary Image Badge */}
              {index === 0 && (
                <div className="absolute top-0 left-0 bg-red-900 text-white text-xs px-2 py-1  font-gothic">
                  Primary
                </div>
              )}

              {/* Badge for existing images */}
              <div className="absolute bottom-0 left-0 bg-gray-700 text-white text-xs px-2 py-1 font-mono">
                Current
              </div>
              
              {/* Remove button */}
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="absolute top-2 right-2 w-6 h-6 bg-white/80 hover:bg-white border border-gray-300"
                onClick={() => removeExistingUrl(url)}
                disabled={disabled || isUploading}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ))}

          {newFilePreviewUrls.map((url, index) => (
            <div key={`new-${index}`} className={`relative group border-r border-black-300 last:border-r-0`}>
              <div className="aspect-square bg-gray-100 overflow-hidden">
                <Image
                  src={url}
                  alt={`New Image ${index + 1}`}
                  fill
                  className="object-cover"
                  onError={() => console.error('Failed to load new image preview:', url)}
                />
              </div>

               {/* Badge for new images */}
              <div className="absolute bottom-0 left-0 bg-blue-600 text-white text-xs px-2 py-1 font-mono">
                New
              </div>
              
              {/* Remove button */}
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="absolute top-2 right-2 w-6 h-6 bg-white/80 hover:bg-white border border-gray-300"
                onClick={() => removeNewFile(index)}
                disabled={disabled || isUploading}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}