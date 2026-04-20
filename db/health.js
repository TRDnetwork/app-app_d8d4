/**
 * Database health check script
 * Verifies database connectivity and collection integrity
 */

const { MongoClient } = require('mongodb');

async function checkDatabaseHealth() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/shopsphere';
  const client = new MongoClient(uri);
  
  const health = {
    status: 'pass',
    timestamp: new Date().toISOString(),
    checks: []
  };

  try {
    await client.connect();
    const db = client.db();
    
    // Check database connectivity
    const dbCheck = {
      name: 'database-connectivity',
      status: 'pass',
      componentType: 'database',
      observedValue: 'connected',
      observedUnit: 'state'
    };
    
    try {
      await db.admin().ping();
    } catch (error) {
      dbCheck.status = 'fail';
      dbCheck.output = error.message;
      health.status = 'fail';
    }
    health.checks.push(dbCheck);
    
    // Define required collections
    const requiredCollections = [
      'app_d8d4_users',
      'app_d8d4_products',
      'app_d8d4_orders',
      'app_d8d4_categories',
      'app_d8d4_reviews'
    ];
    
    // Check required collections exist
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    for (const collection of requiredCollections) {
      const collectionCheck = {
        name: `collection-exists-${collection}`,
        status: 'pass',
        componentType: 'database',
        observedValue: collectionNames.includes(collection),
        observedUnit: 'boolean'
      };
      
      if (!collectionNames.includes(collection)) {
        collectionCheck.status = 'fail';
        collectionCheck.output = `Collection ${collection} not found`;
        health.status = 'fail';
      }
      
      health.checks.push(collectionCheck);
    }
    
    // Check sample data exists (at least one user and product)
    const userCount = await db.collection('app_d8d4_users').countDocuments();
    const productCount = await db.collection('app_d8d4_products').countDocuments();
    
    const dataCheck = {
      name: 'sample-data-present',
      status: 'pass',
      componentType: 'database',
      observedValue: { users: userCount, products: productCount },
      observedUnit: 'count'
    };
    
    if (userCount === 0 || productCount === 0) {
      dataCheck.status = 'warn';
      dataCheck.output = 'No sample data found. Consider running seed.js';
    }
    
    health.checks.push(dataCheck);
    
    // Check index health for critical collections
    const criticalCollections = ['app_d8d4_users', 'app_d8d4_products', 'app_d8d4_orders'];
    
    for (const collectionName of criticalCollections) {
      const indexCheck = {
        name: `indexes-present-${collectionName}`,
        status: 'pass',
        componentType: 'database',
        observedValue: {},
        observedUnit: 'index'
      };
      
      try {
        const indexes = await db.collection(collectionName).indexes();
        indexCheck.observedValue.count = indexes.length;
        
        // Check for critical indexes
        const indexNames = indexes.map(i => i.name);
        if (collectionName === 'app_d8d4_users' && !indexNames.includes('email_1')) {
          indexCheck.status = 'fail';
          indexCheck.output = 'Missing email index on users collection';
          health.status = 'fail';
        }
        
        if (collectionName === 'app_d8d4_products' && !indexNames.includes('product_search_index')) {
          indexCheck.status = 'warn';
          indexCheck.output = 'Search index not found on products collection';
        }
        
        if (collectionName === 'app_d8d4_orders' && !indexNames.includes('user_id_1')) {
          indexCheck.status = 'fail';
          indexCheck.output = 'Missing user_id index on orders collection';
          health.status = 'fail';
        }
      } catch (error) {
        indexCheck.status = 'fail';
        indexCheck.output = error.message;
        health.status = 'fail';
      }
      
      health.checks.push(indexCheck);
    }
    
  } catch (error) {
    health.status = 'fail';
    health.checks.push({
      name: 'database-connection',
      status: 'fail',
      componentType: 'database',
      output: error.message,
      observedValue: 'failed',
      observedUnit: 'state'
    });
  } finally {
    await client.close();
  }
  
  return health;
}

// Run health check if this file is executed directly
if (require.main === module) {
  checkDatabaseHealth()
    .then(health => {
      console.log(JSON.stringify(health, null, 2));
      process.exit(health.status === 'fail' ? 1 : 0);
    })
    .catch(error => {
      console.error('Health check failed:', error);
      process.exit(1);
    });
}

module.exports = { checkDatabaseHealth };