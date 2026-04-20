import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '../lib/api';

interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  coupon: string | null;
  discount: number;
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  applyCoupon: (code: string) => Promise<void>;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      itemCount: 0,
      coupon: null,
      discount: 0,
      isLoading: false,

      fetchCart: async () => {
        set({ isLoading: true });
        try {
          const data = await apiClient('/cart');
          const items = data.items.map((item: any) => ({
            id: item._id,
            productId: item.product_id,
            name: item.product_title,
            price: item.price_snapshot,
            image: item.product_image,
            quantity: item.quantity,
          }));
          set({ items, itemCount: items.reduce((acc: number, item: CartItem) => acc + item.quantity, 0) });
          get().recalculateTotal();
        } catch (err) {
          // Anonymous cart fallback
          const saved = localStorage.getItem('cart');
          if (saved) {
            const items = JSON.parse(saved);
            set({ items, itemCount: items.reduce((acc: number, item: CartItem) => acc + item.quantity, 0) });
            get().recalculateTotal();
          }
        } finally {
          set({ isLoading: false });
        }
      },

      addToCart: (item) => {
        const { items } = get();
        const existing = items.find((i) => i.productId === item.productId && i.variantId === item.variantId);
        if (existing) {
          get().updateQuantity(existing.id, existing.quantity + item.quantity);
        } else {
          const newItem = { ...item, id: Date.now().toString() };
          set({ items: [...items, newItem] });
          get().recalculateTotal();
          localStorage.setItem('cart', JSON.stringify([...items, newItem]));
        }
        toast({
          title: 'Added to cart',
          description: `${item.name} added.`,
        });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(id);
          return;
        }
        const { items } = get();
        const newItems = items.map((item) =>
          item.id === id ? { ...item, quantity } : item
        );
        set({ items: newItems, itemCount: newItems.reduce((acc, item) => acc + item.quantity, 0) });
        get().recalculateTotal();
        localStorage.setItem('cart', JSON.stringify(newItems));
      },

      removeFromCart: (id) => {
        const { items } = get();
        const newItems = items.filter((item) => item.id !== id);
        set({ items: newItems, itemCount: newItems.reduce((acc, item) => acc + item.quantity, 0) });
        get().recalculateTotal();
        localStorage.setItem('cart', JSON.stringify(newItems));
        toast({
          title: 'Removed from cart',
          description: 'Item removed.',
          variant: 'default',
        });
      },

      applyCoupon: async (code) => {
        try {
          await apiClient('/cart/apply-coupon', {
            method: 'POST',
            body: JSON.stringify({ code }),
          });
          set({ coupon: code, discount: 10 }); // Mock discount
          get().recalculateTotal();
          toast({
            title: 'Coupon applied',
            description: `Discount applied: $${get().discount.toFixed(2)}`,
          });
        } catch (err) {
          toast({
            title: 'Invalid coupon',
            description: 'Please try another code.',
            variant: 'destructive',
          });
        }
      },

      clearCart: () => {
        set({ items: [], total: 0, itemCount: 0, coupon: null, discount: 0 });
        localStorage.removeItem('cart');
      },

      recalculateTotal: () => {
        const { items, discount } = get();
        const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0) - discount;
        set({ total });
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items }), // Only persist items
    }
  )
);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { fetchCart } = useCartStore();
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    fetchCart().finally(() => setIsReady(true));
  }, [fetchCart]);

  return <>{isReady ? children : <div>Loading cart...</div>}</>;
};