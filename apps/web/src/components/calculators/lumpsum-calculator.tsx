'use client';

import React, { useState, useMemo } from 'react';
import { Calculator, ArrowRight, Info } from 'lucide-react';
import Link from 'next/link';

export function LumpsumCalculator(): JSX.Element {
  const [totalInvestment, setTotalInvestment] = useState<number>(500000);
  const [expectedReturnRate, setExpectedReturnRate] = useState<number>(12);
  const [investmentYears, setInvestmentYears] = useState<number>(10);

  const calculations = useMemo(() => {
    const P = Math.max(0, totalInvestment || 0);
    const r = Math.max(0, expectedReturnRate || 0) / 100;
    const n = Math.max(1, investmentYears);

    const futureValue = P * Math.pow(1 + r, n);
    const totalGains = Math.max(0, futureValue - P);
    const investedRatio = futureValue > 0 ? (P / futureValue) * 100 : 0;
    const gainsRatio = futureValue > 0 ? (totalGains / futureValue) * 100 : 0;

    return {
      totalInvested: P,
      totalGains,
      futureValue,
      investedRatio,
      gainsRatio,
    };
  }, [totalInvestment, expectedReturnRate, investmentYears]);

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
        {/* Controls */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4">
            <Calculator className="h-5 w-5 text-[#8B3FA8]" /> Lumpsum Investment Parameters
          </h3>

          {/* Total Investment Amount */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Total One-Time Investment
              </label>
              <span className="font-mono text-base font-bold text-slate-900">
                {formatINR(totalInvestment)}
              </span>
            </div>
            <input
              type="range"
              min="10000"
              max="5000000"
              step="10000"
              value={totalInvestment}
              onChange={(e) => setTotalInvestment(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1B2A4A]"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>₹10,000</span>
              <span>₹25 Lakhs</span>
              <span>₹50 Lakhs</span>
            </div>
          </div>

          {/* Expected Return */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Expected Annual Return Rate (% p.a.)
              </label>
              <span className="font-mono text-base font-bold text-slate-900">
                {expectedReturnRate}%
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="30"
              step="0.5"
              value={expectedReturnRate}
              onChange={(e) => setExpectedReturnRate(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1B2A4A]"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>5% (Fixed Deposit)</span>
              <span>12% (Index Fund)</span>
              <span>20% (Equity)</span>
            </div>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Time Horizon (Years)
              </label>
              <span className="font-mono text-base font-bold text-slate-900">
                {investmentYears} Years
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="30"
              step="1"
              value={investmentYears}
              onChange={(e) => setInvestmentYears(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1B2A4A]"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>1 Year</span>
              <span>15 Years</span>
              <span>30 Years</span>
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8B3FA8]">
              Compound Growth Outcome
            </span>

            {/* Maturity Value Highlight */}
            <div className="rounded-xl bg-[#1B2A4A] p-5 text-white space-y-1">
              <p className="text-xs text-slate-300">Total Projected Corpus</p>
              <p className="font-mono text-3xl sm:text-4xl font-extrabold text-[#E8823A]">
                {formatINR(calculations.futureValue)}
              </p>
              <p className="text-[11px] text-slate-300">
                Compounded annually over {investmentYears} years
              </p>
            </div>

            {/* Proportion Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700">Principal: {calculations.investedRatio.toFixed(1)}%</span>
                <span className="text-emerald-700">Wealth Gained: {calculations.gainsRatio.toFixed(1)}%</span>
              </div>
              <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  style={{ width: `${calculations.investedRatio}%` }}
                  className="bg-[#1B2A4A]"
                />
                <div
                  style={{ width: `${calculations.gainsRatio}%` }}
                  className="bg-emerald-500"
                />
              </div>
            </div>

            {/* Breakdown Table */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between text-slate-600 border-b border-slate-100 pb-2">
                <span>Principal Invested:</span>
                <span className="font-semibold text-slate-900 font-mono">
                  {formatINR(calculations.totalInvested)}
                </span>
              </div>

              <div className="flex justify-between text-slate-600 border-b border-slate-100 pb-2">
                <span>Total Wealth Gained:</span>
                <span className="font-semibold text-emerald-700 font-mono">
                  + {formatINR(calculations.totalGains)}
                </span>
              </div>

              <div className="flex justify-between text-slate-900 font-bold pt-1">
                <span>Total Maturity Amount:</span>
                <span className="font-mono text-[#1B2A4A]">
                  {formatINR(calculations.futureValue)}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/contact"
              className="flex items-center justify-center gap-2 rounded-lg bg-[#1B2A4A] py-3 px-4 text-xs font-semibold text-white hover:bg-[#1B2A4A]/90 transition-colors shadow"
            >
              Consult CA for Corporate Treasury &amp; Tax Structuring <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* SEO Explanatory Guide */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6">
        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Info className="h-5 w-5 text-[#8B3FA8]" /> Compound Interest Formula for Lumpsum Investments
        </h3>

        <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            Lump sum investments benefit directly from the power of exponential compounding, where interest earns interest over the entire tenure.
          </p>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
            <h4 className="font-bold text-slate-900">Compound Growth Equation:</h4>
            <p className="font-mono text-xs sm:text-sm text-slate-800 bg-white p-3 rounded border border-slate-200">
              FV = P &times; (1 + r)<sup>n</sup>
            </p>
            <ul className="space-y-1 text-xs text-slate-600 pt-1">
              <li>• <strong>FV</strong> = Future Maturity Value</li>
              <li>• <strong>P</strong> = Principal Initial Lumpsum Deposit</li>
              <li>• <strong>r</strong> = Annual Interest / Return Rate (decimal)</li>
              <li>• <strong>n</strong> = Number of Years</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
