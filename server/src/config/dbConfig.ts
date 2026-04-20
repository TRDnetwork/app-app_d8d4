// Database configuration
export const dbConfig = {
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/shopsphere',
  dbName: process.env.MONGODB_DB_NAME || 'shopsphere',
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  },
};
```

```typescript
// SECURITY FIX: Use environment variables for server configuration