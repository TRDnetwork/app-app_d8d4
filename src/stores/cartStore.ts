import { create } from 'zustand';

interface CartItem {
  id: string;
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variant?: string;
}

interface CartState {
  items: CartItem[];
  coupon: string | null;
  discount: number;
  add: (item: Omit<CartItem, 'id'>) => void;
  update: (id: string, quantity: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  applyCoupon: (code: string, discount: number) => void;
  total: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  coupon: null,
  discount: 0,
  add: (item) => {
    const current = get().items.find((i) => i.product_id === item.product_id && i.variant === item.variant);
    if (current) {
      set({
        items: get().items.map((i) =>
          i.product_id === item.product_id && i.variant === item.variant
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        ),
      });
    } else {
      set({ items: [...get().items, { ...item, id: crypto.randomUUID() }] });
    }
  },
  update: (id, quantity) => {
    if (quantity <= 0) {
      get().remove(id);
      return;
    }
    set({
      items: get().items.map((i) => (i.id === id ? { ...i, quantity } : i)),
    });
  },
  remove: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
  clear: () => set({ items: [], coupon: null, discount: 0 }),
  applyCoupon: (code, discount) => set({ coupon: code, discount }),
  total: () => {
    const { items, discount } = get();
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0) - discount;
  },
}));