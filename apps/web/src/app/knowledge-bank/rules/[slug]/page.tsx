import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header, Footer } from '@thabrez/ui';
import {
  ArrowLeft,
  ExternalLink,
  Calendar,
  ShieldCheck,
  ChevronRight,
  MessageCircle,
} from 'lucide-react';
import { KnowledgeBankEngine } from '../../../../lib/knowledge/engine';
import { VerifiedSourceBadge } from '../../../../components/knowledge/verified-source-badge';
import { LegalDisclaimerFooter } from '../../../../components/knowledge/legal-disclaimer-footer';

interface RuleDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: RuleDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = KnowledgeBankEngine.getDocumentBySlug(slug);

  if (!doc) {
    return {
      title: 'Rule Not Found | Knowledge Bank',
    };
  }

  return {
    title: `${doc.title} — Statutory Rule | Knowledge Bank`,
    description: doc.summary || `Prescribed procedures and procedural rules for ${doc.title}.`,
    openGraph: {
      title: `${doc.title} | Thabrez Tax Consulting`,
      description: doc.summary || undefined,
      type: 'article',
    },
  };
}

export default async function RuleDetailPage({ params }: RuleDetailPageProps): Promise<JSX.Element> {
  const { slug } = await params;
  const doc = KnowledgeBankEngine.getDocumentBySlug(slug);

  if (!doc) {
    notFound();
  }

  const paragraphs = doc.content ? doc.content.split('\n\n') : [];

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 selection:bg-[#8B3FA8] selection:text-white">
      <Header currentPath="/knowledge-bank/rules" />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-slate-100 border-b border-slate-200 py-2.5 px-4 sm:px-6">
          <div className="container mx-auto max-w-7xl flex items-center gap-1.5 text-xs text-slate-500 overflow-x-auto">
            <Link href="/" className="hover:text-slate-800">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/knowledge-bank" className="hover:text-slate-800">Knowledge Bank</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/knowledge-bank/rules" className="hover:text-slate-800">Statutory Rules</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="font-semibold text-[#1B2A4A] truncate max-w-xs">{doc.title}</span>
          </div>
        </div>

        {/* Hero Section */}
        <section className="bg-gradient-to-b from-[#1B2A4A] to-[#152238] py-10 text-white">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">
            <Link
              href="/knowledge-bank/rules"
              className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Rules Directory
            </Link>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-0.5 text-xs font-bold">
                {doc.status}
              </span>
              <span className="text-xs text-slate-300 font-mono bg-white/10 px-2.5 py-0.5 rounded border border-white/10">
                {doc.documentNumber || 'Statutory Rule'}
              </span>
              <span className="text-xs text-slate-300 bg-white/10 px-2.5 py-0.5 rounded border border-white/10">
                {doc.categoryName}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-bold font-display text-white">
              {doc.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-4xl leading-relaxed">
              {doc.summary}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-300 border-t border-white/10">
              <VerifiedSourceBadge
                authority={doc.authority}
                sourceUrl={doc.officialSourceUrl}
                isOfficial={doc.isOfficial}
              />
              {doc.effectiveDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <span>Effective: <strong>{new Date(doc.effectiveDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</strong></span>
                </div>
              )}
              {doc.lastVerifiedAt && (
                <div className="flex items-center gap-1 text-emerald-400 font-mono">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Verified: {new Date(doc.lastVerifiedAt).toLocaleDateString('en-IN')}</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Content Body */}
        <section className="py-10 bg-white">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-8 space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
                  <div className="prose prose-slate max-w-none prose-headings:font-display prose-headings:text-[#1B2A4A] prose-p:text-slate-700 prose-p:leading-relaxed">
                    {paragraphs.map((paragraph, pIdx) => {
                      if (paragraph.startsWith('# ')) {
                        return <h1 key={pIdx} className="text-2xl font-bold font-display text-[#1B2A4A] border-b border-slate-200 pb-2 mb-4">{paragraph.replace('# ', '')}</h1>;
                      }
                      if (paragraph.startsWith('## ')) {
                        return <h2 key={pIdx} className="text-xl font-bold font-display text-[#1B2A4A] mt-6 mb-3">{paragraph.replace('## ', '')}</h2>;
                      }
                      if (paragraph.startsWith('### ')) {
                        return <h3 key={pIdx} className="text-lg font-bold text-[#8B3FA8] mt-4 mb-2">{paragraph.replace('### ', '')}</h3>;
                      }
                      if (paragraph.startsWith('- ') || paragraph.startsWith('1. ')) {
                        const lines = paragraph.split('\n');
                        return (
                          <ul key={pIdx} className="space-y-2 my-3 pl-5 list-disc text-sm text-slate-700">
                            {lines.map((l, lIdx) => (
                              <li key={lIdx} dangerouslySetInnerHTML={{ __html: l.replace(/^[-*]|\d+\.\s*/, '').replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900">$1</strong>') }} />
                            ))}
                          </ul>
                        );
                      }
                      return (
                        <p key={pIdx} className="text-sm sm:text-base text-slate-700 leading-relaxed my-3" dangerouslySetInnerHTML={{ __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900">$1</strong>') }} />
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-4 space-y-6">
                <div className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 via-white to-amber-50/30 p-6 shadow-sm space-y-4">
                  <h3 className="font-bold text-[#1B2A4A] text-base font-display">
                    Need Procedural Assistance?
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Our compliance team handles rule-compliant statutory returns, forms generation, and authority representation.
                  </p>
                  <a
                    href="https://wa.me/919949666687"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-2.5 text-xs transition-colors shadow-sm"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Consult on WhatsApp
                  </a>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
                  <h3 className="font-bold text-[#1B2A4A] text-sm">Official Gazette Copy</h3>
                  <p className="text-xs text-slate-600">
                    Access the authentic government notification publication directly from the official portal.
                  </p>
                  <a
                    href={doc.officialSourceUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold py-2 text-xs transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    View on {doc.authority}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Legal Disclaimer */}
        <LegalDisclaimerFooter />
      </main>

      <Footer />
    </div>
  );
}
