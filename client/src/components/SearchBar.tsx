```tsx
'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function SearchBar({ onSearch }: { onSearch: (query: string) => void }) {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    setIsSearching(true);
    
    try {
      onSearch(query);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search documents..."
        className="pr-10"
      />
      <button
        type="submit"
        disabled={isSearching}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-text_dim hover:text-text"
      >
        <Search className="h-4 w-4" />
      </button>
    </form>
  );
}
```