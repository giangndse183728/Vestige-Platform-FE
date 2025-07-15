'use client';

import { useState } from 'react';
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '@/features/category/hooks';
import { Category, createCategorySchema } from '@/features/category/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import * as z from "zod";
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function CategoryManager() {
  const { data: categories, isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parentCategoryId: null as number | null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        const validatedData = createCategorySchema.parse({
          name: formData.name,
          description: formData.description,
          parentCategoryId: formData.parentCategoryId,
        });

        await updateCategory.mutateAsync({
          categoryId: editingCategory.categoryId,
          data: validatedData,
        });
        toast.success('Category updated successfully');
        setEditingCategory(null);
      } else {
        const validatedData = createCategorySchema.parse({
          name: formData.name,
          description: formData.description,
          parentCategoryId: formData.parentCategoryId,
        });
        await createCategory.mutateAsync(validatedData);
        toast.success('Category created successfully');
        setIsCreating(false);
      }
      setFormData({ name: '', description: '', parentCategoryId: null });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error(error.response?.data?.message || 'An error occurred');
      }
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      parentCategoryId: category.parent ? category.parent.categoryId : null,
    });
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '', parentCategoryId: null });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({ name: '', description: '', parentCategoryId: null });
  };

  const handleDelete = async (categoryId: number) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory.mutateAsync(categoryId);
        toast.success('Category deleted successfully');
      } catch (error) {
        toast.error('An error occurred');
      }
    }
  };

  // Recursive function to filter categories while preserving hierarchy
  const filterCategoryTree = (categories: Category[], query: string): Category[] => {
    if (!categories || query === '') {
      return categories;
    }

    const lowerCaseQuery = query.toLowerCase();
    const filtered: Category[] = [];

    categories.forEach(category => {
      const nameMatches = category.name.toLowerCase().includes(lowerCaseQuery);
      const descriptionMatches = category.description?.toLowerCase().includes(lowerCaseQuery);

      const hasMatchingChildren = category.children && category.children.length > 0 &&
        filterCategoryTree(category.children, query).length > 0;

      if (nameMatches || descriptionMatches || hasMatchingChildren) {
        filtered.push({
          ...category,
          children: filterCategoryTree(category.children, query)
        });
      }
    });
    return filtered;
  };

  const categoriesToDisplay = filterCategoryTree(categories || [], searchQuery);

  // Recursive function to render category rows
  const renderCategoryRows = (categoriesToRender: Category[], level: number) => {
    return categoriesToRender.map((category) => (
      <React.Fragment key={category.categoryId}>
        <tr className="hover:bg-gray-50">
          <td className="py-4 px-6" style={{ paddingLeft: `${(level * 20) + 24}px` }}>
            <div className="flex items-center gap-2">
              {category.children && category.children.length > 0 && (
                <span className="text-gray-500 mr-1">{category.level === 0 ? '▼' : '▶'}</span>
              )}
              <span className={`text-sm font-medium ${category.level === 0 ? 'text-gray-900 font-bold' : 'text-gray-600'}`}>{category.name}</span>
            </div>
            {category.parent && (
              <p className="text-xs text-gray-400 mt-1">Parent: {category.parent.name}</p>
            )}
          </td>
          <td className="py-4 px-6">
            <p className="text-sm text-gray-500 line-clamp-2">{category.description || ''}</p>
          </td>
          <td className="py-4 px-6">
            <span className="text-sm text-gray-500">{category.childrenCount} items</span>
          </td>
          <td className="py-4 px-6">
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEdit(category)}
                className="h-8 w-8"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(category.categoryId)}
                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </td>
        </tr>
        {category.children && category.children.length > 0 && renderCategoryRows(category.children, level + 1)}
      </React.Fragment>
    ));
  };

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
          <h2 className="text-lg font-semibold text-gray-900">Categories</h2>
          <p className="text-sm text-gray-500">Manage your product categories</p>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search categories..."
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
            Add Category
          </Button>
        </div>
      </div>

      {/* Form */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Edit Category' : 'Create New Category'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="parentCategoryId" className="text-sm font-medium text-gray-700">Parent Category (Optional)</Label>
              <select
                id="parentCategoryId"
                value={formData.parentCategoryId !== null ? String(formData.parentCategoryId) : ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    parentCategoryId: e.target.value ? Number(e.target.value) : null,
                  })
                }
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">None (Top-level Category)</option>
                {categories?.map((category: Category) => (
                  <option key={category.categoryId} value={String(category.categoryId)}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1 border border-black hover:bg-black hover:text-white transition-colors">
                {editingCategory ? 'Update' : 'Create'}
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

      {/* Categories List */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Children</th>
                <th className="text-right py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categoriesToDisplay && renderCategoryRows(categoriesToDisplay, 0)}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
} 