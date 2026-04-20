import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '../lib/api';

interface AuthState {
  user: any;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
  fetchMe: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: true,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const data = await apiClient('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
          });
          set({
            user: data.user,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            isAuthenticated: true,
          });
          toast({
            title: 'Logged in',
            description: `Welcome back, ${data.user.name}!`,
          });
        } catch (err) {
          set({ isLoading: false });
        }
      },

      register: async (name: string, email: string, password: string) => {
        set({ isLoading: true });
        try {
          const data = await apiClient('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password }),
          });
          set({
            user: data.user,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            isAuthenticated: true,
          });
          toast({
            title: 'Account created',
            description: 'Please verify your email.',
          });
        } catch (err) {
          set({ isLoading: false });
        }
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
        toast({
          title: 'Logged out',
          description: 'See you next time!',
        });
      },

      refresh: async () => {
        const { refreshToken } = get();
        if (!refreshToken) return;
        try {
          const data = await apiClient('/auth/refresh', {
            method: 'POST',
            body: JSON.stringify({ refreshToken }),
          });
          set({
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          });
        } catch (err) {
          get().logout();
        }
      },

      fetchMe: async () => {
        if (!get().accessToken) {
          set({ isLoading: false });
          return;
        }
        try {
          const data = await apiClient('/users/me');
          set({ user: data, isAuthenticated: true });
        } catch (err) {
          // Token invalid, try refresh
          try {
            await get().refresh();
          } catch (refreshErr) {
            get().logout();
          }
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { fetchMe } = useAuthStore();
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    fetchMe().finally(() => setIsReady(true));
  }, [fetchMe]);

  return <>{isReady ? children : <div>Loading...</div>}</>;
};