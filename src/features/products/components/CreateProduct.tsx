'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createProduct } from '@/features/products/services';
import { createProductSchema, CreateProductRequest } from '@/features/products/schema';
import { toast } from 'sonner';
import { CategorySelect } from '@/features/category/components/CategorySelect';
import { BrandSelect } from '@/features/brand/components/BrandSelect';
import { ImageIcon } from 'lucide-react';
import * as z from 'zod';
import { ImageUpload } from '@/components/ui/image-upload';
import { useImageUpload } from '@/hooks/useImageUpload';
import { formatVNDInput, unformatVND } from '@/utils/format';
import {  ProductCondition } from '@/constants/enum';

export function CreateProduct() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { uploadMultipleImages, isUploading: isUploadingImages, uploadProgress } = useImageUpload({ folder: 'products', maxFiles: 8 });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    originalPrice: '',
    condition: ProductCondition.NEW,
    size: '',
    color: '',
    categoryId: '',
    brandId: '',
    imageFiles: [] as File[],
  });
  const [primaryImagePreview, setPrimaryImagePreview] = useState<string | null>(null);

  useEffect(() => {
    let objectUrl: string | null = null;
    const firstFile = formData.imageFiles[0];
    if (firstFile) {
      objectUrl = URL.createObjectURL(firstFile);
      setPrimaryImagePreview(objectUrl);
    } else {
      setPrimaryImagePreview(null);
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [formData.imageFiles]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: formatVNDInput(value)
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageFilesChange = (files: File[]) => {
    setFormData(prev => ({ ...prev, imageFiles: files }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});


    try {
      let uploadedImageUrls: string[] = [];
      if (formData.imageFiles.length > 0) {
        if (formData.imageFiles.length > 8) {
          toast.error('You can upload a maximum of 8 images.');
          setIsLoading(false);
          return;
        }
        const uploadResults = await uploadMultipleImages(formData.imageFiles);
        const successfulUploads = uploadResults.filter(r => r.success && r.url);

        if (successfulUploads.length < formData.imageFiles.length) {
          toast.error('Some images failed to upload. Please check the files and try again.');
          setIsLoading(false);
          return;
        }
        uploadedImageUrls = successfulUploads.map(r => r.url!);
      }

      const productData: CreateProductRequest = {
        title: formData.title,
        description: formData.description,
        price: Number(unformatVND(formData.price)),
        originalPrice: Number(unformatVND(formData.originalPrice)),
        condition: formData.condition,
        size: formData.size,
        color: formData.color,
        categoryId: parseInt(formData.categoryId),
        brandId: parseInt(formData.brandId),
        imageUrls: uploadedImageUrls,
      };

      createProductSchema.parse(productData);

      await createProduct(productData);
      toast.success('Product created successfully. Check your inventory');
      // Clear the form
      setFormData({
        title: '',
        description: '',
        price: '',
        originalPrice: '',
        condition: ProductCondition.NEW,
        size: '',
        color: '',
        categoryId: '',
        brandId: '',
        imageFiles: [],
      });
      router.push('/seller-center');
      
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
        toast.error('Failed to create product');
        console.error('Error creating product:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-4 mt-1 overflow-hidden px-6">
      
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Product Images */}
          <div className="space-y-6">
            <Card variant="stamp">
              <CardContent className="p-1">
                <div className="space-y-4">
                  <div className="relative aspect-[1/1] bg-gray-100 border-2 border-black overflow-hidden">
                    {primaryImagePreview ? (
                      <Image
                        src={primaryImagePreview}
                        alt="Product preview"
                        fill
                        className="object-cover"
                        onError={() => {
                          toast.error('Failed to load image preview');
                        }}
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                        <ImageIcon className="w-12 h-12 mb-2" />
                        <span className="text-lg font-serif">Primary Image Preview</span>
                        <span className="text-sm">Upload an image below</span>
                      </div>
                    )}
                  </div>

                  {/* Image Upload Component */}
                  <ImageUpload
                    files={formData.imageFiles}
                    onFilesChange={handleImageFilesChange}
                    maxFiles={8}
                    disabled={isLoading || isUploadingImages}
                    isUploading={isUploadingImages}
                    uploadProgress={uploadProgress}
                  />
                </div>
              </CardContent>
            </Card>

               {/* Submit Button */}
               <Card variant="decorated" className="border-2 border-black">
              <CardContent className="p-8">
                <div className="flex flex-col gap-3">
                  <Button
                    type="submit"
                    disabled={isLoading || isUploadingImages}
                    className="w-full bg-black text-white hover:bg-gray-800 border-2 border-black py-6 text-lg font-serif"
                  >
                    {isLoading || isUploadingImages ? 'PUBLISHING...' : 'PUBLISH PRODUCT'}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/seller-center')}
                    className="w-full border-2 border-black hover:bg-gray-50 py-6 text-lg font-serif"
                    disabled={isLoading || isUploadingImages}
                  >
                    CANCEL
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/*Product Information */}
          <div className="space-y-6">
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
                  />
                  <div className={`text-xs mt-1 text-right ${formData.description.length < 10 || formData.description.length > 2000 ? 'text-red-600' : 'text-gray-500'}`}>{formData.description.length} / 2000</div>
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
                <CardTitle className="font-metal  text-xl font-normal">PRODUCT DETAILS</CardTitle>
              </CardHeader>
              <CardContent className="p-10 space-y-4">
                <div>
                  <Label htmlFor="condition" className="font-serif">Condition</Label>
                  <Select
                    value={formData.condition}
                    onValueChange={(value) => handleSelectChange('condition', value)}
                  >
                    <SelectTrigger className="border-2 border-black mt-1">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ProductCondition.NEW}>New</SelectItem>
                      <SelectItem value={ProductCondition.LIKE_NEW}>Like New</SelectItem>
                      <SelectItem value={ProductCondition.USED_EXCELLENT}>Used - Excellent</SelectItem>
                      <SelectItem value={ProductCondition.USED_GOOD}>Used - Good</SelectItem>
                      <SelectItem value={ProductCondition.FAIR}>Used - Fair</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.condition && <p className="text-red-600 text-xs mt-1">{errors.condition}</p>}
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
                    />
                    {errors.color && <p className="text-red-600 text-xs mt-1">{errors.color}</p>}
                  </div>
                </div>

                <div>
                  <Label htmlFor="categoryId" className="font-serif">Category</Label>
                  <CategorySelect
                    value={formData.categoryId}
                    onValueChange={(value) => handleSelectChange('categoryId', value)}
                  />
                  {errors.categoryId && <p className="text-red-600 text-xs mt-1">{errors.categoryId}</p>}
                </div>

                <div>
                  <Label htmlFor="brandId" className="font-serif">Brand</Label>
                  <BrandSelect
                    value={formData.brandId}
                    onValueChange={(value) => handleSelectChange('brandId', value)}
                  />
                  {errors.brandId && <p className="text-red-600 text-xs mt-1">{errors.brandId}</p>}
                </div>
              </CardContent>
            </Card>

         
          </div>
        </div>
      </form>
    </div>
  );
}