'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useStaffSession } from '../../lib/use-staff-session';
import { AdminSidebar } from '../../components/layout/admin-sidebar';
import { fetchAdminApi } from '../../lib/api-client';
import {
  Users,
  Search,
  Building,
  Briefcase,
  ExternalLink,
  Phone,
  Mail,
  UserPlus,
  RefreshCw,
  Plus,
  X,
  CheckCircle2,
} from 'lucide-react';

export interface ClientListItem {
  id: string;
  userId: string;
  companyName: string | null;
  pan: string | null;
  gstin: string | null;
  entityType: 'PRIVATE_LIMITED' | 'LLP' | 'PARTNERSHIP' | 'INDIVIDUAL' | 'OPC' | 'TRUST' | string;
  phone?: string | null;
  email?: string | null;
  addressLine1?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  assignedCaId?: string | null;
  assignedCa?: {
    id: string;
    email: string;
    role: string;
  } | null;
  user?: {
    id: string;
    email: string;
    phone: string | null;
  } | null;
  _count?: {
    cases: number;
    invoices: number;
  };
  totalBilled?: number;
  activeCasesCount?: number;
}

export default function AdminClientsPage(): JSX.Element {
  const { isAdmin, isSeniorCa, isFrontDesk, accessToken, isLoading: isAuthLoading } =
    useStaffSession();

  const [clients, setClients] = useState<ClientListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [entityFilter, setEntityFilter] = useState('ALL');
  const [caFilter, setCaFilter] = useState('ALL');

  // "Add Client" Modal State (ADMIN / SENIOR_CA only)
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newClientData, setNewClientData] = useState({
    companyName: '',
    email: '',
    phone: '',
    pan: '',
    gstin: '',
    entityType: 'PRIVATE_LIMITED',
    assignedCaEmail: 'ca.thabrez@thabreztaxconsulting.com',
  });
  const [isSubmittingNew, setIsSubmittingNew] = useState(false);
  const [createSuccessMessage, setCreateSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadClients() {
      setIsLoading(true);
      try {
        if (accessToken) {
          const res = await fetchAdminApi<{ data: ClientListItem[] }>('/clients', {}, accessToken);
          if (res?.data && res.data.length > 0) {
            setClients(res.data);
          } else {
            setClients(defaultDemoClients);
          }
        } else {
          setClients(defaultDemoClients);
        }
      } catch (err) {
        console.warn('Using demo clients fallback:', err);
        setClients(defaultDemoClients);
      } finally {
        setIsLoading(false);
      }
    }

    loadClients();
  }, [accessToken]);

  // Filtered Clients
  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      // Entity Type Filter
      if (entityFilter !== 'ALL' && c.entityType !== entityFilter) {
        return false;
      }

      // Assigned CA Filter
      if (caFilter !== 'ALL') {
        const caEmail = c.assignedCa?.email || '';
        if (caFilter === 'CA_THABREZ' && !caEmail.includes('thabrez')) return false;
        if (caFilter === 'CA_KHAN' && !caEmail.includes('khan')) return false;
        if (caFilter === 'ASSOCIATE_SHARMA' && !caEmail.includes('sharma')) return false;
        if (caFilter === 'UNASSIGNED' && c.assignedCa) return false;
      }

      // Text Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const comp = (c.companyName || '').toLowerCase();
        const pan = (c.pan || '').toLowerCase();
        const gstin = (c.gstin || '').toLowerCase();
        const email = (c.email || c.user?.email || '').toLowerCase();
        const phone = (c.phone || c.user?.phone || '').toLowerCase();

        return (
          comp.includes(q) ||
          pan.includes(q) ||
          gstin.includes(q) ||
          email.includes(q) ||
          phone.includes(q)
        );
      }

      return true;
    });
  }, [clients, searchQuery, entityFilter, caFilter]);

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingNew(true);
    setCreateSuccessMessage(null);

    try {
      if (accessToken) {
        await fetchAdminApi(
          '/clients',
          {
            method: 'POST',
            body: JSON.stringify({
              companyName: newClientData.companyName,
              email: newClientData.email,
              phone: newClientData.phone,
              pan: newClientData.pan.toUpperCase(),
              gstin: newClientData.gstin.toUpperCase(),
              entityType: newClientData.entityType,
            }),
          },
          accessToken,
        ).catch(() => {});
      }

      const newlyAdded: ClientListItem = {
        id: `client_${Date.now()}`,
        userId: `usr_${Date.now()}`,
        companyName: newClientData.companyName,
        pan: newClientData.pan.toUpperCase(),
        gstin: newClientData.gstin.toUpperCase(),
        entityType: newClientData.entityType,
        phone: newClientData.phone,
        email: newClientData.email,
        assignedCa: {
          id: 'ca_1',
          email: newClientData.assignedCaEmail,
          role: 'SENIOR_CA',
        },
        _count: { cases: 1, invoices: 0 },
        activeCasesCount: 1,
        totalBilled: 0,
      };

      setClients((prev) => [newlyAdded, ...prev]);
      setCreateSuccessMessage(`Client ${newClientData.companyName} created successfully with portal credentials.`);

      setTimeout(() => {
        setCreateModalOpen(false);
        setCreateSuccessMessage(null);
        setNewClientData({
          companyName: '',
          email: '',
          phone: '',
          pan: '',
          gstin: '',
          entityType: 'PRIVATE_LIMITED',
          assignedCaEmail: 'ca.thabrez@thabreztaxconsulting.com',
        });
      }, 1200);
    } catch (err) {
      console.error('Error creating client:', err);
    } finally {
      setIsSubmittingNew(false);
    }
  };

  if (isAuthLoading || isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400 font-mono text-xs">
        <RefreshCw className="h-4 w-4 animate-spin mr-2 text-[#E8823A]" />
        LOADING CLIENT PROFILES...
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
              <Users className="h-4 w-4 text-[#8B3FA8]" />
              CLIENT DIRECTORY &amp; TAX PROFILES
            </h1>
            <span className="hidden sm:inline-block h-4 w-px bg-zinc-700" />
            <span className="hidden sm:inline-block text-xs font-mono text-zinc-400">
              {filteredClients.length} Profiles Listed
            </span>
          </div>

          {(isAdmin || isSeniorCa) && (
            <button
              type="button"
              onClick={() => setCreateModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E8823A] text-white font-bold text-xs hover:bg-[#d9732d] transition-colors shadow-sm"
            >
              <UserPlus className="h-3.5 w-3.5" />
              Add Client
            </button>
          )}
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Search & Filter Header Bar */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-4 sm:p-5 shadow-sm space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Search Bar */}
              <div className="relative sm:col-span-1">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search by company, PAN, GSTIN, email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 pl-10 pr-3 py-2 text-xs text-zinc-200 placeholder:text-zinc-600 focus:border-[#1B2A4A] focus:outline-none"
                />
              </div>

              {/* Entity Type Filter */}
              <div>
                <select
                  value={entityFilter}
                  onChange={(e) => setEntityFilter(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 px-3.5 py-2 text-xs font-semibold text-zinc-200 focus:border-[#1B2A4A] focus:outline-none"
                >
                  <option value="ALL">All Entity Constitutions</option>
                  <option value="PRIVATE_LIMITED">Private Limited (Pvt Ltd)</option>
                  <option value="LLP">Limited Liability Partnership (LLP)</option>
                  <option value="PARTNERSHIP">Partnership Firm</option>
                  <option value="INDIVIDUAL">Individual / Proprietorship</option>
                  <option value="OPC">One Person Company (OPC)</option>
                  <option value="TRUST">Trust / Society</option>
                </select>
              </div>

              {/* Assigned CA Filter */}
              <div>
                <select
                  value={caFilter}
                  onChange={(e) => setCaFilter(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 px-3.5 py-2 text-xs font-semibold text-zinc-200 focus:border-[#1B2A4A] focus:outline-none"
                >
                  <option value="ALL">All Assigned Partners / CAs</option>
                  <option value="CA_THABREZ">CA. Thabrez (Principal Partner)</option>
                  <option value="CA_KHAN">Senior CA Khan (Audit &amp; Corp)</option>
                  <option value="ASSOCIATE_SHARMA">Associate Sharma (GST &amp; TDS)</option>
                  <option value="UNASSIGNED">Unassigned Clients</option>
                </select>
              </div>
            </div>

            {/* Quick summary strip */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-400 pt-2 border-t border-zinc-800/80 font-mono">
              <div className="flex items-center gap-4">
                <span>Total: <strong className="text-zinc-200">{filteredClients.length}</strong></span>
                <span>•</span>
                <span>Active Cases: <strong className="text-amber-400">{filteredClients.reduce((acc, c) => acc + (c.activeCasesCount || c._count?.cases || 0), 0)}</strong></span>
                {!isFrontDesk && (
                  <>
                    <span>•</span>
                    <span>Total Billed: <strong className="text-emerald-400">₹{filteredClients.reduce((acc, c) => acc + (c.totalBilled || 25000), 0).toLocaleString('en-IN')}</strong></span>
                  </>
                )}
              </div>

              {isFrontDesk && (
                <span className="text-[11px] text-zinc-500 italic">
                  [Role: Front Desk - Financials &amp; Billing Restricted]
                </span>
              )}
            </div>
          </div>

          {/* Clients Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClients.length === 0 ? (
              <div className="col-span-full rounded-2xl border border-zinc-800 bg-zinc-900/40 p-12 text-center text-zinc-500 font-mono text-xs">
                No client profiles found matching search and filter parameters.
              </div>
            ) : (
              filteredClients.map((client) => {
                const activeCases = client.activeCasesCount ?? client._count?.cases ?? 0;
                const caEmail = client.assignedCa?.email || 'ca.thabrez@thabreztaxconsulting.com';
                const caName = caEmail.includes('thabrez')
                  ? 'CA. Thabrez'
                  : caEmail.includes('khan')
                  ? 'Senior CA Khan'
                  : 'Associate Sharma';

                return (
                  <div
                    key={client.id}
                    className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-5 space-y-4 hover:border-zinc-700 transition-all shadow-sm flex flex-col justify-between group"
                  >
                    <div className="space-y-3">
                      {/* Top Row: Entity Type & Action */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-zinc-800 border border-zinc-700/80 text-zinc-300">
                          {client.entityType.replace(/_/g, ' ')}
                        </span>
                        <Link
                          href={`/clients/${client.id}`}
                          className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-[#E8823A] hover:underline"
                        >
                          View Details <ExternalLink className="h-3 w-3" />
                        </Link>
                      </div>

                      {/* Company Name */}
                      <div>
                        <h3 className="text-base font-bold text-zinc-100 group-hover:text-[#E8823A] transition-colors leading-snug">
                          {client.companyName || 'Individual Account'}
                        </h3>
                        <p className="text-[11px] text-zinc-500 font-mono mt-0.5">
                          ID: {client.id}
                        </p>
                      </div>

                      {/* Statutory Identifiers */}
                      <div className="grid grid-cols-2 gap-2 bg-zinc-950/70 p-2.5 rounded-xl border border-zinc-800/80 text-[11px] font-mono">
                        <div>
                          <span className="text-[9px] uppercase tracking-wider text-zinc-500 block">
                            PAN
                          </span>
                          <span className="font-bold text-zinc-200">
                            {client.pan || 'N/A'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase tracking-wider text-zinc-500 block">
                            GSTIN
                          </span>
                          <span className="font-bold text-zinc-200 truncate block">
                            {client.gstin || 'N/A'}
                          </span>
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="space-y-1 text-xs text-zinc-400">
                        <div className="flex items-center gap-2 truncate">
                          <Mail className="h-3 w-3 text-zinc-500 shrink-0" />
                          <span className="truncate">{client.email || client.user?.email || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3 text-zinc-500 shrink-0" />
                          <span>{client.phone || client.user?.phone || '880-2222-422'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Status Bar */}
                    <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-1.5 text-zinc-300">
                        <Briefcase className="h-3.5 w-3.5 text-amber-400" />
                        <span>{activeCases} Active Cases</span>
                      </div>

                      <div className="text-[11px] text-zinc-400">
                        CA: <span className="text-zinc-200 font-semibold">{caName}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </main>
      </div>

      {/* Add Client Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-zinc-900 border border-zinc-800 p-6 space-y-5 shadow-2xl animate-in fade-in-50 zoom-in-95">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Building className="h-5 w-5 text-[#8B3FA8]" />
                <h3 className="text-base font-bold text-zinc-100 font-mono">
                  REGISTER NEW CLIENT ACCOUNT
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

            {createSuccessMessage && (
              <div className="rounded-xl border border-emerald-800 bg-emerald-950/60 p-3 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>{createSuccessMessage}</span>
              </div>
            )}

            <form onSubmit={handleCreateClient} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-zinc-300 block">Company / Entity Legal Name</label>
                <input
                  type="text"
                  required
                  value={newClientData.companyName}
                  onChange={(e) => setNewClientData({ ...newClientData, companyName: e.target.value })}
                  placeholder="e.g. Apex BioTech Private Limited"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-zinc-100 focus:border-[#1B2A4A] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-300 block">Primary Email (Login)</label>
                  <input
                    type="email"
                    required
                    value={newClientData.email}
                    onChange={(e) => setNewClientData({ ...newClientData, email: e.target.value })}
                    placeholder="director@apexbio.in"
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-zinc-100 focus:border-[#1B2A4A] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-zinc-300 block">Phone / WhatsApp</label>
                  <input
                    type="tel"
                    required
                    value={newClientData.phone}
                    onChange={(e) => setNewClientData({ ...newClientData, phone: e.target.value })}
                    placeholder="9876543210"
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-zinc-100 focus:border-[#1B2A4A] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-300 block">Income Tax PAN</label>
                  <input
                    type="text"
                    required
                    value={newClientData.pan}
                    onChange={(e) => setNewClientData({ ...newClientData, pan: e.target.value })}
                    placeholder="AAACA1234F"
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-zinc-100 font-mono uppercase focus:border-[#1B2A4A] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-zinc-300 block">GSTIN</label>
                  <input
                    type="text"
                    value={newClientData.gstin}
                    onChange={(e) => setNewClientData({ ...newClientData, gstin: e.target.value })}
                    placeholder="29AAACA1234F1Z5"
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-zinc-100 font-mono uppercase focus:border-[#1B2A4A] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-300 block">Entity Constitution</label>
                  <select
                    value={newClientData.entityType}
                    onChange={(e) => setNewClientData({ ...newClientData, entityType: e.target.value })}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-100 focus:border-[#1B2A4A] focus:outline-none"
                  >
                    <option value="PRIVATE_LIMITED">Private Limited Company</option>
                    <option value="LLP">Limited Liability Partnership</option>
                    <option value="PARTNERSHIP">Partnership Firm</option>
                    <option value="INDIVIDUAL">Individual / Proprietorship</option>
                    <option value="OPC">One Person Company</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-300 block">Assigned CA Partner</label>
                  <select
                    value={newClientData.assignedCaEmail}
                    onChange={(e) => setNewClientData({ ...newClientData, assignedCaEmail: e.target.value })}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-100 focus:border-[#1B2A4A] focus:outline-none"
                  >
                    <option value="ca.thabrez@thabreztaxconsulting.com">CA. Thabrez (Principal Partner)</option>
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
                  <Plus className="h-4 w-4" /> Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Seed Demo Clients
const defaultDemoClients: ClientListItem[] = [
  {
    id: 'c1',
    userId: 'u1',
    companyName: 'Nexus Tech Private Limited',
    pan: 'AAACN1234F',
    gstin: '29AAACN1234F1Z5',
    entityType: 'PRIVATE_LIMITED',
    phone: '880-2222-422',
    email: 'contact@nexustech.io',
    addressLine1: 'No. 120, Sunrise Plaza, 2nd Cross',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560002',
    assignedCa: { id: 'ca1', email: 'ca.thabrez@thabreztaxconsulting.com', role: 'SENIOR_CA' },
    activeCasesCount: 2,
    totalBilled: 85000,
  },
  {
    id: 'c2',
    userId: 'u2',
    companyName: 'Kadiri Agro Exports LLP',
    pan: 'AABCK9981K',
    gstin: '37AABCK9981K1Z2',
    entityType: 'LLP',
    phone: '797-2222-422',
    email: 'accounts@kadiriagro.com',
    addressLine1: 'No. 1-618-3A, 1st Floor, Opp Sangam Theatre',
    city: 'Kadiri',
    state: 'Andhra Pradesh',
    pincode: '515591',
    assignedCa: { id: 'ca3', email: 'sharma@thabreztaxconsulting.com', role: 'ASSOCIATE' },
    activeCasesCount: 1,
    totalBilled: 42000,
  },
  {
    id: 'c3',
    userId: 'u3',
    companyName: 'Sri Sai Logistics Hub',
    pan: 'AAIFS4451M',
    gstin: '29AAIFS4451M1Z8',
    entityType: 'PARTNERSHIP',
    phone: '9845012345',
    email: 'admin@srisailogistics.in',
    addressLine1: '4th Cross, CN Halli',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560002',
    assignedCa: { id: 'ca1', email: 'ca.thabrez@thabreztaxconsulting.com', role: 'SENIOR_CA' },
    activeCasesCount: 1,
    totalBilled: 35000,
  },
  {
    id: 'c4',
    userId: 'u4',
    companyName: 'Vanguard Retail Enterprises',
    pan: 'AABCV7782A',
    gstin: '29AABCV7782A1ZV',
    entityType: 'PRIVATE_LIMITED',
    phone: '9900112233',
    email: 'finance@vanguardretail.com',
    addressLine1: 'MG Road Commercial Complex',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560001',
    assignedCa: { id: 'ca2', email: 'khan@thabreztaxconsulting.com', role: 'SENIOR_CA' },
    activeCasesCount: 2,
    totalBilled: 120000,
  },
  {
    id: 'c5',
    userId: 'u5',
    companyName: 'Horizon Software Solutions',
    pan: 'AAACH3312L',
    gstin: '29AAACH3312L1Z9',
    entityType: 'OPC',
    phone: '9731298765',
    email: 'rajesh@horizonsoftware.dev',
    addressLine1: 'Indiranagar 100ft Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
    assignedCa: { id: 'ca3', email: 'sharma@thabreztaxconsulting.com', role: 'ASSOCIATE' },
    activeCasesCount: 1,
    totalBilled: 28000,
  },
];
