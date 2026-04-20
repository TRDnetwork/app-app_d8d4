import { describe, it, expect } from 'vitest';
import { wishlistStore } from '../../src/stores/wishlistStore';

describe('wishlistStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    wishlistStore.setState({ items: [] });
  });

  it('initializes with empty wishlist', () => {
    const state = wishlistStore.getState();
    expect(state.items).toHaveLength(0);
  });

  it('adds product to wishlist', () => {
    wishlistStore.getState().add('product123');

    const state = wishlistStore.getState();
    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toBe('product123');
    expect(state.has('product123')).toBe(true);
  });

  it('removes product from wishlist', () => {
    wishlistStore.getState().add('product123');
    wishlistStore.getState().remove('product123');

    const state = wishlistStore.getState();
    expect(state.items).toHaveLength(0);
    expect(state.has('product123')).toBe(false);
  });

  it('toggles product in wishlist', () => {
    // Add product
    wishlistStore.getState().toggle('product123');
    expect(wishlistStore.getState().has('product123')).toBe(true);

    // Remove product
    wishlistStore.getState().toggle('product123');
    expect(wishlistStore.getState().has('product123')).toBe(false);
  });

  it('handles multiple products', () => {
    wishlistStore.getState().add('product123');
    wishlistStore.getState().add('product456');

    const state = wishlistStore.getState();
    expect(state.items).toHaveLength(2);
    expect(state.has('product123')).toBe(true);
    expect(state.has('product456')).toBe(true);
    expect(state.has('product789')).toBe(false);
  });
});