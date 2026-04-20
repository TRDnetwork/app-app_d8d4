/**
 * Migration: Add additional indexes to users collection for performance
 * Created: 2023-11-15
 */

module.exports = {
  async up(db) {
    // Add compound index for user role and creation date
    await db.collection('app_d8d4_users').createIndex({ role: 1, created_at: -1 });
    
    // Add index for email verification status (for cleanup jobs)
    await db.collection('app_d8d4_users').createIndex({ email_verified: 1, created_at: 1 });
    
    console.log('Added user collection indexes');
  },

  async down(db) {
    // Drop the indexes
    await db.collection('app_d8d4_users').dropIndex('role_1_created_at_-1').catch(() => {});
    await db.collection('app_d8d4_users').dropIndex('email_verified_1_created_at_1').catch(() => {});
    
    console.log('Removed user collection indexes');
  }
};