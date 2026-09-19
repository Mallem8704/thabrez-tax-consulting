'use client';

import * as React from 'react';
import { History, CheckCircle2, ShieldCheck, ExternalLink, Sparkles } from 'lucide-react';
import { LegalAmendmentDto, KnowledgeDocumentDto } from '@thabrez/types';

export interface AmendmentDiffViewerProps {
  document?: KnowledgeDocumentDto;
  amendment?: LegalAmendmentDto;
  provision?: string;
  amendmentTitle?: string;
  effectiveYear?: string;
  gazetteRef?: string;
  beforeText?: string;
  afterText?: string;
  practicalImpact?: string;
  officialSourceUrl?: string;
}

export function AmendmentDiffViewer({
  document,
  amendment,
  provision,
  amendmentTitle,
  effectiveYear,
  gazetteRef,
  beforeText,
  afterText,
  practicalImpact,
  officialSourceUrl,
}: AmendmentDiffViewerProps): JSX.Element {
  const title = amendmentTitle || amendment?.title || 'Statutory Amendment';
  const prov = provision || amendment?.amendmentNumber || 'Statutory Provision';
  const prev = beforeText || amendment?.previousText || 'Prior statutory text as originally enacted.';
  const current = afterText || amendment?.newText || 'Amended provision currently in force.';
  const year = effectiveYear || (amendment?.effectiveDate ? new Date(amendment.effectiveDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'FY 2026–2027');
  const gazette = gazetteRef || amendment?.amendmentNumber || document?.documentNumber || 'Finance Act / Gazette Notification';
  const impact = practicalImpact || amendment?.description;
  const sourceUrl = officialSourceUrl || document?.officialSourceUrl;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-4 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-800 uppercase font-mono">
              <History className="h-3 w-3" />
              {prov}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {gazette}
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-900 font-display">
            {title}
          </h3>
        </div>

        {year && (
          <span className="text-xs font-medium text-slate-500 shrink-0">
            Effective: <strong className="text-slate-900">{year}</strong>
          </span>
        )}
      </div>

      {impact && (
        <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-100 text-xs text-purple-950 space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-[#8B3FA8]">
            <Sparkles className="h-3.5 w-3.5" /> Practical Compliance Impact:
          </div>
          <p className="text-slate-700 leading-relaxed">{impact}</p>
        </div>
      )}

      {/* Side by Side Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Earlier Provision */}
        <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800">
              Earlier Provision (Pre-Amendment)
            </span>
            <span className="text-[10px] font-mono text-rose-600">Superseded</span>
          </div>
          <div className="text-xs text-slate-700 font-sans leading-relaxed line-through decoration-rose-400 whitespace-pre-line">
            {prev}
          </div>
        </div>

        {/* Current Provision */}
        <div className="rounded-xl border border-emerald-300 bg-emerald-50/60 p-4 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Current Enacted Provision
            </span>
            <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-200/60 px-1.5 py-0.5 rounded">Active Law</span>
          </div>
          <div className="text-xs font-medium text-slate-900 font-sans leading-relaxed whitespace-pre-line">
            {current}
          </div>
        </div>
      </div>

      {sourceUrl && (
        <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100">
          <span className="text-slate-400 text-[11px]">
            Official Source: {gazette}
          </span>
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-emerald-700 font-bold hover:underline"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Verify Official Gazette</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      )}
    </div>
  );
}
