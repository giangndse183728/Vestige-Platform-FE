'use client';

import { useBrands } from '@/features/brand/hooks';
import { Card } from '@/components/ui/card';
import Image from 'next/image';

export default function DesignersPage() {
  const { data: brands, isLoading } = useBrands();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Designers</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brands?.map((brand) => (
          <Card key={brand.brandId} className="overflow-hidden group hover:shadow-lg transition-shadow duration-300">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={brand.logoUrl}
                alt={brand.name}
                fill
                className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4 border-t">
              <h2 className="text-xl font-semibold text-center">{brand.name}</h2>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 