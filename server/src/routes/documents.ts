```typescript
import { Router } from 'express';
import multer from 'multer';
import { processDocument } from '../lib/embeddings';
import { createDocument, getDocument, updateDocument, deleteDocument } from '../db/vector';
import { protect } from '../middleware/auth';

const router = Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

/**
 * POST /api/documents/upload
 * Accept text/PDF, chunk, embed, and store
 */
router.post('/upload', protect, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const { title } = req.body;
    let content = '';
    
    // Handle different file types
    if (req.file.mimetype === 'application/pdf') {
      // For PDF files, you would use a PDF parsing library
      // This is a placeholder - in production, use pdf-parse or similar
      content = req.file.buffer.toString('utf-8').substring(0, 10000); // Limit content size
    } else if (req.file.mimetype === 'text/plain') {
      content = req.file.buffer.toString('utf-8');
    } else {
      return res.status(400).json({ error: 'Unsupported file type. Please upload a PDF or text file.' });
    }
    
    // Add metadata
    const metadata = {
      filename: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      uploadedBy: req.user.id,
      uploadedAt: new Date().toISOString()
    };
    
    // Process the document (chunk, embed, store)
    const result = await processDocument(
      title || req.file.originalname,
      content,
      metadata
    );
    
    res.status(201).json({
      message: 'Document uploaded and processed successfully',
      documentId: result.documentId,
      chunkCount: result.chunkCount
    });
  } catch (error) {
    console.error('Error uploading document:', error);
    res.status(500).json({ error: 'Failed to upload document' });
  }
});

/**
 * GET /api/documents/:id
 * Get a specific document
 */
router.get('/:id', protect, async (req, res) => {
  try {
    const document = await getDocument(req.params.id);
    
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    // Don't return the embedding in the response
    const { embedding, ...documentWithoutEmbedding } = document;
    
    res.json(documentWithoutEmbedding);
  } catch (error) {
    console.error('Error getting document:', error);
    res.status(500).json({ error: 'Failed to get document' });
  }
});

/**
 * PUT /api/documents/:id
 * Update a document
 */
router.put('/:id', protect, async (req, res) => {
  try {
    const { title, content, metadata } = req.body;
    const updates: { title?: string; content?: string; metadata?: Record<string, any> } = {};
    
    if (title) updates.title = title;
    if (content) updates.content = content;
    if (metadata) updates.metadata = metadata;
    
    const document = await updateDocument(req.params.id, updates);
    
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    res.json(document);
  } catch (error) {
    console.error('Error updating document:', error);
    res.status(500).json({ error: 'Failed to update document' });
  }
});

/**
 * DELETE /api/documents/:id
 * Delete a document
 */
router.delete('/:id', protect, async (req, res) => {
  try {
    await deleteDocument(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

export default router;
```