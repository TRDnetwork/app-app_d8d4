import React, { createContext, useContext, useEffect, useState } from 'react';
import { authStore } from '../stores/authStore';
import analytics from './analytics';
import { ANALYTICS_EVENTS } from './analyticsEvents';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        authStore.getState().setUser({ token });
        // Identify the user in analytics
        const user = authStore.getState().user;
        if (user) {
          analytics.identifyUser(user.id, {
            email: user.email,
            role: user.role,
          });
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!authStore.getState().user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);