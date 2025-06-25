import { useState } from 'react';
import {
  deleteProductByAdmin,
  updateProductByAdmin,
  updateProductImagesByAdmin,
  getAllProductStatuses,
} from '../services';

export function useAdminProductActions() {
  // GET ALL PRODUCTS (ADMIN)
  const [allProducts, setAllProducts] = useState<any[] | null>(null);
  const [allProductsLoading, setAllProductsLoading] = useState(false);
  const [allProductsError, setAllProductsError] = useState<string | null>(null);

  const fetchAllProducts = async (filters?: any) => {
    setAllProductsLoading(true);
    setAllProductsError(null);
    try {
      // Nếu service getAllProductStatuses nhận params, truyền filters vào
      const data = await getAllProductStatuses(filters);
      setAllProducts(data.content || []);
      return data;
    } catch (err: any) {
      setAllProductsError(err?.message || 'Failed to fetch products');
      throw err;
    } finally {
      setAllProductsLoading(false);
    }
  };

  // DELETE
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const deleteProduct = async (id: number) => {
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      await deleteProductByAdmin(id);
    } catch (err: any) {
      setDeleteError(err?.message || 'Failed to delete product');
      throw err;
    } finally {
      setDeleteLoading(false);
    }
  };

  // UPDATE
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const updateProduct = async (id: number, data: any) => {
    setUpdateLoading(true);
    setUpdateError(null);
    try {
      await updateProductByAdmin(id, data);
    } catch (err: any) {
      setUpdateError(err?.message || 'Failed to update product');
      throw err;
    } finally {
      setUpdateLoading(false);
    }
  };

  // UPDATE IMAGES
  const [imagesLoading, setImagesLoading] = useState(false);
  const [imagesError, setImagesError] = useState<string | null>(null);
  const updateProductImages = async (id: number, images: any) => {
    setImagesLoading(true);
    setImagesError(null);
    try {
      await updateProductImagesByAdmin(id, images);
    } catch (err: any) {
      setImagesError(err?.message || 'Failed to update product images');
      throw err;
    } finally {
      setImagesLoading(false);
    }
  };

  return {
    // All products (admin)
    allProducts,
    allProductsLoading,
    allProductsError,
    fetchAllProducts,
    // Delete
    deleteProduct,
    deleteLoading,
    deleteError,
    // Update
    updateProduct,
    updateLoading,
    updateError,
    // Update Images
    updateProductImages,
    imagesLoading,
    imagesError,
  };
} 