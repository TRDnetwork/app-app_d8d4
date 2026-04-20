import { create } from 'zustand';

interface WishlistItem {
  product_id: string;
  name: string;
  price: number;
  image: string;
}

interface WishlistState {
  items: WishlistItem[];
  add: (item: WishlistItem) => void;
  remove: (product_id: string) => void;
  has: (product_id: string) => boolean;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],
  add: (item) => {
    if (!get().has(item.product_id)) {
      set({ items: [...get().items, item] });
    }
  },
  remove: (product_id) => set({ items: get().items.filter((i) => i.product_id !== product_id) }),
  has: (product_id) => get().items.some((i) => i.product_id === product_id),
}));