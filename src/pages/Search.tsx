import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ProductCard } from '../components/product/ProductCard';
import { fetchWithAuth } from '../lib/api';
import { analytics } from '../lib/analytics';

const Search: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // Load search history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Extract query from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q') || '';
    setQuery(q);
    if (q) {
      performSearch(q);
    }
  }, [location.search]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const res = await fetchWithAuth(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      setProducts(res.data || []);
      
      // Update search history
      const newHistory = [searchQuery, ...searchHistory.filter(q => q !== searchQuery)].slice(0, 5);
      setSearchHistory(newHistory);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
      
      // Track search event
      analytics.trackSearch(searchQuery, res.data?.length || 0);
    } catch (err) {
      console.error('Search failed:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleHistoryClick = (searchQuery: string) => {
    setQuery(searchQuery);
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto mb-8">
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full py-3 pl-10 pr-4 rounded-full bg-muted text-text placeholder-text-dim focus:outline-none focus:ring-2 focus:ring-accent"
            autoFocus
          />
          <svg
            className="absolute left-3 top-3.5 h-5 w-5 text-text-dim"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                navigate('/search');
              }}
              className="absolute right-3 top-3.5 text-text-dim hover:text-text"
            >
              ×
            </button>
          )}
        </form>

        {searchHistory.length > 0 && !query && (
          <div className="mt-4 bg-surface rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-text">Recent Searches</h3>
              <button
                onClick={clearHistory}
                className="text-sm text-text-dim hover:text-text"
              >
                Clear
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {