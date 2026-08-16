'use client';

import React, { useState, useMemo } from 'react';
import { Calculator, Info, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export function IncomeTaxCalculator(): JSX.Element {
  const [grossIncome, setGrossIncome] = useState<number>(1200000);
  const [isSalaried, setIsSalaried] = useState<boolean>(true);
  const [deduction80C, setDeduction80C] = useState<number>(150000);
  const [deduction80D, setDeduction80D] = useState<number>(25000);
  const [deduction80CCD, setDeduction80CCD] = useState<number>(50000);
  const [hraExemption, setHraExemption] = useState<number>(0);
  const [homeLoanInterest, setHomeLoanInterest] = useState<number>(0);

  const comparison = useMemo(() => {
    const income = Math.max(0, grossIncome || 0);

    // ==========================================
    // 1. NEW TAX REGIME (FY 2024-25 / FY 2025-26 under Section 115BAC)
    // ==========================================
    const newStdDeduction = isSalaried ? 75000 : 0;
    const newTaxableIncome = Math.max(0, income - newStdDeduction);

    let newTax = 0;
    // Slabs:
    // 0 - 3,00,000 : 0%
    // 3,00,001 - 7,00,000 : 5%
    // 7,00,001 - 10,00,000 : 10%
    // 10,00,001 - 12,00,000 : 15%
    // 12,00,001 - 15,00,000 : 20%
    // Above 15,00,000 : 30%
    if (newTaxableIncome > 1500000) {
      newTax += (newTaxableIncome - 1500000) * 0.3;
      newTax += 300000 * 0.2; // 12-15L
      newTax += 200000 * 0.15; // 10-12L
      newTax += 300000 * 0.1; // 7-10L
      newTax += 400000 * 0.05; // 3-7L
    } else if (newTaxableIncome > 1200000) {
      newTax += (newTaxableIncome - 1200000) * 0.2;
      newTax += 200000 * 0.15;
      newTax += 300000 * 0.1;
      newTax += 400000 * 0.05;
    } else if (newTaxableIncome > 1000000) {
      newTax += (newTaxableIncome - 1000000) * 0.15;
      newTax += 300000 * 0.1;
      newTax += 400000 * 0.05;
    } else if (newTaxableIncome > 700000) {
      newTax += (newTaxableIncome - 700000) * 0.1;
      newTax += 400000 * 0.05;
    } else if (newTaxableIncome > 300000) {
      newTax += (newTaxableIncome - 300000) * 0.05;
    }

    // Section 87A Rebate in New Regime: If taxable income <= ₹7,00,000, 100% tax rebate (Max ₹25,000)
    let newRebate = 0;
    if (newTaxableIncome <= 700000) {
      newRebate = newTax;
      newTax = 0;
    }

    const newCess = newTax * 0.04;
    const newTotalTax = newTax + newCess;

    // ==========================================
    // 2. OLD TAX REGIME
    // ==========================================
    const oldStdDeduction = isSalaried ? 50000 : 0;
    const capped80C = Math.min(150000, Math.max(0, deduction80C || 0));
    const capped80D = Math.min(100000, Math.max(0, deduction80D || 0));
    const capped80CCD = Math.min(50000, Math.max(0, deduction80CCD || 0));
    const cappedHomeLoan = Math.min(200000, Math.max(0, homeLoanInterest || 0));
    const validHra = Math.max(0, hraExemption || 0);

    const totalOldDeductions =
      oldStdDeduction +
      capped80C +
      capped80D +
      capped80CCD +
      cappedHomeLoan +
      validHra;

    const oldTaxableIncome = Math.max(0, income - totalOldDeductions);

    let oldTax = 0;
    // Old Slabs:
    // 0 - 2,50,000 : 0%
    // 2,50,001 - 5,00,000 : 5%
    // 5,00,001 - 10,00,000 : 20%
    // Above 10,00,000 : 30%
    if (oldTaxableIncome > 1000000) {
      oldTax += (oldTaxableIncome - 1000000) * 0.3;
      oldTax += 500000 * 0.2; // 5-10L
      oldTax += 250000 * 0.05; // 2.5-5L
    } else if (oldTaxableIncome > 500000) {
      oldTax += (oldTaxableIncome - 500000) * 0.2;
      oldTax += 250000 * 0.05;
    } else if (oldTaxableIncome > 250000) {
      oldTax += (oldTaxableIncome - 250000) * 0.05;
    }

    // Section 87A in Old Regime: Taxable income <= ₹5,00,000 -> Max ₹12,500 rebate
    let oldRebate = 0;
    if (oldTaxableIncome <= 500000) {
      oldRebate = oldTax;
      oldTax = 0;
    }

    const oldCess = oldTax * 0.04;
    const oldTotalTax = oldTax + oldCess;

    const betterRegime = newTotalTax <= oldTotalTax ? 'new' : 'old';
    const taxDifference = Math.abs(newTotalTax - oldTotalTax);

    return {
      newTaxableIncome,
      newStdDeduction,
      newTax,
      newCess,
      newTotalTax,
      newRebate,
      oldTaxableIncome,
      totalOldDeductions,
      oldTax,
      oldCess,
      oldTotalTax,
      oldRebate,
      betterRegime,
      taxDifference,
    };
  }, [
    grossIncome,
    isSalaried,
    deduction80C,
    deduction80D,
    deduction80CCD,
    hraExemption,
    homeLoanInterest,
  ]);

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(Math.round(val));
  };

  return (
    <div className="space-y-8">
      {/* Comparison Banner */}
      <div className={`rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md ${
        comparison.betterRegime === 'new' ? 'bg-[#1B2A4A]' : 'bg-slate-900'
      }`}>
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="inline-block rounded-full bg-emerald-400/20 px-2.5 py-0.5 text-xs font-bold text-emerald-300">
              Recommended
            </span>
            <span className="text-sm font-semibold">
              {comparison.betterRegime === 'new' ? 'New Tax Regime (Sec 115BAC)' : 'Old Tax Regime'} is More Beneficial
            </span>
          </div>
          <p className="text-xs text-slate-300">
            You will save{' '}
            <strong className="text-emerald-400 font-mono text-sm">
              {formatINR(comparison.taxDifference)}
            </strong>{' '}
            by filing under the {comparison.betterRegime === 'new' ? 'New Tax Regime' : 'Old Tax Regime'}.
          </p>
        </div>

        <Link href="/contact">
          <button className="rounded-lg bg-gradient-to-r from-[#8B3FA8] to-[#E8823A] px-5 py-2.5 text-xs font-bold text-white shadow hover:opacity-95 transition-opacity whitespace-nowrap">
            File ITR with CA Partner &rarr;
          </button>
        </Link>
      </div>

      {/* Input vs Side-by-side Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Controls Card */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Calculator className="h-5 w-5 text-[#8B3FA8]" /> Income &amp; Deductions
            </h3>

            <div className="flex rounded-lg bg-slate-100 p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setIsSalaried(true)}
                className={`rounded-md px-3 py-1 transition-all ${
                  isSalaried
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Salaried
              </button>
              <button
                type="button"
                onClick={() => setIsSalaried(false)}
                className={`rounded-md px-3 py-1 transition-all ${
                  !isSalaried
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Self-Employed / Business
              </button>
            </div>
          </div>

          {/* Gross Total Income */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
              Gross Annual Income / CTC
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-sm font-semibold text-slate-400">
                ₹
              </span>
              <input
                type="number"
                min="0"
                step="50000"
                value={grossIncome}
                onChange={(e) => setGrossIncome(parseFloat(e.target.value) || 0)}
                className="w-full rounded-lg border border-slate-300 bg-white pl-8 pr-4 py-2.5 text-base font-semibold text-slate-900 shadow-sm focus:border-[#1B2A4A] focus:outline-none focus:ring-1 focus:ring-[#1B2A4A]"
              />
            </div>
          </div>

          {/* Old Regime Deductions Group */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <p className="text-xs font-bold uppercase tracking-wider text-[#8B3FA8]">
              Old Regime Deductions (Chapter VI-A)
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">
                  Section 80C (PPF, EPF, ELSS, LIC)
                </label>
                <input
                  type="number"
                  max="150000"
                  value={deduction80C}
                  onChange={(e) => setDeduction80C(parseFloat(e.target.value) || 0)}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs shadow-sm focus:border-[#1B2A4A] focus:outline-none"
                />
                <span className="text-[10px] text-slate-400">Max limit: ₹1,50,000</span>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">
                  Section 80D (Health Insurance)
                </label>
                <input
                  type="number"
                  value={deduction80D}
                  onChange={(e) => setDeduction80D(parseFloat(e.target.value) || 0)}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs shadow-sm focus:border-[#1B2A4A] focus:outline-none"
                />
                <span className="text-[10px] text-slate-400">Self + Senior Parents</span>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">
                  Section 80CCD(1B) (NPS)
                </label>
                <input
                  type="number"
                  max="50000"
                  value={deduction80CCD}
                  onChange={(e) => setDeduction80CCD(parseFloat(e.target.value) || 0)}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs shadow-sm focus:border-[#1B2A4A] focus:outline-none"
                />
                <span className="text-[10px] text-slate-400">Additional NPS limit: ₹50,000</span>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">
                  Section 24(b) (Home Loan Interest)
                </label>
                <input
                  type="number"
                  max="200000"
                  value={homeLoanInterest}
                  onChange={(e) => setHomeLoanInterest(parseFloat(e.target.value) || 0)}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs shadow-sm focus:border-[#1B2A4A] focus:outline-none"
                />
                <span className="text-[10px] text-slate-400">Self-occupied max: ₹2,00,000</span>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-medium text-slate-700">
                  Section 10(13A) (HRA Exemption Claim)
                </label>
                <input
                  type="number"
                  value={hraExemption}
                  onChange={(e) => setHraExemption(parseFloat(e.target.value) || 0)}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs shadow-sm focus:border-[#1B2A4A] focus:outline-none"
                />
                <span className="text-[10px] text-slate-400">Exempt rent allowance under Rule 2A</span>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Side-by-Side Cards */}
        <div className="lg:col-span-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* New Regime Card */}
            <div className={`rounded-2xl border p-5 space-y-4 shadow-sm ${
              comparison.betterRegime === 'new'
                ? 'border-[#8B3FA8] bg-[#8B3FA8]/5 ring-2 ring-[#8B3FA8]/20'
                : 'border-slate-200 bg-white'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#8B3FA8] uppercase tracking-wider">
                  New Tax Regime
                </span>
                {comparison.betterRegime === 'new' && (
                  <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                    Saves {formatINR(comparison.taxDifference)}
                  </span>
                )}
              </div>

              <div className="border-b border-slate-200/60 pb-3">
                <p className="text-[11px] text-slate-500">Total Tax Payable</p>
                <p className="font-mono text-2xl font-extrabold text-slate-900 mt-0.5">
                  {formatINR(comparison.newTotalTax)}
                </p>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Standard Deduction:</span>
                  <span className="font-mono font-semibold text-slate-800">
                    {formatINR(comparison.newStdDeduction)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Taxable Income:</span>
                  <span className="font-mono font-semibold text-slate-800">
                    {formatINR(comparison.newTaxableIncome)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Section 87A Rebate:</span>
                  <span className="font-mono text-emerald-600 font-semibold">
                    - {formatINR(comparison.newRebate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Health &amp; Edu Cess (4%):</span>
                  <span className="font-mono">{formatINR(comparison.newCess)}</span>
                </div>
              </div>
            </div>

            {/* Old Regime Card */}
            <div className={`rounded-2xl border p-5 space-y-4 shadow-sm ${
              comparison.betterRegime === 'old'
                ? 'border-[#8B3FA8] bg-[#8B3FA8]/5 ring-2 ring-[#8B3FA8]/20'
                : 'border-slate-200 bg-white'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Old Tax Regime
                </span>
                {comparison.betterRegime === 'old' && (
                  <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                    Saves {formatINR(comparison.taxDifference)}
                  </span>
                )}
              </div>

              <div className="border-b border-slate-200/60 pb-3">
                <p className="text-[11px] text-slate-500">Total Tax Payable</p>
                <p className="font-mono text-2xl font-extrabold text-slate-900 mt-0.5">
                  {formatINR(comparison.oldTotalTax)}
                </p>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Total Deductions:</span>
                  <span className="font-mono font-semibold text-slate-800">
                    {formatINR(comparison.totalOldDeductions)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Taxable Income:</span>
                  <span className="font-mono font-semibold text-slate-800">
                    {formatINR(comparison.oldTaxableIncome)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Section 87A Rebate:</span>
                  <span className="font-mono text-emerald-600 font-semibold">
                    - {formatINR(comparison.oldRebate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Health &amp; Edu Cess (4%):</span>
                  <span className="font-mono">{formatINR(comparison.oldCess)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 space-y-2">
            <p className="font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600" /> Key Rule under Budget 2024 / 2025:
            </p>
            <p>
              In the New Tax Regime, salaried taxpayers enjoy an increased <strong>Standard Deduction of ₹75,000</strong> and full tax rebate under Section 87A up to taxable income of ₹7,00,000 (meaning zero tax up to ₹7.75 Lakhs gross income).
            </p>
          </div>
        </div>
      </div>

      {/* SEO Guide */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6">
        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Info className="h-5 w-5 text-[#8B3FA8]" /> Income Tax Slabs in India (FY 2024-25 &amp; FY 2025-26)
        </h3>

        <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            Individual taxpayers can choose between the default <strong>New Tax Regime (Section 115BAC)</strong> featuring concessional tax slabs without Chapter VI-A deductions, and the <strong>Old Tax Regime</strong> which allows deductions under Sections 80C, 80D, 24(b), and HRA.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
              <h4 className="font-bold text-slate-900">New Tax Regime Slabs (Default)</h4>
              <ul className="space-y-1 text-xs">
                <li>• Up to ₹3,00,000 : Nil</li>
                <li>• ₹3,00,001 - ₹7,00,000 : 5%</li>
                <li>• ₹7,00,001 - ₹10,00,000 : 10%</li>
                <li>• ₹10,00,001 - ₹12,00,000 : 15%</li>
                <li>• ₹12,00,001 - ₹15,00,000 : 20%</li>
                <li>• Above ₹15,00,000 : 30%</li>
              </ul>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
              <h4 className="font-bold text-slate-900">Old Tax Regime Slabs</h4>
              <ul className="space-y-1 text-xs">
                <li>• Up to ₹2,50,000 : Nil</li>
                <li>• ₹2,50,001 - ₹5,00,000 : 5%</li>
                <li>• ₹5,00,001 - ₹10,00,000 : 20%</li>
                <li>• Above ₹10,00,000 : 30%</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
