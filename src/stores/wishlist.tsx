import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '../lib/api';

interface WishlistState {
  productIds: string[];
  toggle: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  loadWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      productIds: [],
      toggle: (productId) => {
        set((state) => {
          if (state.productIds.includes(productId)) {
            return { productIds: state.productIds.filter((id) => id !== productId) };
          } else {
            return { productIds: [...state.productIds, productId] };
          }
        });
      },
      isInWishlist: (productId) => get().productIds.includes(productId),
      loadWishlist: async () => {
        try {
          const data = await apiClient('/wishlist');
          set({ productIds: data.product_ids });
        } catch (err) {
          console.error('Failed to load wishlist from server');
        }
      },
    }),
    {
      name: 'shopSphere-wishlist',
    }
  )
);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const { loadWishlist } = useWishlistStore();
  useEffect(() => {
    loadWishlist();
  }, []);
  return <>{children}</>;
};