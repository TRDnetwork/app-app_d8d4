import Queue from 'bull';
import { logger } from '../utils/logger';
import { config } from '../config/env';

// SECURITY FIX: Use environment variable for Redis connection
const redisConfig = {
  host: config.REDIS_HOST || 'localhost',
  port: config.REDIS_PORT || 6379,
  password: config.REDIS_PASSWORD,
  tls: config.REDIS_TLS === 'true' ? {} : undefined
};

// Create queues for import and export jobs
export const importQueue = new Queue('import', {
  redis: redisConfig,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000
    },
    removeOnComplete: true,
    removeOnFail: true
  }
});

export const exportQueue = new Queue('export', {
  redis: redisConfig,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000
    },
    removeOnComplete: true,
    removeOnFail: true
  }
});

// Process import jobs
importQueue.process('import', async (job) => {
  try {
    // Update job status
    await job.update({
      status: 'processing',
      updatedAt: new Date()
    });

    logger.info('Processing import job', { jobId: job.id });

    // SECURITY FIX: Validate file path
    if (!job.data.filePath || !job.data.filePath.startsWith('/tmp/shopsphere-imports/')) {
      throw new Error('Invalid file path');
    }

    // SECURITY FIX: Validate file exists
    const fs = require('fs');
    if (!fs.existsSync(job.data.filePath)) {
      throw new Error('File not found');
    }

    // Parse file content based on MIME type
    let parsedData;
    if (job.data.mimeType === 'text/csv') {
      const CSVParser = require('../utils/csvParser');
      parsedData = await CSVParser.parseFile(job.data.filePath);
    } else if (job.data.mimeType === 'application/json') {
      const JSONValidator = require('../utils/jsonValidator');
      const content = fs.readFileSync(job.data.filePath, 'utf8');
      parsedData = JSONValidator.validate(content);
    } else {
      throw new Error('Invalid file type');
    }

    // SECURITY FIX: Validate parsed data
    if (!Array.isArray(parsedData) || parsedData.length === 0) {
      throw new Error('No data to import');
    }

    // Transform data based on entity type
    const transformedData = transformData(parsedData, job.data.entityType);

    // SECURITY FIX: Validate transformed data
    if (!Array.isArray(transformedData) || transformedData.length === 0) {
      throw new Error('No valid data to import');
    }

    // Import data to database
    const result = await importToDatabase(transformedData, job.data.entityType, job.data.userId);

    // Update job status
    await job.update({
      status: 'completed',
      progress: 100,
      result: result,
      updatedAt: new Date()
    });

    logger.info('Import job completed', { 
      jobId: job.id, 
      importedCount: result.importedCount,
      failedCount: result.failedCount
    });

    return result;
  } catch (error: any) {
    logger.error('Error processing import job:', error);

    // Update job status
    await job.update({
      status: 'failed',
      error: error.message,
      updatedAt: new Date()
    });

    throw error;
  }
});

// Process export jobs
exportQueue.process('export', async (job) => {
  try {
    // Update job status
    await job.update({
      status: 'processing',
      updatedAt: new Date()
    });

    logger.info('Processing export job', { jobId: job.id });

    // Query data from database based on filters
    const data = await queryData(job.data.entityType, job.data.filters);

    // SECURITY FIX: Validate data
    if (!Array.isArray(data)) {
      throw new Error('Invalid data format');
    }

    // Transform data for export
    const transformedData = transformExportData(data, job.data.entityType);

    // Export data to file based on format
    let fileUrl;
    if (job.data.format === 'csv') {
      fileUrl = await exportToCSV(transformedData, job.data.entityType, job.id);
    } else if (job.data.format === 'json') {
      fileUrl = await exportToJSON(transformedData, job.data.entityType, job.id);
    } else {
      throw new Error('Invalid export format');
    }

    // Update job status
    await job.update({
      status: 'completed',
      progress: 100,
      fileUrl: fileUrl,
      result: {
        exportedCount: transformedData.length
      },
      updatedAt: new Date()
    });

    logger.info('Export job completed', { 
      jobId: job.id, 
      exportedCount: transformedData.length,
      fileUrl: fileUrl
    });

    return { fileUrl, count: transformedData.length };
  } catch (error: any) {
    logger.error('Error processing export job:', error);

    // Update job status
    await job.update({
      status: 'failed',
      error: error.message,
      updatedAt: new Date()
    });

    throw error;
  }
});

// Helper function to transform data based on entity type
const transformData = (data: any[], entityType: string): any[] => {
  return data.map((row, index) => {
    const transformed: any = {};
    
    switch (entityType) {
      case 'products':
        transformed.title = row.title?.trim();
        transformed.slug = row.slug?.trim() || generateSlug(row.title);
        transformed.description = row.description?.trim();
        transformed.price = parseFloat(row.price) || 0;
        transformed.original_price = parseFloat(row.original_price) || 0;
        transformed.discount_percent = parseFloat(row.discount_percent) || 0;
        transformed.sku = row.sku?.trim();
        transformed.stock_quantity = parseInt(row.stock_quantity) || 0;
        transformed.brand = row.brand?.trim();
        transformed.category_id = row.category_id;
        transformed.seller_id = row.seller_id;
        transformed.status = row.status || 'active';
        transformed.is_featured = row.is_featured === 'true' || row.is_featured === true;
        transformed.is_sponsored = row.is_sponsored === 'true' || row.is_sponsored === true;
        transformed.created_at = new Date();
        transformed.updated_at = new Date();
        break;
        
      case 'users':
        transformed.email = row.email?.trim().toLowerCase();
        transformed.name = row.name?.trim();
        transformed.phone = row.phone?.trim();
        transformed.role = row.role || 'customer';
        transformed.profile_picture_url = row.profile_picture_url?.trim();
        transformed.email_verified = row.email_verified === 'true' || row.email_verified === true;
        transformed.loyalty_points = parseInt(row.loyalty_points) || 0;
        transformed.created_at = new Date();
        transformed.updated_at = new Date();
        break;
        
      case 'orders':
        transformed.user_id = row.user_id;
        transformed.order_number = row.order_number?.trim();
        transformed.items = JSON.parse(row.items || '[]');
        transformed.address = JSON.parse(row.address || '{}');
        transformed.delivery_speed = row.delivery_speed || 'standard';
        transformed.payment_method = row.payment_method || 'stripe';
        transformed.subtotal = parseFloat(row.subtotal) || 0;
        transformed.discount = parseFloat(row.discount) || 0;
        transformed.delivery_charge = parseFloat(row.delivery_charge) || 0;
        transformed.total = parseFloat(row.total) || 0;
        transformed.status = row.status || 'placed';
        transformed.tracking_number = row.tracking_number?.trim();
        transformed.created_at = new Date();
        transformed.updated_at = new Date();
        break;
        
      case 'categories':
        transformed.name = row.name?.trim();
        transformed.slug = row.slug?.trim() || generateSlug(row.name);
        transformed.parent_id = row.parent_id;
        transformed.image_url = row.image_url?.trim();
        transformed.order = parseInt(row.order) || 0;
        transformed.created_at = new Date();
        transformed.updated_at = new Date();
        break;
    }
    
    return transformed;
  });
};

// Helper function to import data to database
const importToDatabase = async (data: any[], entityType: string, userId: string) => {
  const Model = getModel(entityType);
  if (!Model) {
    throw new Error(`Invalid entity type: ${entityType}`);
  }

  let importedCount = 0;
  let failedCount = 0;
  const failedRecords: any[] = [];

  // Process records in batches to handle large files
  const batchSize = 100;
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    const results = await Model.insertMany(batch, { ordered: false });
    
    importedCount += results.length;
    
    // Update job progress
    const progress = Math.round(((i + batch.length) / data.length) * 100);
    await importQueue.getJob(import.meta.jobId).update({
      progress: progress
    });
  }

  return {
    importedCount,
    failedCount,
    failedRecords
  };
};

// Helper function to query data from database
const queryData = async (entityType: string, filters: Record<string, any>) => {
  const Model = getModel(entityType);
  if (!Model) {
    throw new Error(`Invalid entity type: ${entityType}`);
  }

  return await Model.find(filters).lean();
};

// Helper function to transform data for export
const transformExportData = (data: any[], entityType: string): any[] => {
  return data.map((record) => {
    const transformed: any = {};
    
    switch (entityType) {
      case 'products':
        transformed.title = record.title;
        transformed.slug = record.slug;
        transformed.description = record.description;
        transformed.price = record.price;
        transformed.original_price = record.original_price;
        transformed.discount_percent = record.discount_percent;
        transformed.sku = record.sku;
        transformed.stock_quantity = record.stock_quantity;
        transformed.brand = record.brand;
        transformed.category_id = record.category_id;
        transformed.seller_id = record.seller_id;
        transformed.status = record.status;
        transformed.is_featured = record.is_featured;
        transformed.is_sponsored = record.is_sponsored;
        transformed.created_at = record.created_at;
        break;
        
      case 'users':
        transformed.email = record.email;
        transformed.name = record.name;
        transformed.phone = record.phone;
        transformed.role = record.role;
        transformed.profile_picture_url = record.profile_picture_url;
        transformed.email_verified = record.email_verified;
        transformed.loyalty_points = record.loyalty_points;
        transformed.created_at = record.created_at;
        break;
        
      case 'orders':
        transformed.user_id = record.user_id;
        transformed.order_number = record.order_number;
        transformed.items = JSON.stringify(record.items);
        transformed.address = JSON.stringify(record.address);
        transformed.delivery_speed = record.delivery_speed;
        transformed.payment_method = record.payment_method;
        transformed.subtotal = record.subtotal;
        transformed.discount = record.discount;
        transformed.delivery_charge = record.delivery_charge;
        transformed.total = record.total;
        transformed.status = record.status;
        transformed.tracking_number = record.tracking_number;
        transformed.created_at = record.created_at;
        break;
        
      case 'categories':
        transformed.name = record.name;
        transformed.slug = record.slug;
        transformed.parent_id = record.parent_id;
        transformed.image_url = record.image_url;
        transformed.order = record.order;
        transformed.created_at = record.created_at;
        break;
    }
    
    return transformed;
  });
};

// Helper function to export data to CSV
const exportToCSV = async (data: any[], entityType: string, jobId: string): Promise<string> => {
  const csvWriter = require('csv-writer').createObjectCsvWriter;
  const path = require('path');
  const fs = require('fs');
  
  // Create output directory if it doesn't exist
  const outputDir = path.join(__dirname, '../../exports');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Define CSV headers based on entity type
  const headers = getCSVHeaders(entityType);
  
  // Create CSV writer
  const csvFilePath = path.join(outputDir, `${entityType}-${jobId}.csv`);
  const csvWriterInstance = csvWriter({
    path: csvFilePath,
    header: headers
  });
  
  // Write data to CSV
  await csvWriterInstance.writeRecords(data);
  
  // Return file URL
  return `${config.SERVER_URL}/exports/${entityType}-${jobId}.csv`;
};

// Helper function to export data to JSON
const exportToJSON = async (data: any[], entityType: string, jobId: string): Promise<string> => {
  const path = require('path');
  const fs = require('fs');
  
  // Create output directory if it doesn't exist
  const outputDir = path.join(__dirname, '../../exports');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Write data to JSON file
  const jsonFilePath = path.join(outputDir, `${entityType}-${jobId}.json`);
  fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2));
  
  // Return file URL
  return `${config.SERVER_URL}/exports/${entityType}-${jobId}.json`;
};

// Helper function to get CSV headers based on entity type
const getCSVHeaders = (entityType: string) => {
  switch (entityType) {
    case 'products':
      return [
        { id: 'title', title: 'Title' },
        { id: 'slug', title: 'Slug' },
        { id: 'description', title: 'Description' },
        { id: 'price', title: 'Price' },
        { id: 'original_price', title: 'Original Price' },
        { id: 'discount_percent', title: 'Discount Percent' },
        { id: 'sku', title: 'SKU' },
        { id: 'stock_quantity', title: 'Stock Quantity' },
        { id: 'brand', title: 'Brand' },
        { id: 'category_id', title: 'Category ID' },
        { id: 'seller_id', title: 'Seller ID' },
        { id: 'status', title: 'Status' },
        { id: 'is_featured', title: 'Is Featured' },
        { id: 'is_sponsored', title: 'Is Sponsored' },
        { id: 'created_at', title: 'Created At' }
      ];
      
    case 'users':
      return [
        { id: 'email', title: 'Email' },
        { id: 'name', title: 'Name' },
        { id: 'phone', title: 'Phone' },
        { id: 'role', title: 'Role' },
        { id: 'profile_picture_url', title: 'Profile Picture URL' },
        { id: 'email_verified', title: 'Email Verified' },
        { id: 'loyalty_points', title: '