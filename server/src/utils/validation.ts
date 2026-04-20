import { z } from 'zod';

// Common validation schemas
export const emailSchema = z.string().email({ message: 'Invalid email address' });
export const passwordSchema = z
  .string()
  .min(8, { message: 'Password must be at least 8 characters' })
  .regex(/[a-z]/, { message: 'Password must contain a lowercase letter' })
  .regex(/[A-Z]/, { message: 'Password must contain an uppercase letter' })
  .regex(/[0-9]/, { message: 'Password must contain a number' })
  .regex(/[^a-zA-Z0-9]/, { message: 'Password must contain a special character' });

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: emailSchema,
  password: passwordSchema,
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const addressSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zip: z.string().min(1, 'ZIP code is required'),
  country: z.string().min(1, 'Country is required'),
  is_default: z.boolean().optional(),
});

export const productSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Category is required'),
  brand: z.string().optional(),
  price: z.number().positive('Price must be greater than 0'),
  original_price: z.number().optional(),
  discount_percent: z.number().min(0).max(100).optional(),
  variants: z
    .array(
      z.object({
        size: z.string().optional(),
        color: z.string().optional(),
        sku: z.string().min(1),
        stock: z.number().int().nonnegative(),
      })
    )
    .optional(),
  stock_total: z.number().int().nonnegative(),
  status: z.enum(['active', 'draft', 'archived']),
  tags: z.array(z.string()).optional(),
});

export const orderSchema = z.object({
  items: z.array(
    z.object({
      product_id: z.string().length(24, 'Invalid product ID'),
      variant: z.object({}).optional(),
      quantity: z.number().int().positive(),
      price: z.number().positive(),
    })
  ),
  total_amount: z.number().positive(),
  delivery_fee: z.number().nonnegative(),
  tax_amount: z.number().nonnegative(),
  payment_method: z.enum(['card', 'upi', 'cod']),
  address: addressSchema,
  delivery_speed: z.enum(['standard', 'express', 'same-day']),
  coupon_code: z.string().optional(),
});