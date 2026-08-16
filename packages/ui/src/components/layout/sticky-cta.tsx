'use client';

import * as React from 'react';
import { PhoneCall, Calendar } from 'lucide-react';
import { WhatsAppIcon } from '../whatsapp-icon';

export function StickyConsultationCta(): JSX.Element {
  const whatsappNumber = '918802222422';
  const whatsappMessage = encodeURIComponent(
    'Hi Thabrez & Co. Chartered Accountants, I would like to speak to a CA regarding tax planning / GST / corporate compliance.',
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2.5 drop-shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-500">
      {/* Direct WhatsApp Fast-Track Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-12 w-12 sm:h-13 sm:w-13 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition-all duration-300 hover:scale-110 hover:bg-[#20bd5a] active:scale-95 border-2 border-white/50"
        title="Instant WhatsApp with Senior CA"
        aria-label="Chat on WhatsApp with Senior CA"
      >
        <WhatsAppIcon size={28} className="fill-white" />
      </a>

      {/* Main High-Contrast Consultation Trigger */}
      <a
        href="/contact"
        className="group relative flex items-center gap-2.5 rounded-full bg-[#1B2A4A] pl-4 pr-5 py-3 text-xs sm:text-sm font-semibold text-white shadow-2xl transition-all duration-300 hover:bg-[#253966] hover:scale-105 active:scale-95 border-2 border-emerald-400/40"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
        </span>
        <Calendar className="h-4 w-4 text-[#E8823A] transition-transform group-hover:rotate-12" />
        <div className="flex flex-col text-left">
          <span className="leading-tight">Free CA Consultation</span>
          <span className="text-[10px] font-normal text-emerald-300 hidden sm:inline">15-Min Response SLA</span>
        </div>
      </a>

      {/* Direct Emergency Phone Call */}
      <a
        href="tel:8802222422"
        className="hidden md:flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#1B2A4A] shadow-xl border border-slate-200 transition-all duration-300 hover:bg-slate-50 hover:scale-110 active:scale-95"
        title="Call Chartered Accountant Desk Now"
        aria-label="Call Chartered Accountant Desk"
      >
        <PhoneCall className="h-5 w-5 text-[#C43D6B]" />
      </a>
    </div>
  );
}
