import mongoose from 'mongoose';
import { cleanEnv, str, num } from 'envalid';

// Validate required environment variables
const env = cleanEnv(process.env, {
  MONGODB_URI: str(),
  MONGODB_CONNECTION_TIMEOUT: num({ default: 5000 }),
  MONGODB_SOCKET_TIMEOUT: num({ default: 45000 }),
});

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: env.MONGODB_CONNECTION_TIMEOUT,
      socketTimeoutMS: env.MONGODB_SOCKET_TIMEOUT,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
```

```typescript