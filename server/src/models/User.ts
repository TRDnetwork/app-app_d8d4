import { Schema, model, models } from 'mongoose';
import { Role } from '../types';

const userSchema = new Schema(
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
    role: {
      type: String,
      enum: ['customer', 'seller', 'admin'],
      default: 'customer',
    },
    email_verified: {
      type: Boolean,
      default: false,
    },
    email_verification_token: {
      type: String,
    },
    email_verification_expires: {
      type: Date,
    },
    password_reset_token: {
      type: String,
    },
    password_reset_expires: {
      type: Date,
    },
    oauth_provider: {
      type: String,
      enum: ['google', 'facebook'],
    },
    oauth_id: {
      type: String,
      sparse: true,
    },
    last_login: {
      type: Date,
    },
  },
  {
    timestamps: true,
    collection: 'app_d8d4_users',
  }
);

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ oauth_id: 1 }, { sparse: true });

export default models.User || model('User', userSchema);