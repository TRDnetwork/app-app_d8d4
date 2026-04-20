import { describe, it, expect } from 'vitest';
import { api } from '../../src/lib/api';

describe('API Client', () => {
  beforeEach(() => {
    // Mock fetch
    global.fetch = vi.fn();
  });

  it('should make authenticated requests with token', async () => {
    // Mock successful response
    (global.fetch as vi.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });

    // Mock token in localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn().mockReturnValue('mock-jwt-token'),
      },
      writable: true,
    });

    await api.auth.me();
    
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/auth/me',
      expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': 'Bearer mock-jwt-token',
        }),
      })
    );
  });

  it('should show toast on API error', async () => {
    const toastSpy = vi.spyOn(global.console, 'error');
    
    // Mock failed response
    (global.fetch as vi.Mock).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ message: 'Unauthorized' }),
    });

    try {
      await api.auth.me();
    } catch (error) {
      expect(toastSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          variant: 'destructive',
          description: 'Unauthorized',
        })
      );
    }
  });

  it('should handle login request correctly', async () => {
    // Mock successful login response
    (global.fetch as vi.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        success: true,
        token: 'mock-jwt-token',
        user: {
          _id: 'user123',
          name: 'Test User',
          email: 'test@example.com',
          role: 'customer'
        }
      }),
    });

    const result = await api.auth.login('test@example.com', 'password123!');

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/auth/login',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123!'
        }),
      })
    );

    expect(result).toEqual({
      success: true,
      token: 'mock-jwt-token',
      user: {
        _id: 'user123',
        name: 'Test User',
        email: 'test@example.com',
        role: 'customer'
      }
    });
  });

  it('should handle register request correctly', async () => {
    // Mock successful register response
    (global.fetch as vi.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        success: true,
        message: 'User registered successfully'
      }),
    });

    const result = await api.auth.register('Test User', 'test@example.com', 'StrongPass123!');

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/auth/register',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com',
          password: 'StrongPass123!'
        }),
      })
    );

    expect(result).toEqual({
      success: true,
      message: 'User registered successfully'
    });
  });
});