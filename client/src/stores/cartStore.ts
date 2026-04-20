import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import fetchWithAuth from '../lib/api';

interface CartItem {
  product_id: string;
  variant_id?: string;
  quantity: number;
  price_snapshot: number;
  title: string;
  image: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'price_snapshot'> & { price: number }) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => Promise<void>;
  subtotal: number;
  discount: number;
  total: number;
  couponCode: string | null;
}

export const cartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,
      subtotal: 0,
      discount: 0,
      total: 0,

      addItem: async (item) => {
        const { items } = get();
        const existing = items.find(i => i.product_id === item.product_id && i.variant_id === item.variant_id);
        const newItems = existing
          ? items.map(i => i.product_id === item.product_id ? { ...i, quantity: i.quantity + item.quantity } : i)
          : [...items, { ...item, price_snapshot: item.price }];

        set({ items: newItems });
        await fetchWithAuth('/api/cart/items', {
          method: 'POST',
          body: JSON.stringify({ product_id: item.product_id, variant_id: item.variant_id, quantity: item.quantity }),
        });
      },

      updateQuantity: async (productId, quantity) => {
        if (quantity === 0) {
          get().removeItem(productId);
          return;
        }
        const items = get().items.map(i => i.product_id === productId ? { ...i, quantity } : i);
        set({ items });
        await fetchWithAuth(`/api/cart/items/${productId}`, {
          method: 'PUT',
          body: JSON.stringify({ quantity }),
        });
      },

      removeItem: async (productId) => {
        const items = get().items.filter(i => i.product_id !== productId);
        set({ items });
        await fetchWithAuth(`/api/cart/items/${productId}`, { method: 'DELETE' });
      },

      clearCart: () => set({ items: [], subtotal: 0, discount: 0, total: 0, couponCode: null }),

      applyCoupon: async (code) => {
        try {
          const res = await fetchWithAuth('/api/cart/apply-coupon', {
            method: 'POST',
            body: JSON.stringify({ code }),
          });
          set({ couponCode: code, discount: res.discount });
        } catch (err) {
          console.error(err);
        }
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);