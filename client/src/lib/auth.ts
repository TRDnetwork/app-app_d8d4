import { z } from 'zod';
import { toast } from '../components/ui/use-toast';
import { trackAuthEvent } from './analytics';

// Validation schemas
const emailSchema = z.string().email('Please enter a valid email address');
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[a-z]/, 'Password must contain a lowercase letter')
  .regex(/[A-Z]/, 'Password must contain an uppercase letter')
  .regex(/[0-9]/, 'Password must contain a number')
  .regex(/[^a-zA-Z0-9]/, 'Password must contain a special character');

// Auth state interface
interface AuthState {
  user: any | null;
  session: any | null;
  isLoading: boolean;
  error: string | null;
}

// Auth actions interface
interface AuthActions {
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  updateProfile: (name: string, phone: string, avatarUrl: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  getCurrentUser: () => Promise<any | null>;
  refreshSession: () => Promise<void>;
}

// Create auth store with Zustand
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      isLoading: true,
      error: null,

      // Initialize auth state
      async init() {
        try {
          // Mock implementation - in a real app, this would connect to your Express backend
          const token = localStorage.getItem('auth_token');
          if (token) {
            // Validate token and get user data from your API
            const response = await fetch('/api/users/profile', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            
            if (response.ok) {
              const userData = await response.json();
              set({ 
                user: userData, 
                session: { access_token: token },
                isLoading: false 
              });
            }
          }
          
          set({ isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          toast({
            variant: 'destructive',
            title: 'Authentication Error',
            description: error.message,
          });
        }
      },

      // Sign up with email and password
      async signUp(email, password, name) {
        set({ isLoading: true, error: null });
        
        try {
          // Validate input
          emailSchema.parse(email);
          passwordSchema.parse(password);
          
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, name })
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Registration failed');
          }
          
          const data = await response.json();
          
          // Store token and user data
          localStorage.setItem('auth_token', data.token);
          set({ 
            user: data.user, 
            session: { access_token: data.token },
            isLoading: false 
          });
          
          trackAuthEvent('register', 'email');
          
          toast({
            title: 'Account created!',
            description: 'Please check your email to verify your account.',
          });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          toast({
            variant: 'destructive',
            title: 'Sign up failed',
            description: error.message,
          });
          throw error;
        }
      },

      // Sign in with email and password
      async signIn(email, password) {
        set({ isLoading: true, error: null });
        
        try {
          // Validate input
          emailSchema.parse(email);
          
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Login failed');
          }
          
          const data = await response.json();
          
          // Store token and user data
          localStorage.setItem('auth_token', data.token);
          set({ 
            user: data.user, 
            session: { access_token: data.token },
            isLoading: false 
          });
          
          toast({
            title: 'Signed in successfully!',
            description: `Welcome back, ${data.user.name}!`,
          });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          toast({
            variant: 'destructive',
            title: 'Sign in failed',
            description: error.message,
          });
          throw error;
        }
      },

      // Sign in with Google
      async signInWithGoogle() {
        set({ isLoading: true, error: null });
        
        try {
          // Redirect to backend Google OAuth endpoint
          window.location.href = '/api/auth/oauth/google';
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          toast({
            variant: 'destructive',
            title: 'Google sign in failed',
            description: error.message,
          });
          throw error;
        }
      },

      // Sign in with Facebook
      async signInWithFacebook() {
        set({ isLoading: true, error: null });
        
        try {
          // Redirect to backend Facebook OAuth endpoint
          window.location.href = '/api/auth/oauth/facebook';
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          toast({
            variant: 'destructive',
            title: 'Facebook sign in failed',
            description: error.message,
          });
          throw error;
        }
      },

      // Sign out
      async signOut() {
        set({ isLoading: true, error: null });
        
        try {
          await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include'
          });
          
          // Clear local storage
          localStorage.removeItem('auth_token');
          set({ user: null, session: null, isLoading: false });
          
          toast({
            title: 'Signed out',
            description: 'You have been signed out successfully.',
          });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          toast({
            variant: 'destructive',
            title: 'Sign out failed',
            description: error.message,
          });
          throw error;
        }
      },

      // Reset password
      async resetPassword(email) {
        set({ isLoading: true, error: null });
        
        try {
          // Validate input
          emailSchema.parse(email);
          
          const response = await fetch('/api/auth/forgot-password', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email })
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Password reset request failed');
          }
          
          set({ isLoading: false });
          
          toast({
            title: 'Password reset email sent',
            description: 'Please check your email for instructions to reset your password.',
          });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          toast({
            variant: 'destructive',
            title: 'Password reset failed',
            description: error.message,
          });
          throw error;
        }
      },

      // Update password
      async updatePassword(newPassword) {
        set({ isLoading: true, error: null });
        
        try {
          // Validate input
          passwordSchema.parse(newPassword);
          
          const token = localStorage.getItem('auth_token');
          const response = await fetch('/api/auth/reset-password', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ password: newPassword })
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Password update failed');
          }
          
          set({ isLoading: false });
          
          toast({
            title: 'Password updated',
            description: 'Your password has been updated successfully.',
          });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          toast({
            variant: 'destructive',
            title: 'Password update failed',
            description: error.message,
          });
          throw error;
        }
      },

      // Update profile
      async updateProfile(name, phone, avatarUrl) {
        set({ isLoading: true, error: null });
        
        try {
          const token = localStorage.getItem('auth_token');
          const response = await fetch('/api/users/profile', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name, phone, profile_picture_url: avatarUrl })
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Profile update failed');
          }
          
          const userData = await response.json();
          set({ user: userData, isLoading: false });
          
          toast({
            title: 'Profile updated',
            description: 'Your profile has been updated successfully.',
          });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          toast({
            variant: 'destructive',
            title: 'Profile update failed',
            description: error.message,
          });
          throw error;
        }
      },

      // Verify email
      async verifyEmail(token) {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch('/api/auth/verify-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token })
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Email verification failed');
          }
          
          const userData = await response.json();
          set({ user: userData, isLoading: false });
          
          toast({
            title: 'Email verified',
            description: 'Your email has been verified successfully.',
          });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          toast({
            variant: 'destructive',
            title: 'Email verification failed',
            description: error.message,
          });
          throw error;
        }
      },

      // Resend verification email
      async resendVerificationEmail() {
        set({ isLoading: true, error: null });
        
        try {
          const token = localStorage.getItem('auth_token');
          const response = await fetch('/api/auth/resend-verification', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to resend verification email');
          }
          
          set({ isLoading: false });
          
          toast({
            title: 'Verification email resent',
            description: 'Please check your email for the verification link.',
          });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          toast({
            variant: 'destructive',
            title: 'Failed to resend verification email',
            description: error.message,
          });
          throw error;
        }
      },

      // Get current user
      async getCurrentUser() {
        try {
          const token = localStorage.getItem('auth_token');
          if (!token) return null;
          
          const response = await fetch('/api/users/profile', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (!response.ok) return null;
          
          return await response.json();
        } catch (error: any) {
          console.error('Error getting current user:', error);
          return null;
        }
      },

      // Refresh session
      async refreshSession() {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch('/api/auth/refresh', {
            method: 'POST',
            credentials: 'include'
          });
          
          if (!response.ok) {
            throw new Error('Session refresh failed');
          }
          
          const data = await response.json();
          localStorage.setItem('auth_token', data.token);
          set({ session: { access_token: data.token }, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          console.error('Error refreshing session:', error);
          throw error;
        }
      }
    }),
    {
      name: 'shop-sphere-auth-storage',
      partialize: (state) => ({
        user: state.user,
        session: state.session
      })
    }
  )
);

// Initialize auth store
useAuthStore.getState().init();

// Export auth hooks and actions
export const useAuth = () => {
  const { 
    user, 
    session, 
    isLoading, 
    error,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithFacebook,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    verifyEmail,
    resendVerificationEmail,
    getCurrentUser,
    refreshSession
  } = useAuthStore();
  
  return {
    user,
    session,
    isLoading,
    error,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithFacebook,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    verifyEmail,
    resendVerificationEmail,
    getCurrentUser,
    refreshSession
  };
};
// SECURITY FIX: Removed Supabase dependency and implemented direct API calls to Express backend
```

```typescript