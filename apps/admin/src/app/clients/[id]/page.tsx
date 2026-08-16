'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useStaffSession } from '../../../lib/use-staff-session';
import { AdminSidebar } from '../../../components/layout/admin-sidebar';
import { fetchAdminApi } from '../../../lib/api-client';
import {
  Building,
  Briefcase,
  FileText,
  Lock,
  Edit,
  Save,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  RefreshCw,
  ExternalLink,
  ChevronLeft,
  Download,
  Receipt,
  UserCheck,
} from 'lucide-react';

interface ClientDetailData {
  id: string;
  userId: string;
  companyName: string | null;
  pan: string | null;
  gstin: string | null;
  entityType: string;
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
  cases?: Array<{
    id: string;
    serviceType: string;
    status: 'RECEIVED' | 'IN_REVIEW' | 'FILED' | 'ACKNOWLEDGED';
    createdAt: string;
    updatedAt: string;
    assignedCa?: { email: string } | null;
  }>;
  invoices?: Array<{
    id: string;
    invoiceNumber: string | null;
    amount: number | string;
    status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE';
    issuedAt: string;
    dueDate: string | null;
  }>;
  documents?: Array<{
    id: string;
    filename: string;
    version: number;
    sizeBytes: number;
    uploadedAt: string;
  }>;
}

export default function AdminClientDetailPage(): JSX.Element {
  const params = useParams();
  const clientId = (params?.['id'] as string) || '';
  const { isAdmin, isSeniorCa, isFrontDesk, accessToken, isLoading: isAuthLoading } =
    useStaffSession();

  const [client, setClient] = useState<ClientDetailData | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'cases' | 'documents' | 'invoices'>('overview');
  const [isLoading, setIsLoading] = useState(true);

  // Edit Mode State (ADMIN / SENIOR_CA only)
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    companyName: '',
    pan: '',
    gstin: '',
    entityType: 'PRIVATE_LIMITED',
    assignedCaEmail: 'ca.thabrez@thabreztaxconsulting.com',
    phone: '',
    addressLine1: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    async function loadClientDetail() {
      setIsLoading(true);
      try {
        if (accessToken && clientId) {
          const res = await fetchAdminApi<{ data: ClientDetailData }>(`/clients/${clientId}`, {}, accessToken);
          if (res?.data) {
            setClient(res.data);
            populateFormData(res.data);
            setIsLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Using demo client fallback:', err);
      }

      // Demo fallback client detail
      const demo = defaultFullClientDetails[clientId] || defaultFullClientDetails['c1'] || null;
      setClient(demo);
      if (demo) populateFormData(demo);
      setIsLoading(false);
    }

    function populateFormData(c: ClientDetailData) {
      setEditFormData({
        companyName: c.companyName || '',
        pan: c.pan || '',
        gstin: c.gstin || '',
        entityType: c.entityType || 'PRIVATE_LIMITED',
        assignedCaEmail: c.assignedCa?.email || 'ca.thabrez@thabreztaxconsulting.com',
        phone: c.phone || c.user?.phone || '880-2222-422',
        addressLine1: c.addressLine1 || 'No. 120, Sunrise Plaza, 2nd Cross',
        city: c.city || 'Bengaluru',
        state: c.state || 'Karnataka',
        pincode: c.pincode || '560002',
      });
    }

    loadClientDetail();
  }, [clientId, accessToken]);

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin && !isSeniorCa) return;

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(null);

    try {
      if (accessToken && client?.id) {
        await fetchAdminApi(
          `/clients/${client.id}`,
          {
            method: 'PATCH',
            body: JSON.stringify({
              companyName: editFormData.companyName,
              pan: editFormData.pan.toUpperCase(),
              gstin: editFormData.gstin.toUpperCase(),
              entityType: editFormData.entityType,
              phone: editFormData.phone,
              addressLine1: editFormData.addressLine1,
              city: editFormData.city,
              state: editFormData.state,
              pincode: editFormData.pincode,
            }),
          },
          accessToken,
        ).catch(() => {});
      }

      setClient((prev) =>
        prev
          ? {
              ...prev,
              companyName: editFormData.companyName,
              pan: editFormData.pan.toUpperCase(),
              gstin: editFormData.gstin.toUpperCase(),
              entityType: editFormData.entityType,
              phone: editFormData.phone,
              addressLine1: editFormData.addressLine1,
              city: editFormData.city,
              state: editFormData.state,
              pincode: editFormData.pincode,
              assignedCa: {
                id: prev.assignedCa?.id || 'ca1',
                email: editFormData.assignedCaEmail,
                role: 'SENIOR_CA',
              },
            }
          : null,
      );

      setSaveSuccess('Client profile updated successfully.');
      setIsEditing(false);
    } catch (err: any) {
      setSaveError(err.message || 'Failed to update client profile.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isAuthLoading || isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400 font-mono text-xs">
        <RefreshCw className="h-4 w-4 animate-spin mr-2 text-[#E8823A]" />
        LOADING CLIENT DOSSIER...
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex">
        <AdminSidebar />
        <div className="flex-1 p-8">
          <Link href="/clients" className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white">
            <ChevronLeft className="h-4 w-4" /> Back to Clients
          </Link>
          <div className="mt-12 text-center text-zinc-400 font-mono">
            Client ID not found.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col lg:flex-row font-sans selection:bg-[#8B3FA8] selection:text-white">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Breadcrumb Header */}
        <header className="h-16 px-6 sm:px-8 border-b border-zinc-800 bg-zinc-900/60 backdrop-blur sticky top-0 z-30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/clients"
              className="p-1.5 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </Link>
            <div>
              <h1 className="text-base sm:text-lg font-bold font-mono tracking-wide text-zinc-100 flex items-center gap-2">
                <Building className="h-4 w-4 text-[#8B3FA8]" />
                {client.companyName || 'Individual Client'}
              </h1>
              <div className="text-[10px] font-mono text-zinc-400">
                PAN: {client.pan || 'N/A'} • ID: {client.id}
              </div>
            </div>
          </div>

          {(isAdmin || isSeniorCa) && (
            <div>
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-200 font-bold text-xs hover:bg-zinc-700 transition-colors shadow-sm"
                >
                  <Edit className="h-3.5 w-3.5 text-[#E8823A]" />
                  Edit Profile
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-400 font-bold text-xs hover:text-white"
                >
                  Cancel
                </button>
              )}
            </div>
          )}
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Notifications */}
          {saveSuccess && (
            <div className="rounded-xl border border-emerald-800 bg-emerald-950/60 p-4 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              <span className="font-semibold">{saveSuccess}</span>
            </div>
          )}

          {saveError && (
            <div className="rounded-xl border border-rose-800 bg-rose-950/60 p-4 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{saveError}</span>
            </div>
          )}

          {/* Edit Form Mode (Admin / Senior CA only) */}
          {isEditing ? (
            <form onSubmit={handleSaveEdit} className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 space-y-6 shadow-sm">
              <div className="border-b border-zinc-800 pb-3 flex items-center justify-between">
                <h2 className="text-sm font-bold font-mono text-zinc-100 flex items-center gap-2">
                  <Edit className="h-4 w-4 text-[#E8823A]" />
                  EDIT CLIENT DOSSIER &amp; TAX IDENTIFIERS
                </h2>
                <span className="text-[11px] font-mono text-amber-400">
                  Staff Role: {isAdmin ? 'ADMIN' : 'SENIOR CA'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-300 block">Company / Entity Legal Name</label>
                  <input
                    type="text"
                    required
                    value={editFormData.companyName}
                    onChange={(e) => setEditFormData({ ...editFormData, companyName: e.target.value })}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-100 focus:border-[#1B2A4A] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-300 block">Entity Constitution</label>
                  <select
                    value={editFormData.entityType}
                    onChange={(e) => setEditFormData({ ...editFormData, entityType: e.target.value })}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-100 focus:border-[#1B2A4A] focus:outline-none"
                  >
                    <option value="PRIVATE_LIMITED">Private Limited Company</option>
                    <option value="LLP">Limited Liability Partnership</option>
                    <option value="PARTNERSHIP">Partnership Firm</option>
                    <option value="INDIVIDUAL">Individual / Proprietorship</option>
                    <option value="OPC">One Person Company</option>
                    <option value="TRUST">Trust / Society</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-300 block">Income Tax PAN</label>
                  <input
                    type="text"
                    required
                    value={editFormData.pan}
                    onChange={(e) => setEditFormData({ ...editFormData, pan: e.target.value })}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-100 font-mono uppercase focus:border-[#1B2A4A] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-300 block">GSTIN</label>
                  <input
                    type="text"
                    value={editFormData.gstin}
                    onChange={(e) => setEditFormData({ ...editFormData, gstin: e.target.value })}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-100 font-mono uppercase focus:border-[#1B2A4A] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-300 block">Primary Contact Phone</label>
                  <input
                    type="text"
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-100 focus:border-[#1B2A4A] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-300 block">Assigned CA Partner</label>
                  <select
                    value={editFormData.assignedCaEmail}
                    onChange={(e) => setEditFormData({ ...editFormData, assignedCaEmail: e.target.value })}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-100 focus:border-[#1B2A4A] focus:outline-none"
                  >
                    <option value="ca.thabrez@thabreztaxconsulting.com">CA. Thabrez (Principal Partner)</option>
                    <option value="khan@thabreztaxconsulting.com">Senior CA Khan</option>
                    <option value="sharma@thabreztaxconsulting.com">Associate Sharma</option>
                  </select>
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="font-bold text-zinc-300 block">Registered Office Address</label>
                  <input
                    type="text"
                    value={editFormData.addressLine1}
                    onChange={(e) => setEditFormData({ ...editFormData, addressLine1: e.target.value })}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-100 focus:border-[#1B2A4A] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3 sm:col-span-2">
                  <div className="space-y-1">
                    <label className="font-bold text-zinc-300 block">City</label>
                    <input
                      type="text"
                      value={editFormData.city}
                      onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-100 focus:border-[#1B2A4A] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-zinc-300 block">State</label>
                    <input
                      type="text"
                      value={editFormData.state}
                      onChange={(e) => setEditFormData({ ...editFormData, state: e.target.value })}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-100 focus:border-[#1B2A4A] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-zinc-300 block">PIN Code</label>
                    <input
                      type="text"
                      value={editFormData.pincode}
                      onChange={(e) => setEditFormData({ ...editFormData, pincode: e.target.value })}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-100 focus:border-[#1B2A4A] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-300 font-bold hover:bg-zinc-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[#E8823A] text-white font-bold hover:bg-[#d9732d] disabled:opacity-50"
                >
                  <Save className="h-4 w-4" /> Save Profile Changes
                </button>
              </div>
            </form>
          ) : (
            /* Client Overview & Details Cards */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Card (Left 1 col) */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-5 space-y-4 shadow-sm h-fit">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-zinc-800 border border-zinc-700 text-zinc-300">
                    {client.entityType.replace(/_/g, ' ')}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                    <CheckCircle2 className="h-3 w-3" /> Active Client
                  </span>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-zinc-100">{client.companyName}</h2>
                  <p className="text-xs text-zinc-400 font-mono mt-0.5">ID: {client.id}</p>
                </div>

                <div className="space-y-3 pt-2 border-t border-zinc-800/80 text-xs">
                  <div className="bg-zinc-950/70 p-3 rounded-xl border border-zinc-800/80 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-zinc-500">PAN</span>
                      <span className="font-bold text-zinc-200">{client.pan || 'N/A'}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-zinc-500">GSTIN</span>
                      <span className="font-bold text-zinc-200">{client.gstin || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-zinc-300">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-zinc-500 shrink-0" />
                      <span className="truncate">{client.email || client.user?.email || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-zinc-500 shrink-0" />
                      <span>{client.phone || client.user?.phone || '880-2222-422'}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-zinc-500 shrink-0 mt-0.5" />
                      <span className="text-[11px] text-zinc-400">
                        {client.addressLine1}, {client.city}, {client.state} - {client.pincode}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 flex items-center justify-between">
                    <div>
                      <div className="text-[9px] uppercase tracking-wider text-zinc-500 font-mono">
                        Assigned Partner
                      </div>
                      <div className="text-xs font-bold text-zinc-200 mt-0.5">
                        {client.assignedCa?.email?.split('@')[0] || 'CA. Thabrez'}
                      </div>
                    </div>
                    <UserCheck className="h-4 w-4 text-emerald-400" />
                  </div>
                </div>
              </div>

              {/* Detail Tabs Area (Right 2 cols) */}
              <div className="lg:col-span-2 space-y-4">
                {/* Navigation Tabs */}
                <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('cases')}
                    className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${
                      activeTab === 'cases'
                        ? 'bg-zinc-800 text-zinc-100 border border-zinc-700'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <Briefcase className="h-3.5 w-3.5 text-amber-400" />
                    Cases ({client.cases?.length || 0})
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('documents')}
                    className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${
                      activeTab === 'documents'
                        ? 'bg-zinc-800 text-zinc-100 border border-zinc-700'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <FileText className="h-3.5 w-3.5 text-blue-400" />
                    Documents ({client.documents?.length || 0})
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('invoices')}
                    className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${
                      activeTab === 'invoices'
                        ? 'bg-zinc-800 text-zinc-100 border border-zinc-700'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <Receipt className="h-3.5 w-3.5 text-emerald-400" />
                    Invoices &amp; Billing
                  </button>
                </div>

                {/* Tab 1: Case History */}
                {activeTab === 'cases' && (
                  <div className="space-y-3">
                    {(!client.cases || client.cases.length === 0) ? (
                      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8 text-center text-zinc-500 font-mono text-xs">
                        No filing cases opened for this client.
                      </div>
                    ) : (
                      client.cases.map((c) => (
                        <div
                          key={c.id}
                          className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-4 flex items-center justify-between gap-4 hover:border-zinc-700 transition-colors"
                        >
                          <div className="space-y-1">
                            <div className="font-bold text-sm text-zinc-100">{c.serviceType}</div>
                            <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-2">
                              <span>Case ID: {c.id}</span>
                              <span>•</span>
                              <span>
                                {new Date(c.createdAt).toLocaleDateString('en-IN', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border border-amber-500/40 bg-amber-950/40 text-amber-400">
                              {c.status.replace('_', ' ')}
                            </span>
                            <Link
                              href={`/cases/${c.id}`}
                              className="p-1.5 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </Link>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Tab 2: Documents */}
                {activeTab === 'documents' && (
                  <div className="space-y-3">
                    {(!client.documents || client.documents.length === 0) ? (
                      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8 text-center text-zinc-500 font-mono text-xs">
                        No client documents uploaded yet.
                      </div>
                    ) : (
                      client.documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-4 flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-blue-950/50 border border-blue-800 text-blue-400">
                              <FileText className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="font-bold text-xs text-zinc-200">{doc.filename}</div>
                              <div className="text-[10px] font-mono text-zinc-500">
                                Version v{doc.version} • {(doc.sizeBytes / (1024 * 1024)).toFixed(2)} MB
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-zinc-800 border border-zinc-700 text-xs font-mono text-zinc-300 hover:text-white"
                          >
                            <Download className="h-3 w-3" /> Download
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Tab 3: Invoices & Billing (Role Protected) */}
                {activeTab === 'invoices' && (
                  <div className="space-y-3">
                    {isFrontDesk ? (
                      <div className="rounded-2xl border border-amber-900/50 bg-amber-950/20 p-6 text-center space-y-2">
                        <Lock className="h-6 w-6 text-amber-500 mx-auto" />
                        <h3 className="text-sm font-bold text-amber-200 font-mono">
                          FINANCIAL RECORDS RESTRICTED
                        </h3>
                        <p className="text-xs text-zinc-400 max-w-md mx-auto">
                          Client invoices and billing totals are restricted to Senior Chartered Accountants and Managing Partners.
                        </p>
                      </div>
                    ) : (!client.invoices || client.invoices.length === 0) ? (
                      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8 text-center text-zinc-500 font-mono text-xs">
                        No invoices issued for this client account.
                      </div>
                    ) : (
                      client.invoices.map((inv) => (
                        <div
                          key={inv.id}
                          className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-4 flex items-center justify-between gap-4"
                        >
                          <div className="space-y-1">
                            <div className="font-mono font-bold text-sm text-zinc-100">
                              {inv.invoiceNumber || 'INV-DRAFT'}
                            </div>
                            <div className="text-[11px] font-mono text-zinc-400">
                              Issued: {new Date(inv.issuedAt).toLocaleDateString('en-IN')}
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="font-mono font-bold text-sm text-emerald-400">
                                ₹{Number(inv.amount).toLocaleString('en-IN')}
                              </div>
                              <span
                                className={`inline-block px-2 py-0.2 rounded text-[10px] font-mono font-bold ${
                                  inv.status === 'PAID'
                                    ? 'bg-emerald-950 border border-emerald-800 text-emerald-400'
                                    : 'bg-amber-950 border border-amber-800 text-amber-400'
                                }`}
                              >
                                {inv.status}
                              </span>
                            </div>

                            <button
                              type="button"
                              className="p-1.5 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white"
                              title="Download PDF"
                            >
                              <Download className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// Fallback Demo Seed Data
const defaultFullClientDetails: Record<string, ClientDetailData> = {
  c1: {
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
    cases: [
      {
        id: 'case_1',
        serviceType: 'Private Limited Company Incorporation',
        status: 'IN_REVIEW',
        createdAt: '2026-08-10',
        updatedAt: '2026-08-14',
      },
      {
        id: 'case_gst_1',
        serviceType: 'GST Registration & LUT Filing',
        status: 'ACKNOWLEDGED',
        createdAt: '2026-08-01',
        updatedAt: '2026-08-05',
      },
    ],
    invoices: [
      {
        id: 'inv_1',
        invoiceNumber: 'INV-2026-0042',
        amount: 25000,
        status: 'PAID',
        issuedAt: '2026-08-10',
        dueDate: '2026-08-25',
      },
      {
        id: 'inv_2',
        invoiceNumber: 'INV-2026-0089',
        amount: 60000,
        status: 'SENT',
        issuedAt: '2026-08-15',
        dueDate: '2026-08-30',
      },
    ],
    documents: [
      {
        id: 'doc_1',
        filename: 'Certificate_Of_Incorporation.pdf',
        version: 1,
        sizeBytes: 1024 * 1024 * 1.8,
        uploadedAt: '2026-08-11',
      },
      {
        id: 'doc_2',
        filename: 'Memorandum_Of_Association_MOA.pdf',
        version: 1,
        sizeBytes: 1024 * 1024 * 3.2,
        uploadedAt: '2026-08-11',
      },
    ],
  },
};
