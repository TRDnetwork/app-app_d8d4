import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../lib/api';

interface WishlistState {
  productIds: string[];
  fetchWishlist: () => Promise<void>;
  toggleWishlist: (productId: string) => Promise<void>;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      productIds: [],
      fetchWishlist: async () => {
        try {
          const res = await api.get('/wishlist');
          set({ productIds: res.data.product_ids });
        } catch (error) {
          console.error('Failed to fetch wishlist:', error);
        }
      },
      toggleWishlist: async (productId: string) => {
        const { productIds } = get();
        const isWishlisted = productIds.includes(productId);
        try {
          if (isWishlisted) {
            await api.delete(`/wishlist/${productId}`);
            set({ productIds: productIds.filter(id => id !== productId) });
          } else {
            await api.post(`/wishlist/${productId}`);
            set({ productIds: [...productIds, productId] });
          }
        } catch (error) {
          console.error('Failed to update wishlist:', error);
        }
      },
    }),
    {
      name: 'wishlist-storage',
    }
  )
);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const { fetchWishlist } = useWishlistStore();
  useEffect(() => {
    fetchWishlist();
  }, []);
  return <>{children}</>;
};