import { authStore } from '../stores/authStore';

const API_BASE = '/api';

const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  const token = authStore.getState().user?.token;
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    authStore.getState().logout();
    window.location.href = '/login';
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Something went wrong');
  }

  return res.json();
};

export default fetchWithAuth;