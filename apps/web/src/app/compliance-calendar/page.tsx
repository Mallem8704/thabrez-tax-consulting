import type { Metadata } from 'next';
import { Header, Footer } from '@thabrez/ui';
import { ComplianceCalendarView } from '../../components/compliance/compliance-calendar-view';
import { Calendar } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Statutory Compliance Calendar India (FY 2024-25 & 2025-26) | Thabrez Tax Consulting',
  description:
    'Comprehensive statutory due date calendar for Indian businesses: GST Returns (GSTR-1, GSTR-3B), TDS Challans & Returns, Advance Tax, ITR Filing, MCA AOC-4 & MGT-7, and PF/ESI remittances.',
  keywords: [
    'Statutory Compliance Calendar India',
    'GST Due Date Calendar 2025',
    'TDS Return Due Dates',
    'Income Tax Return Deadline',
    'Advance Tax Installment Dates',
    'ROC Compliance Calendar 2025',
  ],
  openGraph: {
    title: 'Statutory Compliance Calendar India — Complete Due Dates Guide',
    description:
      'Never miss an Indian statutory tax or corporate filing deadline. Automated reminders for GST, TDS, ITR, and MCA obligations.',
    type: 'website',
  },
};

export default function ComplianceCalendarPage(): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-[#8B3FA8] selection:text-white">
      <Header currentPath="/compliance-calendar" />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b border-slate-200 bg-[#1B2A4A] py-16 text-white sm:py-20">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-[#E8823A]/20 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#E8823A]">
              <Calendar className="h-3.5 w-3.5" /> Indian Statutory Due Dates
            </span>
            <h1 className="text-3xl font-bold tracking-tight sm:text-5xl font-display">
              Tax &amp; Regulatory Compliance Calendar
            </h1>
            <p className="max-w-3xl mx-auto text-sm sm:text-base text-slate-300">
              Track mandatory statutory deadlines across Goods &amp; Services Tax (GST), Direct Tax (TDS/ITR/Advance Tax), Ministry of Corporate Affairs (MCA/ROC), and Labour Laws.
            </p>
          </div>
        </section>

        {/* Interactive Calendar & Reminders View */}
        <section className="py-12 sm:py-16 bg-slate-50">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ComplianceCalendarView />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
