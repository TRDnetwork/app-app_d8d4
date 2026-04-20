import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../lib/api';

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
  total: number;
  fetchCart: () => Promise<void>;
  addToCart: (product_id: string, variant_id?: string, quantity?: number) => Promise<void>;
  updateQuantity: (item_id: string, quantity: number) => Promise<void>;
  removeFromCart: (item_id: string) => Promise<void>;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      fetchCart: async () => {
        try {
          const res = await api.get('/cart');
          const cart = res.data;
          const items = cart.items.map((item: any) => ({
            _id: item._id,
            product_id: item.product_id,
            variant_id: item.variant_id,
            quantity: item.quantity,
            price: item.price_snapshot,
            title: item.product_title,
            image: item.product_image,
          }));
          const total = items.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0);
          set({ items, total });
        } catch (error) {
          console.error('Failed to fetch cart:', error);
        }
      },
      addToCart: async (product_id, variant_id, quantity = 1) => {
        try {
          await api.post('/cart/items', { product_id, variant_id, quantity });
          await get().fetchCart();
        } catch (error) {
          console.error('Failed to add to cart:', error);
        }
      },
      updateQuantity: async (item_id, quantity) => {
        if (quantity <= 0) {
          await get().removeFromCart(item_id);
          return;
        }
        try {
          await api.put(`/cart/items/${item_id}`, { quantity });
          await get().fetchCart();
        } catch (error) {
          console.error('Failed to update quantity:', error);
        }
      },
      removeFromCart: async (item_id) => {
        try {
          await api.delete(`/cart/items/${item_id}`);
          await get().fetchCart();
        } catch (error) {
          console.error('Failed to remove from cart:', error);
        }
      },
      clearCart: () => set({ items: [], total: 0 }),
    }),
    {
      name: 'cart-storage',
    }
  )
);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { fetchCart } = useCartStore();
  useEffect(() => {
    fetchCart();
  }, []);
  return <>{children}</>;
};