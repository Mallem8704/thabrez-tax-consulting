'use client';

import React, { useState, useMemo } from 'react';
import { ArrowRight, TrendingUp, Wallet, Info } from 'lucide-react';
import Link from 'next/link';

export function NetWorthCalculator(): JSX.Element {
  // Assets
  const [realEstate, setRealEstate] = useState<number>(7500000);
  const [cashBank, setCashBank] = useState<number>(500000);
  const [equities, setEquities] = useState<number>(1800000);
  const [gold, setGold] = useState<number>(600000);
  const [retirement, setRetirement] = useState<number>(1200000);
  const [businessEquity, setBusinessEquity] = useState<number>(1000000);

  // Liabilities
  const [homeLoan, setHomeLoan] = useState<number>(3000000);
  const [personalLoan, setPersonalLoan] = useState<number>(200000);
  const [carLoan, setCarLoan] = useState<number>(400000);
  const [creditCardDues, setCreditCardDues] = useState<number>(50000);

  const calculations = useMemo(() => {
    const totalAssets =
      (realEstate || 0) +
      (cashBank || 0) +
      (equities || 0) +
      (gold || 0) +
      (retirement || 0) +
      (businessEquity || 0);

    const totalLiabilities =
      (homeLoan || 0) +
      (personalLoan || 0) +
      (carLoan || 0) +
      (creditCardDues || 0);

    const netWorth = totalAssets - totalLiabilities;
    const debtToAssetRatio = totalAssets > 0 ? (totalLiabilities / totalAssets) * 100 : 0;

    return {
      totalAssets,
      totalLiabilities,
      netWorth,
      debtToAssetRatio,
    };
  }, [
    realEstate,
    cashBank,
    equities,
    gold,
    retirement,
    businessEquity,
    homeLoan,
    personalLoan,
    carLoan,
    creditCardDues,
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
      {/* Calculator Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Assets & Liabilities Form */}
        <div className="lg:col-span-7 space-y-6">
          {/* Assets Box */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <TrendingUp className="h-5 w-5 text-emerald-600" /> 1. Assets Portfolio
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Real Estate (Market Value)</label>
                <input
                  type="number"
                  value={realEstate}
                  onChange={(e) => setRealEstate(parseFloat(e.target.value) || 0)}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold shadow-sm focus:border-[#1B2A4A] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Equities, Mutual Funds &amp; Stocks</label>
                <input
                  type="number"
                  value={equities}
                  onChange={(e) => setEquities(parseFloat(e.target.value) || 0)}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold shadow-sm focus:border-[#1B2A4A] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Cash, FDs &amp; Savings Balance</label>
                <input
                  type="number"
                  value={cashBank}
                  onChange={(e) => setCashBank(parseFloat(e.target.value) || 0)}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold shadow-sm focus:border-[#1B2A4A] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Gold &amp; Precious Metals</label>
                <input
                  type="number"
                  value={gold}
                  onChange={(e) => setGold(parseFloat(e.target.value) || 0)}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold shadow-sm focus:border-[#1B2A4A] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">EPF, PPF, NPS &amp; Gratuity</label>
                <input
                  type="number"
                  value={retirement}
                  onChange={(e) => setRetirement(parseFloat(e.target.value) || 0)}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold shadow-sm focus:border-[#1B2A4A] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Business / Private Equity Value</label>
                <input
                  type="number"
                  value={businessEquity}
                  onChange={(e) => setBusinessEquity(parseFloat(e.target.value) || 0)}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold shadow-sm focus:border-[#1B2A4A] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Liabilities Box */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Wallet className="h-5 w-5 text-rose-600" /> 2. Total Outstanding Liabilities
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Home Loan Outstanding</label>
                <input
                  type="number"
                  value={homeLoan}
                  onChange={(e) => setHomeLoan(parseFloat(e.target.value) || 0)}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold shadow-sm focus:border-[#1B2A4A] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Personal / Education Loan</label>
                <input
                  type="number"
                  value={personalLoan}
                  onChange={(e) => setPersonalLoan(parseFloat(e.target.value) || 0)}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold shadow-sm focus:border-[#1B2A4A] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Vehicle Loan Balance</label>
                <input
                  type="number"
                  value={carLoan}
                  onChange={(e) => setCarLoan(parseFloat(e.target.value) || 0)}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold shadow-sm focus:border-[#1B2A4A] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Credit Card &amp; Other Dues</label>
                <input
                  type="number"
                  value={creditCardDues}
                  onChange={(e) => setCreditCardDues(parseFloat(e.target.value) || 0)}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold shadow-sm focus:border-[#1B2A4A] focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8B3FA8]">
              Personal Balance Sheet
            </span>

            {/* Total Net Worth Highlight */}
            <div className="rounded-xl bg-[#1B2A4A] p-5 text-white space-y-1">
              <p className="text-xs text-slate-300">Total Net Worth</p>
              <p className="font-mono text-3xl sm:text-4xl font-extrabold text-[#E8823A]">
                {formatINR(calculations.netWorth)}
              </p>
              <p className="text-[11px] text-slate-300">
                Assets minus Liabilities
              </p>
            </div>

            {/* Balance Sheet Summary */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between text-slate-600 border-b border-slate-100 pb-2">
                <span>Total Assets:</span>
                <span className="font-semibold text-emerald-700 font-mono">
                  {formatINR(calculations.totalAssets)}
                </span>
              </div>

              <div className="flex justify-between text-slate-600 border-b border-slate-100 pb-2">
                <span>Total Liabilities:</span>
                <span className="font-semibold text-rose-600 font-mono">
                  - {formatINR(calculations.totalLiabilities)}
                </span>
              </div>

              <div className="flex justify-between text-slate-700 pt-1">
                <span>Debt-to-Asset Ratio:</span>
                <span className={`font-mono font-bold ${
                  calculations.debtToAssetRatio > 40 ? 'text-amber-600' : 'text-emerald-700'
                }`}>
                  {calculations.debtToAssetRatio.toFixed(1)}% ({calculations.debtToAssetRatio > 40 ? 'Moderate Leverage' : 'Healthy Leverage'})
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/contact"
              className="flex items-center justify-center gap-2 rounded-lg bg-[#1B2A4A] py-3 px-4 text-xs font-semibold text-white hover:bg-[#1B2A4A]/90 transition-colors shadow"
            >
              Need Wealth Planning &amp; Estate Advisory? Consult CA <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* SEO Explanatory Guide */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6">
        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Info className="h-5 w-5 text-[#8B3FA8]" /> Why Calculate Your Net Worth in India?
        </h3>

        <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            Your net worth is the single most definitive metric of financial health and creditworthiness. It is required by Indian banks for high-value business loans, visa applications, and estate wealth planning.
          </p>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
            <h4 className="font-bold text-slate-900">CA Net Worth Certificate:</h4>
            <p className="text-xs">
              For immigration, international visa stamping (e.g. US, UK, Canada, Australia), or banking credit limits, our Chartered Accountants issue certified <strong>CA Net Worth Certificates</strong> with statutory UDIN (Unique Document Identification Number).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
