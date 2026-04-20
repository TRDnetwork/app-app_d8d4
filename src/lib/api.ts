import { authStore } from '../stores/authStore';

const API_BASE = '/api';

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = authStore.getState().user?.token;
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Something went wrong');
  }

  return response.json();
};

export default fetchWithAuth;