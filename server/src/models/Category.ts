// This file is generated as part of the backend implementation
// It defines the Mongoose schema for app_d8d4_categories collection

import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  parent_id?: mongoose.Types.ObjectId;
  image_url?: string;
  order: number;
  created_at: Date;
}

const CategorySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    parent_id: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
    image_url: {
      type: String,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: { createdAt: 'created_at' },
  }
);

// Indexes
CategorySchema.index({ slug: 1 }, { unique: true });
CategorySchema.index({ parent_id: 1 });

export default mongoose.model<ICategory>('Category', CategorySchema, 'app_d8d4_categories');