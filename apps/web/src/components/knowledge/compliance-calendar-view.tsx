'use client';

import * as React from 'react';
import { Clock, AlertTriangle, ShieldCheck, Tag, Filter } from 'lucide-react';
import { ComplianceDeadlineItemDto } from '@thabrez/types';
import { SEED_COMPLIANCE_DEADLINES } from '../../lib/knowledge/data/seed-knowledge';

export interface ComplianceCalendarViewProps {
  initialDeadlines?: ComplianceDeadlineItemDto[];
}

export function ComplianceCalendarView({
  initialDeadlines = SEED_COMPLIANCE_DEADLINES,
}: ComplianceCalendarViewProps): JSX.Element {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('ALL');
  const [viewMode, setViewMode] = React.useState<'list' | 'timeline'>('list');

  const categories = ['ALL', 'GST', 'INCOME_TAX', 'TDS', 'MCA', 'ADVANCE_TAX'];

  const filtered = initialDeadlines.filter((item) => {
    if (selectedCategory === 'ALL') return true;
    return item.category.toUpperCase() === selectedCategory.toUpperCase();
  });

  const getPriorityBadge = (priority: string) => {
    if (priority === 'CRITICAL') {
      return (
        <span className="inline-flex items-center gap-1 rounded bg-rose-100 text-rose-800 px-2 py-0.5 text-[10px] font-bold uppercase">
          <AlertTriangle className="h-3 w-3" /> Critical Due Date
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded bg-amber-100 text-amber-800 px-2 py-0.5 text-[10px] font-bold uppercase">
        <Clock className="h-3 w-3" /> Statutory Deadline
      </span>
    );
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Category Filter Pills & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2 flex items-center gap-1">
            <Filter className="h-3.5 w-3.5 text-[#8B3FA8]" /> Filter:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-[#1B2A4A] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'list' ? 'bg-white text-[#1B2A4A] shadow-sm' : 'text-slate-600'
            }`}
          >
            List View
          </button>
          <button
            type="button"
            onClick={() => setViewMode('timeline')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'timeline' ? 'bg-white text-[#1B2A4A] shadow-sm' : 'text-slate-600'
            }`}
          >
            Radar View
          </button>
        </div>
      </div>

      {/* Deadlines List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => {
          const due = new Date(item.dueDate);
          const day = due.toLocaleDateString('en-IN', { day: '2-digit' });
          const month = due.toLocaleDateString('en-IN', { month: 'short' }).toUpperCase();
          const year = due.getFullYear();

          return (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-purple-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start gap-4">
                {/* Date Badge */}
                <div className="flex flex-col items-center justify-center rounded-2xl bg-[#1B2A4A] text-white p-3 min-w-[64px] shrink-0 text-center shadow-md">
                  <span className="text-xl font-extrabold font-mono leading-none">{day}</span>
                  <span className="text-[11px] font-bold text-[#E8823A] uppercase mt-1 leading-none">{month}</span>
                  <span className="text-[10px] text-slate-400 font-mono mt-0.5">{year}</span>
                </div>

                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-purple-50 text-[#8B3FA8] border border-purple-200">
                      <Tag className="h-2.5 w-2.5" /> {item.category}
                    </span>
                    {getPriorityBadge(item.priority)}
                    {item.isExtended && (
                      <span className="rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5">
                        Extended
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug font-display">
                    {item.title}
                  </h3>

                  {item.description && (
                    <p className="text-xs text-slate-600 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Statutory Footnote & Form Section */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
                <div className="flex items-center gap-2">
                  {item.form && (
                    <span className="font-mono font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                      {item.form}
                    </span>
                  )}
                  {item.section && (
                    <span className="text-[11px] text-slate-500">
                      {item.section}
                    </span>
                  )}
                </div>

                {item.sourceUrl && (
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:underline"
                  >
                    <ShieldCheck className="h-3 w-3" /> Official Portal
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
