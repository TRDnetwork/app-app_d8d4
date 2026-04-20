import { create } from 'zustand';

interface Address {
  _id: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  type: 'home' | 'work' | 'other';
}

interface CheckoutState {
  address: Address | null;
  deliverySpeed: 'standard' | 'express' | 'same_day' | null;
  paymentMethod: 'stripe' | 'upi' | 'cod' | null;
  setAddress: (address: Address) => void;
  setDeliverySpeed: (speed: 'standard' | 'express' | 'same_day') => void;
  setPaymentMethod: (method: 'stripe' | 'upi' | 'cod') => void;
  reset: () => void;
}

export const checkoutStore = create<CheckoutState>((set) => ({
  address: null,
  deliverySpeed: null,
  paymentMethod: null,
  setAddress: (address) => set({ address }),
  setDeliverySpeed: (speed) => set({ deliverySpeed: speed }),
  setPaymentMethod: (method) => set({ paymentMethod: method }),
  reset: () => set({ address: null, deliverySpeed: null, paymentMethod: null }),
}));