import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { apiClient } from '../lib/api';

interface CartItem {
  _id: string;
  product_id: string;
  variant_id: string;
  quantity: number;
  price_snapshot: number;
  title: string;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  total: number;
  loading: boolean;
  addItem: (productId: string, variantId: string, quantity: number) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  fetchCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const data = await apiClient('/cart');
      setItems(data.items);
      setTotal(data.items.reduce((sum: number, item: CartItem) => sum + item.price_snapshot * item.quantity, 0));
    } catch (err) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addItem = async (productId: string, variantId: string, quantity: number) => {
    await apiClient('/cart/items', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, variant_id: variantId, quantity }),
    });
    await fetchCart();
  };

  const updateItem = async (itemId: string, quantity: number) => {
    if (quantity === 0) {
      await removeItem(itemId);
      return;
    }
    await apiClient(`/cart/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
    await fetchCart();
  };

  const removeItem = async (itemId: string) => {
    await apiClient(`/cart/items/${itemId}`, { method: 'DELETE' });
    await fetchCart();
  };

  return (
    <CartContext.Provider value={{ items, total, loading, addItem, updateItem, removeItem, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};