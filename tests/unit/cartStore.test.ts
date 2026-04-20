import { describe, it, expect } from 'vitest';
import { cartStore } from '../../src/stores/cartStore';

describe('cartStore', () => {
  const mockProduct = {
    _id: '123',
    title: 'Test Product',
    price: 99.99,
    image: 'test.jpg',
  };

  beforeEach(() => {
    cartStore.getState().clearCart();
  });

  it('adds item to empty cart', () => {
    cartStore.getState().addItem({
      product_id: '123',
      quantity: 1,
      price: 99.99,
      title: 'Test Product',
      image: 'test.jpg',
    });

    const state = cartStore.getState();
    expect(state.items).toHaveLength(1);
    expect(state.items[0].product_id).toBe('123');
    expect(state.items[0].quantity).toBe(1);
  });

  it('increases quantity when adding existing item', () => {
    cartStore.getState().addItem({
      product_id: '123',
      quantity: 1,
      price: 99.99,
      title: 'Test Product',
      image: 'test.jpg',
    });

    cartStore.getState().addItem({
      product_id: '123',
      quantity: 2,
      price: 99.99,
      title: 'Test Product',
      image: 'test.jpg',
    });

    const state = cartStore.getState();
    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(3);
  });

  it('updates quantity of existing item', () => {
    cartStore.getState().addItem({
      product_id: '123',
      quantity: 1,
      price: 99.99,
      title: 'Test Product',
      image: 'test.jpg',
    });

    cartStore.getState().updateQuantity('123', 5);
    const state = cartStore.getState();
    expect(state.items[0].quantity).toBe(5);
  });

  it('removes item from cart', () => {
    cartStore.getState().addItem({
      product_id: '123',
      quantity: 1,
      price: 99.99,
      title: 'Test Product',
      image: 'test.jpg',
    });

    cartStore.getState().removeItem('123');
    const state = cartStore.getState();
    expect(state.items).toHaveLength(0);
  });

  it('clears entire cart', () => {
    cartStore.getState().addItem({
      product_id: '123',
      quantity: 1,
      price: 99.99,
      title: 'Test Product',
      image: 'test.jpg',
    });

    cartStore.getState().addItem({
      product_id: '456',
      quantity: 2,
      price: 49.99,
      title: 'Another Product',
      image: 'another.jpg',
    });

    cartStore.getState().clearCart();
    const state = cartStore.getState();
    expect(state.items).toHaveLength(0);
    expect(state.subtotal).toBe(0);
    expect(state.total).toBe(0);
  });

  it('calculates subtotal correctly', () => {
    cartStore.getState().addItem({
      product_id: '123',
      quantity: 2,
      price: 50,
      title: 'Test Product',
      image: 'test.jpg',
    });

    cartStore.getState().addItem({
      product_id: '456',
      quantity: 1,
      price: 25,
      title: 'Another Product',
      image: 'another.jpg',
    });

    const state = cartStore.getState();
    expect(state.subtotal()).toBe(125);
  });

  it('applies coupon discount', () => {
    cartStore.getState().addItem({
      product_id: '123',
      quantity: 2,
      price: 50,
      title: 'Test Product',
      image: 'test.jpg',
    });

    cartStore.getState().applyCoupon('SAVE10');
    const state = cartStore.getState();
    
    expect(state.couponCode).toBe('SAVE10');
    expect(state.discount).toBe(10);
    expect(state.total()).toBe(90);
  });
});