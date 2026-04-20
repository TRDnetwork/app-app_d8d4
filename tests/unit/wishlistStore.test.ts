import { describe, it, expect } from 'vitest';
import { wishlistStore } from '../../src/stores/wishlistStore';

describe('wishlistStore', () => {
  const mockProduct = {
    _id: '123',
    title: 'Test Product',
    price: 99.99,
    image: 'test.jpg',
  };

  beforeEach(() => {
    wishlistStore.getState().items = [];
  });

  it('adds product to wishlist', () => {
    wishlistStore.getState().add(mockProduct);
    const state = wishlistStore.getState();
    expect(state.items).toHaveLength(1);
    expect(state.items[0]._id).toBe('123');
  });

  it('removes product from wishlist', () => {
    wishlistStore.getState().add(mockProduct);
    wishlistStore.getState().remove('123');
    const state = wishlistStore.getState();
    expect(state.items).toHaveLength(0);
  });

  it('checks if product is in wishlist', () => {
    const state = wishlistStore.getState();
    expect(state.has('123')).toBe(false);
    
    state.add(mockProduct);
    expect(state.has('123')).toBe(true);
    expect(state.has('456')).toBe(false);
  });
});