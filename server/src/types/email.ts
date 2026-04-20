export interface EmailTemplate {
  subject: string;
  html: string;
  text?: string;
}
```

```typescript
// SECURITY FIX: Use environment variables for client URL