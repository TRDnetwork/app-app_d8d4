export interface Address {
  _id: string;
  type: 'home' | 'work' | 'other';
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
}

export interface Product {
  _id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  original_price: number;
  discount_percent: number;
  images: string[];
  brand: string;
  category_id: string;
  stock_quantity: number;
  variants: Array<{
    name: string;
    values: string[];
    price_modifier: number;
  }>;
  tags: string[];
  is_featured: boolean;
  status: 'active' | 'inactive' | 'out_of_stock';
}

export interface Review {
  _id: string;
  rating: number;
  title: string;
  comment: string;
  images: string[];
  helpful_votes: number;
  verified_purchase: boolean;
  created_at: string;
  user: {
    name: string;
    profile_picture_url?: string;
  };
}

export interface Question {
  _id: string;
  question: string;
  answer?: string;
  answered_by?: string;
  created_at: string;
  user: {
    name: string;
  };
}