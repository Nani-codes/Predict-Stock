'use client';

import { useState, useEffect } from 'react';
import { Card, TextInput } from '@tremor/react';
import { FiSearch } from 'react-icons/fi';

interface SearchResult {
  symbol: string;
  shortName: string;
}

interface StockSearchProps {
  onSearch: (symbol: string) => void;
}

export default function StockSearch({ onSearch }: StockSearchProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const searchStocks = async () => {
      if (query.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Search failed');
        const data = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.error('Search error:', error);
        setSuggestions([]);
      }
    };

    const debounceTimer = setTimeout(searchStocks, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      const symbol = suggestions.length > 0 ? suggestions[0].symbol : query.toUpperCase();
      onSearch(symbol);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (symbol: string) => {
    onSearch(symbol);
    setQuery('');
    setShowSuggestions(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto relative">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <TextInput
            icon={FiSearch}
            placeholder="Search by company name or symbol (e.g., Apple or AAPL)"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            className="w-full bg-white/10 border-gray-700 text-white placeholder-gray-400"
          />
        </div>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <Card className="absolute w-full mt-1 bg-slate-800 border-gray-700 z-50 max-h-60 overflow-y-auto">
          <div className="divide-y divide-gray-700">
            {suggestions.map((item) => (
              <div
                key={item.symbol}
                onClick={() => handleSuggestionClick(item.symbol)}
                className="p-3 hover:bg-slate-700 cursor-pointer transition-colors"
              >
                <div className="font-medium text-white">{item.shortName}</div>
                <div className="text-sm text-gray-400">{item.symbol}</div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
