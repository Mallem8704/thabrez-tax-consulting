import type { Metadata } from 'next';
import Link from 'next/link';
import { Header, Footer } from '@thabrez/ui';
import {
  FileText,
  ExternalLink,
  ChevronRight,
  Download,
  HelpCircle,
} from 'lucide-react';
import { VerifiedSourceBadge } from '../../../components/knowledge/verified-source-badge';
import { LegalDisclaimerFooter } from '../../../components/knowledge/legal-disclaimer-footer';
import { KnowledgeBankEngine } from '../../../lib/knowledge/engine';
import { ALL_FORM_SUBSECTORS } from '../../../lib/knowledge/data/seed-knowledge';
import { KnowledgeDocType } from '@thabrez/types';

export const metadata: Metadata = {
  title: 'Official Statutory Forms Library 2026–2027 | Income Tax, MCA, GST, FEMA & LLP',
  description:
    'Comprehensive directory of statutory forms across 12 sectors: Income Tax, ROC 2013/1956, Income Declaration, Wealth Tax, Service Tax, Unpaid Dividend, NBFCs, LLP Winding Up, FEMA, LLP, and CGST.',
  openGraph: {
    title: 'Official Statutory Forms Library 2026–2027 | Thabrez Tax Consulting',
    description:
      'Official statutory form templates, download links, and e-filing instructions across CBDT, CBIC, MCA, RBI, and EPFO.',
    type: 'website',
  },
};

interface FormsPageProps {
  searchParams: Promise<{
    subsector?: string | undefined;
    q?: string | undefined;
  }>;
}

export default async function FormsLibraryPage({ searchParams }: FormsPageProps): Promise<JSX.Element> {
  const resolvedParams = await searchParams;
  const activeSubsector = resolvedParams.subsector || 'ALL';
  const query = resolvedParams.q || '';

  const formsResult = KnowledgeBankEngine.queryDocuments({
    documentType: KnowledgeDocType.FORM,
    subSector: activeSubsector !== 'ALL' ? activeSubsector : undefined,
    q: query || undefined,
    limit: 100,
  });

  const forms = formsResult.documents;
  const currentSubsectorMeta = ALL_FORM_SUBSECTORS.find(
    (s) => s.slug.toLowerCase() === activeSubsector.toLowerCase(),
  );

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 selection:bg-[#8B3FA8] selection:text-white">
      <Header currentPath="/knowledge-bank/forms" />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-slate-100 border-b border-slate-200 py-2.5 px-4 sm:px-6">
          <div className="container mx-auto max-w-7xl flex items-center gap-1.5 text-xs text-slate-500">
            <Link href="/" className="hover:text-slate-800">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/knowledge-bank" className="hover:text-slate-800">Knowledge Bank</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="font-semibold text-[#1B2A4A]">Official Statutory Forms Library</span>
          </div>
        </div>

        {/* Hero Section */}
        <section className="bg-gradient-to-b from-[#1B2A4A] via-[#152238] to-[#0F172A] py-14 text-white">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1 text-xs font-semibold text-white/90">
              <FileText className="h-3.5 w-3.5 text-[#E8823A]" />
              <span>Official Statutory Forms Library (12 Sectors)</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl font-display">
              Statutory Forms &amp; E-Filing Directory
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
              Access official statutory return templates, e-filing instructions, due dates, and offline utilities across Income Tax, ROC Companies Act, GST, FEMA, NBFCs, and Labour laws.
            </p>
          </div>
        </section>

        {/* Sub-sector Navigation Pills */}
        <section className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 py-3 shadow-sm">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold scrollbar-thin">
              <Link
                href="/knowledge-bank/forms"
                className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                  activeSubsector === 'ALL'
                    ? 'bg-[#1B2A4A] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All Forms ({KnowledgeBankEngine.queryDocuments({ documentType: KnowledgeDocType.FORM }).total})
              </Link>
              {ALL_FORM_SUBSECTORS.map((sub) => {
                const isSelected = activeSubsector.toLowerCase() === sub.slug.toLowerCase();
                return (
                  <Link
                    key={sub.id}
                    href={`/knowledge-bank/forms?subsector=${sub.slug}`}
                    className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#8B3FA8] text-white shadow-sm'
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
            <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-purple-50 to-slate-50 border border-purple-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#8B3FA8]">
                  Sector Overview
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

          {/* Forms Grid */}
          {forms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {forms.map((form) => (
                <div
                  key={form.id}
                  className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-md hover:border-purple-200 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-block px-2.5 py-1 rounded-lg bg-purple-50 text-[#8B3FA8] font-bold text-xs">
                        {form.formCode || form.documentNumber || 'STATUTORY FORM'}
                      </span>
                      <VerifiedSourceBadge authority={form.authority} />
                    </div>

                    <h3 className="font-bold text-slate-900 text-base group-hover:text-[#8B3FA8] transition-colors line-clamp-2">
                      {form.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {form.summary || form.content}
                    </p>

                    {form.applicableTo && (
                      <div className="pt-2 border-t border-slate-100 text-xs">
                        <span className="font-semibold text-slate-700">Applicability: </span>
                        <span className="text-slate-500">{form.applicableTo}</span>
                      </div>
                    )}

                    {form.frequency && (
                      <div className="text-xs">
                        <span className="font-semibold text-slate-700">Filing Schedule: </span>
                        <span className="text-amber-700 font-medium">{form.frequency}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                    {form.officialSourceUrl && (
                      <a
                        href={form.officialSourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#8B3FA8] transition-colors"
                      >
                        <span>Official Portal</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}

                    {form.downloadUrl ? (
                      <a
                        href={form.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1B2A4A] hover:bg-[#8B3FA8] text-white text-xs font-bold shadow-sm transition-colors"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Download / File</span>
                      </a>
                    ) : (
                      <Link
                        href={`/knowledge-bank/forms?subsector=${form.subSector || 'ALL'}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#8B3FA8]"
                      >
                        <span>View Sector →</span>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center bg-white">
              <HelpCircle className="h-10 w-10 text-slate-400 mx-auto mb-3" />
              <h3 className="font-bold text-slate-800 text-base">No statutory forms found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                No forms match the selected sub-sector filter. Try switching back to &apos;All Forms&apos; or searching by form code.
              </p>
              <Link
                href="/knowledge-bank/forms"
                className="mt-4 inline-block px-4 py-2 rounded-xl bg-[#1B2A4A] text-white font-bold text-xs"
              >
                Reset Filter
              </Link>
            </div>
          )}

          {/* Assistance CTA */}
          <div className="mt-14 rounded-3xl bg-[#1B2A4A] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 max-w-xl">
              <h3 className="text-xl font-bold font-display">Need expert assistance filing statutory forms?</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Our team of Chartered Accountants and Corporate Secretarial specialists handle end-to-end filings for Income Tax, ROC, GST, FEMA, and IEPF compliances with 100% accuracy and zero penalty guarantee.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href="/contact"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8B3FA8] to-[#C43D6B] hover:opacity-90 text-white font-bold text-xs shadow-md transition-opacity"
              >
                Book CA Consultation
              </Link>
              <Link
                href="/calculators"
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors"
              >
                Explore Calculators
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
