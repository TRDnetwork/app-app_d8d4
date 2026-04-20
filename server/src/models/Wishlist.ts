// This file is generated as part of the backend implementation
// It defines the Mongoose schema for app_d8d4_wishlists collection

import mongoose, { Document, Schema } from 'mongoose';

export interface IWishlist extends Document {
  user_id: mongoose.Types.ObjectId;
  product_id: mongoose.Types.ObjectId;
  added_at: Date;
}

const WishlistSchema: Schema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product_id: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
  },
  {
    timestamps: { createdAt: 'added_at' },
  }
);

// Indexes
WishlistSchema.index({ user_id: 1, product_id: 1 }, { unique: true });
WishlistSchema.index({ user_id: 1, added_at: -1 });

export default mongoose.model<IWishlist>('Wishlist', WishlistSchema, 'app_d8d4_wishlists');