import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { errorHandler, requestLogger, correlationId } from './middleware/logging';
import { securityHeaders } from './middleware/securityHeaders';
import { corsMiddleware } from './middleware/cors';
import apiRoutes from './routes/api';
import healthRoutes from './routes/health';

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
app.use(express.json());

// API routes
app.use('/api', apiRoutes);

// Health check routes
app.use('/api', healthRoutes);

// Error handling middleware (should be last)
app.use(errorHandler);

export default app;
```

```typescript
// SECURITY FIX: Update package.json to use Vite