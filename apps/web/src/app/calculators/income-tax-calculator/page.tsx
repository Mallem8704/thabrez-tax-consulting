import type { Metadata } from 'next';
import Link from 'next/link';
import { Header, Footer } from '@thabrez/ui';
import { IncomeTaxCalculator } from '../../../components/calculators/income-tax-calculator';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Income Tax Calculator (FY 2024-25 & 2025-26) — New vs Old Regime | Thabrez Tax Consulting',
  description:
    'Compare New Tax Regime (Section 115BAC) vs Old Tax Regime. Calculate total tax, Standard Deduction ₹75,000, 87A rebate, and Chapter VI-A deductions.',
  keywords: ['Income Tax Calculator', 'New Tax Regime Calculator', 'Old vs New Tax Regime', 'Section 115BAC Calculator', 'Budget 2025 Tax Calculator'],
  openGraph: {
    title: 'Income Tax Calculator — New vs Old Tax Regime',
    description: 'Calculate income tax liability and compare Old vs New Regime savings.',
    type: 'website',
  },
};

export default function IncomeTaxCalculatorPage(): JSX.Element {
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
              Income Tax Calculator (FY 2024-25 &amp; FY 2025-26)
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl">
              Compare New Tax Regime (Section 115BAC) and Old Tax Regime to identify your maximum tax savings.
            </p>
          </div>
        </section>

        {/* Interactive Component */}
        <section className="py-12 sm:py-16 bg-slate-50">
          <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <IncomeTaxCalculator />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
