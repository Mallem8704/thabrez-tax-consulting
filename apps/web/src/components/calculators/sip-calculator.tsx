'use client';

import React, { useState, useMemo } from 'react';
import { Calculator, ArrowRight, Info } from 'lucide-react';
import Link from 'next/link';

export function SipCalculator(): JSX.Element {
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(10000);
  const [expectedReturnRate, setExpectedReturnRate] = useState<number>(12);
  const [investmentYears, setInvestmentYears] = useState<number>(10);

  const calculations = useMemo(() => {
    const P = Math.max(0, monthlyInvestment || 0);
    const annualR = Math.max(0, expectedReturnRate || 0);
    const i = annualR / 12 / 100;
    const n = Math.max(1, investmentYears * 12);

    let futureValue = 0;
    if (i === 0) {
      futureValue = P * n;
    } else {
      futureValue = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    }

    const totalInvested = P * n;
    const totalGains = Math.max(0, futureValue - totalInvested);
    const investedRatio = futureValue > 0 ? (totalInvested / futureValue) * 100 : 0;
    const gainsRatio = futureValue > 0 ? (totalGains / futureValue) * 100 : 0;

    return {
      totalInvested,
      totalGains,
      futureValue,
      investedRatio,
      gainsRatio,
    };
  }, [monthlyInvestment, expectedReturnRate, investmentYears]);

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
            <Calculator className="h-5 w-5 text-[#8B3FA8]" /> SIP Investment Parameters
          </h3>

          {/* Monthly Amount */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Monthly SIP Amount
              </label>
              <span className="font-mono text-base font-bold text-slate-900">
                {formatINR(monthlyInvestment)}
              </span>
            </div>
            <input
              type="range"
              min="500"
              max="200000"
              step="500"
              value={monthlyInvestment}
              onChange={(e) => setMonthlyInvestment(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1B2A4A]"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>₹500</span>
              <span>₹1 Lakh</span>
              <span>₹2 Lakh</span>
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
              <span>5% (Debt)</span>
              <span>12% (Nifty Index)</span>
              <span>20% (Midcap)</span>
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
              max="35"
              step="1"
              value={investmentYears}
              onChange={(e) => setInvestmentYears(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1B2A4A]"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>1 Year</span>
              <span>15 Years</span>
              <span>35 Years</span>
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8B3FA8]">
              Maturity Wealth Projection
            </span>

            {/* Maturity Value Highlight */}
            <div className="rounded-xl bg-[#1B2A4A] p-5 text-white space-y-1">
              <p className="text-xs text-slate-300">Expected Total Maturity Corpus</p>
              <p className="font-mono text-3xl sm:text-4xl font-extrabold text-[#E8823A]">
                {formatINR(calculations.futureValue)}
              </p>
              <p className="text-[11px] text-slate-300">
                At {expectedReturnRate}% annualized CAGR over {investmentYears} years
              </p>
            </div>

            {/* Proportion Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700">Invested: {calculations.investedRatio.toFixed(1)}%</span>
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
                <span>Total Amount Invested:</span>
                <span className="font-semibold text-slate-900 font-mono">
                  {formatINR(calculations.totalInvested)}
                </span>
              </div>

              <div className="flex justify-between text-slate-600 border-b border-slate-100 pb-2">
                <span>Estimated Capital Gains:</span>
                <span className="font-semibold text-emerald-700 font-mono">
                  + {formatINR(calculations.totalGains)}
                </span>
              </div>

              <div className="flex justify-between text-slate-900 font-bold pt-1">
                <span>Total Projected Value:</span>
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
              Tax Planning on Mutual Fund Capital Gains? Consult CA <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* SEO Explanatory Guide */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6">
        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Info className="h-5 w-5 text-[#8B3FA8]" /> Mathematical Formula for Systematic Investment Plan (SIP)
        </h3>

        <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            A Systematic Investment Plan (SIP) operates on the principle of regular periodic compounding and rupee-cost averaging.
          </p>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
            <h4 className="font-bold text-slate-900">Compound SIP Annuity Formula:</h4>
            <p className="font-mono text-xs sm:text-sm text-slate-800 bg-white p-3 rounded border border-slate-200">
              FV = P &times; [ (1 + i)<sup>n</sup> - 1 ] / i &times; (1 + i)
            </p>
            <ul className="space-y-1 text-xs text-slate-600 pt-1">
              <li>• <strong>FV</strong> = Future Value / Maturity Corpus</li>
              <li>• <strong>P</strong> = Monthly SIP installment</li>
              <li>• <strong>i</strong> = Periodic compound interest rate per month (r / 12 / 100)</li>
              <li>• <strong>n</strong> = Total number of monthly installments</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
