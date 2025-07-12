'use client';

import { ProductList } from "@/features/products/components/ProductList";
import { useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { useFiltersStore } from '@/features/products/hooks/useFilters';

function MarketplaceContent() {
  const searchParams = useSearchParams();
  const { updateFilter } = useFiltersStore();

  useEffect(() => {
    const brandParam = searchParams.get('brand');
    const categoryParam = searchParams.get('category');
    const nameParam = searchParams.get('name');
    
    if (brandParam) {
      updateFilter('brand', brandParam);
    }
    
    if (categoryParam) {
      updateFilter('category', categoryParam);
    }
    
    // Note: nameParam is handled directly in FilterProductLayout via useSearchParams
    // This ensures the category name is available for display in filter badges
  }, [searchParams, updateFilter]);

  return (
    <div>
      <ProductList />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MarketplaceContent />
    </Suspense>
  );
}
