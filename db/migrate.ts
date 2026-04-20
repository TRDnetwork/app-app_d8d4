import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

const MIGRATIONS_DIR = path.join(__dirname, 'migrations');
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL is required');
  process.exit(1);
}

async function runMigration(client: Client, migrationFile: string) {
  const migrationPath = path.join(MIGRATIONS_DIR, migrationFile);
  const content = fs.readFileSync(migrationPath, 'utf8');
  
  // Extract UP section
  const upMatch = content.match(/-- UP\s+([\s\S]*?)-- DOWN/);
  if (!upMatch) {
    throw new Error(`Invalid migration format: ${migrationFile}`);
  }

  const upSQL = upMatch[1].trim();
  const version = migrationFile.replace('.sql', '');

  // Check if already applied
  const { rows } = await client.query(
    'SELECT 1 FROM schema_versions WHERE version = $1',
    [version]
  );

  if (rows.length > 0) {
    console.log(`Migration ${version} already applied, skipping`);
    return;
  }

  console.log(`Applying migration: ${version}`);
  await client.query(upSQL);
  await client.query(
    'INSERT INTO schema_versions (version) VALUES ($1)',
    [version]
  );
}

async function main() {
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    await client.connect();
    
    // Ensure schema_versions table exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_versions (
        version VARCHAR(255) PRIMARY KEY,
        applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    const migrationFiles = fs
      .readdirSync(MIGRATIONS_DIR)
      .filter(f => f.endsWith('.sql'))
      .sort(); // Ensure ordered execution

    for (const file of migrationFiles) {
      await runMigration(client, file);
    }

    console.log('All migrations applied successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

if (require.main === module) {
  main();
}

export default main;