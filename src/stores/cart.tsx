import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '../lib/api';

interface CartItem {
  _id: string;
  product_id: string;
  variant_id?: string;
  quantity: number;
  price: number;
  title: string;
  image: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, '_id'>) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  loadCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        set((state) => {
          const existing = state.items.find((i) => i.product_id === item.product_id && i.variant_id === item.variant_id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product_id === item.product_id && i.variant_id === item.variant_id
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, { ...item, _id: crypto.randomUUID() }] };
        });
      },
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) return;
        set((state) => ({
          items: state.items.map((i) => (i._id === id ? { ...i, quantity } : i)),
        }));
      },
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i._id !== id),
        })),
      clearCart: () => set({ items: [] }),
      getTotalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
      getTotalPrice: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      loadCart: async () => {
        try {
          const data = await apiClient('/cart');
          set({ items: data.items });
        } catch (err) {
          console.error('Failed to load cart from server');
        }
      },
    }),
    {
      name: 'shopSphere-cart',
    }
  )
);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { loadCart } = useCartStore();
  useEffect(() => {
    loadCart();
  }, []);
  return <>{children}</>;
};