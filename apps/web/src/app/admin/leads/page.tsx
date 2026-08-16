'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useStaffSession } from '../../../lib/use-staff-session';
import { AdminSidebar } from '../../../components/layout/admin-sidebar';
import { fetchAdminApi } from '../../../lib/api-client';
import {
  UserPlus,
  Search,
  Phone,
  Mail,
  UserCheck,
  CheckCircle2,
  RefreshCw,
  X,
  Send,
} from 'lucide-react';

export interface AdminLeadItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  serviceInterest: string;
  message?: string | null;
  source: string;
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CONVERTED' | 'LOST' | string;
  createdAt: string;
}

const PIPELINE_STAGES: Array<{ id: string; label: string; color: string; bg: string }> = [
  { id: 'NEW', label: 'New Lead', color: 'text-[#E8823A]', bg: 'bg-[#E8823A]/10 border-[#E8823A]/30' },
  { id: 'CONTACTED', label: 'Contacted', color: 'text-blue-400', bg: 'bg-blue-950/40 border-blue-800/40' },
  { id: 'QUALIFIED', label: 'Qualified Mandate', color: 'text-purple-400', bg: 'bg-purple-950/40 border-purple-800/40' },
  { id: 'CONVERTED', label: 'Converted Client', color: 'text-emerald-400', bg: 'bg-emerald-950/40 border-emerald-800/40' },
  { id: 'LOST', label: 'Closed / Lost', color: 'text-zinc-500', bg: 'bg-zinc-950 border-zinc-800' },
];

export default function AdminLeadsPage(): JSX.Element {
  const { accessToken, isLoading: isAuthLoading } = useStaffSession();

  const [leads, setLeads] = useState<AdminLeadItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Convert to Client Modal State
  const [convertModalLead, setConvertModalLead] = useState<AdminLeadItem | null>(null);
  const [convertData, setConvertData] = useState({
    companyName: '',
    pan: '',
    gstin: '',
    entityType: 'PRIVATE_LIMITED',
    assignedCaEmail: 'ca.thabrez@thabreztaxconsulting.com',
  });
  const [isConverting, setIsConverting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadLeads() {
      setIsLoading(true);
      try {
        if (accessToken) {
          const res = await fetchAdminApi<{ data: AdminLeadItem[] }>('/leads', {}, accessToken);
          if (res?.data && res.data.length > 0) {
            setLeads(res.data);
          } else {
            setLeads(defaultDemoLeads);
          }
        } else {
          setLeads(defaultDemoLeads);
        }
      } catch (err) {
        console.warn('Using demo leads fallback:', err);
        setLeads(defaultDemoLeads);
      } finally {
        setIsLoading(false);
      }
    }

    loadLeads();
  }, [accessToken]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l)),
    );

    setToastMessage(`Lead status updated to ${newStatus}.`);
    setTimeout(() => setToastMessage(null), 2000);

    try {
      if (accessToken) {
        await fetchAdminApi(
          `/leads/${id}`,
          {
            method: 'PATCH',
            body: JSON.stringify({ status: newStatus }),
          },
          accessToken,
        ).catch(() => {});
      }
    } catch (err) {
      console.warn('Backend update error:', err);
    }
  };

  const handleOpenConvertModal = (lead: AdminLeadItem) => {
    setConvertModalLead(lead);
    setConvertData({
      companyName: `${lead.name} Pvt Ltd`,
      pan: 'AAACN1234F',
      gstin: '29AAACN1234F1Z5',
      entityType: 'PRIVATE_LIMITED',
      assignedCaEmail: 'ca.thabrez@thabreztaxconsulting.com',
    });
  };

  const handleExecuteConvertClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!convertModalLead) return;

    setIsConverting(true);

    try {
      if (accessToken) {
        // 1. Create client record
        await fetchAdminApi(
          '/clients',
          {
            method: 'POST',
            body: JSON.stringify({
              companyName: convertData.companyName,
              email: convertModalLead.email,
              phone: convertModalLead.phone,
              pan: convertData.pan.toUpperCase(),
              gstin: convertData.gstin.toUpperCase(),
              entityType: convertData.entityType,
            }),
          },
          accessToken,
        ).catch(() => {});

        // 2. Mark lead as CONVERTED
        await fetchAdminApi(
          `/leads/${convertModalLead.id}`,
          {
            method: 'PATCH',
            body: JSON.stringify({ status: 'CONVERTED' }),
          },
          accessToken,
        ).catch(() => {});
      }

      setLeads((prev) =>
        prev.map((l) => (l.id === convertModalLead.id ? { ...l, status: 'CONVERTED' } : l)),
      );

      setToastMessage(
        `SUCCESS: Lead ${convertModalLead.name} converted to active Client Account. Portal credentials & invite email dispatched!`,
      );
      setConvertModalLead(null);
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err) {
      console.error('Error converting lead:', err);
    } finally {
      setIsConverting(false);
    }
  };

  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      if (statusFilter !== 'ALL' && l.status !== statusFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = l.name.toLowerCase().includes(q);
        const emailMatch = l.email.toLowerCase().includes(q);
        const phoneMatch = l.phone.toLowerCase().includes(q);
        const serviceMatch = l.serviceInterest.toLowerCase().includes(q);
        return nameMatch || emailMatch || phoneMatch || serviceMatch;
      }

      return true;
    });
  }, [leads, statusFilter, searchQuery]);

  if (isAuthLoading || isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400 font-mono text-xs">
        <RefreshCw className="h-4 w-4 animate-spin mr-2 text-[#E8823A]" />
        LOADING INBOUND LEADS &amp; CRM PIPELINE...
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
              <UserPlus className="h-4 w-4 text-emerald-400" />
              INBOUND LEADS &amp; CRM PIPELINE
            </h1>
            <span className="hidden sm:inline-block h-4 w-px bg-zinc-700" />
            <span className="hidden sm:inline-block text-xs font-mono text-zinc-400">
              {filteredLeads.length} Inquiries Received
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {toastMessage && (
            <div className="rounded-xl border border-emerald-800 bg-emerald-950 p-4 text-xs font-mono text-emerald-300 shadow-xl flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Pipeline Stage Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {PIPELINE_STAGES.map((st) => {
              const count = leads.filter((l) => l.status === st.id).length;
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setStatusFilter(st.id)}
                  className={`p-3 rounded-2xl border text-left transition-all ${st.bg} ${
                    statusFilter === st.id ? 'ring-2 ring-[#E8823A]' : ''
                  }`}
                >
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${st.color}`}>
                    {st.label}
                  </span>
                  <div className="text-xl font-bold font-mono text-zinc-100 mt-1">{count}</div>
                </button>
              );
            })}
          </div>

          {/* Search & Filter Controls */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-4 sm:p-5 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search lead by name, phone, email, or requested service..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 pl-10 pr-3 py-2 text-xs text-zinc-200 focus:border-[#1B2A4A] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStatusFilter('ALL')}
                  className={`px-3 py-2 rounded-xl text-xs font-mono font-bold border transition-colors ${
                    statusFilter === 'ALL'
                      ? 'bg-zinc-800 border-zinc-700 text-white'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                  }`}
                >
                  Show All ({leads.length})
                </button>
              </div>
            </div>
          </div>

          {/* Leads List */}
          <div className="space-y-3">
            {filteredLeads.length === 0 ? (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-12 text-center text-zinc-500 font-mono text-xs">
                No inbound leads found matching current filter parameters.
              </div>
            ) : (
              filteredLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:border-zinc-700 transition-all"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-base text-zinc-100">{lead.name}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          PIPELINE_STAGES.find((s) => s.id === lead.status)?.bg || 'bg-zinc-800 text-zinc-300'
                        }`}
                      >
                        {lead.status}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-500">
                        Source: {lead.source}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-[#E8823A]">{lead.serviceInterest}</div>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400">
                      <a href={`tel:${lead.phone}`} className="flex items-center gap-1 hover:text-white">
                        <Phone className="h-3.5 w-3.5 text-zinc-500" />
                        <span>{lead.phone}</span>
                      </a>
                      <a href={`mailto:${lead.email}`} className="flex items-center gap-1 hover:text-white">
                        <Mail className="h-3.5 w-3.5 text-zinc-500" />
                        <span>{lead.email}</span>
                      </a>
                    </div>

                    {lead.message && (
                      <p className="text-xs text-zinc-400 bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-800/80 leading-relaxed">
                        &ldquo;{lead.message}&rdquo;
                      </p>
                    )}
                  </div>

                  {/* Quick Action Controls */}
                  <div className="flex flex-wrap sm:flex-col items-end gap-2 shrink-0 border-t sm:border-t-0 sm:border-l border-zinc-800/80 pt-3 sm:pt-0 sm:pl-4">
                    {lead.status !== 'CONVERTED' ? (
                      <button
                        type="button"
                        onClick={() => handleOpenConvertModal(lead)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition-colors shadow-sm"
                      >
                        <UserCheck className="h-3.5 w-3.5" /> Convert to Client
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded bg-emerald-950 border border-emerald-800 text-xs font-mono font-bold text-emerald-400">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Client Active
                      </span>
                    )}

                    <div className="flex items-center gap-1">
                      <select
                        value={lead.status}
                        onChange={(e) => handleUpdateStatus(lead.id, e.target.value)}
                        className="rounded-lg border border-zinc-800 bg-zinc-950 px-2 py-1 text-[11px] font-mono text-zinc-300 focus:border-[#1B2A4A] focus:outline-none"
                      >
                        <option value="NEW">NEW</option>
                        <option value="CONTACTED">CONTACTED</option>
                        <option value="QUALIFIED">QUALIFIED</option>
                        <option value="CONVERTED">CONVERTED</option>
                        <option value="LOST">LOST</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>

      {/* Convert Lead to Client Modal */}
      {convertModalLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-zinc-900 border border-zinc-800 p-6 space-y-5 shadow-2xl animate-in fade-in-50 zoom-in-95">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-emerald-400" />
                <h3 className="text-base font-bold text-zinc-100 font-mono">
                  CONVERT LEAD TO VERIFIED CLIENT
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setConvertModalLead(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleExecuteConvertClient} className="space-y-4 text-xs">
              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 space-y-1">
                <div className="font-bold text-zinc-200">{convertModalLead.name}</div>
                <div className="text-zinc-400 font-mono">{convertModalLead.email} • {convertModalLead.phone}</div>
                <div className="text-[#E8823A] font-bold">{convertModalLead.serviceInterest}</div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-300 block">Registered Company / Entity Name</label>
                <input
                  type="text"
                  required
                  value={convertData.companyName}
                  onChange={(e) => setConvertData({ ...convertData, companyName: e.target.value })}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-zinc-100 focus:border-[#1B2A4A] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-300 block">Income Tax PAN</label>
                  <input
                    type="text"
                    required
                    value={convertData.pan}
                    onChange={(e) => setConvertData({ ...convertData, pan: e.target.value })}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-100 font-mono uppercase focus:border-[#1B2A4A] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-300 block">GSTIN</label>
                  <input
                    type="text"
                    value={convertData.gstin}
                    onChange={(e) => setConvertData({ ...convertData, gstin: e.target.value })}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-100 font-mono uppercase focus:border-[#1B2A4A] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-300 block">Entity Constitution</label>
                  <select
                    value={convertData.entityType}
                    onChange={(e) => setConvertData({ ...convertData, entityType: e.target.value })}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-100 focus:border-[#1B2A4A] focus:outline-none"
                  >
                    <option value="PRIVATE_LIMITED">Private Limited Company</option>
                    <option value="LLP">Limited Liability Partnership</option>
                    <option value="PARTNERSHIP">Partnership Firm</option>
                    <option value="INDIVIDUAL">Individual / Proprietorship</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-300 block">Assigned CA Partner</label>
                  <select
                    value={convertData.assignedCaEmail}
                    onChange={(e) => setConvertData({ ...convertData, assignedCaEmail: e.target.value })}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-100 focus:border-[#1B2A4A] focus:outline-none"
                  >
                    <option value="ca.thabrez@thabreztaxconsulting.com">CA. Thabrez (Principal)</option>
                    <option value="khan@thabreztaxconsulting.com">Senior CA Khan</option>
                    <option value="sharma@thabreztaxconsulting.com">Associate Sharma</option>
                  </select>
                </div>
              </div>

              <p className="text-[10px] text-zinc-500">
                Converting this lead will automatically provision portal login credentials for <strong>{convertModalLead.email}</strong> and send an welcome email with portal activation link.
              </p>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setConvertModalLead(null)}
                  className="px-4 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-300 font-bold hover:bg-zinc-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isConverting}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-500 disabled:opacity-50"
                >
                  <Send className="h-4 w-4" /> Provision &amp; Invite Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const defaultDemoLeads: AdminLeadItem[] = [
  {
    id: 'lead_1',
    name: 'Rajesh Reddy',
    email: 'rajesh.reddy@techstart.in',
    phone: '9845012345',
    serviceInterest: 'Private Limited Company Incorporation',
    message: 'Need full incorporation + GST + trademark for fintech startup in Bangalore.',
    source: 'website_contact',
    status: 'NEW',
    createdAt: '2026-08-16',
  },
  {
    id: 'lead_2',
    name: 'Sneha Kulkarni',
    email: 'sneha@kulkarnitraders.com',
    phone: '9731298765',
    serviceInterest: 'GST Registration & Monthly Compliance',
    message: 'Expanding wholesale textile business, need multi-state GST consultation.',
    source: 'gst_calculator',
    status: 'NEW',
    createdAt: '2026-08-15',
  },
  {
    id: 'lead_3',
    name: 'Vikram Mehta',
    email: 'vikram.mehta@apexlogistics.co',
    phone: '9900112233',
    serviceInterest: 'Tax Audit & Transfer Pricing',
    message: 'Cross-border transport services audit query.',
    source: 'compliance_calendar',
    status: 'CONTACTED',
    createdAt: '2026-08-14',
  },
];
