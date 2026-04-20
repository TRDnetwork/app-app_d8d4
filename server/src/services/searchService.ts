```ts
import { SearchClient, searchClient } from 'algoliasearch';
import { config } from '../config/env';

// Validate Algolia config at module load
const requiredEnvVars = [
  { key: 'ALGOLIA_APP_ID', value: config.ALGOLIA_APP_ID },
  { key: 'ALGOLIA_ADMIN_KEY', value: config.ALGOLIA_ADMIN_KEY },
  { key: 'ALGOLIA_SEARCH_KEY', value: config.ALGOLIA_SEARCH_KEY },
];

const missingVars = requiredEnvVars.filter(env => !env.value);
if (missingVars.length > 0) {
  throw new Error(`❌ Missing required environment variables: ${missingVars.map(v => v.key).join(', ')}`);
}

const searchClient: SearchClient = searchClient(
  config.ALGOLIA_APP_ID,
  config.ALGOLIA_ADMIN_KEY
);

const searchIndex = searchClient.initIndex(config.ALGOLIA_INDEX_NAME);

export { searchClient, searchIndex };
```