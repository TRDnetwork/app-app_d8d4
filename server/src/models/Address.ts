// This file is generated as part of the backend implementation
// It defines the Mongoose schema for app_d8d4_addresses collection

import mongoose, { Document, Schema } from 'mongoose';

export interface IAddress extends Document {
  user_id: mongoose.Types.ObjectId;
  type: 'home' | 'work' | 'other';
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at: Date;
}

const AddressSchema: Schema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['home', 'work', 'other'],
      default: 'home',
    },
    line1: {
      type: String,
      required: true,
      trim: true,
    },
    line2: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    postal_code: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    is_default: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: 'created_at' },
  }
);

// Indexes
AddressSchema.index({ user_id: 1 });
AddressSchema.index({ user_id: 1, is_default: 1 });

export default mongoose.model<IAddress>('Address', AddressSchema, 'app_d8d4_addresses');