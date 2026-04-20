import { create } from 'zustand';
import { Address, DeliveryOption, PaymentMethod } from '../types';

interface CheckoutState {
  currentStep: number;
  addresses: Address[];
  selectedAddress: Address | null;
  deliveryOption: DeliveryOption | null;
  paymentMethod: PaymentMethod | null;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  setAddresses: (addresses: Address[]) => void;
  selectAddress: (id: string) => void;
  addAddress: (address: Address) => void;
  selectDeliveryOption: (id: string) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  selectPaymentMethod: (type: string) => void;
}

export const useCheckoutStore = create<CheckoutState>((set, get) => ({
  currentStep: 1,
  addresses: [],
  selectedAddress: null,
  deliveryOption: null,
  paymentMethod: null,

  goToNextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 4) })),
  goToPreviousStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),

  setAddresses: (addresses) => set({ addresses }),
  selectAddress: (id) => {
    const address = get().addresses.find((a) => a.id === id);
    if (address) set({ selectedAddress: address });
  },
  addAddress: (address) => set((state) => ({ addresses: [...state.addresses, address] })),

  selectDeliveryOption: (id) => {
    const options = [
      { id: 'standard', label: 'Standard Delivery', price: 0, estimated: '5-7 business days' },
      { id: 'express', label: 'Express Delivery', price: 9.99, estimated: '2-3 business days' },
      { id: 'same_day', label: 'Same Day Delivery', price: 19.99, estimated: 'Delivered today' },
    ];
    const option = options.find((o) => o.id === id);
    if (option) set({ deliveryOption: option });
  },

  setPaymentMethod: (method) => set({ paymentMethod: method }),
  selectPaymentMethod: (type) => {
    if (type === 'stripe') {
      // Payment handled by Stripe Elements
    } else {
      set({ paymentMethod: { type, id: type } });
    }
  },
}));

export const CheckoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};