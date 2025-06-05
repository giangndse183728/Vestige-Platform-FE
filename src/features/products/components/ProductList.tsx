'use client';

import { useProducts } from "../hooks/useProducts";
import { ProductCard } from './ProductCard';

export function ProductList() {
  const { data, isLoading, error } = useProducts();

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
    <div className="container mx-auto p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 ">
        {data?.content.map((product) => (
          <ProductCard key={product.productId} product={product} />
        ))}
      </div>
    </div>
  );
}