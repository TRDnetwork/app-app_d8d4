import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from '../../server/src/server';

// Mock dependencies
vi.mock('ioredis', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      on: vi.fn(),
    })),
  };
});

vi.mock('@sentry/node', () => ({
  init: vi.fn(),
  Handlers: {
    requestHandler: vi.fn().mockReturnValue((req, res, next) => next()),
    errorHandler: vi.fn().mockReturnValue((err, req, res, next) => next(err)),
    tracingHandler: vi.fn(),
  },
}));

vi.mock('helmet', () => ({
  default: vi.fn().mockReturnValue((req, res, next) => next()),
}));

vi.mock('cors', () => ({
  default: vi.fn().mockReturnValue((req, res, next) => next()),
}));

// Mock environment variables
process.env.JWT_SECRET = 'test_jwt_secret';
process.env.JWT_REFRESH_SECRET = 'test_jwt_refresh_secret';
process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
process.env.CLIENT_URL = 'http://localhost:3000';
process.env.RESEND_API_KEY = 'test_resend_api_key';
process.env.EMAIL_FROM = 'test@example.com';

describe('API Endpoints', () => {
  it('GET /api/health returns 200', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'OK' });
  });

  it('POST /api/auth/register returns 400 for missing fields', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({});
    
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  it('POST /api/auth/register returns 400 for invalid email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'John Doe',
        email: 'invalid-email',
        password: 'password123',
      });
    
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  it('POST /api/auth/register returns 400 for short password', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        password: '123',
      });
    
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  it('POST /api/auth/login returns 401 for invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'wrong_password',
      });
    
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message');
  });

  it('POST /api/auth/forgot-password returns 404 for non-existent email', async () => {
    const res = await request(app)
      .post('/api/auth/forgot-password')
      .send({
        email: 'nonexistent@example.com',
      });
    
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message');
  });

  it('GET /api/auth/refresh-token returns 401 for missing token', async () => {
    const res = await request(app)
      .post('/api/auth/refresh-token')
      .set('Cookie', []);
    
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message');
  });

  it('POST /api/auth/logout returns 200', async () => {
    const res = await request(app)
      .post('/api/auth/logout');
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');
  });

  it('GET /api/products returns 200', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('products');
    expect(res.body).toHaveProperty('total');
  });

  it('GET /api/products/:id returns 404 for non-existent product', async () => {
    const res = await request(app).get('/api/products/nonexistent');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message');
  });

  it('GET /api/categories returns 200', async () => {
    const res = await request(app).get('/api/categories');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('categories');
  });

  it('GET /api/search returns 200', async () => {
    const res = await request(app).get('/api/search?q=test');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('products');
    expect(res.body).toHaveProperty('suggestions');
    expect(res.body).toHaveProperty('total');
  });

  it('GET /api/cart returns 401 for unauthenticated user', async () => {
    const res = await request(app).get('/api/cart');
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message');
  });

  it('GET /api/orders returns 401 for unauthenticated user', async () => {
    const res = await request(app).get('/api/orders');
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message');
  });
});