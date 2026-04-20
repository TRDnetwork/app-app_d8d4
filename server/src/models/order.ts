import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  user_id: Schema.Types.ObjectId;
  order_number: string;
  items: Array<{
    product_id: Schema.Types.ObjectId;
    variant_id?: string;
    quantity: number;
    price: number;
    seller_id: Schema.Types.ObjectId;
  }>;
  total_amount: number;
  discount_amount?: number;
  delivery_fee: number;
  tax_amount?: number;
  payment_method: string;
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  order_status: 'placed' | 'confirmed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone: string;
  };
  tracking_number?: string;
  delivery_speed: string;
  coupon_code?: string;
  created_at: Date;
  updated_at: Date;
  delivered_at?: Date;
  cancelled_at?: Date;
}

const OrderSchema = new Schema<IOrder>({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  order_number: { type: String, required: true, unique: true },
  items: [{
    product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    variant_id: { type: String },
    quantity: { type: Number, required: true },
    price: { type: Number,