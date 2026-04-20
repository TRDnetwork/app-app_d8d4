import { describe, it, expect, vi } from 'vitest';
import { apiClient } from '../../src/lib/api';

// Mock authStore
vi.mock('../../src/stores/authStore', () => ({
  authStore: {
    getState: vi.fn().mockReturnValue({
      user: { token: 'mock-token' },
      logout: vi.fn(),
    }),
  },
}));

// Mock window.location
const mockLocation = { href: '' };
Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
});

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('apiClient', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    mockLocation.href = '';
  });

  it('makes GET request with proper headers and auth token', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue({ data: 'test' }),
    });

    const result = await apiClient('/test-endpoint');

    expect(mockFetch).toHaveBeenCalledWith('/api/test-endpoint', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer mock-token',
      },
    });

    expect(result).toEqual({ data: 'test' });
  });

  it('makes POST request with body and proper headers', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue({ success: true }),
    });

    const body = { name: 'test', value: 123 };
    await apiClient('/test-endpoint', { method: 'POST', body: JSON.stringify(body) });

    expect(mockFetch).toHaveBeenCalledWith('/api/test-endpoint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer mock-token',
      },
      body: JSON.stringify(body),
    });
  });

  it('handles 401 error by logging out user', async () => {
    const mockLogout = vi.fn();
    vi.mock('../../src/stores/authStore', () => ({
      authStore: {
        getState: vi.fn().mockReturnValue({
          user: { token: 'mock-token' },
          logout: mockLogout,
        }),
      },
    }));

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: vi.fn().mockResolvedValue({ message: 'Unauthorized' }),
    });

    await expect(apiClient('/test-endpoint')).rejects.toThrow();

    expect(mockLogout).toHaveBeenCalled();
    expect(mockLocation.href).toBe('/login');
  });

  it('handles network error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    await expect(apiClient('/test-endpoint')).rejects.toThrow('Network error');
  });

  it('handles server error', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: vi.fn().mockResolvedValue({ message: 'Server error' }),
    });

    await expect(apiClient('/test-endpoint')).rejects.toThrow('Server error');
  });

  it('includes content-type header in all requests', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue({}),
    });

    await apiClient('/test-endpoint', { method: 'POST', body: '{}' });

    const headers = mockFetch.mock.calls[0][1].headers;
    expect(headers['Content-Type']).toBe('application/json');
  });
});