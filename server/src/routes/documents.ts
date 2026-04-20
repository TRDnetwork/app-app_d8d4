import express from 'express';
import { processDocument } from '../lib/embeddings';
import { pool } from '../db/vector';
import { authenticateToken } from '../middleware/auth';
import multer from 'multer';
import { env } from '../config/env';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow only text and PDF files
    if (file.mimetype === 'text/plain' || 
        file.mimetype === 'application/pdf' ||
        file.mimetype === 'text/markdown') {
      cb(null, true);
    } else {
      cb(new Error('Only text, markdown, and PDF files are allowed'));
    }
  }
});

// Extract text from PDF
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  // In a real implementation, you would use a PDF parsing library
  // For now, return a placeholder
  return 'Extracted text from PDF would go here';
}

// POST /api/documents/upload - Accept text/PDF, chunk, embed, store
router.post('/upload', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    let title: string;
    let content: string;
    
    if (req.file) {
      // Handle file upload
      title = req.file.originalname;
      
      if (req.file.mimetype === 'application/pdf') {
        content = await extractTextFromPDF(req.file.buffer);
      } else {
        content = req.file.buffer.toString('utf-8');
      }
    } else if (req.body.title && req.body.content) {
      // Handle text input
      title = req.body.title;
      content = req.body.content;
    } else {
      return res.status(400).json({ error: 'No file or content provided' });
    }
    
    // Process the document
    const documentId = await processDocument(title, content, {
      userId: req.user.id,
      fileType: req.file?.mimetype || 'text/plain',
      uploadDate: new Date().toISOString(),
      ...req.body.metadata
    });
    
    res.status(201).json({ 
      message: 'Document processed successfully',
      documentId 
    });
  } catch (error: any) {
    console.error('Error uploading document:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/search - Semantic search with cosine similarity
router.post('/search', authenticateToken, async (req, res) => {
  try {
    const { query, limit = 5, threshold = 0.7 } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }
    
    // Generate embedding for the search query
    const queryEmbedding = await generateEmbeddings(query);
    
    // Search in chunks table for better precision
    const result = await pool.query(
      `SELECT 
         d.id,
         d.title,
         d.content,
         d.metadata,
         c.chunk_text,
         1 - (c.chunk_embedding <=> $1) as similarity
       FROM chunks c
       JOIN documents d ON c.document_id = d.id
       WHERE 1 - (c.chunk_embedding <=> $1) > $2
       ORDER BY similarity DESC
       LIMIT $3`,
      [queryEmbedding, threshold, limit]
    );
    
    // Group results by document
    const documentsMap = new Map<string, any>();
    result.rows.forEach(row => {
      if (!documentsMap.has(row.id)) {
        documentsMap.set(row.id, {
          id: row.id,
          title: row.title,
          content: row.content,
          metadata: row.metadata,
          chunks: [],
          similarity: row.similarity
        });
      }
      documentsMap.get(row.id).chunks.push({
        text: row.chunk_text,
        similarity: row.similarity
      });
    });
    
    const documents = Array.from(documentsMap.values());
    
    res.json({ 
      query,
      results: documents,
      count: documents.length
    });
  } catch (error: any) {
    console.error('Error searching documents:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/ask - RAG query: search → inject context → LLM answer
router.post('/ask', authenticateToken, async (req, res) => {
  try {
    const { question, maxChunks = 3 } = req.body;
    
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }
    
    // First, search for relevant document chunks
    const searchResult = await pool.query(
      `SELECT 
         d.title,
         c.chunk_text,
         1 - (c.chunk_embedding <=> $1) as similarity
       FROM chunks c
       JOIN documents d ON c.document_id = d.id
       ORDER BY similarity DESC
       LIMIT $2`,
      [await generateEmbeddings(question), maxChunks]
    );
    
    // Prepare context from search results
    const context = searchResult.rows.map(row => 
      `Document: ${row.title}\nContent: ${row.chunk_text}`
    ).join('\n\n');
    
    // Use OpenAI to generate answer with context
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that answers questions based on the provided context. If the context does not contain enough information to answer the question, say "I don\'t know based on the available information."'
        },
        {
          role: 'user',
          content: `Context:\n${context}\n\nQuestion: ${question}\n\nAnswer:`
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });
    
    const answer = completion.choices[0].message.content || '';
    
    res.json({
      question,
      answer,
      sources: searchResult.rows.map(row => ({
        title: row.title,
        similarity: row.similarity
      }))
    });
  } catch (error: any) {
    console.error('Error processing RAG query:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
```

```typescript