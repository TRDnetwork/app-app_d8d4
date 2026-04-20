import mongoose, { Document, Schema } from 'mongoose';

export interface IWishlist extends Document {
  userId: mongoose.Types.ObjectId;
  productIds: mongoose.Types.ObjectId[];
  updatedAt: Date;
  createdAt: Date;
}

const WishlistSchema = new Schema<IWishlist>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    productIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for user wishlist lookup
WishlistSchema.index({ userId: 1 });

export default mongoose.model<IWishlist>('Wishlist', WishlistSchema);