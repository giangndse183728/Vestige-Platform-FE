'use client';

import { useState, useEffect } from 'react';
import { useUpdateProduct } from '../hooks/useUpdateProduct';
import { ProductDetail } from '../schema';
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

interface UpdateProductModalProps {
  product: ProductDetail | null;
  isOpen: boolean;
  onClose: () => void;
}

// Helper to remove all non-digit characters
const unformatVND = (value: string) => value.replace(/\D/g, '');

export function UpdateProductModal({ product, isOpen, onClose }: UpdateProductModalProps) {
  const updateProductMutation = useUpdateProduct();
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    price: string;
    originalPrice: string;
    condition: string;
    size: string;
    color: string;
    categoryId: string;
    brandId: string;
    imageUrls: string[];
    status: string;
  }>({
    title: '',
    description: '',
    price: '',
    originalPrice: '',
    condition: '',
    size: '',
    color: '',
    categoryId: '',
    brandId: '',
    imageUrls: [],
    status: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      const formatVNDInput = (value: number) => {
        const numeric = value.toString().replace(/\D/g, '');
        return numeric ? Number(numeric).toLocaleString('vi-VN') : '';
      };
      setFormData({
        title: product.title || '',
        description: product.description || '',
        price: product.price ? formatVNDInput(product.price) : '',
        originalPrice: product.originalPrice ? formatVNDInput(product.originalPrice) : '',
        condition: product.condition || '',
        size: product.size || '',
        color: product.color || '',
        categoryId: product.category.categoryId ? String(product.category.categoryId) : '',
        brandId: product.brand.brandId ? String(product.brand.brandId) : '',
        imageUrls: product.images.map(img => img.imageUrl) || [],
        status: product.status || '',
      });
      setErrors({});
    } else {
      setFormData({
        title: '',
        description: '',
        price: '',
        originalPrice: '',
        condition: '',
        size: '',
        color: '',
        categoryId: '',
        brandId: '',
        imageUrls: [],
        status: '',
      });
      setErrors({});
    }
  }, [product]);

  // Custom handler for price/originalPrice (same as CreateProduct)
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let numeric = unformatVND(value);
    numeric = numeric.replace(/^0+/, '');
    const formatted = numeric ? Number(numeric).toLocaleString('vi-VN') : '';
    setFormData(prev => ({
      ...prev,
      [name]: formatted
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
    
    // Clear error when user selects
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUrlChange = (index: number, value: string) => {
    const newImageUrls = [...(formData.imageUrls || [])];
    newImageUrls[index] = value;
    setFormData(prev => ({ ...prev, imageUrls: newImageUrls }));
  };

  const addImageUrl = () => {
    setFormData(prev => ({
      ...prev,
      imageUrls: [...(prev.imageUrls || []), '']
    }));
  };

  const removeImageUrl = (index: number) => {
    const newImageUrls = [...(formData.imageUrls || [])];
    newImageUrls.splice(index, 1);
    setFormData(prev => ({ ...prev, imageUrls: newImageUrls }));
  };

  // Validation: parse price/originalPrice as numbers
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title?.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.description?.trim()) {
      newErrors.description = 'Description is required';
    }
    if (formData.price === undefined || Number(unformatVND(formData.price)) < 0) {
      newErrors.price = 'Price must be greater than or equal to 0';
    }
    if (formData.originalPrice === undefined || Number(unformatVND(formData.originalPrice)) < 0) {
      newErrors.originalPrice = 'Original price must be greater than or equal to 0';
    }
    if (!formData.condition?.trim()) {
      newErrors.condition = 'Condition is required';
    }
    if (!formData.size?.trim()) {
      newErrors.size = 'Size is required';
    }
    if (!formData.color?.trim()) {
      newErrors.color = 'Color is required';
    }
    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required';
    }
    if (!formData.brandId) {
      newErrors.brandId = 'Brand is required';
    }
    const validImageUrls = formData.imageUrls?.filter(url => url?.trim()) || [];
    if (validImageUrls.length === 0) {
      newErrors.imageUrls = 'At least one image is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // On submit, convert formatted string to number and use UpdateProductRequest
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    if (!validateForm()) {
      return;
    }
    try {
      const filteredImageUrls = formData.imageUrls.filter((url: string) => url?.trim()) || [];
      const submitData = {
        title: formData.title,
        description: formData.description,
        price: Number(unformatVND(formData.price)),
        originalPrice: Number(unformatVND(formData.originalPrice)),
        condition: formData.condition,
        size: formData.size,
        color: formData.color,
        categoryId: parseInt(formData.categoryId),
        brandId: parseInt(formData.brandId),
        imageUrls: filteredImageUrls,
        status: formData.status,
      };
      await updateProductMutation.mutateAsync({
        id: product.productId,
        data: submitData
      });
      toast.success('Product updated successfully!');
      onClose();
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product. Please try again.');
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setFormData({
      title: '',
      description: '',
      price: '',
      originalPrice: '',
      condition: '',
      size: '',
      color: '',
      categoryId: '',
      brandId: '',
      imageUrls: [],
      status: '',
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose} >
      <DialogContent 
        className="sm:max-w-3xl max-h-[90vh] overflow-y-auto"
        onPointerDownOutside={(e) => e.preventDefault()}
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
              <CardTitle className="font-metal text-xl font-normal">PRODUCT DETAILS</CardTitle>
            </CardHeader>
            <CardContent className="p-10 space-y-4">
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
                <Label htmlFor="brandId" className="font-serif">Brand</Label>
                <BrandSelect
                  value={formData.brandId}
                  onValueChange={(value) => handleSelectChange('brandId', value)}
                  required
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
            <CardContent className="p-10 space-y-4">      
              {formData.imageUrls?.map((url, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={url}
                    onChange={(e) => handleImageUrlChange(index, e.target.value)}
                    placeholder={`Image URL ${index + 1}`}
                    className="border-2 border-black"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeImageUrl(index)}
                    className="border-2 border-red-600 text-red-600 hover:bg-red-50"
                  >
                    Remove
                  </Button>
                </div>
              ))}
              {errors.imageUrls && <p className="text-red-600 text-xs">{errors.imageUrls}</p>}
              
              <Button
                type="button"
                variant="outline"
                onClick={addImageUrl}
                className="border-2 border-black hover:bg-gray-50"
              >
                Add Image URL
              </Button>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={updateProductMutation.isPending}
              className="flex-1 bg-black text-white hover:bg-gray-800 border-2 border-black py-6 text-lg font-serif"
            >
              {updateProductMutation.isPending ? 'UPDATING...' : 'UPDATE PRODUCT'}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 border-2 border-black hover:bg-gray-50 py-6 text-lg font-serif"
            >
              CANCEL
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 