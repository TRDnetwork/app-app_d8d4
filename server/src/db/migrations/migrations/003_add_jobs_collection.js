/**
 * Migration: Add jobs collection for background processing
 * Version: 003
 * Description: Create jobs collection to track background tasks with status and retry logic
 */

module.exports = {
  version: '003',
  description: 'Add jobs collection for background processing',

  async up(db, client) {
    // Create jobs collection
    await db.createCollection('app_d8d4_jobs', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['job_type', 'status', 'created_at'],
          properties: {
            job_type: {
              bsonType: 'string',
              description: 'Type of job (e.g., data_import, data_export, email_notification)'
            },
            status: {
              bsonType: 'string',
              enum: ['pending', 'running', 'completed', 'failed'],
              description: 'Current status of the job'
            },
            payload: {
              bsonType: 'object',
              description: 'Job-specific data and parameters'
            },
            result: {
              bsonType: 'object',
              description: 'Job result data (for completed jobs)'
            },
            error: {
              bsonType: 'object',
              description: 'Error information (for failed jobs)'
            },
            attempts: {
              bsonType: 'number',
              minimum: 0,
              description: 'Number of times this job has been attempted'
            },
            max_attempts: {
              bsonType: 'number',
              minimum: 1,
              description: 'Maximum number of attempts before giving up'
            },
            retry_delay: {
              bsonType: 'number',
              minimum: 0,
              description: 'Delay between retries in milliseconds'
            },
            scheduled_at: {
              bsonType: 'date',
              description: 'When the job should be processed'
            },
            started_at: {
              bsonType: 'date',
              description: 'When the job started processing'
            },
            completed_at: {
              bsonType: 'date',
              description: 'When the job completed'
            },
            created_at: {
              bsonType: 'date',
              description: 'When the job was created'
            },
            updated_at: {
              bsonType: 'date',
              description: 'When the job was last updated'
            }
          }
        }
      }
    });

    // Create indexes for jobs collection
    await db.collection('app_d8d4_jobs').createIndex({ job_type: 1 }, { name: 'job_type_idx' });
    await db.collection('app_d8d4_jobs').createIndex({ status: 1 }, { name: 'status_idx' });
    await db.collection('app_d8d4_jobs').createIndex({ scheduled_at: 1 }, { name: 'scheduled_at_idx' });
    await db.collection('app_d8d4_jobs').createIndex({ created_at: -1 }, { name: 'created_at_desc' });
    await db.collection('app_d8d4_jobs').createIndex({ 'payload.user_id': 1 }, { name: 'user_id_idx' });
    
    // TTL index to automatically remove completed/failed jobs after 30 days
    await db.collection('app_d8d4_jobs').createIndex(
      { updated_at: 1 }, 
      { 
        name: 'ttl_idx', 
        expireAfterSeconds: 2592000 // 30 days
      }
    );

    console.log('✅ Jobs collection created with indexes');
  },

  async down(db, client) {
    // Drop jobs collection
    try {
      await db.collection('app_d8d4_jobs').drop();
      console.log('🗑️  Dropped jobs collection');
    } catch (err) {
      if (err.codeName !== 'NamespaceNotFound') {
        throw err;
      }
      console.log('⏭️  Jobs collection not found (safe to continue)');
    }
  }
};
```

```typescript