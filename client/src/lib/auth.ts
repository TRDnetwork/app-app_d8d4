import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from './api';

// Define user interface
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'customer' | 'seller' | 'admin';
  emailVerified: boolean;
  profilePictureUrl?: string;
  phone?: string;
  loyaltyPoints: number;
}

// Define auth state
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  resendVerificationEmail: (email: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  getCurrentUser: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  clearError: () => void;
}

// Create auth store with persistence
export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.auth.login(email, password);
          set({ 
            user: response.data.user, 
            isAuthenticated: true,
            isLoading: false 
          });
        } catch (error: any) {
          set({ 
            error: error.message || 'Login failed', 
            isLoading: false 
          });
          throw error;
        }
      },

      register: async (name: string, email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.auth.register(name, email, password);
          set({ 
            user: response.data.user, 
            isAuthenticated: true,
            isLoading: false 
          });
        } catch (error: any) {
          set({ 
            error: error.message || 'Registration failed', 
            isLoading: false 
          });
          throw error;
        }
      },

      logout: () => {
        api.auth.logout();
        set({ 
          user: null, 
          isAuthenticated: false,
          error: null 
        });
      },

      refresh: async () => {
        try {
          const response = await api.auth.refresh();
          // Update access token in API client
          // This would be handled by the API client
        } catch (error: any) {
          set({ 
            error: error.message || 'Token refresh failed',
            user: null,
            isAuthenticated: false
          });
          throw error;
        }
      },

      verifyEmail: async (token: string) => {
        set({ isLoading: true, error: null });
        try {
          await api.auth.verifyEmail(token);
          // Update user state
          await get().getCurrentUser();
          set({ isLoading: false });
        } catch (error: any) {
          set({ 
            error: error.message || 'Email verification failed', 
            isLoading: false 
          });
          throw error;
        }
      },

      resendVerificationEmail: async (email: string) => {
        set({ isLoading: true, error: null });
        try {
          await api.auth.resendVerificationEmail(email);
          set({ isLoading: false });
        } catch (error: any) {
          set({ 
            error: error.message || 'Failed to send verification email', 
            isLoading: false 
          });
          throw error;
        }
      },

      forgotPassword: async (email: string) => {
        set({ isLoading: true, error: null });
        try {
          await api.auth.forgotPassword(email);
          set({ isLoading: false });
        } catch (error: any) {
          set({ 
            error: error.message || 'Password reset request failed', 
            isLoading: false 
          });
          throw error;
        }
      },

      resetPassword: async (token: string, newPassword: string) => {
        set({ isLoading: true, error: null });
        try {
          await api.auth.resetPassword(token, newPassword);
          set({ isLoading: false });
        } catch (error: any) {
          set({ 
            error: error.message || 'Password reset failed', 
            isLoading: false 
          });
          throw error;
        }
      },

      getCurrentUser: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.auth.me();
          set({ 
            user: response.data.user, 
            isAuthenticated: true,
            isLoading: false 
          });
        } catch (error: any) {
          set({ 
            error: error.message || 'Failed to get user information', 
            isLoading: false,
            isAuthenticated: false,
            user: null
          });
          throw error;
        }
      },

      updateProfile: async (data: Partial<User>) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.auth.updateProfile(data);
          set({ 
            user: response.data.user,
            isLoading: false 
          });
        } catch (error: any) {
          set({ 
            error: error.message || 'Profile update failed', 
            isLoading: false 
          });
          throw error;
        }
      },

      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);
```

```typescript