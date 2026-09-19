import type { Metadata } from 'next';
import Link from 'next/link';
import { Header, Footer } from '@thabrez/ui';
import {
  Calendar,
  ChevronRight,
} from 'lucide-react';
import { ComplianceCalendarView } from '../../../components/knowledge/compliance-calendar-view';
import { VerifiedSourceBadge } from '../../../components/knowledge/verified-source-badge';
import { LegalDisclaimerFooter } from '../../../components/knowledge/legal-disclaimer-footer';
import { AuthorityType } from '@thabrez/types';

export const metadata: Metadata = {
  title: 'Statutory Compliance Calendar 2026–2027 | Due Dates & Penalty Radar',
  description:
    'Mandatory statutory compliance calendar for Indian enterprises in FY 2026–2027. Real-time due dates for GST, Income Tax (TDS/Advance Tax/ITR), MCA, and Labour Remittances with statutory late fees.',
  openGraph: {
    title: 'Statutory Compliance Calendar 2026–2027 | Thabrez Tax Consulting',
    description:
      'Verified Indian statutory due dates for GST (GSTR-1, GSTR-3B), TDS Challans, Advance Tax installments, ITR filing deadlines, and MCA AOC-4/MGT-7 obligations.',
    type: 'website',
  },
};

export default function KnowledgeComplianceCalendarPage(): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 selection:bg-[#8B3FA8] selection:text-white">
      <Header currentPath="/knowledge-bank/compliance-calendar" />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-slate-100 border-b border-slate-200 py-2.5 px-4 sm:px-6">
          <div className="container mx-auto max-w-7xl flex items-center gap-1.5 text-xs text-slate-500">
            <Link href="/" className="hover:text-slate-800">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/knowledge-bank" className="hover:text-slate-800">Knowledge Bank</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="font-semibold text-[#1B2A4A]">Statutory Compliance Calendar 2026–2027</span>
          </div>
        </div>

        {/* Hero Section */}
        <section className="bg-gradient-to-b from-[#1B2A4A] via-[#152238] to-[#0F172A] py-14 text-white">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1 text-xs font-semibold text-white/90">
                <Calendar className="h-3.5 w-3.5 text-amber-300" />
                <span>Statutory Due Dates &amp; Penalty Radar</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl font-display">
                Compliance Calendar 2026–2027
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Real-time statutory deadline tracker covering Goods &amp; Services Tax (GST), Direct Tax (TDS, Advance Tax, ITR), Ministry of Corporate Affairs (MCA ROC), and Labour Code remittances.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <VerifiedSourceBadge
                  authority={AuthorityType.CBDT}
                  sourceUrl="https://www.incometax.gov.in"
                  isOfficial
                />
                <VerifiedSourceBadge
                  authority={AuthorityType.CBIC}
                  sourceUrl="https://www.cbic.gov.in"
                  isOfficial
                />
                <VerifiedSourceBadge
                  authority={AuthorityType.MCA}
                  sourceUrl="https://www.mca.gov.in"
                  isOfficial
                />
              </div>
            </div>
          </div>
        </section>

        {/* Calendar Interactive View */}
        <section className="py-12 bg-slate-50">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ComplianceCalendarView />
          </div>
        </section>

        {/* Legal Disclaimer */}
        <LegalDisclaimerFooter />
      </main>

      <Footer />
    </div>
  );
}
