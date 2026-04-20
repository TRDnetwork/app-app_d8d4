import { describe, it, expect } from 'vitest';
import { authStore } from '../../src/stores/authStore';

describe('authStore', () => {
  it('initializes with null user', () => {
    const state = authStore.getState();
    expect(state.user).toBeNull();
  });

  it('logs in user and updates state', () => {
    const mockUser = {
      _id: '123',
      email: 'test@example.com',
      name: 'Test User',
      role: 'customer' as const,
      token: 'abc123',
      refreshToken: 'def456',
    };

    authStore.getState().login(mockUser);
    const state = authStore.getState();
    
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
  });

  it('logs out user and clears state', () => {
    const mockUser = {
      _id: '123',
      email: 'test@example.com',
      name: 'Test User',
      role: 'customer' as const,
      token: 'abc123',
      refreshToken: 'def456',
    };

    authStore.getState().login(mockUser);
    authStore.getState().logout();
    const state = authStore.getState();
    
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('refreshes tokens correctly', () => {
    const mockUser = {
      _id: '123',
      email: 'test@example.com',
      name: 'Test User',
      role: 'customer' as const,
      token: 'abc123',
      refreshToken: 'def456',
    };

    authStore.getState().login(mockUser);
    authStore.getState().refresh('newToken', 'newRefreshToken');
    
    const state = authStore.getState();
    expect(state.user?.token).toBe('newToken');
    expect(state.user?.refreshToken).toBe('newRefreshToken');
  });
});