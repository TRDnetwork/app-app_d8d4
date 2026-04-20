import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../types';

interface WishlistState {
  items: Product[];
  add: (product: Product) => void;
  remove: (productId: string) => void;
  has: (productId: string) => boolean;
}

export const wishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (product) =>
        set({
          items: [...get().items, product],
        }),
      remove: (productId) =>
        set({
          items: get().items.filter((p) => p._id !== productId),
        }),
      has: (productId) => get().items.some((p) => p._id === productId),
    }),
    {
      name: 'wishlist-storage',
    }
  )
);