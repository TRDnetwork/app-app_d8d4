import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { initVectorDB } from './db/vector';
import documentsRouter from './routes/documents';
import { errorHandler, requestLogger, correlationId } from './middleware/logging';
import { securityHeaders } from './middleware/securityHeaders';
import { corsMiddleware } from './middleware/cors';
import { env } from './config/env';

const app = express();

// Security middleware
app.use(helmet());
app.use(securityHeaders);
app.use(corsMiddleware);

// Request ID middleware
app.use(correlationId);

// Logging middleware
app.use(requestLogger);

// Parse JSON
app.use(express.json({ limit: '10mb' }));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: env.npm_package_version || '1.0.0',
  });
});

// API routes
app.use('/api/documents', documentsRouter);

// Error handling middleware (should be last)
app.use(errorHandler);

// Initialize vector database
initVectorDB().catch(console.error);

export default app;
```

```typescript