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
import { useDeleteProduct } from '../hooks/useMyProducts';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import Pagination from '@/components/ui/pagination';
import PageSizeSelector from '@/components/ui/page-size-selector';
import { useFiltersStore } from '../hooks/useFilters';
import React from 'react';

interface InventoryTabProps {
  onSwitchToAddProduct?: () => void;
}

function DeleteConfirmDialog({ open, onOpenChange, onConfirm, loading }: { open: boolean; onOpenChange: (open: boolean) => void; onConfirm: () => void; loading: boolean }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <DialogHeader className="text-center space-y-4">
          <DialogTitle className="font-metal text-xl">Delete Product</DialogTitle>
          <DialogDescription className="font-gothic text-gray-600">
            Are you sure you want to delete this product? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-row gap-3 mt-6 justify-center">
          <button
            onClick={onConfirm}
            disabled={loading}
            className="w-full font-gothic py-3 text-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-red-600 hover:bg-red-700 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-white transition-all duration-300"
          >
            {loading ? 'Deleting...' : 'DELETE'}
          </button>
          <DialogClose asChild>
            <button
              className="w-full font-gothic border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-300"
              disabled={loading}
            >
              CANCEL
            </button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function InventoryTab({ onSwitchToAddProduct }: InventoryTabProps) {
  const { filters, setPage, setPageSize } = useFiltersStore();
  const { data, isLoading, error } = useMyProducts(filters);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [statusFilter, setStatusFilter] = React.useState<'ACTIVE' | 'SOLD' | 'DRAFT'>('ACTIVE');

  const { data: selectedProductDetail } = useMyProductDetail(
    selectedProductId?.toString() || ''
  );

  const { mutateAsync: deleteProduct, isPending: isDeleting } = useDeleteProduct();

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

  // Filter out deleted products, then filter by status
  const visibleProducts = products
    .filter((product: Product) => product.status !== 'DELETED')
    .filter((product: Product) => product.status === statusFilter);

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

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handlePageChange = (page: number) => {
    setPage(page - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentPage = (data?.pagination?.currentPage ?? 0) + 1;
  const currentPageSize = parseInt(filters.size || '12');
  const totalPages = data?.pagination?.totalPages || 1;

  return (
    <div className="space-y-6">
      {/* Products Grid */}
      <Card variant="double" className="border-2 border-black">
        <CardHeader className="border-b-2 border-black bg-black text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CardTitle className="font-metal text-xl font-normal">MY INVENTORY</CardTitle>
              {totalProducts > 0 && (
                <Badge variant="outline" className="border-2 border-white text-white font-serif rounded-none">
                  {totalProducts} {totalProducts === 1 ? 'item' : 'items'}
                </Badge>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'ACTIVE' ? 'default' : 'outline'}
                className="font-gothic text-xs"
                onClick={() => setStatusFilter('ACTIVE')}
              >
                ACTIVE
              </Button>
              <Button
                variant={statusFilter === 'SOLD' ? 'default' : 'outline'}
                className="font-gothic text-xs"
                onClick={() => setStatusFilter('SOLD')}
              >
                SOLD
              </Button>
              <Button
                variant={statusFilter === 'DRAFT' ? 'default' : 'outline'}
                className="font-gothic text-xs"
                onClick={() => setStatusFilter('DRAFT')}
              >
                DRAFT
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {visibleProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="font-serif text-xl font-bold mb-2">No Products Yet</h3>
              <p className="text-gray-600 font-mono mb-6">Start building your inventory by adding your first product.</p>
              <Button 
                onClick={onSwitchToAddProduct}
                className="border-2 border-black bg-red-900 hover:bg-red-800 text-white"
              >
                Add Your First Product
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleProducts.map((product: Product) => (
                  <div key={product.productId} className="group relative bg-white/90 backdrop-blur-sm overflow-hidden border-2 border-black -mr-[2px] -mb-[2px]">

                  <div className="absolute top-0 right-0 z-10 px-3 py-1 bg-black text-white text-xs font-metal uppercase shadow-sm">
                    {product.condition}
                  </div>
                  
                  <div className={`absolute top-0 left-0 z-10 px-3 py-1 text-xs font-metal uppercase shadow-sm ${getStatusColor(product.status || 'INACTIVE')}`}>
                    {product.status || 'INACTIVE'}
                  </div>
                  
                  {/* Product Image - Clickable */}
                  <Link href={`/products/${product.slug}`}>
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
                    
                    <Link href={`/products/${product.slug}`}>
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
                        disabled={product.status === 'SOLD'}
                        title={product.status === 'SOLD' ? 'Sold products cannot be edited' : ''}
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-2 border-red-600 text-red-600 hover:bg-red-50 font-serif text-xs"
                        disabled={isDeleting || product.status === 'SOLD'}
                        onClick={() => handleDeleteClick(product)}
                        title={product.status === 'SOLD' ? 'Sold products cannot be deleted' : ''}
                      >
                        <Trash2 className="w-3 h-3" />
                        {isDeleting && productToDelete?.productId === product.productId ? 'Deleting...' : ''}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
                  Showing {visibleProducts.length} of {data?.pagination?.totalElements} products
                </div>
              </div>
            </div>
          </>
          )}
        </CardContent>
      </Card>

      {/* Update Product Modal */}
      <UpdateProductModal
        product={selectedProductDetail || null}
        isOpen={isUpdateModalOpen}
        onClose={handleCloseModal}
      />
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) setProductToDelete(null);
        }}
        loading={isDeleting}
        onConfirm={async () => {
          if (!productToDelete) return;
          try {
            await deleteProduct(productToDelete.productId);
            toast.success('Product deleted successfully!');
            setDeleteDialogOpen(false);
            setProductToDelete(null);
          } catch (error) {
            toast.error('Failed to delete product.');
          }
        }}
      />
    </div>
  );
} 