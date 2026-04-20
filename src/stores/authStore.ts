import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  refresh: (token: string, refreshToken: string) => void;
}

export const authStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: (userData) => set({ user: userData }),
      logout: () => set({ user: null }),
      refresh: (token, refreshToken) =>
        set((state) => ({
          user: state.user ? { ...state.user, token, refreshToken } : null,
        })),
    }),
    {
      name: 'auth-storage',
    }
  )
);