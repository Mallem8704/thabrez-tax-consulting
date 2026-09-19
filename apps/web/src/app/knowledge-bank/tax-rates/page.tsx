import type { Metadata } from 'next';
import Link from 'next/link';
import { Header, Footer } from '@thabrez/ui';
import {
  Percent,
  Calculator,
  Building2,
  Receipt,
  TrendingUp,
  Sparkles,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { VerifiedSourceBadge } from '../../../components/knowledge/verified-source-badge';
import { LegalDisclaimerFooter } from '../../../components/knowledge/legal-disclaimer-footer';
import { AuthorityType } from '@thabrez/types';

export const metadata: Metadata = {
  title: 'Statutory Tax Rate Center 2026–2027 | S. 115BAC, Corporate, TDS & GST',
  description:
    'Comprehensive statutory tax rate directory for FY 2026–2027 (AY 2027–2028). S. 115BAC individual slabs, corporate tax S. 115BAA, TDS/TCS matrix, GST rates, and depreciation schedules.',
  openGraph: {
    title: 'Statutory Tax Rates 2026–2027 | Thabrez Tax Consulting',
    description:
      'Verified statutory rates for Section 115BAC, Corporate Income Tax, TDS withholding limits, GST tariff slabs, and IT depreciation.',
    type: 'website',
  },
};

export default function TaxRatesPage(): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 selection:bg-[#8B3FA8] selection:text-white">
      <Header currentPath="/knowledge-bank/tax-rates" />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-slate-100 border-b border-slate-200 py-2.5 px-4 sm:px-6">
          <div className="container mx-auto max-w-7xl flex items-center gap-1.5 text-xs text-slate-500">
            <Link href="/" className="hover:text-slate-800">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/knowledge-bank" className="hover:text-slate-800">Knowledge Bank</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="font-semibold text-[#1B2A4A]">Tax Rate Center (FY 2026–2027)</span>
          </div>
        </div>

        {/* Hero Section */}
        <section className="bg-gradient-to-b from-[#1B2A4A] via-[#152238] to-[#0F172A] py-14 text-white">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="max-w-3xl space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1 text-xs font-semibold text-white/90">
                  <Percent className="h-3.5 w-3.5 text-amber-300" />
                  <span>Statutory Reference Slabs (AY 2027–2028)</span>
                </div>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl font-display">
                  Tax Rate Directory 2026–2027
                </h1>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  Verified statutory tax rates, withholding thresholds, surcharge matrices, and depreciation schedules codified under the <em>Income-tax Act, 2025</em>, Finance Act, and Central GST enactments.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <VerifiedSourceBadge
                    authority={AuthorityType.CBDT}
                    sourceUrl="https://www.incometax.gov.in"
                    isOfficial
                  />
                  <VerifiedSourceBadge
                    authority={AuthorityType.CBIC}
                    sourceUrl="https://www.cbic.gov.in"
                    isOfficial
                  />
                </div>
              </div>

              {/* Calculator Quick Link Card */}
              <div className="rounded-2xl border border-amber-400/30 bg-gradient-to-br from-amber-500/10 via-[#1B2A4A] to-[#152238] p-6 text-white space-y-4 max-w-sm lg:w-80 shrink-0">
                <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
                  <Calculator className="h-4 w-4" />
                  Interactive Engine
                </div>
                <h3 className="font-bold text-white text-base">
                  Simulate Exact Tax with Deductions
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Calculate net payable tax, 87A rebate, standard deduction, and Old vs New regime comparison in real-time.
                </p>
                <Link
                  href="/calculators"
                  className="inline-flex items-center justify-center w-full gap-2 rounded-xl bg-gradient-to-r from-[#E8823A] to-[#d9732b] hover:from-[#d9732b] hover:to-[#c66520] text-white font-bold py-2.5 text-xs transition-all shadow-md"
                >
                  Open Tax Calculators <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation Anchor Tabs */}
        <section className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 py-3 shadow-sm">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 overflow-x-auto text-xs font-semibold">
              <a
                href="#115bac"
                className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-[#8B3FA8] hover:text-white text-slate-700 transition-colors whitespace-nowrap"
              >
                Section 115BAC (Individual/HUF)
              </a>
              <a
                href="#corporate"
                className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-[#8B3FA8] hover:text-white text-slate-700 transition-colors whitespace-nowrap"
              >
                Corporate Tax (S. 115BAA)
              </a>
              <a
                href="#tds"
                className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-[#8B3FA8] hover:text-white text-slate-700 transition-colors whitespace-nowrap"
              >
                TDS / TCS Directory
              </a>
              <a
                href="#gst"
                className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-[#8B3FA8] hover:text-white text-slate-700 transition-colors whitespace-nowrap"
              >
                GST Rate Slabs
              </a>
              <a
                href="#depreciation"
                className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-[#8B3FA8] hover:text-white text-slate-700 transition-colors whitespace-nowrap"
              >
                Depreciation Schedule
              </a>
            </div>
          </div>
        </section>

        {/* Content Body */}
        <section className="py-12 bg-slate-50 space-y-16">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
            {/* 1. Section 115BAC New Tax Regime */}
            <div id="115bac" className="scroll-mt-20 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#8B3FA8]">
                    <Sparkles className="h-4 w-4" />
                    Default Regime (Individual &amp; HUF)
                  </div>
                  <h2 className="text-2xl font-bold font-display text-[#1B2A4A] mt-0.5">
                    Section 115BAC Tax Slabs (FY 2026–2027 / AY 2027–2028)
                  </h2>
                </div>
                <span className="text-xs font-mono bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full self-start sm:self-auto">
                  Standard Deduction: ₹75,000
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Slabs Table (2 cols) */}
                <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead className="bg-[#1B2A4A] text-white">
                        <tr>
                          <th className="py-3.5 px-4 sm:px-6 font-semibold">Total Taxable Income Slab</th>
                          <th className="py-3.5 px-4 sm:px-6 font-semibold">Statutory Tax Rate</th>
                          <th className="py-3.5 px-4 sm:px-6 font-semibold">Cumulative Base Tax</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        <tr className="hover:bg-slate-50/80">
                          <td className="py-3.5 px-4 sm:px-6 font-medium">Up to ₹3,00,000</td>
                          <td className="py-3.5 px-4 sm:px-6 text-emerald-600 font-bold">NIL (0%)</td>
                          <td className="py-3.5 px-4 sm:px-6 font-mono">₹0</td>
                        </tr>
                        <tr className="hover:bg-slate-50/80">
                          <td className="py-3.5 px-4 sm:px-6 font-medium">₹3,00,001 to ₹7,00,000</td>
                          <td className="py-3.5 px-4 sm:px-6 font-bold text-[#8B3FA8]">5%</td>
                          <td className="py-3.5 px-4 sm:px-6 font-mono">₹20,000 (Fully Rebatable under S. 87A)</td>
                        </tr>
                        <tr className="hover:bg-slate-50/80">
                          <td className="py-3.5 px-4 sm:px-6 font-medium">₹7,00,001 to ₹10,00,000</td>
                          <td className="py-3.5 px-4 sm:px-6 font-bold text-[#8B3FA8]">10%</td>
                          <td className="py-3.5 px-4 sm:px-6 font-mono">₹20,000 + 10% above ₹7L</td>
                        </tr>
                        <tr className="hover:bg-slate-50/80">
                          <td className="py-3.5 px-4 sm:px-6 font-medium">₹10,00,001 to ₹12,00,000</td>
                          <td className="py-3.5 px-4 sm:px-6 font-bold text-[#8B3FA8]">15%</td>
                          <td className="py-3.5 px-4 sm:px-6 font-mono">₹50,000 + 15% above ₹10L</td>
                        </tr>
                        <tr className="hover:bg-slate-50/80">
                          <td className="py-3.5 px-4 sm:px-6 font-medium">₹12,00,001 to ₹15,00,000</td>
                          <td className="py-3.5 px-4 sm:px-6 font-bold text-[#8B3FA8]">20%</td>
                          <td className="py-3.5 px-4 sm:px-6 font-mono">₹80,000 + 20% above ₹12L</td>
                        </tr>
                        <tr className="hover:bg-slate-50/80 bg-purple-50/30">
                          <td className="py-3.5 px-4 sm:px-6 font-bold text-[#1B2A4A]">Above ₹15,00,000</td>
                          <td className="py-3.5 px-4 sm:px-6 font-bold text-[#E8823A]">30%</td>
                          <td className="py-3.5 px-4 sm:px-6 font-mono">₹1,40,000 + 30% above ₹15L</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Key Statutory Features Box */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4 text-xs">
                  <h3 className="font-bold text-[#1B2A4A] text-sm">Key Section 115BAC Statutory Rules</h3>
                  
                  <div className="space-y-3 text-slate-600">
                    <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-950">
                      <strong className="text-emerald-900 block font-semibold mb-0.5">Section 87A Tax Rebate:</strong>
                      Resident individuals with net taxable income up to <strong>₹7,00,000</strong> receive 100% tax rebate (maximum ₹25,000), making zero tax payable!
                    </div>

                    <div className="p-3 rounded-lg bg-blue-50 border border-blue-100 text-blue-950">
                      <strong className="text-blue-900 block font-semibold mb-0.5">Salaried Standard Deduction:</strong>
                      Automatic <strong>₹75,000</strong> standard deduction applicable for all salaried employees and pensioners.
                    </div>

                    <div className="p-3 rounded-lg bg-purple-50 border border-purple-100 text-purple-950">
                      <strong className="text-purple-900 block font-semibold mb-0.5">Cess &amp; Surcharge:</strong>
                      Health &amp; Education Cess is 4% on tax. Surcharge under Section 115BAC is capped at a maximum of <strong>25%</strong> for income above ₹2 Crores (unlike 37% in old regime).
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Corporate Tax Rates */}
            <div id="corporate" className="scroll-mt-20 space-y-6">
              <div className="border-b border-slate-200 pb-3">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1B2A4A]">
                  <Building2 className="h-4 w-4 text-[#8B3FA8]" />
                  Corporate Assessees
                </div>
                <h2 className="text-2xl font-bold font-display text-[#1B2A4A] mt-0.5">
                  Corporate Tax Rates &amp; Effective Tax Matrix
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    title: 'Domestic Companies (Section 115BAA)',
                    rate: '22% Basic',
                    effective: '25.17% Effective',
                    desc: 'Applicable to domestic companies opting out of chapter VI-A deductions and MAT.',
                    surcharge: '10% flat surcharge + 4% cess',
                  },
                  {
                    title: 'New Manufacturing (Section 115BAB)',
                    rate: '15% Basic',
                    effective: '17.16% Effective',
                    desc: 'Concessional rate for incorporated eligible domestic manufacturing enterprises.',
                    surcharge: '10% flat surcharge + 4% cess',
                  },
                  {
                    title: 'Regular Domestic (Turnover ≤ ₹400 Cr)',
                    rate: '25% Basic',
                    effective: '26% - 29.12%',
                    desc: 'Domestic operational companies with total turnover not exceeding ₹400 Crores in base year.',
                    surcharge: '7% (income > ₹1Cr) / 12% (income > ₹10Cr)',
                  },
                  {
                    title: 'Regular Domestic (Turnover > ₹400 Cr)',
                    rate: '30% Basic',
                    effective: '31.2% - 34.94%',
                    desc: 'Standard domestic rate for large corporations retaining full chapter deductions.',
                    surcharge: '7% (income > ₹1Cr) / 12% (income > ₹10Cr)',
                  },
                  {
                    title: 'Foreign Companies & Branch Offices',
                    rate: '35% Basic',
                    effective: '36.4% - 38.22%',
                    desc: 'Foreign corporations, liaison offices, project offices, and permanent establishments in India.',
                    surcharge: '2% (income > ₹1Cr) / 5% (income > ₹10Cr)',
                  },
                  {
                    title: 'LLPs & Partnership Firms',
                    rate: '30% Basic',
                    effective: '31.2% - 34.94%',
                    desc: 'Limited Liability Partnerships (LLP) and registered/unregistered partnership firms.',
                    surcharge: '12% if taxable income > ₹1 Crore',
                  },
                ].map((corp, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-[#8B3FA8]/40 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-[#8B3FA8] bg-purple-50 px-2.5 py-0.5 rounded">
                          {corp.rate}
                        </span>
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded">
                          {corp.effective}
                        </span>
                      </div>
                      <h3 className="font-bold text-[#1B2A4A] text-base">{corp.title}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{corp.desc}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 font-mono">
                      Surcharge: {corp.surcharge}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. TDS & TCS Directory */}
            <div id="tds" className="scroll-mt-20 space-y-6">
              <div className="border-b border-slate-200 pb-3">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#E8823A]">
                  <Receipt className="h-4 w-4" />
                  Tax Deducted / Collected at Source
                </div>
                <h2 className="text-2xl font-bold font-display text-[#1B2A4A] mt-0.5">
                  TDS &amp; TCS Statutory Withholding Matrix (FY 2026–2027)
                </h2>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-[#1B2A4A] text-white">
                      <tr>
                        <th className="py-3.5 px-4 sm:px-6 font-semibold">Section</th>
                        <th className="py-3.5 px-4 sm:px-6 font-semibold">Nature of Payment</th>
                        <th className="py-3.5 px-4 sm:px-6 font-semibold">Statutory Threshold</th>
                        <th className="py-3.5 px-4 sm:px-6 font-semibold">TDS Rate</th>
                        <th className="py-3.5 px-4 sm:px-6 font-semibold">No PAN (S. 206AA)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {[
                        { sec: '194C', nature: 'Contractor / Sub-contractor payments', threshold: '₹30,000 (single) / ₹1,00,000 (aggregate)', rate: '1% (Ind/HUF) / 2% (Others)', noPan: '20%' },
                        { sec: '194J(a)', nature: 'Technical Services / Royalty / Call Center', threshold: '₹30,000 per FY', rate: '2%', noPan: '20%' },
                        { sec: '194J(b)', nature: 'Professional Fees / Director Remuneration', threshold: '₹30,000 per FY', rate: '10%', noPan: '20%' },
                        { sec: '194I(a)', nature: 'Rent of Plant & Machinery', threshold: '₹2,40,000 per FY', rate: '2%', noPan: '20%' },
                        { sec: '194I(b)', nature: 'Rent of Land, Building & Furniture', threshold: '₹2,40,000 per FY', rate: '10%', noPan: '20%' },
                        { sec: '194Q', nature: 'Purchase of Goods (Buyer Turnover > ₹10Cr)', threshold: '₹50,00,000 per FY', rate: '0.1%', noPan: '5%' },
                        { sec: '206C(1H)', nature: 'TCS on Sale of Goods (Seller Turnover > ₹10Cr)', threshold: '₹50,00,000 per FY', rate: '0.1%', noPan: '1%' },
                        { sec: '194A', nature: 'Interest other than Securities (Banks)', threshold: '₹40,000 (₹50,000 for Seniors)', rate: '10%', noPan: '20%' },
                        { sec: '194H', nature: 'Commission or Brokerage', threshold: '₹15,000 per FY', rate: '5%', noPan: '20%' },
                        { sec: '194DA', nature: 'Life Insurance Policy Maturity Proceeds', threshold: '₹1,00,000 per FY', rate: '5% (on net profit)', noPan: '20%' },
                      ].map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-50/80">
                          <td className="py-3 px-4 sm:px-6 font-mono font-bold text-[#8B3FA8]">{row.sec}</td>
                          <td className="py-3 px-4 sm:px-6 font-medium text-slate-900">{row.nature}</td>
                          <td className="py-3 px-4 sm:px-6 text-slate-600 font-mono">{row.threshold}</td>
                          <td className="py-3 px-4 sm:px-6 font-bold text-emerald-700">{row.rate}</td>
                          <td className="py-3 px-4 sm:px-6 text-amber-700 font-mono font-semibold">{row.noPan}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* 4. GST Rates */}
            <div id="gst" className="scroll-mt-20 space-y-6">
              <div className="border-b border-slate-200 pb-3">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600">
                  <Receipt className="h-4 w-4" />
                  Indirect Tax Tariffs
                </div>
                <h2 className="text-2xl font-bold font-display text-[#1B2A4A] mt-0.5">
                  GST Rate Slabs &amp; Classification
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                  { slab: '0% (Nil / Exempt)', title: 'Essential Commodities', desc: 'Unbranded fresh food grains, milk, salt, curd, agricultural produce, healthcare, and educational services.', color: 'border-emerald-200 bg-emerald-50/50 text-emerald-900' },
                  { slab: '5% Merit Slab', title: 'Basic Goods & Transport', desc: 'Household staples, packaged tea, edible oils, life-saving medicines, railways economy, and economy air transport.', color: 'border-blue-200 bg-blue-50/50 text-blue-900' },
                  { slab: '12% Standard I', title: 'Processed & Capital Goods', desc: 'Business class air, processed food, sewing machines, diagnostic kits, and select computer peripherals.', color: 'border-indigo-200 bg-indigo-50/50 text-indigo-900' },
                  { slab: '18% Standard II', title: 'Commercial & Services', desc: 'Most commercial IT/CA services, software licenses, capital equipment, telecom, banking, and general manufactured goods.', color: 'border-purple-200 bg-purple-50/50 text-purple-900' },
                  { slab: '28% + Cess', title: 'Luxury & De-merit Goods', desc: 'Automobiles, luxury air-conditioned transport, tobacco, pan masala, and aerated carbonated beverages.', color: 'border-amber-200 bg-amber-50/50 text-amber-900' },
                ].map((g, gIdx) => (
                  <div
                    key={gIdx}
                    className={`rounded-2xl border p-5 shadow-sm space-y-2.5 flex flex-col justify-between ${g.color}`}
                  >
                    <div>
                      <span className="text-base font-bold font-mono block mb-1">{g.slab}</span>
                      <h4 className="font-bold text-sm text-[#1B2A4A]">{g.title}</h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{g.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Depreciation Rates Schedule */}
            <div id="depreciation" className="scroll-mt-20 space-y-6">
              <div className="border-b border-slate-200 pb-3">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#8B3FA8]">
                  <TrendingUp className="h-4 w-4" />
                  Income Tax Rules Schedule
                </div>
                <h2 className="text-2xl font-bold font-display text-[#1B2A4A] mt-0.5">
                  Depreciation Rates (Written Down Value Method)
                </h2>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-[#1B2A4A] text-white">
                      <tr>
                        <th className="py-3 px-4 sm:px-6 font-semibold">Block of Assets</th>
                        <th className="py-3 px-4 sm:px-6 font-semibold">Statutory WDV Rate</th>
                        <th className="py-3 px-4 sm:px-6 font-semibold">Statutory Conditions &amp; Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {[
                        { block: 'Buildings: Purely Residential', rate: '5%', notes: 'Excluding hotels and boarding houses' },
                        { block: 'Buildings: Commercial, Office & Factory', rate: '10%', notes: 'Used for purpose of business or profession' },
                        { block: 'Plant & Machinery: General Rate', rate: '15%', notes: 'Standard manufacturing, office apparatus, and plant machinery' },
                        { block: 'Computers, Laptops & Software', rate: '40%', notes: 'Includes servers, printers, UPS, and application software packages' },
                        { block: 'Commercial Motor Vehicles (Taxis/Lorries)', rate: '30%', notes: 'Used in business of running them on hire' },
                        { block: 'Intangible Assets (Patents, Trademarks, Licenses)', rate: '25%', notes: 'Acquired on or after 1st April 1998' },
                      ].map((dep, dIdx) => (
                        <tr key={dIdx} className="hover:bg-slate-50/80">
                          <td className="py-3 px-4 sm:px-6 font-medium text-[#1B2A4A]">{dep.block}</td>
                          <td className="py-3 px-4 sm:px-6 font-mono font-bold text-[#8B3FA8]">{dep.rate}</td>
                          <td className="py-3 px-4 sm:px-6 text-slate-500 text-xs">{dep.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Legal Disclaimer */}
        <LegalDisclaimerFooter />
      </main>

      <Footer />
    </div>
  );
}
