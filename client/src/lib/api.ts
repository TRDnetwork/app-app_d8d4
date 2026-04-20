```ts
import { config } from '../../server/src/config/env';

// Client-side API configuration
// Note: Only public keys should be exposed here
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

// Validate required client environment variables
if (!STRIPE_PUBLIC_KEY?.startsWith('pk_')) {
  console.error('❌ Missing or invalid VITE_STRIPE_PUBLIC_KEY. Check your .env file.');
}

if (!API_BASE_URL) {
  console.error('❌ Missing VITE_API_URL. Check your .env file.');
}

// Use httpOnly cookies for authentication instead of localStorage
// This prevents XSS attacks from stealing tokens
// Server should set: Set-Cookie: token=...; HttpOnly; Secure; SameSite=Strict

const api = {
  get: async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      credentials: 'include', // Include cookies for authentication
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Request failed');
    }
    
    return response.json();
  },

  post: async <T>(endpoint: string, data: any): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Request failed');
    }
    
    return response.json();
  },

  put: async <T>(endpoint: string, data: any): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Request failed');
    }
    
    return response.json();
  },

  delete: async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Request failed');
    }
    
    return response.json();
  },
};

export { api, API_BASE_URL, STRIPE_PUBLIC_KEY };
```