const API_BASE = '/api';

const fetchJson = async (url: string, options?: RequestInit) => {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(useAuthStore.getState().token ? { Authorization: `Bearer ${useAuthStore.getState().token}` } : {}),
    },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || res.statusText);
  }
  return res.json();
};

import { useAuthStore } from '../stores/authStore';

export const authApi = {
  register: (data: { email: string; password: string; name: string }) =>
    fetchJson('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data: { email: string; password: string }) =>
    fetchJson('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  verifyEmail: (token: string) =>
    fetchJson('/auth/verify-email', { method: 'POST', body: JSON.stringify({ token }) }),
  forgotPassword: (email: string) =>
    fetchJson('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
  resetPassword: (token: string, password: string) =>
    fetchJson('/auth/reset-password', { method: 'POST', body: JSON.stringify({ token, password }) }),
  googleOAuth: () => (window.location.href = '/api/auth/oauth/google'),
  facebookOAuth: () => (window.location.href = '/api/auth/oauth/facebook'),
};

export const userApi = {
  getProfile: () => fetchJson('/users/profile'),
  updateProfile: (data: { name?: string; phone?: string }) =>
    fetchJson('/users/profile', { method: 'PUT', body: JSON.stringify(data) }),
  uploadPicture: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return fetch(`${API_BASE}/users/profile/picture`, {
      method: 'PUT',
      body: formData,
      headers: {
        Authorization: `Bearer ${useAuthStore.getState().token}`,
      },
    });
  },
  getAddresses: () => fetchJson('/users/addresses'),
  addAddress: (data: any) => fetchJson('/users/addresses', { method: 'POST', body: JSON.stringify(data) }),
  updateAddress: (id: string, data: any) => fetchJson(`/users/addresses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteAddress: (id: string) => fetchJson(`/users/addresses/${id}`, { method: 'DELETE' }),
};

export const productApi = {
  getProducts: (filters: any) => fetchJson('/products', { method: 'GET', body: JSON.stringify(filters) }),
  getProductBySlug: (slug: string) => fetchJson(`/products/${slug}`),
  getReviews: (id: string) => fetchJson(`/products/${id}/reviews`),
  getQuestions: (id: string) => fetchJson(`/products/${id}/questions`),
  askQuestion: (id: string, question: string) =>
    fetchJson(`/products/${id}/questions`, { method: 'POST', body: JSON.stringify({ question }) }),
  getRecentlyViewed: () => fetchJson('/products/recently-viewed'),
  getRecommendations: () => fetchJson('/products/recommendations'),
};

export const cartApi = {
  getCart: () => fetchJson('/cart'),
  addItem: (data: { product_id: string; variant_id?: string; quantity: number }) =>
    fetchJson('/cart/items', { method: 'POST', body: JSON.stringify(data) }),
  updateItem: (id: string, quantity: number) =>
    fetchJson(`/cart/items/${id}`, { method: 'PUT', body: JSON.stringify({ quantity }) }),
  removeItem: (id: string) => fetchJson(`/cart/items/${id}`, { method: 'DELETE' }),
  applyCoupon: (code: string) => fetchJson('/cart/apply-coupon', { method: 'POST', body: JSON.stringify({ code }) }),
};

export const wishlistApi = {
  getWishlist: () => fetchJson('/wishlist'),
  addToWishlist: (product_id: string) => fetchJson(`/wishlist/${product_id}`, { method: 'POST' }),
  removeFromWishlist: (product_id: string) => fetchJson(`/wishlist/${product_id}`, { method: 'DELETE' }),
};

export const orderApi = {
  createOrder: (data: any) => fetchJson('/orders', { method: 'POST', body: JSON.stringify(data) }),
  getOrders: () => fetchJson('/orders'),
  getOrderById: (id: string) => fetchJson(`/orders/${id}`),
  cancelOrder: (id: string) => fetchJson(`/orders/${id}/cancel`, { method: 'PUT' }),
  requestReturn: (id: string, reason: string) =>
    fetchJson(`/orders/${id}/return`, { method: 'POST', body: JSON.stringify({ reason }) }),
  getInvoice: (id: string) => `${API_BASE}/orders/${id}/invoice`,
};

export const reviewApi = {
  createReview: (data: any) => fetchJson('/reviews', { method: 'POST', body: JSON.stringify(data) }),
  updateReview: (id: string, data: any) => fetchJson(`/reviews/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteReview: (id: string) => fetchJson(`/reviews/${id}`, { method: 'DELETE' }),
  markHelpful: (id: string) => fetchJson(`/reviews/${id}/helpful`, { method: 'POST' }),
};

export const searchApi = {
  search: (query: string, filters: any) => fetchJson('/search', { method: 'POST', body: JSON.stringify({ query, ...filters }) }),
  suggest: (query: string) => fetchJson(`/search/suggest?q=${encodeURIComponent(query)}`),
};