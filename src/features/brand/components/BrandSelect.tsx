'use client';

import React, { useState, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useBrands } from '../hooks';
import { Loader2, Search } from 'lucide-react';

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
  disabled = false 
}: BrandSelectProps) {
  const { data: brands, isLoading, error } = useBrands();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter brands based on search term
  const filteredBrands = useMemo(() => {
    if (!brands || !searchTerm.trim()) return brands || [];
    
    return brands.filter(brand =>
      brand.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [brands, searchTerm]);

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
        {/* Search Input */}
        <div className="flex items-center border-b px-3 pb-2">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <Input
            placeholder="Search brands..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-8 w-full bg-transparent border-0 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        
        {/* Brand Options */}
        <div className="max-h-[200px] overflow-y-auto">
          {filteredBrands.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              {searchTerm.trim() ? 'No brands found.' : 'No brands available.'}
            </div>
          ) : (
            filteredBrands.map((brand) => (
              <SelectItem key={brand.brandId} value={brand.brandId.toString()}>
                {brand.name}
              </SelectItem>
            ))
          )}
        </div>
      </SelectContent>
    </Select>
  );
}