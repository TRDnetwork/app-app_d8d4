import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Global mocks
global.fetch = vi.fn();

// Suppress React 18 act() warnings in tests
vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return { ...actual };
});

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(),
  }),
}));