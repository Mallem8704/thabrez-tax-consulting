import type { Metadata } from 'next';
import Link from 'next/link';
import { Header, Footer } from '@thabrez/ui';
import { SipCalculator } from '../../../components/calculators/sip-calculator';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'SIP Calculator — Mutual Fund Investment Growth | Thabrez Tax Consulting',
  description:
    'Calculate future maturity corpus for monthly mutual fund Systematic Investment Plans (SIP). Accurate compound interest growth forecasts and wealth gained.',
  keywords: ['SIP Calculator', 'Mutual Fund SIP Calculator India', 'Systematic Investment Plan Return', 'SIP Future Value'],
  openGraph: {
    title: 'SIP Calculator — Mutual Fund Return Estimator',
    description: 'Calculate maturity value and compounding returns of your monthly SIP.',
    type: 'website',
  },
};

export default function SipCalculatorPage(): JSX.Element {
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
              SIP Calculator (Mutual Funds)
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl">
              Forecast your long-term wealth creation through monthly Systematic Investment Plans with compound interest formulas.
            </p>
          </div>
        </section>

        {/* Interactive Component */}
        <section className="py-12 sm:py-16 bg-slate-50">
          <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <SipCalculator />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
