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

  const response = await fetch(url, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    toast({
      variant: 'destructive',
      title: 'Error',
      description: error.message || 'Something went wrong',
    });
    throw new Error(error.message || 'Request failed');
  }

  return response.json();
};