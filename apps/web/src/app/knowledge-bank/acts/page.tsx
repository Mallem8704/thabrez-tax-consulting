import type { Metadata } from 'next';
import Link from 'next/link';
import { Header, Footer } from '@thabrez/ui';
import {
  Scale,
  BookOpen,
  ArrowRight,
  ExternalLink,
  Info,
  Sparkles,
  FileCheck2,
  AlertTriangle,
} from 'lucide-react';
import { KnowledgeBankEngine } from '../../../lib/knowledge/engine';
import { VerifiedSourceBadge } from '../../../components/knowledge/verified-source-badge';
import { LegalDisclaimerFooter } from '../../../components/knowledge/legal-disclaimer-footer';
import { KnowledgeDocType, DocLegislationStatus } from '@thabrez/types';

export const metadata: Metadata = {
  title: 'Statutory Acts & Codes Repository | Knowledge Bank',
  description:
    'Complete catalog of Indian central statutes, Income-tax Act 2025, CGST Act 2017, Companies Act 2013, Labour Codes, and historical 1961 provisions with cross-references.',
};

interface ActsPageProps {
  searchParams: Promise<{
    category?: string;
    status?: string;
    q?: string;
  }>;
}

export default async function ActsHubPage({ searchParams }: ActsPageProps): Promise<JSX.Element> {
  const resolvedParams = await searchParams;
  const activeCategory = resolvedParams.category || 'ALL';
  const activeStatus = resolvedParams.status || 'ALL';

  const categories = KnowledgeBankEngine.getCategories();
  const allActsResult = KnowledgeBankEngine.queryDocuments({
    documentType: KnowledgeDocType.ACT,
    category: activeCategory,
    status: activeStatus !== 'ALL' ? activeStatus : undefined,
    limit: 100,
  });

  const acts = allActsResult.documents;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 selection:bg-[#8B3FA8] selection:text-white">
      <Header currentPath="/knowledge-bank/acts" />

      <main className="flex-1">
        {/* Hero Header */}
        <section className="bg-gradient-to-b from-[#1B2A4A] to-[#152238] py-14 text-white">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1 text-xs font-semibold text-white/90">
                <Scale className="h-3.5 w-3.5 text-amber-300" />
                <span>Statutory Enactments &amp; Principal Codes</span>
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

        {/* Filter Navigation Bar */}
        <section className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 py-3 shadow-sm">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Category Pills */}
              <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
                <Link
                  href="/knowledge-bank/acts"
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                    activeCategory === 'ALL'
                      ? 'bg-[#1B2A4A] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  All Categories ({KnowledgeBankEngine.queryDocuments({ documentType: KnowledgeDocType.ACT }).total})
                </Link>
                {categories.map((cat) => {
                  const isSelected = activeCategory.toLowerCase() === cat.slug.toLowerCase() || activeCategory === cat.id;
                  return (
                    <Link
                      key={cat.id}
                      href={`/knowledge-bank/acts?category=${cat.slug}`}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                        isSelected
                          ? 'bg-[#1B2A4A] text-white shadow-sm'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {cat.name}
                    </Link>
                  );
                })}
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 font-medium">Status:</span>
                <Link
                  href={`/knowledge-bank/acts?category=${activeCategory}`}
                  className={`px-2.5 py-1 rounded text-xs font-semibold ${
                    activeStatus === 'ALL' ? 'bg-[#8B3FA8] text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  All
                </Link>
                <Link
                  href={`/knowledge-bank/acts?category=${activeCategory}&status=CURRENT`}
                  className={`px-2.5 py-1 rounded text-xs font-semibold ${
                    activeStatus === 'CURRENT' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Current Acts
                </Link>
                <Link
                  href={`/knowledge-bank/acts?category=${activeCategory}&status=HISTORICAL`}
                  className={`px-2.5 py-1 rounded text-xs font-semibold ${
                    activeStatus === 'HISTORICAL' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Historical / Transitional
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Acts Grid */}
        <section className="py-12 bg-slate-50">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {acts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
                <BookOpen className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-[#1B2A4A]">No statutes found matching criteria</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Try clearing your filters to see all codified acts.
                </p>
                <Link
                  href="/knowledge-bank/acts"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#8B3FA8] hover:underline"
                >
                  Reset Filters &rarr;
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {acts.map((act) => {
                  const isCurrent = act.status === DocLegislationStatus.CURRENT;
                  const isHistorical = act.status === DocLegislationStatus.HISTORICAL;

                  return (
                    <div
                      key={act.id}
                      className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-[#8B3FA8]/40 hover:shadow-md transition-all space-y-5"
                    >
                      <div className="space-y-4">
                        {/* Top Meta Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                                isCurrent
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : isHistorical
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-slate-100 text-slate-800'
                              }`}
                            >
                              {isCurrent ? <FileCheck2 className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                              {act.status}
                            </span>
                            <span className="text-xs text-slate-500 font-mono">
                              {act.documentNumber || 'Act of Parliament'}
                            </span>
                          </div>

                          <VerifiedSourceBadge
                            authority={act.authority}
                            sourceUrl={act.officialSourceUrl}
                            isOfficial={act.isOfficial}
                            compact
                          />
                        </div>

                        {/* Act Title */}
                        <div>
                          <h2 className="text-xl font-bold font-display text-[#1B2A4A] group-hover:text-[#8B3FA8] transition-colors leading-snug">
                            <Link href={`/knowledge-bank/acts/${act.slug}`}>
                              {act.title}
                            </Link>
                          </h2>
                          <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
                            <span>Category: <strong className="text-slate-700">{act.categoryName}</strong></span>
                            <span>•</span>
                            <span>Effective: <strong className="text-slate-700">{act.effectiveDate ? new Date(act.effectiveDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Operative'}</strong></span>
                          </div>
                        </div>

                        {/* Act Summary */}
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                          {act.summary}
                        </p>

                        {/* Key Highlights or Amendments */}
                        {act.amendments && act.amendments.length > 0 && (
                          <div className="rounded-xl bg-purple-50/70 border border-purple-100 p-3 space-y-1 text-xs">
                            <div className="font-semibold text-[#8B3FA8] flex items-center gap-1">
                              <Sparkles className="h-3.5 w-3.5" />
                              Key Provision: {act.amendments[0]?.amendmentNumber || act.amendments[0]?.title}
                            </div>
                            <p className="text-slate-600 text-[11px] line-clamp-1">
                              {act.amendments[0]?.description}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Bottom Actions */}
                      <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <Link
                          href={`/knowledge-bank/acts/${act.slug}`}
                          className="inline-flex items-center gap-1.5 font-bold text-[#1B2A4A] hover:text-[#8B3FA8] transition-colors"
                        >
                          View Sections &amp; Chapters <ArrowRight className="h-3.5 w-3.5" />
                        </Link>

                        <div className="flex items-center gap-3">
                          {act.documentUrl && (
                            <a
                              href={act.documentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-slate-500 hover:text-slate-800 font-medium inline-flex items-center gap-1"
                            >
                              Official Gazette <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Legal Disclaimer */}
        <LegalDisclaimerFooter />
      </main>

      <Footer />
    </div>
  );
}
