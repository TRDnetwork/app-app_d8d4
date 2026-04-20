import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { AuthUser, AuthService } from '@/lib/supabase';

// Define the shape of our auth context
interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signUp: (data: { email: string; password: string; name: string }) => Promise<{ error: string | null }>;
  signIn: (data: { email: string; password: string }) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  signInWithFacebook: () => Promise<{ error: string | null }>;
  sendMagicLink: (email: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<{ error: string | null }>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  updateUserProfile: (data: Partial<Omit<AuthUser, 'id' | 'email' | 'role' | 'email_verified'>>) => Promise<{ error: string | null }>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get the current session on mount
    const initializeAuth = async () => {
      const { user, error } = await AuthService.getCurrentUser();
      
      if (error) {
        console.error('Auth error:', error);
      }
      
      setUser(user);
      setLoading(false);
    };

    initializeAuth();

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        const { user, error } = await AuthService.getCurrentUser();
        
        if (error) {
          console.error('Auth error:', error);
        }
        
        setUser(user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    // Cleanup listener on unmount
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Sign up function
  const signUp = async (data: { email: string; password: string; name: string }) => {
    const result = await AuthService.signUp(data);
    
    if (result.user) {
      setUser(result.user);
    }
    
    return result;
  };

  // Sign in function
  const signIn = async (data: { email: string; password: string }) => {
    const result = await AuthService.signIn(data);
    
    if (result.user) {
      setUser(result.user);
    }
    
    return result;
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    return await AuthService.signInWithGoogle();
  };

  // Sign in with Facebook
  const signInWithFacebook = async () => {
    return await AuthService.signInWithFacebook();
  };

  // Send magic link
  const sendMagicLink = async (email: string) => {
    return await AuthService.sendMagicLink(email);
  };

  // Sign out function
  const signOut = async () => {
    const result = await AuthService.signOut();
    
    if (!result.error) {
      setUser(null);
    }
    
    return result;
  };

  // Reset password
  const resetPassword = async (email: string) => {
    return await AuthService.resetPassword({ email });
  };

  // Update user profile
  const updateUserProfile = async (data: Partial<Omit<AuthUser, 'id' | 'email' | 'role' | 'email_verified'>>) => {
    if (!user) {
      return { error: 'No user logged in' };
    }

    const result = await AuthService.updateUserProfile(user.id, data);
    
    if (!result.error) {
      // Update local user state
      setUser({
        ...user,
        ...data,
      });
    }
    
    return result;
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithFacebook,
    sendMagicLink,
    signOut,
    resetPassword,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
```

```typescript