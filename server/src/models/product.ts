import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  seller_id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  category_id: mongoose.Types.ObjectId;
  brand: string;
  price: number;
  original_price: number;
  discount_percent: number;
  sku: string;
  stock_quantity: number;
  images: string[];
  variants: Array<{
    name: string;
    values: string[];
    price_modifier?: number;
  }>;
  tags: string[];
  is_featured: boolean;
  is_sponsored: boolean;
  status: string;
  views: number;
  created_at: Date;
  updated_at: Date;
}

const ProductSchema = new Schema<IProduct>({
  seller_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  category_id: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  brand: { type: String },
  price: { type: Number, required: true },
  original_price: { type: Number },
  discount_percent: { type: Number, min: 0, max: 100 },
  sku: { type: String },
  stock_quantity: { type: Number, required: true, min: 0 },
  images: [{ type: String, required: true }],
  variants: [{
    name: { type: String, required: true },
    values: [{ type: String, required: true }],
    price_modifier: { type: Number }
  }],
  tags: [{ type: String }],
  is_featured: { type: Boolean, default: false },
  is_sponsored: { type: Boolean, default: false },
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'out_of_stock'], 
    default: 'active' 
  },
  views: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Create indexes for better query performance
ProductSchema.index({ slug: 1 }, { unique: true });
ProductSchema.index({ category_id: 1 });
ProductSchema.index({ seller_id: 1 });
ProductSchema.index({ brand: 1 });
ProductSchema.index({ status: 1 });
ProductSchema.index({ is_featured: 1 });
ProductSchema.index({ views: -1 });
ProductSchema.index({ created_at: -1 });

// Update updated_at timestamp on save
ProductSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
```

```typescript