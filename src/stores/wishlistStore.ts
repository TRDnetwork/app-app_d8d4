import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../types';

interface WishlistState {
  items: Product[];
  add: (product: Product) => void;
  remove: (productId: string) => void;
  toggle: (product: Product) => void;
  has: (productId: string) => boolean;
}

export const wishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (product) =>
        set((state) => ({
          items: state.items.some((p) => p._id === product._id)
            ? state.items
            : [...state.items, product],
        })),
      remove: (productId) =>
        set((state) => ({
          items: state.items.filter((p) => p._id !== productId),
        })),
      toggle: (product) => {
        const state = get();
        if (state.has(product._id)) {
          state.remove(product._id);
        } else {
          state.add(product);
        }
      },
      has: (productId) => get().items.some((p) => p._id === productId),
    }),
    {
      name: 'wishlist-storage',
    }
  )
);