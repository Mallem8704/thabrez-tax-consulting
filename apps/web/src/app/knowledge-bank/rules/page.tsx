import type { Metadata } from 'next';
import Link from 'next/link';
import { Header, Footer } from '@thabrez/ui';
import {
  FileCode2,
  BookOpen,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { KnowledgeBankEngine } from '../../../lib/knowledge/engine';
import { VerifiedSourceBadge } from '../../../components/knowledge/verified-source-badge';
import { LegalDisclaimerFooter } from '../../../components/knowledge/legal-disclaimer-footer';
import { KnowledgeDocType } from '@thabrez/types';

export const metadata: Metadata = {
  title: 'Statutory Rules & Delegated Legislation 2026–2027 | Knowledge Bank',
  description:
    'Comprehensive repository of statutory rules: Income-tax Rules, Central Goods and Services Tax Rules, Companies (Incorporation) Rules, and Labour Code Rules.',
  openGraph: {
    title: 'Statutory Rules & Delegated Legislation | Thabrez Tax Consulting',
    description:
      'Verified statutory rules, prescribed procedural forms, sub-rules, and compliance schedules under Indian central statutes.',
    type: 'website',
  },
};

interface RulesPageProps {
  searchParams: Promise<{
    category?: string;
  }>;
}

export default async function RulesHubPage({ searchParams }: RulesPageProps): Promise<JSX.Element> {
  const resolvedParams = await searchParams;
  const activeCategory = resolvedParams.category || 'ALL';

  const categories = KnowledgeBankEngine.getCategories();
  const rules = KnowledgeBankEngine.queryDocuments({
    documentType: KnowledgeDocType.RULE,
    category: activeCategory !== 'ALL' ? activeCategory : undefined,
    limit: 100,
  }).documents;

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
            <span className="font-semibold text-[#1B2A4A]">Statutory Rules &amp; Regulations</span>
          </div>
        </div>

        {/* Hero Section */}
        <section className="bg-gradient-to-b from-[#1B2A4A] via-[#152238] to-[#0F172A] py-14 text-white">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1 text-xs font-semibold text-white/90">
              <FileCode2 className="h-3.5 w-3.5 text-amber-300" />
              <span>Delegated Legislation &amp; Subordinate Rules</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl font-display">
              Statutory Rules Directory 2026–2027
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
              Explore operative procedural rules, prescribed compliance forms, schedules, and calculation methodologies framed under principal Parliamentary Acts.
            </p>
          </div>
        </section>

        {/* Category Pills Bar */}
        <section className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 py-3 shadow-sm">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-semibold">
              <Link
                href="/knowledge-bank/rules"
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                  activeCategory === 'ALL'
                    ? 'bg-[#1B2A4A] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All Rules
              </Link>
              {categories.map((cat) => {
                const isSelected = activeCategory.toLowerCase() === cat.slug.toLowerCase();
                return (
                  <Link
                    key={cat.id}
                    href={`/knowledge-bank/rules?category=${cat.slug}`}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
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
          </div>
        </section>

        {/* Rules Grid */}
        <section className="py-12 bg-slate-50">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {rules.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
                <BookOpen className="h-10 w-10 text-slate-400 mx-auto" />
                <h3 className="text-lg font-bold text-[#1B2A4A]">No statutory rules found</h3>
                <p className="text-xs text-slate-500">
                  Select &apos;All Rules&apos; to view all subordinate legislation.
                </p>
                <Link
                  href="/knowledge-bank/rules"
                  className="inline-block text-xs font-semibold text-[#8B3FA8] hover:underline mt-2"
                >
                  Reset filters &rarr;
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {rules.map((rule) => (
                  <div
                    key={rule.id}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-[#8B3FA8]/40 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <VerifiedSourceBadge
                          authority={rule.authority}
                          sourceUrl={rule.officialSourceUrl}
                          isOfficial={rule.isOfficial}
                          compact
                        />
                        <span className="text-xs font-mono text-slate-500">
                          {rule.documentNumber || 'Statutory Rule'}
                        </span>
                      </div>

                      <h2 className="text-lg font-bold text-[#1B2A4A] leading-snug">
                        <Link
                          href={`/knowledge-bank/rules/${rule.slug}`}
                          className="hover:text-[#8B3FA8] transition-colors"
                        >
                          {rule.title}
                        </Link>
                      </h2>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                        {rule.summary}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <Link
                        href={`/knowledge-bank/rules/${rule.slug}`}
                        className="font-bold text-[#1B2A4A] hover:text-[#8B3FA8] inline-flex items-center gap-1"
                      >
                        Read Procedural Rule &rarr;
                      </Link>
                      <a
                        href={rule.officialSourceUrl || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-500 hover:text-slate-700 inline-flex items-center gap-1 font-medium"
                      >
                        Official Gazette <ExternalLink className="h-3 w-3" />
                      </a>
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
