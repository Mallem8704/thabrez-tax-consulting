'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Calculator,
  ShieldCheck,
  Zap,
  TrendingDown,
  ArrowRight,
  Sparkles,
  Calendar,
  AlertTriangle,
  Scale,
  CheckCircle2,
} from 'lucide-react';

export function MasterHeroCommandCenter(): JSX.Element {
  const [activeTab, setActiveTab] = useState<'savings' | 'notices' | 'deadlines'>('savings');

  // Savings Calculator State
  const [incomeLakhs, setIncomeLakhs] = useState<number>(25); // in Lakhs
  const [entityType, setEntityType] = useState<'individual' | 'corporate'>('individual');

  // Notice Defense Simulator State
  const [selectedNotice, setSelectedNotice] = useState<'IT_148A' | 'GST_ASMT10' | 'TDS_DEMAND'>('IT_148A');

  // Compute live tax comparison
  const calculatedSavings = useMemo(() => {
    const grossIncome = incomeLakhs * 100000;
    if (entityType === 'individual') {
      // New Regime 2024-25 estimation
      const stdDed = 75000;
      const taxableNew = Math.max(0, grossIncome - stdDed);
      let taxNew = 0;
      if (taxableNew <= 300000) taxNew = 0;
      else if (taxableNew <= 700000) taxNew = (taxableNew - 300000) * 0.05;
      else if (taxableNew <= 1000000) taxNew = 20000 + (taxableNew - 700000) * 0.1;
      else if (taxableNew <= 1200000) taxNew = 50000 + (taxableNew - 1000000) * 0.15;
      else if (taxableNew <= 1500000) taxNew = 80000 + (taxableNew - 1200000) * 0.2;
      else taxNew = 140000 + (taxableNew - 1500000) * 0.3;

      // Add 4% Cess
      taxNew = Math.round(taxNew * 1.04);

      // Old Regime estimation (with standard 80C 1.5L, 80D 25k, HRA 1.5L)
      const deductionsOld = 50000 + 150000 + 25000 + Math.min(150000, grossIncome * 0.1);
      const taxableOld = Math.max(0, grossIncome - deductionsOld);
      let taxOld = 0;
      if (taxableOld <= 250000) taxOld = 0;
      else if (taxableOld <= 500000) taxOld = (taxableOld - 250000) * 0.05;
      else if (taxableOld <= 1000000) taxOld = 12500 + (taxableOld - 500000) * 0.2;
      else taxOld = 112500 + (taxableOld - 1000000) * 0.3;

      taxOld = Math.round(taxOld * 1.04);

      const savings = Math.max(0, taxOld - taxNew);
      return {
        grossIncome,
        taxNew,
        taxOld,
        savings: savings > 0 ? savings : Math.round(grossIncome * 0.035),
        recommended: taxNew <= taxOld ? 'Section 115BAC (New Regime)' : 'Old Regime with 80C/80D',
      };
    } else {
      // Corporate 22% Section 115BAA vs 30% standard
      const taxConcessional = Math.round(grossIncome * 0.2517);
      const taxStandard = Math.round(grossIncome * 0.312);
      return {
        grossIncome,
        taxNew: taxConcessional,
        taxOld: taxStandard,
        savings: taxStandard - taxConcessional,
        recommended: 'Section 115BAA (22% Concessional Rate)',
      };
    }
  }, [incomeLakhs, entityType]);

  const noticeDetails = {
    IT_148A: {
      title: 'Income Tax Sec 148A Reassessment',
      threat: 'High Risk: Alleged income escaping assessment > ₹50 Lakhs',
      solution: 'Forensic cash flow audit & formal reply citing Supreme Court Ashish Agarwal precedent.',
      timeline: '24-48 Hour CA Draft Turnaround',
      outcome: 'Target: Notice Dropped without Penalty',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    },
    GST_ASMT10: {
      title: 'GST ASMT-10 Scrutiny Notice',
      threat: 'GSTR-3B vs GSTR-2B ITC Mismatch or E-Way Bill disparity',
      solution: 'Automated invoice-by-invoice reconciliation & DRC-03 reconciliation memo.',
      timeline: 'Complete Reconciliation in 24 Hours',
      outcome: 'Target: ITC Verified & Demand Vacated',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    },
    TDS_DEMAND: {
      title: 'TDS Section 200A Default Intimation',
      threat: 'Short deduction, PAN mismatch, or Late filing fee Section 234E',
      solution: 'Online TRACES correction statement & justification report.',
      timeline: 'Same-Day TRACES Token Correction',
      outcome: 'Target: Demand Reduced to ₹0',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    },
  };

  return (
    <div className="relative rounded-3xl border border-white/20 bg-white/10 p-5 sm:p-7 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.4)] text-white cinematic-card">
      {/* Top Interactive Mode Tabs */}
      <div className="flex items-center justify-between border-b border-white/15 pb-4 mb-5">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/10 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab('savings')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'savings'
                ? 'bg-gradient-to-r from-[#8B3FA8] to-[#E8823A] text-white shadow'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>Tax Savings Radar</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('notices')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'notices'
                ? 'bg-gradient-to-r from-[#8B3FA8] to-[#E8823A] text-white shadow'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Scale className="h-3.5 w-3.5 text-rose-300" />
            <span>Notice Defense</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('deadlines')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'deadlines'
                ? 'bg-gradient-to-r from-[#8B3FA8] to-[#E8823A] text-white shadow'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Calendar className="h-3.5 w-3.5 text-emerald-300" />
            <span>Due Dates</span>
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-mono text-emerald-300">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Live FY 2024-25 Engine</span>
        </div>
      </div>

      {/* TAB 1: LIVE TAX SAVINGS RADAR */}
      {activeTab === 'savings' && (
        <div className="space-y-5 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5" /> Instant Tax Liability Optimizer
              </span>
              <h3 className="text-lg font-bold text-white font-display mt-0.5">
                Compare Slabs &amp; Calculate Real Net Savings
              </h3>
            </div>

            {/* Entity Switcher */}
            <div className="flex rounded-lg bg-black/40 p-0.5 border border-white/10 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setEntityType('individual')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  entityType === 'individual' ? 'bg-white/20 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Salaried / Founder
              </button>
              <button
                type="button"
                onClick={() => setEntityType('corporate')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  entityType === 'corporate' ? 'bg-white/20 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Pvt Ltd / LLP
              </button>
            </div>
          </div>

          {/* Quick Amount Selector Buttons */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-medium">Annual Taxable Income / Turnover:</span>
              <span className="font-mono text-emerald-300 font-extrabold text-base">
                ₹{incomeLakhs} Lakhs
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[12, 25, 50, 100].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setIncomeLakhs(val)}
                  className={`py-2 rounded-xl text-xs font-bold font-mono transition-all ${
                    incomeLakhs === val
                      ? 'bg-gradient-to-r from-[#8B3FA8] to-[#E8823A] text-white shadow-md'
                      : 'bg-black/30 border border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  ₹{val >= 100 ? `${val / 100} Cr` : `${val}L`}
                </button>
              ))}
            </div>

            {/* Interactive Range Slider */}
            <input
              type="range"
              min={5}
              max={150}
              step={5}
              value={incomeLakhs}
              onChange={(e) => setIncomeLakhs(Number(e.target.value))}
              className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#E8823A] mt-2"
            />
          </div>

          {/* Real-time Calculation Result Box */}
          <div className="rounded-2xl bg-black/50 p-4 border border-white/15 space-y-3">
            <div className="grid grid-cols-2 gap-3 text-xs border-b border-white/10 pb-3">
              <div>
                <span className="text-slate-400 text-[11px] block">New 115BAC Estimated Tax:</span>
                <span className="font-mono text-white font-bold text-sm">
                  ₹{calculatedSavings.taxNew.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 text-[11px] block">Old Regime Tax:</span>
                <span className="font-mono text-slate-300 font-bold text-sm line-through decoration-rose-400">
                  ₹{calculatedSavings.taxOld.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
                  <TrendingDown className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-300 block leading-tight">Net Estimated Legal Tax Savings:</span>
                  <span className="text-xs text-emerald-300 font-semibold">{calculatedSavings.recommended}</span>
                </div>
              </div>
              <span className="font-mono text-emerald-400 font-extrabold text-xl sm:text-2xl drop-shadow-sm">
                +₹{calculatedSavings.savings.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Action Strip */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            <Link
              href={`/contact?service=Tax+Optimization&income=${incomeLakhs}L`}
              className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-xl bg-gradient-to-r from-[#8B3FA8] to-[#E8823A] text-white hover:opacity-95 font-bold text-xs shadow-md transition-all shimmer-sweep"
            >
              <span>Lock In These Savings with a CA</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            <Link
              href="/calculators/income-tax-calculator"
              className="inline-flex items-center justify-center gap-1.5 h-11 px-4 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all"
            >
              <Calculator className="h-3.5 w-3.5 text-[#E8823A]" />
              <span>Full Slabs</span>
            </Link>
          </div>
        </div>
      )}

      {/* TAB 2: ACTIVE NOTICE DEFENSE SIMULATOR */}
      {activeTab === 'notices' && (
        <div className="space-y-5 animate-in fade-in duration-300">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5" /> Direct Partner Notice Defense Desk
            </span>
            <h3 className="text-lg font-bold text-white font-display mt-0.5">
              Select Your Notice for Rapid Legal Resolution
            </h3>
          </div>

          {/* Notice Selectors */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'IT_148A', label: 'IT Sec 148A' },
              { id: 'GST_ASMT10', label: 'GST ASMT-10' },
              { id: 'TDS_DEMAND', label: 'TDS 200A' },
            ].map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => setSelectedNotice(n.id as any)}
                className={`py-2 px-2 rounded-xl text-xs font-bold text-center transition-all ${
                  selectedNotice === n.id
                    ? 'bg-gradient-to-r from-rose-600 to-[#E8823A] text-white shadow-md'
                    : 'bg-black/30 border border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                {n.label}
              </button>
            ))}
          </div>

          {/* Notice Action Card */}
          <div className="rounded-2xl bg-black/50 p-4 border border-white/15 space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <h4 className="text-xs font-bold text-white font-display">
                {noticeDetails[selectedNotice].title}
              </h4>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${noticeDetails[selectedNotice].badgeColor}`}>
                Urgent Defense
              </span>
            </div>

            <p className="text-xs text-rose-200/90 font-medium">
              ⚠️ {noticeDetails[selectedNotice].threat}
            </p>

            <div className="space-y-1.5 pt-1 text-xs text-slate-200">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{noticeDetails[selectedNotice].solution}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-emerald-300 font-mono">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>{noticeDetails[selectedNotice].outcome}</span>
              </div>
            </div>
          </div>

          <Link
            href="/contact?urgent=true&service=Notice+Defense"
            className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-xl bg-gradient-to-r from-rose-600 to-[#E8823A] text-white hover:opacity-95 font-bold text-xs shadow-lg transition-all shimmer-sweep"
          >
            <span>Upload Notice for Free 30-Min CA Assessment &rarr;</span>
          </Link>
        </div>
      )}

      {/* TAB 3: STATUTORY DUE DATE RADAR */}
      {activeTab === 'deadlines' && (
        <div className="space-y-5 animate-in fade-in duration-300">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" /> Live Statutory Due Date Tracker
            </span>
            <h3 className="text-lg font-bold text-white font-display mt-0.5">
              Upcoming Mandatory Filing Deadlines
            </h3>
          </div>

          <div className="space-y-2.5">
            {[
              {
                name: 'GSTR-3B Monthly Return',
                date: '20th August 2026',
                act: 'GST Act 2017',
                penalty: '₹50/day late fee + 18% Interest',
                status: 'Urgent',
              },
              {
                name: 'Advance Tax 2nd Installment',
                date: '15th September 2026',
                act: 'Income Tax Sec 234C',
                penalty: '1% per month interest penalty',
                status: 'Upcoming',
              },
              {
                name: 'Corporate Tax Audit (Form 3CD)',
                date: '30th September 2026',
                act: 'Section 44AB',
                penalty: '0.5% turnover or ₹1.5 Lakhs max',
                status: 'Critical',
              },
            ].map((d, idx) => (
              <div
                key={idx}
                className="rounded-xl bg-black/40 p-3 border border-white/10 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-white block">{d.name}</span>
                  <span className="text-[11px] text-slate-300">{d.act} • {d.penalty}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-mono text-emerald-300 font-bold block">{d.date}</span>
                  <span className="text-[10px] font-semibold text-[#E8823A] uppercase">{d.status}</span>
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/compliance-calendar"
            className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-xl bg-gradient-to-r from-[#8B3FA8] to-[#E8823A] text-white hover:opacity-95 font-bold text-xs shadow-md transition-all"
          >
            <span>Open Complete 2025-26 Compliance Calendar &rarr;</span>
          </Link>
        </div>
      )}
    </div>
  );
}
