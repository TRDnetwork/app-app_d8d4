export interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at: string;
}

export interface DeliveryOption {
  id: 'standard' | 'express' | 'same_day';
  label: string;
  price: number;
  estimated: string;
}

export interface PaymentMethod {
  id: string;
  type: 'stripe' | 'upi' | 'cod';
  last4?: string;
  brand?: string;
}