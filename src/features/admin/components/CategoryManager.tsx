'use client';

import { useState } from 'react';
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '@/features/category/hooks';
import { Category } from '@/features/category/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function CategoryManager() {
  const { data: categories, isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parent: null as number | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await updateCategory.mutateAsync({
          categoryId: editingCategory.categoryId,
          data: formData,
        });
        toast.success('Category updated successfully');
        setEditingCategory(null);
      } else {
        await createCategory.mutateAsync(formData);
        toast.success('Category created successfully');
        setIsCreating(false);
      }
      setFormData({ name: '', description: '', parent: null });
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      parent: category.parent,
    });
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-gothic">Categories</h2>
        <Button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      {(isCreating || editingCategory) && (
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
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit">
              {editingCategory ? 'Update' : 'Create'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setEditingCategory(null);
                setIsCreating(false);
                setFormData({ name: '', description: '', parent: null });
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="grid gap-4">
        {categories?.map((category) => (
          <div
            key={category.categoryId}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div>
              <h3 className="font-gothic text-lg">{category.name}</h3>
              <p className="text-sm text-gray-600">{category.description}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleEdit(category)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleDelete(category.categoryId)}
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