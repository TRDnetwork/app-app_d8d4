/**
 * Migration: Add TTL index for cancelled orders cleanup
 * Created: 2023-11-17
 */

module.exports = {
  async up(db) {
    // Add TTL index to automatically remove cancelled orders after 90 days
    await db.collection('app_d8d4_orders').createIndex(
      { order_status: 1, created_at: 1 },
      {
        name: 'cancelled_orders_ttl',
        partialFilterExpression: { order_status: 'cancelled' },
        expireAfterSeconds: 7776000 // 90 days in seconds
      }
    );
    
    // Create index for order status tracking
    await db.collection('app_d8d4_orders').createIndex({ order_status: 1, updated_at: -1 });
    
    console.log('Added order TTL and status tracking indexes');
  },

  async down(db) {
    // Drop the indexes
    await db.collection('app_d8d4_orders').dropIndex('cancelled_orders_ttl').catch(() => {});
    await db.collection('app_d8d4_orders').dropIndex('order_status_1_updated_at_-1').catch(() => {});
    
    console.log('Removed order TTL and status tracking indexes');
  }
};