import { toast } from '@/components/ui/use-toast';

const API_BASE = '/api';

export const apiClient = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      toast({
        title: 'Error',
        description: error.message || 'Something went wrong',
        variant: 'destructive',
      });
      throw new Error(error.message || 'Request failed');
    }
    return await response.json();
  } catch (err) {
    if (err instanceof Error) {
      toast({
        title: 'Network Error',
        description: err.message,
        variant: 'destructive',
      });
    }
    throw err;
  }
};