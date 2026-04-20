import { supabase } from './supabase';
import { User, Session } from '@supabase/supabase-js';
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
  user: User | null;
  session: Session | null;
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
  getCurrentUser: () => Promise<User | null>;
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
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (error) {
            throw error;
          }
          
          set({ session, user: session?.user || null, isLoading: false });
          
          // Listen for auth changes
          const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
              set({ session, user: session?.user || null, isLoading: false });
              
              // Track auth events
              if (event === 'SIGNED_IN') {
                trackAuthEvent('login', session?.user?.app_metadata?.provider || 'email');
              } else if (event === 'SIGNED_OUT') {
                trackAuthEvent('logout');
              }
            }
          );
          
          return () => {
            subscription.unsubscribe();
          };
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
          
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                name,
                email_verified: false,
                role: 'customer',
                loyalty_points: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              },
              emailRedirectTo: `${window.location.origin}/verify-email`
            }
          });
          
          if (error) {
            throw error;
          }
          
          set({ user: data.user, session: data.session, isLoading: false });
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
          
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
          });
          
          if (error) {
            throw error;
          }
          
          set({ user: data.user, session: data.session, isLoading: false });
          
          toast({
            title: 'Signed in successfully!',
            description: `Welcome back, ${data.user.user_metadata.name}!`,
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
          const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: `${window.location.origin}/auth/callback`,
              queryParams: {
                access_type: 'offline',
                prompt: 'consent'
              }
            }
          });
          
          if (error) {
            throw error;
          }
          
          trackAuthEvent('login', 'google');
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
          const { error } = await supabase.auth.signInWithOAuth({
            provider: 'facebook',
            options: {
              redirectTo: `${window.location.origin}/auth/callback`
            }
          });
          
          if (error) {
            throw error;
          }
          
          trackAuthEvent('login', 'facebook');
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
          const { error } = await supabase.auth.signOut();
          
          if (error) {
            throw error;
          }
          
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
          
          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`
          });
          
          if (error) {
            throw error;
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
          
          const { error } = await supabase.auth.updateUser({
            password: newPassword
          });
          
          if (error) {
            throw error;
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
          const { data, error } = await supabase.auth.updateUser({
            data: {
              name,
              phone,
              avatar_url: avatarUrl,
              updated_at: new Date().toISOString()
            }
          });
          
          if (error) {
            throw error;
          }
          
          set({ user: data.user, isLoading: false });
          
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
          const { error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'email'
          });
          
          if (error) {
            throw error;
          }
          
          const { data: { user } } = await supabase.auth.getUser();
          
          set({ user, isLoading: false });
          
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
          const { data: { user } } = await supabase.auth.getUser();
          
          if (!user) {
            throw new Error('No user found');
          }
          
          const { error } = await supabase.auth.resend({
            type: 'signup',
            email: user.email!,
            options: {
              emailRedirectTo: `${window.location.origin}/verify-email`
            }
          });
          
          if (error) {
            throw error;
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
          const { data: { user }, error } = await supabase.auth.getUser();
          
          if (error) {
            throw error;
          }
          
          return user;
        } catch (error: any) {
          console.error('Error getting current user:', error);
          return null;
        }
      },

      // Refresh session
      async refreshSession() {
        set({ isLoading: true, error: null });
        
        try {
          const { data, error } = await supabase.auth.refreshSession();
          
          if (error) {
            throw error;
          }
          
          set({ session: data.session, user: data.session?.user || null, isLoading: false });
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
```

```typescript
// SECURITY FIX: Use environment variables for rate limiting