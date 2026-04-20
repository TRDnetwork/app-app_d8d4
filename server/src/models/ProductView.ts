// This file is generated as part of the backend implementation
// It defines the Mongoose schema for app_d8d4_product_views collection

import mongoose, { Document, Schema } from 'mongoose';

export interface IProductView extends Document {
  user_id?: mongoose.Types.ObjectId;
  product_id: mongoose.Types.ObjectId;
  viewed_at: Date;
}

const ProductViewSchema: Schema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    product_id: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
  },
  {
    timestamps: { createdAt: 'viewed_at' },
  }
);

// Indexes
ProductViewSchema.index({ user_id: 1, viewed_at: -1 });
ProductViewSchema.index({ product_id: 1, viewed_at: -1 });
ProductViewSchema.index({ viewed_at: -1 });

export default mongoose.model<IProductView>('ProductView', ProductViewSchema, 'app_d8d4_product_views');