import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import fetchWithAuth from '../lib/api';

interface WishlistItem {
  product_id: string;
  added_at: string;
}

interface WishlistState {
  items: WishlistItem[];
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
}

export const wishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: async (productId) => {
        const { items } = get();
        if (items.some(i => i.product_id === productId)) return;
        const newItems = [...items, { product_id: productId, added_at: new Date().toISOString() }];
        set({ items: newItems });
        await fetchWithAuth(`/api/wishlist/${productId}`, { method: 'POST' });
      },
      removeItem: async (productId) => {
        const items = get().items.filter(i => i.product_id !== productId);
        set({ items });
        await fetchWithAuth(`/api/wishlist/${productId}`, { method: 'DELETE' });
      },
    }),
    {
      name: 'wishlist-storage',
    }
  )
);