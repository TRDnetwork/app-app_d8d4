```typescript
import { Router } from 'express';
import OpenAI from 'openai';
import { generateEmbedding } from '../lib/embeddings';
import { semanticSearch } from '../db/vector';
import { protect } from '../middleware/auth';

const router = Router();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * POST /api/ask
 * RAG query: search → inject context → LLM answer
 */
router.post('/', protect, async (req, res) => {
  try {
    const { question, contextLimit = 3 } = req.body;
    
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }
    
    // Step 1: Generate embedding for the question
    const questionEmbedding = await generateEmbedding(question);
    
    // Step 2: Perform semantic search to find relevant context
    const searchResults = await semanticSearch(questionEmbedding, contextLimit);
    
    // Step 3: Extract context from search results
    const context = searchResults
      .map(result => result.chunk_text)
      .join('\n\n');
    
    // Step 4: Create prompt for LLM with injected context
    const prompt = `
You are a helpful assistant that answers questions based on the provided context.
Answer the question using only the information in the context below.
If you don't know the answer, say "I don't know based on the information provided."

Context:
${context}

Question: ${question}

Answer:
    `.trim();
    
    // Step 5: Call LLM to generate answer
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that answers questions based on the provided context.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });
    
    const answer = completion.choices[0].message.content?.trim() || '';
    
    res.json({
      question,
      answer,
      context: searchResults.map(result => ({
        id: result.id,
        title: result.title,
        content: result.chunk_text,
        similarity: result.similarity
      }))
    });
  } catch (error) {
    console.error('Error processing RAG query:', error);
    res.status(500).json({ error: 'Failed to process query' });
  }
});

export default router;
```