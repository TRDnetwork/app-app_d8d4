import { describe, it, expect, beforeEach } from 'vitest';
import { api } from '../../src/lib/api';

// Mock fetch
global.fetch = vi.fn();

describe('API Client', () => {
  const mockToken = 'mock-jwt-token';
  
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem('accessToken', mockToken);
  });

  it('includes authorization header when token is present', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: 'test' })
    });

    await api.auth.me();
    
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/auth/me',
      expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': `Bearer ${mockToken}`
        })
      })
    );
  });

  it('handles successful responses', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true, data: 'test' })
    });

    const result = await api.auth.me();
    expect(result).toEqual({ success: true, data: 'test' });
  });

  it('throws error for failed responses', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ message: 'Server error' })
    });

    await expect(api.auth.me()).rejects.toThrow('Server error');
  });

  it('handles network errors', async () => {
    (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));
    
    await expect(api.auth.me()).rejects.toThrow('Network error');
  });

  it('sends correct payload for login', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true, token: 'new-token' })
    });

    await api.auth.login('test@example.com', 'password123');
    
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/auth/login',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'test@example.com', password: 'password123' })
      })
    );
  });
});