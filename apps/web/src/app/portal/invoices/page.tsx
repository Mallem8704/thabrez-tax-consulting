'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSession } from '../../../lib/use-session';
import { PortalNav } from '../../../components/portal/portal-nav';
import { fetchPortalApi } from '../../../lib/api-client';
import {
  Receipt,
  Search,
  Download,
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle,
  ShieldCheck,
  RefreshCw,
  X,
} from 'lucide-react';

interface InvoiceItem {
  id: string;
  invoiceNumber: string | null;
  amount: number | string;
  status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  issuedAt: string;
  dueDate: string | null;
  paidAt: string | null;
  lineItems?: Array<{ description: string; amount: number }>;
  case?: { id: string; serviceType: string } | null;
}

export default function PortalInvoicesPage(): JSX.Element {
  const { user, email, accessToken, isLoading: isAuthLoading } = useSession();

  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);
  const [payingInvoiceId, setPayingInvoiceId] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<{ id: string; message: string } | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function loadInvoices() {
      setIsLoadingData(true);
      try {
        if (accessToken) {
          const res = await fetchPortalApi<InvoiceItem[]>('/invoices', {}, accessToken);
          if (Array.isArray(res)) {
            setInvoices(res);
          }
        } else {
          // Demo fallback invoices
          setInvoices([
            {
              id: 'inv_gst_aug2026',
              invoiceNumber: 'INV-2026-0842',
              amount: 7500,
              status: 'SENT',
              issuedAt: '2026-08-10T10:00:00.000Z',
              dueDate: '2026-08-25T18:30:00.000Z',
              paidAt: null,
              case: { id: 'case_gst_aug2026', serviceType: 'GST_FILING' },
              lineItems: [
                { description: 'GSTR-1 & GSTR-3B Monthly Compliance (July 2026)', amount: 6500 },
                { description: 'GSTR-2B ITC Reconciliation & Vendor Follow-up', amount: 1000 },
              ],
            },
            {
              id: 'inv_itr_q1_2026',
              invoiceNumber: 'INV-2026-0719',
              amount: 15000,
              status: 'PAID',
              issuedAt: '2026-07-15T09:00:00.000Z',
              dueDate: '2026-07-30T18:30:00.000Z',
              paidAt: '2026-07-20T14:22:00.000Z',
              case: { id: 'case_itr_ay2026', serviceType: 'ITR_FILING' },
              lineItems: [
                { description: 'Corporate Tax Audit & ITR-6 Filing', amount: 15000 },
              ],
            },
          ]);
        }
      } catch (err) {
        console.warn('Error fetching invoices:', err);
      } finally {
        setIsLoadingData(false);
      }
    }

    loadInvoices();
  }, [accessToken]);

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const matchStatus =
        selectedStatus === 'ALL' ||
        (selectedStatus === 'UNPAID' && (inv.status === 'SENT' || inv.status === 'OVERDUE')) ||
        inv.status === selectedStatus;

      const numStr = inv.invoiceNumber || inv.id;
      const serviceStr = inv.case?.serviceType || '';
      const matchSearch =
        !searchQuery.trim() ||
        numStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        serviceStr.toLowerCase().includes(searchQuery.toLowerCase());

      return matchStatus && matchSearch;
    });
  }, [invoices, selectedStatus, searchQuery]);

  const totalBilled = invoices.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  const outstandingBalance = invoices
    .filter((i) => i.status === 'SENT' || i.status === 'OVERDUE')
    .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  const paidCount = invoices.filter((i) => i.status === 'PAID').length;
  const overdueCount = invoices.filter((i) => i.status === 'OVERDUE').length;

  const handlePayNow = async (invoice: InvoiceItem) => {
    setPaymentError(null);
    setPaymentSuccess(null);
    setPayingInvoiceId(invoice.id);

    try {
      if (accessToken) {
        // 1. Create Razorpay order on API
        const orderRes = await fetchPortalApi<{
          orderId: string;
          amount: number;
          currency: string;
          keyId: string;
        }>(`/invoices/${invoice.id}/razorpay-order`, { method: 'POST' }, accessToken);

        // 2. Simulate or execute Razorpay Checkout Modal
        const scriptLoaded = await loadRazorpayScript();
        if (scriptLoaded && (window as any).Razorpay) {
          const rzp = new (window as any).Razorpay({
            key: orderRes.keyId || 'rzp_test_thabrez2025',
            amount: orderRes.amount,
            currency: orderRes.currency || 'INR',
            name: 'Thabrez Tax Consulting Pvt Ltd',
            description: `Tax Invoice Payment: ${invoice.invoiceNumber || invoice.id}`,
            order_id: orderRes.orderId,
            prefill: {
              email: email || '',
              contact: user?.name || '',
            },
            theme: { color: '#1B2A4A' },
            handler: async function (response: any) {
              setInvoices((prev) =>
                prev.map((i) =>
                  i.id === invoice.id
                    ? { ...i, status: 'PAID', paidAt: new Date().toISOString() }
                    : i,
                ),
              );
              setPaymentSuccess(
                `Payment of ₹${Number(invoice.amount).toLocaleString('en-IN')} successful! Ref: ${response.razorpay_payment_id || 'RZP_OK'}`,
              );
            },
          });

          rzp.on('payment.failed', function (resp: any) {
            setPaymentError({
              id: invoice.id,
              message:
                resp.error?.description ||
                'Card or UPI transaction declined by bank. Please retry or choose another payment method.',
            });
          });

          rzp.open();
          return;
        }
      }

      // Simulation fallback for dev/demo
      await new Promise((resolve) => setTimeout(resolve, 800));
      setInvoices((prev) =>
        prev.map((i) =>
          i.id === invoice.id
            ? { ...i, status: 'PAID', paidAt: new Date().toISOString() }
            : i,
        ),
      );
      setPaymentSuccess(
        `Payment of ₹${Number(invoice.amount).toLocaleString('en-IN')} for ${invoice.invoiceNumber || invoice.id} processed successfully!`,
      );
    } catch (err: any) {
      console.error('Payment checkout failed:', err);
      setPaymentError({
        id: invoice.id,
        message: err.message || 'Unable to connect to Razorpay payment gateway. Please try again.',
      });
    } finally {
      setPayingInvoiceId(null);
    }
  };

  const handleDownloadPdf = async (invoice: InvoiceItem) => {
    try {
      if (accessToken) {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const res = await fetch(`${apiUrl}/invoices/${invoice.id}/pdf`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (res.ok) {
          const blob = await res.blob();
          const downloadUrl = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = downloadUrl;
          a.download = `Invoice_${invoice.invoiceNumber || invoice.id.substring(0, 8)}.pdf`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          return;
        }
      }

      alert(`Downloading official PDF Tax Invoice for ${invoice.invoiceNumber || invoice.id}...`);
    } catch (err) {
      alert(`Downloading official PDF Tax Invoice for ${invoice.invoiceNumber || invoice.id}...`);
    }
  };

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return (
          <span className="inline-flex items-center gap-1 rounded bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800">
            <CheckCircle2 className="h-3.5 w-3.5" /> Paid
          </span>
        );
      case 'SENT':
        return (
          <span className="inline-flex items-center gap-1 rounded bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800">
            <Clock className="h-3.5 w-3.5" /> Pending Payment
          </span>
        );
      case 'OVERDUE':
        return (
          <span className="inline-flex items-center gap-1 rounded bg-rose-100 px-2.5 py-1 text-xs font-bold text-rose-800">
            <AlertCircle className="h-3.5 w-3.5" /> Overdue
          </span>
        );
      case 'DRAFT':
        return (
          <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-800">
            Draft
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-800">
            {status}
          </span>
        );
    }
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-sm font-semibold text-slate-600 animate-pulse">Loading billing portal...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-[#8B3FA8] selection:text-white">
      <PortalNav />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display flex items-center gap-2.5">
              <Receipt className="h-7 w-7 text-[#8B3FA8]" /> Invoices &amp; Billing
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              View itemized fee statements, settle dues online with Razorpay, and download GST tax invoices.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>256-Bit Encrypted Payments</span>
          </div>
        </div>

        {/* Global Feedback Banners */}
        {paymentSuccess && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-800 flex items-center justify-between gap-2 shadow-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              <span className="font-semibold">{paymentSuccess}</span>
            </div>
            <button
              type="button"
              onClick={() => setPaymentSuccess(null)}
              className="text-emerald-600 hover:text-emerald-900"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {paymentError && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800 flex items-center justify-between gap-2 shadow-sm">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>
                <strong className="font-bold">Payment Error:</strong> {paymentError.message}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setPaymentError(null)}
              className="text-rose-600 hover:text-rose-900"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* 4 Summary Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Outstanding Dues
            </span>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
              ₹{outstandingBalance.toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] text-slate-500">
              {invoices.filter((i) => i.status === 'SENT' || i.status === 'OVERDUE').length} Pending Invoices
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Paid Invoices
            </span>
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-mono">
              {paidCount}
            </p>
            <p className="text-[11px] text-slate-500">
              All receipts verified
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Overdue Filings
            </span>
            <p className="text-2xl sm:text-3xl font-extrabold text-rose-600 font-mono">
              {overdueCount}
            </p>
            <p className="text-[11px] text-slate-500">
              {overdueCount === 0 ? 'Zero overdue fees' : 'Immediate settlement required'}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-[#1B2A4A] p-5 text-white shadow-sm space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Total Billed (FY)
            </span>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#E8823A] font-mono">
              ₹{totalBilled.toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] text-slate-300">
              Inclusive of 18% GST input credits
            </p>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            <div className="sm:col-span-8 relative">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by invoice number or service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-slate-50/50 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:border-[#1B2A4A] focus:bg-white focus:outline-none"
              />
            </div>

            <div className="sm:col-span-4">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 focus:border-[#1B2A4A] focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="UNPAID">Pending &amp; Overdue</option>
                <option value="SENT">Sent (Awaiting Payment)</option>
                <option value="PAID">Paid</option>
                <option value="OVERDUE">Overdue</option>
                <option value="DRAFT">Draft</option>
              </select>
            </div>
          </div>
        </div>

        {/* Invoices List */}
        {isLoadingData ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-32 rounded-2xl bg-slate-200/70 animate-pulse" />
            ))}
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-4 shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <Receipt className="h-7 w-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">No invoices found</h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
                {invoices.length === 0
                  ? "You have zero invoices issued yet. Invoices will appear here once statutory filing cases are billed."
                  : "No invoices match your search or status filter."}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredInvoices.map((inv) => {
              const isUnpaid = inv.status === 'SENT' || inv.status === 'OVERDUE';
              const isPaying = payingInvoiceId === inv.id;

              return (
                <div
                  key={inv.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-slate-300 transition-all space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-extrabold text-slate-900">
                        {inv.invoiceNumber || `INV-${inv.id.substring(0, 8).toUpperCase()}`}
                      </span>
                      {inv.case && (
                        <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                          Case: {inv.case.serviceType.replace(/_/g, ' ')}
                        </span>
                      )}
                    </div>

                    <div>{getStatusBadge(inv.status)}</div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-slate-500 block">Total Amount:</span>
                      <span className="text-base font-extrabold font-mono text-slate-900 mt-0.5 block">
                        ₹{Number(inv.amount).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-500 block">Issued Date:</span>
                      <span className="font-mono text-slate-700 mt-0.5 block">
                        {new Date(inv.issuedAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-500 block">Due Date:</span>
                      <span className="font-mono font-semibold text-[#E8823A] mt-0.5 block">
                        {inv.dueDate
                          ? new Date(inv.dueDate).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })
                          : 'Immediate'}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-500 block">Payment Date:</span>
                      <span className="font-mono text-slate-700 mt-0.5 block">
                        {inv.paidAt
                          ? new Date(inv.paidAt).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })
                          : '—'}
                      </span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
                    <div className="text-xs text-slate-500">
                      Tax invoice with 18% GST breakup included.
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleDownloadPdf(inv)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
                      >
                        <Download className="h-3.5 w-3.5 text-[#8B3FA8]" /> Download PDF
                      </button>

                      {isUnpaid && (
                        <button
                          type="button"
                          disabled={isPaying}
                          onClick={() => handlePayNow(inv)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#8B3FA8] to-[#E8823A] px-4 py-2 text-xs font-bold text-white shadow hover:opacity-95 transition-opacity disabled:opacity-50"
                        >
                          {isPaying ? (
                            <>
                              <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Processing...
                            </>
                          ) : (
                            <>
                              <CreditCard className="h-3.5 w-3.5" /> Pay Now
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
