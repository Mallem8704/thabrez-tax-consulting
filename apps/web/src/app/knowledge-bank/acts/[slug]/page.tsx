import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header, Footer } from '@thabrez/ui';
import {
  Scale,
  ArrowLeft,
  Calendar,
  ShieldCheck,
  Clock,
  GitCompare,
  AlertTriangle,
  MessageCircle,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { KnowledgeBankEngine } from '../../../../lib/knowledge/engine';
import { VerifiedSourceBadge } from '../../../../components/knowledge/verified-source-badge';
import { LegalDisclaimerFooter } from '../../../../components/knowledge/legal-disclaimer-footer';
import { AmendmentDiffViewer } from '../../../../components/knowledge/amendment-diff-viewer';
import { DocLegislationStatus } from '@thabrez/types';

interface ActDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ActDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = KnowledgeBankEngine.getDocumentBySlug(slug);

  if (!doc) {
    return {
      title: 'Act Not Found | Knowledge Bank',
    };
  }

  return {
    title: `${doc.title} — Statutory Codification | Knowledge Bank`,
    description: doc.summary || `Statutory analysis, sections, and 2026-2027 operative rules for ${doc.title}.`,
    openGraph: {
      title: `${doc.title} | Thabrez Tax Consulting`,
      description: doc.summary || undefined,
      type: 'article',
    },
  };
}

export default async function ActDetailPage({ params }: ActDetailPageProps): Promise<JSX.Element> {
  const { slug } = await params;
  const doc = KnowledgeBankEngine.getDocumentBySlug(slug);

  if (!doc) {
    notFound();
  }

  const isCurrent = doc.status === DocLegislationStatus.CURRENT;
  const isHistorical = doc.status === DocLegislationStatus.HISTORICAL;
  const paragraphs = doc.content ? doc.content.split('\n\n') : [];

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 selection:bg-[#8B3FA8] selection:text-white">
      <Header currentPath="/knowledge-bank/acts" />

      <main className="flex-1">
        {/* Breadcrumb Bar */}
        <div className="bg-slate-100 border-b border-slate-200 py-2.5 px-4 sm:px-6">
          <div className="container mx-auto max-w-7xl flex items-center gap-1.5 text-xs text-slate-500 overflow-x-auto">
            <Link href="/" className="hover:text-slate-800">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/knowledge-bank" className="hover:text-slate-800">Knowledge Bank</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/knowledge-bank/acts" className="hover:text-slate-800">Acts &amp; Codes</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="font-semibold text-[#1B2A4A] truncate max-w-xs">{doc.title}</span>
          </div>
        </div>

        {/* Hero Section */}
        <section className="bg-gradient-to-b from-[#1B2A4A] to-[#152238] py-10 text-white">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">
            <Link
              href="/knowledge-bank/acts"
              className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Acts Catalog
            </Link>

            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-3 py-0.5 text-xs font-bold ${
                  isCurrent
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : isHistorical
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-white/10 text-white border border-white/20'
                }`}
              >
                {doc.status}
              </span>
              <span className="text-xs text-slate-300 font-mono bg-white/10 px-2.5 py-0.5 rounded border border-white/10">
                {doc.documentNumber || 'Act of Parliament'}
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

            {/* Meta tags line */}
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-300 border-t border-white/10">
              <VerifiedSourceBadge
                authority={doc.authority}
                sourceUrl={doc.officialSourceUrl}
                isOfficial={doc.isOfficial}
              />
              {doc.publishedDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <span>Enacted: <strong>{new Date(doc.publishedDate).getFullYear()}</strong></span>
                </div>
              )}
              {doc.effectiveDate && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
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

        {/* Historical Notice if applicable */}
        {isHistorical && (
          <section className="bg-amber-50 border-b border-amber-200 py-3.5 px-4 sm:px-6">
            <div className="container mx-auto max-w-7xl flex items-start gap-3 text-amber-900 text-xs sm:text-sm">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold">Transitional &amp; Historical Reference Statute:</strong>{' '}
                This enactment applies to assessments, audits, re-assessment proceedings (Section 148), and pending appeals for assessment years prior to the transition. For current prospective filings and compliance, refer to the operative <em>Income-tax Act, 2025</em>.
              </div>
            </div>
          </section>
        )}

        {/* Main Content Layout */}
        <section className="py-10 bg-white">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Left/Main Column: Act Content & Sections (8 cols) */}
              <div className="lg:col-span-8 space-y-8">
                {/* Content Render Box */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
                  <div className="prose prose-slate max-w-none prose-headings:font-display prose-headings:text-[#1B2A4A] prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-p:text-slate-700 prose-p:leading-relaxed prose-li:text-slate-700 prose-strong:text-[#1B2A4A]">
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

                {/* Provision Amendments & Diffs (if available) */}
                {doc.amendments && doc.amendments.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <GitCompare className="h-5 w-5 text-[#8B3FA8]" />
                      <h2 className="text-xl font-bold font-display text-[#1B2A4A]">
                        2026–2027 Legislative Amendments &amp; Diffs
                      </h2>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600">
                      Visual statutory text comparison showing wording modifications enacted in the latest Finance Act.
                    </p>

                    <div className="space-y-6">
                      {doc.amendments.map((amend, aIdx) => (
                        <AmendmentDiffViewer
                          key={aIdx}
                          document={doc}
                          amendment={amend}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Sidebar Actions & Statutory Metadata (4 cols) */}
              <div className="lg:col-span-4 space-y-6">
                {/* CA Consultation CTA Box */}
                <div className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 via-white to-amber-50/30 p-6 shadow-sm space-y-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8B3FA8] text-white">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1B2A4A] text-base font-display">
                      Need Legal or Compliance Advisory?
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Our senior Chartered Accountants and tax attorneys provide tailored interpretation for your enterprise.
                    </p>
                  </div>
                  <div className="space-y-2 pt-2">
                    <a
                      href="https://wa.me/919949666687?text=Hi%20Thabrez%20Tax%20Consulting,%20I%20have%20a%20query%20regarding%20the%20"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-2.5 text-xs transition-colors shadow-sm"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Chat with CA on WhatsApp
                    </a>
                    <Link
                      href="/contact"
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#1B2A4A] hover:bg-[#152238] text-white font-bold py-2.5 text-xs transition-colors"
                    >
                      Book Professional Advisory
                    </Link>
                  </div>
                </div>

                {/* Quick Statutory Metadata Card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                  <h3 className="font-bold text-[#1B2A4A] text-sm flex items-center gap-2">
                    <Scale className="h-4 w-4 text-[#8B3FA8]" />
                    Statutory Details
                  </h3>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Jurisdiction</span>
                      <span className="font-semibold text-slate-800">{doc.jurisdiction}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Regulatory Body</span>
                      <span className="font-semibold text-slate-800">{doc.authority}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Document Type</span>
                      <span className="font-semibold text-slate-800">{doc.documentType}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Financial Year</span>
                      <span className="font-semibold text-slate-800">{doc.financialYear || 'FY 2026-27'}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Assessment Year</span>
                      <span className="font-semibold text-slate-800">{doc.assessmentYear || 'AY 2027-28'}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <a
                      href={doc.officialSourceUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold py-2 text-xs transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      View on Official {doc.authority} Portal
                    </a>
                  </div>
                </div>

                {/* Related Knowledge Shortcuts */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm space-y-3">
                  <h3 className="font-bold text-[#1B2A4A] text-sm">Related Resources</h3>
                  <div className="space-y-2 text-xs">
                    <Link
                      href="/knowledge-bank/tax-rates"
                      className="block p-2.5 rounded-lg bg-white border border-slate-200 hover:border-[#8B3FA8] text-slate-700 hover:text-[#8B3FA8] font-medium transition-colors"
                    >
                      &rarr; 2026–2027 Statutory Tax Rate Directory
                    </Link>
                    <Link
                      href="/knowledge-bank/compliance-calendar"
                      className="block p-2.5 rounded-lg bg-white border border-slate-200 hover:border-[#8B3FA8] text-slate-700 hover:text-[#8B3FA8] font-medium transition-colors"
                    >
                      &rarr; Statutory Compliance Due Dates
                    </Link>
                    <Link
                      href="/knowledge-bank/amendments"
                      className="block p-2.5 rounded-lg bg-white border border-slate-200 hover:border-[#8B3FA8] text-slate-700 hover:text-[#8B3FA8] font-medium transition-colors"
                    >
                      &rarr; &quot;What Changed?&quot; Provision Diff Viewer
                    </Link>
                  </div>
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
