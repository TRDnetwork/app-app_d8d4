import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  productId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
  helpfulVotes: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    title: {
      type: String,
      maxlength: [100, 'Review title cannot exceed 100 characters'],
    },
    comment: {
      type: String,
      required: [true, 'Comment is required'],
      maxlength: [1000, 'Review comment cannot exceed 1000 characters'],
    },
    images: [
      {
        type: String,
      },
    ],
    helpfulVotes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Compound index for product reviews and user reviews
ReviewSchema.index({ productId: 1, createdAt: -1 });
ReviewSchema.index({ userId: 1, createdAt: -1 });
ReviewSchema.index({ productId: 1, userId: 1 }, { unique: true }); // One review per user per product

export default mongoose.model<IReview>('Review', ReviewSchema);