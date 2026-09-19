'use client';

import * as React from 'react';
import { ShieldCheck, ExternalLink, Clock, Tag } from 'lucide-react';
import { AuthorityType, DocLegislationStatus } from '@thabrez/types';

export interface VerifiedSourceBadgeProps {
  authority: AuthorityType | string;
  documentNumber?: string | null | undefined;
  officialSourceUrl?: string | null | undefined;
  sourceUrl?: string | null | undefined;
  lastVerifiedAt?: string | null | undefined;
  status?: DocLegislationStatus | string | undefined;
  isOfficial?: boolean | undefined;
  compact?: boolean | undefined;
  size?: 'sm' | 'md' | 'lg' | undefined;
}

export function VerifiedSourceBadge({
  authority,
  documentNumber,
  officialSourceUrl,
  sourceUrl,
  lastVerifiedAt,
  status = 'CURRENT',
  isOfficial = true,
  compact = false,
  size = 'md',
}: VerifiedSourceBadgeProps): JSX.Element {
  const isSm = size === 'sm' || compact;
  const effectiveUrl = officialSourceUrl || sourceUrl;

  const getStatusBadge = (st: string) => {
    switch (st.toUpperCase()) {
      case 'CURRENT':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Current Law
          </span>
        );
      case 'HISTORICAL':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
            Historical / Reference
          </span>
        );
      case 'AMENDED':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
            Amended
          </span>
        );
      case 'SUPERSEDED':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
            Superseded
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
            {st}
          </span>
        );
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Authority Pill */}
      <span className="inline-flex items-center gap-1 rounded-md bg-[#1B2A4A]/10 text-[#1B2A4A] px-2 py-0.5 text-xs font-bold font-mono">
        <Tag className="h-3 w-3 text-[#8B3FA8]" />
        {authority}
      </span>

      {/* Document Number if exists */}
      {documentNumber && (
        <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-mono font-medium text-slate-700">
          {documentNumber}
        </span>
      )}

      {/* Status Badge */}
      {!compact && getStatusBadge(status)}

      {/* Official Source Verified Tag */}
      {effectiveUrl ? (
        <a
          href={effectiveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 hover:underline bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded transition-colors"
          title="Verified against official Government Gazette or Portal"
        >
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span>{isOfficial ? 'Official Source Verified ✓' : 'Statutory Source'}</span>
          <ExternalLink className="h-2.5 w-2.5 text-emerald-600" />
        </a>
      ) : (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span>Statutory Law</span>
        </span>
      )}

      {/* Last Verified Date */}
      {lastVerifiedAt && !isSm && (
        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-400">
          <Clock className="h-2.5 w-2.5" />
          <span>Verified {new Date(lastVerifiedAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
        </span>
      )}
    </div>
  );
}
