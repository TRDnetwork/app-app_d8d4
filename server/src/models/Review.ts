// This file is generated as part of the backend implementation
// It defines the Mongoose schema for app_d8d4_reviews collection

import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  product_id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  order_id: mongoose.Types.ObjectId;
  rating: number;
  title?: string;
  comment: string;
  images: string[];
  helpful_votes: number;
  verified_purchase: boolean;
  created_at: Date;
  updated_at: Date;
}

const ReviewSchema: Schema = new Schema(
  {
    product_id: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    order_id: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      trim: true,
    },
    comment: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
      },
    ],
    helpful_votes: {
      type: Number,
      default: 0,
    },
    verified_purchase: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

// Indexes
ReviewSchema.index({ product_id: 1, created_at: -1 });
ReviewSchema.index({ user_id: 1 });
ReviewSchema.index({ rating: 1 });
ReviewSchema.index({ verified_purchase: 1 });

export default mongoose.model<IReview>('Review', ReviewSchema, 'app_d8d4_reviews');