import type { Metadata } from 'next';
import Link from 'next/link';
import { Header, Footer } from '@thabrez/ui';
import {
  Bell,
  ExternalLink,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { KnowledgeBankEngine } from '../../../lib/knowledge/engine';
import { VerifiedSourceBadge } from '../../../components/knowledge/verified-source-badge';
import { LegalDisclaimerFooter } from '../../../components/knowledge/legal-disclaimer-footer';
import { KnowledgeDocType, AuthorityType } from '@thabrez/types';

export const metadata: Metadata = {
  title: 'Live Regulatory Bulletins & Gazette Notifications 2026–2027 | Knowledge Bank',
  description:
    'Daily verified circulars, notifications, orders, and statutory bulletins issued by CBDT, CBIC, MCA, RBI, and SEBI.',
  openGraph: {
    title: 'Live Regulatory Bulletins 2026–2027 | Thabrez Tax Consulting',
    description:
      'Official daily regulatory intelligence stream with direct Gazette of India and Ministry sources.',
    type: 'website',
  },
};

interface BulletinsPageProps {
  searchParams: Promise<{
    authority?: string | undefined;
    q?: string | undefined;
  }>;
}

export default async function BulletinsPage({ searchParams }: BulletinsPageProps): Promise<JSX.Element> {
  const resolvedParams = await searchParams;
  const activeAuthority = resolvedParams.authority || 'ALL';
  const query = resolvedParams.q || '';

  const bulletinsResult = KnowledgeBankEngine.queryDocuments({
    authority: activeAuthority !== 'ALL' ? activeAuthority : undefined,
    q: query || undefined,
    limit: 100,
  });

  const bulletins = bulletinsResult.documents.filter(
    (d) =>
      d.documentType === KnowledgeDocType.CIRCULAR ||
      d.documentType === KnowledgeDocType.NOTIFICATION ||
      d.documentType === KnowledgeDocType.ORDER ||
      d.documentType === KnowledgeDocType.BULLETIN,
  );

  const authorities = [
    { id: 'ALL', name: 'All Authorities' },
    { id: AuthorityType.CBDT, name: 'CBDT (Income Tax)' },
    { id: AuthorityType.CBIC, name: 'CBIC (GST & Customs)' },
    { id: AuthorityType.MCA, name: 'MCA (Corporate)' },
    { id: AuthorityType.RBI, name: 'RBI (Forex & Banking)' },
    { id: AuthorityType.SEBI, name: 'SEBI (Securities)' },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 selection:bg-[#8B3FA8] selection:text-white">
      <Header currentPath="/knowledge-bank/bulletins" />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-slate-100 border-b border-slate-200 py-2.5 px-4 sm:px-6">
          <div className="container mx-auto max-w-7xl flex items-center gap-1.5 text-xs text-slate-500">
            <Link href="/" className="hover:text-slate-800">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/knowledge-bank" className="hover:text-slate-800">Knowledge Bank</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="font-semibold text-[#1B2A4A]">Regulatory Bulletins</span>
          </div>
        </div>

        {/* Hero Section */}
        <section className="bg-gradient-to-b from-[#1B2A4A] via-[#152238] to-[#0F172A] py-14 text-white">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1 text-xs font-semibold text-white/90">
              <Bell className="h-3.5 w-3.5 text-purple-300" />
              <span>Official Gazette Bulletins &amp; Circular Stream</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl font-display">
              Live Regulatory Bulletins 2026–2027
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
              Stay ahead of compliance changes with daily verified circulars, notifications, and clarificatory guidelines issued across Indian regulatory authorities.
            </p>
          </div>
        </section>

        {/* Authority Filter Bar */}
        <section className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 py-3 shadow-sm">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold scrollbar-thin">
              {authorities.map((auth) => {
                const isSelected = activeAuthority.toUpperCase() === auth.id.toUpperCase();
                return (
                  <Link
                    key={auth.id}
                    href={auth.id === 'ALL' ? '/knowledge-bank/bulletins' : `/knowledge-bank/bulletins?authority=${auth.id}`}
                    className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                      isSelected
                        ? 'bg-[#8B3FA8] text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>{auth.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Bulletins Stream */}
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bulletins.map((b) => (
              <div
                key={b.id}
                className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-md hover:border-purple-200 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-block px-2.5 py-1 rounded-lg bg-purple-50 text-[#8B3FA8] font-bold text-xs">
                      {b.documentNumber || b.documentType}
                    </span>
                    <VerifiedSourceBadge authority={b.authority} />
                  </div>

                  <h3 className="font-bold text-slate-900 text-base group-hover:text-[#8B3FA8] transition-colors leading-snug">
                    {b.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {b.summary}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>Published: {b.publishedDate ? new Date(b.publishedDate).toLocaleDateString('en-IN') : '2026'}</span>
                    <span className="text-emerald-700 font-semibold">Verified Gazette</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  {b.officialSourceUrl && (
                    <a
                      href={b.officialSourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#8B3FA8] transition-colors"
                    >
                      <span>Official Source</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}

                  <Link
                    href={`/knowledge-bank/updates`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1B2A4A] hover:bg-[#8B3FA8] text-white text-xs font-bold shadow-sm transition-colors"
                  >
                    <span>Full Text &amp; Analysis</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <LegalDisclaimerFooter />
      </main>

      <Footer />
    </div>
  );
}
