'use client';

import { useState } from 'react';
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
import { X, Plus, ImageIcon, Upload } from 'lucide-react';
import * as z from 'zod';

export function CreateProduct() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    originalPrice: '',
    condition: 'NEW',
    size: '',
    color: '',
    categoryId: '',
    brandId: '',
    status: 'ACTIVE',
    imageUrls: [''] // Start with one empty image URL
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user selects
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUrlChange = (index: number, value: string) => {
    const newImageUrls = [...formData.imageUrls];
    newImageUrls[index] = value;
    setFormData(prev => ({
      ...prev,
      imageUrls: newImageUrls
    }));
    
    // Clear image errors
    if (errors.imageUrls) {
      setErrors(prev => ({ ...prev, imageUrls: '' }));
    }
  };

  const addImageUrl = () => {
    setFormData(prev => ({
      ...prev,
      imageUrls: [...prev.imageUrls, '']
    }));
  };

  const removeImageUrl = (index: number) => {
    setFormData(prev => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index)
    }));
  };

  const isValidImageUrl = (url: string) => {
    if (!url) return false;
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const productData: CreateProductRequest = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        originalPrice: parseFloat(formData.originalPrice),
        condition: formData.condition,
        size: formData.size,
        color: formData.color,
        categoryId: parseInt(formData.categoryId),
        brandId: parseInt(formData.brandId),
        imageUrls: formData.imageUrls.filter(url => url.trim() !== '')
      };

      // Validate with Zod schema
      createProductSchema.parse(productData);

      await createProduct(productData);
      toast.success('Product created successfully');
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
      {/* Newspaper Header */}
      <div className="mb-8 text-center border-b-4 border-black pb-6">
        <h1 className="font-serif text-5xl font-bold text-black mb-2 tracking-wide">
          THE MARKETPLACE HERALD
        </h1>
        <div className="flex items-center justify-center gap-4 text-sm">
          <span className="border-l-2 border-r-2 border-black px-4 font-mono">
            CREATE NEW LISTING
          </span>
          <span className="font-mono">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Product Images */}
          <div className="space-y-6">
            <Card variant="decorated" >
             
              
          
              <CardContent className="p-10">
                <div className="space-y-4">
                  {/* Main Image Preview */}
                  <div className="relative aspect-[4/3] bg-gray-100 border-2 border-black overflow-hidden">
                    {formData.imageUrls[0] && isValidImageUrl(formData.imageUrls[0]) ? (
                      <Image
                        src={formData.imageUrls[0]}
                        alt="Product preview"
                        fill
                        className="object-cover"
                        onError={() => {
                          // Handle image load error
                        }}
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                        <Upload className="w-12 h-12 mb-2" />
                        <span className="text-lg font-serif">Primary Image Preview</span>
                        <span className="text-sm">Add image URL below</span>
                      </div>
                    )}
                  </div>

                  {/* Thumbnail Previews */}
                  <div className="grid grid-cols-4 gap-2">
                    {formData.imageUrls.slice(1, 5).map((url, index) => (
                      <div key={index + 1} className="relative aspect-[4/3] bg-gray-100 border-2 border-black overflow-hidden">
                        {url && isValidImageUrl(url) ? (
                          <Image
                            src={url}
                            alt={`Preview ${index + 2}`}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                            <ImageIcon className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {/* Fill remaining slots */}
                    {Array.from({ length: Math.max(0, 4 - (formData.imageUrls.length - 1)) }).map((_, index) => (
                      <div key={`empty-${index}`} className="aspect-[4/3] bg-gray-50 border-2 border-dashed border-gray-300 flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-gray-300" />
                      </div>
                    ))}
                  </div>

                  {/* Image URL Inputs */}
                  <div className="space-y-3">
                    <Label className="font-serif text-lg">Image URLs</Label>
                    {formData.imageUrls.map((url, index) => (
                      <div key={index} className="flex gap-2">
                        <div className="flex-1">
                          <Input
                            type="url"
                            value={url}
                            onChange={(e) => handleImageUrlChange(index, e.target.value)}
                            placeholder={index === 0 ? "Primary image URL" : `Image ${index + 1} URL`}
                            className="border-2 border-black font-mono text-sm"
                          />
                          {index === 0 && errors.imageUrls && (
                            <p className="text-red-600 text-xs mt-1">{errors.imageUrls}</p>
                          )}
                        </div>
                        {index > 0 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeImageUrl(index)}
                            className="border-2 border-black hover:bg-red-50"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    
                    {formData.imageUrls.length < 5 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addImageUrl}
                        className="w-full border-2 border-black hover:bg-gray-50"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Another Image
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

               {/* Submit Button */}
               <Card variant="decorated" className="border-2 border-black">
              <CardContent className="p-6">
                <div className="flex flex-col gap-3">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-black text-white hover:bg-gray-800 border-2 border-black py-6 text-lg font-serif"
                  >
                    {isLoading ? 'PUBLISHING...' : 'PUBLISH PRODUCT'}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/seller-center')}
                    className="w-full border-2 border-black hover:bg-gray-50 py-6 text-lg font-serif"
                  >
                    CANCEL
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Product Information */}
          <div className="space-y-6">
            {/* Basic Information */}
            <Card variant="decorated" className="border-2 border-black">
              <CardHeader className="border-b-2 border-black bg-black text-white">
                <CardTitle className="font-serif text-xl">BASIC INFORMATION</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
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
                  {errors.description && <p className="text-red-600 text-xs mt-1">{errors.description}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price" className="font-serif text-lg">Selling Price</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="border-2 border-black pl-8 mt-1"
                        placeholder="0.00"
                      />
                    </div>
                    {errors.price && <p className="text-red-600 text-xs mt-1">{errors.price}</p>}
                  </div>

                  <div>
                    <Label htmlFor="originalPrice" className="font-serif text-lg">Original Price</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <Input
                        id="originalPrice"
                        name="originalPrice"
                        type="number"
                        step="0.01"
                        value={formData.originalPrice}
                        onChange={handleInputChange}
                        className="border-2 border-black pl-8 mt-1"
                        placeholder="0.00"
                      />
                    </div>
                    {errors.originalPrice && <p className="text-red-600 text-xs mt-1">{errors.originalPrice}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product Details */}
            <Card variant="decorated" className="border-2 border-black">
              <CardHeader className="border-b-2 border-black bg-black text-white">
                <CardTitle className="font-serif text-xl">PRODUCT DETAILS</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
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
                    required
                    
                  />
                  {errors.categoryId && <p className="text-red-600 text-xs mt-1">{errors.categoryId}</p>}
                </div>

                <div>
                  <Label htmlFor="brandId" className="font-serif">Brand ID</Label>
                  <Input
                    id="brandId"
                    name="brandId"
                    type="number"
                    value={formData.brandId}
                    onChange={handleInputChange}
                    className="border-2 border-black mt-1"
                    placeholder="Enter brand ID"
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