import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Global mocks
global.fetch = vi.fn();

// Suppress React 18 act() warnings in tests
vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return { ...actual };
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});