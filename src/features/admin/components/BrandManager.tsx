'use client';

import { useState } from 'react';
import { useBrands, useCreateBrand, useUpdateBrand, useDeleteBrand } from '@/features/brand/hooks';
import { Brand } from '@/features/brand/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function BrandManager() {
  const { data: brands, isLoading } = useBrands();
  const createBrand = useCreateBrand();
  const updateBrand = useUpdateBrand();
  const deleteBrand = useDeleteBrand();

  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    logoUrl: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBrand) {
        await updateBrand.mutateAsync({
          brandId: editingBrand.brandId,
          data: formData,
        });
        toast.success('Brand updated successfully');
        setEditingBrand(null);
      } else {
        await createBrand.mutateAsync(formData);
        toast.success('Brand created successfully');
        setIsCreating(false);
      }
      setFormData({ name: '', logoUrl: '', description: '' });
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      logoUrl: brand.logoUrl,
      description: brand.description || '',
    });
  };

  const handleDelete = async (brandId: number) => {
    if (window.confirm('Are you sure you want to delete this brand?')) {
      try {
        await deleteBrand.mutateAsync(brandId);
        toast.success('Brand deleted successfully');
      } catch (error) {
        toast.error('An error occurred');
      }
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-gothic">Brands</h2>
        <Button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Brand
        </Button>
      </div>

      {(isCreating || editingBrand) && (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="logoUrl">Logo URL</Label>
            <Input
              id="logoUrl"
              type="url"
              value={formData.logoUrl}
              onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit">
              {editingBrand ? 'Update' : 'Create'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setEditingBrand(null);
                setIsCreating(false);
                setFormData({ name: '', logoUrl: '', description: '' });
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="grid gap-4">
        {brands?.map((brand) => (
          <div
            key={brand.brandId}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div className="flex items-center gap-4">
              <img
                src={brand.logoUrl}
                alt={brand.name}
                className="w-12 h-12 object-contain"
              />
              <div>
                <h3 className="font-gothic text-lg">{brand.name}</h3>
                {brand.description && (
                  <p className="text-sm text-gray-600">{brand.description}</p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleEdit(brand)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleDelete(brand.brandId)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 