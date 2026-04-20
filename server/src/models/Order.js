import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  order_number: {
    type: String,
    unique: true,
    required: true
  },
  items: [{
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    seller_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    variant: {
      name: String,
      value: String
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['placed', 'confirmed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'],
      default: 'placed'
    }
  }],
  address: {
    type: {
      type: String,
      enum: ['home', 'work', 'other']
    },
    line1: String,
    line2: String,
    city: String,
    state: String,
    postal_code: String,
    country: String
  },
  delivery_speed: {
    type: String,
    enum: ['standard', 'express', 'same_day'],
    default: 'standard'
  },
  payment_method: {
    type: String,
    enum: ['stripe', 'upi', 'cod'],
    required: true
  },
  payment_status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  stripe_session_id: {
    type: String,
    index: true
  },
  stripe_payment_intent_id: {
    type: String,
    index: true
  },
  subtotal: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    default: 0
  },
  coupon_code: {
    type: String
  },
  delivery_charge: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['placed', 'confirmed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'],
    default: 'placed'
  },
  tracking_number: String,
  estimated_delivery: Date,
  delivered_at: Date,
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'app_d8d4_orders'
});

// Add indexes for better query performance
orderSchema.index({ user_id: 1, created_at: -1 });
orderSchema.index({ stripe_session_id: 1 }, { unique: true });
orderSchema.index({ order_number: 1 }, { unique: true });
orderSchema.index({ status: 1, created_at: -1 });

// Generate order number before save
orderSchema.pre('save', async function(next) {
  if (this.isNew && !this.order_number) {
    // Generate unique order number (e.g., ORD-20240101-001)
    const date = new Date();
    const dateStr = date.getFullYear().toString() + 
                   (date.getMonth() + 1).toString().padStart(2, '0') + 
                   date.getDate().toString().padStart(2, '0');
    
    // Find today's highest order number
    const todayOrders = await this.constructor
      .find({ order_number: new RegExp(`^ORD-${dateStr}`) })
      .sort({ order_number: -1 })
      .limit(1);
    
    let sequence = 1;
    if (todayOrders.length > 0) {
      const lastOrderNum = todayOrders[0].order_number;
      const lastSequence = parseInt(lastOrderNum.split('-').pop());
      sequence = lastSequence + 1;
    }
    
    this.order_number = `ORD-${dateStr}-${sequence.toString().padStart(3, '0')}`;
  }
  next();
});

export const Order = mongoose.model('Order', orderSchema);