'use client';

import React, { useState, useMemo } from 'react';
import { Calculator, ArrowRight, Info } from 'lucide-react';
import Link from 'next/link';

interface TdsSection {
  id: string;
  section: string;
  name: string;
  description: string;
  individualRate: number;
  companyRate: number;
  threshold: number;
  thresholdDesc: string;
}

export function TdsCalculator(): JSX.Element {
  const sections: TdsSection[] = [
    {
      id: '194J_prof',
      section: 'Section 194J(a)',
      name: 'Fees for Professional Services',
      description: 'Medical, legal, CA, architectural, engineering, consulting services',
      individualRate: 10,
      companyRate: 10,
      threshold: 30000,
      thresholdDesc: '₹30,000 per financial year',
    },
    {
      id: '194J_tech',
      section: 'Section 194J(b)',
      name: 'Technical / Royalty Services / Call Center',
      description: 'Software programming, technical consulting, call center operations',
      individualRate: 2,
      companyRate: 2,
      threshold: 30000,
      thresholdDesc: '₹30,000 per financial year',
    },
    {
      id: '194C_contract',
      section: 'Section 194C',
      name: 'Payment to Contractors & Sub-contractors',
      description: 'Work contracts, manufacturing, transport, advertising',
      individualRate: 1,
      companyRate: 2,
      threshold: 30000,
      thresholdDesc: '₹30,000 single transaction / ₹1,00,000 aggregate/yr',
    },
    {
      id: '194I_building',
      section: 'Section 194I(a)',
      name: 'Rent on Land, Building or Furniture',
      description: 'Office rent, warehouse lease, residential premises for business',
      individualRate: 10,
      companyRate: 10,
      threshold: 240000,
      thresholdDesc: '₹2,40,000 per financial year',
    },
    {
      id: '194I_plant',
      section: 'Section 194I(b)',
      name: 'Rent on Plant & Machinery / Equipment',
      description: 'Factory equipment, commercial vehicles, generator hire',
      individualRate: 2,
      companyRate: 2,
      threshold: 240000,
      thresholdDesc: '₹2,40,000 per financial year',
    },
    {
      id: '194H_comm',
      section: 'Section 194H',
      name: 'Commission or Brokerage',
      description: 'Real estate brokerage, trade commission, distributor incentives',
      individualRate: 2,
      companyRate: 2,
      threshold: 15000,
      thresholdDesc: '₹15,000 per financial year',
    },
    {
      id: '194Q_goods',
      section: 'Section 194Q',
      name: 'Purchase of Goods (Buyer Turnover > ₹10 Cr)',
      description: 'Cumulative purchases from a seller exceeding ₹50 Lakhs in FY',
      individualRate: 0.1,
      companyRate: 0.1,
      threshold: 5000000,
      thresholdDesc: '₹50,00,000 aggregate in financial year',
    },
    {
      id: '194A_interest',
      section: 'Section 194A',
      name: 'Interest other than Interest on Securities',
      description: 'Loan interest, unsecured deposits, NBFC interest payouts',
      individualRate: 10,
      companyRate: 10,
      threshold: 5000,
      thresholdDesc: '₹5,000 (₹40k for banks / ₹50k senior citizens)',
    },
  ];

  const [selectedSectionId, setSelectedSectionId] = useState<string>('194J_prof');
  const [billAmount, setBillAmount] = useState<number>(50000);
  const [payeeType, setPayeeType] = useState<'individual' | 'company'>('individual');
  const [hasPan, setHasPan] = useState<boolean>(true);

  const selectedSection = sections.find((s) => s.id === selectedSectionId) || sections[0]!;

  const calculations = useMemo(() => {
    const rawAmount = Math.max(0, billAmount || 0);

    // Section 206AA: If payee does not provide PAN, standard rate is 20%
    let effectiveRate = 0;
    if (!hasPan) {
      effectiveRate = 20;
    } else {
      effectiveRate =
        payeeType === 'individual'
          ? selectedSection.individualRate
          : selectedSection.companyRate;
    }

    const isAboveThreshold = rawAmount >= selectedSection.threshold;
    const tdsAmount = (rawAmount * effectiveRate) / 100;
    const netPayable = rawAmount - tdsAmount;

    return {
      rawAmount,
      effectiveRate,
      tdsAmount,
      netPayable,
      isAboveThreshold,
    };
  }, [billAmount, payeeType, hasPan, selectedSection]);

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
        {/* Input Card */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4">
            <Calculator className="h-5 w-5 text-[#8B3FA8]" /> TDS Payment Parameters
          </h3>

          {/* Section dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
              Select Nature of Payment (Income Tax Section)
            </label>
            <select
              value={selectedSectionId}
              onChange={(e) => setSelectedSectionId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-900 shadow-sm focus:border-[#1B2A4A] focus:outline-none focus:ring-1 focus:ring-[#1B2A4A]"
            >
              {sections.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.section} — {s.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-500 pt-0.5">
              {selectedSection.description}
            </p>
          </div>

          {/* Amount input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
              Gross Invoice / Payment Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-sm font-semibold text-slate-400">
                ₹
              </span>
              <input
                type="number"
                min="0"
                step="1000"
                value={billAmount}
                onChange={(e) => setBillAmount(parseFloat(e.target.value) || 0)}
                className="w-full rounded-lg border border-slate-300 bg-white pl-8 pr-4 py-2.5 text-base font-semibold text-slate-900 shadow-sm focus:border-[#1B2A4A] focus:outline-none focus:ring-1 focus:ring-[#1B2A4A]"
              />
            </div>
          </div>

          {/* Payee Type & PAN Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Deductee (Payee) Entity Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPayeeType('individual')}
                  className={`rounded-lg py-2 text-xs font-bold border transition-all ${
                    payeeType === 'individual'
                      ? 'bg-[#1B2A4A] text-white border-[#1B2A4A]'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Individual / HUF
                </button>
                <button
                  type="button"
                  onClick={() => setPayeeType('company')}
                  className={`rounded-lg py-2 text-xs font-bold border transition-all ${
                    payeeType === 'company'
                      ? 'bg-[#1B2A4A] text-white border-[#1B2A4A]'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Company / Firm
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Payee PAN Furnished?
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setHasPan(true)}
                  className={`rounded-lg py-2 text-xs font-bold border transition-all ${
                    hasPan
                      ? 'bg-emerald-700 text-white border-emerald-700'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Yes (Valid PAN)
                </button>
                <button
                  type="button"
                  onClick={() => setHasPan(false)}
                  className={`rounded-lg py-2 text-xs font-bold border transition-all ${
                    !hasPan
                      ? 'bg-rose-700 text-white border-rose-700'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  No PAN (Sec 206AA)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8B3FA8]">
              TDS Computation
            </span>

            {/* TDS Highlight */}
            <div className="rounded-xl bg-[#1B2A4A] p-5 text-white space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>TDS to Deduct &amp; Deposit</span>
                <span className="font-mono bg-white/10 px-2 py-0.5 rounded text-[11px]">
                  Rate: {calculations.effectiveRate}%
                </span>
              </div>
              <p className="font-mono text-3xl font-extrabold text-[#E8823A]">
                {formatINR(calculations.tdsAmount)}
              </p>
            </div>

            {/* Breakdown Table */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between text-slate-600 border-b border-slate-100 pb-2">
                <span>Gross Invoice Amount:</span>
                <span className="font-semibold text-slate-900 font-mono">
                  {formatINR(calculations.rawAmount)}
                </span>
              </div>

              <div className="flex justify-between text-slate-600 border-b border-slate-100 pb-2">
                <span>Less: TDS Deducted:</span>
                <span className="font-semibold text-rose-600 font-mono">
                  - {formatINR(calculations.tdsAmount)}
                </span>
              </div>

              <div className="flex justify-between text-slate-900 font-bold border-b border-slate-100 pb-2">
                <span>Net Payment to Vendor:</span>
                <span className="font-mono text-emerald-700">
                  {formatINR(calculations.netPayable)}
                </span>
              </div>

              <div className="pt-2 text-[11px] text-slate-500 space-y-1">
                <div className="flex justify-between">
                  <span>Statutory Threshold:</span>
                  <span className="font-semibold text-slate-700">{selectedSection.thresholdDesc}</span>
                </div>
                <div className="flex justify-between">
                  <span>Challan Due Date:</span>
                  <span className="font-semibold text-slate-700">7th of Next Month</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/contact"
              className="flex items-center justify-center gap-2 rounded-lg bg-[#1B2A4A] py-3 px-4 text-xs font-semibold text-white hover:bg-[#1B2A4A]/90 transition-colors shadow"
            >
              Need Quarterly TDS Returns (24Q/26Q)? Contact CA <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* SEO Explanatory Guide */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6">
        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Info className="h-5 w-5 text-[#8B3FA8]" /> Key TDS Compliance Provisions in India
        </h3>

        <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            Tax Deducted at Source (TDS) is governed by the <strong>Income Tax Act, 1961</strong>. Any person making specified payments (such as professional fees, contractor work, rent, or brokerage) is obligated to deduct tax at source and deposit it with the Central Government.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
              <h4 className="font-bold text-slate-900">1. Section 206AA (Higher Rate)</h4>
              <p className="text-xs">
                If the payee fails to furnish a valid Permanent Account Number (PAN), TDS is mandatorily deducted at <strong>20%</strong> or twice the statutory rate, whichever is higher.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
              <h4 className="font-bold text-slate-900">2. Monthly Deposit Timeline</h4>
              <p className="text-xs">
                TDS deducted in any month must be deposited to the government treasury via <strong>Challan ITNS 281</strong> on or before the <strong>7th of the subsequent month</strong> (30th April for March deductions).
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
              <h4 className="font-bold text-slate-900">3. Quarterly Form 26Q / 24Q</h4>
              <p className="text-xs">
                Deductors must file quarterly returns on TRACES portal and issue <strong>Form 16A</strong> certificates to deductees within 15 days of filing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
