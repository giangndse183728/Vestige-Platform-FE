'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';

import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useBrands } from '../hooks';

interface BrandSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function BrandSelect({
  value,
  onValueChange,
  placeholder = 'Select brand',
  disabled = false,
}: BrandSelectProps) {
  const [open, setOpen] = React.useState(false);
  const { data: brands, isLoading, error } = useBrands();

  const selectedBrand = brands?.find(
    (brand) => brand.brandId.toString() === value
  );

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
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between border-2 border-black mt-1"
          disabled={disabled || isLoading}
        >
          {selectedBrand ? selectedBrand.name : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Search brands..." />
          <CommandList>
            <CommandEmpty>No brand found.</CommandEmpty>
            {(brands || []).map((brand) => (
              <CommandItem
                key={brand.brandId}
                value={brand.name}
                onSelect={(currentValue) => {
                  onValueChange(
                    brand.brandId.toString() === value ? '' : brand.brandId.toString()
                  );
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    value === brand.brandId.toString() ? 'opacity-100' : 'opacity-0'
                  )}
                />
                {brand.name}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}