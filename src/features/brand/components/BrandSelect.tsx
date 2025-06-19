'use client';

import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBrands } from '../hooks';
import { Loader2 } from 'lucide-react';

interface BrandSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

export function BrandSelect({ 
  value, 
  onValueChange, 
  placeholder = "Select brand",
  required = false,
  disabled = false 
}: BrandSelectProps) {
  const { data: brands, isLoading, error } = useBrands();

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm text-gray-500">Loading brands...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-red-600">
        Error loading brands. Please try again.
      </div>
    );
  }

  return (
    <Select 
      value={value} 
      onValueChange={onValueChange} 
      disabled={disabled}
    >
      <SelectTrigger className="border-2 border-black mt-1">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {brands?.map((brand) => (
          <SelectItem key={brand.brandId} value={brand.brandId.toString()}>
            {brand.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}