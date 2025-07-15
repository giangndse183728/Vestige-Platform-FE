'use client';

import { ProductList } from '@/features/products/components/ProductList';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useFiltersStore } from '@/features/products/hooks/useFilters';

export default function MarketplaceContent() {
  const searchParams = useSearchParams();
  const { updateFilter } = useFiltersStore();

  useEffect(() => {
    const brandParam = searchParams.get('brand');
    const categoryParam = searchParams.get('category');

    if (brandParam) updateFilter('brand', brandParam);
    if (categoryParam) updateFilter('category', categoryParam);
  }, [searchParams, updateFilter]);

  return <ProductList />;
}
