'use client';

import { useCategories } from '@/features/category/hooks';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

export default function CategoriesPage() {
  const { data: categories, isLoading } = useCategories();

  // Filter top-level categories
  const topLevelCategories = categories?.filter(cat => cat.level === 0);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background p-8">
        <div className="container mx-auto">
          <h1 className="font-metal text-3xl tracking-wider uppercase mb-8">Shop by Category</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <main className="min-h-screen bg-background p-8 flex items-center justify-center">
        <p className="text-muted-foreground text-lg">No categories found.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="container mx-auto">
        <h1 className="font-metal text-3xl tracking-wider uppercase mb-8">Shop by Category</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
          {topLevelCategories?.map((category) => (
            <Card key={category.categoryId} variant="double" className="p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold text-gray-900 border-b pb-2 mb-2">
                <Link href={`/categories/${category.categoryId}`} className="hover:text-primary transition-colors">
                  <span className="hover:underline underline-offset-4 transition-all">{category.name}</span>
                </Link>
              </h2>
              {category.children && category.children.length > 0 && (
                <ul className="space-y-2">
                  {category.children?.map((child) => (
                    <li key={child.categoryId}>
                      <Link 
                        href={`/categories/${child.categoryId}`}
                        className="text-gray-700 hover:text-primary transition-colors text-base block hover:underline underline-offset-4 transition-all"
                      >
                        {child.name}
                      </Link>
                      {child.children && child.children.length > 0 && (
                        <ul className="ml-4 space-y-1 mt-1">
                          {child.children.map((grandchild) => (
                            <li key={grandchild.categoryId}>
                              <Link 
                                href={`/categories/${grandchild.categoryId}`}
                                className="text-gray-500 hover:text-primary transition-colors text-sm block hover:underline underline-offset-4 transition-all"
                              >
                                {grandchild.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          ))}
        </div>

        {/* Display categories without children or top-level without children if needed - optional */}
        {/* This section is commented out to focus on the mega menu style for hierarchical categories */}
        {/* 
        <h2 className="text-2xl font-bold mt-12 mb-6">Other Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories?.filter(cat => !cat.children || cat.children.length === 0 || cat.level !== 0).map(cat => (
            <Card key={cat.categoryId} className="p-4 text-center">
              <Link href={`/collection?category=${cat.categoryId}`} className="text-lg font-medium hover:text-primary">
                {cat.name}
              </Link>
            </Card>
          ))}
        </div>
        */}
      </div>
    </main>
  );
} 