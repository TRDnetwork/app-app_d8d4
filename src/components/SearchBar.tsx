'use client';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

export function SearchBar() {
  const t = useTranslations();
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // Handle search submission
      console.log('Searching for:', query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text_dim" />
        <Input
          type="text"
          placeholder={t('nav.search')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 py-6 text-lg"
        />
      </div>
    </form>
  );
}