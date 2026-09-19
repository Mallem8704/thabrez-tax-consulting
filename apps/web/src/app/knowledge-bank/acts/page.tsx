import type { Metadata } from 'next';
import Link from 'next/link';
import { Header, Footer } from '@thabrez/ui';
import {
  Scale,
  ArrowRight,
  ExternalLink,
  Info,
  ChevronRight,
} from 'lucide-react';
import { KnowledgeBankEngine } from '../../../lib/knowledge/engine';
import { ALL_ACT_SUBSECTORS } from '../../../lib/knowledge/data/seed-knowledge';
import { VerifiedSourceBadge } from '../../../components/knowledge/verified-source-badge';
import { LegalDisclaimerFooter } from '../../../components/knowledge/legal-disclaimer-footer';
import { KnowledgeDocType, DocLegislationStatus } from '@thabrez/types';

export const metadata: Metadata = {
  title: 'Statutory Acts & Principal Codes 2026–2027 | Knowledge Bank',
  description:
    'Complete catalog of Indian central and state statutes across 6 sectors: Direct Tax Acts, Indirect Tax Acts, Corporate Laws, Labour Codes, VAT & State Laws, and Commercial Statutes.',
};

interface ActsPageProps {
  searchParams: Promise<{
    subsector?: string | undefined;
    status?: string | undefined;
    q?: string | undefined;
  }>;
}

export default async function ActsHubPage({ searchParams }: ActsPageProps): Promise<JSX.Element> {
  const resolvedParams = await searchParams;
  const activeSubsector = resolvedParams.subsector || 'ALL';
  const activeStatus = resolvedParams.status || 'ALL';
  const query = resolvedParams.q || '';

  const allActsResult = KnowledgeBankEngine.queryDocuments({
    documentType: KnowledgeDocType.ACT,
    subSector: activeSubsector !== 'ALL' ? activeSubsector : undefined,
    status: activeStatus !== 'ALL' ? activeStatus : undefined,
    q: query || undefined,
    limit: 100,
  });

  const acts = allActsResult.documents;
  const currentSubsectorMeta = ALL_ACT_SUBSECTORS.find(
    (s) => s.slug.toLowerCase() === activeSubsector.toLowerCase(),
  );

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 selection:bg-[#8B3FA8] selection:text-white">
      <Header currentPath="/knowledge-bank/acts" />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-slate-100 border-b border-slate-200 py-2.5 px-4 sm:px-6">
          <div className="container mx-auto max-w-7xl flex items-center gap-1.5 text-xs text-slate-500">
            <Link href="/" className="hover:text-slate-800">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/knowledge-bank" className="hover:text-slate-800">Knowledge Bank</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="font-semibold text-[#1B2A4A]">Central &amp; State Acts</span>
          </div>
        </div>

        {/* Hero Header */}
        <section className="bg-gradient-to-b from-[#1B2A4A] to-[#152238] py-14 text-white">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1 text-xs font-semibold text-white/90">
                <Scale className="h-3.5 w-3.5 text-indigo-300" />
                <span>Statutory Enactments &amp; Principal Codes (6 Sectors)</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl font-display">
                Central &amp; State Acts Catalog
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Explore codified tax, indirect tax, corporate, insolvency, labour, and commercial legislation governing FY 2026–2027 operations, alongside transitional historical codes.
              </p>
            </div>
          </div>
        </section>

        {/* Coexistence Architecture Clarification */}
        <section className="bg-blue-50/80 border-b border-blue-200/80 py-4 px-4 sm:px-6">
          <div className="container mx-auto max-w-7xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-blue-950 text-xs sm:text-sm">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold text-blue-900">Legislative Status Protocol:</strong>{' '}
                Acts tagged as <span className="inline-block bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded text-[11px]">CURRENT</span> represent the operative law for assessment and compliance. Acts tagged as <span className="inline-block bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded text-[11px]">HISTORICAL</span> (e.g. <em>Income-tax Act, 1961</em>) are preserved verbatim for ongoing appellate litigation, Section 148 notices, and pre-2026 scrutiny assessments.
              </div>
            </div>
          </div>
        </section>

        {/* Sub-sector Navigation Bar */}
        <section className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 py-3 shadow-sm">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold scrollbar-thin">
              <Link
                href="/knowledge-bank/acts"
                className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                  activeSubsector === 'ALL'
                    ? 'bg-[#1B2A4A] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All Acts ({KnowledgeBankEngine.queryDocuments({ documentType: KnowledgeDocType.ACT }).total})
              </Link>
              {ALL_ACT_SUBSECTORS.map((sub) => {
                const isSelected = activeSubsector.toLowerCase() === sub.slug.toLowerCase();
                return (
                  <Link
                    key={sub.id}
                    href={`/knowledge-bank/acts?subsector=${sub.slug}`}
                    className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-indigo-700 text-white shadow-sm'
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

        {/* Acts Grid Section */}
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          {/* Active Sub-sector Banner */}
          {currentSubsectorMeta && (
            <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-indigo-50 to-slate-50 border border-indigo-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-800">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {acts.map((act) => {
              const isHistorical = act.status === DocLegislationStatus.HISTORICAL;
              return (
                <div
                  key={act.id}
                  className={`group rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${
                    isHistorical
                      ? 'border-amber-200 bg-amber-50/10 hover:border-amber-300'
                      : 'border-slate-200 hover:border-indigo-200'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold ${
                          isHistorical
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-emerald-50 text-emerald-800'
                        }`}
                      >
                        {act.status}
                      </span>
                      <VerifiedSourceBadge authority={act.authority} />
                    </div>

                    <h3 className="font-bold text-slate-900 text-base group-hover:text-[#8B3FA8] transition-colors line-clamp-2">
                      {act.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {act.summary}
                    </p>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span>{act.documentNumber || 'Act of Parliament'}</span>
                      <span>Enacted {act.effectiveDate ? new Date(act.effectiveDate).getFullYear() : 'Statute'}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                    {act.officialSourceUrl && (
                      <a
                        href={act.officialSourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#8B3FA8] transition-colors"
                      >
                        <span>Official Portal</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}

                    <Link
                      href={`/knowledge-bank/acts/${act.slug}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1B2A4A] hover:bg-[#8B3FA8] text-white text-xs font-bold shadow-sm transition-colors"
                    >
                      <span>Explore Act</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Contact Support Tile */}
          <div className="mt-14 rounded-3xl bg-[#1B2A4A] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 max-w-xl">
              <h3 className="text-xl font-bold font-display">Facing scrutiny or complex statutory interpretation?</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Our Senior Chartered Accountants represent clients before CIT(A), Dispute Resolution Panels (DRP), and ITAT tribunals across India.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href="/contact"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8B3FA8] to-[#C43D6B] hover:opacity-90 text-white font-bold text-xs shadow-md transition-opacity"
              >
                Schedule Litigation Review
              </Link>
              <Link
                href="/knowledge-bank/forms"
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors"
              >
                Statutory Forms Library
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
