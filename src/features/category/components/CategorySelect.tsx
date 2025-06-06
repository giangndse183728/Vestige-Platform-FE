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

interface CategorySelectProps {
  value: string;
  onValueChange: (value: string) => void;
  label?: string;
  required?: boolean;
}

export function CategorySelect({
  value,
  onValueChange,
  label = 'Category',
  required = false,
}: CategorySelectProps) {
  const { data: categories, isLoading } = useCategories();

  // Filter out duplicate categories (those that appear as children)
  const uniqueCategories = categories?.filter((category) => {
    if (category.parent === null) return true;
    return !categories.some((c) => c.children?.some((child) => child.categoryId === category.categoryId));
  });

  return (
    <div className="space-y-2">
      <Label className="font-gothic">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Select
        value={value}
        onValueChange={onValueChange}
        disabled={isLoading}
      >
        <SelectTrigger className="border-2 border-black rounded-none bg-transparent">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent className="rounded-none bg-white">
          {uniqueCategories?.map((category) => (
            <div key={category.categoryId}>
              <SelectItem 
                value={category.categoryId.toString()}
              >
                {category.name}
              </SelectItem>
              {category.children?.map((child) => (
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