'use client';

import { ProductDetail } from '@/features/products/components/ProductDetail';
import { useProductDetailBySlug } from '@/features/products/hooks/useProductDetail';
import { use } from 'react';

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const { data: product, isLoading, error } = useProductDetailBySlug(resolvedParams.slug);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading product details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">Error loading product details</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Product not found</div>
      </div>
    );
  }

  return <ProductDetail product={product} />;
} 