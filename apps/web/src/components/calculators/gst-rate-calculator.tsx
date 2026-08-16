'use client';

import React, { useState, useMemo } from 'react';
import { Search, Tag, Info } from 'lucide-react';

interface GstRateItem {
  code: string;
  type: 'HSN' | 'SAC';
  description: string;
  category: string;
  rate: number;
  condition?: string;
}

export function GstRateCalculator(): JSX.Element {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const rateItems: GstRateItem[] = [
    { code: '998311', type: 'SAC', description: 'Legal and Accounting / Chartered Accountant Services', category: 'Professional Services', rate: 18 },
    { code: '998314', type: 'SAC', description: 'Information Technology and Software Development Services', category: 'IT & Telecom', rate: 18 },
    { code: '998319', type: 'SAC', description: 'Management Consulting and Business Advisory Services', category: 'Professional Services', rate: 18 },
    { code: '996331', type: 'SAC', description: 'Restaurant Services (Standalone, non-AC or AC)', category: 'Hospitality', rate: 5, condition: 'Without ITC benefit' },
    { code: '996311', type: 'SAC', description: 'Hotel Accommodation (Room tariff up to ₹7,500/day)', category: 'Hospitality', rate: 12 },
    { code: '996312', type: 'SAC', description: 'Hotel Accommodation (Room tariff above ₹7,500/day)', category: 'Hospitality', rate: 18 },
    { code: '996511', type: 'SAC', description: 'Goods Transport Agency (GTA) Services (Forward Charge)', category: 'Logistics', rate: 12 },
    { code: '996512', type: 'SAC', description: 'Goods Transport Agency (GTA) Services (RCM basis)', category: 'Logistics', rate: 5 },
    { code: '8471', type: 'HSN', description: 'Laptops, Computers and Electronic Data Processors', category: 'Electronics', rate: 18 },
    { code: '8517', type: 'HSN', description: 'Smartphones and Mobile Telephones', category: 'Electronics', rate: 18 },
    { code: '8703', type: 'HSN', description: 'Motor Cars and Passenger Vehicles', category: 'Automobiles', rate: 28, condition: 'Plus applicable Compensation Cess' },
    { code: '3004', type: 'HSN', description: 'Medicaments and Essential Pharmaceutical Formulations', category: 'Healthcare', rate: 12 },
    { code: '0401', type: 'HSN', description: 'Fresh Fresh Milk and Curd (Unbranded & Loose)', category: 'Food & Agriculture', rate: 0 },
    { code: '0402', type: 'HSN', description: 'Packaged & Branded Paneer, Butter and Dairy Spreads', category: 'Food & Agriculture', rate: 5 },
    { code: '6203', type: 'HSN', description: 'Readymade Garments and Apparel (Sale value up to ₹1,000)', category: 'Textiles', rate: 5 },
    { code: '6204', type: 'HSN', description: 'Readymade Garments and Apparel (Sale value above ₹1,000)', category: 'Textiles', rate: 12 },
    { code: '6802', type: 'HSN', description: 'Granite, Marble Slabs and Building Tiles', category: 'Construction', rate: 18 },
    { code: '2523', type: 'HSN', description: 'Portland Cement, Aluminous Cement and Mortar', category: 'Construction', rate: 28 },
  ];

  const categories = ['all', ...Array.from(new Set(rateItems.map((i) => i.category)))];

  const filteredItems = useMemo(() => {
    return rateItems.filter((item) => {
      const matchQuery =
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCat =
        selectedCategory === 'all' || item.category === selectedCategory;

      return matchQuery && matchCat;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="space-y-8">
      {/* Search and Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Goods / Service name, HSN code, or SAC code (e.g. 998311, Consulting, Laptops)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-4 py-2.5 text-sm shadow-sm focus:border-[#1B2A4A] focus:outline-none focus:ring-1 focus:ring-[#1B2A4A]"
            />
          </div>

          <div className="w-full sm:w-60">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-[#1B2A4A] focus:outline-none focus:ring-1 focus:ring-[#1B2A4A]"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === 'all' ? 'All Categories' : c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick filter pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 text-xs">
          <span className="text-slate-400 mr-1">Popular searches:</span>
          {['CA Services', 'Software', 'Restaurant', 'Cement', 'Garments'].map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => setSearchQuery(term)}
              className="rounded-md bg-slate-100 px-2.5 py-1 text-slate-700 hover:bg-slate-200 transition-colors"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Results Table */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <Tag className="h-4 w-4 text-[#8B3FA8]" /> GST Rates &amp; HSN/SAC Classification ({filteredItems.length} found)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="border-b border-slate-200 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-3">Code</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Item / Service Description</th>
                <th className="px-6 py-3 text-right">GST Rate</th>
                <th className="px-6 py-3 text-right">CGST / SGST</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    No matching HSN / SAC codes found. Try another search term.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-[#1B2A4A] whitespace-nowrap">
                      <span className="inline-block rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-700 border border-slate-200">
                        {item.type} {item.code}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-slate-600 whitespace-nowrap">
                      {item.category}
                    </td>
                    <td className="px-6 py-4 text-slate-800">
                      <p className="font-medium">{item.description}</p>
                      {item.condition && (
                        <p className="text-[11px] text-amber-600 mt-0.5 italic">
                          Note: {item.condition}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-base text-slate-900 whitespace-nowrap">
                      <span className={`inline-block rounded-md px-2.5 py-0.5 ${
                        item.rate === 0
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.rate === 5
                          ? 'bg-blue-100 text-blue-800'
                          : item.rate === 12
                          ? 'bg-purple-100 text-purple-800'
                          : item.rate === 18
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {item.rate}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-xs text-slate-600 whitespace-nowrap">
                      {item.rate === 0 ? '0% / 0%' : `${item.rate / 2}% / ${item.rate / 2}%`}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SEO Explanatory Guide */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6">
        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Info className="h-5 w-5 text-[#8B3FA8]" /> Understanding HSN &amp; SAC Codes under Indian GST
        </h3>

        <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            The Goods and Services Tax system in India utilizes two standardized codification mechanisms to identify and tax commercial transactions:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
              <h4 className="font-bold text-slate-900">HSN (Harmonized System of Nomenclature)</h4>
              <p className="text-xs">
                An internationally accepted 6-digit to 8-digit uniform code developed by the World Customs Organization (WCO) to classify physical <strong>goods</strong> for customs and domestic GST.
              </p>
              <p className="text-xs text-slate-500">
                Mandatory for businesses with turnover &gt;₹5 Crores to declare 6-digit HSN in Tax Invoices.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
              <h4 className="font-bold text-slate-900">SAC (Services Accounting Code)</h4>
              <p className="text-xs">
                A 6-digit code issued by the Central Board of Indirect Taxes and Customs (CBIC) starting with prefix <strong>99</strong> to classify all taxable and exempt <strong>services</strong>.
              </p>
              <p className="text-xs text-slate-500">
                Example: SAC 998311 for legal, accounting, and tax consultancy services.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
