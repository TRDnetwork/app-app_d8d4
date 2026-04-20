import { create } from 'zustand';

interface Address {
  id: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  type: 'home' | 'work' | 'other';
  is_default: boolean;
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

export const useCheckoutStore = create<CheckoutState>((set) => ({
  address: null,
  deliverySpeed: null,
  paymentMethod: null,
  setAddress: (address) => set({ address }),
  setDeliverySpeed: (speed) => set({ deliverySpeed: speed }),
  setPaymentMethod: (method) => set({ paymentMethod: method }),
  reset: () => set({ address: null, deliverySpeed: null, paymentMethod: null }),
}));