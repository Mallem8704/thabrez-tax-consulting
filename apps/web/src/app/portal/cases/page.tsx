'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useSession } from '../../../lib/use-session';
import { PortalNav } from '../../../components/portal/portal-nav';
import { fetchPortalApi } from '../../../lib/api-client';
import {
  FolderOpen,
  Search,
  PlusCircle,
  FileText,
  MessageSquare,
} from 'lucide-react';

interface CaseItem {
  id: string;
  serviceType: string;
  status: 'RECEIVED' | 'IN_REVIEW' | 'FILED' | 'ACKNOWLEDGED' | 'CLOSED';
  dueDate: string | null;
  createdAt: string;
  assignedTo?: { email: string; role: string } | null;
  documents?: { id: string }[];
  messages?: { id: string }[];
}

export default function PortalCasesListPage(): JSX.Element {
  const { accessToken, isLoading: isAuthLoading } = useSession();

  const [cases, setCases] = useState<CaseItem[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedService, setSelectedService] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

  useEffect(() => {
    async function loadCases() {
      setIsLoadingData(true);
      try {
        if (accessToken) {
          const res = await fetchPortalApi<{ data: CaseItem[] }>('/cases?limit=50', {}, accessToken);
          if (res?.data) {
            setCases(res.data);
          }
        } else {
          // Demo fallback cases
          setCases([
            {
              id: 'case_gst_aug2026',
              serviceType: 'GST_FILING',
              status: 'IN_REVIEW',
              dueDate: '2026-08-20T18:30:00.000Z',
              createdAt: '2026-08-10T10:00:00.000Z',
              assignedTo: { email: 'ananya.reddy@thabreztaxconsulting.com', role: 'SENIOR_CA' },
              documents: [{ id: 'd1' }, { id: 'd2' }],
              messages: [{ id: 'm1' }, { id: 'm2' }],
            },
            {
              id: 'case_itr_ay2026',
              serviceType: 'ITR_FILING',
              status: 'RECEIVED',
              dueDate: '2026-09-30T18:30:00.000Z',
              createdAt: '2026-08-14T12:00:00.000Z',
              assignedTo: { email: 'ca.thabrez@thabreztaxconsulting.com', role: 'SENIOR_CA' },
              documents: [{ id: 'd3' }],
              messages: [{ id: 'm3' }],
            },
            {
              id: 'case_tds_q1_2026',
              serviceType: 'TDS_FILING',
              status: 'ACKNOWLEDGED',
              dueDate: '2026-07-31T18:30:00.000Z',
              createdAt: '2026-07-15T09:00:00.000Z',
              assignedTo: { email: 'karthik.iyer@thabreztaxconsulting.com', role: 'ASSOCIATE' },
              documents: [{ id: 'd4' }, { id: 'd5' }],
              messages: [],
            },
          ]);
        }
      } catch (err) {
        console.warn('Error fetching client cases:', err);
      } finally {
        setIsLoadingData(false);
      }
    }

    loadCases();
  }, [accessToken]);

  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      const matchStatus =
        selectedStatus === 'ALL' ||
        (selectedStatus === 'ACTIVE' && c.status !== 'CLOSED' && c.status !== 'ACKNOWLEDGED') ||
        c.status === selectedStatus;

      const matchService =
        selectedService === 'ALL' || c.serviceType === selectedService;

      const matchSearch =
        !searchQuery.trim() ||
        c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.serviceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.assignedTo?.email && c.assignedTo.email.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchStatus && matchService && matchSearch;
    });
  }, [cases, selectedStatus, selectedService, searchQuery]);

  const formatServiceLabel = (serviceType: string) => {
    return serviceType.replace(/_/g, ' ');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'RECEIVED':
        return <span className="rounded bg-blue-100 px-2.5 py-1 text-xs font-bold text-blue-800">Received</span>;
      case 'IN_REVIEW':
        return <span className="rounded bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800">In Review</span>;
      case 'FILED':
        return <span className="rounded bg-purple-100 px-2.5 py-1 text-xs font-bold text-purple-800">Filed</span>;
      case 'ACKNOWLEDGED':
        return <span className="rounded bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800">Acknowledged</span>;
      default:
        return <span className="rounded bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-800">Closed</span>;
    }
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-sm font-semibold text-slate-600 animate-pulse">Loading filings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-[#8B3FA8] selection:text-white">
      <PortalNav />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display flex items-center gap-2.5">
              <FolderOpen className="h-7 w-7 text-[#8B3FA8]" /> My Cases &amp; Filings
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Track the live progress of all statutory returns, tax appeals, and compliance filings.
            </p>
          </div>

          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#1B2A4A] px-4 py-2.5 text-xs font-bold text-white shadow hover:bg-[#1B2A4A]/90 transition-colors"
          >
            <PlusCircle className="h-4 w-4 text-[#E8823A]" /> Request New Case
          </Link>
        </div>

        {/* Filter Controls Bar */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            {/* Search Input */}
            <div className="sm:col-span-6 relative">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by case reference ID, service type, or CA..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-slate-50/50 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:border-[#1B2A4A] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1B2A4A]"
              />
            </div>

            {/* Status Filter */}
            <div className="sm:col-span-3">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 focus:border-[#1B2A4A] focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">Active (In Progress)</option>
                <option value="RECEIVED">Received</option>
                <option value="IN_REVIEW">In Review</option>
                <option value="FILED">Filed</option>
                <option value="ACKNOWLEDGED">Acknowledged</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>

            {/* Service Type Filter */}
            <div className="sm:col-span-3">
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 focus:border-[#1B2A4A] focus:outline-none"
              >
                <option value="ALL">All Service Types</option>
                <option value="GST_FILING">GST Return Filing</option>
                <option value="ITR_FILING">Income Tax Return (ITR)</option>
                <option value="TDS_FILING">TDS / TCS Filing</option>
                <option value="COMPANY_REGISTRATION">Company Registration</option>
                <option value="ROC_ANNUAL_COMPLIANCE">ROC Compliance</option>
                <option value="BOOKKEEPING">Bookkeeping Services</option>
              </select>
            </div>
          </div>
        </div>

        {/* Cases List */}
        {isLoadingData ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 rounded-2xl bg-slate-200/70 animate-pulse" />
            ))}
          </div>
        ) : filteredCases.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-4 shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <FolderOpen className="h-7 w-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">No cases found</h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
                {cases.length === 0
                  ? "You don't have any statutory filing cases registered yet. Initiate a new case to connect with your assigned CA."
                  : 'No cases match your active filter and search criteria.'}
              </p>
            </div>

            {cases.length === 0 ? (
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#1B2A4A] px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-[#1B2A4A]/90 transition-colors"
              >
                <PlusCircle className="h-4 w-4" /> Start Your First Engagement
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setSelectedStatus('ALL');
                  setSelectedService('ALL');
                  setSearchQuery('');
                }}
                className="text-xs font-bold text-[#8B3FA8] hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCases.map((c) => (
              <Link
                key={c.id}
                href={`/portal/cases/${c.id}`}
                className="group block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-[#8B3FA8] hover:shadow-md transition-all space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-slate-500">
                      ID: #{c.id}
                    </span>
                    <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-800">
                      {formatServiceLabel(c.serviceType)}
                    </span>
                  </div>

                  <div>{getStatusBadge(c.status)}</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 block">Assigned CA Officer:</span>
                    <span className="font-semibold text-slate-900 mt-0.5 block">
                      {c.assignedTo?.email || 'Senior Tax Partner'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block">Target Statutory Deadline:</span>
                    <span className="font-mono font-semibold text-[#E8823A] mt-0.5 block">
                      {c.dueDate
                        ? new Date(c.dueDate).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })
                        : 'Standard Cycle'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block">Initiated Date:</span>
                    <span className="font-mono text-slate-700 mt-0.5 block">
                      {new Date(c.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                  <div className="flex items-center gap-4 text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5" />
                      {c.documents?.length ?? 0} Documents
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MessageSquare className="h-3.5 w-3.5" />
                      {c.messages?.length ?? 0} Messages
                    </span>
                  </div>

                  <span className="font-bold text-[#8B3FA8] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Open Case Workspace &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
