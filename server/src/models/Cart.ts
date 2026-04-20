// This file is generated as part of the backend implementation
// It defines the Mongoose schema for app_d8d4_carts collection

import mongoose, { Document, Schema } from 'mongoose';

export interface ICartItem {
  product_id: mongoose.Types.ObjectId;
  variant_id?: string;
  quantity: number;
  price_snapshot: number;
}

export interface ICart extends Document {
  user_id: mongoose.Types.ObjectId;
  items: ICartItem[];
  updated_at: Date;
}

const CartSchema: Schema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    items: [
      {
        product_id: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        variant_id: {
          type: String,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price_snapshot: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
  },
  {
    timestamps: { updatedAt: 'updated_at' },
  }
);

// Indexes
CartSchema.index({ user_id: 1 }, { unique: true });

export default mongoose.model<ICart>('Cart', CartSchema, 'app_d8d4_carts');