'use client';

import { useCategories } from '../hooks';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Category } from '../schema';

interface CategorySelectProps {
  value: string;
  onValueChange: (value: string) => void;
  label?: string;
  required?: boolean;
  showAllOption?: boolean;
}

export function CategorySelect({
  value,
  onValueChange,
  label = 'Category',
  required = false,
  showAllOption = false,
}: CategorySelectProps) {
  const { data, isLoading } = useCategories();
  const categories = data || [];

  const uniqueCategories = categories.filter((category: Category) => {
    if (category.parent === null) return true;
    return !categories.some((c: Category) => c.children?.some((child: Category) => child.categoryId === category.categoryId));
  });

  return (
    <div className="space-y-2">
      
      <Select
        value={value}
        onValueChange={onValueChange}
        disabled={isLoading}
      >
        <SelectTrigger className="border-2 border-black rounded-none bg-transparent">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent className="rounded-none bg-white">
          {showAllOption && (
            <SelectItem value="all">
              All Categories
            </SelectItem>
          )}
          {uniqueCategories?.map((category: Category) => (
            <div key={category.categoryId}>
              <SelectItem 
                value={category.categoryId.toString()}
              >
                {category.name}
              </SelectItem>
              {category.children?.map((child: Category) => (
                <SelectItem 
                  key={child.categoryId}
                  value={child.categoryId.toString()}
                >
                  {category.name} {'>'} {child.name}
                </SelectItem>
              ))}
            </div>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
} 