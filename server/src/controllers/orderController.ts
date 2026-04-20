import { Request, Response } from 'express';
import { Order } from '../models/order';
import { Product } from '../models/product';
import { User } from '../models/user';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../utils/validator';

// Create order
export const createOrder = [
  authenticate,
  authorize(['customer', 'seller', 'admin']),
  async (req: Request, res: Response) => {
    try {
      // Validate request body
      const validationRules = {
        items: 'required|array|min:1',
        items.*.product_id: 'required|string',
        items.*.quantity: 'required|integer|min:1',
        address: 'required|object',
        delivery_speed: 'required|string|in:standard,express,same_day',
        payment_method: 'required|string|in:stripe,upi,cod',
        coupon_code: 'optional|string',
      };
      
      const errors = validate(req.body, validationRules);
      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
      }
      
      const { items, address, delivery_speed, payment_method, coupon_code } = req.body;
      
      // Validate products and calculate total
      let orderItems = [];
      let subtotal = 0;
      
      for (const item of items) {
        const product = await Product.findById(item.product_id);
        if (!product) {
          return res.status(404).json({ error: `Product ${item.product_id} not found` });
        }
        
        if (product.stock_quantity < item.quantity) {
          return res.status(400).json({ error: `Insufficient stock for ${product.title}` });
        }
        
        const price = product.price;
        const lineTotal = price * item.quantity;
        subtotal += lineTotal;
        
        orderItems.push({
          product_id: product._id,
          seller_id: product.seller_id,
          title: product.title,
          price: price,
          quantity: item.quantity,
          status: 'placed',
        });
      }
      
      // Apply coupon if provided
      let discount = 0;
      if (coupon_code) {
        const coupon = await Coupon.findOne({ 
          code: coupon_code, 
          is_active: true,
          valid_from: { $lte: new Date() },
          valid_until: { $gte: new Date() },
          used_count: { $lt: '$usage_limit' }
        });
        
        if (coupon && subtotal >= coupon.min_order_value) {
          if (coupon.type === 'percentage') {
            discount = Math.min(
              (subtotal * coupon.value) / 100,
              coupon.max_discount || subtotal
            );
          } else if (coupon.type === 'fixed') {
            discount = Math.min(coupon.value, subtotal);
          }
        }
      }
      
      // Calculate delivery charge
      const deliveryCharge = delivery_speed === 'standard' ? 0 : 
                            delivery_speed === 'express' ? 9.99 : 19.99;
      
      const total = Math.max(0, subtotal - discount + deliveryCharge);
      
      // Create order
      const order = new Order({
        user_id: req.user._id,
        order_number: `ORD-${Date.now()}`,
        items: orderItems,
        address: address,
        delivery_speed: delivery_speed,
        payment_method: payment_method,
        payment_status: payment_method === 'cod' ? 'pending' : 'completed',
        subtotal: subtotal,
        discount: discount,
        coupon_code: coupon_code,
        delivery_charge: deliveryCharge,
        total: total,
        status: 'placed',
        created_at: new Date(),
      });
      
      await order.save();
      
      // Update product stock
      for (const item of items) {
        await Product.updateOne(
          { _id: item.product_id },
          { $inc: { stock_quantity: -item.quantity } }
        );
      }
      
      // Update coupon usage if applicable
      if (coupon_code) {
        await Coupon.updateOne(
          { code: coupon_code },
          { $inc: { used_count: 1 } }
        );
      }
      
      res.status(201).json({ order_id: order._id, order_number: order.order_number });
    } catch (error: any) {
      console.error('Error creating order:', error);
      res.status(500).json({ error: 'Failed to create order' });
    }
  }
];

// Get user orders
export const getUserOrders = [
  authenticate,
  async (req: Request, res: Response) => {
    try {
      const orders = await Order.find({ user_id: req.user._id })
        .sort({ created_at: -1 })
        .limit(50);
      
      res.json({ orders });
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  }
];

// Get order by ID
export const getOrder = [
  authenticate,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      // Validate ID format
      if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        return res.status(400).json({ error: 'Invalid order ID' });
      }
      
      const order = await Order.findById(id);
      
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      
      // Check if user owns the order
      if (order.user_id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden: You do not have access to this order' });
      }
      
      res.json({ order });
    } catch (error: any) {
      console.error('Error fetching order:', error);
      res.status(500).json({ error: 'Failed to fetch order' });
    }
  }
];
```

```typescript