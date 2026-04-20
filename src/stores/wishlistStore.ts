import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '../lib/api';

interface WishlistState {
  productIds: string[];
  isLoading: boolean;
  fetchWishlist: () => Promise<void>;
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      productIds: [],
      isLoading: false,

      fetchWishlist: async () => {
        set({ isLoading: true });
        try {
          const data = await apiClient('/wishlist');
          set({ productIds: data.product_ids });
        } catch (err) {
          const saved = localStorage.getItem('wishlist');
          if (saved) {
            set({ productIds: JSON.parse(saved) });
          }
        } finally {
          set({ isLoading: false });
        }
      },

      addToWishlist: async (productId) => {
        try {
          await apiClient(`/wishlist/${productId}`, { method: 'POST' });
          set((state) => {
            const newIds = [...state.productIds, productId];
            localStorage.setItem('wishlist', JSON.stringify(newIds));
            return { productIds: newIds };
          });
          toast({
            title: 'Added to wishlist',
            description: 'Product saved for later.',
          });
        } catch (err) {
          set((state) => {
            const newIds = [...state.productIds, productId];
            localStorage.setItem('wishlist', JSON.stringify(newIds));
            return { productIds: newIds };
          });
        }
      },

      removeFromWishlist: async (productId) => {
        try {
          await apiClient(`/wishlist/${productId}`, { method: 'DELETE' });
          set((state) => {
            const newIds = state.productIds.filter((id) => id !== productId);
            localStorage.setItem('wishlist', JSON.stringify(newIds));
            return { productIds: newIds };
          });
          toast({
            title: 'Removed from wishlist',
            description: 'Product removed.',
          });
        } catch (err) {
          set((state) => {
            const newIds = state.productIds.filter((id) => id !== productId);
            localStorage.setItem('wishlist', JSON.stringify(newIds));
            return { productIds: newIds };
          });
        }
      },

      toggleWishlist: (productId) => {
        const { productIds } = get();
        if (productIds.includes(productId)) {
          get().removeFromWishlist(productId);
        } else {
          get().addToWishlist(productId);
        }
      },

      isInWishlist: (productId) => {
        return get().productIds.includes(productId);
      },
    }),
    {
      name: 'wishlist-storage',
    }
  )
);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { fetchWishlist } = useWishlistStore();
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    fetchWishlist().finally(() => setIsReady(true));
  }, [fetchWishlist]);

  return <>{isReady ? children : <div>Loading wishlist...</div>}</>;
};