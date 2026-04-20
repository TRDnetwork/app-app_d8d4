import { vi } from 'vitest';

export const mockApi = {
  auth: {
    login: vi.fn(),
    register: vi.fn(),
    me: vi.fn(),
    logout: vi.fn(),
  },
  products: {
    list: vi.fn(),
    getById: vi.fn(),
    getReviews: vi.fn(),
    addReview: vi.fn(),
    getQuestions: vi.fn(),
    askQuestion: vi.fn(),
  },
  cart: {
    get: vi.fn(),
    addItem: vi.fn(),
    updateItem: vi.fn(),
    removeItem: vi.fn(),
  },
  user: {
    getProfile: vi.fn(),
    updateProfile: vi.fn(),
    getAddresses: vi.fn(),
    addAddress: vi.fn(),
    deleteAddress: vi.fn(),
    getWishlist: vi.fn(),
    addToWishlist: vi.fn(),
    removeFromWishlist: vi.fn(),
  },
  orders: {
    create: vi.fn(),
    get: vi.fn(),
    list: vi.fn(),
  },
  search: {
    suggestions: vi.fn(),
    results: vi.fn(),
  },
};
```