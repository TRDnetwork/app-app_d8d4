import { toast } from '@/components/ui/use-toast';

const API_BASE = '/api';

const fetchJson = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('auth_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
  });

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

export const api = {
  auth: {
    login: (email: string, password: string) =>
      fetchJson('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    register: (name: string, email: string, password: string) =>
      fetchJson('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      }),
    me: () => fetchJson('/auth/me'),
    logout: () => fetchJson('/auth/logout', { method: 'POST' }),
  },
  products: {
    list: (filters: Record<string, any> = {}) =>
      fetchJson('/products', { method: 'GET' }),
    getById: (id: string) =>
      fetchJson(`/products/${id}`),
    getReviews: (id: string, page = 1, limit = 10) =>
      fetchJson(`/products/${id}/reviews?page=${page}&limit=${limit}`),
    addReview: (productId: string, review: { rating: number; title: string; comment: string }) =>
      fetchJson(`/products/${productId}/reviews`, {
        method: 'POST',
        body: JSON.stringify(review),
      }),
    getQuestions: (id: string) =>
      fetchJson(`/products/${id}/questions`),
    askQuestion: (productId: string, question: string) =>
      fetchJson(`/products/${id}/questions`, {
        method: 'POST',
        body: JSON.stringify({ question }),
      }),
  },
  cart: {
    get: () => fetchJson('/cart'),
    addItem: (productId: string, variantId?: string, quantity = 1) =>
      fetchJson('/cart/items', {
        method: 'POST',
        body: JSON.stringify({ productId, variantId, quantity }),
      }),
    updateItem: (productId: string, quantity: number) =>
      fetchJson(`/cart/items/${productId}`, {
        method: 'PATCH',
        body: JSON.stringify({ quantity }),
      }),
    removeItem: (productId: string) =>
      fetchJson(`/cart/items/${productId}`, { method: 'DELETE' }),
  },
  user: {
    getProfile: () => fetchJson('/users/profile'),
    updateProfile: (data: any) =>
      fetchJson('/users/profile', {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    getAddresses: () => fetchJson('/users/addresses'),
    addAddress: (address: any) =>
      fetchJson('/users/addresses', {
        method: 'POST',
        body: JSON.stringify(address),
      }),
    deleteAddress: (id: string) =>
      fetchJson(`/users/addresses/${id}`, { method: 'DELETE' }),
    getWishlist: () => fetchJson('/users/wishlist'),
    addToWishlist: (productId: string) =>
      fetchJson('/users/wishlist', {
        method: 'POST',
        body: JSON.stringify({ productId }),
      }),
    removeFromWishlist: (productId: string) =>
      fetchJson(`/users/wishlist/${productId}`, { method: 'DELETE' }),
  },
  orders: {
    create: (data: any) => fetchJson('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    get: (id: string) => fetchJson(`/orders/${id}`),
    list: () => fetchJson('/users/orders'),
  },
  search: {
    suggestions: (query: string) =>
      fetchJson(`/search/suggestions?q=${encodeURIComponent(query)}`),
    results: (query: string, filters: Record<string, any> = {}) =>
      fetchJson(`/search?q=${encodeURIComponent(query)}`),
  },
};
```

```typescript