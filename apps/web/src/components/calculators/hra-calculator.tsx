'use client';

import React, { useState, useMemo } from 'react';
import { Calculator, ArrowRight, Info } from 'lucide-react';
import Link from 'next/link';

export function HraCalculator(): JSX.Element {
  const [basicSalary, setBasicSalary] = useState<number>(600000);
  const [dearnessAllowance, setDearnessAllowance] = useState<number>(0);
  const [hraReceived, setHraReceived] = useState<number>(240000);
  const [rentPaid, setRentPaid] = useState<number>(300000);
  const [isMetro, setIsMetro] = useState<boolean>(false);

  const calculations = useMemo(() => {
    const basic = Math.max(0, basicSalary || 0);
    const da = Math.max(0, dearnessAllowance || 0);
    const salaryForHra = basic + da;
    const actualHra = Math.max(0, hraReceived || 0);
    const rent = Math.max(0, rentPaid || 0);

    // Rule 2A: Least of the following three:
    // 1. Actual HRA received
    const cond1 = actualHra;

    // 2. 50% (Metro) or 40% (Non-Metro) of Salary
    const metroPercent = isMetro ? 0.5 : 0.4;
    const cond2 = salaryForHra * metroPercent;

    // 3. Rent paid minus 10% of Salary
    const tenPercentSalary = salaryForHra * 0.1;
    const cond3 = Math.max(0, rent - tenPercentSalary);

    const exemptHra = Math.min(cond1, cond2, cond3);
    const taxableHra = Math.max(0, actualHra - exemptHra);

    return {
      salaryForHra,
      actualHra,
      rent,
      cond1,
      cond2,
      cond3,
      exemptHra,
      taxableHra,
      metroPercent: isMetro ? 50 : 40,
    };
  }, [basicSalary, dearnessAllowance, hraReceived, rentPaid, isMetro]);

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
        {/* Input Card */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4">
            <Calculator className="h-5 w-5 text-[#8B3FA8]" /> Salary &amp; Rent Details (Annual)
          </h3>

          {/* Basic Salary */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
              Basic Salary (Annual)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-sm font-semibold text-slate-400">
                ₹
              </span>
              <input
                type="number"
                min="0"
                step="25000"
                value={basicSalary}
                onChange={(e) => setBasicSalary(parseFloat(e.target.value) || 0)}
                className="w-full rounded-lg border border-slate-300 bg-white pl-8 pr-4 py-2 text-sm font-semibold text-slate-900 shadow-sm focus:border-[#1B2A4A] focus:outline-none"
              />
            </div>
          </div>

          {/* Dearness Allowance */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
              Dearness Allowance (DA forming part of salary)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-sm font-semibold text-slate-400">
                ₹
              </span>
              <input
                type="number"
                min="0"
                step="10000"
                value={dearnessAllowance}
                onChange={(e) => setDearnessAllowance(parseFloat(e.target.value) || 0)}
                className="w-full rounded-lg border border-slate-300 bg-white pl-8 pr-4 py-2 text-sm font-semibold text-slate-900 shadow-sm focus:border-[#1B2A4A] focus:outline-none"
              />
            </div>
          </div>

          {/* HRA Received */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
              Actual HRA Received from Employer (Annual)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-sm font-semibold text-slate-400">
                ₹
              </span>
              <input
                type="number"
                min="0"
                step="10000"
                value={hraReceived}
                onChange={(e) => setHraReceived(parseFloat(e.target.value) || 0)}
                className="w-full rounded-lg border border-slate-300 bg-white pl-8 pr-4 py-2 text-sm font-semibold text-slate-900 shadow-sm focus:border-[#1B2A4A] focus:outline-none"
              />
            </div>
          </div>

          {/* Total Rent Paid */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
              Total Actual Rent Paid (Annual)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-sm font-semibold text-slate-400">
                ₹
              </span>
              <input
                type="number"
                min="0"
                step="10000"
                value={rentPaid}
                onChange={(e) => setRentPaid(parseFloat(e.target.value) || 0)}
                className="w-full rounded-lg border border-slate-300 bg-white pl-8 pr-4 py-2 text-sm font-semibold text-slate-900 shadow-sm focus:border-[#1B2A4A] focus:outline-none"
              />
            </div>
          </div>

          {/* City Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
              Accommodation City
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIsMetro(true)}
                className={`rounded-lg p-3 text-left border transition-all ${
                  isMetro
                    ? 'border-[#8B3FA8] bg-[#8B3FA8]/5 ring-1 ring-[#8B3FA8]'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <p className="text-xs font-bold text-slate-900">Metro City (50%)</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Mumbai, Delhi, Kolkata, Chennai</p>
              </button>

              <button
                type="button"
                onClick={() => setIsMetro(false)}
                className={`rounded-lg p-3 text-left border transition-all ${
                  !isMetro
                    ? 'border-[#8B3FA8] bg-[#8B3FA8]/5 ring-1 ring-[#8B3FA8]'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <p className="text-xs font-bold text-slate-900">Non-Metro City (40%)</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Bengaluru, Hyderabad, Kadiri, others</p>
              </button>
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8B3FA8]">
              Section 10(13A) Exemption Outcome
            </span>

            {/* Exempt HRA Highlight */}
            <div className="rounded-xl bg-[#1B2A4A] p-5 text-white space-y-1">
              <p className="text-xs text-slate-300">Total Tax-Exempt HRA Amount</p>
              <p className="font-mono text-3xl font-extrabold text-emerald-400">
                {formatINR(calculations.exemptHra)}
              </p>
              <p className="text-[11px] text-slate-300">
                Deductible from gross salary under the Old Tax Regime
              </p>
            </div>

            {/* Three Rule Conditions Table */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3 text-xs">
              <p className="font-bold text-slate-900 border-b border-slate-100 pb-2">
                Statutory Comparison (Least of 3 Limits):
              </p>

              <div className="flex justify-between text-slate-600">
                <span>1. Actual HRA Received:</span>
                <span className="font-mono font-semibold text-slate-900">{formatINR(calculations.cond1)}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>2. {calculations.metroPercent}% of (Basic + DA):</span>
                <span className="font-mono font-semibold text-slate-900">{formatINR(calculations.cond2)}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>3. Rent Paid &minus; 10% of Salary:</span>
                <span className="font-mono font-semibold text-slate-900">{formatINR(calculations.cond3)}</span>
              </div>

              <div className="border-t border-slate-100 pt-2 flex justify-between font-bold text-slate-900">
                <span>Taxable HRA Added to Income:</span>
                <span className="font-mono text-rose-600">{formatINR(calculations.taxableHra)}</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/contact"
              className="flex items-center justify-center gap-2 rounded-lg bg-[#1B2A4A] py-3 px-4 text-xs font-semibold text-white hover:bg-[#1B2A4A]/90 transition-colors shadow"
            >
              Need CA Assistance with ITR Filing &amp; HRA Proofs? <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* SEO Explanatory Guide */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6">
        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Info className="h-5 w-5 text-[#8B3FA8]" /> Provisions of Section 10(13A) &amp; Rule 2A
        </h3>

        <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            Salaried employees living in rented accommodation can claim tax exemption on House Rent Allowance (HRA) under <strong>Section 10(13A)</strong> read with <strong>Rule 2A</strong> of the Income Tax Rules, 1962.
          </p>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
            <h4 className="font-bold text-slate-900">Key Compliance Conditions:</h4>
            <ul className="space-y-1.5 text-xs text-slate-700">
              <li>• The employee must actually incur rent expenditure on a residential accommodation.</li>
              <li>• If annual rent paid exceeds <strong>₹1,00,000</strong>, the landlord&apos;s PAN must be reported in Form 12BB and the employer TDS return.</li>
              <li>• HRA exemption is exclusively available under the <strong>Old Tax Regime</strong> and is not available under the New Tax Regime (Section 115BAC).</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
