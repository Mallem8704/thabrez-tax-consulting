import type { Metadata } from 'next';
import Link from 'next/link';
import { Header, Footer } from '@thabrez/ui';
import {
  FileCode2,
  ExternalLink,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { KnowledgeBankEngine } from '../../../lib/knowledge/engine';
import { ALL_RULE_SUBSECTORS } from '../../../lib/knowledge/data/seed-knowledge';
import { VerifiedSourceBadge } from '../../../components/knowledge/verified-source-badge';
import { LegalDisclaimerFooter } from '../../../components/knowledge/legal-disclaimer-footer';
import { KnowledgeDocType } from '@thabrez/types';

export const metadata: Metadata = {
  title: 'Statutory Rules & Delegated Legislation 2026–2027 | Knowledge Bank',
  description:
    'Comprehensive directory of statutory rules across 7 sectors: Direct Tax Rules, Indirect Tax Rules, Corporate Laws Rules, VAT Laws Rules, Other Statutes, GST Rules, and Labour Rules.',
  openGraph: {
    title: 'Statutory Rules & Delegated Legislation | Thabrez Tax Consulting',
    description:
      'Verified statutory rules, prescribed procedural forms, sub-rules, and compliance schedules under Indian central statutes.',
    type: 'website',
  },
};

interface RulesPageProps {
  searchParams: Promise<{
    subsector?: string | undefined;
    category?: string | undefined;
    q?: string | undefined;
  }>;
}

export default async function RulesHubPage({ searchParams }: RulesPageProps): Promise<JSX.Element> {
  const resolvedParams = await searchParams;
  const activeSubsector = resolvedParams.subsector || 'ALL';
  const query = resolvedParams.q || '';

  const rulesResult = KnowledgeBankEngine.queryDocuments({
    documentType: KnowledgeDocType.RULE,
    subSector: activeSubsector !== 'ALL' ? activeSubsector : undefined,
    q: query || undefined,
    limit: 100,
  });

  const rules = rulesResult.documents;
  const currentSubsectorMeta = ALL_RULE_SUBSECTORS.find(
    (s) => s.slug.toLowerCase() === activeSubsector.toLowerCase(),
  );

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 selection:bg-[#8B3FA8] selection:text-white">
      <Header currentPath="/knowledge-bank/rules" />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-slate-100 border-b border-slate-200 py-2.5 px-4 sm:px-6">
          <div className="container mx-auto max-w-7xl flex items-center gap-1.5 text-xs text-slate-500">
            <Link href="/" className="hover:text-slate-800">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/knowledge-bank" className="hover:text-slate-800">Knowledge Bank</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="font-semibold text-[#1B2A4A]">Statutory Rules Directory</span>
          </div>
        </div>

        {/* Hero Section */}
        <section className="bg-gradient-to-b from-[#1B2A4A] via-[#152238] to-[#0F172A] py-14 text-white">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1 text-xs font-semibold text-white/90">
              <FileCode2 className="h-3.5 w-3.5 text-cyan-300" />
              <span>Delegated Legislation &amp; Subordinate Rules (7 Sectors)</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl font-display">
              Statutory Rules Directory 2026–2027
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
              Explore operative procedural rules, prescribed compliance forms, schedules, and calculation methodologies framed under principal Parliamentary Acts.
            </p>
          </div>
        </section>

        {/* Sub-sector Navigation Bar */}
        <section className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 py-3 shadow-sm">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold scrollbar-thin">
              <Link
                href="/knowledge-bank/rules"
                className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                  activeSubsector === 'ALL'
                    ? 'bg-[#1B2A4A] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All Rules ({KnowledgeBankEngine.queryDocuments({ documentType: KnowledgeDocType.RULE }).total})
              </Link>
              {ALL_RULE_SUBSECTORS.map((sub) => {
                const isSelected = activeSubsector.toLowerCase() === sub.slug.toLowerCase();
                return (
                  <Link
                    key={sub.id}
                    href={`/knowledge-bank/rules?subsector=${sub.slug}`}
                    className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-cyan-700 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>{sub.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Main Content Area */}
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          {/* Active Sub-sector Banner */}
          {currentSubsectorMeta && (
            <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-cyan-50 to-slate-50 border border-cyan-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-800">
                  Sub-Sector Overview
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                  {currentSubsectorMeta.name}
                </h2>
                <p className="text-xs text-slate-600 mt-1 max-w-2xl">
                  {currentSubsectorMeta.description}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <VerifiedSourceBadge authority={currentSubsectorMeta.authority} />
              </div>
            </div>
          )}

          {/* Rules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-md hover:border-cyan-200 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-block px-2.5 py-1 rounded-lg bg-cyan-50 text-cyan-800 font-bold text-xs">
                      {rule.documentNumber || 'STATUTORY RULE'}
                    </span>
                    <VerifiedSourceBadge authority={rule.authority} />
                  </div>

                  <h3 className="font-bold text-slate-900 text-base group-hover:text-[#8B3FA8] transition-colors line-clamp-2">
                    {rule.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {rule.summary}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>Effective: {rule.effectiveDate ? new Date(rule.effectiveDate).toLocaleDateString('en-IN') : 'Operative'}</span>
                    <span className="font-semibold text-emerald-700">v{rule.version}.0 Verified</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  {rule.officialSourceUrl && (
                    <a
                      href={rule.officialSourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#8B3FA8] transition-colors"
                    >
                      <span>Gazette Source</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}

                  <Link
                    href={`/knowledge-bank/rules/${rule.slug}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1B2A4A] hover:bg-[#8B3FA8] text-white text-xs font-bold shadow-sm transition-colors"
                  >
                    <span>Read Rule Text</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Assistance CTA */}
          <div className="mt-14 rounded-3xl bg-[#1B2A4A] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 max-w-xl">
              <h3 className="text-xl font-bold font-display">Unsure about rule applicability or procedural clauses?</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Consult our senior tax practitioners to interpret subtle sub-rules, safe harbour parameters, and faceless dispute resolution mechanisms.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href="/contact"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8B3FA8] to-[#C43D6B] hover:opacity-90 text-white font-bold text-xs shadow-md transition-opacity"
              >
                Get Expert Advice
              </Link>
              <Link
                href="/knowledge-bank/acts"
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors"
              >
                Browse Principal Acts
              </Link>
            </div>
          </div>
        </div>

        <LegalDisclaimerFooter />
      </main>

      <Footer />
    </div>
  );
}
