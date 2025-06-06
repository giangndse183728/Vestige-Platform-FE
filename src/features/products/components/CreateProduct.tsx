'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createProduct } from '@/features/products/services';
import { toast } from 'sonner';
import { CategorySelect } from '@/features/category/components/CategorySelect';

export function CreateProduct() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
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
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUrlChange = (index: number, value: string) => {
    const newImageUrls = [...formData.imageUrls];
    newImageUrls[index] = value;
    setFormData(prev => ({
      ...prev,
      imageUrls: newImageUrls
    }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: parseFloat(formData.originalPrice),
        categoryId: parseInt(formData.categoryId),
        brandId: parseInt(formData.brandId),
        imageUrls: formData.imageUrls.filter(url => url.trim() !== '')
      };

      await createProduct(productData);
      toast.success('Product created successfully');
      router.push('/seller-center');
    } catch (error) {
      toast.error('Failed to create product');
      console.error('Error creating product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-metal text-3xl font-bold text-black tracking-wider mb-2">
          CREATE NEW PRODUCT
        </h1>
        <p className="font-gothic text-sm text-gray-600">
          Fill in the details below to list your product
        </p>
      </div>

      <Card className="border-2 border-black">
        <CardHeader className="border-b-2 border-black">
          <CardTitle className="font-metal text-xl">Product Information</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="font-gothic">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="border-2 border-black"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="font-gothic">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  className="border-2 border-black"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price" className="font-gothic">Price</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  className="border-2 border-black"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="originalPrice" className="font-gothic">Original Price</Label>
                <Input
                  id="originalPrice"
                  name="originalPrice"
                  type="number"
                  step="0.01"
                  value={formData.originalPrice}
                  onChange={handleInputChange}
                  required
                  className="border-2 border-black"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="condition" className="font-gothic">Condition</Label>
                <Select
                  value={formData.condition}
                  onValueChange={(value) => handleSelectChange('condition', value)}
                >
                  <SelectTrigger className="border-2 border-black">
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="size" className="font-gothic">Size</Label>
                <Input
                  id="size"
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
                  required
                  className="border-2 border-black"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="color" className="font-gothic">Color</Label>
                <Input
                  id="color"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  required
                  className="border-2 border-black"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoryId" className="font-gothic">Category</Label>
                <CategorySelect
                  value={formData.categoryId}
                  onValueChange={(value) => handleSelectChange('categoryId', value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="brandId" className="font-gothic">Brand ID</Label>
                <Input
                  id="brandId"
                  name="brandId"
                  type="number"
                  value={formData.brandId}
                  onChange={handleInputChange}
                  required
                  className="border-2 border-black"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="font-gothic">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger className="border-2 border-black">
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

            <div className="space-y-4">
              <Label className="font-gothic">Product Images</Label>
              {formData.imageUrls.map((url, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    type="url"
                    value={url}
                    onChange={(e) => handleImageUrlChange(index, e.target.value)}
                    placeholder="Enter image URL"
                    className="border-2 border-black"
                  />
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removeImageUrl(index)}
                      className="border-2 border-black"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addImageUrl}
                className="border-2 border-black"
              >
                Add Image URL
              </Button>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isLoading}
                className="border-2 border-black bg-black text-white hover:bg-white hover:text-black"
              >
                {isLoading ? 'Creating...' : 'Create Product'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
