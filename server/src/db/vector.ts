import { Pool } from 'pg';
import { env } from '../config/env';

// Initialize PostgreSQL connection with pgvector
export const pool = new Pool({
  connectionString: env.SUPABASE_CONNECTION_STRING,
});

// Initialize pgvector extension
export async function initVectorDB() {
  const client = await pool.connect();
  try {
    // Enable pgvector extension
    await client.query('CREATE EXTENSION IF NOT EXISTS vector');
    
    // Create documents table
    await client.query(`
      CREATE TABLE IF NOT EXISTS documents (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        embedding VECTOR(1536),
        metadata JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    
    // Create chunks table for large documents
    await client.query(`
      CREATE TABLE IF NOT EXISTS chunks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
        chunk_text TEXT NOT NULL,
        chunk_embedding VECTOR(1536),
        chunk_index INTEGER NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(document_id, chunk_index)
      )
    `);
    
    // Create HNSW index for efficient similarity search
    await client.query(`
      CREATE INDEX IF NOT EXISTS documents_embedding_idx ON documents 
      USING hnsw (embedding vector_cosine_ops)
      WITH (m = 16, ef_construction = 64)
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS chunks_embedding_idx ON chunks 
      USING hnsw (chunk_embedding vector_cosine_ops)
      WITH (m = 16, ef_construction = 64)
    `);
    
    console.log('Vector database initialized successfully');
  } catch (error) {
    console.error('Error initializing vector database:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Export pool for use in other modules
export default pool;
```

```typescript