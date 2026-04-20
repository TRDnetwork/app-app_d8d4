/**
 * Migration: Enhance product search capabilities
 * Created: 2023-11-16
 */

module.exports = {
  async up(db) {
    // Create text index for product search
    await db.collection('app_d8d4_products').createIndex(
      { 
        title: 'text', 
        description: 'text', 
        brand: 'text',
        'variants.color': 'text'
      },
      {
        weights: {
          title: 10,
          brand: 5,
          description: 2,
          'variants.color': 3
        },
        name: 'product_search_index'
      }
    );
    
    // Create index for price range filtering
    await db.collection('app_d8d4_products').createIndex({ price: 1, discount_percent: 1 });
    
    console.log('Added product search indexes');
  },

  async down(db) {
    // Drop the indexes
    await db.collection('app_d8d4_products').dropIndex('product_search_index').catch(() => {});
    await db.collection('app_d8d4_products').dropIndex('price_1_discount_percent_1').catch(() => {});
    
    console.log('Removed product search indexes');
  }
};