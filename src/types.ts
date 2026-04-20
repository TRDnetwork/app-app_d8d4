export type Address = {
  _id: string;
  user_id: string;
  type: 'home' | 'work' | 'other';
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at: string;
};

export type Product = {
  _id: string;
  seller_id: string;
  title: string;
  slug: string;
  description: string;
  category_id: string;
  brand: string;
  price: number;
  original_price: number;
  discount_percent: number;
  sku: string;
  stock_quantity: number;
  images: string[];
  variants: Array<{
    name: string;
    values: string[];
    price_modifier: number;
  }>;
  tags: string[];
  is_featured: boolean;
  is_sponsored: boolean;
  status: 'active' | 'inactive' | 'out_of_stock';
  views: number;
  created_at: string;
  updated_at: string;
};

export type Review = {
  _id: string;
  product_id: string;
  user_id: string;
  order_id: string;
  rating: number;
  title: string;
  comment: string;
  images: string[];
  helpful_votes: number;
  verified_purchase: boolean;
  created_at: string;
  updated_at: string;
};

export type Order = {
  _id: string;
  user_id: string;
  order_number: string;
  items: Array<{
    product_id: string;
    seller_id: string;
    variant: string;
    quantity: number;
    price: number;
    status: string;
  }>;
  address: Address;
  delivery_speed: 'standard' | 'express' | 'same_day';
  payment_method: 'stripe' | 'upi' | 'cod';
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  subtotal: number;
  discount: number;
  coupon_code: string | null;
  delivery_charge: number;
  total: number;
  status: 'placed' | 'confirmed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'returned';
  tracking_number: string | null;
  estimated_delivery: string | null;
  delivered_at: string | null;
  created_at: string;
  updated_at: string;
};