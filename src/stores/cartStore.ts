import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../types';

interface CartItem {
  product: Product;
  variantId?: string;
  quantity: number;
  price: number;
}

interface CartState {
  items: CartItem[];
  couponCode: string | null;
  discount: number;
  add: (product: Product, variantId?: string, quantity?: number) => void;
  update: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  applyCoupon: (code: string, discount: number) => void;
  subtotal: () => number;
  total: () => number;
}

export const cartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,
      discount: 0,
      add: (product, variantId, quantity = 1) => {
        const current = get().items.find((i) => i.product._id === product._id && i.variantId === variantId);
        if (current) {
          set({
            items: get().items.map((i) =>
              i.product._id === product._id && i.variantId === variantId
                ? { ...i, quantity: i.quantity + quantity }
                : i
            ),
          });
        } else {
          set({
            items: [...get().items, { product, variantId, quantity, price: product.price }],
          });
        }
      },
      update: (productId, quantity) => {
        if (quantity === 0) {
          get().remove(productId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.product._id === productId ? { ...i, quantity } : i
          ),
        });
      },
      remove: (productId) => {
        set({
          items: get().items.filter((i) => i.product._id !== productId),
        });
      },
      clear: () => set({ items: [], couponCode: null, discount: 0 }),
      applyCoupon: (code, discount) => set({ couponCode: code, discount }),
      subtotal: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      total: () => get().subtotal() - get().discount,
    }),
    {
      name: 'cart-storage',
    }
  )
);