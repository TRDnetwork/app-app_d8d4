import { createClient } from '@supabase/supabase-js';
import { useAuthStore } from '../stores/authStore';
import { toast } from '@/components/ui/use-toast';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth provider configuration
const authProviders = ['google', 'facebook'] as const;
type AuthProvider = typeof authProviders[number];

interface AuthError {
  message: string;
  status: number;
}

interface AuthResponse {
  data: {
    user: any;
    session: any;
  } | null;
  error: AuthError | null;
}

// Initialize auth state on app load
export const initializeAuth = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session) {
    useAuthStore.getState().setUser({
      _id: session.user.id,
      email: session.user.email || '',
      name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || '',
      role: session.user.user_metadata?.role || 'customer',
      profile_picture_url: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture,
      token: session.access_token,
    });
  }

  // Listen for auth changes
  supabase.auth.onAuthStateChange((event, session) => {
    handleAuthChange(event, session);
  });
};

// Handle auth state changes
const handleAuthChange = async (event: string, session: any) => {
  if (event === 'SIGNED_IN' && session) {
    const userData = {
      _id: session.user.id,
      email: session.user.email || '',
      name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || '',
      role: session.user.user_metadata?.role || 'customer',
      profile_picture_url: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture,
      token: session.access_token,
    };
    
    useAuthStore.getState().setUser(userData);
    
    toast({
      title: "Welcome back!",
      description: `Signed in as ${userData.name || userData.email}`,
    });
  } else if (event === 'SIGNED_OUT') {
    useAuthStore.getState().setUser(null);
    toast({
      title: "Signed out",
      description: "You have been signed out successfully",
    });
  }
};

// Email/password authentication
export const signUp = async (email: string, password: string, name: string) => {
  const { data, error }: AuthResponse = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
        role: 'customer'
      },
      emailRedirectTo: `${window.location.origin}/auth/callback`
    }
  });

  if (error) {
    toast({
      variant: "destructive",
      title: "Sign up failed",
      description: error.message,
    });
    throw error;
  }

  if (data.user) {
    // Check if email confirmation is required
    if (data.user.identities?.length === 0) {
      toast({
        title: "Check your email",
        description: "We've sent you a confirmation link. Please check your inbox.",
      });
    } else {
      // User is already confirmed (e.g., OAuth)
      useAuthStore.getState().setUser({
        _id: data.user.id,
        email: data.user.email || '',
        name: name,
        role: 'customer',
        token: data.session?.access_token || '',
      });
    }
  }

  return data;
};

export const signIn = async (email: string, password: string) => {
  const { data, error }: AuthResponse = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    toast({
      variant: "destructive",
      title: "Sign in failed",
      description: error.message,
    });
    throw error;
  }

  if (data.user) {
    useAuthStore.getState().setUser({
      _id: data.user.id,
      email: data.user.email || '',
      name: data.user.user_metadata?.full_name || '',
      role: data.user.user_metadata?.role || 'customer',
      profile_picture_url: data.user.user_metadata?.avatar_url,
      token: data.session?.access_token || '',
    });
  }

  return data;
};

// OAuth authentication
export const signInWithProvider = async (provider: AuthProvider) => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent'
      }
    }
  });

  if (error) {
    toast({
      variant: "destructive",
      title: "Authentication failed",
      description: error.message,
    });
    throw error;
  }
};

// Password recovery
export const forgotPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  if (error) {
    toast({
      variant: "destructive",
      title: "Password reset failed",
      description: error.message,
    });
    throw error;
  }

  toast({
    title: "Check your email",
    description: "We've sent you a password reset link. Please check your inbox.",
  });
};

export const resetPassword = async (newPassword: string) => {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword
  });

  if (error) {
    toast({
      variant: "destructive",
      title: "Password reset failed",
      description: error.message,
    });
    throw error;
  }

  toast({
    title: "Password updated",
    description: "Your password has been successfully updated.",
  });

  return data;
};

// Email verification
export const verifyEmail = async (token: string) => {
  const { error } = await supabase.auth.verifyOtp({
    token_hash: token,
    type: 'email'
  });

  if (error) {
    toast({
      variant: "destructive",
      title: "Email verification failed",
      description: error.message,
    });
    throw error;
  }

  toast({
    title: "Email verified",
    description: "Your email has been successfully verified.",
  });
};

// Sign out
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    toast({
      variant: "destructive",
      title: "Sign out failed",
      description: error.message,
    });
    throw error;
  }
};

// Get current user session
export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('Error getting session:', error);
    return null;
  }
  
  return data.session;
};

// Update user profile
export const updateProfile = async (updates: { 
  name?: string; 
  phone?: string; 
  avatar_url?: string 
}) => {
  const { data, error } = await supabase.auth.updateUser({
    data: {
      full_name: updates.name,
      phone: updates.phone,
      avatar_url: updates.avatar_url
    }
  });

  if (error) {
    toast({
      variant: "destructive",
      title: "Profile update failed",
      description: error.message,
    });
    throw error;
  }

  // Update local state
  const currentUser = useAuthStore.getState().user;
  if (currentUser) {
    useAuthStore.getState().setUser({
      ...currentUser,
      name: updates.name || currentUser.name,
      profile_picture_url: updates.avatar_url || currentUser.profile_picture_url
    });
  }

  toast({
    title: "Profile updated",
    description: "Your profile has been successfully updated.",
  });

  return data;
};

// Check auth status
export const checkAuthStatus = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session !== null;
};

// Get auth error from URL (for OAuth callbacks)
export const getAuthError = () => {
  const params = new URLSearchParams(window.location.search);
  const error = params.get('error');
  const errorDescription = params.get('error_description');
  
  if (error) {
    return {
      error,
      error_description: errorDescription
    };
  }
  
  return null;
};

// Handle OAuth callback
export const handleAuthCallback = async () => {
  const params = new URLSearchParams(window.location.search);
  const error = params.get('error');
  
  if (error) {
    const errorDescription = params.get('error_description');
    toast({
      variant: "destructive",
      title: "Authentication failed",
      description: errorDescription || "An error occurred during authentication",
    });
    return;
  }
  
  // Clear URL parameters
  window.history.replaceState({}, document.title, window.location.pathname);
};

// Resend verification email
export const resendVerificationEmail = async (email: string) => {
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`
    }
  });

  if (error) {
    toast({
      variant: "destructive",
      title: "Failed to resend verification email",
      description: error.message,
    });
    throw error;
  }

  toast({
    title: "Verification email sent",
    description: "We've sent a new verification link to your email address.",
  });
};

// Auth context for React components
export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  
  return {
    user,
    isAuthenticated: !!user,
    signUp,
    signIn,
    signInWithProvider,
    signOut,
    forgotPassword,
    resetPassword,
    verifyEmail,
    updateProfile,
    checkAuthStatus,
    getAuthError,
    handleAuthCallback,
    resendVerificationEmail
  };
};

// Initialize auth on module load
initializeAuth().catch(console.error);
```

```typescript