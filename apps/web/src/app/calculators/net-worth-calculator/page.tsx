import type { Metadata } from 'next';
import Link from 'next/link';
import { Header, Footer } from '@thabrez/ui';
import { NetWorthCalculator } from '../../../components/calculators/net-worth-calculator';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Net Worth Calculator & Personal Balance Sheet | Thabrez Tax Consulting',
  description:
    'Calculate your net worth by totaling real estate, equity, deposits, gold, and retirement savings minus liabilities and bank loans. CA Net Worth Certificate guide.',
  keywords: ['Net Worth Calculator', 'Personal Balance Sheet India', 'CA Net Worth Certificate', 'Asset Liability Calculator'],
  openGraph: {
    title: 'Net Worth Calculator — Personal Financial Balance Sheet',
    description: 'Calculate your total assets, liabilities, and net worth.',
    type: 'website',
  },
};

export default function NetWorthCalculatorPage(): JSX.Element {
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
              Net Worth Calculator
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl">
              Evaluate your personal financial position, compute total asset value against liabilities, and measure debt leverage.
            </p>
          </div>
        </section>

        {/* Interactive Component */}
        <section className="py-12 sm:py-16 bg-slate-50">
          <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <NetWorthCalculator />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
