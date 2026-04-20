import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  variant?: string;
  quantity: number;
  price: number;
  sellerId: mongoose.Types.ObjectId;
}

export interface IAddress {
  label: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  orderNumber: string;
  items: IOrderItem[];
  totalAmount: number;
  discountAmount?: number;
  deliveryFee: number;
  taxAmount?: number;
  paymentMethod?: string;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  orderStatus: 'placed' | 'confirmed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';
  address: IAddress;
  trackingNumber?: string;
  deliverySpeed: string;
  couponCode?: string;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  createdAt: Date;
  updatedAt: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    orderNumber: { type: String, unique: true, required: true },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        variant: { type: String },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        sellerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    discountAmount: { type: Number },
    deliveryFee: { type: Number, required: true },
    taxAmount: { type: Number },
    paymentMethod: { type: String },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    orderStatus: {
      type: String,
      enum: ['placed', 'confirmed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'],
      default: 'placed',
    },
    address: {
      label: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zip: { type: String, required: true },
      country: { type: String, required: true },
    },
    trackingNumber: { type: String },
    deliverySpeed: { type: String, required: true },
    couponCode: { type: String },
    stripeSessionId: { type: String },
    stripePaymentIntentId: { type: String },
    deliveredAt: { type: Date },
    cancelledAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

// Index for user orders and order number lookup
OrderSchema.index({ userId: 1, createdAt: -1 });
OrderSchema.index({ orderNumber: 1 }, { unique: true });

// Generate order number before saving
OrderSchema.pre('save', function (next) {
  if (!this.orderNumber) {
    this.orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
  next();
});

export default mongoose.model<IOrder>('Order', OrderSchema);