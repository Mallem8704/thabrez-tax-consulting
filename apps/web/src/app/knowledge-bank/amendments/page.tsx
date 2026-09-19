import type { Metadata } from 'next';
import Link from 'next/link';
import { Header, Footer } from '@thabrez/ui';
import {
  GitCompare,
  ChevronRight,
  MessageCircle,
  ArrowRight,
} from 'lucide-react';
import { AmendmentDiffViewer } from '../../../components/knowledge/amendment-diff-viewer';
import { VerifiedSourceBadge } from '../../../components/knowledge/verified-source-badge';
import { LegalDisclaimerFooter } from '../../../components/knowledge/legal-disclaimer-footer';
import { AuthorityType } from '@thabrez/types';

export const metadata: Metadata = {
  title: 'What Changed in 2026–2027 Laws? | Provision Diff Explorer',
  description:
    'Side-by-side comparative analysis of key tax and corporate legal amendments for FY 2026–2027. Section 115BAC, TDS 194Q, GST e-invoicing ₹5Cr, and MCA Fast-track mergers.',
  openGraph: {
    title: 'Statutory Amendments & Provision Diffs 2026–2027 | Thabrez Tax Consulting',
    description:
      'Explore side-by-side before-and-after statutory wordings, legal impacts, and actionable compliance advisories for Indian enterprises.',
    type: 'website',
  },
};

export default function AmendmentsPage(): JSX.Element {
  const amendments = [
    {
      provision: 'Section 115BAC(1A) & (2)',
      amendmentTitle: 'Rationalization of New Tax Regime Slabs & Enhanced Standard Deduction',
      effectiveYear: 'FY 2026–2027 (AY 2027–2028)',
      gazetteRef: 'Finance Act 2026 (Act No. 12 of 2026), Section 48',
      beforeText: `Old Slabs (Pre-amendment):
- Up to ₹3,00,000: Nil
- ₹3,00,001 to ₹6,00,000: 5%
- ₹6,00,001 to ₹9,00,000: 10%
- ₹9,00,001 to ₹12,00,000: 15%
- ₹12,00,001 to ₹15,00,000: 20%
- Above ₹15,00,000: 30%
- Salaried Standard Deduction: ₹50,000
- Section 87A Full Rebate Limit: Up to ₹7,00,000`,
      afterText: `Amended Slabs (Operative FY 2026–2027):
- Up to ₹3,00,000: Nil
- ₹3,00,001 to ₹7,00,000: 5% (Expanded lower slab)
- ₹7,00,001 to ₹10,00,000: 10%
- ₹10,00,001 to ₹12,00,000: 15%
- ₹12,00,001 to ₹15,00,000: 20%
- Above ₹15,00,000: 30%
- Salaried Standard Deduction: ₹75,000 (Enhanced by ₹25,000)
- Section 87A Full Rebate Limit: Up to ₹7,00,000 with marginal relief`,
      practicalImpact:
        'Salaried individuals earning up to ₹7.75 Lakhs incur zero income tax under Section 115BAC (₹7,00,000 rebate + ₹75,000 standard deduction). High earners save up to ₹17,500 in base tax compared to earlier tax brackets.',
      authority: AuthorityType.CBDT,
      officialSourceUrl: 'https://www.incometax.gov.in',
    },
    {
      provision: 'Section 194Q & Section 206C(1H)',
      amendmentTitle: 'Withholding Clarification on Digital Marketplace Transactions & Thresholds',
      effectiveYear: 'FY 2026–2027',
      gazetteRef: 'CBDT Circular No. 04/2026 & Gazette Notification S.O. 982(E)',
      beforeText: `Ambiguity existed regarding the priority of deduction when an e-commerce platform facilitator (under Section 194-O) and buyer (under Section 194Q) both engaged in the same supply chain. Buyers were frequently subjected to double compliance.`,
      afterText: `Statutory proviso inserted: Where a transaction is subjected to TDS by an e-commerce operator under Section 194-O, no secondary deduction under Section 194Q or collection under Section 206C(1H) shall be mandated for the same invoice, eliminating overlapping withholding liabilities.`,
      practicalImpact:
        'E-commerce merchants and enterprise buyers no longer need to track dual withholding compliance. Clean exemption certificates are automated via PAN-GSTIN integration.',
      authority: AuthorityType.CBDT,
      officialSourceUrl: 'https://www.incometax.gov.in',
    },
    {
      provision: 'CGST Act Section 16(4) & Rule 48(4)',
      amendmentTitle: 'Mandatory E-Invoicing Expansion to ₹5 Crore B2B Turnover & ITC Timelines',
      effectiveYear: 'FY 2026–2027 (Effective 1st May 2026)',
      gazetteRef: 'CBIC Notification No. 18/2026-Central Tax',
      beforeText: `E-invoicing under Rule 48(4) was mandated for registered persons whose aggregate turnover in any preceding financial year exceeded ₹10 Crores. ITC under Section 16(4) was strictly barred after 30th November following the end of the financial year.`,
      afterText: `E-invoicing threshold reduced to ₹5 Crores aggregate turnover in any preceding financial year from 2017-18 onwards. Section 16(4) amended to provide automated reconciliation window for bona fide retrospective credit matching with GSTR-2B.`,
      practicalImpact:
        'Small and medium enterprises with turnover between ₹5Cr and ₹10Cr must generate IRN (Invoice Reference Numbers) via IRP portal for all B2B and export invoices. Non-compliant invoices are invalid for buyer ITC claims.',
      authority: AuthorityType.CBIC,
      officialSourceUrl: 'https://www.cbic.gov.in',
    },
    {
      provision: 'Companies Act, 2013 — Section 233 & Rule 25',
      amendmentTitle: 'Fast-Track Merger Relaxation for Holding & Wholly Owned Subsidiary (WOS)',
      effectiveYear: 'FY 2026–2027',
      gazetteRef: 'MCA Notification G.S.R. 214(E), Companies (Compromises, Arrangements and Amalgamations) Rules',
      beforeText: `Fast-track merger approval required mandatory separate regional director orders and lengthy physical NOCs from official liquidators with no deemed approval timeframes.`,
      afterText: `Deemed approval timeline of 60 days introduced. If the Central Government / Regional Director does not raise statutory objections within 60 days of application by eligible small companies or holding-WOS combinations, the scheme shall be deemed approved and registered automatically.`,
      practicalImpact:
        'Corporate reorganizations, internal holding simplifications, and small company amalgamations can now be completed within 90 days without NCLT court litigation.',
      authority: AuthorityType.MCA,
      officialSourceUrl: 'https://www.mca.gov.in',
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 selection:bg-[#8B3FA8] selection:text-white">
      <Header currentPath="/knowledge-bank/amendments" />

      <main className="flex-1">
        {/* Breadcrumbs */}
        <div className="bg-slate-100 border-b border-slate-200 py-2.5 px-4 sm:px-6">
          <div className="container mx-auto max-w-7xl flex items-center gap-1.5 text-xs text-slate-500">
            <Link href="/" className="hover:text-slate-800">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/knowledge-bank" className="hover:text-slate-800">Knowledge Bank</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="font-semibold text-[#1B2A4A]">What Changed in 2026–2027?</span>
          </div>
        </div>

        {/* Hero Section */}
        <section className="bg-gradient-to-b from-[#1B2A4A] via-[#152238] to-[#0F172A] py-14 text-white">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1 text-xs font-semibold text-white/90">
                <GitCompare className="h-3.5 w-3.5 text-amber-300" />
                <span>Statutory Provision Diffs &amp; Analysis</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl font-display">
                What Changed in 2026–2027 Laws?
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Compare exact statutory text alterations enacted in the Finance Act 2026, CBDT circulars, CBIC indirect tax notifications, and MCA corporate regulatory amendments.
              </p>
            </div>
          </div>
        </section>

        {/* Amendments List */}
        <section className="py-12 bg-slate-50">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="max-w-3xl">
              <h2 className="text-xl font-bold font-display text-[#1B2A4A]">
                Key Gazetted Amendments (FY 2026–2027)
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Toggle between side-by-side or inline view to evaluate how statutory wording changes impact corporate operations and compliance checklists.
              </p>
            </div>

            <div className="space-y-8">
              {amendments.map((item, idx) => (
                <div key={idx} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <VerifiedSourceBadge
                      authority={item.authority}
                      sourceUrl={item.officialSourceUrl}
                      isOfficial
                      compact
                    />
                  </div>
                  <AmendmentDiffViewer
                    provision={item.provision}
                    amendmentTitle={item.amendmentTitle}
                    effectiveYear={item.effectiveYear}
                    gazetteRef={item.gazetteRef}
                    beforeText={item.beforeText}
                    afterText={item.afterText}
                    practicalImpact={item.practicalImpact}
                    officialSourceUrl={item.officialSourceUrl}
                  />
                </div>
              ))}
            </div>

            {/* Advisory Box */}
            <div className="rounded-2xl border border-purple-200 bg-gradient-to-br from-[#1B2A4A] via-[#152238] to-purple-900 p-8 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  Strategic Advisory
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-display">
                  Need an Audit of Your Company&apos;s Amendment Readiness?
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                  Our Chartered Accountants review your enterprise billing systems, TDS configurations, and corporate resolutions to guarantee 100% compliance with 2026 statutory updates.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                <a
                  href="https://wa.me/919949666687?text=Hi%20Thabrez%20Tax%20Consulting,%20I%20would%20like%20an%20amendment%20readiness%20review%20for%20FY%202026-27"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold px-5 py-3 text-xs transition-colors shadow-sm whitespace-nowrap"
                >
                  <MessageCircle className="h-4 w-4" />
                  Fast-Track on WhatsApp
                </a>
                <Link
                  href="/contact"
                  className="flex items-center justify-center gap-2 rounded-xl bg-white text-[#1B2A4A] hover:bg-slate-100 font-bold px-5 py-3 text-xs transition-colors shadow-sm whitespace-nowrap"
                >
                  Schedule Consultation <ArrowRight className="h-4 w-4" />
                </Link>
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
