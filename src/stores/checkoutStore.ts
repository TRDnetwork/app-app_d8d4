import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from './cartStore';

interface Address {
  _id?: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  label?: string;
}

interface DeliveryOption {
  id: string;
  label: string;
  description: string;
  price: number;
}

interface CheckoutState {
  address: Address | null;
  deliveryOption: DeliveryOption | null;
  paymentMethod: 'card' | 'upi' | 'cod' | null;
  cartItems: CartItem[];
  cartTotal: number;
  setAddress: (address: Address) => void;
  setDeliveryOption: (option: DeliveryOption) => void;
  setPaymentMethod: (method: 'card' | 'upi' | 'cod') => void;
  setCartItems: (items: CartItem[]) => void;
  clearCheckout: () => void;
}

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set, get) => ({
      address: null,
      deliveryOption: null,
      paymentMethod: null,
      cartItems: [],
      cartTotal: 0,
      setAddress: (address) => set({ address }),
      setDeliveryOption: (deliveryOption) => set({ deliveryOption }),
      setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
      setCartItems: (cartItems) => {
        const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        set({ cartItems, cartTotal });
      },
      clearCheckout: () => set({
        address: null,
        deliveryOption: null,
        paymentMethod: null,
        cartItems: [],
        cartTotal: 0,
      }),
    }),
    {
      name: 'checkout-storage',
    }
  )
);