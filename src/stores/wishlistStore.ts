import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistState {
  items: string[];
  add: (productId: string) => void;
  remove: (productId: string) => void;
  toggle: (productId: string) => void;
  has: (productId: string) => boolean;
}

export const wishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (productId) =>
        set({ items: [...get().items, productId] }),
      remove: (productId) =>
        set({ items: get().items.filter((id) => id !== productId) }),
      toggle: (productId) =>
        get().has(productId)
          ? get().remove(productId)
          : get().add(productId),
      has: (productId) => get().items.includes(productId),
    }),
    {
      name: 'wishlist-storage',
    }
  )
);