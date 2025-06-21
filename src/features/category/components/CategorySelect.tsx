'use client';

import { useState, useMemo, useCallback } from 'react';
import { useCategories } from '../hooks';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
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
  showAllOption = false,
}: CategorySelectProps) {
  const { data, isLoading } = useCategories();
  const categories = data || [];
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const uniqueCategories = categories.filter((category: Category) => {
    if (category.parent === null) return true;
    return !categories.some((c: Category) => 
      c.children?.some((child: Category) => child.categoryId === category.categoryId)
    );
  });

  // Create flattened options for easier searching
  const allOptions = useMemo(() => {
    const options: Array<{ value: string; label: string; searchText: string }> = [];
    
    if (showAllOption) {
      options.push({
        value: 'all',
        label: 'All Categories',
        searchText: 'all categories'
      });
    }

    uniqueCategories.forEach((category: Category) => {
      // Add parent category
      options.push({
        value: category.categoryId.toString(),
        label: category.name,
        searchText: category.name.toLowerCase()
      });

      // Add child categories
      category.children?.forEach((child: Category) => {
        options.push({
          value: child.categoryId.toString(),
          label: `${category.name} > ${child.name}`,
          searchText: `${category.name} ${child.name}`.toLowerCase()
        });
      });
    });

    return options;
  }, [uniqueCategories, showAllOption]);

  // Filter options based on search term
  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) return allOptions;
    
    return allOptions.filter(option =>
      option.searchText.includes(searchTerm.toLowerCase())
    );
  }, [allOptions, searchTerm]);

  // Memoized search input change handler
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  // Handle open change - clear search when closed
  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setSearchTerm('');
    }
  }, []);

  return (
    <div className="space-y-2">
      <Select
        value={value}
        onValueChange={onValueChange}
        disabled={isLoading}
        open={isOpen}
        onOpenChange={handleOpenChange}
      >
        <SelectTrigger className="border-2 border-black rounded-none bg-transparent">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent className="rounded-none bg-white">
          {/* Search Input */}
          <div className="flex items-center border-b px-3 pb-2 sticky top-0 bg-white z-10">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="h-8 w-full bg-transparent border-0 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none"
              // Prevent the select from closing when clicking on input
              onMouseDown={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                // Prevent select from handling these keys
                if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter') {
                  e.stopPropagation();
                }
              }}
            />
          </div>
          
          {/* Options */}
          <div className="max-h-[200px] overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No categories found.
              </div>
            ) : (
              filteredOptions.map((option) => (
                <SelectItem 
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </SelectItem>
              ))
            )}
          </div>
        </SelectContent>
      </Select>
    </div>
  );
}
