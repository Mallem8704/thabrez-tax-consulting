import type { Metadata } from 'next';
import Link from 'next/link';
import { Header, Footer } from '@thabrez/ui';
import { EmiCalculator } from '../../../components/calculators/emi-calculator';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Loan EMI Calculator — Home, Business & Personal Loans | Thabrez Tax Consulting',
  description:
    'Calculate monthly EMI, total interest, and annual loan amortization schedule for Home Loans, Business Loans, and Personal Loans in India.',
  keywords: ['Loan EMI Calculator', 'Home Loan EMI Calculator', 'Business Loan EMI Calculator', 'Loan Amortization Schedule India'],
  openGraph: {
    title: 'Loan EMI Calculator — Accurate Monthly Installment Estimator',
    description: 'Calculate monthly loan EMI and total interest payable with amortization schedule.',
    type: 'website',
  },
};

export default function EmiCalculatorPage(): JSX.Element {
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
              Loan EMI Calculator
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl">
              Calculate Equated Monthly Installments (EMI), interest cost, and annual repayment schedule for any bank loan.
            </p>
          </div>
        </section>

        {/* Interactive Component */}
        <section className="py-12 sm:py-16 bg-slate-50">
          <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <EmiCalculator />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
