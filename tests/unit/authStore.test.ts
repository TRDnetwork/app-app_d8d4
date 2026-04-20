import { describe, it, expect } from 'vitest';
import { authStore } from '../../src/stores/authStore';

describe('authStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    authStore.setState({ user: null });
  });

  it('initializes with null user', () => {
    const state = authStore.getState();
    expect(state.user).toBeNull();
  });

  it('logs in user successfully', () => {
    const mockUser = {
      _id: 'user123',
      email: 'user@example.com',
      name: 'Test User',
      role: 'customer' as const,
      token: 'mock-token',
    };

    authStore.getState().login(mockUser);
    const state = authStore.getState();

    expect(state.user).toEqual(mockUser);
  });

  it('logs out user successfully', () => {
    const mockUser = {
      _id: 'user123',
      email: 'user@example.com',
      name: 'Test User',
      role: 'customer' as const,
      token: 'mock-token',
    };

    authStore.getState().login(mockUser);
    authStore.getState().logout();
    const state = authStore.getState();

    expect(state.user).toBeNull();
  });

  it('sets user directly', () => {
    const mockUser = {
      _id: 'user123',
      email: 'user@example.com',
      name: 'Test User',
      role: 'customer' as const,
      token: 'mock-token',
    };

    authStore.getState().setUser(mockUser);
    const state = authStore.getState();

    expect(state.user).toEqual(mockUser);
  });
});