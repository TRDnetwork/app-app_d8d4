// This file is generated as part of the backend implementation
// It defines the Mongoose schema for app_d8d4_orders collection

import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderItem {
  product_id: mongoose.Types.ObjectId;
  seller_id: mongoose.Types.ObjectId;
  variant: string;
  quantity: number;
  price: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
}

export interface IOrderAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface IOrder extends Document {
  user_id: mongoose.Types.ObjectId;
  order_number: string;
  items: IOrderItem[];
  address: IOrderAddress;
  delivery_speed: 'standard' | 'express' | 'same_day';
  payment_method: 'stripe' | 'upi' | 'cod';
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  stripe_session_id?: string;
  stripe_payment_intent_id?: string;
  subtotal: number;
  discount: number;
  coupon_code?: string;
  delivery_charge: number;
  total: number;
  status: 'placed' | 'confirmed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'returned';
  tracking_number?: string;
  estimated_delivery?: Date;
  delivered_at?: Date;
  created_at: Date;
  updated_at: Date;
}

const OrderSchema: Schema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    order_number: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    items: [
      {
        product_id: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        seller_id: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        variant: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
        status: {
          type: String,
          enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned'],
          default: 'pending',
        },
      },
    ],
    address: {
      line1: { type: String, required: true },
      line2: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postal_code: { type: String, required: true },
      country: { type: String, required: true },
    },
    delivery_speed: {
      type: String,
      enum: ['standard', 'express', 'same_day'],
      required: true,
    },
    payment_method: {
      type: String,
      enum: ['stripe', 'upi', 'cod'],
      required: true,
    },
    payment_status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    stripe_session_id: {
      type: String,
    },
    stripe_payment_intent_id: {
      type: String,
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    coupon_code: {
      type: String,
      trim: true,
    },
    delivery_charge: {
      type: Number,
      required: true,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['placed', 'confirmed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'],
      default: 'placed',
    },
    tracking_number: {
      type: String,
      trim: true,
    },
    estimated_delivery: {
      type: Date,
    },
    delivered_at: {
      type: Date,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

// Indexes
OrderSchema.index({ user_id: 1, created_at: -1 });
OrderSchema.index({ order_number: 1 }, { unique: true });
OrderSchema.index({ stripe_session_id: 1 }, { unique: true, sparse: true });
OrderSchema.index({ stripe_payment_intent_id: 1 }, { unique: true, sparse: true });
OrderSchema.index({ status: 1 });
OrderSchema.index({ created_at: -1 });

export default mongoose.model<IOrder>('Order', OrderSchema, 'app_d8d4_orders');