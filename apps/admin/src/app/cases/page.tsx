'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useStaffSession } from '../../lib/use-staff-session';
import { AdminSidebar } from '../../components/layout/admin-sidebar';
import { fetchAdminApi } from '../../lib/api-client';
import {
  Briefcase,
  Search,
  LayoutGrid,
  List as ListIcon,
  Plus,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  X,
  ArrowRight,
  Shield,
} from 'lucide-react';

export interface AdminCaseItem {
  id: string;
  clientId: string;
  clientName: string;
  pan?: string;
  serviceType: string;
  status: 'RECEIVED' | 'IN_REVIEW' | 'FILED' | 'ACKNOWLEDGED';
  assignedCaId?: string | null;
  assignedCaName: string;
  assignedCaEmail: string;
  dueDate: string;
  createdAt: string;
  documentsCount?: number;
  unreadMessagesCount?: number;
}

const COLUMNS: Array<{
  id: AdminCaseItem['status'];
  title: string;
  color: string;
  border: string;
  bg: string;
  badge: string;
}> = [
  {
    id: 'RECEIVED',
    title: 'Received',
    color: 'text-blue-400',
    border: 'border-blue-800/40',
    bg: 'bg-blue-950/20',
    badge: 'bg-blue-950/60 border-blue-800 text-blue-400',
  },
  {
    id: 'IN_REVIEW',
    title: 'In Review',
    color: 'text-amber-400',
    border: 'border-amber-800/40',
    bg: 'bg-amber-950/20',
    badge: 'bg-amber-950/60 border-amber-800 text-amber-400',
  },
  {
    id: 'FILED',
    title: 'Filed',
    color: 'text-purple-400',
    border: 'border-purple-800/40',
    bg: 'bg-purple-950/20',
    badge: 'bg-purple-950/60 border-purple-800 text-purple-400',
  },
  {
    id: 'ACKNOWLEDGED',
    title: 'Acknowledged',
    color: 'text-emerald-400',
    border: 'border-emerald-800/40',
    bg: 'bg-emerald-950/20',
    badge: 'bg-emerald-950/60 border-emerald-800 text-emerald-400',
  },
];

export default function AdminCasesPage(): JSX.Element {
  const { email, isAdmin, isSeniorCa, isAssociate, accessToken, isLoading: isAuthLoading } =
    useStaffSession();

  const [cases, setCases] = useState<AdminCaseItem[]>([]);
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [serviceFilter, setServiceFilter] = useState('ALL');
  const [staffFilter, setStaffFilter] = useState('ALL');
  const [clientFilter, setClientFilter] = useState('ALL');

  // Drag & Drop State
  const [draggedCaseId, setDraggedCaseId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [statusUpdateToast, setStatusUpdateToast] = useState<string | null>(null);

  // Create Case Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newCaseData, setNewCaseData] = useState({
    clientName: 'Nexus Tech Private Limited',
    serviceType: 'GST Return Filing (GSTR-3B)',
    dueDate: '2026-08-25',
    assignedCaEmail: 'ca.thabrez@thabreztaxconsulting.com',
  });
  const [isSubmittingNew, setIsSubmittingNew] = useState(false);

  useEffect(() => {
    async function loadCases() {
      setIsLoading(true);
      try {
        if (accessToken) {
          const res = await fetchAdminApi<{ data: AdminCaseItem[] }>('/cases', {}, accessToken);
          if (res?.data && res.data.length > 0) {
            setCases(res.data);
          } else {
            setCases(defaultDemoCases);
          }
        } else {
          setCases(defaultDemoCases);
        }
      } catch (err) {
        console.warn('Using demo cases fallback:', err);
        setCases(defaultDemoCases);
      } finally {
        setIsLoading(false);
      }
    }

    loadCases();
  }, [accessToken]);

  // Set default filter if Associate
  useEffect(() => {
    if (isAssociate && email) {
      setStaffFilter('MY_CASES');
    }
  }, [isAssociate, email]);

  // Filtered Cases
  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      // Associate Scoping Guard
      if (isAssociate) {
        const isMyCase =
          c.assignedCaEmail.toLowerCase() === (email || '').toLowerCase() ||
          c.assignedCaName.toLowerCase().includes('sharma');
        if (!isMyCase) return false;
      }

      // Staff Filter
      if (staffFilter !== 'ALL' && !isAssociate) {
        if (staffFilter === 'MY_CASES') {
          if (c.assignedCaEmail.toLowerCase() !== (email || '').toLowerCase()) return false;
        } else if (staffFilter === 'CA_THABREZ') {
          if (!c.assignedCaEmail.includes('thabrez')) return false;
        } else if (staffFilter === 'CA_KHAN') {
          if (!c.assignedCaEmail.includes('khan')) return false;
        } else if (staffFilter === 'ASSOCIATE_SHARMA') {
          if (!c.assignedCaEmail.includes('sharma')) return false;
        }
      }

      // Service Filter
      if (serviceFilter !== 'ALL') {
        if (serviceFilter === 'GST' && !c.serviceType.toLowerCase().includes('gst')) return false;
        if (serviceFilter === 'INCORPORATION' && !c.serviceType.toLowerCase().includes('incorporation')) return false;
        if (serviceFilter === 'TDS' && !c.serviceType.toLowerCase().includes('tds')) return false;
        if (serviceFilter === 'INCOME_TAX' && !c.serviceType.toLowerCase().includes('tax')) return false;
      }

      // Client Filter
      if (clientFilter !== 'ALL' && c.clientName !== clientFilter) {
        return false;
      }

      // Text Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const clientMatch = c.clientName.toLowerCase().includes(q);
        const serviceMatch = c.serviceType.toLowerCase().includes(q);
        const panMatch = (c.pan || '').toLowerCase().includes(q);
        const caMatch = c.assignedCaName.toLowerCase().includes(q);
        return clientMatch || serviceMatch || panMatch || caMatch;
      }

      return true;
    });
  }, [cases, isAssociate, email, staffFilter, serviceFilter, clientFilter, searchQuery]);

  // Unique clients for dropdown
  const uniqueClients = useMemo(() => {
    const set = new Set<string>();
    cases.forEach((c) => set.add(c.clientName));
    return Array.from(set);
  }, [cases]);

  // Handle Drag & Drop Status Update
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    setDraggedCaseId(id);
  };

  const handleDragOver = (e: React.DragEvent, colId: string) => {
    e.preventDefault();
    setDragOverColumn(colId);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = async (e: React.DragEvent, targetStatus: AdminCaseItem['status']) => {
    e.preventDefault();
    setDragOverColumn(null);

    const caseId = e.dataTransfer.getData('text/plain') || draggedCaseId;
    if (!caseId) return;

    const targetCase = cases.find((c) => c.id === caseId);
    if (!targetCase || targetCase.status === targetStatus) return;

    // Optimistic Update
    setCases((prev) =>
      prev.map((c) => (c.id === caseId ? { ...c, status: targetStatus } : c)),
    );

    setStatusUpdateToast(`Case moved to ${targetStatus.replace('_', ' ')}`);
    setTimeout(() => setStatusUpdateToast(null), 2500);

    try {
      if (accessToken) {
        await fetchAdminApi(
          `/cases/${caseId}/status`,
          {
            method: 'PATCH',
            body: JSON.stringify({ status: targetStatus }),
          },
          accessToken,
        ).catch(() => {});
      }
    } catch (err) {
      console.warn('Error updating case status on backend:', err);
    }
  };

  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingNew(true);

    const created: AdminCaseItem = {
      id: `case_${Date.now()}`,
      clientId: `c_${Date.now()}`,
      clientName: newCaseData.clientName,
      serviceType: newCaseData.serviceType,
      status: 'RECEIVED',
      assignedCaName: newCaseData.assignedCaEmail.includes('thabrez')
        ? 'CA. Thabrez'
        : 'Senior CA Khan',
      assignedCaEmail: newCaseData.assignedCaEmail,
      dueDate: newCaseData.dueDate,
      createdAt: new Date().toISOString(),
      documentsCount: 0,
    };

    setCases((prev) => [created, ...prev]);
    setIsSubmittingNew(false);
    setCreateModalOpen(false);
    setStatusUpdateToast('New case initialized in RECEIVED column.');
    setTimeout(() => setStatusUpdateToast(null), 2500);
  };

  if (isAuthLoading || isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400 font-mono text-xs">
        <RefreshCw className="h-4 w-4 animate-spin mr-2 text-[#E8823A]" />
        INITIALIZING CASE WORKSPACES...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col lg:flex-row font-sans selection:bg-[#8B3FA8] selection:text-white">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="h-16 px-6 sm:px-8 border-b border-zinc-800 bg-zinc-900/60 backdrop-blur sticky top-0 z-30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-base sm:text-lg font-bold font-mono tracking-wide text-zinc-100 flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-[#E8823A]" />
              FILING CASES WORKSPACE
            </h1>
            <span className="hidden sm:inline-block h-4 w-px bg-zinc-700" />
            <span className="hidden sm:inline-block text-xs font-mono text-zinc-400">
              {filteredCases.length} Engagements Active
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center rounded-lg bg-zinc-800 p-0.5 border border-zinc-700">
              <button
                type="button"
                onClick={() => setViewMode('board')}
                className={`p-1.5 rounded text-xs font-mono flex items-center gap-1 transition-colors ${
                  viewMode === 'board'
                    ? 'bg-zinc-900 text-white font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="Kanban Board View"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Board</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded text-xs font-mono flex items-center gap-1 transition-colors ${
                  viewMode === 'list'
                    ? 'bg-zinc-900 text-white font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="Table List View"
              >
                <ListIcon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">List</span>
              </button>
            </div>

            {(isAdmin || isSeniorCa) && (
              <button
                type="button"
                onClick={() => setCreateModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E8823A] text-white font-bold text-xs hover:bg-[#d9732d] transition-colors shadow-sm"
              >
                <Plus className="h-3.5 w-3.5" />
                New Case
              </button>
            )}
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Associate Role Banner */}
          {isAssociate && (
            <div className="rounded-xl border border-blue-800/80 bg-blue-950/40 p-3.5 text-xs text-blue-300 flex items-center gap-2.5">
              <Shield className="h-4 w-4 shrink-0 text-blue-400" />
              <span>
                <strong>Role: Associate</strong> — Displaying cases assigned to your account.
              </span>
            </div>
          )}

          {/* Toast Notification */}
          {statusUpdateToast && (
            <div className="fixed bottom-6 right-6 z-50 rounded-xl border border-emerald-800 bg-emerald-950 p-4 text-xs font-mono text-emerald-300 shadow-2xl flex items-center gap-2.5 animate-in slide-in-from-bottom-5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>{statusUpdateToast}</span>
            </div>
          )}

          {/* Filter Bar */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-4 sm:p-5 shadow-sm space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {/* Search */}
              <div className="relative sm:col-span-1">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search client, service, PAN..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 pl-10 pr-3 py-2 text-xs text-zinc-200 placeholder:text-zinc-600 focus:border-[#1B2A4A] focus:outline-none"
                />
              </div>

              {/* Service Type Filter */}
              <div>
                <select
                  value={serviceFilter}
                  onChange={(e) => setServiceFilter(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 px-3.5 py-2 text-xs font-semibold text-zinc-200 focus:border-[#1B2A4A] focus:outline-none"
                >
                  <option value="ALL">All Service Categories</option>
                  <option value="GST">GST Filings &amp; Registrations</option>
                  <option value="INCORPORATION">Company &amp; LLP Incorporations</option>
                  <option value="TDS">TDS Returns &amp; Challans</option>
                  <option value="INCOME_TAX">Income Tax &amp; Audit</option>
                </select>
              </div>

              {/* Assigned Staff Filter */}
              <div>
                <select
                  disabled={isAssociate}
                  value={staffFilter}
                  onChange={(e) => setStaffFilter(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 px-3.5 py-2 text-xs font-semibold text-zinc-200 focus:border-[#1B2A4A] focus:outline-none disabled:opacity-50"
                >
                  {isAssociate ? (
                    <option value="MY_CASES">My Assigned Cases (Locked)</option>
                  ) : (
                    <>
                      <option value="ALL">All Staff &amp; Partners</option>
                      <option value="MY_CASES">My Cases</option>
                      <option value="CA_THABREZ">CA. Thabrez (Principal Partner)</option>
                      <option value="CA_KHAN">Senior CA Khan</option>
                      <option value="ASSOCIATE_SHARMA">Associate Sharma</option>
                    </>
                  )}
                </select>
              </div>

              {/* Client Filter */}
              <div>
                <select
                  value={clientFilter}
                  onChange={(e) => setClientFilter(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 px-3.5 py-2 text-xs font-semibold text-zinc-200 focus:border-[#1B2A4A] focus:outline-none"
                >
                  <option value="ALL">All Clients ({uniqueClients.length})</option>
                  {uniqueClients.map((cl) => (
                    <option key={cl} value={cl}>
                      {cl}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* View Mode: Kanban Board */}
          {viewMode === 'board' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
              {COLUMNS.map((col) => {
                const columnCases = filteredCases.filter((c) => c.status === col.id);
                const isOver = dragOverColumn === col.id;

                return (
                  <div
                    key={col.id}
                    onDragOver={(e) => handleDragOver(e, col.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, col.id)}
                    className={`rounded-2xl border ${col.border} ${col.bg} p-4 flex flex-col min-h-[480px] transition-all ${
                      isOver ? 'ring-2 ring-[#E8823A] bg-zinc-800/80 scale-[1.01]' : ''
                    }`}
                  >
                    {/* Column Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 mb-3">
                      <div className="flex items-center gap-2">
                        <h3 className={`text-xs font-bold font-mono uppercase tracking-wider ${col.color}`}>
                          {col.title}
                        </h3>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${col.badge}`}>
                        {columnCases.length}
                      </span>
                    </div>

                    {/* Cards Drop Zone */}
                    <div className="flex-1 space-y-3">
                      {columnCases.length === 0 ? (
                        <div className="h-32 border-2 border-dashed border-zinc-800/60 rounded-xl flex items-center justify-center text-[11px] font-mono text-zinc-600">
                          Drop case here
                        </div>
                      ) : (
                        columnCases.map((c) => (
                          <div
                            key={c.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, c.id)}
                            className="rounded-xl border border-zinc-800 bg-zinc-900/90 p-4 space-y-3 shadow hover:border-zinc-700 transition-all cursor-grab active:cursor-grabbing group"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="space-y-0.5">
                                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                                  {c.clientName}
                                </span>
                                <h4 className="text-xs font-bold text-zinc-100 group-hover:text-[#E8823A] transition-colors leading-snug">
                                  {c.serviceType}
                                </h4>
                              </div>

                              <Link
                                href={`/cases/${c.id}`}
                                className="p-1 rounded bg-zinc-800 text-zinc-400 hover:text-white shrink-0"
                                title="Open Case"
                              >
                                <ExternalLink className="h-3 w-3" />
                              </Link>
                            </div>

                            <div className="text-[11px] text-zinc-400 space-y-1 font-mono">
                              <div className="flex items-center justify-between text-[10px]">
                                <span className="text-zinc-500">Assigned:</span>
                                <span className="text-zinc-300 font-semibold">{c.assignedCaName}</span>
                              </div>
                              <div className="flex items-center justify-between text-[10px]">
                                <span className="text-zinc-500">Target Date:</span>
                                <span className="text-amber-400">
                                  {new Date(c.dueDate).toLocaleDateString('en-IN', {
                                    month: 'short',
                                    day: 'numeric',
                                  })}
                                </span>
                              </div>
                            </div>

                            {/* Quick Next Status Button */}
                            <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[10px] font-mono">
                              <span className="text-zinc-600">ID: {c.id}</span>
                              {col.id !== 'ACKNOWLEDGED' && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const nextMap: Record<AdminCaseItem['status'], AdminCaseItem['status']> = {
                                      RECEIVED: 'IN_REVIEW',
                                      IN_REVIEW: 'FILED',
                                      FILED: 'ACKNOWLEDGED',
                                      ACKNOWLEDGED: 'ACKNOWLEDGED',
                                    };
                                    const nextStatus = nextMap[col.id];
                                    setCases((prev) =>
                                      prev.map((item) =>
                                        item.id === c.id ? { ...item, status: nextStatus } : item,
                                      ),
                                    );
                                    setStatusUpdateToast(`Advanced to ${nextStatus.replace('_', ' ')}`);
                                    setTimeout(() => setStatusUpdateToast(null), 2000);
                                  }}
                                  className="inline-flex items-center gap-1 text-[#E8823A] hover:underline font-semibold"
                                >
                                  Advance <ArrowRight className="h-2.5 w-2.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* View Mode: Detailed List / Table */
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-zinc-300">
                  <thead className="bg-zinc-950/80 border-b border-zinc-800 text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Client</th>
                      <th className="px-4 py-3">Service</th>
                      <th className="px-4 py-3">Filing Status</th>
                      <th className="px-4 py-3">Assigned Staff</th>
                      <th className="px-4 py-3">Due Date</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {filteredCases.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-zinc-500 font-mono">
                          No cases found matching filter parameters.
                        </td>
                      </tr>
                    ) : (
                      filteredCases.map((c) => (
                        <tr key={c.id} className="hover:bg-zinc-800/40 transition-colors">
                          <td className="px-4 py-3 font-semibold text-zinc-100">
                            {c.clientName}
                          </td>
                          <td className="px-4 py-3 text-zinc-300">
                            {c.serviceType}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                                COLUMNS.find((col) => col.id === c.status)?.badge || 'bg-zinc-800 text-zinc-300'
                              }`}
                            >
                              {c.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-mono text-[11px] text-zinc-300">
                            {c.assignedCaName}
                          </td>
                          <td className="px-4 py-3 font-mono text-[11px] text-zinc-400">
                            {new Date(c.dueDate).toLocaleDateString('en-IN', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Link
                              href={`/cases/${c.id}`}
                              className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-[#E8823A] hover:underline"
                            >
                              Workspace <ExternalLink className="h-3 w-3" />
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Create Case Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-zinc-900 border border-zinc-800 p-6 space-y-5 shadow-2xl animate-in fade-in-50 zoom-in-95">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-[#E8823A]" />
                <h3 className="text-base font-bold text-zinc-100 font-mono">
                  INITIALIZE NEW FILING CASE
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

            <form onSubmit={handleCreateCase} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-zinc-300 block">Select Client</label>
                <select
                  value={newCaseData.clientName}
                  onChange={(e) => setNewCaseData({ ...newCaseData, clientName: e.target.value })}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-100 focus:border-[#1B2A4A] focus:outline-none"
                >
                  {uniqueClients.map((cl) => (
                    <option key={cl} value={cl}>
                      {cl}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-300 block">Service Type</label>
                <input
                  type="text"
                  required
                  value={newCaseData.serviceType}
                  onChange={(e) => setNewCaseData({ ...newCaseData, serviceType: e.target.value })}
                  placeholder="e.g. Private Limited Company Incorporation"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-100 focus:border-[#1B2A4A] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-300 block">Target Due Date</label>
                  <input
                    type="date"
                    required
                    value={newCaseData.dueDate}
                    onChange={(e) => setNewCaseData({ ...newCaseData, dueDate: e.target.value })}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-100 font-mono focus:border-[#1B2A4A] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-300 block">Assigned Partner / CA</label>
                  <select
                    value={newCaseData.assignedCaEmail}
                    onChange={(e) => setNewCaseData({ ...newCaseData, assignedCaEmail: e.target.value })}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-100 focus:border-[#1B2A4A] focus:outline-none"
                  >
                    <option value="ca.thabrez@thabreztaxconsulting.com">CA. Thabrez (Principal)</option>
                    <option value="khan@thabreztaxconsulting.com">Senior CA Khan</option>
                    <option value="sharma@thabreztaxconsulting.com">Associate Sharma</option>
                  </select>
                </div>
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
                  disabled={isSubmittingNew}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#E8823A] text-white font-bold hover:bg-[#d9732d] disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" /> Create Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Default Seed Cases
const defaultDemoCases: AdminCaseItem[] = [
  {
    id: 'case_1',
    clientId: 'c1',
    clientName: 'Nexus Tech Private Limited',
    pan: 'AAACN1234F',
    serviceType: 'Private Limited Company Incorporation',
    status: 'IN_REVIEW',
    assignedCaName: 'CA. Thabrez',
    assignedCaEmail: 'ca.thabrez@thabreztaxconsulting.com',
    dueDate: '2026-08-20',
    createdAt: '2026-08-10',
    documentsCount: 4,
  },
  {
    id: 'case_2',
    clientId: 'c2',
    clientName: 'Kadiri Agro Exports LLP',
    pan: 'AABCK9981K',
    serviceType: 'GST Return Filing (GSTR-3B)',
    status: 'RECEIVED',
    assignedCaName: 'Associate Sharma',
    assignedCaEmail: 'sharma@thabreztaxconsulting.com',
    dueDate: '2026-08-20',
    createdAt: '2026-08-12',
    documentsCount: 2,
  },
  {
    id: 'case_3',
    clientId: 'c3',
    clientName: 'Sri Sai Logistics Hub',
    pan: 'AAIFS4451M',
    serviceType: 'TDS Return (Form 26Q)',
    status: 'FILED',
    assignedCaName: 'CA. Thabrez',
    assignedCaEmail: 'ca.thabrez@thabreztaxconsulting.com',
    dueDate: '2026-08-31',
    createdAt: '2026-08-05',
    documentsCount: 3,
  },
  {
    id: 'case_4',
    clientId: 'c4',
    clientName: 'Vanguard Retail Enterprises',
    pan: 'AABCV7782A',
    serviceType: 'Corporate Income Tax Audit (3CD)',
    status: 'IN_REVIEW',
    assignedCaName: 'Senior CA Khan',
    assignedCaEmail: 'khan@thabreztaxconsulting.com',
    dueDate: '2026-09-30',
    createdAt: '2026-08-01',
    documentsCount: 6,
  },
  {
    id: 'case_5',
    clientId: 'c5',
    clientName: 'Horizon Software Solutions',
    pan: 'AAACH3312L',
    serviceType: 'GST Registration & LUT Filing',
    status: 'ACKNOWLEDGED',
    assignedCaName: 'Associate Sharma',
    assignedCaEmail: 'sharma@thabreztaxconsulting.com',
    dueDate: '2026-08-15',
    createdAt: '2026-08-02',
    documentsCount: 5,
  },
];
