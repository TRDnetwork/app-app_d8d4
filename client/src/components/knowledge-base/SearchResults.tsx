import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

interface SearchResultsProps {
  results: Array<{
    id: string;
    title: string;
    chunks: Array<{
      text: string;
      similarity: number;
    }>;
    metadata: Record<string, any>;
    similarity: number;
  }>;
  isLoading?: boolean;
}

export function SearchResults({ results, isLoading }: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-3 bg-muted rounded w-full mb-2"></div>
              <div className="h-3 bg-muted rounded w-5/6"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No results found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {results.map((result) => (
        <Card key={result.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg">{result.title}</CardTitle>
              <Badge variant="secondary">
                {(result.similarity * 100).toFixed(1)}% match
              </Badge>
            </div>
            {result.metadata && (
              <div className="flex flex-wrap gap-1 mt-2">
                {Object.entries(result.metadata).map(([key, value]) => (
                  <Badge key={key} variant="outline" className="text-xs">
                    {key}: {String(value)}
                  </Badge>
                ))}
              </div>
            )}
          </CardHeader>
          <CardContent>
            {result.chunks.map((chunk, i) => (
              <div key={i} className="mb-4 last:mb-0">
                <p className="text-sm text-muted-foreground mb-2">
                  {(chunk.similarity * 100).toFixed(1)}% relevant
                </p>
                <p className="text-sm leading-relaxed">{chunk.text}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
```

```typescript