import { authStore } from '../stores/authStore';

const API_BASE_URL = import.meta.env.VITE_API_URL;

interface ApiOptions extends RequestInit {
  requiresAuth?: boolean;
}

export const api = {
  get: async <T>(endpoint: string, options: ApiOptions = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    };

    if (options.requiresAuth) {
      const token = authStore.getState().user?.token;
      if (token) {
        config.headers = {
          ...config.headers,
          'Authorization': `Bearer ${token}`,
        };
      }
    }

    const response = await fetch(url, config);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json() as Promise<T>;
  },

  post: async <T>(endpoint: string, data: any, options: ApiOptions = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      ...options,
    };

    if (options.requiresAuth) {
      const token = authStore.getState().user?.token;
      if (token) {
        config.headers = {
          ...config.headers,
          'Authorization': `Bearer ${token}`,
        };
      }
    }

    const response = await fetch(url, config);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json() as Promise<T>;
  },

  put: async <T>(endpoint: string, data: any, options: ApiOptions = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      ...options,
    };

    if (options.requiresAuth) {
      const token = authStore.getState().user?.token;
      if (token) {
        config.headers = {
          ...config.headers,
          'Authorization': `Bearer ${token}`,
        };
      }
    }

    const response = await fetch(url, config);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json() as Promise<T>;
  },

  delete: async <T>(endpoint: string, options: ApiOptions = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    };

    if (options.requiresAuth) {
      const token = authStore.getState().user?.token;
      if (token) {
        config.headers = {
          ...config.headers,
          'Authorization': `Bearer ${token}`,
        };
      }
    }

    const response = await fetch(url, config);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json() as Promise<T>;
  },
};