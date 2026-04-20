```typescript
import { Router } from 'express';
import { generateEmbedding } from '../lib/embeddings';
import { semanticSearch } from '../db/vector';
import { protect } from '../middleware/auth';

const router = Router();

/**
 * POST /api/search
 * Semantic search with cosine similarity
 */
router.post('/', protect, async (req, res) => {
  try {
    const { query, limit = 5 } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }
    
    // Generate embedding for the search query
    const queryEmbedding = await generateEmbedding(query);
    
    // Perform semantic search
    const results = await semanticSearch(queryEmbedding, limit);
    
    res.json({
      query,
      results: results.map(result => ({
        id: result.id,
        title: result.title,
        content: result.content,
        chunk_text: result.chunk_text,
        similarity: result.similarity,
        metadata: result.metadata,
        created_at: result.created_at
      }))
    });
  } catch (error) {
    console.error('Error performing search:', error);
    res.status(500).json({ error: 'Failed to perform search' });
  }
});

export default router;
```