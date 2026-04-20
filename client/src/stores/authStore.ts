import { create } from 'zustand';

interface User {
  _id: string;
  email: string;
  name: string;
  role: 'customer' | 'seller' | 'admin';
  profile_picture_url?: string;
  token: string;
  refreshToken: string;
}

interface AuthState {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
  refreshToken: () => Promise<void>;
}

export const authStore = create<AuthState>((set) => ({
  user: null,
  login: (userData) => set({ user: userData }),
  logout: () => set({ user: null }),
  setUser: (user) => set({ user }),
  refreshToken: async () => {
    try {
      const res = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        set((state) => ({
          user: { ...state.user!, token: data.token },
        }));
      } else {
        set({ user: null });
      }
    } catch (err) {
      set({ user: null });
    }
  },
}));