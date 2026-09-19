'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Scale,
  Calculator,
  Bell,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  FileText,
  FileCode2,
  Wrench,
  Globe2,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import {
  ALL_FORM_SUBSECTORS,
  ALL_RULE_SUBSECTORS,
  ALL_ACT_SUBSECTORS,
  ALL_GOV_LINKS,
  ALL_UTILITIES,
} from '../../lib/knowledge/data/seed-knowledge';

import type { LucideIcon } from 'lucide-react';

interface KnowledgeMegaMenuProps {
  currentPath?: string | undefined;
  isMobile?: boolean | undefined;
}

type MainNavCategory = 'calculators' | 'bulletins' | 'utilities' | 'links' | 'acts' | 'rules' | 'forms';

export function KnowledgeMegaMenu({
  currentPath = '',
  isMobile = false,
}: KnowledgeMegaMenuProps): JSX.Element {
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeCategory, setActiveCategory] = React.useState<MainNavCategory>('forms');
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

  const navCategories: Array<{
    id: MainNavCategory;
    name: string;
    icon: LucideIcon;
    color: string;
    href: string;
    countBadge?: string | undefined;
  }> = [
    { id: 'calculators', name: 'Calculators', icon: Calculator, color: 'text-amber-500', href: '/calculators', countBadge: '15+' },
    { id: 'bulletins', name: 'Bulletins', icon: Bell, color: 'text-purple-500', href: '/knowledge-bank/bulletins', countBadge: 'Live' },
    { id: 'utilities', name: 'Utilities', icon: Wrench, color: 'text-blue-500', href: '/knowledge-bank/utilities', countBadge: 'Tools' },
    { id: 'links', name: 'Links', icon: Globe2, color: 'text-emerald-500', href: '/knowledge-bank/links', countBadge: '15+ Gov' },
    { id: 'acts', name: 'Acts', icon: Scale, color: 'text-indigo-500', href: '/knowledge-bank/acts', countBadge: '6 Sectors' },
    { id: 'rules', name: 'Rules', icon: FileCode2, color: 'text-cyan-500', href: '/knowledge-bank/rules', countBadge: '7 Sectors' },
    { id: 'forms', name: 'Forms', icon: FileText, color: 'text-[#E8823A]', href: '/knowledge-bank/forms', countBadge: '12 Sectors' },
  ];

  // Mobile Accordion View
  if (isMobile) {
    return (
      <div className="space-y-1.5 py-1">
        <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5 text-[#8B3FA8]" /> Knowledge Bank
          </span>
          <span className="text-[10px] bg-purple-100 text-[#8B3FA8] px-1.5 py-0.5 rounded font-bold">2026–2027</span>
        </div>

        {/* 1. Forms Accordion */}
        <div className="rounded-xl bg-slate-50 border border-slate-100 overflow-hidden">
          <button
            type="button"
            onClick={() => toggleMobileSection('forms')}
            className="w-full flex items-center justify-between p-3 text-xs font-bold text-slate-800 hover:bg-slate-100"
          >
            <span className="flex items-center gap-2">
              <FileText className="h-3.5 w-3.5 text-[#E8823A]" /> Forms (12 Sub-sectors)
            </span>
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${mobileSectionOpen === 'forms' ? 'rotate-180' : ''}`} />
          </button>
          {mobileSectionOpen === 'forms' && (
            <div className="px-3 pb-3 space-y-1 text-xs text-slate-600 bg-white border-t border-slate-100 pt-2 grid grid-cols-1 gap-1">
              {ALL_FORM_SUBSECTORS.map((fs) => (
                <Link
                  key={fs.id}
                  href={`/knowledge-bank/forms?subsector=${fs.slug}`}
                  className="block py-1 px-2 rounded font-medium hover:bg-purple-50 hover:text-[#8B3FA8]"
                >
                  {fs.name}
                </Link>
              ))}
              <Link href="/knowledge-bank/forms" className="block py-1.5 px-2 text-xs font-bold text-[#8B3FA8] hover:underline pt-2 border-t border-slate-100">
                View All Forms Directory →
              </Link>
            </div>
          )}
        </div>

        {/* 2. Rules Accordion */}
        <div className="rounded-xl bg-slate-50 border border-slate-100 overflow-hidden">
          <button
            type="button"
            onClick={() => toggleMobileSection('rules')}
            className="w-full flex items-center justify-between p-3 text-xs font-bold text-slate-800 hover:bg-slate-100"
          >
            <span className="flex items-center gap-2">
              <FileCode2 className="h-3.5 w-3.5 text-cyan-600" /> Rules (7 Sub-sectors)
            </span>
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${mobileSectionOpen === 'rules' ? 'rotate-180' : ''}`} />
          </button>
          {mobileSectionOpen === 'rules' && (
            <div className="px-3 pb-3 space-y-1 text-xs text-slate-600 bg-white border-t border-slate-100 pt-2">
              {ALL_RULE_SUBSECTORS.map((rs) => (
                <Link
                  key={rs.id}
                  href={`/knowledge-bank/rules?subsector=${rs.slug}`}
                  className="block py-1 px-2 rounded font-medium hover:bg-purple-50 hover:text-[#8B3FA8]"
                >
                  {rs.name}
                </Link>
              ))}
              <Link href="/knowledge-bank/rules" className="block py-1.5 px-2 text-xs font-bold text-[#8B3FA8] hover:underline pt-2 border-t border-slate-100">
                View All Statutory Rules Directory →
              </Link>
            </div>
          )}
        </div>

        {/* 3. Acts Accordion */}
        <div className="rounded-xl bg-slate-50 border border-slate-100 overflow-hidden">
          <button
            type="button"
            onClick={() => toggleMobileSection('acts')}
            className="w-full flex items-center justify-between p-3 text-xs font-bold text-slate-800 hover:bg-slate-100"
          >
            <span className="flex items-center gap-2">
              <Scale className="h-3.5 w-3.5 text-indigo-600" /> Acts (6 Sub-sectors)
            </span>
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${mobileSectionOpen === 'acts' ? 'rotate-180' : ''}`} />
          </button>
          {mobileSectionOpen === 'acts' && (
            <div className="px-3 pb-3 space-y-1 text-xs text-slate-600 bg-white border-t border-slate-100 pt-2">
              {ALL_ACT_SUBSECTORS.map((as) => (
                <Link
                  key={as.id}
                  href={`/knowledge-bank/acts?subsector=${as.slug}`}
                  className="block py-1 px-2 rounded font-medium hover:bg-purple-50 hover:text-[#8B3FA8]"
                >
                  {as.name}
                </Link>
              ))}
              <Link href="/knowledge-bank/acts" className="block py-1.5 px-2 text-xs font-bold text-[#8B3FA8] hover:underline pt-2 border-t border-slate-100">
                View Central &amp; State Acts Catalog →
              </Link>
            </div>
          )}
        </div>

        {/* 4. Quick Links & Tools Accordion */}
        <div className="rounded-xl bg-slate-50 border border-slate-100 overflow-hidden">
          <button
            type="button"
            onClick={() => toggleMobileSection('tools')}
            className="w-full flex items-center justify-between p-3 text-xs font-bold text-slate-800 hover:bg-slate-100"
          >
            <span className="flex items-center gap-2">
              <Wrench className="h-3.5 w-3.5 text-blue-600" /> Utilities, Links &amp; Calculators
            </span>
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${mobileSectionOpen === 'tools' ? 'rotate-180' : ''}`} />
          </button>
          {mobileSectionOpen === 'tools' && (
            <div className="px-3 pb-3 space-y-1.5 text-xs text-slate-600 bg-white border-t border-slate-100 pt-2">
              <Link href="/knowledge-bank/tax-rates" className="block py-1 font-medium hover:text-[#8B3FA8]">Tax Rate Center (FY 2026-27 Slabs)</Link>
              <Link href="/knowledge-bank/compliance-calendar" className="block py-1 font-medium hover:text-[#8B3FA8]">Statutory Compliance Calendar</Link>
              <Link href="/knowledge-bank/utilities" className="block py-1 font-medium hover:text-[#8B3FA8]">Offline E-filing Utilities &amp; Schemas</Link>
              <Link href="/knowledge-bank/links" className="block py-1 font-medium hover:text-[#8B3FA8]">Official Government Gateways (15+)</Link>
              <Link href="/knowledge-bank/bulletins" className="block py-1 font-medium hover:text-[#8B3FA8]">Live Regulatory Bulletins</Link>
              <Link href="/calculators" className="block py-1 font-medium hover:text-[#8B3FA8]">All 15+ Financial Calculators</Link>
            </div>
          )}
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

      {/* Multi-tier Cascading Flyout Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 w-[860px] bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200 font-sans">
          {/* Header Bar */}
          <div className="bg-[#1B2A4A] text-white px-6 py-3.5 flex items-center justify-between border-b border-slate-700">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-[#8B3FA8] text-white">
                <Sparkles className="h-3.5 w-3.5" />
              </span>
              <span className="font-bold text-sm tracking-wide">Knowledge Bank 2026–2027</span>
              <span className="text-[11px] bg-white/10 px-2 py-0.5 rounded-full text-slate-200">
                Official Regulatory Intelligence
              </span>
            </div>
            <Link
              href="/knowledge-bank"
              className="text-xs text-amber-300 hover:text-white flex items-center gap-1 font-semibold transition-colors"
            >
              <span>Explore Master Hub</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-12 min-h-[440px]">
            {/* Left Nav Bar (7 Core Categories matching old website reference) */}
            <div className="col-span-4 bg-slate-50/90 p-3 border-r border-slate-200 space-y-1">
              <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Statutory Sectors
              </div>
              {navCategories.map((cat) => {
                const IconComponent = cat.icon;
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onMouseEnter={() => setActiveCategory(cat.id)}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                      isActive
                        ? 'bg-white text-[#1B2A4A] shadow-sm border border-slate-200/80'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <IconComponent className={`h-4 w-4 ${cat.color}`} />
                      <span>{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {cat.countBadge && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                          isActive ? 'bg-purple-100 text-[#8B3FA8]' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {cat.countBadge}
                        </span>
                      )}
                      <ChevronRight className={`h-3.5 w-3.5 text-slate-400 ${isActive ? 'text-[#8B3FA8]' : ''}`} />
                    </div>
                  </button>
                );
              })}

              <div className="pt-3 mt-2 border-t border-slate-200/80 px-2 space-y-1">
                <Link
                  href="/knowledge-bank/tax-rates"
                  className="block px-2 py-1 text-[11.5px] font-semibold text-slate-700 hover:text-[#8B3FA8]"
                >
                  ⚡ Tax Rate Center (FY 2026-27)
                </Link>
                <Link
                  href="/knowledge-bank/compliance-calendar"
                  className="block px-2 py-1 text-[11.5px] font-semibold text-slate-700 hover:text-[#8B3FA8]"
                >
                  📅 Compliance Due Dates
                </Link>
              </div>
            </div>

            {/* Right Sub-sector / Details View */}
            <div className="col-span-8 p-6 flex flex-col justify-between bg-white">
              {/* Category: FORMS (12 Sub-sectors from reference screenshot) */}
              {activeCategory === 'forms' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                        <FileText className="h-4 w-4 text-[#E8823A]" /> Official Forms Library (12 Sectors)
                      </h4>
                      <p className="text-[11.5px] text-slate-500">
                        ITR, MCA 2013/1956, GST, FEMA, IEPF, NBFCs &amp; LLP statutory forms
                      </p>
                    </div>
                    <Link
                      href="/knowledge-bank/forms"
                      className="text-xs font-bold text-[#8B3FA8] hover:underline flex items-center gap-1"
                    >
                      <span>View All</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs max-h-[300px] overflow-y-auto pr-1">
                    {ALL_FORM_SUBSECTORS.map((fs) => (
                      <Link
                        key={fs.id}
                        href={`/knowledge-bank/forms?subsector=${fs.slug}`}
                        className="group p-2.5 rounded-xl border border-slate-100 hover:border-purple-200 hover:bg-purple-50/50 transition-all flex flex-col justify-between"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800 group-hover:text-[#8B3FA8]">{fs.name}</span>
                          <span className="text-[10px] text-slate-400 group-hover:text-[#8B3FA8] font-semibold">{fs.itemCount} items</span>
                        </div>
                        <span className="text-[10.5px] text-slate-500 line-clamp-1 mt-0.5">{fs.description}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Category: RULES (7 Sub-sectors from reference screenshot) */}
              {activeCategory === 'rules' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                        <FileCode2 className="h-4 w-4 text-cyan-600" /> Statutory Rules Directory (7 Sectors)
                      </h4>
                      <p className="text-[11.5px] text-slate-500">
                        Income-tax Rules, CGST Rules, Companies Rules, VAT, and Labour Regulations
                      </p>
                    </div>
                    <Link
                      href="/knowledge-bank/rules"
                      className="text-xs font-bold text-[#8B3FA8] hover:underline flex items-center gap-1"
                    >
                      <span>View All</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs max-h-[300px] overflow-y-auto pr-1">
                    {ALL_RULE_SUBSECTORS.map((rs) => (
                      <Link
                        key={rs.id}
                        href={`/knowledge-bank/rules?subsector=${rs.slug}`}
                        className="group p-2.5 rounded-xl border border-slate-100 hover:border-purple-200 hover:bg-purple-50/50 transition-all flex flex-col justify-between"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800 group-hover:text-[#8B3FA8]">{rs.name}</span>
                          <span className="text-[10px] text-slate-400 group-hover:text-[#8B3FA8] font-semibold">{rs.itemCount} rules</span>
                        </div>
                        <span className="text-[10.5px] text-slate-500 line-clamp-1 mt-0.5">{rs.description}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Category: ACTS (6 Sub-sectors) */}
              {activeCategory === 'acts' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                        <Scale className="h-4 w-4 text-indigo-600" /> Central &amp; State Acts Catalog (6 Sectors)
                      </h4>
                      <p className="text-[11.5px] text-slate-500">
                        Income-tax Act 2025/1961, CGST Act, Companies Act 2013, Labour Codes &amp; MSMED
                      </p>
                    </div>
                    <Link
                      href="/knowledge-bank/acts"
                      className="text-xs font-bold text-[#8B3FA8] hover:underline flex items-center gap-1"
                    >
                      <span>View All</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs max-h-[300px] overflow-y-auto pr-1">
                    {ALL_ACT_SUBSECTORS.map((as) => (
                      <Link
                        key={as.id}
                        href={`/knowledge-bank/acts?subsector=${as.slug}`}
                        className="group p-2.5 rounded-xl border border-slate-100 hover:border-purple-200 hover:bg-purple-50/50 transition-all flex flex-col justify-between"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800 group-hover:text-[#8B3FA8]">{as.name}</span>
                          <span className="text-[10px] text-slate-400 group-hover:text-[#8B3FA8] font-semibold">{as.itemCount} acts</span>
                        </div>
                        <span className="text-[10.5px] text-slate-500 line-clamp-1 mt-0.5">{as.description}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Category: CALCULATORS */}
              {activeCategory === 'calculators' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                        <Calculator className="h-4 w-4 text-amber-500" /> Interactive Tax &amp; Financial Calculators
                      </h4>
                      <p className="text-[11.5px] text-slate-500">
                        Updated for FY 2026-27 (AY 2027-28) Section 115BAC slabs
                      </p>
                    </div>
                    <Link
                      href="/calculators"
                      className="text-xs font-bold text-[#8B3FA8] hover:underline flex items-center gap-1"
                    >
                      <span>All 15+ Tools</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs max-h-[300px] overflow-y-auto pr-1">
                    <Link href="/calculators/income-tax-calculator" className="p-2.5 rounded-xl border border-slate-100 hover:border-purple-200 hover:bg-purple-50/50 transition-all">
                      <div className="font-bold text-slate-800">Income Tax Calculator</div>
                      <div className="text-[10.5px] text-slate-500">Compare New vs Old Tax Regimes</div>
                    </Link>
                    <Link href="/calculators/gst-calculator" className="p-2.5 rounded-xl border border-slate-100 hover:border-purple-200 hover:bg-purple-50/50 transition-all">
                      <div className="font-bold text-slate-800">GST Calculator</div>
                      <div className="text-[10.5px] text-slate-500">Compute CGST, SGST &amp; IGST values</div>
                    </Link>
                    <Link href="/calculators/tds-calculator" className="p-2.5 rounded-xl border border-slate-100 hover:border-purple-200 hover:bg-purple-50/50 transition-all">
                      <div className="font-bold text-slate-800">TDS / TCS Calculator</div>
                      <div className="text-[10.5px] text-slate-500">194C, 194J, 194Q &amp; 206C Rates</div>
                    </Link>
                    <Link href="/calculators/hra-calculator" className="p-2.5 rounded-xl border border-slate-100 hover:border-purple-200 hover:bg-purple-50/50 transition-all">
                      <div className="font-bold text-slate-800">HRA Exemption Calculator</div>
                      <div className="text-[10.5px] text-slate-500">Section 10(13A) metro/non-metro</div>
                    </Link>
                    <Link href="/calculators/sip-calculator" className="p-2.5 rounded-xl border border-slate-100 hover:border-purple-200 hover:bg-purple-50/50 transition-all">
                      <div className="font-bold text-slate-800">SIP Calculator</div>
                      <div className="text-[10.5px] text-slate-500">Mutual Fund compounding projections</div>
                    </Link>
                    <Link href="/calculators/emi-calculator" className="p-2.5 rounded-xl border border-slate-100 hover:border-purple-200 hover:bg-purple-50/50 transition-all">
                      <div className="font-bold text-slate-800">EMI Calculator</div>
                      <div className="text-[10.5px] text-slate-500">Home loan &amp; commercial borrowing</div>
                    </Link>
                  </div>
                </div>
              )}

              {/* Category: BULLETINS */}
              {activeCategory === 'bulletins' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                        <Bell className="h-4 w-4 text-purple-600" /> Live Regulatory Bulletins &amp; Gazette
                      </h4>
                      <p className="text-[11.5px] text-slate-500">
                        Official notifications, circulars, and orders from CBDT, CBIC, MCA, RBI &amp; SEBI
                      </p>
                    </div>
                    <Link
                      href="/knowledge-bank/bulletins"
                      className="text-xs font-bold text-[#8B3FA8] hover:underline flex items-center gap-1"
                    >
                      <span>All Updates</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs max-h-[300px] overflow-y-auto pr-1">
                    <Link href="/knowledge-bank/bulletins?authority=CBDT" className="p-2.5 rounded-xl border border-slate-100 hover:border-purple-200 hover:bg-purple-50/50 transition-all">
                      <div className="font-bold text-slate-800">CBDT Direct Tax Bulletins</div>
                      <div className="text-[10.5px] text-slate-500">Section 115BAC FAQs &amp; Circulars</div>
                    </Link>
                    <Link href="/knowledge-bank/bulletins?authority=CBIC" className="p-2.5 rounded-xl border border-slate-100 hover:border-purple-200 hover:bg-purple-50/50 transition-all">
                      <div className="font-bold text-slate-800">CBIC GST &amp; Customs Circulars</div>
                      <div className="text-[10.5px] text-slate-500">GSTR-1A amnesty &amp; Rule 88C intimations</div>
                    </Link>
                    <Link href="/knowledge-bank/bulletins?authority=MCA" className="p-2.5 rounded-xl border border-slate-100 hover:border-purple-200 hover:bg-purple-50/50 transition-all">
                      <div className="font-bold text-slate-800">MCA Corporate Bulletins</div>
                      <div className="text-[10.5px] text-slate-500">Demat shares mandate &amp; V3 notifications</div>
                    </Link>
                    <Link href="/knowledge-bank/bulletins?authority=RBI" className="p-2.5 rounded-xl border border-slate-100 hover:border-purple-200 hover:bg-purple-50/50 transition-all">
                      <div className="font-bold text-slate-800">RBI Master Directions</div>
                      <div className="text-[10.5px] text-slate-500">FIRMS FDI reporting &amp; NBFC guidelines</div>
                    </Link>
                  </div>
                </div>
              )}

              {/* Category: UTILITIES */}
              {activeCategory === 'utilities' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                        <Wrench className="h-4 w-4 text-blue-600" /> Offline E-filing Utilities &amp; Schemas
                      </h4>
                      <p className="text-[11.5px] text-slate-500">
                        Official desktop tools, DSC signers, JSON validators &amp; RPU/FVU
                      </p>
                    </div>
                    <Link
                      href="/knowledge-bank/utilities"
                      className="text-xs font-bold text-[#8B3FA8] hover:underline flex items-center gap-1"
                    >
                      <span>Explore Utilities</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 gap-2 text-xs max-h-[300px] overflow-y-auto pr-1">
                    {ALL_UTILITIES.slice(0, 4).map((u) => (
                      <div key={u.id} className="p-2.5 rounded-xl border border-slate-100 hover:border-purple-200 hover:bg-purple-50/50 transition-all flex items-center justify-between">
                        <div>
                          <div className="font-bold text-slate-800">{u.title}</div>
                          <div className="text-[10.5px] text-slate-500">{u.version} • {u.platform}</div>
                        </div>
                        <a
                          href={u.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-[#8B3FA8] hover:text-white text-[11px] font-bold text-slate-700 transition-colors flex items-center gap-1"
                        >
                          <span>Get</span>
                          <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Category: LINKS */}
              {activeCategory === 'links' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                        <Globe2 className="h-4 w-4 text-emerald-600" /> Verified Government Gateways (15+)
                      </h4>
                      <p className="text-[11.5px] text-slate-500">
                        Direct authenticated access to central tax, company, and judicial portals
                      </p>
                    </div>
                    <Link
                      href="/knowledge-bank/links"
                      className="text-xs font-bold text-[#8B3FA8] hover:underline flex items-center gap-1"
                    >
                      <span>All Links</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs max-h-[300px] overflow-y-auto pr-1">
                    {ALL_GOV_LINKS.slice(0, 8).map((lnk) => (
                      <a
                        key={lnk.id}
                        href={lnk.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group p-2 rounded-xl border border-slate-100 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-slate-800 group-hover:text-emerald-700">{lnk.name}</div>
                          <div className="text-[10px] text-slate-500">{lnk.authority}</div>
                        </div>
                        <ExternalLink className="h-3 w-3 text-slate-400 group-hover:text-emerald-600 shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom Quick Call to Action Bar */}
              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                  <span>💡 Need expert filing assistance?</span>
                  <Link href="/contact" className="font-bold text-[#8B3FA8] hover:underline">
                    Schedule CA Consultation
                  </Link>
                </div>
                <Link
                  href="/knowledge-bank"
                  className="px-3 py-1.5 rounded-lg bg-[#1B2A4A] hover:bg-[#283d66] text-white font-bold text-[11px] shadow-sm transition-colors flex items-center gap-1"
                >
                  <span>Search Knowledge Base</span>
                  <ArrowRight className="h-3 w-3 text-amber-300" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
