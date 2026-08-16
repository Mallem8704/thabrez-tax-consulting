'use client';

import React, { useState, useMemo } from 'react';
import { Calculator, ArrowRight, CheckCircle2, Info } from 'lucide-react';
import Link from 'next/link';

export function GstCalculator(): JSX.Element {
  const [amount, setAmount] = useState<number>(10000);
  const [rate, setRate] = useState<number>(18);
  const [isInclusive, setIsInclusive] = useState<boolean>(false);
  const [supplyType, setSupplyType] = useState<'intra' | 'inter'>('intra');

  const calculations = useMemo(() => {
    const rawAmount = Math.max(0, amount || 0);
    const gstRate = rate / 100;

    let baseAmount = 0;
    let gstAmount = 0;
    let totalAmount = 0;

    if (isInclusive) {
      // Amount includes GST: Base = Total / (1 + Rate)
      totalAmount = rawAmount;
      baseAmount = rawAmount / (1 + gstRate);
      gstAmount = totalAmount - baseAmount;
    } else {
      // Amount is exclusive of GST: GST = Base * Rate
      baseAmount = rawAmount;
      gstAmount = rawAmount * gstRate;
      totalAmount = baseAmount + gstAmount;
    }

    const cgst = supplyType === 'intra' ? gstAmount / 2 : 0;
    const sgst = supplyType === 'intra' ? gstAmount / 2 : 0;
    const igst = supplyType === 'inter' ? gstAmount : 0;

    return {
      baseAmount,
      gstAmount,
      totalAmount,
      cgst,
      sgst,
      igst,
    };
  }, [amount, rate, isInclusive, supplyType]);

  const standardRates = [0, 5, 12, 18, 28];

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(val);
  };

  return (
    <div className="space-y-8">
      {/* Calculator Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Controls Card */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Calculator className="h-5 w-5 text-[#8B3FA8]" /> GST Inputs
            </h3>
            {/* Toggle Inclusive / Exclusive */}
            <div className="flex rounded-lg bg-slate-100 p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setIsInclusive(false)}
                className={`rounded-md px-3 py-1 transition-all ${
                  !isInclusive
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                GST Exclusive
              </button>
              <button
                type="button"
                onClick={() => setIsInclusive(true)}
                className={`rounded-md px-3 py-1 transition-all ${
                  isInclusive
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                GST Inclusive
              </button>
            </div>
          </div>

          {/* Amount input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
              {isInclusive ? 'Total Invoice Amount (Incl. GST)' : 'Net Base Amount (Excl. GST)'}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-sm font-semibold text-slate-400">
                ₹
              </span>
              <input
                type="number"
                min="0"
                step="100"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className="w-full rounded-lg border border-slate-300 bg-white pl-8 pr-4 py-2.5 text-base font-semibold text-slate-900 shadow-sm focus:border-[#1B2A4A] focus:outline-none focus:ring-1 focus:ring-[#1B2A4A]"
              />
            </div>
          </div>

          {/* Slabs Buttons */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
              Applicable GST Slab
            </label>
            <div className="grid grid-cols-5 gap-2">
              {standardRates.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRate(r)}
                  className={`rounded-lg py-2 text-xs font-bold transition-all border ${
                    rate === r
                      ? 'bg-[#1B2A4A] text-white border-[#1B2A4A] shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {r}%
                </button>
              ))}
            </div>
          </div>

          {/* Supply Type */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
              Supply Location (Tax Split)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSupplyType('intra')}
                className={`rounded-lg p-3 text-left border transition-all ${
                  supplyType === 'intra'
                    ? 'border-[#8B3FA8] bg-[#8B3FA8]/5 ring-1 ring-[#8B3FA8]'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <p className="text-xs font-bold text-slate-900">Intra-State Supply</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Within same state (CGST + SGST)</p>
              </button>
              <button
                type="button"
                onClick={() => setSupplyType('inter')}
                className={`rounded-lg p-3 text-left border transition-all ${
                  supplyType === 'inter'
                    ? 'border-[#8B3FA8] bg-[#8B3FA8]/5 ring-1 ring-[#8B3FA8]'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <p className="text-xs font-bold text-slate-900">Inter-State Supply</p>
                <p className="text-[11px] text-slate-500 mt-0.5">To another state/UT (IGST)</p>
              </button>
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8B3FA8]">
              Computation Breakdown
            </span>

            {/* Total Highlight */}
            <div className="rounded-xl bg-[#1B2A4A] p-5 text-white space-y-1">
              <p className="text-xs text-slate-300">Total Gross Invoice Value</p>
              <p className="font-mono text-3xl font-extrabold text-white">
                {formatINR(calculations.totalAmount)}
              </p>
            </div>

            {/* Itemized Table */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between text-slate-600 border-b border-slate-100 pb-2">
                <span>Net Taxable (Base) Amount:</span>
                <span className="font-semibold text-slate-900 font-mono">
                  {formatINR(calculations.baseAmount)}
                </span>
              </div>

              <div className="flex justify-between text-slate-600 border-b border-slate-100 pb-2">
                <span>Total GST ({rate}%):</span>
                <span className="font-semibold text-[#8B3FA8] font-mono">
                  {formatINR(calculations.gstAmount)}
                </span>
              </div>

              {supplyType === 'intra' ? (
                <>
                  <div className="flex justify-between text-slate-600 pl-4 border-b border-slate-100 pb-2 text-xs">
                    <span>• Central GST (CGST @ {rate / 2}%):</span>
                    <span className="font-mono text-slate-700">
                      {formatINR(calculations.cgst)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600 pl-4 border-b border-slate-100 pb-2 text-xs">
                    <span>• State GST (SGST @ {rate / 2}%):</span>
                    <span className="font-mono text-slate-700">
                      {formatINR(calculations.sgst)}
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between text-slate-600 pl-4 border-b border-slate-100 pb-2 text-xs">
                  <span>• Integrated GST (IGST @ {rate}%):</span>
                  <span className="font-mono text-slate-700">
                    {formatINR(calculations.igst)}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-slate-900 font-bold pt-1">
                <span>Final Payable Amount:</span>
                <span className="font-mono text-[#1B2A4A]">
                  {formatINR(calculations.totalAmount)}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/contact"
              className="flex items-center justify-center gap-2 rounded-lg bg-[#1B2A4A] py-3 px-4 text-xs font-semibold text-white hover:bg-[#1B2A4A]/90 transition-colors shadow"
            >
              Need Help with Monthly GST Returns? Speak to a CA <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* SEO Explanatory Guide */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6">
        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Info className="h-5 w-5 text-[#8B3FA8]" /> How Indian GST is Calculated
        </h3>

        <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            Under the <strong>Central Goods and Services Tax (CGST) Act, 2017</strong> and <strong>Integrated Goods and Services Tax (IGST) Act, 2017</strong>, the Goods and Services Tax in India is destination-based and applied across standard slabs: <strong>0%, 5%, 12%, 18%, and 28%</strong>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
              <h4 className="font-bold text-slate-900">1. GST Exclusive Formula</h4>
              <p className="text-xs font-mono text-slate-700 bg-white p-2 rounded border border-slate-200">
                GST Amount = (Base Price &times; GST Rate) / 100
              </p>
              <p className="text-xs">
                Total Price = Base Price + GST Amount
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
              <h4 className="font-bold text-slate-900">2. GST Inclusive Formula</h4>
              <p className="text-xs font-mono text-slate-700 bg-white p-2 rounded border border-slate-200">
                GST Amount = Total Amount - [Total Amount / (1 + (GST Rate / 100))]
              </p>
              <p className="text-xs">
                Base Price = Total Amount - GST Amount
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <h4 className="font-bold text-slate-900">Intra-State vs Inter-State Tax Rules:</h4>
            <ul className="space-y-1 text-xs">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Intra-State Supply:</strong> If the supplier and recipient are in the same state, the GST amount is divided equally into 50% CGST (Central Government) and 50% SGST (State Government).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Inter-State Supply:</strong> If goods or services are supplied across state borders, 100% of the tax is levied as IGST (Integrated GST).</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
