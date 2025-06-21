'use client';

import { useState } from 'react';
import { useMyProducts } from '../hooks/useMyProducts';
import { useMyProductDetail } from '../hooks/useMyProductDetail';
import { UpdateProductModal } from './UpdateProductModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, Edit, Trash2, Eye, Heart, DollarSign } from 'lucide-react';
import { Product } from '../schema';
import Link from 'next/link';
import { formatVNDPrice } from '@/utils/format';
import Image from 'next/image';

export function InventoryTab() {
  const { data, isLoading, error } = useMyProducts();
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  // Fetch detailed product information when a product is selected for editing
  const { data: selectedProductDetail } = useMyProductDetail(
    selectedProductId?.toString() || ''
  );

  if (isLoading) {
    return (
      <Card variant="double" className="border-2 border-black">
        <CardHeader className="border-b-2 border-black bg-black text-white">
          <CardTitle className="font-metal text-xl font-normal">MY INVENTORY</CardTitle>
        </CardHeader>
        <CardContent className="p-10">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
            <p className="font-serif mt-4">Loading your products...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card variant="double" className="border-2 border-black">
        <CardHeader className="border-b-2 border-black bg-black text-white">
          <CardTitle className="font-metal text-xl font-normal">MY INVENTORY</CardTitle>
        </CardHeader>
        <CardContent className="p-10">
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto text-red-600 mb-4" />
            <h3 className="font-serif text-xl font-bold mb-2 text-red-600">Error Loading Products</h3>
            <p className="text-gray-600 font-mono">Failed to load your inventory. Please try again.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const products = data?.content || [];
  const totalProducts = data?.pagination?.totalElements || 0;
  const totalViews = products.reduce((sum: number, product: Product) => sum + product.viewsCount, 0);
  const totalLikes = products.reduce((sum: number, product: Product) => sum + product.likesCount, 0);
  const totalValue = products.reduce((sum: number, product: Product) => sum + product.price, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-600 text-white';
      case 'INACTIVE':
        return 'bg-gray-600 text-white';
      case 'DRAFT':
        return 'bg-yellow-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  const handleEditClick = (product: Product) => {
    setSelectedProductId(product.productId);
    setIsUpdateModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedProductId(null);
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card variant="double" className="border-2 border-black">
          <CardContent className="pt-10 text-center">
            <Package className="w-8 h-8 mx-auto mb-2 text-[var(--dark-red)]" />
            <div className="font-gothic text-2xl font-bold">{totalProducts}</div>
            <div className="text-sm font-mono text-gray-600">Total Products</div>
          </CardContent>
        </Card>
        
        <Card variant="double" className="border-2 border-black">
          <CardContent className="pt-10 text-center">
            <Eye className="w-8 h-8 mx-auto mb-2 text-[var(--dark-red)]" />
            <div className="font-serif text-2xl font-bold">{totalViews}</div>
            <div className="text-sm font-mono text-gray-600">Total Views</div>
          </CardContent>
        </Card>
        
        <Card variant="double" className="border-2 border-black">
          <CardContent className="pt-10 text-center">
            <Heart className="w-8 h-8 mx-auto mb-2 text-[var(--dark-red)]" />
            <div className="font-serif text-2xl font-bold">{totalLikes}</div>
            <div className="text-sm font-mono text-gray-600">Total Likes</div>
          </CardContent>
        </Card>
        
        <Card variant="double"className='border-2 border-black'>
          <CardContent className="pt-10 text-center">
            <DollarSign className="w-8 h-8 mx-auto mb-2 text-[var(--dark-red)]" />
            <div className="font-gothic text-2xl font-bold">{formatVNDPrice(totalValue)}</div>
            <div className="text-sm font-mono text-gray-600">Total Value</div>
          </CardContent>
        </Card>
      </div>

      {/* Products Grid */}
      <Card variant="double" className="border-2 border-black">
        <CardHeader className="border-b-2 border-black bg-black text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="font-metal text-xl font-normal">MY INVENTORY</CardTitle>
            {totalProducts > 0 && (
              <Badge variant="outline" className="border-2 border-white text-white font-serif">
                {totalProducts} {totalProducts === 1 ? 'item' : 'items'}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {products.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="font-serif text-xl font-bold mb-2">No Products Yet</h3>
              <p className="text-gray-600 font-mono mb-6">Start building your inventory by adding your first product.</p>
              <Button className="bg-black text-white hover:bg-gray-800 border-2 border-black font-serif">
                Add Your First Product
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product: Product) => (
                <div key={product.productId} className="group relative bg-white/90 backdrop-blur-sm overflow-hidden border-2 border-black -mr-[2px] -mb-[2px]">
                  {/* Status Badge */}
                  <div className="absolute top-0 right-0 z-10 px-3 py-1 bg-black text-white text-xs font-metal uppercase shadow-sm">
                    {product.condition}
                  </div>
                  
                  {/* Status Badge - Top Left */}
                  <div className={`absolute top-0 left-0 z-10 px-3 py-1 text-xs font-metal uppercase shadow-sm ${getStatusColor(product.status || 'INACTIVE')}`}>
                    {product.status || 'INACTIVE'}
                  </div>
                  
                  {/* Product Image - Clickable */}
                  <Link href={`/products/${product.productId}`}>
                    <div className="relative aspect-[1/1] overflow-hidden bg-gray-100 cursor-pointer">
                      <Image
                        src={product.primaryImageUrl}
                        alt={product.title}
                        width={400}
                        height={400}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        unoptimized
                      />
                    </div>
                  </Link>
                  
                  {/* Product Info */}
                  <div className="p-6">
                    <div className="flex items-center mb-3 border-b border-black/10 pb-1">
                      <span className="text-[var(--dark-red)] mr-2">—</span>
                      <span className="font-gothic text-xs uppercase tracking-wider text-black/80">
                        {product.categoryName}
                      </span>
                    </div>
                    
                    <Link href={`/products/${product.productId}`}>
                      <h3 className="font-serif text-xl font-bold mb-3 leading-tight truncate cursor-pointer hover:text-[var(--dark-red)] transition-colors" title={product.title}>
                        {product.title}
                      </h3>
                    </Link>
                    <p className="text-black/70 text-sm mb-5 font-serif">Brand: {product.brandName}</p>
                    
                    {/* Stats */}
                    <div className="flex items-center justify-between border-t border-black/10 pt-3 mb-4">
                      <span className="font-metal text-[var(--dark-red)]">{formatVNDPrice(product.price)}</span>
                      <div className="flex items-center gap-4 text-sm font-serif text-black/70">
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {product.viewsCount}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          {product.likesCount}
                        </span>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 border-2 border-black hover:bg-black hover:text-white font-serif text-xs"
                        onClick={() => handleEditClick(product)}
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-2 border-red-600 text-red-600 hover:bg-red-50 font-serif text-xs"
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this product?')) {
                            // TODO: Implement delete functionality
                            console.log('Delete product:', product.productId);
                          }
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Update Product Modal */}
      <UpdateProductModal
        product={selectedProductDetail || null}
        isOpen={isUpdateModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
} 