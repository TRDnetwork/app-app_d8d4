```typescript
import OpenAI from 'openai';
import { arrayToVector } from '../db/vector';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Configuration for chunking
const CHUNK_SIZE = 500; // tokens
const CHUNK_OVERLAP = 50; // tokens

/**
 * Generate embeddings for text using OpenAI's text-embedding-3-small model
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });
    
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

/**
 * Generate embeddings for multiple texts in a single batch for efficiency
 */
export async function generateEmbeddingsBatch(texts: string[]): Promise<number[][]> {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: texts,
    });
    
    return response.data.map(item => item.embedding);
  } catch (error) {
    console.error('Error generating embeddings batch:', error);
    throw error;
  }
}

/**
 * Split text into chunks of specified size with overlap
 */
export function chunkText(text: string, chunkSize: number = CHUNK_SIZE, overlap: number = CHUNK_OVERLAP): string[] {
  // Simple token counting (approximation)
  const words = text.split(/\s+/);
  const chunks: string[] = [];
  
  for (let i = 0; i < words.length; i += chunkSize - overlap) {
    const chunk = words.slice(i, i + chunkSize).join(' ');
    chunks.push(chunk);
  }
  
  return chunks;
}

/**
 * Process a document by chunking and generating embeddings
 */
export async function processDocument(title: string, content: string, metadata: Record<string, any> = {}) {
  // Create the document first
  const document = await createDocument(title, content, metadata);
  
  // Chunk the content
  const chunks = chunkText(content);
  
  // Generate embeddings for all chunks in a batch for efficiency
  const embeddings = await generateEmbeddingsBatch(chunks);
  
  // Create chunk records with embeddings
  const chunkData = chunks.map((text, index) => ({
    text,
    index,
    embedding: embeddings[index]
  }));
  
  await createChunks(document.id, chunkData);
  
  // Generate embedding for the full document (using title + first chunk)
  const documentEmbedding = await generateEmbedding(
    `${title}\n\n${chunks[0]?.substring(0, 1000) || content.substring(0, 1000)}`
  );
  
  // Update document with embedding
  await updateDocument(document.id, { 
    title, 
    content, 
    metadata: { ...metadata, chunk_count: chunks.length } 
  });
  
  // Update the document's embedding
  const client = await pool.connect();
  try {
    await client.query(
      'UPDATE documents SET embedding = $1 WHERE id = $2',
      [arrayToVector(documentEmbedding), document.id]
    );
  } catch (error) {
    console.error('Error updating document embedding:', error);
    throw error;
  } finally {
    client.release();
  }
  
  return {
    documentId: document.id,
    chunkCount: chunks.length,
    documentEmbedding
  };
}
```