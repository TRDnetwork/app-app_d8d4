import { Schema, model, models } from 'mongoose';

const reviewSchema = new Schema(
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
    timestamps: true,
    collection: 'app_d8d4_reviews',
  }
);

reviewSchema.index({ product_id: 1, created_at: -1 });
reviewSchema.index({ user_id: 1 });

export default models.Review || model('Review', reviewSchema);