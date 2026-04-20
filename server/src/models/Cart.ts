import mongoose, { Document, Schema } from 'mongoose';

export interface ICartItem {
  productId: mongoose.Types.ObjectId;
  quantity: number;
  variant?: {
    size?: string;
    color?: string;
    sku: string;
  };
}

export interface ICart extends Document {
  userId: mongoose.Types.ObjectId;
  items: ICartItem[];
  updatedAt: Date;
  createdAt: Date;
}

const CartSchema = new Schema<ICart>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
          max: 99,
        },
        variant: {
          size: String,
          color: String,
          sku: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for user cart lookup
CartSchema.index({ userId: 1 });

export default mongoose.model<ICart>('Cart', CartSchema);