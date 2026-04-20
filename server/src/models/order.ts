import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  user_id: mongoose.Types.ObjectId;
  order_number: string;
  items: Array<{
    product_id: mongoose.Types.ObjectId;
    seller_id: mongoose.Types.ObjectId;
    title: string;
    price: number;
    quantity: number;
    status: string;
  }>;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  delivery_speed: string;
  payment_method: string;
  payment_status: string;
  stripe_session_id?: string;
  stripe_payment_intent_id?: string;
  subtotal: number;
  discount: number;
  coupon_code?: string;
  delivery_charge: number;
  total: number;
  status: string;
  tracking_number?: string;
  estimated_delivery?: Date;
  delivered_at?: Date;
  created_at: Date;
  updated_at: Date;
}

const OrderSchema = new Schema<IOrder>({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  order_number: { type: String, required: true, unique: true },
  items: [{
    product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    seller_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    status: { 
      type: String, 
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'], 
      default: 'pending' 
    }
  }],
  address: {
    line1: { type: String, required: true },
    line2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postal_code: { type: String, required: true },
    country: { type: String, required: true }
  },
  delivery_speed: { 
    type: String, 
    enum: ['standard', 'express', 'same_day'], 
    required: true 
  },
  payment_method: { 
    type: String, 
    enum: ['stripe', 'upi', 'cod'], 
    required: true 
  },
  payment_status: { 
    type: String, 
    enum: ['pending', 'completed', 'failed', 'refunded'], 
    required: true 
  },
  stripe_session_id: { type: String, unique: true, sparse: true },
  stripe_payment_intent_id: { type: String },
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  coupon_code: { type: String },
  delivery_charge: { type: Number, required: true },
  total: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['placed', 'confirmed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'], 
    default: 'placed' 
  },
  tracking_number: { type: String },
  estimated_delivery: { type: Date },
  delivered_at: { type: Date },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Create indexes for better query performance
OrderSchema.index({ user_id: 1, created_at: -1 });
OrderSchema.index({ order_number: 1 }, { unique: true });
OrderSchema.index({ stripe_session_id: 1 }, { unique: true, sparse: true });
OrderSchema.index({ status: 1 });
OrderSchema.index({ created_at: -1 });

// Update updated_at timestamp on save
OrderSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
```

```typescript