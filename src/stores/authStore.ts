import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: { id: string; email: string; name: string; role: string } | null;
  token: string | null;
  login: (userData: { user: any; token: string }) => void;
  logout: () => void;
  updateProfile: (data: { name?: string; profile_picture_url?: string }) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: (userData) =>
        set({
          user: userData.user,
          token: userData.token,
        }),
      logout: () => set({ user: null, token: null }),
      updateProfile: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),
    }),
    {
      name: 'auth-storage',
    }
  )
);