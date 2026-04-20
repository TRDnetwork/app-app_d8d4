import { useAuthStore } from '../stores/authStore';
import { toast } from '@/components/ui/use-toast';

// Initialize auth state on app load
export const initializeAuth = async () => {
  // No Supabase initialization - using custom JWT auth
  const token = localStorage.getItem('accessToken');
  if (token) {
    // Verify token is still valid
    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        useAuthStore.getState().setUser(userData.user);
      } else {
        // Token is invalid, clear it
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }
};

// Email/password authentication
export const signUp = async (email: string, password: string, name: string) => {
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    const data = await response.json();
    
    // Store tokens securely
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    
    useAuthStore.getState().setUser(data.user);
    
    toast({
      title: "Welcome!",
      description: `Account created successfully`,
    });
    
    return data;
  } catch (err) {
    toast({
      variant: "destructive",
      title: "Registration failed",
      description: err instanceof Error ? err.message : 'Unknown error',
    });
    throw err;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const data = await response.json();
    
    // Store tokens securely
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    
    useAuthStore.getState().setUser(data.user);
    
    toast({
      title: "Welcome back!",
      description: `Signed in as ${data.user.name || data.user.email}`,
    });
    
    return data;
  } catch (err) {
    toast({
      variant: "destructive",
      title: "Login failed",
      description: err instanceof Error ? err.message : 'Unknown error',
    });
    throw err;
  }
};

// OAuth authentication
export const signInWithProvider = async (provider: 'google' | 'facebook') => {
  try {
    // Redirect to backend OAuth endpoint
    window.location.href = `/api/auth/oauth/${provider}`;
  } catch (error) {
    toast({
      variant: "destructive",
      title: "Authentication failed",
      description: error instanceof Error ? error.message : 'Unknown error',
    });
    throw error;
  }
};

// Password recovery
export const forgotPassword = async (email: string) => {
  try {
    const response = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Password reset request failed');
    }

    toast({
      title: "Check your email",
      description: "We've sent you a password reset link. Please check your inbox.",
    });
  } catch (error) {
    toast({
      variant: "destructive",
      title: "Password reset failed",
      description: error instanceof Error ? error.message : 'Unknown error',
    });
    throw error;
  }
};

export const resetPassword = async (token: string, newPassword: string) => {
  try {
    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, newPassword }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Password reset failed');
    }

    toast({
      title: "Password updated",
      description: "Your password has been successfully updated.",
    });

    return await response.json();
  } catch (error) {
    toast({
      variant: "destructive",
      title: "Password reset failed",
      description: error instanceof Error ? error.message : 'Unknown error',
    });
    throw error;
  }
};

// Email verification
export const verifyEmail = async (token: string) => {
  try {
    const response = await fetch('/api/auth/verify-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Email verification failed');
    }

    toast({
      title: "Email verified",
      description: "Your email has been successfully verified.",
    });
  } catch (error) {
    toast({
      variant: "destructive",
      title: "Email verification failed",
      description: error instanceof Error ? error.message : 'Unknown error',
    });
    throw error;
  }
};

// Sign out
export const signOut = async () => {
  try {
    // Call backend logout endpoint to invalidate refresh token
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });

    // Clear local storage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    useAuthStore.getState().setUser(null);
    
    toast({
      title: "Signed out",
      description: "You have been signed out successfully",
    });
  } catch (error) {
    console.error('Logout failed:', error);
    // Still clear local storage even if backend call fails
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    useAuthStore.getState().setUser(null);
  }
};

// Get current user session
export const getSession = async () => {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) return null;
  
  try {
    const response = await fetch('/api/auth/session', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error('Error getting session:', error);
  }
  
  return null;
};

// Update user profile
export const updateProfile = async (updates: { 
  name?: string; 
  phone?: string; 
  avatar_url?: string 
}) => {
  try {
    const response = await fetch('/api/users/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Profile update failed');
    }

    const data = await response.json();
    
    // Update local state
    const currentUser = useAuthStore.getState().user;
    if (currentUser) {
      useAuthStore.getState().setUser({
        ...currentUser,
        ...data.user,
      });
    }

    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated.",
    });

    return data;
  } catch (error) {
    toast({
      variant: "destructive",
      title: "Profile update failed",
      description: error instanceof Error ? error.message : 'Unknown error',
    });
    throw error;
  }
};

// Check auth status
export const checkAuthStatus = async () => {
  return !!localStorage.getItem('accessToken');
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
  
  // Check for OAuth success parameters
  const accessToken = params.get('access_token');
  const refreshToken = params.get('refresh_token');
  
  if (accessToken && refreshToken) {
    // Store tokens
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    
    // Clear URL parameters
    window.history.replaceState({}, document.title, window.location.pathname);
    
    // Redirect to home or previous page
    window.location.href = '/';
  }
};

// Resend verification email
export const resendVerificationEmail = async (email: string) => {
  try {
    const response = await fetch('/api/auth/resend-verification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to resend verification email');
    }

    toast({
      title: "Verification email sent",
      description: "We've sent a new verification link to your email address.",
    });
  } catch (error) {
    toast({
      variant: "destructive",
      title: "Failed to resend verification email",
      description: error instanceof Error ? error.message : 'Unknown error',
    });
    throw error;
  }
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