'use client';

import { useProducts } from "../hooks/useProducts";
import { ProductCard } from './ProductCard';
import { useFiltersStore } from "../hooks/useFilters";
import { useEffect } from 'react';

export function ProductList() {
  const { filters, setTotalProducts } = useFiltersStore();
  const { data, isLoading, error } = useProducts(filters);

  useEffect(() => {
    if (data?.pagination?.totalElements !== undefined) {
      setTotalProducts(data.pagination.totalElements);
    }
  }, [data?.pagination?.totalElements, setTotalProducts]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center text-red-600">Error loading products</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto ">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ">
        {data?.content.map((product) => (
          <ProductCard key={product.productId} product={product} />
        ))}
      </div>
    </div>
  );
}