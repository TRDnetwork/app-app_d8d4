import { Queue, Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import { logger } from '../utils/logger';
import { EmailService } from '../services/emailService';
import { Order } from '../models/Order';
import { Product } from '../models/Product';

// Initialize Redis connection
const redisConnection = new IORedis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  maxRetriesPerRequest: null,
});

// Create queues
export const importQueue = new Queue('import', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    removeOnComplete: true,
    removeOnFail: 1000,
  },
});

export const exportQueue = new Queue('export', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    removeOnComplete: true,
    removeOnFail: 1000,
  },
});

export const notificationQueue = new Queue('notification', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    removeOnComplete: true,
    removeOnFail: 1000,
  },
});

// Process import jobs
new Worker('import', async (job: Job) => {
  logger.info({
    correlationId: job.id,
    jobName: job.name,
    data: job.data,
    message: 'Processing import job'
  });

  try {
    switch (job.name) {
      case 'csv-import':
        return await processCSVImport(job.data);
      case 'json-import':
        return await processJSONImport(job.data);
      default:
        throw new Error(`Unknown import job type: ${job.name}`);
    }
  } catch (error: any) {
    logger.error({
      correlationId: job.id,
      jobName: job.name,
      error: error.message,
      stack: error.stack,
      message: 'Import job failed'
    });
    
    throw error;
  }
}, {
  connection: redisConnection,
});

// Process export jobs
new Worker('export', async (job: Job) => {
  logger.info({
    correlationId: job.id,
    jobName: job.name,
    data: job.data,
    message: 'Processing export job'
  });

  try {
    switch (job.name) {
      case 'csv-export':
        return await processCSVExport(job.data);
      case 'json-export':
        return await processJSONExport(job.data);
      default:
        throw new Error(`Unknown export job type: ${job.name}`);
    }
  } catch (error: any) {
    logger.error({
      correlationId: job.id,
      jobName: job.name,
      error: error.message,
      stack: error.stack,
      message: 'Export job failed'
    });
    
    throw error;
  }
}, {
  connection: redisConnection,
});

// Process notification jobs
new Worker('notification', async (job: Job) => {
  logger.info({
    correlationId: job.id,
    jobName: job.name,
    data: job.data,
    message: 'Processing notification job'
  });

  try {
    switch (job.name) {
      case 'order-confirmation':
        return await sendOrderConfirmation(job.data);
      case 'password-reset':
        return await sendPasswordReset(job.data);
      case 'email-verification':
        return await sendEmailVerification(job.data);
      default:
        throw new Error(`Unknown notification job type: ${job.name}`);
    }
  } catch (error: any) {
    logger.error({
      correlationId: job.id,
      jobName: job.name,
      error: error.message,
      stack: error.stack,
      message: 'Notification job failed'
    });
    
    throw error;
  }
}, {
  connection: redisConnection,
});

/**
 * Process CSV import job
 */
async function processCSVImport(data: {
  filePath: string;
  userId: string;
}): Promise<any> {
  const { CSVParser } = await import('../utils/csvParser');
  
  try {
    const result = await CSVParser.parseCSV(data.filePath);
    
    logger.info({
      correlationId: data.userId,
      processed: result.processed,
      created: result.created,
      updated: result.updated,
      errors: result.errors.length,
      message: 'CSV import completed'
    });
    
    return result;
  } catch (error: any) {
    logger.error({
      correlationId: data.userId,
      error: error.message,
      stack: error.stack,
      message: 'CSV import failed'
    });
    
    throw error;
  }
}

/**
 * Process JSON import job
 */
async function processJSONImport(data: {
  jsonData: any[];
  userId: string;
}): Promise<any> {
  const { JSONValidator } = await import('../utils/jsonValidator');
  
  try {
    const result = await JSONValidator.importFromJSON(data.jsonData);
    
    logger.info({
      correlationId: data.userId,
      processed: result.processed,
      created: result.created,
      updated: result.updated,
      errors: result.errors.length,
      message: 'JSON import completed'
    });
    
    return result;
  } catch (error: any) {
    logger.error({
      correlationId: data.userId,
      error: error.message,
      stack: error.stack,
      message: 'JSON import failed'
    });
    
    throw error;
  }
}

/**
 * Process CSV export job
 */
async function processCSVExport(data: {
  filter: any;
  userId: string;
}): Promise<any> {
  const csv = await import('csv-writer');
  
  try {
    // Get products based on filter
    const products = await Product.find(data.filter).lean();
    
    // Create CSV writer
    const filePath = `/tmp/export-${Date.now()}.csv`;
    const csvWriter = csv.createObjectCsvWriter({
      path: filePath,
      header: [
        { id: 'title', title: 'Title' },
        { id: 'description', title: 'Description' },
        { id: 'category', title: 'Category' },
        { id: 'brand', title: 'Brand' },
        { id: 'price', title: 'Price' },
        { id: 'original_price', title: 'Original Price' },
        { id: 'discount_percent', title: 'Discount Percent' },
        { id: 'stock_total', title: 'Stock' },
        { id: 'status', title: 'Status' },
        { id: 'tags', title: 'Tags' },
        { id: 'created_at', title: 'Created At' },
        { id: 'updated_at', title: 'Updated At' },
      ]
    });
    
    // Transform products for CSV
    const records = products.map(product => ({
      title: product.title,
      description: product.description,
      category: product.category,
      brand: product.brand,
      price: product.price,
      original_price: product.original_price,
      discount_percent: product.discount_percent,
      stock_total: product.stock_total,
      status: product.status,
      tags: product.tags?.join(', ') || '',
      created_at: product.created_at,
      updated_at: product.updated_at
    }));
    
    // Write CSV file
    await csvWriter.writeRecords(records);
    
    logger.info({
      correlationId: data.userId,
      count: products.length,
      filePath,
      message: 'CSV export completed'
    });
    
    return { filePath, count: products.length };
  } catch (error: any) {
    logger.error({
      correlationId: data.userId,
      error: error.message,
      stack: error.stack,
      message: 'CSV export failed'
    });
    
    throw error;
  }
}

/**
 * Process JSON export job
 */
async function processJSONExport(data: {
  filter: any;
  userId: string;
}): Promise<any> {
  const { JSONValidator } = await import('../utils/jsonValidator');
  
  try {
    const json = await JSONValidator.exportToJSON(data.filter);
    
    const filePath = `/tmp/export-${Date.now()}.json`;
    const fs = await import('fs/promises');
    await fs.writeFile(filePath, json);
    
    logger.info({
      correlationId: data.userId,
      filePath,
      message: 'JSON export completed'
    });
    
    return { filePath, count: JSON.parse(json).length };
  } catch (error: any) {
    logger.error({
      correlationId: data.userId,
      error: error.message,
      stack: error.stack,
      message: 'JSON export failed'
    });
    
    throw error;
  }
}

/**
 * Send order confirmation email
 */
async function sendOrderConfirmation(data: {
  orderId: string;
  userId: string;
}): Promise<void> {
  const order = await Order.findById(data.orderId).populate('user_id');
  
  if (!order) {
    throw new Error(`Order not found: ${data.orderId}`);
  }
  
  await EmailService.sendOrderConfirmation(
    order.order_number,
    order.user_id.email,
    order.created_at.toISOString(),
    order.items.map(item => ({
      name: item.title,
      price: item.price,
      quantity: item.quantity
    })),
    order.total_amount
  );
}

/**
 * Send password reset email
 */
async function sendPasswordReset(data: {
  email: string;
  token: string;
  userId: string;
}): Promise<void> {
  await EmailService.sendPasswordReset(data.email, data.token);
}

/**
 * Send email verification email
 */
async function sendEmailVerification(data: {
  email: string;
  token: string;
  userId: string;
}): Promise<void> {
  await EmailService.sendEmailVerification(data.email, data.token);
}

// Export queue status functions
export const getQueueStatus = async () => {
  return {
    import: {
      waiting: await importQueue.getWaitingCount(),
      active: await importQueue.getActiveCount(),
      completed: await importQueue.getCompletedCount(),
      failed: await importQueue.getFailedCount(),
    },
    export: {
      waiting: await exportQueue.getWaitingCount(),
      active: await exportQueue.getActiveCount(),
      completed: await exportQueue.getCompletedCount(),
      failed: await exportQueue.getFailedCount(),
    },
    notification: {
      waiting: await notificationQueue.getWaitingCount(),
      active: await notificationQueue.getActiveCount(),
      completed: await notificationQueue.getCompletedCount(),
      failed: await notificationQueue.getFailedCount(),
    },
  };
};

export const getJobById = async (queueName: string, jobId: string) => {
  const queue = getQueue(queueName);
  if (!queue) {
    throw new Error(`Unknown queue: ${queueName}`);
  }
  
  return await queue.getJob(jobId);
};

export const getQueue = (queueName: string) => {
  switch (queueName) {
    case 'import':
      return importQueue;
    case 'export':
      return exportQueue;
    case 'notification':
      return notificationQueue;
    default:
      return null;
  }
};
```

```typescript