'use client';

import { useProducts } from "../hooks/useProducts";
import { ProductCard } from './ProductCard';
import { useFiltersStore } from "../hooks/useFilters";
import { useEffect } from 'react';
import Pagination from '@/components/ui/pagination';
import PageSizeSelector from '@/components/ui/page-size-selector';
import { useTopViewedProducts } from '../hooks/useTopProducts';
import { useTopLikedProducts } from "../hooks/useTopProducts";

export function ProductList() {
  const { filters, setTotalProducts, setPage, setPageSize } = useFiltersStore();
  const useMostViewed = filters.sortDir === 'most_viewed';
  const useMostLiked = filters.sortDir === 'most_liked';
  const { data, isLoading, error } = useMostViewed
    ? useTopViewedProducts()
    : useMostLiked
    ? useTopLikedProducts()
    : useProducts(filters);

  useEffect(() => {
    if (data?.pagination?.totalElements !== undefined && !useMostViewed && !useMostLiked) {
      setTotalProducts(data.pagination.totalElements);
    }
  }, [data?.pagination?.totalElements, setTotalProducts, useMostViewed, useMostLiked]);

  const handlePageChange = (page: number) => {
    setPage(page - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  const currentPage = (data?.pagination?.currentPage ?? 0) + 1;
  const currentPageSize = parseInt(filters.size || '12');
  const totalPages = data?.pagination?.totalPages || 1;

  return (
    <div className="container mx-auto ">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ">
        {data?.content.map((product) => (
          <ProductCard key={product.productId} product={product} />
        ))}
      </div>
      {!useMostViewed && !useMostLiked && data?.content && data.content.length > 0 && (
        <div className="flex flex-col items-center gap-4 py-8 ">
          <div className="flex items-center justify-between w-full max-w-4xl ">
            <PageSizeSelector
              currentPageSize={currentPageSize}
              onPageSizeChange={handlePageSizeChange}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
            <div className="text-sm text-gray-600 font-gothic">
              Showing {data.content.length} of {data.pagination.totalElements} products
            </div>
          </div>
        </div>
      )}
      {data?.content && data.content.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 font-gothic">No products found matching your criteria</div>
        </div>
      )}
    </div>
  );
}