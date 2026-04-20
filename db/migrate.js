/**
 * Migration runner for ShopSphere database
 * Handles schema changes and data migrations
 */

const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Migration history collection name
const MIGRATION_HISTORY_COLLECTION = 'app_d8d4_migration_history';

// Migration directory
const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

class DatabaseMigrator {
  constructor(uri) {
    this.client = new MongoClient(uri);
    this.db = null;
  }

  async connect() {
    await this.client.connect();
    this.db = this.client.db();
    console.log('Connected to MongoDB for migrations');
  }

  async ensureMigrationHistoryCollection() {
    const collections = await this.db.listCollections({ name: MIGRATION_HISTORY_COLLECTION }).toArray();
    if (collections.length === 0) {
      await this.db.createCollection(MIGRATION_HISTORY_COLLECTION);
      await this.db.collection(MIGRATION_HISTORY_COLLECTION).createIndex({ name: 1 }, { unique: true });
      console.log('Created migration history collection');
    }
  }

  async getAppliedMigrations() {
    const history = await this.db.collection(MIGRATION_HISTORY_COLLECTION).find({}).toArray();
    return history.map(m => m.name);
  }

  async runMigration(migrationFile, direction = 'up') {
    const migrationPath = path.join(MIGRATIONS_DIR, migrationFile);
    const migrationName = path.basename(migrationFile, '.js');
    
    console.log(`Running ${direction} migration: ${migrationName}`);
    
    try {
      const migration = require(migrationPath);
      
      if (typeof migration[direction] !== 'function') {
        console.log(`No ${direction} function in migration ${migrationName}, skipping`);
        return true;
      }

      await migration[direction](this.db);
      
      if (direction === 'up') {
        await this.db.collection(MIGRATION_HISTORY_COLLECTION).insertOne({
          name: migrationName,
          applied_at: new Date(),
          direction: 'up'
        });
      } else {
        await this.db.collection(MIGRATION_HISTORY_COLLECTION).deleteOne({ name: migrationName });
      }
      
      console.log(`${direction.toUpperCase()} migration ${migrationName} completed successfully`);
      return true;
    } catch (error) {
      console.error(`Failed to run ${direction} migration ${migrationName}:`, error);
      return false;
    }
  }

  async up() {
    await this.connect();
    await this.ensureMigrationHistoryCollection();
    
    const appliedMigrations = await this.getAppliedMigrations();
    
    // Get all migration files and sort them by name (which includes version number)
    const migrationFiles = fs.readdirSync(MIGRATIONS_DIR)
      .filter(file => file.endsWith('.js'))
      .sort();
    
    let success = true;
    
    for (const migrationFile of migrationFiles) {
      const migrationName = path.basename(migrationFile, '.js');
      
      if (!appliedMigrations.includes(migrationName)) {
        success = await this.runMigration(migrationFile, 'up') && success;
        
        if (!success) {
          console.error('Migration failed, stopping further migrations');
          break;
        }
      }
    }
    
    await this.client.close();
    return success;
  }

  async down(targetMigration = null) {
    await this.connect();
    await this.ensureMigrationHistoryCollection();
    
    // Get applied migrations sorted by application time (most recent first)
    const appliedMigrations = await this.db.collection(MIGRATION_HISTORY_COLLECTION)
      .find({})
      .sort({ applied_at: -1 })
      .toArray();
    
    let success = true;
    
    for (const migrationRecord of appliedMigrations) {
      // Stop if we've reached the target migration (we want to keep it applied)
      if (targetMigration && migrationRecord.name === targetMigration) {
        break;
      }
      
      const migrationFile = `${migrationRecord.name}.js`;
      success = await this.runMigration(migrationFile, 'down') && success;
      
      if (!success) {
        console.error('Rollback failed, database may be in inconsistent state');
        break;
      }
    }
    
    await this.client.close();
    return success;
  }

  async status() {
    await this.connect();
    await this.ensureMigrationHistoryCollection();
    
    const allMigrationFiles = fs.readdirSync(MIGRATIONS_DIR)
      .filter(file => file.endsWith('.js'))
      .map(file => path.basename(file, '.js'))
      .sort();
    
    const appliedMigrations = await this.getAppliedMigrations();
    
    console.log('\nMigration Status:');
    console.log('================');
    
    allMigrationFiles.forEach(migrationName => {
      const status = appliedMigrations.includes(migrationName) ? 'APPLIED' : 'PENDING';
      console.log(`${status.padEnd(8)} ${migrationName}`);
    });
    
    await this.client.close();
  }
}

// CLI interface
async function run() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/shopsphere';
  const migrator = new DatabaseMigrator(uri);
  
  const command = process.argv[2];
  const target = process.argv[3] || null;
  
  switch (command) {
    case 'up':
      console.log('Running migrations up...');
      const upSuccess = await migrator.up();
      process.exit(upSuccess ? 0 : 1);
      break;
      
    case 'down':
      console.log('Running migrations down...');
      const downSuccess = await migrator.down(target);
      process.exit(downSuccess ? 0 : 1);
      break;
      
    case 'status':
      await migrator.status();
      process.exit(0);
      break;
      
    default:
      console.log('Usage:');
      console.log('  node migrate.js up                    - Run pending migrations');
      console.log('  node migrate.js down [migration]      - Rollback migrations');
      console.log('  node migrate.js status                - Show migration status');
      process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  run().catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
  });
}

module.exports = DatabaseMigrator;