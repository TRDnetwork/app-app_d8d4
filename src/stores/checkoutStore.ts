import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

interface CheckoutState {
  address: Address | null;
  deliverySpeed: 'standard' | 'express' | 'same_day';
  paymentMethod: 'stripe' | 'upi' | 'cod';
  setAddress: (address: Address) => void;
  setDeliverySpeed: (speed: 'standard' | 'express' | 'same_day') => void;
  setPaymentMethod: (method: 'stripe' | 'upi' | 'cod') => void;
  reset: () => void;
}

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set) => ({
      address: null,
      deliverySpeed: 'standard',
      paymentMethod: 'stripe',
      setAddress: (address) => set({ address }),
      setDeliverySpeed: (speed) => set({ deliverySpeed: speed }),
      setPaymentMethod: (method) => set({ paymentMethod: method }),
      reset: () => set({ address: null, deliverySpeed: 'standard', paymentMethod: 'stripe' }),
    }),
    {
      name: 'checkout-storage',
    }
  )
);