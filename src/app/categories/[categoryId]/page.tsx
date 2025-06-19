'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCategories } from '@/features/category/hooks';
import { useProducts } from '@/features/products/hooks/useProducts';
import { ProductCard } from '@/features/products/components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Grid, List } from 'lucide-react';
import { useState } from 'react';

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = parseInt(params.categoryId as string);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: products, isLoading: productsLoading } = useProducts({
    category: categoryId.toString()
  });

  const selectedCategoryData = categories?.find(cat => cat.categoryId === categoryId);

  if (categoriesLoading) {
    return (
      <main className="min-h-screen bg-background p-8">
        <div className="container mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-8 w-48" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="space-y-4">
                <Skeleton className="aspect-square w-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (!selectedCategoryData) {
    return (
      <main className="min-h-screen bg-background p-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground text-lg mb-4">
            <span className="font-metal text-6xl text-gray-800">Category not found.</span>
          </p>
          <Button
            variant="outline"
            onClick={() => router.push('/categories')}
            className="mt-6 hover:bg-black hover:text-white hover:border-black transition-colors"
          >
            Back to Categories
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h1 className="font-metal text-5xl tracking-wider uppercase">
              {selectedCategoryData.name}
            </h1>
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 border border-gray-200 rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-8 w-8 p-0"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-8 w-8 p-0"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Products */}
        {productsLoading ? (
          <div className={`grid ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'grid-cols-1'
          }`}>
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="space-y-4">
                <Skeleton className="aspect-square w-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : products && products.content.length > 0 ? (
          <>
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-gray-600">
                {products.content.length} listing{products.content.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            {/* Products Grid */}
            <div className={`grid ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'grid-cols-1'
            }`}>
              {products.content.map((product) => (
                <ProductCard key={product.productId} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {products.pagination.totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <div className="flex items-center gap-2">
                  {Array.from({ length: products.pagination.totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={page === products.pagination.currentPage ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        // TODO: Implement pagination
                        console.log(`Navigate to page ${page}`);
                      }}
                    >
                      {page}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">
              No products found in this category.
            </p>
            <Button onClick={() => router.push('/categories')}>
              Browse Other Categories
            </Button>
          </div>
        )}
      </div>
    </main>
  );
} 