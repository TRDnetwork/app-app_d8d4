// This file is generated as part of the backend implementation
// It defines the Mongoose schema for app_d8d4_products collection

import mongoose, { Document, Schema } from 'mongoose';

export interface IProductVariant {
  name: string;
  values: string[];
  price_modifier?: number;
}

export interface IProduct extends Document {
  seller_id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  category_id: mongoose.Types.ObjectId;
  brand?: string;
  price: number;
  original_price: number;
  discount_percent: number;
  sku: string;
  stock_quantity: number;
  images: string[];
  variants?: IProductVariant[];
  tags: string[];
  is_featured: boolean;
  is_sponsored: boolean;
  status: 'active' | 'inactive' | 'out_of_stock';
  views: number;
  created_at: Date;
  updated_at: Date;
}

const ProductSchema: Schema = new Schema(
  {
    seller_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
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
    description: {
      type: String,
      required: true,
    },
    category_id: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    original_price: {
      type: Number,
      required: true,
      min: 0,
    },
    discount_percent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    stock_quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    images: [
      {
        type: String,
      },
    ],
    variants: [
      {
        name: { type: String },
        values: [{ type: String }],
        price_modifier: { type: Number, default: 0 },
      },
    ],
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    is_featured: {
      type: Boolean,
      default: false,
    },
    is_sponsored: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'out_of_stock'],
      default: 'active',
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

// Indexes
ProductSchema.index({ slug: 1 }, { unique: true });
ProductSchema.index({ seller_id: 1 });
ProductSchema.index({ category_id: 1 });
ProductSchema.index({ brand: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ discount_percent: 1 });
ProductSchema.index({ is_featured: 1 });
ProductSchema.index({ is_sponsored: 1 });
ProductSchema.index({ status: 1 });
ProductSchema.index({ tags: 1 });
ProductSchema.index({ views: -1 });
ProductSchema.index({ created_at: -1 });

export default mongoose.model<IProduct>('Product', ProductSchema, 'app_d8d4_products');