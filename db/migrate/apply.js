// Migration runner script for MongoDB
// Usage: mongo app_d8d4 db/migrate/apply.js

const MIGRATIONS_DIR = "db/migrate";
const MIGRATION_FILES = [
  "001_create_collections.js",
  "002_create_indexes.js"
];

function log(message) {
  print(`[MIGRATE] ${new Date().toISOString()} - ${message}`);
}

function runMigration(fileName) {
  log(`Applying migration: ${fileName}`);
  try {
    // Load and execute migration file
    load(`${MIGRATIONS_DIR}/${fileName}`);
    // Log success
    db.migration_logs.insertOne({
      migration_name: fileName,
      applied_at: new Date()
    });
    log(`Successfully applied: ${fileName}`);
  } catch (error) {
    log(`ERROR applying ${fileName}: ${error.message}`);
    throw error;
  }
}

function main() {
  log("Starting migration process");

  // Ensure migration_logs exists
  if (!db.getCollectionNames().includes("migration_logs")) {
    db.createCollection("migration_logs");
  }

  // Get already applied migrations
  const appliedMigrations = db.migration_logs
    .find({}, { migration_name: 1, _id: 0 })
    .toArray()
    .map(m => m.migration_name);

  log(`Already applied: ${appliedMigrations.length} migrations`);

  // Apply pending migrations
  let appliedCount = 0;
  MIGRATION_FILES.forEach(fileName => {
    if (!appliedMigrations.includes(fileName)) {
      runMigration(fileName);
      appliedCount++;
    } else {
      log(`Skipping already applied: ${fileName}`);
    }
  });

  log(`Migration process completed. Applied ${appliedCount} new migrations.`);
}

// Execute
main();