import { describe, it, expect } from 'vitest';
import { server } from '../mocks/server';
import { rest } from 'msw';

describe('API Endpoints', () => {
  it('GET /api/products returns product list', async () => {
    const response = await fetch('/api/products');
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data).toHaveProperty('data');
    expect(Array.isArray(data.data)).toBe(true);
  });

  it('POST /api/auth/register creates new user', async () => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      }),
    });

    expect(response.status).toBe(201);
    expect(await response.json()).toHaveProperty('success', true);
  });

  it('POST /api/auth/login authenticates user', async () => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
      }),
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toHaveProperty('token');
  });

  it('GET /api/cart returns user cart', async () => {
    // Mock authentication
    localStorage.setItem('token', 'mock-jwt-token');
    
    const response = await fetch('/api/cart');
    expect(response.status).toBe(200);
  });

  it('POST /api/orders creates new order', async () => {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer mock-jwt-token',
      },
      body: JSON.stringify({
        address_id: 'mock-address-id',
        payment_method: 'card',
      }),
    });

    expect(response.status).toBe(201);
    expect(await response.json()).toHaveProperty('data');
  });

  it('GET /api/users/profile returns user profile', async () => {
    // Mock authentication
    localStorage.setItem('token', 'mock-jwt-token');
    
    const response = await fetch('/api/users/profile');
    expect(response.status).toBe(200);
  });

  it('POST /api/users/wishlist adds product to wishlist', async () => {
    // Mock authentication
    localStorage.setItem('token', 'mock-jwt-token');
    
    const response = await fetch('/api/users/wishlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productId: 'mock-product-id',
      }),
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toHaveProperty('success', true);
  });

  it('GET /api/products/:id returns product details', async () => {
    const response = await fetch('/api/products/1');
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data).toHaveProperty('data');
    expect(data.data).toHaveProperty('name');
    expect(data.data).toHaveProperty('price');
  });

  it('GET /api/users/orders returns order history', async () => {
    // Mock authentication
    localStorage.setItem('token', 'mock-jwt-token');
    
    const response = await fetch('/api/users/orders');
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data).toHaveProperty('data');
    expect(Array.isArray(data.data)).toBe(true);
  });

  it('POST /api/products/:id/reviews creates product review', async () => {
    // Mock authentication
    localStorage.setItem('token', 'mock-jwt-token');
    
    const response = await fetch('/api/products/1/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        rating: 5,
        title: 'Great product!',
        comment: 'This product exceeded my expectations.',
      }),
    });

    expect(response.status).toBe(201);
    expect(await response.json()).toHaveProperty('data');
  });

  it('GET /api/search returns search results', async () => {
    const response = await fetch('/api/search?q=test');
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data).toHaveProperty('data');
    expect(Array.isArray(data.data)).toBe(true);
  });

  it('POST /api/coupons/validate validates coupon code', async () => {
    // Mock authentication
    localStorage.setItem('token', 'mock-jwt-token');
    
    const response = await fetch('/api/coupons/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: 'DISCOUNT10',
      }),
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toHaveProperty('valid');
  });
});