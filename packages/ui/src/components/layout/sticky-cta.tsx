'use client';

import * as React from 'react';
import { PhoneCall, Calendar } from 'lucide-react';

export function StickyConsultationCta(): JSX.Element {
  return (
    <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2 drop-shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <a
        href="/contact"
        className="flex items-center gap-2.5 rounded-full bg-[#1B2A4A] px-5 py-3 text-sm font-semibold text-white shadow-2xl transition-all duration-300 hover:bg-[#253966] hover:scale-105 active:scale-95 border-2 border-white/20"
      >
        <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
        <Calendar className="h-4 w-4 text-[#E8823A]" />
        <span>Book Free Consultation</span>
      </a>

      <a
        href="tel:8802222422"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#1B2A4A] shadow-xl border border-slate-200 transition-all hover:bg-slate-50 hover:scale-105 active:scale-95"
        title="Call a Chartered Accountant Now"
        aria-label="Call a Chartered Accountant"
      >
        <PhoneCall className="h-5 w-5 text-[#C43D6B]" />
      </a>
    </div>
  );
}
