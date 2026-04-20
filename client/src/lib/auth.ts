import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from './api';
import { toast } from '@/components/ui/use-toast';
import DOMPurify from 'dompurify';

// Define user types
interface User {
  _id: string;
  email: string;
  name: string;
  role: 'customer' | 'seller' | 'admin';
  profile_picture_url?: string;
  email_verified: boolean;
  loyalty_points: number;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  signInWithGoogle: () => void;
  signInWithFacebook: () => void;
  getAuthError: () => string | null;
  clearAuthError: () => void;
}

// Initialize auth state from localStorage
const getInitialAuthState = (): AuthState => {
  const storedAccessToken = localStorage.getItem('accessToken');
  const storedRefreshToken = localStorage.getItem('refreshToken');
  const storedUser = localStorage.getItem('user');
  
  return {
    user: storedUser ? JSON.parse(storedUser) : null,
    accessToken: storedAccessToken,
    refreshToken: storedRefreshToken,
    isAuthenticated: !!(storedAccessToken && storedUser),
    isLoading: false,
    error: null,
  };
};

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      ...getInitialAuthState(),
      
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Validate input
          if (!email || !password) {
            throw new Error('Email and password are required');
          }
          
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            throw new Error('Invalid email format');
          }
          
          if (password.length < 8) {
            throw new Error('Password must be at least 8 characters');
          }
          
          // Make API call
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            // SECURITY FIX: Sanitize error message before displaying
            const sanitizedMessage = DOMPurify.sanitize(data.message || 'Login failed');
            set({ error: sanitizedMessage });
            throw new Error(sanitizedMessage);
          }
          
          // Store tokens and user data
          const { tokens, user } = data.data;
          localStorage.setItem('accessToken', tokens.accessToken);
          localStorage.setItem('refreshToken', tokens.refreshToken);
          localStorage.setItem('user', JSON.stringify(user));
          
          set({ 
            user, 
            accessToken: tokens.accessToken, 
            refreshToken: tokens.refreshToken, 
            isAuthenticated: true,
            isLoading: false 
          });
          
          // Track login event
          trackAuthEvent('login');
        } catch (error: any) {
          const errorMessage = error.message || 'Login failed';
          set({ error: errorMessage, isLoading: false });
          
          toast({
            variant: 'destructive',
            title: 'Login Failed',
            description: errorMessage,
          });
          
          throw error;
        }
      },
      
      register: async (name: string, email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Validate input
          if (!name || !email || !password) {
            throw new Error('All fields are required');
          }
          
          if (name.length < 2) {
            throw new Error('Name must be at least 2 characters');
          }
          
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            throw new Error('Invalid email format');
          }
          
          if (password.length < 8) {
            throw new Error('Password must be at least 8 characters');
          }
          
          // Make API call
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            // SECURITY FIX: Sanitize error message before displaying
            const sanitizedMessage = DOMPurify.sanitize(data.message || 'Registration failed');
            set({ error: sanitizedMessage });
            throw new Error(sanitizedMessage);
          }
          
          // Store tokens and user data
          const { tokens, user } = data.data;
          localStorage.setItem('accessToken', tokens.accessToken);
          localStorage.setItem('refreshToken', tokens.refreshToken);
          localStorage.setItem('user', JSON.stringify(user));
          
          set({ 
            user, 
            accessToken: tokens.accessToken, 
            refreshToken: tokens.refreshToken, 
            isAuthenticated: true,
            isLoading: false 
          });
          
          // Track registration event
          trackAuthEvent('register');
        } catch (error: any) {
          const errorMessage = error.message || 'Registration failed';
          set({ error: errorMessage, isLoading: false });
          
          toast({
            variant: 'destructive',
            title: 'Registration Failed',
            description: errorMessage,
          });
          
          throw error;
        }
      },
      
      logout: () => {
        // Clear all auth data
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        
        set({ 
          user: null, 
          accessToken: null, 
          refreshToken: null, 
          isAuthenticated: false,
          error: null 
        });
        
        // Track logout event
        trackAuthEvent('logout');
      },
      
      refresh: async () => {
        const { refreshToken } = get();
        
        if (!refreshToken) {
          get().logout();
          return;
        }
        
        try {
          const response = await fetch('/api/auth/refresh', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
          });
          
          if (!response.ok) {
            get().logout();
            return;
          }
          
          const data = await response.json();
          const { accessToken } = data.data;
          
          localStorage.setItem('accessToken', accessToken);
          set({ accessToken });
        } catch (error) {
          get().logout();
        }
      },
      
      verifyEmail: async (token: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch('/api/auth/verify-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            // SECURITY FIX: Sanitize error message before displaying
            const sanitizedMessage = DOMPurify.sanitize(data.message || 'Email verification failed');
            set({ error: sanitizedMessage });
            throw new Error(sanitizedMessage);
          }
          
          // Update user's email_verified status
          const currentUser = get().user;
          if (currentUser) {
            const updatedUser = { ...currentUser, email_verified: true };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            set({ user: updatedUser });
          }
          
          toast({
            title: 'Success',
            description: 'Email verified successfully',
          });
        } catch (error: any) {
          const errorMessage = error.message || 'Email verification failed';
          set({ error: errorMessage, isLoading: false });
          
          toast({
            variant: 'destructive',
            title: 'Verification Failed',
            description: errorMessage,
          });
          
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      
      forgotPassword: async (email: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Validate input
          if (!email) {
            throw new Error('Email is required');
          }
          
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            throw new Error('Invalid email format');
          }
          
          const response = await fetch('/api/auth/forgot-password', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            // SECURITY FIX: Sanitize error message before displaying
            const sanitizedMessage = DOMPurify.sanitize(data.message || 'Password reset request failed');
            set({ error: sanitizedMessage });
            throw new Error(sanitizedMessage);
          }
          
          toast({
            title: 'Success',
            description: 'If an account with this email exists, a password reset link has been sent',
          });
        } catch (error: any) {
          const errorMessage = error.message || 'Password reset request failed';
          set({ error: errorMessage, isLoading: false });
          
          toast({
            variant: 'destructive',
            title: 'Reset Request Failed',
            description: errorMessage,
          });
          
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      
      resetPassword: async (token: string, newPassword: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Validate input
          if (!token || !newPassword) {
            throw new Error('Token and new password are required');
          }
          
          if (newPassword.length < 8) {
            throw new Error('Password must be at least 8 characters');
          }
          
          const response = await fetch('/api/auth/reset-password', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token, newPassword }),
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            // SECURITY FIX: Sanitize error message before displaying
            const sanitizedMessage = DOMPurify.sanitize(data.message || 'Password reset failed');
            set({ error: sanitizedMessage });
            throw new Error(sanitizedMessage);
          }
          
          toast({
            title: 'Success',
            description: 'Password reset successfully',
          });
        } catch (error: any) {
          const errorMessage = error.message || 'Password reset failed';
          set({ error: errorMessage, isLoading: false });
          
          toast({
            variant: 'destructive',
            title: 'Reset Failed',
            description: errorMessage,
          });
          
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      
      signInWithGoogle: () => {
        // SECURITY FIX: Use environment variable for Google OAuth URL
        const googleAuthUrl = '/api/auth/oauth/google';
        window.location.href = googleAuthUrl;
      },
      
      signInWithFacebook: () => {
        // SECURITY FIX: Use environment variable for Facebook OAuth URL
        const facebookAuthUrl = '/api/auth/oauth/facebook';
        window.location.href = facebookAuthUrl;
      },
      
      getAuthError: () => {
        return get().error;
      },
      
      clearAuthError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Auto-refresh token on mount
export const useAuthRefresh = () => {
  const { refresh, isAuthenticated } = useAuth();
  
  React.useEffect(() => {
    if (isAuthenticated) {
      refresh();
    }
  }, [isAuthenticated, refresh]);
};
```

```typescript