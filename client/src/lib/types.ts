export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  images: string[];
  brand: string;
  category: string;
  stockQuantity: number;
  rating?: number;
  reviewCount?: number;
  tags?: string[];
  isFeatured?: boolean;
  isSponsored?: boolean;
  status: 'active' | 'inactive' | 'out_of_stock';
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  variant?: string;
}

export interface Address {
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

export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  address: Address;
  deliverySpeed: 'standard' | 'express' | 'same_day';
  paymentMethod: 'stripe' | 'upi' | 'cod';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  total: number;
  status: 'placed' | 'confirmed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'returned';
  trackingNumber?: string;
  estimatedDelivery?: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  sellerId: string;
  variant: string;
  quantity: number;
  price: number;
  status: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  orderId: string;
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
  helpfulVotes: number;
  verifiedPurchase: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: string;
  productId: string;
  userId: string;
  question: string;
  answer?: string;
  answeredBy?: string;
  createdAt: string;
  answeredAt?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  profilePictureUrl?: string;
  emailVerified: boolean;
  role: 'customer' | 'seller' | 'admin';
  loyaltyPoints: number;
  createdAt: string;
  updatedAt: string;
}
```

```typescript