'use client';

import * as React from 'react';
import { Search, X, ArrowRight, Sparkles, Tag } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface KnowledgeSearchBarProps {
  initialQuery?: string;
  onSearch?: (query: string) => void;
  placeholder?: string;
  showSuggestions?: boolean;
}

const POPULAR_SEARCH_TAGS = [
  'Section 115BAC',
  '194Q TDS',
  'GSTR-3B Due Date',
  'Income-tax Act 2025',
  'MCA Form AOC-4',
  'Code on Wages',
  'GST Rate 18%',
  'DIR-3 KYC',
];

export function KnowledgeSearchBar({
  initialQuery = '',
  onSearch,
  placeholder = 'Search Acts, Rules, Circulars, Notifications, Forms, Deadlines (e.g. 194Q, 115BAC, GSTR 3B)...',
  showSuggestions = true,
}: KnowledgeSearchBarProps): JSX.Element {
  const [query, setQuery] = React.useState(initialQuery);
  const router = useRouter();

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanQuery = query.trim();
    if (onSearch) {
      onSearch(cleanQuery);
    } else {
      router.push(`/knowledge-bank?q=${encodeURIComponent(cleanQuery)}`);
    }
  };

  const handleTagClick = (tag: string) => {
    setQuery(tag);
    if (onSearch) {
      onSearch(tag);
    } else {
      router.push(`/knowledge-bank?q=${encodeURIComponent(tag)}`);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-3">
      <form onSubmit={handleFormSubmit} className="relative group">
        <div className="relative flex items-center bg-white rounded-2xl border-2 border-slate-200 shadow-xl group-focus-within:border-[#8B3FA8] group-focus-within:ring-4 group-focus-within:ring-purple-500/10 transition-all overflow-hidden">
          <div className="pl-4 sm:pl-5 text-slate-400 group-focus-within:text-[#8B3FA8] transition-colors">
            <Search className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (onSearch) onSearch(e.target.value);
            }}
            placeholder={placeholder}
            className="w-full py-4 pl-3 pr-24 text-sm sm:text-base font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
          />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                if (onSearch) onSearch('');
              }}
              className="p-2 text-slate-400 hover:text-slate-600 transition-colors mr-1"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          <div className="pr-2 sm:pr-3">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 sm:px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#8B3FA8] via-[#A83279] to-[#E8823A] text-white font-bold text-xs sm:text-sm hover:opacity-95 shadow-md transition-all hover:scale-[1.02] active:scale-95 shrink-0"
            >
              <span>Search</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </form>

      {/* Quick Search Tag Pills */}
      {showSuggestions && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1 px-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-1">
            <Sparkles className="h-3 w-3 text-[#E8823A]" /> Trending:
          </span>
          {POPULAR_SEARCH_TAGS.map((tag, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleTagClick(tag)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/80 hover:bg-purple-50 text-slate-700 hover:text-[#8B3FA8] border border-slate-200 hover:border-purple-300 shadow-sm transition-all"
            >
              <Tag className="h-2.5 w-2.5 text-slate-400" />
              <span>{tag}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
