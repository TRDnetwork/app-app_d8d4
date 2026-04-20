import OpenAI from 'openai';
import { env } from '../config/env';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

// Function to generate embeddings using OpenAI
export async function generateEmbeddings(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });
    
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embeddings:', error);
    throw error;
  }
}

// Function to chunk text into smaller pieces
export function chunkText(text: string, maxTokens: number = 500, overlap: number = 50): string[] {
  const words = text.split(/\s+/);
  const chunks: string[] = [];
  let currentChunk: string[] = [];
  let currentTokenCount = 0;
  
  for (const word of words) {
    // Estimate token count (rough approximation: 1 token ≈ 4 chars)
    const wordTokenCount = Math.ceil(word.length / 4);
    
    // If adding this word would exceed the limit, save current chunk and start new one
    if (currentTokenCount + wordTokenCount > maxTokens && currentChunk.length > 0) {
      chunks.push(currentChunk.join(' '));
      
      // Create overlap by taking last 'overlap' words from current chunk
      const overlapWords = currentChunk.slice(-overlap);
      currentChunk = [...overlapWords, word];
      currentTokenCount = overlapWords.join(' ').length / 4 + wordTokenCount;
    } else {
      currentChunk.push(word);
      currentTokenCount += wordTokenCount;
    }
  }
  
  // Add the final chunk if it exists
  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join(' '));
  }
  
  return chunks;
}

// Function to process and embed a document
export async function processDocument(title: string, content: string, metadata: Record<string, any> = {}) {
  // Generate embedding for the full document (for metadata search)
  const documentEmbedding = await generateEmbeddings(title + ' ' + content.substring(0, 1000));
  
  // Insert document into database
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const documentResult = await client.query(
      `INSERT INTO documents (title, content, embedding, metadata) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id`,
      [title, content, documentEmbedding, metadata]
    );
    
    const documentId = documentResult.rows[0].id;
    
    // Chunk the content and generate embeddings for each chunk
    const chunks = chunkText(content);
    const chunkEmbeddings = await Promise.all(
      chunks.map(chunk => generateEmbeddings(chunk))
    );
    
    // Insert chunks into database
    for (let i = 0; i < chunks.length; i++) {
      await client.query(
        `INSERT INTO chunks (document_id, chunk_text, chunk_embedding, chunk_index) 
         VALUES ($1, $2, $3, $4)`,
        [documentId, chunks[i], chunkEmbeddings[i], i]
      );
    }
    
    await client.query('COMMIT');
    return documentId;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error processing document:', error);
    throw error;
  } finally {
    client.release();
  }
}
```

```typescript