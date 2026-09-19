import type { Metadata } from 'next';
import Link from 'next/link';
import { Header, Footer } from '@thabrez/ui';
import {
  BookOpen,
  Scale,
  Receipt,
  Ship,
  Building2,
  Users,
  MapPin,
  Calendar,
  Percent,
  GitCompare,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Clock,
} from 'lucide-react';
import { KnowledgeSearchBar } from '../../components/knowledge/knowledge-search-bar';
import { VerifiedSourceBadge } from '../../components/knowledge/verified-source-badge';
import { LegalDisclaimerFooter } from '../../components/knowledge/legal-disclaimer-footer';
import { KnowledgeBankEngine } from '../../lib/knowledge/engine';
import { AuthorityType } from '@thabrez/types';

export const metadata: Metadata = {
  title: 'Knowledge Bank 2026–2027 | Statutory Tax & Corporate Intelligence',
  description:
    'Comprehensive statutory repository for Indian taxation, Income-tax Act 2025, CGST Act, MCA rules, 2026 tax rates, circulars, compliance calendar, and official gazette notifications.',
  openGraph: {
    title: 'Knowledge Bank 2026–2027 | Thabrez Tax Consulting',
    description:
      'Verified, continuously synchronized legal statutes, tax rates, GST notifications, and regulatory updates for Indian businesses and tax practitioners.',
    type: 'website',
  },
};

export default function KnowledgeBankMainPage(): JSX.Element {
  const categories = KnowledgeBankEngine.getCategories();
  const latestUpdates = KnowledgeBankEngine.queryDocuments({ limit: 6 }).documents;
  const deadlines = KnowledgeBankEngine.getComplianceDeadlines().slice(0, 4);
  const amendments = KnowledgeBankEngine.getRecentAmendments().slice(0, 3);

  const categoryIconMap: Record<string, typeof Scale> = {
    'cat_direct_tax': Scale,
    'cat_gst': Receipt,
    'cat_customs': Ship,
    'cat_corporate': Building2,
    'cat_labour': Users,
    'cat_state_vat': MapPin,
  };

  const officialSources = [
    {
      name: 'Income Tax Department (CBDT)',
      domain: 'incometax.gov.in',
      url: 'https://www.incometax.gov.in',
      description: 'Official direct taxes portal for e-filing, AIS, statutory circulars, and notifications.',
      authority: AuthorityType.CBDT,
    },
    {
      name: 'Central Board of Indirect Taxes & Customs (CBIC)',
      domain: 'cbic.gov.in',
      url: 'https://www.cbic.gov.in',
      description: 'Apex indirect tax body publishing GST notifications, Customs tariffs, and circulars.',
      authority: AuthorityType.CBIC,
    },
    {
      name: 'GST Common Portal (GSTN)',
      domain: 'gst.gov.in',
      url: 'https://www.gst.gov.in',
      description: 'Statutory filing portal for GSTR-1, GSTR-3B, GSTR-9, e-way bills, and ITC reconciliations.',
      authority: AuthorityType.GSTN,
    },
    {
      name: 'Ministry of Corporate Affairs (MCA)',
      domain: 'mca.gov.in',
      url: 'https://www.mca.gov.in',
      description: 'Regulatory portal for company incorporation, ROC annual filings, DIR-3 KYC, and MCA-21 v3.',
      authority: AuthorityType.MCA,
    },
    {
      name: 'Reserve Bank of India (RBI)',
      domain: 'rbi.org.in',
      url: 'https://www.rbi.org.in',
      description: 'Central bank issuing FEMA master directions, export-import reporting, and FDI compliances.',
      authority: AuthorityType.RBI,
    },
    {
      name: 'Securities & Exchange Board of India (SEBI)',
      domain: 'sebi.org.in',
      url: 'https://www.sebi.org.in',
      description: 'Securities regulator governing LODR disclosures, corporate governance, and takeovers.',
      authority: AuthorityType.SEBI,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 selection:bg-[#8B3FA8] selection:text-white">
      <Header currentPath="/knowledge-bank" />

      <main className="flex-1">
        {/* Knowledge Bank Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#1B2A4A] via-[#152238] to-[#0F172A] py-16 text-white sm:py-24">
          {/* Ambient Glow Elements */}
          <div className="absolute top-0 right-1/4 h-96 w-96 rounded-full bg-[#8B3FA8]/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 h-80 w-80 rounded-full bg-[#E8823A]/15 blur-3xl pointer-events-none" />

          <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white/90 backdrop-blur-md">
                <span className="flex h-2 w-2 rounded-full bg-[#10B981] animate-pulse" />
                <span>2026–2027 Regulatory Intelligence</span>
                <span className="text-white/40">|</span>
                <span className="text-amber-300 font-medium">CBDT • CBIC • MCA • RBI</span>
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl font-display leading-tight">
                Statutory Knowledge Bank &amp; <br />
                <span className="bg-gradient-to-r from-amber-300 via-purple-200 to-emerald-300 bg-clip-text text-transparent">
                  Regulatory Repository
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
                Authoritative legal acts, statutory rules, real-time gazette notifications, 
                FY 2026–2027 tax rate cards, and compliance due dates verified directly from official Government portals.
              </p>

              {/* Search Bar */}
              <div className="pt-4 max-w-2xl mx-auto">
                <KnowledgeSearchBar />
              </div>

              {/* Quick Jump Tags */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs text-slate-300">
                <span className="text-slate-400 font-medium">Quick Jumps:</span>
                {[
                  { label: 'Section 115BAC (New Tax Regime)', href: '/knowledge-bank/tax-rates#115bac' },
                  { label: 'Income-tax Act 2025', href: '/knowledge-bank/acts/income-tax-act-2025' },
                  { label: 'Section 194Q TDS', href: '/knowledge-bank/tax-rates#tds' },
                  { label: 'CGST Act 2017', href: '/knowledge-bank/acts/central-goods-and-services-tax-act-2017' },
                  { label: 'DIR-3 KYC Filing', href: '/knowledge-bank/forms#mca' },
                  { label: 'E-Invoicing ₹5Cr Threshold', href: '/knowledge-bank/amendments' },
                ].map((tag, idx) => (
                  <Link
                    key={idx}
                    href={tag.href}
                    className="rounded-lg bg-white/10 px-3 py-1 text-slate-200 hover:bg-[#8B3FA8]/40 hover:text-white transition-colors border border-white/10"
                  >
                    {tag.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Navigation Cards Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-white/10">
              {[
                {
                  title: 'Tax Rate Center',
                  desc: 'S. 115BAC, Corporate, TDS, GST',
                  icon: Percent,
                  href: '/knowledge-bank/tax-rates',
                  color: 'from-amber-500/20 to-orange-500/10 text-amber-300 border-amber-500/30',
                },
                {
                  title: 'Statutory Acts & Codes',
                  desc: 'IT Act 2025, 1961, CGST, MCA',
                  icon: Scale,
                  href: '/knowledge-bank/acts',
                  color: 'from-purple-500/20 to-indigo-500/10 text-purple-300 border-purple-500/30',
                },
                {
                  title: 'Compliance Calendar',
                  desc: '2026 Due Dates & Penalty Radar',
                  icon: Calendar,
                  href: '/knowledge-bank/compliance-calendar',
                  color: 'from-emerald-500/20 to-teal-500/10 text-emerald-300 border-emerald-500/30',
                },
                {
                  title: 'What Changed in 2026?',
                  desc: 'Side-by-side amendment diffs',
                  icon: GitCompare,
                  href: '/knowledge-bank/amendments',
                  color: 'from-blue-500/20 to-cyan-500/10 text-cyan-300 border-blue-500/30',
                },
              ].map((card, idx) => {
                const Icon = card.icon;
                return (
                  <Link
                    key={idx}
                    href={card.href}
                    className={`group flex flex-col justify-between p-4 rounded-xl bg-gradient-to-br ${card.color} border backdrop-blur-sm hover:scale-[1.02] transition-all`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <Icon className="h-6 w-6" />
                      <ArrowRight className="h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-white text-sm">{card.title}</h2>
                      <p className="text-xs text-slate-300 mt-0.5">{card.desc}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Coexistence & Regulatory Architecture Notice Banner */}
        <section className="bg-amber-50 border-y border-amber-200/80 py-4 px-4 sm:px-6">
          <div className="container mx-auto max-w-7xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-950 text-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-200 text-amber-800 font-bold text-xs">
                ℹ️
              </span>
              <div>
                <span className="font-semibold">Dual Statute Coexistence (FY 2026–2027):</span>{' '}
                The <em>Income-tax Act, 2025</em> governs forward assessments starting AY 2027-28, while the <em>Income-tax Act, 1961</em> is fully retained for ongoing appeals, historic reassessments, and pre-2026 scrutiny.
              </div>
            </div>
            <Link
              href="/knowledge-bank/acts"
              className="shrink-0 font-semibold text-amber-800 hover:text-amber-900 underline text-xs"
            >
              Learn More &rarr;
            </Link>
          </div>
        </section>

        {/* Statutory Pillar Categories */}
        <section className="py-16 bg-white border-b border-slate-200">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8B3FA8]">
                  <BookOpen className="h-4 w-4" />
                  Statutory Classification
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#1B2A4A] mt-1">
                  Explore by Regulatory Practice Domain
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Categorized codifications covering Indian direct, indirect, corporate, labour, and commercial jurisprudence.
                </p>
              </div>
              <Link
                href="/knowledge-bank/acts"
                className="text-sm font-semibold text-[#8B3FA8] hover:text-[#7A2E97] inline-flex items-center gap-1.5"
              >
                Browse All Statutes <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat) => {
                const Icon = categoryIconMap[cat.id] || Scale;
                return (
                  <div
                    key={cat.id}
                    className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm hover:border-[#8B3FA8]/40 hover:shadow-md transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-[#1B2A4A] group-hover:bg-[#8B3FA8]/10 group-hover:text-[#8B3FA8] transition-colors">
                          <Icon className="h-6 w-6" />
                        </div>
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                          {cat.docCount || 0} Statutes &amp; Rules
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-[#1B2A4A] group-hover:text-[#8B3FA8] transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-sm text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                        {cat.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                      <Link
                        href={`/knowledge-bank/acts?category=${cat.slug}`}
                        className="font-semibold text-[#1B2A4A] hover:text-[#8B3FA8] inline-flex items-center gap-1"
                      >
                        Explore Category <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                      <Link
                        href={`/knowledge-bank/updates?category=${cat.slug}`}
                        className="text-slate-500 hover:text-slate-700 font-medium"
                      >
                        Recent Circulars
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Latest Statutory Updates & Due Dates Split Section */}
        <section className="py-16 bg-slate-50">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Left Column: Latest Regulatory Notifications (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#E8823A]">
                      <Sparkles className="h-4 w-4" />
                      Continuous Regulatory Sync
                    </div>
                    <h2 className="text-2xl font-bold font-display text-[#1B2A4A] mt-0.5">
                      Latest Notifications &amp; Circulars
                    </h2>
                  </div>
                  <Link
                    href="/knowledge-bank/updates"
                    className="text-xs font-semibold text-[#8B3FA8] hover:underline inline-flex items-center gap-1"
                  >
                    View All <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>

                <div className="space-y-4">
                  {latestUpdates.map((doc) => (
                    <div
                      key={doc.id}
                      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-[#8B3FA8]/30 hover:shadow-md transition-all space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <VerifiedSourceBadge
                          authority={doc.authority}
                          sourceUrl={doc.officialSourceUrl}
                          isOfficial={doc.isOfficial}
                          compact
                        />
                        <span className="text-xs text-slate-500 font-mono">
                          {doc.documentNumber || 'Official Circular'}
                        </span>
                      </div>

                      <h3 className="font-bold text-[#1B2A4A] text-base leading-snug">
                        <Link
                          href={doc.documentType === 'ACT' ? `/knowledge-bank/acts/${doc.slug}` : `/knowledge-bank/updates`}
                          className="hover:text-[#8B3FA8] transition-colors"
                        >
                          {doc.title}
                        </Link>
                      </h3>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {doc.summary}
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
                        <div className="flex items-center gap-3">
                          <span>FY: <strong className="text-slate-700">{doc.financialYear || '2026-27'}</strong></span>
                          <span>Category: <strong className="text-slate-700">{doc.categoryName}</strong></span>
                        </div>
                        <a
                          href={doc.officialSourceUrl || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-semibold text-[#8B3FA8] hover:underline"
                        >
                          Official Source <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Upcoming Statutory Deadlines & What Changed (5 cols) */}
              <div className="lg:col-span-5 space-y-8">
                {/* Upcoming Deadlines Radar */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600">
                        <Clock className="h-4 w-4" />
                        Statutory Deadlines Radar
                      </div>
                      <h2 className="text-xl font-bold font-display text-[#1B2A4A] mt-0.5">
                        Upcoming Due Dates
                      </h2>
                    </div>
                    <Link
                      href="/knowledge-bank/compliance-calendar"
                      className="text-xs font-semibold text-emerald-600 hover:underline inline-flex items-center gap-1"
                    >
                      Full Calendar &rarr;
                    </Link>
                  </div>

                  <div className="space-y-3">
                    {deadlines.map((dl) => (
                      <div
                        key={dl.id}
                        className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 hover:bg-slate-100/80 transition-colors flex items-start gap-3"
                      >
                        <div className="flex flex-col items-center justify-center rounded-lg bg-[#1B2A4A] text-white px-2.5 py-1.5 min-w-[54px] text-center">
                          <span className="text-[10px] font-semibold uppercase text-amber-300">
                            {new Date(dl.dueDate).toLocaleString('en-US', { month: 'short' })}
                          </span>
                          <span className="text-lg font-bold leading-none">
                            {new Date(dl.dueDate).getDate()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-bold text-[#1B2A4A] truncate">
                              {dl.title}
                            </span>
                            {dl.priority === 'CRITICAL' && (
                              <span className="text-[10px] font-semibold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                                Late Fee
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                            {dl.description}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 font-mono">
                            <span>{dl.category}</span>
                            {dl.section && (
                              <>
                                <span>•</span>
                                <span>{dl.section}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2">
                    <Link
                      href="/knowledge-bank/compliance-calendar"
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 text-xs transition-colors"
                    >
                      <Calendar className="h-4 w-4" />
                      Open Interactive Compliance Calendar
                    </Link>
                  </div>
                </div>

                {/* "What Changed in 2026?" Amendment Teaser Card */}
                <div className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-900 via-[#1B2A4A] to-[#152238] p-6 text-white shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#8B3FA8] px-3 py-1 text-xs font-bold text-white">
                      <GitCompare className="h-3.5 w-3.5" />
                      Provision Diffs
                    </span>
                    <span className="text-xs text-purple-200 font-mono">2026–2027</span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold font-display">
                      What Changed in 2026–2027 Laws?
                    </h3>
                    <p className="text-xs text-purple-100/80 mt-1 leading-relaxed">
                      Side-by-side comparative analysis of revised Section 115BAC slabs, ₹5Cr GST e-invoicing threshold, and fast-track MCA merger provisions.
                    </p>
                  </div>

                  <div className="space-y-2 pt-1">
                    {amendments.map((item, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg bg-white/10 p-2.5 text-xs backdrop-blur-sm border border-white/10"
                      >
                        <div className="font-semibold text-amber-300">
                          {item.amendment.amendmentNumber || item.amendment.title}
                        </div>
                        <div className="text-slate-200 text-[11px] line-clamp-1 mt-0.5">
                          {item.amendment.description}
                        </div>
                      </div>
                    ))}
                  </div>

                  <Link
                    href="/knowledge-bank/amendments"
                    className="inline-flex items-center justify-center w-full gap-2 rounded-xl bg-white text-[#1B2A4A] hover:bg-slate-100 font-semibold py-2.5 text-xs transition-colors shadow-sm"
                  >
                    View All Amendment Diffs <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Official Government Direct Links Directory */}
        <section className="py-16 bg-white border-t border-slate-200">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#8B3FA8]">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                Verified Legal Ground Truth
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#1B2A4A]">
                Official Government Statutory Portals
              </h2>
              <p className="text-sm text-slate-600">
                Direct access to authoritative central boards, gazette repositories, and statutory e-filing engines.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {officialSources.map((src, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 p-5 bg-white hover:border-[#8B3FA8]/40 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <VerifiedSourceBadge authority={src.authority} isOfficial compact />
                      <span className="text-[11px] font-mono text-slate-400">{src.domain}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1B2A4A] text-base">{src.name}</h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{src.description}</p>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100">
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8B3FA8] hover:text-[#7A2E97]"
                    >
                      Visit Official Portal <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Legal Disclaimer Footer */}
        <LegalDisclaimerFooter />
      </main>

      <Footer />
    </div>
  );
}
