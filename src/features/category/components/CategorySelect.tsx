'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, CornerDownRight } from 'lucide-react';

import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useCategories } from '../hooks';
import { Category } from '../schema';

interface CategorySelectProps {
  value: string;
  onValueChange: (value: string) => void;
  showAllOption?: boolean;
}

export function CategorySelect({
  value,
  onValueChange,
  showAllOption = false,
}: CategorySelectProps) {
  const [open, setOpen] = React.useState(false);
  const { data: categories, isLoading } = useCategories();

  const { parentCategories, allLabels } = React.useMemo(() => {
    const parentCategories: Category[] = (categories || []).filter(
      (category: Category) => category.parent === null
    );

    const allLabels: { [key: string]: string } = {};
    parentCategories.forEach((p) => {
      allLabels[p.categoryId.toString()] = p.name;
      p.children?.forEach((c) => {
        allLabels[c.categoryId.toString()] = `${p.name} > ${c.name}`;
      });
    });
    if (showAllOption) {
      allLabels['all'] = 'All Categories';
    }

    return { parentCategories, allLabels };
  }, [categories, showAllOption]);

  const selectedLabel = allLabels[value] || 'Select category...';

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between border-2 border-black rounded-none bg-transparent"
          disabled={isLoading}
        >
          {selectedLabel}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0 rounded-none">
        <Command>
          <CommandInput placeholder="Search categories..." />
          <CommandList>
            <CommandEmpty>No category found.</CommandEmpty>
            
            {showAllOption && (
              <>
                <CommandItem
                  key="all"
                  value="All Categories"
                  onSelect={() => {
                    onValueChange('all');
                    setOpen(false);
                  }}
                   className="font-semibold font-serif text-red-900"
                >
                  All Categories
                  <Check
                    className={cn(
                      'ml-auto h-4 w-4',
                      value === 'all' ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
               
              </>
            )}

            {parentCategories.map((parent) => (
              <React.Fragment key={parent.categoryId}>
                <CommandSeparator className="bg-gray-200" />
                <CommandGroup>
                  <CommandItem
                    key={parent.categoryId}
                    value={parent.name}
                    onSelect={() => {
                      onValueChange(parent.categoryId.toString());
                      setOpen(false);
                    }}
                    className="font-semibold font-serif text-red-900"
                  >
                    {parent.name}
                    <Check
                      className={cn(
                        'ml-auto h-4 w-4',
                        value === parent.categoryId.toString()
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                  {parent.children?.map((child) => (
                    <CommandItem
                      key={child.categoryId}
                      value={`${parent.name} > ${child.name}`}
                      onSelect={() => {
                        onValueChange(child.categoryId.toString());
                        setOpen(false);
                      }}
                      className="pl-8 text-muted-foreground"
                    >
                      <CornerDownRight className="mr-2 h-4 w-4" />
                      {child.name}
                      <Check
                        className={cn(
                          'ml-auto h-4 w-4',
                          value === child.categoryId.toString()
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </React.Fragment>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
