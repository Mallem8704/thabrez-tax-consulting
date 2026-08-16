'use client';

import React, { useState, useMemo } from 'react';
import { Calculator, ArrowRight, Info } from 'lucide-react';
import Link from 'next/link';

export function EmiCalculator(): JSX.Element {
  const [loanAmount, setLoanAmount] = useState<number>(2500000);
  const [interestRate, setInterestRate] = useState<number>(8.75);
  const [tenureYears, setTenureYears] = useState<number>(15);

  const calculations = useMemo(() => {
    const P = Math.max(0, loanAmount || 0);
    const annualR = Math.max(0, interestRate || 0);
    const r = annualR / 12 / 100;
    const n = Math.max(1, tenureYears * 12);

    let monthlyEmi = 0;
    if (r === 0) {
      monthlyEmi = P / n;
    } else {
      monthlyEmi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }

    const totalPayment = monthlyEmi * n;
    const totalInterest = Math.max(0, totalPayment - P);
    const interestRatio = totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 0;
    const principalRatio = totalPayment > 0 ? (P / totalPayment) * 100 : 0;

    // Generate annual amortization schedule preview (first 5 years)
    const schedule = [];
    let balance = P;
    for (let yr = 1; yr <= Math.min(10, tenureYears); yr++) {
      let yearlyInterest = 0;
      let yearlyPrincipal = 0;
      for (let m = 1; m <= 12; m++) {
        const intForMonth = balance * r;
        const princForMonth = monthlyEmi - intForMonth;
        yearlyInterest += intForMonth;
        yearlyPrincipal += princForMonth;
        balance = Math.max(0, balance - princForMonth);
      }
      schedule.push({
        year: yr,
        principal: yearlyPrincipal,
        interest: yearlyInterest,
        balance,
      });
    }

    return {
      monthlyEmi,
      totalPayment,
      totalInterest,
      interestRatio,
      principalRatio,
      schedule,
    };
  }, [loanAmount, interestRate, tenureYears]);

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
        {/* Controls Card */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4">
            <Calculator className="h-5 w-5 text-[#8B3FA8]" /> Loan Parameters
          </h3>

          {/* Quick presets */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
              Loan Type Presets
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { name: 'Home Loan', p: 3500000, r: 8.5, y: 20 },
                { name: 'Business Loan', p: 1500000, r: 11.5, y: 5 },
                { name: 'Personal Loan', p: 500000, r: 13.0, y: 4 },
                { name: 'Car Loan', p: 800000, r: 9.0, y: 5 },
              ].map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => {
                    setLoanAmount(preset.p);
                    setInterestRate(preset.r);
                    setTenureYears(preset.y);
                  }}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-center text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition-all"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Loan Amount Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Loan Amount
              </label>
              <span className="font-mono text-base font-bold text-slate-900">
                {formatINR(loanAmount)}
              </span>
            </div>
            <input
              type="range"
              min="100000"
              max="20000000"
              step="50000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1B2A4A]"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>₹1 Lakh</span>
              <span>₹1 Crore</span>
              <span>₹2 Crore</span>
            </div>
          </div>

          {/* Interest Rate Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Interest Rate (% p.a.)
              </label>
              <span className="font-mono text-base font-bold text-slate-900">
                {interestRate}%
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="25"
              step="0.25"
              value={interestRate}
              onChange={(e) => setInterestRate(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1B2A4A]"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>5%</span>
              <span>15%</span>
              <span>25%</span>
            </div>
          </div>

          {/* Tenure Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Loan Tenure (Years)
              </label>
              <span className="font-mono text-base font-bold text-slate-900">
                {tenureYears} Years ({tenureYears * 12} Months)
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="30"
              step="1"
              value={tenureYears}
              onChange={(e) => setTenureYears(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1B2A4A]"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>1 Year</span>
              <span>15 Years</span>
              <span>30 Years</span>
            </div>
          </div>
        </div>

        {/* Results Display */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8B3FA8]">
              Monthly Repayment Summary
            </span>

            {/* Monthly EMI Highlight */}
            <div className="rounded-xl bg-[#1B2A4A] p-5 text-white space-y-1">
              <p className="text-xs text-slate-300">Equated Monthly Installment (EMI)</p>
              <p className="font-mono text-3xl sm:text-4xl font-extrabold text-[#E8823A]">
                {formatINR(calculations.monthlyEmi)}
              </p>
              <p className="text-[11px] text-slate-300 pt-1">
                Payable monthly for {tenureYears * 12} consecutive installments
              </p>
            </div>

            {/* Total Interest & Principal Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700">Principal: {calculations.principalRatio.toFixed(1)}%</span>
                <span className="text-[#8B3FA8]">Interest: {calculations.interestRatio.toFixed(1)}%</span>
              </div>
              <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  style={{ width: `${calculations.principalRatio}%` }}
                  className="bg-[#1B2A4A]"
                />
                <div
                  style={{ width: `${calculations.interestRatio}%` }}
                  className="bg-gradient-to-r from-[#8B3FA8] to-[#E8823A]"
                />
              </div>
            </div>

            {/* Itemized Total Payment */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between text-slate-600 border-b border-slate-100 pb-2">
                <span>Principal Loan Amount:</span>
                <span className="font-semibold text-slate-900 font-mono">
                  {formatINR(loanAmount)}
                </span>
              </div>

              <div className="flex justify-between text-slate-600 border-b border-slate-100 pb-2">
                <span>Total Interest Payable:</span>
                <span className="font-semibold text-[#8B3FA8] font-mono">
                  {formatINR(calculations.totalInterest)}
                </span>
              </div>

              <div className="flex justify-between text-slate-900 font-bold pt-1">
                <span>Total Repayment (Principal + Interest):</span>
                <span className="font-mono text-[#1B2A4A]">
                  {formatINR(calculations.totalPayment)}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/contact"
              className="flex items-center justify-center gap-2 rounded-lg bg-[#1B2A4A] py-3 px-4 text-xs font-semibold text-white hover:bg-[#1B2A4A]/90 transition-colors shadow"
            >
              Need a Bankable Project Report / CMA Data? Consult CA <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Amortization Schedule Table Preview */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            Annual Loan Amortization Schedule (Initial Years)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="border-b border-slate-200 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-3">Year</th>
                <th className="px-6 py-3 text-right">Principal Repaid</th>
                <th className="px-6 py-3 text-right">Interest Paid</th>
                <th className="px-6 py-3 text-right">Closing Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-xs">
              {calculations.schedule.map((row) => (
                <tr key={row.year} className="hover:bg-slate-50/60">
                  <td className="px-6 py-3.5 font-bold text-slate-900">Year {row.year}</td>
                  <td className="px-6 py-3.5 text-right text-slate-800">{formatINR(row.principal)}</td>
                  <td className="px-6 py-3.5 text-right text-[#8B3FA8]">{formatINR(row.interest)}</td>
                  <td className="px-6 py-3.5 text-right text-slate-600">{formatINR(row.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SEO Explanatory Guide */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6">
        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Info className="h-5 w-5 text-[#8B3FA8]" /> Mathematical Formula for Loan EMI in India
        </h3>

        <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            An Equated Monthly Installment (EMI) represents the fixed payment amount made by a borrower to a financial lender at a specified date each calendar month.
          </p>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
            <h4 className="font-bold text-slate-900">Standard EMI Formula:</h4>
            <p className="font-mono text-xs sm:text-sm text-slate-800 bg-white p-3 rounded border border-slate-200">
              E = P &times; r &times; (1 + r)<sup>n</sup> / [ (1 + r)<sup>n</sup> - 1 ]
            </p>
            <ul className="space-y-1 text-xs text-slate-600 pt-1">
              <li>• <strong>E</strong> = Equated Monthly Installment (EMI)</li>
              <li>• <strong>P</strong> = Principal Loan Amount</li>
              <li>• <strong>r</strong> = Monthly Interest Rate (Annual Rate / 12 / 100)</li>
              <li>• <strong>n</strong> = Total Number of Monthly Installments (Tenure in Years &times; 12)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
