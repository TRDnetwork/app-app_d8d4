```typescript
import { Pool } from 'pg';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Initialize PostgreSQL connection for pgvector
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Initialize pgvector extension
export async function initVectorDB() {
  const client = await pool.connect();
  try {
    // Create pgvector extension if it doesn't exist
    await client.query('CREATE EXTENSION IF NOT EXISTS vector');
    
    // Create documents table
    await client.query(`
      CREATE TABLE IF NOT EXISTS documents (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        embedding VECTOR(1536),
        metadata JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
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
        created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
      )
    `);
    
    // Create HNSW index on embedding columns for efficient similarity search
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_documents_embedding 
      ON documents 
      USING hnsw (embedding vector_cosine_ops)
      WITH (m = 16, ef_construction = 64)
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_chunks_embedding 
      ON chunks 
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

// Document operations
export async function createDocument(title: string, content: string, metadata: Record<string, any> = {}) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'INSERT INTO documents (title, content, metadata) VALUES ($1, $2, $3) RETURNING id, created_at',
      [title, content, metadata]
    );
    
    return result.rows[0];
  } catch (error) {
    console.error('Error creating document:', error);
    throw error;
  } finally {
    client.release();
  }
}

export async function getDocument(id: string) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT * FROM documents WHERE id = $1',
      [id]
    );
    
    return result.rows[0];
  } catch (error) {
    console.error('Error getting document:', error);
    throw error;
  } finally {
    client.release();
  }
}

export async function updateDocument(id: string, updates: { title?: string; content?: string; metadata?: Record<string, any> }) {
  const client = await pool.connect();
  try {
    const fields = [];
    const values = [id];
    
    if (updates.title) {
      fields.push(`title = $${values.length}`);
      values.push(updates.title);
    }
    
    if (updates.content) {
      fields.push(`content = $${values.length}`);
      values.push(updates.content);
    }
    
    if (updates.metadata) {
      fields.push(`metadata = $${values.length}`);
      values.push(updates.metadata);
    }
    
    if (fields.length === 0) {
      return;
    }
    
    const result = await client.query(
      `UPDATE documents SET ${fields.join(', ')} WHERE id = $1 RETURNING *`,
      values
    );
    
    return result.rows[0];
  } catch (error) {
    console.error('Error updating document:', error);
    throw error;
  } finally {
    client.release();
  }
}

export async function deleteDocument(id: string) {
  const client = await pool.connect();
  try {
    await client.query(
      'DELETE FROM documents WHERE id = $1',
      [id]
    );
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Chunk operations
export async function createChunks(documentId: string, chunks: Array<{ text: string; index: number; embedding: number[] }>) {
  const client = await pool.connect();
  try {
    const query = `
      INSERT INTO chunks (document_id, chunk_text, chunk_embedding, chunk_index) 
      VALUES ${chunks.map((_, i) => `($${i * 4 + 1}, $${i * 4 + 2}, $${i * 4 + 3}, $${i * 4 + 4})`).join(', ')}
    `;
    
    const values = chunks.flatMap(chunk => [
      documentId,
      chunk.text,
      chunk.embedding,
      chunk.index
    ]);
    
    await client.query(query, values);
  } catch (error) {
    console.error('Error creating chunks:', error);
    throw error;
  } finally {
    client.release();
  }
}

export async function getChunks(documentId: string) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT * FROM chunks WHERE document_id = $1 ORDER BY chunk_index',
      [documentId]
    );
    
    return result.rows;
  } catch (error) {
    console.error('Error getting chunks:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Search operations
export async function semanticSearch(queryEmbedding: number[], limit: number = 5) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT d.*, c.chunk_text,
              1 - (d.embedding <=> $1::VECTOR) as similarity
       FROM documents d
       JOIN chunks c ON d.id = c.document_id
       WHERE d.embedding IS NOT NULL
       ORDER BY d.embedding <=> $1::VECTOR
       LIMIT $2`,
      [queryEmbedding, limit]
    );
    
    return result.rows.map(row => ({
      ...row,
      similarity: parseFloat(row.similarity)
    }));
  } catch (error) {
    console.error('Error performing semantic search:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Utility function to convert array to vector format
export function arrayToVector(arr: number[]): string {
  return `[${arr.join(',')}]`;
}

// Initialize the vector database on module load
initVectorDB().catch(console.error);
```