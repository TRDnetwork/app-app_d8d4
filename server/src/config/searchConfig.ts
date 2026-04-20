// Search configuration
export const searchConfig = {
  algoliaAppId: process.env.ALGOLIA_APP_ID,
  algoliaSearchKey: process.env.ALGOLIA_SEARCH_KEY,
  algoliaAdminKey: process.env.ALGOLIA_ADMIN_KEY,
  algoliaIndexName: process.env.ALGOLIA_INDEX_NAME || 'products',
};

// Validate required search configuration
if (!searchConfig.algoliaAppId || !searchConfig.algoliaAdminKey) {
  console.warn('Algolia configuration is incomplete. Search functionality may be limited.');
}
```

```typescript
// SECURITY FIX: Use environment variables for payment configuration