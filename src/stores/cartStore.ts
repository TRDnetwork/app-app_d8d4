import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../types';

interface CartItem {
  product: Product;
  variant_id?: string;
  quantity: number;
  price: number;
}

interface CartState {
  items: CartItem[];
  couponCode: string | null;
  discount: number;
  add: (product: Product, variant_id?: string, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  applyCoupon: (code: string, discount: number) => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const cartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,
      discount: 0,
      add: (product, variant_id, quantity = 1) => {
        const currentItems = get().items;
        const existing = currentItems.find(
          (item) => item.product._id === product._id && item.variant_id === variant_id
        );

        if (existing) {
          set({
            items: currentItems.map((item) =>
              item.product._id === product._id && item.variant_id === variant_id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({
            items: [
              ...currentItems,
              {
                product,
                variant_id,
                quantity,
                price: product.price,
              },
            ],
          });
        }
      },
      updateQuantity: (productId, quantity) =>
        set({
          items: get().items.map((item) =>
            item.product._id === productId ? { ...item, quantity } : item
          ),
        }),
      remove: (productId) =>
        set({
          items: get().items.filter((item) => item.product._id !== productId),
        }),
      clear: () => set({ items: [], couponCode: null, discount: 0 }),
      applyCoupon: (code, discount) => set({ couponCode: code, discount }),
      getTotal: () => {
        const { items, discount } = get();
        const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        return subtotal - discount;
      },
      getItemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    {
      name: 'cart-storage',
    }
  )
);