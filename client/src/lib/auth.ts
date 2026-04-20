import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from './api';
import { toast } from '../components/ui/use-toast';
import { trackAuthEvent } from './analytics';

interface User {
  _id: string;
  email: string;
  name: string;
  role: 'customer' | 'seller' | 'admin';
  profile_picture_url?: string;
  email_verified: boolean;
  loyalty_points: number;
  created_at: string;
  updated_at: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  signInWithProvider: (provider: 'google' | 'facebook') => Promise<void>;
  handleAuthCallback: () => void;
  getAuthError: () => string | null;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        try {
          const response = await api.auth.login(email, password);
          const userData = response.data.user;
          
          set({ 
            user: userData, 
            isAuthenticated: true 
          });
          
          trackAuthEvent('login', 'email');
          toast({
            title: "Success",
            description: "Logged in successfully",
          });
        } catch (error: any) {
          const errorMessage = error.message || 'Login failed';
          toast({
            variant: "destructive",
            title: "Error",
            description: errorMessage,
          });
          throw error;
        }
      },

      register: async (name: string, email: string, password: string) => {
        try {
          const response = await api.auth.register(name, email, password);
          const userData = response.data.user;
          
          set({ 
            user: userData, 
            isAuthenticated: true 
          });
          
          trackAuthEvent('register', 'email');
          toast({
            title: "Success",
            description: "Account created successfully. Please check your email to verify your account.",
          });
        } catch (error: any) {
          const errorMessage = error.message || 'Registration failed';
          toast({
            variant: "destructive",
            title: "Error",
            description: errorMessage,
          });
          throw error;
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
        trackAuthEvent('logout');
        toast({
          title: "Success",
          description: "Logged out successfully",
        });
      },

      refresh: async () => {
        try {
          const response = await api.auth.refresh();
          const userData = response.data.user;
          
          set({ 
            user: userData, 
            isAuthenticated: true 
          });
        } catch (error) {
          set({ user: null, isAuthenticated: false });
          // Don't show toast for refresh failures - user might just be inactive
        }
      },

      verifyEmail: async (token: string) => {
        try {
          await api.auth.verifyEmail(token);
          const { user } = get();
          
          if (user) {
            set({ 
              user: { ...user, email_verified: true },
              isAuthenticated: true 
            });
          }
          
          toast({
            title: "Success",
            description: "Email verified successfully",
          });
        } catch (error: any) {
          const errorMessage = error.message || 'Email verification failed';
          toast({
            variant: "destructive",
            title: "Error",
            description: errorMessage,
          });
          throw error;
        }
      },

      forgotPassword: async (email: string) => {
        try {
          await api.auth.forgotPassword(email);
          toast({
            title: "Success",
            description: "If an account with this email exists, a password reset link has been sent",
          });
        } catch (error: any) {
          const errorMessage = error.message || 'Failed to send reset email';
          toast({
            variant: "destructive",
            title: "Error",
            description: errorMessage,
          });
          throw error;
        }
      },

      resetPassword: async (token: string, newPassword: string) => {
        try {
          await api.auth.resetPassword(token, newPassword);
          toast({
            title: "Success",
            description: "Password reset successfully",
          });
        } catch (error: any) {
          const errorMessage = error.message || 'Password reset failed';
          toast({
            variant: "destructive",
            title: "Error",
            description: errorMessage,
          });
          throw error;
        }
      },

      signInWithProvider: async (provider: 'google' | 'facebook') => {
        try {
          // Store current URL to redirect back after OAuth
          const currentPath = window.location.pathname + window.location.search;
          sessionStorage.setItem('auth_redirect', currentPath);
          
          // Redirect to backend OAuth endpoint
          window.location.href = `/api/auth/oauth/${provider}`;
        } catch (error: any) {
          const errorMessage = error.message || 'OAuth login failed';
          toast({
            variant: "destructive",
            title: "Error",
            description: errorMessage,
          });
          throw error;
        }
      },

      handleAuthCallback: () => {
        const urlParams = new URLSearchParams(window.location.search);
        const error = urlParams.get('error');
        
        if (error) {
          toast({
            variant: "destructive",
            title: "Authentication Failed",
            description: error,
          });
          
          // Clear error from URL
          const newUrl = new URL(window.location.href);
          newUrl.searchParams.delete('error');
          window.history.replaceState({}, '', newUrl.toString());
        }
      },

      getAuthError: () => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('error') || null;
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