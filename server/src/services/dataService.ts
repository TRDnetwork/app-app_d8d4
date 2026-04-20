import { Product } from '../models/Product';
import { Order } from '../models/Order';
import { User } from '../models/User';
import { Category } from '../models/Category';
import { StatusCodes } from 'http-status-codes';
import { Readable } from 'stream';
import { parse } from 'csv-parse';
import { stringify } from 'csv-stringify';

interface ImportResult {
  success: boolean;
  message: string;
  imported: number;
  failed: number;
  errors: any[];
}

interface ExportOptions {
  format: 'csv' | 'json';
  filter?: any;
  fields?: string[];
}

class DataService {
  /**
   * Import products from CSV data
   * @param csvData - CSV data as a string or buffer
   * @returns Import result with statistics
   */
  static async importProductsFromCSV(csvData: string | Buffer): Promise<ImportResult> {
    const results: any[] = [];
    const errors: any[] = [];
    
    return new Promise((resolve, reject) => {
      // Parse CSV data
      const parser = parse({
        columns: true,
        skip_empty_lines: true,
        trim: true
      });

      // Process each row
      parser.on('data', (row) => {
        try {
          // Validate required fields
          if (!row.title || !row.price || !row.category) {
            throw new Error('Missing required fields: title, price, category');
          }

          // Convert price to number
          const price = parseFloat(row.price);
          if (isNaN(price) || price < 0) {
            throw new Error('Invalid price');
          }

          // Handle optional fields with defaults
          const productData = {
            title: row.title,
            description: row.description || '',
            category: row.category,
            subcategory: row.subcategory || '',
            brand: row.brand || '',
            price: price,
            original_price: row.original_price ? parseFloat(row.original_price) : price,
            images: row.images ? row.images.split(',').map((url: string) => url.trim()) : [],
            variants: row.variants ? JSON.parse(row.variants) : [],
            stock_total: parseInt(row.stock_total) || 0,
            status: row.status || 'draft',
            tags: row.tags ? row.tags.split(',').map((tag: string) => tag.trim()) : []
          };

          results.push(productData);
        } catch (error: any) {
          errors.push({
            row: row,
            error: error.message
          });
        }
      });

      parser.on('end', async () => {
        try {
          // Insert products into database
          if (results.length > 0) {
            await Product.insertMany(results);
          }
          
          resolve({
            success: true,
            message: `Successfully imported ${results.length} products`,
            imported: results.length,
            failed: errors.length,
            errors: errors
          });
        } catch (dbError: any) {
          reject({
            success: false,
            message: 'Database error during import',
            error: dbError.message
          });
        }
      });

      parser.on('error', (error) => {
        reject({
          success: false,
          message: 'Error parsing CSV file',
          error: error.message
        });
      });

      // Convert string to buffer if needed
      const buffer = typeof csvData === 'string' ? Buffer.from(csvData) : csvData;
      
      // Create readable stream from buffer
      const bufferStream = new Readable();
      bufferStream.push(buffer);
      bufferStream.push(null);
      
      // Pipe to parser
      bufferStream.pipe(parser);
    });
  }

  /**
   * Import products from JSON data
   * @param jsonData - JSON data as a string or object
   * @returns Import result with statistics
   */
  static async importProductsFromJSON(jsonData: string | object): Promise<ImportResult> {
    let products: any[];
    
    // Parse JSON if it's a string
    if (typeof jsonData === 'string') {
      try {
        products = JSON.parse(jsonData);
      } catch (error: any) {
        return {
          success: false,
          message: 'Invalid JSON format',
          imported: 0,
          failed: 0,
          errors: [{ error: error.message }]
        };
      }
    } else {
      products = jsonData as any[];
    }

    if (!Array.isArray(products)) {
      return {
        success: false,
        message: 'JSON data must be an array of products',
        imported: 0,
        failed: 0,
        errors: []
      };
    }

    const results: any[] = [];
    const errors: any[] = [];

    // Validate and process each product
    for (const product of products) {
      try {
        // Validate required fields
        if (!product.title || !product.price || !product.category) {
          throw new Error('Missing required fields: title, price, category');
        }

        // Convert price to number
        const price = parseFloat(product.price);
        if (isNaN(price) || price < 0) {
          throw new Error('Invalid price');
        }

        // Handle optional fields with defaults
        const productData = {
          title: product.title,
          description: product.description || '',
          category: product.category,
          subcategory: product.subcategory || '',
          brand: product.brand || '',
          price: price,
          original_price: product.original_price ? parseFloat(product.original_price) : price,
          images: Array.isArray(product.images) ? product.images : [],
          variants: Array.isArray(product.variants) ? product.variants : [],
          stock_total: parseInt(product.stock_total) || 0,
          status: product.status || 'draft',
          tags: Array.isArray(product.tags) ? product.tags : []
        };

        results.push(productData);
      } catch (error: any) {
        errors.push({
          product: product,
          error: error.message
        });
      }
    }

    try {
      // Insert products into database
      if (results.length > 0) {
        await Product.insertMany(results);
      }
      
      return {
        success: true,
        message: `Successfully imported ${results.length} products`,
        imported: results.length,
        failed: errors.length,
        errors: errors
      };
    } catch (dbError: any) {
      return {
        success: false,
        message: 'Database error during import',
        imported: 0,
        failed: 0,
        errors: [{ error: dbError.message }]
      };
    }
  }

  /**
   * Export products to CSV format
   * @param filter - Filter criteria for products
   * @param fields - Fields to include in export
   * @returns Readable stream of CSV data
   */
  static async exportProductsToCSV(filter: any = {}, fields?: string[]): Promise<Readable> {
    // Default fields if none specified
    const defaultFields = [
      'title', 'description', 'category', 'subcategory', 'brand', 
      'price', 'original_price', 'images', 'variants', 'stock_total', 
      'status', 'tags', 'avg_rating', 'review_count', 'created_at', 'updated_at'
    ];
    
    const exportFields = fields || defaultFields;
    
    // Fetch products from database
    const products = await Product.find(filter).lean();
    
    // Create CSV stringifier
    const stringifier = stringify({
      header: true,
      columns: exportFields
    });
    
    // Write each product to CSV
    for (const product of products) {
      const row: any = {};
      
      // Map product fields to export fields
      for (const field of exportFields) {
        switch (field) {
          case 'images':
            row[field] = product.images ? product.images.join(',') : '';
            break;
          case 'variants':
            row[field] = product.variants ? JSON.stringify(product.variants) : '';
            break;
          case 'tags':
            row[field] = product.tags ? product.tags.join(',') : '';
            break;
          case 'created_at':
          case 'updated_at':
            row[field] = product[field].toISOString();
            break;
          default:
            row[field] = product[field];
        }
      }
      
      stringifier.write(row);
    }
    
    // End the stream
    stringifier.end();
    
    return stringifier;
  }

  /**
   * Export products to JSON format
   * @param filter - Filter criteria for products
   * @returns Array of products
   */
  static async exportProductsToJSON(filter: any = {}): Promise<any[]> {
    // Fetch products from database
    const products = await Product.find(filter).lean();
    
    return products;
  }

  /**
   * Export orders to CSV format
   * @param filter - Filter criteria for orders
   * @returns Readable stream of CSV data
   */
  static async exportOrdersToCSV(filter: any = {}): Promise<Readable> {
    // Fetch orders from database with populated user and product data
    const orders = await Order.find(filter)
      .populate('user_id', 'name email')
      .populate('items.product_id', 'title')
      .lean();
    
    // Create CSV stringifier
    const stringifier = stringify({
      header: true,
      columns: [
        'order_number', 'user_name', 'user_email', 'total_amount', 'payment_status', 
        'order_status', 'delivery_speed', 'created_at', 'updated_at', 'items'
      ]
    });
    
    // Write each order to CSV
    for (const order of orders) {
      // Format items as a string
      const itemsString = order.items.map(item => 
        `${item.title} (x${item.quantity}) @ $${item.price}`
      ).join('; ');
      
      stringifier.write({
        order_number: order.order_number,
        user_name: order.user_id?.name || '',
        user_email: order.user_id?.email || '',
        total_amount: order.total_amount,
        payment_status: order.payment_status,
        order_status: order.order_status,
        delivery_speed: order.delivery_speed,
        created_at: order.created_at.toISOString(),
        updated_at: order.updated_at.toISOString(),
        items: itemsString
      });
    }
    
    // End the stream
    stringifier.end();
    
    return stringifier;
  }

  /**
   * Export users to CSV format
   * @param filter - Filter criteria for users
   * @returns Readable stream of CSV data
   */
  static async exportUsersToCSV(filter: any = {}): Promise<Readable> {
    // Fetch users from database
    const users = await User.find(filter).lean();
    
    // Create CSV stringifier
    const stringifier = stringify({
      header: true,
      columns: [
        'name', 'email', 'role', 'phone', 'email_verified', 'created_at', 'updated_at'
      ]
    });
    
    // Write each user to CSV
    for (const user of users) {
      stringifier.write({
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || '',
        email_verified: user.email_verified ? 'Yes' : 'No',
        created_at: user.created_at.toISOString(),
        updated_at: user.updated_at.toISOString()
      });
    }
    
    // End the stream
    stringifier.end();
    
    return stringifier;
  }

  /**
   * Export analytics data to CSV format
   * @param period - Time period for analytics (day, week, month, year)
   * @param startDate - Start date for analytics
   * @param endDate - End date for analytics
   * @returns Readable stream of CSV data
   */
  static async exportAnalyticsToCSV(
    period: string = 'month', 
    startDate?: Date, 
    endDate?: Date
  ): Promise<Readable> {
    // Set date range
    let start = new Date();
    let end = new Date();
    
    if (startDate && endDate) {
      start = startDate;
      end = endDate;
    } else {
      // Set default period
      switch (period) {
        case 'week':
          start.setDate(start.getDate() - 7);
          break;
        case 'month':
          start.setMonth(start.getMonth() - 1);
          break;
        case 'quarter':
          start.setMonth(start.getMonth() - 3);
          break;
        case 'year':
          start.setFullYear(start.getFullYear() - 1);
          break;
      }
    }
    
    // Aggregate order data by date
    const ordersByDate = await Order.aggregate([
      {
        $match: {
          created_at: {
            $gte: start,
            $lte: end
          }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$created_at'
            }
          },
          totalRevenue: { $sum: '$total_amount' },
          orderCount: { $sum: 1 },
          avgOrderValue: { $avg: '$total_amount' }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    
    // Create CSV stringifier
    const stringifier = stringify({
      header: true,
      columns: ['date', 'total_revenue', 'order_count', 'avg_order_value']
    });
    
    // Write each date's data to CSV
    for (const data of ordersByDate) {
      stringifier.write({
        date: data._id,
        total_revenue: data.totalRevenue.toFixed(2),
        order_count: data.orderCount,
        avg_order_value: data.avgOrderValue.toFixed(2)
      });
    }
    
    // End the stream
    stringifier.end();
    
    return stringifier;
  }
}

export default DataService;
```

```typescript