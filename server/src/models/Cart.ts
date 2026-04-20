import { Schema, model, models } from 'mongoose';

const cartItemSchema = new Schema({
  product_id: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  variant_id: {
    type: String,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price_snapshot: {
    type: Number,
    required: true,
  },
});

const cartSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
  },
  {
    timestamps: true,
    collection: 'app_d8d4_cart',
  }
);

cartSchema.index({ user_id: 1 }, { unique: true });

export default models.Cart || model('Cart', cartSchema);