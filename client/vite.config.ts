// [framework-lock] stripped: import from 'vite' (banned for next)
// [framework-lock] stripped: import from '@vitejs/plugin-react' (banned for next)
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true, // Enable source maps for error tracking
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  define: {
    'import.meta.env.VITE_SENTRY_DSN': JSON.stringify(process.env.VITE_SENTRY_DSN),
  },
});
```

```typescript
// SECURITY FIX: Remove Supabase Edge Functions and use Express API routes