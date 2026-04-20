```bash
#!/bin/bash

# Apply MongoDB migrations
set -e

echo "🚀 Starting database migrations..."

# Check required env vars
if [ -z "$MONGODB_URI" ]; then
  echo "❌ Error: MONGODB_URI is not set"
  exit 1
fi

if [ -z "$DB_NAME" ]; then
  echo "ℹ️  DB_NAME not set, using default 'shopsphere'"
  export DB_NAME="shopsphere"
fi

# Run migrations
npx ts-node db/migrate.ts

echo "✅ Migrations completed"
```