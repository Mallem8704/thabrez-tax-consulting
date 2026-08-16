'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from '../../lib/use-session';
import { PortalNav } from '../../components/portal/portal-nav';
import { fetchPortalApi } from '../../lib/api-client';
import {
  FolderOpen,
  Calendar,
  CreditCard,
  Clock,
  FileText,
  ShieldCheck,
  Phone,
  Mail,
  ChevronRight,
  PlusCircle,
  Sparkles,
} from 'lucide-react';

interface CaseItem {
  id: string;
  serviceType: string;
  status: 'RECEIVED' | 'IN_REVIEW' | 'FILED' | 'ACKNOWLEDGED' | 'CLOSED';
  dueDate: string | null;
  createdAt: string;
  assignedTo?: { email: string; role: string } | null;
}

interface DeadlineItem {
  id: string;
  type: string;
  dueDate: string;
  status: 'PENDING' | 'REMINDED' | 'COMPLETED' | 'OVERDUE';
}

interface InvoiceItem {
  id: string;
  invoiceNumber: string | null;
  amount: number | string;
  status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  dueDate: string | null;
}

export default function PortalDashboardPage(): JSX.Element {
  const { user, email, accessToken, isLoading: isAuthLoading } = useSession();

  const [cases, setCases] = useState<CaseItem[]>([]);
  const [deadlines, setDeadlines] = useState<DeadlineItem[]>([]);
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    async function loadPortalData() {
      setIsLoadingData(true);
      try {
        if (accessToken) {
          // Attempt real API fetches
          const [casesRes, deadlinesRes, invoicesRes] = await Promise.allSettled([
            fetchPortalApi<{ data: CaseItem[] }>('/cases?limit=5', {}, accessToken),
            fetchPortalApi<DeadlineItem[]>('/deadlines', {}, accessToken),
            fetchPortalApi<InvoiceItem[]>('/invoices', {}, accessToken),
          ]);

          if (casesRes.status === 'fulfilled' && casesRes.value?.data) {
            setCases(casesRes.value.data);
          }
          if (deadlinesRes.status === 'fulfilled' && Array.isArray(deadlinesRes.value)) {
            setDeadlines(deadlinesRes.value);
          }
          if (invoicesRes.status === 'fulfilled' && Array.isArray(invoicesRes.value)) {
            setInvoices(invoicesRes.value);
          }
        } else {
          // Default initial demo state for client preview
          setCases([
            {
              id: 'case_gst_aug2026',
              serviceType: 'GST_FILING',
              status: 'IN_REVIEW',
              dueDate: '2026-08-20T18:30:00.000Z',
              createdAt: '2026-08-10T10:00:00.000Z',
              assignedTo: { email: 'ananya.reddy@thabreztaxconsulting.com', role: 'SENIOR_CA' },
            },
            {
              id: 'case_itr_ay2026',
              serviceType: 'ITR_FILING',
              status: 'RECEIVED',
              dueDate: '2026-09-30T18:30:00.000Z',
              createdAt: '2026-08-14T12:00:00.000Z',
              assignedTo: { email: 'ca.thabrez@thabreztaxconsulting.com', role: 'SENIOR_CA' },
            },
          ]);

          setDeadlines([
            {
              id: 'dl_1',
              type: 'GST_FILING',
              dueDate: '2026-08-20T18:30:00.000Z',
              status: 'PENDING',
            },
            {
              id: 'dl_2',
              type: 'TDS_FILING',
              dueDate: '2026-09-07T18:30:00.000Z',
              status: 'PENDING',
            },
          ]);

          setInvoices([
            {
              id: 'inv_1',
              invoiceNumber: 'INV-2026-0842',
              amount: 7500,
              status: 'SENT',
              dueDate: '2026-08-25T18:30:00.000Z',
            },
          ]);
        }
      } catch (err) {
        console.warn('Could not fetch remote portal data, using local client state:', err);
      } finally {
        setIsLoadingData(false);
      }
    }

    loadPortalData();
  }, [accessToken]);

  const activeCasesCount = cases.filter((c) => c.status !== 'CLOSED').length;
  const pendingDeadlinesCount = deadlines.filter((d) => d.status === 'PENDING' || d.status === 'REMINDED').length;
  const unpaidInvoices = invoices.filter((i) => i.status === 'SENT' || i.status === 'OVERDUE');
  const totalUnpaidAmount = unpaidInvoices.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  const formatServiceLabel = (serviceType: string) => {
    return serviceType.replace(/_/g, ' ');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'RECEIVED':
        return <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800">Received</span>;
      case 'IN_REVIEW':
        return <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">In Review</span>;
      case 'FILED':
        return <span className="rounded bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-800">Filed</span>;
      case 'ACKNOWLEDGED':
        return <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">Acknowledged</span>;
      default:
        return <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-800">Closed</span>;
    }
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-sm font-semibold text-slate-600 animate-pulse">Loading Client Portal...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-[#8B3FA8] selection:text-white">
      <PortalNav />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Verified Client Account
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              Welcome back, {user?.name || email?.split('@')[0] || 'Client'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Track your statutory filings, upload compliance documents, and communicate with your assigned CA.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/portal/cases"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#1B2A4A] px-4 py-2.5 text-xs font-bold text-white shadow hover:bg-[#1B2A4A]/90 transition-colors"
            >
              <FolderOpen className="h-4 w-4" /> View All Cases
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
            >
              <PlusCircle className="h-4 w-4 text-[#8B3FA8]" /> Request New Service
            </Link>
          </div>
        </div>

        {/* 4 Summary Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Active Cases Card */}
          <Link
            href="/portal/cases"
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-[#8B3FA8] hover:shadow-md transition-all space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Active Cases
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-[#8B3FA8]">
                <FolderOpen className="h-4 w-4" />
              </div>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
                {activeCasesCount}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {activeCasesCount === 0 ? 'No active cases' : 'Filings in progress'}
              </p>
            </div>
            <div className="text-[11px] font-bold text-[#8B3FA8] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform pt-1">
              Manage Filings &rarr;
            </div>
          </Link>

          {/* Upcoming Deadlines Card */}
          <Link
            href="/compliance-calendar"
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-[#E8823A] hover:shadow-md transition-all space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Upcoming Deadlines
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-[#E8823A]">
                <Calendar className="h-4 w-4" />
              </div>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
                {pendingDeadlinesCount}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Next due in August 2026
              </p>
            </div>
            <div className="text-[11px] font-bold text-[#E8823A] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform pt-1">
              Check Compliance Dates &rarr;
            </div>
          </Link>

          {/* Outstanding Invoices Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Outstanding Dues
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <CreditCard className="h-4 w-4" />
              </div>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
                ₹{totalUnpaidAmount.toLocaleString('en-IN')}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {unpaidInvoices.length} Pending Invoice
              </p>
            </div>
            <div className="text-[11px] text-emerald-700 font-semibold pt-1">
              Razorpay Secured Gateway
            </div>
          </div>

          {/* Compliance Health Score */}
          <div className="rounded-2xl border border-slate-200 bg-[#1B2A4A] p-5 text-white shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Compliance Status
              </span>
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
                100%
              </p>
              <p className="text-[11px] text-slate-300 mt-0.5">
                All filings on-track with zero penalties
              </p>
            </div>
            <div className="text-[11px] text-slate-300 pt-1">
              Partner Assigned: CA. Thabrez
            </div>
          </div>
        </div>

        {/* Two-Column Layout: Active Cases Feed + Assigned CA & Quick Actions */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Main Feed: Active Cases & Filings */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FolderOpen className="h-5 w-5 text-[#8B3FA8]" /> Recent Filing Cases
              </h2>
              <Link
                href="/portal/cases"
                className="text-xs font-bold text-[#8B3FA8] hover:underline flex items-center gap-1"
              >
                View Full History &rarr;
              </Link>
            </div>

            {isLoadingData ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="h-28 rounded-2xl bg-slate-200/70 animate-pulse" />
                ))}
              </div>
            ) : cases.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center space-y-4 shadow-sm">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                  <FolderOpen className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-900">No active cases right now</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    You have no ongoing tax returns or incorporation cases. Start a new filing to begin working with our Chartered Accountants.
                  </p>
                </div>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#1B2A4A] px-4 py-2 text-xs font-bold text-white shadow hover:bg-[#1B2A4A]/90 transition-colors"
                >
                  <PlusCircle className="h-3.5 w-3.5" /> Start New Engagement
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {cases.map((c) => (
                  <Link
                    key={c.id}
                    href={`/portal/cases/${c.id}`}
                    className="group block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-[#8B3FA8] hover:shadow-md transition-all space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-500">
                          #{c.id.substring(0, 14)}
                        </span>
                        <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                          {formatServiceLabel(c.serviceType)}
                        </span>
                      </div>
                      <div>{getStatusBadge(c.status)}</div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <span className="text-slate-500 block">Assigned CA Officer:</span>
                        <span className="font-semibold text-slate-900 mt-0.5 block">
                          {c.assignedTo?.email || 'Senior Tax Associate'}
                        </span>
                      </div>

                      {c.dueDate && (
                        <div>
                          <span className="text-slate-500 block">Target Filing Date:</span>
                          <span className="font-mono font-semibold text-[#E8823A] mt-0.5 block">
                            {new Date(c.dueDate).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-1 text-xs font-bold text-[#8B3FA8] group-hover:translate-x-1 transition-transform">
                        Open Workspace &rarr;
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar: Assigned CA Partner & Quick Access */}
          <div className="lg:col-span-4 space-y-6">
            {/* Assigned CA Profile Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1B2A4A] text-white font-bold text-sm">
                  CT
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">CA. Thabrez, FCA</h3>
                  <p className="text-[11px] text-slate-500">Lead Senior Partner &middot; Indirect Tax</p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-[#E8823A]" />
                  <span>Direct Line: +91 880-2222-422</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-[#8B3FA8]" />
                  <span>ca.thabrez@thabreztaxconsulting.com</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  <span>Hours: Mon - Sat (10am to 7pm)</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <Link
                  href="/portal/cases"
                  className="block text-center rounded-lg bg-slate-100 py-2 px-3 text-xs font-bold text-slate-800 hover:bg-slate-200 transition-colors"
                >
                  Send Case Message &rarr;
                </Link>
              </div>
            </div>

            {/* Quick Tools & Shortcuts */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
                Quick Shortcuts
              </h3>

              <div className="space-y-1.5 text-xs font-semibold">
                <Link
                  href="/calculators"
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 text-slate-700 group transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#8B3FA8]" /> Tax Calculators Hub
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <Link
                  href="/compliance-calendar"
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 text-slate-700 group transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[#E8823A]" /> Statutory Due Dates
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <Link
                  href="/resources"
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 text-slate-700 group transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-emerald-600" /> Bare Acts &amp; Forms
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
