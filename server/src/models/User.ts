// This file is generated as part of the backend implementation
// It defines the Mongoose schema for app_d8d4_users collection

import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password_hash: string;
  name: string;
  phone?: string;
  profile_picture_url?: string;
  email_verified: boolean;
  email_verification_token?: string;
  password_reset_token?: string;
  password_reset_expires?: Date;
  role: 'customer' | 'seller' | 'admin';
  oauth_provider?: 'google' | 'facebook';
  oauth_id?: string;
  loyalty_points: number;
  created_at: Date;
  updated_at: Date;
}

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password_hash: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    profile_picture_url: {
      type: String,
    },
    email_verified: {
      type: Boolean,
      default: false,
    },
    email_verification_token: {
      type: String,
    },
    password_reset_token: {
      type: String,
    },
    password_reset_expires: {
      type: Date,
    },
    role: {
      type: String,
      enum: ['customer', 'seller', 'admin'],
      default: 'customer',
    },
    oauth_provider: {
      type: String,
      enum: ['google', 'facebook'],
    },
    oauth_id: {
      type: String,
    },
    loyalty_points: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

// Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ oauth_provider: 1, oauth_id: 1 }, { unique: true });

export default mongoose.model<IUser>('User', UserSchema, 'app_d8d4_users');