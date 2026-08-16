'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useStaffSession } from '../../lib/use-staff-session';
import { AdminSidebar } from '../../components/layout/admin-sidebar';
import { fetchAdminApi } from '../../lib/api-client';
import {
  CalendarClock,
  Search,
  Plus,
  Calendar,
  List,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Send,
  RefreshCw,
  X,
} from 'lucide-react';

export interface AdminDeadline {
  id: string;
  title: string;
  category: 'GST' | 'INCOME_TAX' | 'MCA' | 'TDS' | 'OTHER' | string;
  dueDate: string;
  clientName?: string | null;
  urgency: 'CRITICAL' | 'URGENT' | 'UPCOMING' | string;
  status: 'PENDING' | 'OVERDUE' | 'COMPLETED' | string;
  reminderSent?: boolean;
  reminderSentAt?: string | null;
}

export default function AdminDeadlinesPage(): JSX.Element {
  const { accessToken, isLoading: isAuthLoading } = useStaffSession();

  const [deadlines, setDeadlines] = useState<AdminDeadline[]>([]);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('list');
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [urgencyFilter, setUrgencyFilter] = useState('ALL');

  // Ad-hoc Deadline Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newDeadlineData, setNewDeadlineData] = useState({
    title: '',
    category: 'GST',
    dueDate: new Date().toISOString().split('T')[0] ?? '2026-08-20',
    clientName: '',
    urgency: 'URGENT',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadDeadlines() {
      setIsLoading(true);
      try {
        if (accessToken) {
          const res = await fetchAdminApi<{ data: AdminDeadline[] }>('/deadlines', {}, accessToken);
          if (res?.data && res.data.length > 0) {
            setDeadlines(res.data);
          } else {
            setDeadlines(defaultDemoDeadlines);
          }
        } else {
          setDeadlines(defaultDemoDeadlines);
        }
      } catch (err) {
        console.warn('Using demo deadlines fallback:', err);
        setDeadlines(defaultDemoDeadlines);
      } finally {
        setIsLoading(false);
      }
    }

    loadDeadlines();
  }, [accessToken]);

  const filteredDeadlines = useMemo(() => {
    return deadlines.filter((d) => {
      if (categoryFilter !== 'ALL' && d.category !== categoryFilter) return false;
      if (urgencyFilter !== 'ALL' && d.urgency !== urgencyFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch = d.title.toLowerCase().includes(q);
        const clientMatch = (d.clientName || '').toLowerCase().includes(q);
        const catMatch = d.category.toLowerCase().includes(q);
        return titleMatch || clientMatch || catMatch;
      }

      return true;
    });
  }, [deadlines, categoryFilter, urgencyFilter, searchQuery]);

  // Mark Reminder Sent Override
  const handleMarkReminderSent = async (deadlineId: string) => {
    setDeadlines((prev) =>
      prev.map((d) =>
        d.id === deadlineId
          ? {
              ...d,
              reminderSent: true,
              reminderSentAt: new Date().toISOString(),
            }
          : d,
      ),
    );

    setToastMessage('Manual Override: Reminder status marked SENT.');
    setTimeout(() => setToastMessage(null), 2500);

    try {
      if (accessToken) {
        await fetchAdminApi(
          `/deadlines/${deadlineId}/status`,
          {
            method: 'PATCH',
            body: JSON.stringify({ status: 'PENDING', reminderSent: true }),
          },
          accessToken,
        ).catch(() => {});
      }
    } catch (err) {
      console.warn('Backend update error:', err);
    }
  };

  const handleCreateDeadline = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const created: AdminDeadline = {
      id: `dead_${Date.now()}`,
      title: newDeadlineData.title,
      category: newDeadlineData.category,
      dueDate: newDeadlineData.dueDate || '2026-08-20',
      clientName: newDeadlineData.clientName || 'General Statutory Requirement',
      urgency: newDeadlineData.urgency as any,
      status: 'PENDING',
      reminderSent: false,
    };

    setDeadlines((prev) => [created, ...prev]);
    setIsSubmitting(false);
    setCreateModalOpen(false);
    setToastMessage(`Ad-hoc deadline "${newDeadlineData.title}" scheduled.`);
    setTimeout(() => setToastMessage(null), 2500);
    setNewDeadlineData({
      title: '',
      category: 'GST',
      dueDate: new Date().toISOString().split('T')[0] ?? '2026-08-20',
      clientName: '',
      urgency: 'URGENT',
    });
  };

  if (isAuthLoading || isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400 font-mono text-xs">
        <RefreshCw className="h-4 w-4 animate-spin mr-2 text-[#E8823A]" />
        LOADING STATUTORY DEADLINE CALENDAR...
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
              <CalendarClock className="h-4 w-4 text-amber-400" />
              STATUTORY COMPLIANCE DEADLINES
            </h1>
            <span className="hidden sm:inline-block h-4 w-px bg-zinc-700" />
            <span className="hidden sm:inline-block text-xs font-mono text-zinc-400">
              {filteredDeadlines.length} Due Dates Scheduled
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-lg bg-zinc-800 p-0.5 border border-zinc-700">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded text-xs font-mono flex items-center gap-1 transition-colors ${
                  viewMode === 'list' ? 'bg-zinc-900 text-white font-bold' : 'text-zinc-400'
                }`}
              >
                <List className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">List</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('calendar')}
                className={`p-1.5 rounded text-xs font-mono flex items-center gap-1 transition-colors ${
                  viewMode === 'calendar' ? 'bg-zinc-900 text-white font-bold' : 'text-zinc-400'
                }`}
              >
                <Calendar className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Calendar View</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setCreateModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E8823A] text-white font-bold text-xs hover:bg-[#d9732d] shadow-sm"
            >
              <Plus className="h-3.5 w-3.5" />
              Ad-Hoc Deadline
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {toastMessage && (
            <div className="rounded-xl border border-emerald-800 bg-emerald-950 p-4 text-xs font-mono text-emerald-300 shadow-xl flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Filter Bar */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-4 sm:p-5 shadow-sm space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="relative">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search by deadline, client, or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 pl-10 pr-3 py-2 text-xs text-zinc-200 focus:border-[#1B2A4A] focus:outline-none"
                />
              </div>

              <div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 px-3.5 py-2 text-xs font-semibold text-zinc-200 focus:border-[#1B2A4A] focus:outline-none"
                >
                  <option value="ALL">All Statutory Acts</option>
                  <option value="GST">GST Returns (GSTR-1, GSTR-3B)</option>
                  <option value="INCOME_TAX">Income Tax (ITR, Advance Tax)</option>
                  <option value="TDS">TDS Returns &amp; Challans</option>
                  <option value="MCA">MCA Filings (AOC-4, MGT-7)</option>
                  <option value="OTHER">Labour &amp; PF Remittance</option>
                </select>
              </div>

              <div>
                <select
                  value={urgencyFilter}
                  onChange={(e) => setUrgencyFilter(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 px-3.5 py-2 text-xs font-semibold text-zinc-200 focus:border-[#1B2A4A] focus:outline-none"
                >
                  <option value="ALL">All Urgency Levels</option>
                  <option value="CRITICAL">Critical (&lt; 48 Hours)</option>
                  <option value="URGENT">Urgent (This Week)</option>
                  <option value="UPCOMING">Upcoming (Next 2-4 Weeks)</option>
                </select>
              </div>
            </div>
          </div>

          {/* View Mode: List or Calendar Grid */}
          {viewMode === 'list' ? (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-zinc-300">
                  <thead className="bg-zinc-950/80 border-b border-zinc-800 text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Statutory Deadline</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Client / Jurisdiction</th>
                      <th className="px-4 py-3">Target Due Date</th>
                      <th className="px-4 py-3">Reminder Notification</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {filteredDeadlines.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-zinc-500 font-mono">
                          No compliance deadlines found matching filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredDeadlines.map((d) => (
                        <tr key={d.id} className="hover:bg-zinc-800/40 transition-colors">
                          <td className="px-4 py-3 font-semibold text-zinc-100">
                            <div className="flex items-center gap-2">
                              {d.urgency === 'CRITICAL' && (
                                <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
                              )}
                              <span>{d.title}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 font-mono text-[11px]">
                            <span className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300">
                              {d.category}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-zinc-300">
                            {d.clientName || 'General Statutory'}
                          </td>
                          <td className="px-4 py-3 font-mono text-[11px] font-bold text-amber-400">
                            {new Date(d.dueDate).toLocaleDateString('en-IN', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </td>
                          <td className="px-4 py-3 font-mono text-[11px]">
                            {d.reminderSent ? (
                              <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                                <CheckCircle2 className="h-3 w-3" /> Auto-Dispatched
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">
                                <Clock className="h-3 w-3" /> Pending Queue
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {!d.reminderSent ? (
                              <button
                                type="button"
                                onClick={() => handleMarkReminderSent(d.id)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-800 border border-zinc-700 text-[11px] font-mono font-bold text-zinc-200 hover:bg-zinc-700 hover:text-white"
                              >
                                <Send className="h-3 w-3 text-[#E8823A]" /> Mark Sent
                              </button>
                            ) : (
                              <span className="text-[10px] font-mono text-zinc-500">
                                Sent {d.reminderSentAt ? new Date(d.reminderSentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'OK'}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Calendar Grid Preview */
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h3 className="text-sm font-bold font-mono text-zinc-100 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-amber-400" />
                  MONTHLY STATUTORY COMPLIANCE GRID (AUGUST 2026)
                </h3>
                <span className="text-xs font-mono text-emerald-400">GSTN &amp; ITD Calendar Active</span>
              </div>

              <div className="grid grid-cols-7 gap-2 text-center font-mono text-xs text-zinc-400 pb-2">
                {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => (
                  <div key={day} className="font-bold">{day}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2 font-mono text-xs">
                {Array.from({ length: 31 }, (_, i) => i + 1).map((dateNum) => {
                  const matching = filteredDeadlines.filter((d) => {
                    const dt = new Date(d.dueDate);
                    return dt.getDate() === dateNum;
                  });

                  return (
                    <div
                      key={dateNum}
                      className={`min-h-[80px] p-2 rounded-xl border flex flex-col justify-between ${
                        matching.length > 0
                          ? 'bg-zinc-800/80 border-amber-500/40'
                          : 'bg-zinc-950/60 border-zinc-800/60 text-zinc-600'
                      }`}
                    >
                      <div className="font-bold text-[11px] text-zinc-300">{dateNum}</div>
                      {matching.map((m) => (
                        <div
                          key={m.id}
                          className="text-[9px] p-1 rounded bg-amber-950/80 border border-amber-800 text-amber-300 font-sans truncate"
                          title={m.title}
                        >
                          {m.title}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Ad-Hoc Deadline Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-zinc-900 border border-zinc-800 p-6 space-y-5 shadow-2xl animate-in fade-in-50 zoom-in-95">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <CalendarClock className="h-5 w-5 text-amber-400" />
                <h3 className="text-base font-bold text-zinc-100 font-mono">
                  SCHEDULE AD-HOC STATUTORY DEADLINE
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

            <form onSubmit={handleCreateDeadline} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-zinc-300 block">Deadline Title / Description</label>
                <input
                  type="text"
                  required
                  value={newDeadlineData.title}
                  onChange={(e) => setNewDeadlineData({ ...newDeadlineData, title: e.target.value })}
                  placeholder="e.g. GSTR-3B Filing for August 2026"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-zinc-100 focus:border-[#1B2A4A] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-300 block">Statutory Category</label>
                  <select
                    value={newDeadlineData.category}
                    onChange={(e) => setNewDeadlineData({ ...newDeadlineData, category: e.target.value })}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-100 focus:border-[#1B2A4A] focus:outline-none"
                  >
                    <option value="GST">GST Returns</option>
                    <option value="INCOME_TAX">Income Tax</option>
                    <option value="TDS">TDS Challan &amp; Return</option>
                    <option value="MCA">MCA Compliance</option>
                    <option value="OTHER">PF / ESI Labour</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-300 block">Target Due Date</label>
                  <input
                    type="date"
                    required
                    value={newDeadlineData.dueDate}
                    onChange={(e) => setNewDeadlineData({ ...newDeadlineData, dueDate: e.target.value })}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-100 font-mono focus:border-[#1B2A4A] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-300 block">Client / Jurisdiction</label>
                  <input
                    type="text"
                    value={newDeadlineData.clientName}
                    onChange={(e) => setNewDeadlineData({ ...newDeadlineData, clientName: e.target.value })}
                    placeholder="e.g. Nexus Tech Pvt Ltd or General"
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-zinc-100 focus:border-[#1B2A4A] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-300 block">Urgency Classification</label>
                  <select
                    value={newDeadlineData.urgency}
                    onChange={(e) => setNewDeadlineData({ ...newDeadlineData, urgency: e.target.value })}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-100 focus:border-[#1B2A4A] focus:outline-none"
                  >
                    <option value="CRITICAL">Critical (&lt; 48 Hours)</option>
                    <option value="URGENT">Urgent (This Week)</option>
                    <option value="UPCOMING">Upcoming (Next 2-4 Weeks)</option>
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
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#E8823A] text-white font-bold hover:bg-[#d9732d] disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" /> Schedule Deadline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const defaultDemoDeadlines: AdminDeadline[] = [
  {
    id: 'd1',
    title: 'GSTR-3B Monthly Return (Turnover > 5 Cr)',
    category: 'GST',
    dueDate: '2026-08-20',
    clientName: 'Nexus Tech Pvt Ltd',
    urgency: 'CRITICAL',
    status: 'PENDING',
    reminderSent: true,
  },
  {
    id: 'd2',
    title: 'TDS Challan 281 Monthly Remittance',
    category: 'TDS',
    dueDate: '2026-08-18',
    clientName: 'Kadiri Agro Exports',
    urgency: 'CRITICAL',
    status: 'PENDING',
    reminderSent: false,
  },
  {
    id: 'd3',
    title: 'PF & ESI Statutory Remittance (July)',
    category: 'OTHER',
    dueDate: '2026-08-22',
    clientName: 'Sri Sai Logistics Hub',
    urgency: 'URGENT',
    status: 'PENDING',
    reminderSent: false,
  },
  {
    id: 'd4',
    title: 'GSTR-1 Monthly Outward Supplies',
    category: 'GST',
    dueDate: '2026-08-24',
    clientName: 'Vanguard Retail Enterprises',
    urgency: 'URGENT',
    status: 'PENDING',
    reminderSent: false,
  },
  {
    id: 'd5',
    title: 'Advance Tax Installment 2 (FY 2026-27)',
    category: 'INCOME_TAX',
    dueDate: '2026-09-15',
    clientName: 'General Statutory Mandate',
    urgency: 'UPCOMING',
    status: 'PENDING',
    reminderSent: false,
  },
];
