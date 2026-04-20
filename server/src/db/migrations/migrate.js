/**
 * MongoDB Migration Runner
 * Usage: node migrate.js [up|down] [version]
 */

require('dotenv').config();
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shopsphere';
const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

async function getAppliedVersions(db) {
  const versions = await db.collection('schema_versions')
    .find({}, { projection: { version: 1, _id: 0 } })
    .sort({ version: 1 })
    .toArray();
  return versions.map(v => v.version);
}

async function runMigration(direction = 'up', targetVersion = null) {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db();

    const migrationFiles = fs.readdirSync(MIGRATIONS_DIR)
      .filter(f => f.match(/^\d+_.+\.js$/))
      .sort();

    const appliedVersions = await getAppliedVersions(db);
    const latestApplied = appliedVersions.length > 0 ? appliedVersions[appliedVersions.length - 1] : null;

    console.log(`Applied migrations: [${appliedVersions.join(', ')}]`);
    console.log(`Running '${direction}' migrations${targetVersion ? ` to version ${targetVersion}` : ''}`);

    for (const file of migrationFiles) {
      const version = file.split('_')[0];
      const fullPath = path.join(MIGRATIONS_DIR, file);

      // Skip if already applied (for up) or not applied (for down)
      if (direction === 'up' && appliedVersions.includes(version)) continue;
      if (direction === 'down' && !appliedVersions.includes(version)) continue;

      // Stop if we've reached target version
      if (targetVersion && version !== targetVersion) continue;

      console.log(`\n🔄 Applying migration: ${file}`);
      const migration = require(fullPath);

      try {
        await migration[direction](db, client);
        console.log(`✅ Migration ${direction} successful: ${file}`);

        // Record in schema_versions (up only)
        if (direction === 'up') {
          await db.collection('schema_versions').insertOne({
            version: migration.version,
            applied_at: new Date(),
            description: migration.description
          });
        } else if (direction === 'down') {
          await db.collection('schema_versions').deleteOne({ version: migration.version });
        }
      } catch (err) {
        console.error(`❌ Migration failed: ${file}`);
        console.error(err);
        throw err;
      }

      // If running single version, stop after
      if (targetVersion) break;
    }

    console.log('\n🎉 All migrations completed successfully');
  } finally {
    await client.close();
  }
}

// CLI execution
if (require.main === module) {
  const args = process.argv.slice(2);
  const direction = args[0] === 'down' ? 'down' : 'up';
  const targetVersion = args[1] || null;

  if (targetVersion && !/^\d+$/.test(targetVersion)) {
    console.error('Target version must be a number');
    process.exit(1);
  }

  runMigration(direction, targetVersion).catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
  });
}

module.exports = { runMigration };