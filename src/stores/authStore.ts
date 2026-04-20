import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { apiClient } from '../lib/api';

interface User {
  _id: string;
  email: string;
  name: string;
  role: 'customer' | 'seller' | 'admin';
  profile_picture_url?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      refresh().catch(() => {
        localStorage.removeItem('authToken');
        setUser(null);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const refresh = async () => {
    try {
      const data = await apiClient('/auth/refresh', { method: 'POST' });
      localStorage.setItem('authToken', data.token);
      setUser(data.user);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const data = await apiClient('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem('authToken', data.token);
    setUser(data.user);
  };

  const register = async (email: string, password: string, name: string) => {
    const data = await apiClient('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
    localStorage.setItem('authToken', data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};