
```
import { describe, it, expect, vi } from 'vitest';
import { useAuthStore } from '../../src/stores/authStore';
import { useCartStore } from '../../src/stores/cartStore';
import { useWishlistStore } from '../../src/stores/wishlistStore';
import { useCheckoutStore } from '../../src/stores/checkoutStore';

describe('Zustand Stores', () => {
  describe('authStore', () => {
    it('initializes with null user and token', () => {
      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
    });

    it('logs in user and sets user and token', () => {
      const user = { id: '1', email: 'test@example.com', name: 'Test User', role: 'customer' };
      useAuthStore.getState().login(user, 'test-token');
      
      const state = useAuthStore.getState();
      expect(state.user).toEqual(user);
      expect(state.token).toBe('test-token');
    });

    it('logs out user and clears state', () => {
      useAuthStore.getState().login({ id: '1', email: 'test@example.com', name: 'Test User', role: 'customer' }, 'test-token');
      useAuthStore.getState().logout();
      
      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
    });

    it('updates user information', () => {
      const user = { id: '1', email: 'test@example.com', name: 'Test User', role: 'customer' };
      useAuthStore.getState().setUser(user);
      
      const state = useAuthStore.getState();
      expect(state.user).toEqual(user);
    });
  });

  describe('cartStore', () => {
    beforeEach(() => {
      useCartStore.getState().clear();
    });

    it('initializes with empty items array', () => {
      const state = useCartStore.getState();
      expect(state.items).toEqual([]);
      expect(state.coupon).toBeNull();
      expect(state.discount).toBe(0);
    });

    it('adds item to cart', () => {
      useCartStore.getState().add({
        product_id: '1',
        name: 'Test Product',
        price: 99.99,
        quantity: 1,
        image: 'image.jpg',
      });
      
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0].product_id).toBe('1');
      expect(state.items[0].quantity).toBe(1);
    });

    it('updates item quantity', () => {
      useCartStore.getState().add({
        product_id: '1',
        name: 'Test Product',
        price: 99.99,
        quantity: 1,
        image: 'image.jpg',
      });
      
      useCartStore.getState().update(useCartStore.getState().items[0].id, 2);
      
      const state = useCartStore.getState();
      expect(state.items[0].quantity).toBe(2);
    });

    it('removes item from cart', () => {
      const item = {
        product_id: '1',
        name: 'Test Product',
        price: 99.99,
        quantity: 1,
        image: 'image.jpg',
      };
      useCartStore.getState().add(item);
      const itemId = useCartStore.getState().items[0].id;
      
      useCartStore.getState().remove(itemId);
      
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(0);
    });

    it('clears cart', () => {
      useCartStore.getState().add({
        product_id: '1',
        name: 'Test Product',
        price: 99.99,
        quantity: 1,
        image: 'image.jpg',
      });
      
      useCartStore.getState().clear();
      
      const state = useCartStore.getState();
      expect(state.items).toEqual([]);
      expect(state.coupon).toBeNull();
      expect(state.discount).toBe(0);
    });

    it('applies coupon and discount', () => {
      useCartStore.getState().applyCoupon('SAVE10', 10);
      
      const state = useCartStore.getState();
      expect(state.coupon).toBe('SAVE10');
      expect(state.discount).toBe(10);
    });

    it('calculates total correctly', () => {
      useCartStore.getState().add({
        product_id: '1',
        name: 'Test Product',
        price: 100,
        quantity: 2,
        image: 'image.jpg',
      });
      useCartStore.getState().add({
        product_id: '2',
        name: 'Another Product',
        price: 50,
        quantity: 1,
        image: 'image.jpg',
      });
      useCartStore.getState().applyCoupon('SAVE10', 25);
      
      const total = useCartStore.getState().total();
      expect(total).toBe(225); // (100*2 + 50*1) - 25 = 225
    });
  });

  describe('wishlistStore', () => {
    beforeEach(() => {
      useWishlistStore.getState().items = [];
    });

    it('initializes with empty items array', () => {
      const state = useWishlistStore.getState();
      expect(state.items).toEqual([]);
    });

    it('adds item to wishlist', () => {
      useWishlistStore.getState().add({
        product_id: '1',
        name: 'Test Product',
        price: 99.99,
        image: 'image.jpg',
      });
      
      const state = useWishlistStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0].product_id).toBe('1');
    });

    it('removes item from wishlist', () => {
      useWishlistStore.getState().add({
        product_id: '1',
        name: 'Test Product',
        price: 99.99,
        image: 'image.jpg',
      });
      
      useWishlistStore.getState().remove('1');
      
      const state = useWishlistStore.getState();
      expect(state.items).toHaveLength(0);
    });

    it('checks if product is in wishlist', () => {
      useWishlistStore.getState().add({
        product_id: '1',
        name: 'Test Product',
        price: 99.99,
        image: 'image.jpg',
      });
      
      const isInWishlist = useWishlistStore.getState().has('1');
      const isNotInWishlist = useWishlistStore.getState().has('2');
      
      expect(isInWishlist).toBe(true);
      expect(isNotInWishlist).toBe(false);
    });
  });

  describe('checkoutStore', () => {
    beforeEach(() => {
      useCheckoutStore.getState().reset();
    });

    it('initializes with null address, deliverySpeed, and paymentMethod', () => {
      const state = useCheckoutStore.getState();
      expect(state.address).toBeNull();
      expect(state.deliverySpeed).toBeNull();
      expect(state.paymentMethod).toBeNull();
    });

    it('sets address', () => {
      const address = {
        id: '1',
        line1: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        postal_code: '12345',
        country: 'USA',
        type: 'home',
        is_default: true,
      };
      useCheckoutStore.getState().setAddress(address);
      
      const state = useCheckoutStore.getState();
      expect(state.address).toEqual(address);
    });

    it('sets delivery speed', () => {
      useCheckoutStore.getState().setDeliverySpeed('express');
      
      const state = useCheckoutStore.getState();
      expect(state.deliverySpeed).toBe('express');
    });

    it('sets payment method', () => {
      useCheckoutStore.getState().setPaymentMethod('stripe');
      
      const state = useCheckoutStore.getState();
      expect(state.paymentMethod).toBe('stripe');
    });

    it('resets checkout state', () => {
      useCheckoutStore.getState().setAddress({
        id: '1',
        line1: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        postal_code: '12345',
        country: 'USA',
        type: 'home',
        is_default: true,
      });
      useCheckoutStore.getState().setDeliverySpeed('express');
      useCheckoutStore.getState().setPaymentMethod('stripe');
      
      useCheckoutStore.getState().reset();
      
      const state = useCheckoutStore.getState();
      expect(state.address).toBeNull();
      expect(state.deliverySpeed).toBeNull();
      expect(state.paymentMethod).toBeNull();
    });
  });
});
```