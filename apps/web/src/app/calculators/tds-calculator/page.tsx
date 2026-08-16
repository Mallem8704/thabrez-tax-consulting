import type { Metadata } from 'next';
import Link from 'next/link';
import { Header, Footer } from '@thabrez/ui';
import { TdsCalculator } from '../../../components/calculators/tds-calculator';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'TDS Calculator India — Sections 194J, 194C, 194I, 194H | Thabrez Tax Consulting',
  description:
    'Free online TDS calculator for Indian Income Tax. Calculate Tax Deducted at Source for professional fees, contractors, rent, commission, and purchase of goods.',
  keywords: ['TDS Calculator', 'Section 194J TDS', 'Section 194C TDS', 'Section 194I Rent TDS', 'Section 206AA TDS'],
  openGraph: {
    title: 'TDS Calculator — Income Tax Act TDS Rates',
    description: 'Calculate statutory TDS deductions across all key Income Tax sections.',
    type: 'website',
  },
};

export default function TdsCalculatorPage(): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-[#8B3FA8] selection:text-white">
      <Header currentPath="/calculators" />

      <main className="flex-1">
        {/* Header Hero */}
        <section className="border-b border-slate-200 bg-[#1B2A4A] py-12 text-white sm:py-16">
          <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-4">
            <Link
              href="/calculators"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to All Calculators
            </Link>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-display">
              TDS Calculator India
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl">
              Calculate Tax Deducted at Source (TDS) under the Income Tax Act, 1961 for professional fees, contractor payments, rent, and brokerage.
            </p>
          </div>
        </section>

        {/* Interactive Component */}
        <section className="py-12 sm:py-16 bg-slate-50">
          <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <TdsCalculator />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
