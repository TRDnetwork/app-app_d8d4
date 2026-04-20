// This file is generated as part of the backend implementation
// It defines the Mongoose schema for app_d8d4_seller_applications collection

import mongoose, { Document, Schema } from 'mongoose';

export interface ISellerApplication extends Document {
  user_id: mongoose.Types.ObjectId;
  business_name: string;
  business_address: string;
  tax_id: string;
  phone: string;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string;
  submitted_at: Date;
  reviewed_at?: Date;
}

const SellerApplicationSchema: Schema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    business_name: {
      type: String,
      required: true,
      trim: true,
    },
    business_address: {
      type: String,
      required: true,
      trim: true,
    },
    tax_id: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    rejection_reason: {
      type: String,
      trim: true,
    },
    submitted_at: {
      type: Date,
      required: true,
    },
    reviewed_at: {
      type: Date,
    },
  },
  {
    timestamps: false,
  }
);

// Indexes
SellerApplicationSchema.index({ user_id: 1 }, { unique: true });
SellerApplicationSchema.index({ status: 1 });
SellerApplicationSchema.index({ submitted_at: -1 });

export default mongoose.model<ISellerApplication>('SellerApplication', SellerApplicationSchema, 'app_d8d4_seller_applications');