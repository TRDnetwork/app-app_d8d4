
```
import { describe, it, expect, vi } from 'vitest';
import { authApi, userApi, productApi, cartApi, wishlistApi, orderApi } from '../../src/lib/api';
import { useAuthStore } from '../../src/stores/authStore';

// Mock fetch
global.fetch = vi.fn();

describe('API Services', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock successful fetch response
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({}),
    });
  });

  describe('authApi', () => {
    it('registers a new user', async () => {
      const mockResponse = { user: { id: '1', email: 'test@example.com' }, token: 'token123' };
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await authApi.register({ email: 'test@example.com', password: 'password', name: 'Test User' });
      
      expect(global.fetch).toHaveBeenCalledWith('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com', password: 'password', name: 'Test User' }),
      });
      expect(result).toEqual(mockResponse);
    });

    it('logs in a user', async () => {
      const mockResponse = { user: { id: '1', email: 'test@example.com' }, token: 'token123' };
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await authApi.login({ email: 'test@example.com', password: 'password' });
      
      expect(global.fetch).toHaveBeenCalledWith('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com', password: 'password' }),
      });
      expect(result).toEqual(mockResponse);
    });

    it('verifies email with token', async () => {
      await authApi.verifyEmail('verification-token');
      
      expect(global.fetch).toHaveBeenCalledWith('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: 'verification-token' }),
      });
    });
  });

  describe('userApi', () => {
    it('gets user profile', async () => {
      useAuthStore.setState({ token: 'test-token' });
      const mockResponse = { user: { id: '1', name: 'Test User', email: 'test@example.com' } };
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await userApi.getProfile();
      
      expect(global.fetch).toHaveBeenCalledWith('/api/users/profile', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-token',
        },
      });
      expect(result).toEqual(mockResponse);
    });

    it('updates user profile', async () => {
      useAuthStore.setState({ token: 'test-token' });
      const mockResponse = { user: { id: '1', name: 'Updated Name', email: 'test@example.com' } };
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await userApi.updateProfile({ name: 'Updated Name' });
      
      expect(global.fetch).toHaveBeenCalledWith('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-token',
        },
        body: JSON.stringify({ name: 'Updated Name' }),
      });
      expect(result).toEqual(mockResponse);
    });

    it('gets user addresses', async () => {
      useAuthStore.setState({ token: 'test-token' });
      const mockResponse = { addresses: [{ id: '1', line1: '123 Main St', city: 'Anytown' }] };
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await userApi.getAddresses();
      
      expect(global.fetch).toHaveBeenCalledWith('/api/users/addresses', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-token',
        },
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('productApi', () => {
    it('gets products with filters', async () => {
      const mockResponse = { products: [], pagination: { page: 1, limit: 10, total: 0 } };
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await productApi.getProducts({ category: 'electronics', price_min: 100 });
      
      expect(global.fetch).toHaveBeenCalledWith('/api/products', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: 'electronics', price_min: 100 }),
      });
      expect(result).toEqual(mockResponse);
    });

    it('gets product by slug', async () => {
      const mockResponse = { product: { id: '1', title: 'Test Product', price: 99.99 } };
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await productApi.getProductBySlug('test-product');
      
      expect(global.fetch).toHaveBeenCalledWith('/api/products/test-product', {
        headers: { 'Content-Type': 'application/json' },
      });
      expect(result).toEqual(mockResponse);
    });

    it('gets product reviews', async () => {
      const mockResponse = { reviews: [], pagination: { page: 1, limit: 10, total: 0 } };
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await productApi.getReviews('1');
      
      expect(global.fetch).toHaveBeenCalledWith('/api/products/1/reviews', {
        headers: { 'Content-Type': 'application/json' },
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('cartApi', () => {
    it('gets cart', async () => {
      useAuthStore.setState({ token: 'test-token' });
      const mockResponse = { cart: { items: [], total: 0 } };
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await cartApi.getCart();
      
      expect(global.fetch).toHaveBeenCalledWith('/api/cart', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-token',
        },
      });
      expect(result).toEqual(mockResponse);
    });

    it('adds item to cart', async () => {
      useAuthStore.setState({ token: 'test-token' });
      const mockResponse = { cart: { items: [{ product_id: '1', quantity: 1 }], total: 99.99 } };
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await cartApi.addItem({ product_id: '1', quantity: 1 });
      
      expect(global.fetch).toHaveBeenCalledWith('/api/cart/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-token',
        },
        body: JSON.stringify({ product_id: '1', quantity: 1 }),
      });
      expect(result).toEqual(mockResponse);
    });

    it('applies coupon to cart', async () => {
      useAuthStore.setState({ token: 'test-token' });
      const mockResponse = { cart: { items: [], total: 89.99, discount: 10 } };
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await cartApi.applyCoupon('SAVE10');
      
      expect(global.fetch).toHaveBeenCalledWith('/api/cart/apply-coupon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-token',
        },
        body: JSON.stringify({ code: 'SAVE10' }),
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('wishlistApi', () => {
    it('gets wishlist', async () => {
      useAuthStore.setState({ token: 'test-token' });
      const mockResponse = { wishlist: [{ product_id: '1', added_at: '2023-10-15' }] };
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await wishlistApi.getWishlist();
      
      expect(global.fetch).toHaveBeenCalledWith('/api/wishlist', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-token',
        },
      });
      expect(result).toEqual(mockResponse);
    });

    it('adds product to wishlist', async () => {
      useAuthStore.setState({ token: 'test-token' });
      const mockResponse = { wishlist: [{ product_id: '1', added_at: '2023-10-15' }] };
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await wishlistApi.addToWishlist('1');
      
      expect(global.fetch).toHaveBeenCalledWith('/api/wishlist/1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-token',
        },
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('orderApi', () => {
    it('creates an order', async () => {
      useAuthStore.setState({ token: 'test-token' });
      const mockResponse = { order: { id: '1', order_number: 'ORD-001', total: 99.99 } };
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await orderApi.createOrder({ address: {}, delivery_speed: 'standard', payment_method: 'stripe' });
      
      expect(global.fetch).toHaveBeenCalledWith('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-token',
        },
        body: JSON.stringify({ address: {}, delivery_speed: 'standard', payment_method: 'stripe' }),
      });
      expect(result).toEqual(mockResponse);
    });

    it('gets user orders', async () => {
      useAuthStore.setState({ token: 'test-token' });
      const mockResponse = { orders: [], pagination: { page: 1, limit: 10, total: 0 } };
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await orderApi.getOrders();
      
      expect(global.fetch).toHaveBeenCalledWith('/api/orders', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-token',
        },
      });
      expect(result).toEqual(mockResponse);
    });

    it('gets order by ID', async () => {
      useAuthStore.setState({ token: 'test-token' });
      const mockResponse = { order: { id: '1', order_number: 'ORD-001', total: 99.99 } };
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await orderApi.getOrderById('1');
      
      expect(global.fetch).toHaveBeenCalledWith('/api/orders/1', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-token',
        },
      });
      expect(result).toEqual(mockResponse);
    });
  });
});
```