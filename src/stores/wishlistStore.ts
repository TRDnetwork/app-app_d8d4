import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistItem {
  productId: string;
  addedAt: number;
}

interface WishlistState {
  items: WishlistItem[];
  has: (productId: string) => boolean;
  add: (productId: string) => void;
  remove: (productId: string) => void;
  toggle: (productId: string) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      has: (productId) => get().items.some((item) => item.productId === productId),
      add: (productId) =>
        set((state) => ({
          items: [{ productId, addedAt: Date.now() }, ...state.items],
        })),
      remove: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        })),
      toggle: (productId) => {
        const has = get().has(productId);
        if (has) get().remove(productId);
        else get().add(productId);
      },
    }),
    {
      name: 'wishlist-storage',
    }
  )
);