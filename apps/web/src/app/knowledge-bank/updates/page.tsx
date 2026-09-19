import type { Metadata } from 'next';
import Link from 'next/link';
import { Header, Footer } from '@thabrez/ui';
import {
  Bell,
  ExternalLink,
  ChevronRight,
  FileText,
} from 'lucide-react';
import { KnowledgeBankEngine } from '../../../lib/knowledge/engine';
import { VerifiedSourceBadge } from '../../../components/knowledge/verified-source-badge';
import { LegalDisclaimerFooter } from '../../../components/knowledge/legal-disclaimer-footer';
import { KnowledgeDocType, AuthorityType } from '@thabrez/types';

export const metadata: Metadata = {
  title: 'Regulatory Updates, Notifications & Circulars 2026–2027 | Knowledge Bank',
  description:
    'Live statutory notifications, administrative circulars, press releases, and clarifications from CBDT, CBIC, MCA, RBI, and SEBI for Indian tax and corporate compliance.',
  openGraph: {
    title: 'Regulatory Updates & Circulars 2026–2027 | Thabrez Tax Consulting',
    description:
      'Continuous regulatory feed synchronized with official Government gazettes and regulatory boards.',
    type: 'website',
  },
};

interface UpdatesPageProps {
  searchParams: Promise<{
    authority?: string;
    category?: string;
    documentType?: string;
    financialYear?: string;
    q?: string;
  }>;
}

export default async function UpdatesFeedPage({ searchParams }: UpdatesPageProps): Promise<JSX.Element> {
  const resolvedParams = await searchParams;
  const activeAuthority = resolvedParams.authority || 'ALL';
  const activeCategory = resolvedParams.category || 'ALL';
  const activeDocType = resolvedParams.documentType || 'ALL';
  const query = resolvedParams.q || '';

  const { documents, total } = KnowledgeBankEngine.queryDocuments({
    authority: activeAuthority !== 'ALL' ? activeAuthority : undefined,
    category: activeCategory !== 'ALL' ? activeCategory : undefined,
    documentType: activeDocType !== 'ALL' ? activeDocType : undefined,
    q: query,
    limit: 100,
  });

  const authoritiesList = [
    { label: 'All Authorities', value: 'ALL' },
    { label: 'CBDT (Income Tax)', value: AuthorityType.CBDT },
    { label: 'CBIC (GST & Customs)', value: AuthorityType.CBIC },
    { label: 'MCA (Corporate)', value: AuthorityType.MCA },
    { label: 'RBI (Banking & FEMA)', value: AuthorityType.RBI },
    { label: 'SEBI (Securities)', value: AuthorityType.SEBI },
  ];

  const docTypesList = [
    { label: 'All Types', value: 'ALL' },
    { label: 'Notifications', value: KnowledgeDocType.NOTIFICATION },
    { label: 'Circulars', value: KnowledgeDocType.CIRCULAR },
    { label: 'Press Releases', value: KnowledgeDocType.PRESS_RELEASE },
    { label: 'Orders & Clarifications', value: KnowledgeDocType.ORDER },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 selection:bg-[#8B3FA8] selection:text-white">
      <Header currentPath="/knowledge-bank/updates" />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-slate-100 border-b border-slate-200 py-2.5 px-4 sm:px-6">
          <div className="container mx-auto max-w-7xl flex items-center gap-1.5 text-xs text-slate-500">
            <Link href="/" className="hover:text-slate-800">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/knowledge-bank" className="hover:text-slate-800">Knowledge Bank</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="font-semibold text-[#1B2A4A]">Regulatory Updates &amp; Notifications</span>
          </div>
        </div>

        {/* Hero */}
        <section className="bg-gradient-to-b from-[#1B2A4A] via-[#152238] to-[#0F172A] py-12 text-white">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1 text-xs font-semibold text-white/90">
              <Bell className="h-3.5 w-3.5 text-amber-300" />
              <span>Real-Time Statutory Sync Engine</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-display">
              Regulatory Updates, Notifications &amp; Circulars
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
              Continuously updated official gazette notifications, department circulars, and executive clarifications published by apex regulatory bodies for FY 2026–2027.
            </p>
          </div>
        </section>

        {/* Multi-facet Filter Navigation Bar */}
        <section className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 py-3.5 shadow-sm">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Authority Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-semibold">
                {authoritiesList.map((auth) => {
                  const isSelected = activeAuthority === auth.value;
                  return (
                    <Link
                      key={auth.value}
                      href={`/knowledge-bank/updates?authority=${auth.value}&category=${activeCategory}&documentType=${activeDocType}`}
                      className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                        isSelected
                          ? 'bg-[#1B2A4A] text-white shadow-sm'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {auth.label}
                    </Link>
                  );
                })}
              </div>

              {/* Doc Type Filter */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 font-medium">Type:</span>
                <div className="flex items-center gap-1 overflow-x-auto">
                  {docTypesList.map((dt) => {
                    const isSelected = activeDocType === dt.value;
                    return (
                      <Link
                        key={dt.value}
                        href={`/knowledge-bank/updates?authority=${activeAuthority}&category=${activeCategory}&documentType=${dt.value}`}
                        className={`px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap ${
                          isSelected ? 'bg-[#8B3FA8] text-white' : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {dt.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Feed List */}
        <section className="py-12 bg-slate-50">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Showing <strong>{documents.length}</strong> of <strong>{total}</strong> verified regulatory items</span>
              {(activeAuthority !== 'ALL' || activeCategory !== 'ALL' || activeDocType !== 'ALL') && (
                <Link
                  href="/knowledge-bank/updates"
                  className="font-semibold text-[#8B3FA8] hover:underline"
                >
                  Clear all filters
                </Link>
              )}
            </div>

            {documents.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
                <FileText className="h-10 w-10 text-slate-400 mx-auto" />
                <h3 className="text-lg font-bold text-[#1B2A4A]">No regulatory updates found</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Try broadening your search criteria or selecting &apos;All Authorities&apos; to view all gazette publications.
                </p>
                <Link
                  href="/knowledge-bank/updates"
                  className="inline-block text-xs font-semibold text-[#8B3FA8] hover:underline mt-2"
                >
                  Reset all filters &rarr;
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-[#8B3FA8]/40 hover:shadow-md transition-all space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <VerifiedSourceBadge
                          authority={doc.authority}
                          sourceUrl={doc.officialSourceUrl}
                          isOfficial={doc.isOfficial}
                          compact
                        />
                        <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded">
                          {doc.documentNumber || 'Official Circular'}
                        </span>
                        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-medium">
                          {doc.documentType}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        {doc.publishedDate && (
                          <span>Date: <strong className="text-slate-700">{new Date(doc.publishedDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</strong></span>
                        )}
                        <span>•</span>
                        <span>FY: <strong className="text-slate-700">{doc.financialYear || '2026-27'}</strong></span>
                      </div>
                    </div>

                    <h2 className="text-lg font-bold text-[#1B2A4A] leading-snug">
                      <Link
                        href={doc.documentType === 'ACT' ? `/knowledge-bank/acts/${doc.slug}` : (doc.officialSourceUrl || '#')}
                        target={doc.documentType === 'ACT' ? '_self' : '_blank'}
                        className="hover:text-[#8B3FA8] transition-colors"
                      >
                        {doc.title}
                      </Link>
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {doc.summary}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
                      <div className="flex items-center gap-3 text-slate-500">
                        <span>Category: <strong className="text-slate-700">{doc.categoryName}</strong></span>
                        {doc.lastVerifiedAt && (
                          <span>Verified: <strong className="text-emerald-700 font-mono">{new Date(doc.lastVerifiedAt).toLocaleDateString('en-IN')}</strong></span>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <a
                          href={doc.officialSourceUrl || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 font-bold text-[#8B3FA8] hover:text-[#7A2E97]"
                        >
                          Official Portal Link <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
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
