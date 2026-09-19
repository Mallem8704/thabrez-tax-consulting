'use client';

import * as React from 'react';
import { Scale, Clock } from 'lucide-react';

export function LegalDisclaimerFooter(): JSX.Element {
  return (
    <section className="bg-slate-100 border-t border-slate-200 py-8 text-slate-600 font-sans text-xs">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-start gap-4">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-700 shrink-0 mt-0.5">
            <Scale className="h-5 w-5" />
          </div>

          <div className="space-y-1.5 flex-1 text-slate-600 leading-relaxed text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                Statutory &amp; General Information Notice
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                <Clock className="h-3 w-3" /> Updated for FY 2026–2027
              </span>
            </div>
            <p>
              The information, acts, rules, circulars, notifications, tax rates, and calculators provided in this Knowledge Bank are intended strictly for general educational and informational purposes. Laws, statutory rules, rate matrices, procedures, and statutory due dates may change through subsequent government notifications, official circulars, parliamentary amendments, or judicial rulings.
            </p>
            <p className="text-slate-500 text-[11px]">
              Taxpayers are strongly advised to verify the latest official gazette publication or consult a qualified Chartered Accountant / legal counsel before executing financial decisions or statutory submissions based on this data.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
