import React, { useState } from 'react';
import { Input } from './ui/input';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Input
        type="text"
        placeholder="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-10 pr-4 py-2 w-full bg-background border-input focus:ring-1 focus:ring-ring"
      />
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text_dim" />
    </form>
  );
};

export default SearchBar;