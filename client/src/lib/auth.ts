import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { api } from './api';

interface User {
  _id: string;
  email: string;
  name: string;
  role: 'customer' | 'seller' | 'admin';
  profilePictureUrl?: string;
  phone?: string;
  emailVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: