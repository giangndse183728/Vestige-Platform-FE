'use client';

import { useState, useEffect } from 'react';
import { useUpdateProduct } from '../hooks/useUpdateProduct';
import { ProductDetail, UpdateProductRequest } from '../schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CategorySelect } from '@/features/category/components/CategorySelect';
import { BrandSelect } from '@/features/brand/components/BrandSelect';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { ImageUpload } from '@/components/ui/image-upload';
import { useImageUpload } from '@/hooks/useImageUpload';
import * as z from 'zod';
import { createProductSchema } from '../schema';


interface UpdateProductModalProps {
  product: ProductDetail | null;
  isOpen: boolean;
  onClose: () => void;
}

const unformatVND = (value: string) => String(value).replace(/\D/g, '');

const formatVNDInput = (value: number | string) => {
  const numeric = String(value).replace(/\D/g, '');
  return numeric ? Number(numeric).toLocaleString('vi-VN') : '';
};

export function UpdateProductModal({ product, isOpen, onClose }: UpdateProductModalProps) {
  const updateProductMutation = useUpdateProduct();
  const { uploadMultipleImages, isUploading: isUploadingImages, uploadProgress } = useImageUpload({ folder: 'products' });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    originalPrice: '',
    condition: '',
    size: '',
    color: '',
    categoryId: '',
    brandId: '',
    imageUrls: [] as string[],
    imageFiles: [] as File[],
    status: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product && isOpen) {
      setFormData({
        title: product.title || '',
        description: product.description || '',
        price: formatVNDInput(product.price),
        originalPrice: formatVNDInput(product.originalPrice),
        condition: product.condition || '',
        size: product.size || '',
        color: product.color || '',
        categoryId: String(product.category?.categoryId || ''),
        brandId: String(product.brand?.brandId || ''),
        imageUrls: product.images.map(img => img.imageUrl) || [],
        imageFiles: [],
        status: product.status || '',
      });
      setErrors({});
    }
  }, [product, isOpen]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const formatted = formatVNDInput(value);
    setFormData(prev => ({ ...prev, [name]: formatted }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageFilesChange = (files: File[]) => {
    setFormData(prev => ({ ...prev, imageFiles: files }));
  };
  
  const handleRemoveExistingUrl = (urlToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      imageUrls: prev.imageUrls.filter(url => url !== urlToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    // Reset errors
    setErrors({});
    
    try {
      // 1. Upload new images if any
      let newImageUrls: string[] = [];
      if (formData.imageFiles.length > 0) {
        const uploadResults = await uploadMultipleImages(formData.imageFiles);
        const successfulUploads = uploadResults.filter(r => r.success && r.url);
        
        if (successfulUploads.length < formData.imageFiles.length) {
          toast.error('Some new images failed to upload. Please try again.');
          return;
        }
        newImageUrls = successfulUploads.map(r => r.url!);
      }

      // 2. Combine image URLs
      const finalImageUrls = [...formData.imageUrls, ...newImageUrls];

      const submitData: UpdateProductRequest = {
        title: formData.title,
        description: formData.description,
        price: Number(unformatVND(formData.price)),
        originalPrice: Number(unformatVND(formData.originalPrice)),
        condition: formData.condition,
        size: formData.size,
        color: formData.color,
        categoryId: parseInt(formData.categoryId),
        brandId: parseInt(formData.brandId),
        imageUrls: finalImageUrls,
        status: formData.status,
      };

      createProductSchema.parse({ ...submitData, status: undefined });

      await updateProductMutation.mutateAsync({
        id: product.productId,
        data: submitData,
      });

      toast.success('Product updated successfully!');
      handleClose();

    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const field = err.path.join('.');
          fieldErrors[field] = err.message;
        });
        setErrors(fieldErrors);
        toast.error('Please fix the form errors');
      } else {
        console.error('Error updating product:', error);
        toast.error('Failed to update product. Please try again.');
      }
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setFormData({
      title: '', description: '', price: '', originalPrice: '',
      condition: '', size: '', color: '', categoryId: '', brandId: '',
      imageUrls: [], imageFiles: [], status: '',
    });
    setErrors({});
    onClose();
  };

  const isLoading = updateProductMutation.isPending || isUploadingImages;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()} >
      <DialogContent 
        className="sm:max-w-3xl max-h-[90vh] overflow-y-auto"
        onPointerDownOutside={(e) => {
          if (isLoading) e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-metal font-bold">UPDATE PRODUCT</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card variant="double" className="border-2 border-black">
            <CardHeader className="border-b-2 border-black bg-red-900 text-black">
              <CardTitle className="font-metal text-xl text-white font-normal">BASIC INFORMATION</CardTitle>
            </CardHeader>
            <CardContent className="p-10 space-y-4">
              <div>
                <Label htmlFor="title" className="font-serif text-lg">Product Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="border-2 border-black mt-1"
                  placeholder="Enter product title..."
                  disabled={isLoading}
                />
                {errors.title && <p className="text-red-600 text-xs mt-1">{errors.title}</p>}
              </div>

              <div>
                <Label htmlFor="description" className="font-serif text-lg">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="border-2 border-black mt-1 min-h-[120px]"
                  placeholder="Describe your product in detail..."
                  disabled={isLoading}
                />
                {errors.description && <p className="text-red-600 text-xs mt-1">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price" className="font-serif text-lg">Selling Price</Label>
                  <div className="relative">
                    <Input
                      id="price"
                      name="price"
                      type="text"
                      value={formData.price}
                      onChange={handlePriceChange}
                      className="border-2 border-black pr-14 mt-1"
                      placeholder="1.000.000"
                      autoComplete="off"
                      disabled={isLoading}
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 select-none">VND</span>
                  </div>
                  {errors.price && <p className="text-red-600 text-xs mt-1">{errors.price}</p>}
                </div>

                <div>
                  <Label htmlFor="originalPrice" className="font-serif text-lg">Original Price</Label>
                  <div className="relative">
                    <Input
                      id="originalPrice"
                      name="originalPrice"
                      type="text"
                      value={formData.originalPrice}
                      onChange={handlePriceChange}
                      className="border-2 border-black pr-14 mt-1"
                      placeholder="1.000.000"
                      autoComplete="off"
                      disabled={isLoading}
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 select-none">VND</span>
                  </div>
                  {errors.originalPrice && <p className="text-red-600 text-xs mt-1">{errors.originalPrice}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Details */}
          <Card variant="double" className="border-2 border-black">
            <CardHeader className="border-b-2 border-black bg-black text-white">
              <CardTitle className="font-metal text-xl font-normal">PRODUCT DETAILS</CardTitle>
            </CardHeader>
            <CardContent className="p-10 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="condition" className="font-serif">Condition</Label>
                  <Select
                    value={formData.condition}
                    onValueChange={(value) => handleSelectChange('condition', value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="border-2 border-black mt-1">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NEW">New</SelectItem>
                      <SelectItem value="LIKE_NEW">Like New</SelectItem>
                      <SelectItem value="USED_EXCELLENT">Used - Excellent</SelectItem>
                      <SelectItem value="USED_GOOD">Used - Good</SelectItem>
                      <SelectItem value="USED_FAIR">Used - Fair</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.condition && <p className="text-red-600 text-xs mt-1">{errors.condition}</p>}
                </div>

                <div>
                  <Label htmlFor="status" className="font-serif">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleSelectChange('status', value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="border-2 border-black mt-1">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="size" className="font-serif">Size</Label>
                  <Input
                    id="size"
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    className="border-2 border-black mt-1"
                    placeholder="e.g., M, L, XL, 42, etc."
                    disabled={isLoading}
                  />
                  {errors.size && <p className="text-red-600 text-xs mt-1">{errors.size}</p>}
                </div>

                <div>
                  <Label htmlFor="color" className="font-serif">Color</Label>
                  <Input
                    id="color"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    className="border-2 border-black mt-1"
                    placeholder="e.g., Black, Red, Blue, etc."
                    disabled={isLoading}
                  />
                  {errors.color && <p className="text-red-600 text-xs mt-1">{errors.color}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="categoryId" className="font-serif">Category</Label>
                <CategorySelect
                  value={formData.categoryId}
                  onValueChange={(value) => handleSelectChange('categoryId', value)}
                  required
                />
                {errors.categoryId && <p className="text-red-600 text-xs mt-1">{errors.categoryId}</p>}
              </div>

              <div>
                <Label htmlFor="brandId" className="font-serif">Brand</Label>
                <BrandSelect
                  value={formData.brandId}
                  onValueChange={(value) => handleSelectChange('brandId', value)}
                  required
                  disabled={isLoading}
                />
                {errors.brandId && <p className="text-red-600 text-xs mt-1">{errors.brandId}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card variant="double" className="border-2 border-black">
            <CardHeader className="border-b-2 border-black bg-black text-white">
              <CardTitle className="font-metal text-xl font-normal">PRODUCT IMAGES</CardTitle>
            </CardHeader>
            <CardContent className="p-10">
              <ImageUpload
                existingImageUrls={formData.imageUrls}
                onRemoveExistingUrl={handleRemoveExistingUrl}
                files={formData.imageFiles}
                onFilesChange={handleImageFilesChange}
                maxFiles={8}
                isUploading={isUploadingImages}
                uploadProgress={uploadProgress}
                disabled={isLoading}
              />
              {errors.imageUrls && <p className="text-red-600 text-xs mt-2">{errors.imageUrls}</p>}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-black text-white hover:bg-gray-800 border-2 border-black py-6 text-lg font-serif"
            >
              {isLoading ? 'UPDATING...' : 'UPDATE PRODUCT'}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 border-2 border-black hover:bg-gray-50 py-6 text-lg font-serif"
              disabled={isLoading}
            >
              CANCEL
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}