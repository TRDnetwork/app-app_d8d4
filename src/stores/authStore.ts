import { create } from 'zustand';

interface User {
  _id: string;
  email: string;
  name: string;
  role: 'customer' | 'seller' | 'admin';
  profile_picture_url?: string;
  token: string;
}

interface AuthState {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
}

export const authStore = create<AuthState>((set) => ({
  user: null,
  login: (userData) => set({ user: userData }),
  logout: () => set({ user: null }),
  setUser: (user) => set({ user }),
}));