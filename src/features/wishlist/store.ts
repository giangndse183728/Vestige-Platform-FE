import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '@/features/products/schema';

interface WishlistState {
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  isProductInWishlist: (productId: number) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      wishlist: [],
      addToWishlist: (product) => {
        if (!get().isProductInWishlist(product.productId)) {
          set((state) => ({
            wishlist: [...state.wishlist, product],
          }));
        }
      },
      removeFromWishlist: (productId) =>
        set((state) => ({
          wishlist: state.wishlist.filter((p) => p.productId !== productId),
        })),
      isProductInWishlist: (productId) =>
        get().wishlist.some((p) => p.productId === productId),
    }),
    {
      name: 'wishlist-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
); 