'use client';

import React, { useState, useMemo } from 'react';
import {
  knowledgeResourcesLibrary,
} from '@thabrez/config';
import {
  BookOpen,
  Search,
  FileText,
  Scale,
  FileCheck,
  Bell,
  Calendar,
  Layers,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';

export function ResourcesLibraryView(): JSX.Element {
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const typeTabs = [
    { id: 'ALL', label: 'All Knowledge Bank', icon: Layers },
    { id: 'ACT', label: 'Acts & Bare Laws', icon: Scale },
    { id: 'RULE', label: 'Rules & Regulations', icon: BookOpen },
    { id: 'FORM', label: 'Statutory Forms & Guides', icon: FileCheck },
    { id: 'BULLETIN', label: 'Practice Bulletins', icon: Bell },
    { id: 'CIRCULAR', label: 'Departmental Circulars', icon: FileText },
  ];

  const categories = [
    'ALL',
    'Income Tax',
    'GST',
    'Corporate Governance',
    'Income Tax & Audit',
    'Direct & Indirect Tax',
  ];

  const filteredResources = useMemo(() => {
    return knowledgeResourcesLibrary.filter((item) => {
      const matchType = selectedType === 'ALL' || item.type === selectedType;
      const matchCategory =
        selectedCategory === 'ALL' || item.category === selectedCategory;
      const matchSearch =
        !searchQuery.trim() ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.statutoryReference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());

      return matchType && matchCategory && matchSearch;
    });
  }, [selectedType, selectedCategory, searchQuery]);

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'ACT':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'RULE':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'FORM':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'BULLETIN':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'CIRCULAR':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      {/* Category Sidebar */}
      <div className="lg:col-span-3 space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-3">
            Resource Classification
          </h3>

          <div className="space-y-1">
            {typeTabs.map((tab) => {
              const Icon = tab.icon;
              const isSelected = selectedType === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedType(tab.id)}
                  className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-[#1B2A4A] text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </span>
                  <ChevronRight className={`h-3 w-3 ${isSelected ? 'opacity-100' : 'opacity-40'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Practice Area Filter */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
            Practice Area
          </h3>

          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-md px-2.5 py-1 text-[11px] font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#8B3FA8] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'ALL' ? 'All Practice Areas' : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="lg:col-span-9 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search across Acts, Rules, Forms, Circulars, Section numbers, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 py-3 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-[#1B2A4A] focus:outline-none focus:ring-1 focus:ring-[#1B2A4A]"
          />
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>
            Found <strong>{filteredResources.length}</strong> statutory documents
          </span>
          <span>Updated as of August 2026</span>
        </div>

        {/* Resources Cards Grid */}
        {filteredResources.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-3">
            <p className="text-sm font-semibold text-slate-700">No resources found matching your search criteria.</p>
            <button
              type="button"
              onClick={() => {
                setSelectedType('ALL');
                setSelectedCategory('ALL');
                setSearchQuery('');
              }}
              className="text-xs font-bold text-[#8B3FA8] hover:underline"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredResources.map((item) => (
              <Link
                key={item.id}
                href={`/resources/${item.slug}`}
                className="group block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-slate-300 hover:shadow-md transition-all space-y-4"
              >
                {/* Header: Type Badge & Reference */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getTypeBadge(
                        item.type,
                      )}`}
                    >
                      {item.typeLabel}
                    </span>
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                      {item.category}
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-400 font-mono">
                    Ref: {item.statutoryReference}
                  </span>
                </div>

                {/* Title & Summary */}
                <div className="space-y-1.5">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#1B2A4A] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2">
                    {item.summary}
                  </p>
                </div>

                {/* Footer Metadata */}
                <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" /> Updated: {item.lastUpdated}
                    </span>
                    <span className="font-mono text-[11px] text-slate-400">
                      {item.fileSizeOrFormat}
                    </span>
                  </div>

                  <span className="font-bold text-[#8B3FA8] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Read Full Statute &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
