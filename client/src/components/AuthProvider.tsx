```tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'customer' | 'seller' | 'admin';
  profilePictureUrl?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for token in cookies (httpOnly) - this would be handled by the backend
    // For now, we'll rely on the backend setting the token in cookies
    // and making authenticated requests that return user data
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me', {
          credentials: 'include' // Include cookies in the request
        });
        
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setToken(data.token); // Token would come from Authorization header
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include' // Include cookies in the request
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message);
    }

    const data = await res.json();
    
    // Store token and user
    setToken(data.token);
    setUser(data.user);
    
    router.push('/dashboard');
  };

  const logout = () => {
    // Clear token and user
    setToken(null);
    setUser(null);
    
    // Call backend to clear refresh token cookie
    fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include' // Include cookies in the request
    });
    
    router.push('/');
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
      credentials: 'include' // Include cookies in the request
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message);
    }

    // After registration, automatically log in
    await login(email, password);
  };

  const forgotPassword = async (email: string) => {
    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
      credentials: 'include' // Include cookies in the request
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message);
    }
  };

  const resetPassword = async (token: string, password: string) => {
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, password }),
      credentials: 'include' // Include cookies in the request
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message);
    }
  };

  const verifyEmail = async (token: string) => {
    const res = await fetch('/api/auth/verify-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
      credentials: 'include' // Include cookies in the request
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message);
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    register,
    forgotPassword,
    resetPassword,
    verifyEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```