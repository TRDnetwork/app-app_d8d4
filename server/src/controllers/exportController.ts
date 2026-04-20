```ts
import { Product } from '../models/Product';
import { User } from '../models/User';
import { Order } from '../models/Order';
import { Category } from '../models/Category';
import { Address } from '../models/Address';
import { Review } from '../models/Review';
import { parse } from 'json2csv';

interface ExportResult {
  data: string | Buffer;
  contentType: string;
  contentDisposition: string;
}

interface ExportFilter {
  [key: string]: any;
}

/**
 * Export products to CSV/JSON
 */
export const exportProducts = async (
  format: 'csv' | 'json',
  filter: ExportFilter,
  user: any
): Promise<ExportResult> => {
  try {
    // Build query
    const query: any = {};
    
    if (filter.category) {
      const category = await Category.findOne({ name: filter.category });
      if (category) {
        query.category_id = category._id;
      }
    }
    
    if (filter.brand) {
      query.brand = filter.brand;
    }
    
    if (filter.status) {
      query.status = filter.status;
    }
    
    if (filter.minPrice) {
      query.price = { $gte: filter.minPrice };
    }
    
    if (filter.maxPrice) {
      query.price = { ...query.price, $lte: filter.maxPrice };
    }

    // Get products
    const products = await Product.find(query)
      .populate('category_id', 'name')
      .populate('seller_id', 'name email');

    // Format data
    const formattedProducts = products.map(product => ({
      id: product._id,
      title: product.title,
      description: product.description,
      brand: product.brand,
      category: product.category_id?.name,
      price: product.price,
      discount_percent: product.discount_percent,
      stock: product.stock,
      status: product.status,
      seller_name: product.seller_id?.name,
      seller_email: product.seller_id?.email,
      created_at: product.created_at
    }));

    // Convert to requested format
    if (format === 'csv') {
      const csv = parse(formattedProducts);
      return {
        data: csv,
        contentType: 'text/csv',
        contentDisposition: 'attachment; filename="products-export.csv"'
      };
    } else {
      return {
        data: JSON.stringify(formattedProducts, null, 2),
        contentType: 'application/json',
        contentDisposition: 'attachment; filename="products-export.json"'
      };
    }
  } catch (error: any) {
    throw new Error(`Failed to export products: ${error.message}`);
  }
};

/**
 * Export users to CSV/JSON
 */
export const exportUsers = async (
  format: 'csv' | 'json',
  filter: ExportFilter,
  user: any
): Promise<ExportResult> => {
  try {
    // Build query
    const query: any = {};
    
    if (filter.role) {
      query.role = filter.role;
    }
    
    if (filter.minCreatedDate) {
      query.created_at = { $gte: filter.minCreatedDate };
    }
    
    if (filter.maxCreatedDate) {
      query.created_at = { ...query.created_at, $lte: filter.maxCreatedDate };
    }

    // Get users
    const users = await User.find(query);

    // Format data
    const formattedUsers = users.map(user => ({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      email_verified: user.email_verified,
      profile_picture_url: user.profile_picture_url,
      created_at: user.created_at,
      updated_at: user.updated_at
    }));

    // Convert to requested format
    if (format === 'csv') {
      const csv = parse(formattedUsers);
      return {
        data: csv,
        contentType: 'text/csv',
        contentDisposition: 'attachment; filename="users-export.csv"'
      };
    } else {
      return {
        data: JSON.stringify(formattedUsers, null, 2),
        contentType: 'application/json',
        contentDisposition: 'attachment; filename="users-export.json"'
      };
    }
  } catch (error: any) {
    throw new Error(`Failed to export users: ${error.message}`);
  }
};

/**
 * Export orders to CSV/JSON
 */
export const exportOrders = async (
  format: 'csv' | 'json',
  filter: ExportFilter,
  user: any,
  isSeller = false
): Promise<ExportResult> => {
  try {
    // Build query
    const query: any = {};
    
    if (filter.status) {
      query.order_status = filter.status;
    }
    
    if (filter.minDate) {
      query.created_at = { $gte: filter.minDate };
    }
    
    if (filter.maxDate) {
      query.created_at = { ...query.created_at, $lte: filter.maxDate };
    }
    
    if (filter.minAmount) {
      query.total = { $gte: filter.minAmount };
    }
    
    if (filter.maxAmount) {
      query.total = { ...query.total, $lte: filter.maxAmount };
    }

    // Add user-specific filter for sellers
    if (isSeller) {
      query.seller_id = user.id;
    }

    // Get orders
    const orders = await Order.find(query)
      .populate('user_id', 'name email')
      .populate('items.product_id', 'title')
      .populate('address_id');

    // Format data
    const formattedOrders = orders.map(order => ({
      id: order._id,
      user_name: order.user_id?.name,
      user_email: order.user_id?.email,
      items: order.items.map(item => ({
        product_title: item.product_id?.title,
        quantity: item.quantity,
        price: item.price_at_purchase
      })),
      subtotal: order.subtotal,
      tax: order.tax,
      shipping_cost: order.shipping_cost,
      total: order.total,
      address: order.address_id ? {
        address_line1: order.address_id.addressLine1,
        address_line2: order.address_id.addressLine2,
        city: order.address_id.city,
        state: order.address_id.state,
        zip: order.address_id.zip,
        country: order.address_id.country
      } : null,
      payment_method: order.payment_method,
      payment_status: order.payment_status,
      order_status: order.order_status,
      tracking_number: order.tracking_number,
      created_at: order.created_at
    }));

    // Convert to requested format
    if (format === 'csv') {
      // For CSV, flatten the data structure
      const flattenedOrders = formattedOrders.map(order => {
        const flattened: any = {
          id: order.id,
          user_name: order.user_name,
          user_email: order.user_email,
          subtotal: order.subtotal,
          tax: order.tax,
          shipping_cost: order.shipping_cost,
          total: order.total,
          payment_method: order.payment_method,
          payment_status: order.payment_status,
          order_status: order.order_status,
          tracking_number: order.tracking_number,
          created_at: order.created_at
        };

        // Add address fields
        if (order.address) {
          flattened.address_line1 = order.address.address_line1;
          flattened.address_line2 = order.address.address_line2;
          flattened.city = order.address.city;
          flattened.state = order.address.state;
          flattened.zip = order.address.zip;
          flattened.country = order.address.country;
        }

        // Add item details
        order.items.forEach((item, index) => {
          flattened[`item_${index + 1}_title`] = item.product_title;
          flattened[`item_${index + 1}_quantity`] = item.quantity;
          flattened[`item_${index + 1}_price`] = item.price;
        });

        return flattened;
      });

      const csv = parse(flattenedOrders);
      return {
        data: csv,
        contentType: 'text/csv',
        contentDisposition: 'attachment; filename="orders-export.csv"'
      };
    } else {
      return {
        data: JSON.stringify(formattedOrders, null, 2),
        contentType: 'application/json',
        contentDisposition: 'attachment; filename="orders-export.json"'
      };
    }
  } catch (error: any) {
    throw new Error(`Failed to export orders: ${error.message}`);
  }
};
```