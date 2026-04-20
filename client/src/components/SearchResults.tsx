```tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SearchResult {
  id: string;
  title: string;
  chunk_text: string;
  similarity: number;
  metadata: Record<string, any>;
}

export default function SearchResults({ results }: { results: SearchResult[] }) {
  if (results.length === 0) {
    return (
      <div className="text-center py-8 text-text_dim">
        No results found. Try a different search term.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {results.map((result) => (
        <Card key={result.id}>
          <CardHeader>
            <CardTitle className="text-lg">{result.title}</CardTitle>
            <div className="text-sm text-text_dim">
              Similarity: {(result.similarity * 100).toFixed(1)}%
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-text_dim mb-2">...{result.chunk_text}...</p>
            {result.metadata.filename && (
              <div className="text-xs text-text_dim">
                File: {result.metadata.filename}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
```