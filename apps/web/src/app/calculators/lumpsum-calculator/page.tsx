import type { Metadata } from 'next';
import Link from 'next/link';
import { Header, Footer } from '@thabrez/ui';
import { LumpsumCalculator } from '../../../components/calculators/lumpsum-calculator';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Lumpsum Calculator — One-Time Investment Growth | Thabrez Tax Consulting',
  description:
    'Calculate the compound growth and maturity value of a one-time lump sum investment in mutual funds, stocks, or fixed deposits over 1 to 30 years.',
  keywords: ['Lumpsum Calculator', 'Compound Interest Calculator India', 'Mutual Fund Lumpsum Return', 'One Time Investment Return'],
  openGraph: {
    title: 'Lumpsum Calculator — Compound Growth Estimator',
    description: 'Calculate future wealth and compound gains from a one-time lumpsum investment.',
    type: 'website',
  },
};

export default function LumpsumCalculatorPage(): JSX.Element {
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
              Lumpsum Investment Calculator
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl">
              Calculate the compound wealth growth and expected maturity value of a one-time capital deposit.
            </p>
          </div>
        </section>

        {/* Interactive Component */}
        <section className="py-12 sm:py-16 bg-slate-50">
          <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <LumpsumCalculator />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
