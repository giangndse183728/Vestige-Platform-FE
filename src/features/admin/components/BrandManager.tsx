'use client';

import { useState } from 'react';
import { useBrands, useCreateBrand, useUpdateBrand, useDeleteBrand } from '@/features/brand/hooks';
import { Brand } from '@/features/brand/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { createBrandSchema } from '@/features/brand/schema';
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function BrandManager() {
  const { data: brands, isLoading } = useBrands();
  const createBrand = useCreateBrand();
  const updateBrand = useUpdateBrand();
  const deleteBrand = useDeleteBrand();

  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    logoUrl: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBrand) {
        let validatedData = createBrandSchema.parse(formData);

        await updateBrand.mutateAsync({
          brandId: editingBrand.brandId,
          data: validatedData,
        });
        toast.success('Brand updated successfully');
        setEditingBrand(null);
      } else {
        let validatedData = createBrandSchema.parse(formData);

        await createBrand.mutateAsync(validatedData);
        toast.success('Brand created successfully');
        setIsCreating(false);
      }
      setFormData({ name: '', logoUrl: '' });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error(error.response?.data?.message || 'An error occurred while creating/updating the brand.');
      }
    }
  };

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      logoUrl: brand.logoUrl,
    });
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingBrand(null);
    setFormData({ name: '', logoUrl: '' });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBrand(null);
    setFormData({ name: '', logoUrl: '' });
  };

  const handleDelete = async (brandId: number) => {
    if (window.confirm('Are you sure you want to delete this brand?')) {
      try {
        await deleteBrand.mutateAsync(brandId);
        toast.success('Brand deleted successfully');
      } catch (error: any) {
        if (error.response?.status === 409) {
          toast.error('Cannot delete brand: It has associated products. Please remove or reassign the products first.');
        } else {
          toast.error('Cannot delete brand: It has associated products. Please remove or reassign the products first.');
        }
      }
    }
  };

  const filteredBrands = brands?.filter(brand =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase()) 
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Brands</h2>
          <p className="text-sm text-gray-500">Manage your product brands</p>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search brands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button
            onClick={handleCreate}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Brand
          </Button>
        </div>
      </div>

      {/* Form */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingBrand ? 'Edit Brand' : 'Create New Brand'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value.trim() })}
                className="mt-1"
                required={true}
              />
            </div>
            <div>
              <Label htmlFor="logoUrl" className="text-sm font-medium text-gray-700">Logo URL</Label>
              <Input
                id="logoUrl"
                type="url"
                value={formData.logoUrl}
                onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value.trim() })}
                className="mt-1"
                required={true}
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1 border border-black hover:bg-black hover:text-white transition-colors">
                {editingBrand ? 'Update' : 'Create'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseModal}
                className="flex-1 border border-black hover:bg-black hover:text-white transition-colors"
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Brands List */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                <th className="text-right py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBrands?.map((brand) => (
                <tr key={brand.brandId} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <img
                        src={brand.logoUrl}
                        alt={brand.name}
                        className="w-12 h-12 object-contain bg-gray-50 rounded-lg p-2 border border-gray-200"
                      />
                      <span className="text-sm font-medium text-gray-900">{brand.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(brand)}
                        className="h-8 w-8"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(brand.brandId)}
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
} 