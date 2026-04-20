import { Product } from '../models/Product';

interface JSONImportResult {
  success: boolean;
  processed: number;
  created: number;
  updated: number;
  errors: Array<{
    index: number;
    error: string;
    data: Record<string, any>;
  }>;
}

export class JSONValidator {
  /**
   * Validate and import products from JSON data
   */
  static async importFromJSON(
    data: any[] | string,
    options: { validateOnly?: boolean } = {}
  ): Promise<JSONImportResult> {
    const result: JSONImportResult = {
      success: true,
      processed: 0,
      created: 0,
      updated: 0,
      errors: []
    };

    // Parse JSON string if needed
    let products: any[];
    
    if (typeof data === 'string') {
      try {
        const parsed = JSON.parse(data);
        products = Array.isArray(parsed) ? parsed : [parsed];
      } catch (error) {
        throw new Error('Invalid JSON format');
      }
    } else {
      products = data;
    }

    // Process each product
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      result.processed++;
      
      try {
        // Validate product data
        const validatedProduct = await this.validateProduct(product, i);
        
        if (options.validateOnly) {
          // Skip database operations if validateOnly is true
          continue;
        }
        
        // Check if product exists (by title and brand)
        const existingProduct = await Product.findOne({
          title: validatedProduct.title,
          brand: validatedProduct.brand
        });
        
        if (existingProduct) {
          // Update existing product
          Object.assign(existingProduct, validatedProduct);
          await existingProduct.save();
          result.updated++;
        } else {
          // Create new product
          await Product.create(validatedProduct);
          result.created++;
        }
      } catch (error: any) {
        result.errors.push({
          index: i,
          error: error.message,
          data: product
        });
        result.success = false;
      }
    }
    
    return result;
  }

  /**
   * Validate a single product object
   */
  private static async validateProduct(product: any, index: number): Promise<any> {
    const errors: string[] = [];
    
    // Required fields
    if (!product.title?.trim()) {
      errors.push('Title is required');
    }
    
    if (!product.description?.trim()) {
      errors.push('Description is required');
    }
    
    if (!product.category?.trim()) {
      errors.push('Category is required');
    }
    
    if (!product.brand?.trim()) {
      errors.push('Brand is required');
    }
    
    // Price validation
    if (typeof product.price !== 'number' || product.price <= 0) {
      errors.push('Price must be a positive number');
    }
    
    // Original price validation
    if (product.original_price !== undefined && 
        (typeof product.original_price !== 'number' || product.original_price <= 0)) {
      errors.push('Original price must be a positive number');
    }
    
    // Discount percent validation
    if (product.discount_percent !== undefined) {
      if (typeof product.discount_percent !== 'number' || 
          product.discount_percent < 0 || 
          product.discount_percent > 100) {
        errors.push('Discount percent must be between 0 and 100');
      }
    }
    
    // Stock validation
    if (product.stock_total !== undefined && 
        (typeof product.stock_total !== 'number' || product.stock_total < 0)) {
      errors.push('Stock must be a non-negative number');
    }
    
    // Status validation
    const status = (product.status || 'draft').toLowerCase();
    if (!['active', 'draft', 'archived'].includes(status)) {
      errors.push('Status must be one of: active, draft, archived');
    }
    
    // Tags validation
    if (product.tags && !Array.isArray(product.tags)) {
      errors.push('Tags must be an array');
    }
    
    // Variants validation
    if (product.variants && !Array.isArray(product.variants)) {
      errors.push('Variants must be an array');
    } else if (product.variants) {
      for (let i = 0; i < product.variants.length; i++) {
        const variant = product.variants[i];
        
        if (!variant.sku?.trim()) {
          errors.push(`Variant ${i+1} must have a SKU`);
        }
        
        if (typeof variant.stock !== 'number' || variant.stock < 0) {
          errors.push(`Variant ${i+1} stock must be a non-negative number`);
        }
      }
    }
    
    // If we have validation errors, throw them
    if (errors.length > 0) {
      throw new Error(`Validation failed for product at index ${index}: ${errors.join(', ')}`);
    }
    
    // Calculate discount percent if not provided
    let discountPercent = product.discount_percent || 0;
    if (product.original_price && !product.discount_percent) {
      discountPercent = Math.round(((product.original_price - product.price) / product.original_price) * 100);
    }
    
    return {
      title: product.title.trim(),
      description: product.description.trim(),
      category: product.category.trim(),
      brand: product.brand.trim(),
      price: product.price,
      original_price: product.original_price,
      discount_percent: discountPercent,
      stock_total: product.stock_total || 0,
      status,
      tags: product.tags || [],
      variants: product.variants || [
        {
          sku: `SKU-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          stock: product.stock_total || 0,
          color: 'Default',
          size: 'Default'
        }
      ]
    };
  }

  /**
   * Export products to JSON format
   */
  static async exportToJSON(
    filter: any = {},
    options: { 
      includeVariants?: boolean;
      includeImages?: boolean;
    } = {}
  ): Promise<string> {
    // Build query
    const query: any = {};
    
    if (filter.category) {
      query.category = filter.category;
    }
    
    if (filter.brand) {
      query.brand = filter.brand;
    }
    
    if (filter.status) {
      query.status = filter.status;
    }
    
    if (filter.minPrice !== undefined) {
      query.price = { ...query.price, $gte: filter.minPrice };
    }
    
    if (filter.maxPrice !== undefined) {
      query.price = { ...query.price, $lte: filter.maxPrice };
    }
    
    // Execute query
    const products = await Product.find(query).lean();
    
    // Transform products for export
    const exportData = products.map(product => {
      const exportProduct: any = {
        title: product.title,
        description: product.description,
        category: product.category,
        brand: product.brand,
        price: product.price,
        original_price: product.original_price,
        discount_percent: product.discount_percent,
        stock_total: product.stock_total,
        status: product.status,
        tags: product.tags,
        created_at: product.created_at,
        updated_at: product.updated_at
      };
      
      // Include variants if requested
      if (options.includeVariants && product.variants) {
        exportProduct.variants = product.variants.map(variant => ({
          sku: variant.sku,
          stock: variant.stock,
          color: variant.color,
          size: variant.size
        }));
      }
      
      // Include images if requested
      if (options.includeImages && product.images) {
        exportProduct.images = product.images;
      }
      
      return exportProduct;
    });
    
    return JSON.stringify(exportData, null, 2);
  }
}
```

```typescript