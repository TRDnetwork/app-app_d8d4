import { Schema, model, models } from 'mongoose';

const variantSchema = new Schema({
  size: String,
  color: String,
  sku: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    default: 0,
  },
});

const productSchema = new Schema(
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
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    subcategory: {
      type: String,
    },
    brand: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    original_price: {
      type: Number,
      min: 0,
    },
    discount_percent: {
      type: Number,
      min: 0,
      max: 100,
    },
    images: [
      {
        type: String,
      },
    ],
    variants: [variantSchema],
    stock_total: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['active', 'draft', 'archived'],
      default: 'draft',
    },
    avg_rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    review_count: {
      type: Number,
      default: 0,
    },
    view_count: {
      type: Number,
      default: 0,
    },
    tags: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
    collection: 'app_d8d4_products',
  }
);

productSchema.index({ seller_id: 1 });
productSchema.index({ category: 1 });
productSchema.index({ status: 1 });
productSchema.index({ avg_rating: -1 });
productSchema.index({ created_at: -1 });
productSchema.index({ title: 'text', description: 'text', brand: 'text', category: 'text' });

export default models.Product || model('Product', productSchema);