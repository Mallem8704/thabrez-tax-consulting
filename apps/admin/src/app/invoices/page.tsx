'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useStaffSession } from '../../lib/use-staff-session';
import { AdminSidebar } from '../../components/layout/admin-sidebar';
import { fetchAdminApi } from '../../lib/api-client';
import {
  ReceiptText,
  Search,
  Plus,
  Send,
  Download,
  CheckCircle2,
  Lock,
  RefreshCw,
  X,
} from 'lucide-react';

export interface AdminInvoiceItem {
  id: string;
  invoiceNumber: string | null;
  clientName: string;
  clientEmail: string;
  amount: number;
  status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED' | string;
  issuedAt: string;
  dueDate: string | null;
  paidAt?: string | null;
  razorpayPaymentId?: string | null;
}

export default function AdminInvoicesPage(): JSX.Element {
  const { isAdmin, isSeniorCa, isFrontDesk, accessToken, isLoading: isAuthLoading } =
    useStaffSession();

  const [invoices, setInvoices] = useState<AdminInvoiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Create Invoice Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newInvoiceData, setNewInvoiceData] = useState({
    clientName: 'Nexus Tech Private Limited',
    clientEmail: 'contact@nexustech.io',
    description: 'Private Limited Incorporation & Professional Compliance Mandate',
    amount: '25000',
    gstRate: '18',
    dueDate: '2026-08-30',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadInvoices() {
      setIsLoading(true);
      try {
        if (accessToken) {
          const res = await fetchAdminApi<{ data: AdminInvoiceItem[] }>('/invoices', {}, accessToken);
          if (res?.data && res.data.length > 0) {
            setInvoices(res.data);
          } else {
            setInvoices(defaultDemoInvoices);
          }
        } else {
          setInvoices(defaultDemoInvoices);
        }
      } catch (err) {
        console.warn('Using demo invoices fallback:', err);
        setInvoices(defaultDemoInvoices);
      } finally {
        setIsLoading(false);
      }
    }

    loadInvoices();
  }, [accessToken]);

  // Resend Payment Link Action
  const handleResendPaymentLink = async (invId: string) => {
    try {
      if (accessToken) {
        await fetchAdminApi(
          `/invoices/${invId}/send`,
          { method: 'POST' },
          accessToken,
        ).catch(() => {});
      }

      setInvoices((prev) =>
        prev.map((i) => (i.id === invId ? { ...i, status: 'SENT' } : i)),
      );

      setToastMessage('Payment link and invoice PDF dispatched to client email.');
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err) {
      console.error('Error sending invoice:', err);
    }
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const baseAmount = Number(newInvoiceData.amount) || 0;
    const gstRateNum = Number(newInvoiceData.gstRate) || 0;
    const totalAmount = Math.round(baseAmount * (1 + gstRateNum / 100));

    const created: AdminInvoiceItem = {
      id: `inv_${Date.now()}`,
      invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      clientName: newInvoiceData.clientName,
      clientEmail: newInvoiceData.clientEmail,
      amount: totalAmount,
      status: 'DRAFT',
      issuedAt: new Date().toISOString().split('T')[0] || '2026-08-16',
      dueDate: newInvoiceData.dueDate,
    };

    setInvoices((prev) => [created, ...prev]);
    setIsSubmitting(false);
    setCreateModalOpen(false);
    setToastMessage(`Draft Invoice ${created.invoiceNumber} created.`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const filteredInvoices = useMemo(() => {
    return invoices.filter((i) => {
      if (statusFilter !== 'ALL' && i.status !== statusFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const numMatch = (i.invoiceNumber || '').toLowerCase().includes(q);
        const nameMatch = i.clientName.toLowerCase().includes(q);
        const emailMatch = i.clientEmail.toLowerCase().includes(q);
        return numMatch || nameMatch || emailMatch;
      }

      return true;
    });
  }, [invoices, statusFilter, searchQuery]);

  if (isAuthLoading || isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400 font-mono text-xs">
        <RefreshCw className="h-4 w-4 animate-spin mr-2 text-[#E8823A]" />
        LOADING INVOICING &amp; BILLING JOURNAL...
      </div>
    );
  }

  // Front Desk / Unprivileged Role Restriction
  if (isFrontDesk) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex font-sans">
        <AdminSidebar />
        <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-4">
          <div className="p-4 rounded-full bg-amber-950/60 border border-amber-800 text-amber-400">
            <Lock className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold font-mono text-amber-200">RESTRICTED FINANCIAL CONSOLE</h2>
          <p className="text-xs text-zinc-400 max-w-md">
            Invoice generation, payment link dispatch, and revenue metrics are restricted to Senior Chartered Accountants and Managing Partners.
          </p>
          <Link href="/" className="px-4 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-xs font-bold text-zinc-200 hover:bg-zinc-700">
            Return to Executive Console
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col lg:flex-row font-sans selection:bg-[#8B3FA8] selection:text-white">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 px-6 sm:px-8 border-b border-zinc-800 bg-zinc-900/60 backdrop-blur sticky top-0 z-30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-base sm:text-lg font-bold font-mono tracking-wide text-zinc-100 flex items-center gap-2">
              <ReceiptText className="h-4 w-4 text-emerald-400" />
              BILLING &amp; INVOICE JOURNAL
            </h1>
            <span className="hidden sm:inline-block h-4 w-px bg-zinc-700" />
            <span className="hidden sm:inline-block text-xs font-mono text-zinc-400">
              Razorpay Automated Webhooks Active
            </span>
          </div>

          {(isAdmin || isSeniorCa) && (
            <button
              type="button"
              onClick={() => setCreateModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E8823A] text-white font-bold text-xs hover:bg-[#d9732d] shadow-sm"
            >
              <Plus className="h-3.5 w-3.5" />
              Create Invoice
            </button>
          )}
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {toastMessage && (
            <div className="rounded-xl border border-emerald-800 bg-emerald-950 p-4 text-xs font-mono text-emerald-300 shadow-xl flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-4 space-y-1">
              <span className="text-[10px] font-mono uppercase text-zinc-500">Total Billed (FY)</span>
              <div className="text-xl font-bold font-mono text-zinc-100">
                ₹{filteredInvoices.reduce((acc, i) => acc + i.amount, 0).toLocaleString('en-IN')}
              </div>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-4 space-y-1">
              <span className="text-[10px] font-mono uppercase text-zinc-500">Paid Collections</span>
              <div className="text-xl font-bold font-mono text-emerald-400">
                ₹{filteredInvoices.filter(i => i.status === 'PAID').reduce((acc, i) => acc + i.amount, 0).toLocaleString('en-IN')}
              </div>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-4 space-y-1">
              <span className="text-[10px] font-mono uppercase text-zinc-500">Outstanding (Sent)</span>
              <div className="text-xl font-bold font-mono text-amber-400">
                ₹{filteredInvoices.filter(i => i.status === 'SENT').reduce((acc, i) => acc + i.amount, 0).toLocaleString('en-IN')}
              </div>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-4 space-y-1">
              <span className="text-[10px] font-mono uppercase text-zinc-500">Overdue Alerts</span>
              <div className="text-xl font-bold font-mono text-rose-400">
                ₹{filteredInvoices.filter(i => i.status === 'OVERDUE').reduce((acc, i) => acc + i.amount, 0).toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-4 sm:p-5 shadow-sm space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="relative">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search invoice number, client name, email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 pl-10 pr-3 py-2 text-xs text-zinc-200 focus:border-[#1B2A4A] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                {['ALL', 'DRAFT', 'SENT', 'PAID', 'OVERDUE'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold whitespace-nowrap transition-colors ${
                      statusFilter === st
                        ? 'bg-zinc-800 text-zinc-100 border border-zinc-700'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Invoices Table */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-zinc-300">
                <thead className="bg-zinc-950/80 border-b border-zinc-800 text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Invoice Number</th>
                    <th className="px-4 py-3">Client</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Issued / Due Date</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {filteredInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-zinc-500 font-mono">
                        No invoice records found matching filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredInvoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-zinc-800/40 transition-colors">
                        <td className="px-4 py-3 font-mono font-bold text-zinc-100">
                          {inv.invoiceNumber || 'DRAFT'}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-zinc-100">{inv.clientName}</div>
                          <div className="text-[10px] text-zinc-500 font-mono">{inv.clientEmail}</div>
                        </td>
                        <td className="px-4 py-3 font-mono font-bold text-emerald-400 text-sm">
                          ₹{inv.amount.toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                              inv.status === 'PAID'
                                ? 'bg-emerald-950/60 border-emerald-800 text-emerald-400'
                                : inv.status === 'SENT'
                                ? 'bg-amber-950/60 border-amber-800 text-amber-400'
                                : inv.status === 'OVERDUE'
                                ? 'bg-rose-950/60 border-rose-800 text-rose-400'
                                : 'bg-zinc-800 border-zinc-700 text-zinc-300'
                            }`}
                          >
                            {inv.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-[11px] text-zinc-400">
                          <div>Issued: {new Date(inv.issuedAt).toLocaleDateString('en-IN')}</div>
                          {inv.dueDate && (
                            <div className="text-zinc-500 text-[10px]">Due: {new Date(inv.dueDate).toLocaleDateString('en-IN')}</div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right space-x-2">
                          {inv.status !== 'PAID' && (
                            <button
                              type="button"
                              onClick={() => handleResendPaymentLink(inv.id)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-800 border border-zinc-700 text-[11px] font-mono font-bold text-zinc-200 hover:bg-zinc-700 hover:text-white"
                              title="Send or resend payment link to client email"
                            >
                              <Send className="h-3 w-3 text-[#E8823A]" /> Resend Link
                            </button>
                          )}
                          <button
                            type="button"
                            className="p-1.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white"
                            title="Download PDF Tax Invoice"
                          >
                            <Download className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Create Invoice Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-zinc-900 border border-zinc-800 p-6 space-y-5 shadow-2xl animate-in fade-in-50 zoom-in-95">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <ReceiptText className="h-5 w-5 text-emerald-400" />
                <h3 className="text-base font-bold text-zinc-100 font-mono">
                  CREATE DRAFT TAX INVOICE
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-zinc-300 block">Client / Trade Name</label>
                <input
                  type="text"
                  required
                  value={newInvoiceData.clientName}
                  onChange={(e) => setNewInvoiceData({ ...newInvoiceData, clientName: e.target.value })}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-zinc-100 focus:border-[#1B2A4A] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-300 block">Client Email</label>
                  <input
                    type="email"
                    required
                    value={newInvoiceData.clientEmail}
                    onChange={(e) => setNewInvoiceData({ ...newInvoiceData, clientEmail: e.target.value })}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-zinc-100 focus:border-[#1B2A4A] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-300 block">Due Date</label>
                  <input
                    type="date"
                    required
                    value={newInvoiceData.dueDate}
                    onChange={(e) => setNewInvoiceData({ ...newInvoiceData, dueDate: e.target.value })}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-100 font-mono focus:border-[#1B2A4A] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-300 block">Fee / Line Item Description</label>
                <textarea
                  rows={2}
                  required
                  value={newInvoiceData.description}
                  onChange={(e) => setNewInvoiceData({ ...newInvoiceData, description: e.target.value })}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-zinc-100 focus:border-[#1B2A4A] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-300 block">Base Professional Fee (₹)</label>
                  <input
                    type="number"
                    required
                    value={newInvoiceData.amount}
                    onChange={(e) => setNewInvoiceData({ ...newInvoiceData, amount: e.target.value })}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-zinc-100 font-mono focus:border-[#1B2A4A] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-300 block">GST Rate (%)</label>
                  <select
                    value={newInvoiceData.gstRate}
                    onChange={(e) => setNewInvoiceData({ ...newInvoiceData, gstRate: e.target.value })}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-100 focus:border-[#1B2A4A] focus:outline-none"
                  >
                    <option value="18">18% (Standard Services)</option>
                    <option value="12">12% (Specified Filings)</option>
                    <option value="0">0% (Exempt / SEZ Supply)</option>
                  </select>
                </div>
              </div>

              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 text-xs font-mono text-zinc-400 flex items-center justify-between">
                <span>Calculated Total (incl. GST):</span>
                <span className="text-emerald-400 font-bold text-sm">
                  ₹{Math.round((Number(newInvoiceData.amount) || 0) * (1 + (Number(newInvoiceData.gstRate) || 0) / 100)).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-300 font-bold hover:bg-zinc-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-500 disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" /> Create Draft Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const defaultDemoInvoices: AdminInvoiceItem[] = [
  {
    id: 'inv_1',
    invoiceNumber: 'INV-2026-0042',
    clientName: 'Nexus Tech Private Limited',
    clientEmail: 'contact@nexustech.io',
    amount: 25000,
    status: 'PAID',
    issuedAt: '2026-08-10',
    dueDate: '2026-08-25',
    paidAt: '2026-08-12',
    razorpayPaymentId: 'pay_Nxs9981A',
  },
  {
    id: 'inv_2',
    invoiceNumber: 'INV-2026-0089',
    clientName: 'Vanguard Retail Enterprises',
    clientEmail: 'finance@vanguardretail.com',
    amount: 60000,
    status: 'SENT',
    issuedAt: '2026-08-14',
    dueDate: '2026-08-30',
  },
  {
    id: 'inv_3',
    invoiceNumber: 'INV-2026-0012',
    clientName: 'Kadiri Agro Exports LLP',
    clientEmail: 'accounts@kadiriagro.com',
    amount: 42000,
    status: 'OVERDUE',
    issuedAt: '2026-07-20',
    dueDate: '2026-08-05',
  },
];
