// This file is generated as part of the backend implementation
// It defines the Mongoose schema for app_d8d4_banners collection

import mongoose, { Document, Schema } from 'mongoose';

export interface IBanner extends Document {
  title: string;
  image_url: string;
  link_url: string;
  order: number;
  is_active: boolean;
  start_date: Date;
  end_date: Date;
  created_at: Date;
}

const BannerSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    image_url: {
      type: String,
      required: true,
    },
    link_url: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: { createdAt: 'created_at' },
  }
);

// Indexes
BannerSchema.index({ is_active: 1, start_date: 1, end_date: 1 });
BannerSchema.index({ order: 1 });

export default mongoose.model<IBanner>('Banner', BannerSchema, 'app_d8d4_banners');