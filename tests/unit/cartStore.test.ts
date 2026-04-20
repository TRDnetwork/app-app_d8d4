import { describe, it, expect } from 'vitest';
import { cartStore } from '../../src/stores/cartStore';

describe('cartStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    cartStore.setState({
      items: [],
      couponCode: null,
      discount: 0,
    });
  });

  it('initializes with empty cart', () => {
    const state = cartStore.getState();
    expect(state.items).toHaveLength(0);
    expect(state.getTotalItems()).toBe(0);
    expect(state.getSubtotal()).toBe(0);
  });

  it('adds item to empty cart', () => {
    cartStore.getState().addItem({
      product_id: 'product123',
      title: 'Test Product',
      image: 'test.jpg',
      price: 99.99,
      quantity: 1,
    });

    const state = cartStore.getState();
    expect(state.items).toHaveLength(1);
    expect(state.items[0].product_id).toBe('product123');
    expect(state.items[0].price_snapshot).toBe(99.99);
    expect(state.getTotalItems()).toBe(1);
    expect(state.getSubtotal()).toBe(99.99);
  });

  it('adds multiple quantities of same product', () => {
    cartStore.getState().addItem({
      product_id: 'product123',
      title: 'Test Product',
      image: 'test.jpg',
      price: 99.99,
      quantity: 1,
    });

    cartStore.getState().addItem({
      product_id: 'product123',
      title: 'Test Product',
      image: 'test.jpg',
      price: 99.99,
      quantity: 2,
    });

    const state = cartStore.getState();
    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(3);
    expect(state.getTotalItems()).toBe(3);
    expect(state.getSubtotal()).toBe(299.97);
  });

  it('adds different products to cart', () => {
    cartStore.getState().addItem({
      product_id: 'product123',
      title: 'Test Product 1',
      image: 'test1.jpg',
      price: 99.99,
      quantity: 1,
    });

    cartStore.getState().addItem({
      product_id: 'product456',
      title: 'Test Product 2',
      image: 'test2.jpg',
      price: 49.99,
      quantity: 1,
    });

    const state = cartStore.getState();
    expect(state.items).toHaveLength(2);
    expect(state.getTotalItems()).toBe(2);
    expect(state.getSubtotal()).toBe(149.98);
  });

  it('updates quantity of existing item', () => {
    cartStore.getState().addItem({
      product_id: 'product123',
      title: 'Test Product',
      image: 'test.jpg',
      price: 99.99,
      quantity: 1,
    });

    cartStore.getState().updateQuantity('product123', 3);

    const state = cartStore.getState();
    expect(state.items[0].quantity).toBe(3);
    expect(state.getTotalItems()).toBe(3);
    expect(state.getSubtotal()).toBe(299.97);
  });

  it('removes item from cart', () => {
    cartStore.getState().addItem({
      product_id: 'product123',
      title: 'Test Product',
      image: 'test.jpg',
      price: 99.99,
      quantity: 1,
    });

    cartStore.getState().removeItem('product123');

    const state = cartStore.getState();
    expect(state.items).toHaveLength(0);
    expect(state.getTotalItems()).toBe(0);
    expect(state.getSubtotal()).toBe(0);
  });

  it('clears entire cart', () => {
    cartStore.getState().addItem({
      product_id: 'product123',
      title: 'Test Product 1',
      image: 'test1.jpg',
      price: 99.99,
      quantity: 1,
    });

    cartStore.getState().addItem({
      product_id: 'product456',
      title: 'Test Product 2',
      image: 'test2.jpg',
      price: 49.99,
      quantity: 1,
    });

    cartStore.getState().clearCart();

    const state = cartStore.getState();
    expect(state.items).toHaveLength(0);
    expect(state.getTotalItems()).toBe(0);
    expect(state.getSubtotal()).toBe(0);
    expect(state.couponCode).toBeNull();
    expect(state.discount).toBe(0);
  });

  it('applies coupon correctly', () => {
    cartStore.getState().applyCoupon('SAVE10', 10);

    const state = cartStore.getState();
    expect(state.couponCode).toBe('SAVE10');
    expect(state.discount).toBe(10);
  });

  it('removes coupon correctly', () => {
    cartStore.getState().applyCoupon('SAVE10', 10);
    cartStore.getState().removeCoupon();

    const state = cartStore.getState();
    expect(state.couponCode).toBeNull();
    expect(state.discount).toBe(0);
  });
});