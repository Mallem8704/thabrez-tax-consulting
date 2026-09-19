'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Scale,
  Building2,
  Calculator,
  Bell,
  ArrowRight,
  ChevronDown,
} from 'lucide-react';

interface KnowledgeMegaMenuProps {
  currentPath?: string;
  isMobile?: boolean;
}

export function KnowledgeMegaMenu({
  currentPath = '',
  isMobile = false,
}: KnowledgeMegaMenuProps): JSX.Element {
  const [isOpen, setIsOpen] = React.useState(false);
  const [mobileSectionOpen, setMobileSectionOpen] = React.useState<string | null>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  // Close when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMobileSection = (section: string) => {
    setMobileSectionOpen((prev) => (prev === section ? null : section));
  };

  // Mobile Accordion View
  if (isMobile) {
    return (
      <div className="space-y-1 py-1">
        <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <BookOpen className="h-3.5 w-3.5 text-[#8B3FA8]" /> Knowledge Bank
        </div>

        {/* Section 1: Tools & Execution */}
        <div className="rounded-xl bg-slate-50 border border-slate-100 overflow-hidden">
          <button
            type="button"
            onClick={() => toggleMobileSection('tools')}
            className="w-full flex items-center justify-between p-3 text-xs font-bold text-slate-800 hover:bg-slate-100"
          >
            <span className="flex items-center gap-2">
              <Calculator className="h-3.5 w-3.5 text-[#E8823A]" /> Compliance Tools
            </span>
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${mobileSectionOpen === 'tools' ? 'rotate-180' : ''}`} />
          </button>
          {mobileSectionOpen === 'tools' && (
            <div className="px-3 pb-3 space-y-1.5 text-xs text-slate-600 bg-white border-t border-slate-100 pt-2">
              <Link href="/knowledge-bank/tax-rates" className="block py-1 font-medium hover:text-[#8B3FA8]">Tax Rate Center (FY 2026-27)</Link>
              <Link href="/knowledge-bank/compliance-calendar" className="block py-1 font-medium hover:text-[#8B3FA8]">Statutory Compliance Calendar</Link>
              <Link href="/knowledge-bank/forms" className="block py-1 font-medium hover:text-[#8B3FA8]">Statutory Forms Library</Link>
              <Link href="/calculators" className="block py-1 font-medium hover:text-[#8B3FA8]">All 15+ Tax Calculators</Link>
            </div>
          )}
        </div>

        {/* Section 2: Direct Tax & GST */}
        <div className="rounded-xl bg-slate-50 border border-slate-100 overflow-hidden">
          <button
            type="button"
            onClick={() => toggleMobileSection('tax')}
            className="w-full flex items-center justify-between p-3 text-xs font-bold text-slate-800 hover:bg-slate-100"
          >
            <span className="flex items-center gap-2">
              <Scale className="h-3.5 w-3.5 text-[#8B3FA8]" /> Direct Tax &amp; GST
            </span>
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${mobileSectionOpen === 'tax' ? 'rotate-180' : ''}`} />
          </button>
          {mobileSectionOpen === 'tax' && (
            <div className="px-3 pb-3 space-y-1.5 text-xs text-slate-600 bg-white border-t border-slate-100 pt-2">
              <Link href="/knowledge-bank/acts/income-tax-act-2025" className="block py-1 font-medium hover:text-[#8B3FA8]">Income-tax Act, 2025</Link>
              <Link href="/knowledge-bank/acts/income-tax-act-1961" className="block py-1 font-medium hover:text-[#8B3FA8]">Income-tax Act, 1961 (Historical)</Link>
              <Link href="/knowledge-bank/acts/cgst-act-2017" className="block py-1 font-medium hover:text-[#8B3FA8]">CGST Act &amp; Rules</Link>
              <Link href="/knowledge-bank/acts" className="block py-1 font-medium hover:text-[#8B3FA8]">All Direct &amp; Indirect Tax Acts</Link>
            </div>
          )}
        </div>

        {/* Section 3: Corporate & Labour */}
        <div className="rounded-xl bg-slate-50 border border-slate-100 overflow-hidden">
          <button
            type="button"
            onClick={() => toggleMobileSection('corp')}
            className="w-full flex items-center justify-between p-3 text-xs font-bold text-slate-800 hover:bg-slate-100"
          >
            <span className="flex items-center gap-2">
              <Building2 className="h-3.5 w-3.5 text-[#C43D6B]" /> Corporate &amp; Labour Laws
            </span>
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${mobileSectionOpen === 'corp' ? 'rotate-180' : ''}`} />
          </button>
          {mobileSectionOpen === 'corp' && (
            <div className="px-3 pb-3 space-y-1.5 text-xs text-slate-600 bg-white border-t border-slate-100 pt-2">
              <Link href="/knowledge-bank/acts/companies-act-2013" className="block py-1 font-medium hover:text-[#8B3FA8]">Companies Act, 2013</Link>
              <Link href="/knowledge-bank/acts/code-on-wages-2019" className="block py-1 font-medium hover:text-[#8B3FA8]">Code on Wages &amp; 4 Labour Codes</Link>
              <Link href="/knowledge-bank/acts" className="block py-1 font-medium hover:text-[#8B3FA8]">LLP, FEMA, IBC, RERA &amp; DPDP</Link>
            </div>
          )}
        </div>

        {/* Section 4: Live Updates */}
        <div className="rounded-xl bg-purple-50 border border-purple-200 p-3 flex items-center justify-between">
          <Link href="/knowledge-bank/updates" className="text-xs font-bold text-[#8B3FA8] flex items-center gap-1.5">
            <Bell className="h-3.5 w-3.5" /> Latest Verified Regulatory Updates
          </Link>
          <ArrowRight className="h-3.5 w-3.5 text-[#8B3FA8]" />
        </div>

        <Link
          href="/knowledge-bank"
          className="block w-full text-center py-2.5 rounded-xl bg-[#1B2A4A] text-white font-bold text-xs shadow"
        >
          View Master Knowledge Bank →
        </Link>
      </div>
    );
  }

  // Desktop Mega Menu View
  const isKnowledgeActive = currentPath.startsWith('/knowledge-bank');

  return (
    <div
      ref={menuRef}
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[13.5px] font-semibold transition-all ${
          isKnowledgeActive || isOpen
            ? 'text-[#1B2A4A] bg-purple-50 font-bold'
            : 'text-slate-700 hover:text-[#1B2A4A] hover:bg-slate-50'
        }`}
      >
        <BookOpen className="h-4 w-4 text-[#8B3FA8]" />
        <span>Knowledge Bank</span>
        <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#8B3FA8]' : ''}`} />
      </button>

      {/* Mega Menu Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-[920px] bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 z-50 animate-in fade-in slide-in-from-top-2 duration-200 font-sans">
          <div className="grid grid-cols-4 gap-6">
            {/* Col 1: Tools & Execution */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-xs font-extrabold uppercase tracking-wider text-[#E8823A]">
                <Calculator className="h-4 w-4" /> Tools &amp; Execution
              </div>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/knowledge-bank/tax-rates" className="group flex flex-col hover:text-[#8B3FA8]">
                    <span className="font-bold text-slate-900 group-hover:text-[#8B3FA8]">Tax Rate Center</span>
                    <span className="text-[11px] text-slate-500">FY 2026-27 Slabs, TDS, TCS, 115BAA</span>
                  </Link>
                </li>
                <li>
                  <Link href="/knowledge-bank/compliance-calendar" className="group flex flex-col hover:text-[#8B3FA8]">
                    <span className="font-bold text-slate-900 group-hover:text-[#8B3FA8]">Compliance Calendar</span>
                    <span className="text-[11px] text-slate-500">Live Statutory Due Dates &amp; Extensions</span>
                  </Link>
                </li>
                <li>
                  <Link href="/knowledge-bank/forms" className="group flex flex-col hover:text-[#8B3FA8]">
                    <span className="font-bold text-slate-900 group-hover:text-[#8B3FA8]">Statutory Forms Library</span>
                    <span className="text-[11px] text-slate-500">ITR, GST, MCA &amp; FEMA Forms</span>
                  </Link>
                </li>
                <li>
                  <Link href="/calculators" className="group flex flex-col hover:text-[#8B3FA8]">
                    <span className="font-bold text-slate-900 group-hover:text-[#8B3FA8]">Financial Calculators</span>
                    <span className="text-[11px] text-slate-500">15+ Indian Tax &amp; EMI Calculators</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 2: Direct Tax & GST */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-xs font-extrabold uppercase tracking-wider text-[#8B3FA8]">
                <Scale className="h-4 w-4" /> Direct Tax &amp; GST
              </div>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/knowledge-bank/acts/income-tax-act-2025" className="group flex flex-col hover:text-[#8B3FA8]">
                    <span className="font-bold text-slate-900 group-hover:text-[#8B3FA8]">Income-tax Act, 2025</span>
                    <span className="text-[11px] text-slate-500">Current Codified Direct Tax Law</span>
                  </Link>
                </li>
                <li>
                  <Link href="/knowledge-bank/acts/income-tax-act-1961" className="group flex flex-col hover:text-[#8B3FA8]">
                    <span className="font-bold text-slate-900 group-hover:text-[#8B3FA8]">Income-tax Act, 1961</span>
                    <span className="text-[11px] text-slate-500">Historical &amp; Appeals Reference</span>
                  </Link>
                </li>
                <li>
                  <Link href="/knowledge-bank/acts/cgst-act-2017" className="group flex flex-col hover:text-[#8B3FA8]">
                    <span className="font-bold text-slate-900 group-hover:text-[#8B3FA8]">CGST &amp; IGST Acts</span>
                    <span className="text-[11px] text-slate-500">ITC, E-Invoicing &amp; Notice Law</span>
                  </Link>
                </li>
                <li>
                  <Link href="/knowledge-bank/acts" className="group flex flex-col hover:text-[#8B3FA8]">
                    <span className="font-bold text-slate-900 group-hover:text-[#8B3FA8]">Customs &amp; State VAT</span>
                    <span className="text-[11px] text-slate-500">Customs Tariff &amp; Surviving Acts</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Corporate & Regulatory */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-xs font-extrabold uppercase tracking-wider text-[#C43D6B]">
                <Building2 className="h-4 w-4" /> Corporate &amp; Regulatory
              </div>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/knowledge-bank/acts/companies-act-2013" className="group flex flex-col hover:text-[#8B3FA8]">
                    <span className="font-bold text-slate-900 group-hover:text-[#8B3FA8]">Companies Act, 2013</span>
                    <span className="text-[11px] text-slate-500">Governance, Audit &amp; ROC Rules</span>
                  </Link>
                </li>
                <li>
                  <Link href="/knowledge-bank/acts/code-on-wages-2019" className="group flex flex-col hover:text-[#8B3FA8]">
                    <span className="font-bold text-slate-900 group-hover:text-[#8B3FA8]">4 Labour Codes</span>
                    <span className="text-[11px] text-slate-500">Wages, Social Security &amp; OSH</span>
                  </Link>
                </li>
                <li>
                  <Link href="/knowledge-bank/acts" className="group flex flex-col hover:text-[#8B3FA8]">
                    <span className="font-bold text-slate-900 group-hover:text-[#8B3FA8]">LLP &amp; Commercial Law</span>
                    <span className="text-[11px] text-slate-500">LLP Act, IBC, FEMA &amp; RERA</span>
                  </Link>
                </li>
                <li>
                  <Link href="/knowledge-bank/acts" className="group flex flex-col hover:text-[#8B3FA8]">
                    <span className="font-bold text-slate-900 group-hover:text-[#8B3FA8]">DPDP Act 2023</span>
                    <span className="text-[11px] text-slate-500">Data Protection &amp; Compliance</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Bulletins & Live Updates */}
            <div className="space-y-3 bg-slate-50/80 -m-2 p-4 rounded-2xl border border-slate-100 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#8B3FA8]">
                  <Bell className="h-3.5 w-3.5" /> Live Regulatory Updates
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Daily verified circulars, notifications, and statutory amendments from CBDT, CBIC, MCA, and RBI.
                </p>

                <div className="space-y-1.5 pt-1">
                  <Link
                    href="/knowledge-bank/updates"
                    className="block p-2 rounded-xl bg-white border border-slate-200 hover:border-purple-300 text-xs font-semibold text-slate-800 hover:text-[#8B3FA8] transition-colors shadow-sm"
                  >
                    <span className="flex items-center justify-between">
                      <span>Latest Notifications</span>
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    </span>
                  </Link>

                  <Link
                    href="/knowledge-bank/amendments"
                    className="block p-2 rounded-xl bg-white border border-slate-200 hover:border-purple-300 text-xs font-semibold text-slate-800 hover:text-[#8B3FA8] transition-colors shadow-sm"
                  >
                    <span>&quot;What Changed?&quot; Diffs</span>
                  </Link>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/60">
                <Link
                  href="/knowledge-bank"
                  className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl bg-[#1B2A4A] hover:bg-[#253966] text-white font-bold text-xs shadow-md transition-colors"
                >
                  <span>Explore Knowledge Bank</span>
                  <ArrowRight className="h-3.5 w-3.5 text-[#E8823A]" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
