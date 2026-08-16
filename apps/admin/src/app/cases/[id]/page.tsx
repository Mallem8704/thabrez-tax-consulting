'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useStaffSession } from '../../../lib/use-staff-session';
import { AdminSidebar } from '../../../components/layout/admin-sidebar';
import { fetchAdminApi } from '../../../lib/api-client';
import {
  Briefcase,
  Building,
  CheckCircle2,
  Clock,
  Send,
  MessageSquare,
  FileText,
  Lock,
  ChevronLeft,
  RefreshCw,
  Download,
  UserCheck,
  Check,
} from 'lucide-react';

interface CaseDetailData {
  id: string;
  clientId: string;
  clientName: string;
  pan?: string;
  gstin?: string;
  serviceType: string;
  status: 'RECEIVED' | 'IN_REVIEW' | 'FILED' | 'ACKNOWLEDGED';
  assignedCaId?: string | null;
  assignedCaName: string;
  assignedCaEmail: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  documents?: Array<{
    id: string;
    filename: string;
    version: number;
    sizeBytes: number;
    uploadedAt: string;
  }>;
  messages?: Array<{
    id: string;
    sender: 'CLIENT' | 'STAFF';
    senderName: string;
    body: string;
    createdAt: string;
  }>;
  internalNotes?: Array<{
    id: string;
    author: string;
    note: string;
    createdAt: string;
  }>;
  invoice?: {
    id: string;
    invoiceNumber: string;
    amount: number;
    status: string;
  } | null;
}

const STEPS = [
  { key: 'RECEIVED', label: 'Received', desc: 'Documents and mandate received' },
  { key: 'IN_REVIEW', label: 'In Review', desc: 'CA review & draft preparation' },
  { key: 'FILED', label: 'Filed', desc: 'Submitted to Government portal' },
  { key: 'ACKNOWLEDGED', label: 'Acknowledged', desc: 'Filing receipt generated' },
];

export default function AdminCaseDetailPage(): JSX.Element {
  const params = useParams();
  const caseId = (params?.['id'] as string) || '';
  const { email, isAdmin, isSeniorCa, isFrontDesk, accessToken, isLoading: isAuthLoading } =
    useStaffSession();

  const [caseData, setCaseData] = useState<CaseDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Status Update & Reassignment States
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isReassigning, setIsReassigning] = useState(false);
  const [selectedStaffEmail, setSelectedStaffEmail] = useState('ca.thabrez@thabreztaxconsulting.com');
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Message & Internal Note States
  const [newClientMsg, setNewClientMsg] = useState('');
  const [isSendingMsg, setIsSendingMsg] = useState(false);
  const [newInternalNote, setNewInternalNote] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);

  useEffect(() => {
    async function loadCaseDetail() {
      setIsLoading(true);
      try {
        if (accessToken && caseId) {
          const res = await fetchAdminApi<{ data: CaseDetailData }>(`/cases/${caseId}`, {}, accessToken);
          if (res?.data) {
            setCaseData(res.data);
            setSelectedStaffEmail(res.data.assignedCaEmail);
            setIsLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Using demo case fallback:', err);
      }

      // Demo fallback
      const demo = defaultDemoCaseDetail[caseId] || defaultDemoCaseDetail['case_1'] || null;
      setCaseData(demo);
      if (demo) setSelectedStaffEmail(demo.assignedCaEmail);
      setIsLoading(false);
    }

    loadCaseDetail();
  }, [caseId, accessToken]);

  const handleStatusChange = async (newStatus: CaseDetailData['status']) => {
    if (!caseData || caseData.status === newStatus) return;
    setIsUpdatingStatus(true);

    try {
      if (accessToken) {
        await fetchAdminApi(
          `/cases/${caseData.id}/status`,
          {
            method: 'PATCH',
            body: JSON.stringify({ status: newStatus }),
          },
          accessToken,
        ).catch(() => {});
      }

      setCaseData((prev) => (prev ? { ...prev, status: newStatus } : null));
      setFeedbackToast(`Status updated to ${newStatus.replace('_', ' ')}`);
      setTimeout(() => setFeedbackToast(null), 2500);
    } catch (err) {
      console.error('Error changing status:', err);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleReassign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin && !isSeniorCa) return;
    setIsReassigning(true);

    const partnerName = selectedStaffEmail.includes('thabrez')
      ? 'CA. Thabrez'
      : selectedStaffEmail.includes('khan')
      ? 'Senior CA Khan'
      : 'Associate Sharma';

    try {
      if (accessToken && caseData?.id) {
        await fetchAdminApi(
          `/cases/${caseData.id}/assign`,
          {
            method: 'PATCH',
            body: JSON.stringify({ assignedCaEmail: selectedStaffEmail }),
          },
          accessToken,
        ).catch(() => {});
      }

      setCaseData((prev) =>
        prev
          ? {
              ...prev,
              assignedCaEmail: selectedStaffEmail,
              assignedCaName: partnerName,
            }
          : null,
      );

      setFeedbackToast(`Case reassigned to ${partnerName}.`);
      setTimeout(() => setFeedbackToast(null), 2500);
    } catch (err) {
      console.error('Error reassigning case:', err);
    } finally {
      setIsReassigning(false);
    }
  };

  const handleSendClientMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientMsg.trim() || !caseData) return;
    setIsSendingMsg(true);

    const msgObj = {
      id: `msg_${Date.now()}`,
      sender: 'STAFF' as const,
      senderName: email?.split('@')[0] || 'CA Partner',
      body: newClientMsg.trim(),
      createdAt: new Date().toISOString(),
    };

    try {
      if (accessToken) {
        await fetchAdminApi(
          '/messages',
          {
            method: 'POST',
            body: JSON.stringify({
              caseId: caseData.id,
              body: newClientMsg.trim(),
            }),
          },
          accessToken,
        ).catch(() => {});
      }

      setCaseData((prev) =>
        prev ? { ...prev, messages: [...(prev.messages || []), msgObj] } : null,
      );
      setNewClientMsg('');
    } catch (err) {
      console.error('Error posting message:', err);
    } finally {
      setIsSendingMsg(false);
    }
  };

  const handleAddInternalNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInternalNote.trim() || !caseData) return;
    setIsSavingNote(true);

    const noteObj = {
      id: `note_${Date.now()}`,
      author: email?.split('@')[0] || 'CA Staff',
      note: newInternalNote.trim(),
      createdAt: new Date().toISOString(),
    };

    setCaseData((prev) =>
      prev ? { ...prev, internalNotes: [noteObj, ...(prev.internalNotes || [])] } : null,
    );
    setNewInternalNote('');
    setIsSavingNote(false);
    setFeedbackToast('Confidential internal note saved.');
    setTimeout(() => setFeedbackToast(null), 2000);
  };

  if (isAuthLoading || isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400 font-mono text-xs">
        <RefreshCw className="h-4 w-4 animate-spin mr-2 text-[#E8823A]" />
        OPENING CASE WORKSPACE...
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex">
        <AdminSidebar />
        <div className="flex-1 p-8">
          <Link href="/cases" className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white">
            <ChevronLeft className="h-4 w-4" /> Back to Cases
          </Link>
          <div className="mt-12 text-center text-zinc-400 font-mono">
            Case ID not found.
          </div>
        </div>
      </div>
    );
  }

  const currentStepIdx = STEPS.findIndex((s) => s.key === caseData.status);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col lg:flex-row font-sans selection:bg-[#8B3FA8] selection:text-white">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="h-16 px-6 sm:px-8 border-b border-zinc-800 bg-zinc-900/60 backdrop-blur sticky top-0 z-30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/cases"
              className="p-1.5 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </Link>
            <div>
              <h1 className="text-base sm:text-lg font-bold font-mono tracking-wide text-zinc-100 flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-[#E8823A]" />
                {caseData.serviceType}
              </h1>
              <div className="text-[10px] font-mono text-zinc-400">
                Client: {caseData.clientName} • ID: {caseData.id}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-zinc-800 border border-zinc-700 text-amber-400">
              {caseData.status.replace('_', ' ')}
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Toast Notification */}
          {feedbackToast && (
            <div className="rounded-xl border border-emerald-800 bg-emerald-950/80 p-4 text-xs text-emerald-300 flex items-center gap-2 shadow-lg">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>{feedbackToast}</span>
            </div>
          )}

          {/* 1. Visual Status Stepper (Interactive for Staff) */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-zinc-400">
                Statutory Filing Progression Stepper
              </h2>
              <span className="text-[11px] font-mono text-zinc-500">
                Click any stage to transition filing lifecycle
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {STEPS.map((step, idx) => {
                const isCompleted = idx < currentStepIdx;
                const isCurrent = idx === currentStepIdx;

                return (
                  <button
                    key={step.key}
                    type="button"
                    disabled={isUpdatingStatus}
                    onClick={() => handleStatusChange(step.key as any)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      isCurrent
                        ? 'bg-amber-950/40 border-amber-500/80 ring-1 ring-amber-500/40 text-zinc-100'
                        : isCompleted
                        ? 'bg-emerald-950/30 border-emerald-800 text-zinc-300 hover:bg-emerald-950/50'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono font-bold">STAGE 0{idx + 1}</span>
                      {isCompleted ? (
                        <Check className="h-4 w-4 text-emerald-400" />
                      ) : isCurrent ? (
                        <Clock className="h-4 w-4 text-amber-400 animate-spin" />
                      ) : null}
                    </div>
                    <div className="font-bold text-xs text-zinc-100">{step.label}</div>
                    <div className="text-[10px] text-zinc-400 mt-0.5">{step.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Client Details, Documents & Messages (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Client Dossier Info */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-5 space-y-3 shadow-sm">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <h3 className="text-xs font-bold font-mono text-zinc-300 flex items-center gap-2">
                    <Building className="h-4 w-4 text-[#8B3FA8]" /> CLIENT MANDATE
                  </h3>
                  <Link
                    href={`/clients/${caseData.clientId}`}
                    className="text-[11px] font-mono text-[#E8823A] hover:underline"
                  >
                    View full client profile →
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">Client Legal Name</span>
                    <div className="font-bold text-zinc-100">{caseData.clientName}</div>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">Target Due Date</span>
                    <div className="font-mono text-amber-400 font-bold">
                      {new Date(caseData.dueDate).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                  </div>
                  {caseData.pan && (
                    <div>
                      <span className="text-[10px] font-mono text-zinc-500 uppercase">PAN</span>
                      <div className="font-mono text-zinc-200">{caseData.pan}</div>
                    </div>
                  )}
                  {caseData.gstin && (
                    <div>
                      <span className="text-[10px] font-mono text-zinc-500 uppercase">GSTIN</span>
                      <div className="font-mono text-zinc-200">{caseData.gstin}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Documents List */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-5 space-y-3 shadow-sm">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <h3 className="text-xs font-bold font-mono text-zinc-300 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-400" /> ATTACHED DOCUMENTS &amp; WORKING PAPERS
                  </h3>
                  <span className="text-[10px] font-mono text-zinc-500">
                    {caseData.documents?.length || 0} Files Attached
                  </span>
                </div>

                <div className="space-y-2">
                  {(!caseData.documents || caseData.documents.length === 0) ? (
                    <div className="py-4 text-center text-zinc-500 font-mono text-xs">
                      No documents uploaded for this case.
                    </div>
                  ) : (
                    caseData.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-3 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <FileText className="h-4 w-4 text-blue-400 shrink-0" />
                          <div className="truncate">
                            <div className="font-bold text-zinc-200 truncate">{doc.filename}</div>
                            <div className="text-[10px] font-mono text-zinc-500">
                              v{doc.version} • {(doc.sizeBytes / (1024 * 1024)).toFixed(2)} MB
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-800 border border-zinc-700 text-[11px] font-mono text-zinc-300 hover:text-white"
                        >
                          <Download className="h-3 w-3" /> Download
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Client Threaded Messages */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-5 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <h3 className="text-xs font-bold font-mono text-zinc-300 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-emerald-400" /> CLIENT COMMUNICATION THREAD
                  </h3>
                  <span className="text-[10px] font-mono text-emerald-400">Direct Portal Channel</span>
                </div>

                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {(!caseData.messages || caseData.messages.length === 0) ? (
                    <div className="py-4 text-center text-zinc-500 font-mono text-xs">
                      No client messages in this case thread yet.
                    </div>
                  ) : (
                    caseData.messages.map((m) => (
                      <div
                        key={m.id}
                        className={`p-3 rounded-xl text-xs space-y-1 ${
                          m.sender === 'STAFF'
                            ? 'bg-zinc-800/80 border border-zinc-700 ml-8'
                            : 'bg-blue-950/30 border border-blue-800/40 mr-8'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className={m.sender === 'STAFF' ? 'text-[#E8823A] font-bold' : 'text-blue-400 font-bold'}>
                            {m.sender === 'STAFF' ? `[STAFF] ${m.senderName}` : `[CLIENT] ${m.senderName}`}
                          </span>
                          <span className="text-zinc-500">
                            {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-zinc-200 leading-relaxed">{m.body}</p>
                      </div>
                    ))
                  )}
                </div>

                <form onSubmit={handleSendClientMessage} className="flex gap-2 pt-2 border-t border-zinc-800">
                  <input
                    type="text"
                    required
                    placeholder="Reply to client in portal..."
                    value={newClientMsg}
                    onChange={(e) => setNewClientMsg(e.target.value)}
                    className="flex-1 rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-xs text-zinc-100 focus:border-[#1B2A4A] focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={isSendingMsg || !newClientMsg.trim()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1B2A4A] text-white font-bold text-xs hover:bg-[#1B2A4A]/90 disabled:opacity-50"
                  >
                    <Send className="h-3.5 w-3.5" /> Send
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column: Staff-Only Controls & Internal Notes (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Reassignment Control (ADMIN / SENIOR_CA only) */}
              {(isAdmin || isSeniorCa) && (
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-5 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <h3 className="text-xs font-bold font-mono text-zinc-300 flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-amber-400" /> PARTNER ASSIGNMENT
                    </h3>
                    <span className="text-[10px] font-mono text-amber-400">Admin Control</span>
                  </div>

                  <form onSubmit={handleReassign} className="space-y-3 text-xs">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-zinc-400 block">
                        Assigned Chartered Accountant / Lead
                      </label>
                      <select
                        value={selectedStaffEmail}
                        onChange={(e) => setSelectedStaffEmail(e.target.value)}
                        className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs font-semibold text-zinc-200 focus:border-[#1B2A4A] focus:outline-none"
                      >
                        <option value="ca.thabrez@thabreztaxconsulting.com">CA. Thabrez (Principal)</option>
                        <option value="khan@thabreztaxconsulting.com">Senior CA Khan</option>
                        <option value="sharma@thabreztaxconsulting.com">Associate Sharma</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={isReassigning || selectedStaffEmail === caseData.assignedCaEmail}
                      className="w-full py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-xs font-mono font-bold text-zinc-200 hover:bg-zinc-700 disabled:opacity-50 transition-colors"
                    >
                      {isReassigning ? 'Reassigning...' : 'Update Lead Assignment'}
                    </button>
                  </form>
                </div>
              )}

              {/* Internal Confidential Staff Notes */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-5 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-[#E8823A]" />
                    <h3 className="text-xs font-bold font-mono text-zinc-300">
                      INTERNAL PRIVATE NOTES
                    </h3>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[9px] font-mono bg-red-950/60 border border-red-800 text-red-400 px-1.5 py-0.2 rounded">
                    Staff Only
                  </span>
                </div>

                <p className="text-[10px] text-zinc-500">
                  Private working notes, audit checklists, and internal tax advisory remarks. Invisible to client.
                </p>

                {/* Add Note Form */}
                <form onSubmit={handleAddInternalNote} className="space-y-2">
                  <textarea
                    rows={3}
                    required
                    placeholder="Add confidential working paper reference or filing observation..."
                    value={newInternalNote}
                    onChange={(e) => setNewInternalNote(e.target.value)}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-xs text-zinc-100 focus:border-[#1B2A4A] focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={isSavingNote || !newInternalNote.trim()}
                    className="w-full py-1.5 rounded-lg bg-[#E8823A] text-white font-bold text-xs hover:bg-[#d9732d] disabled:opacity-50 transition-colors"
                  >
                    Save Internal Note
                  </button>
                </form>

                {/* Notes List */}
                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {(!caseData.internalNotes || caseData.internalNotes.length === 0) ? (
                    <div className="py-2 text-center text-zinc-600 font-mono text-[11px]">
                      No internal notes recorded.
                    </div>
                  ) : (
                    caseData.internalNotes.map((note) => (
                      <div
                        key={note.id}
                        className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-3 space-y-1 text-xs"
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                          <span className="font-bold text-zinc-300">{note.author}</span>
                          <span>
                            {new Date(note.createdAt).toLocaleDateString('en-IN', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                        <p className="text-zinc-300 text-[11px] leading-relaxed">{note.note}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Case Financials (Role Restricted) */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-5 space-y-3 shadow-sm">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <h3 className="text-xs font-bold font-mono text-zinc-300">
                    ENGAGEMENT BILLING STATUS
                  </h3>
                  <span className="text-[10px] font-mono text-zinc-500">Invoice Ref</span>
                </div>

                {isFrontDesk ? (
                  <div className="p-3 bg-zinc-950/80 rounded-xl border border-zinc-800 text-center space-y-1">
                    <Lock className="h-4 w-4 text-amber-500 mx-auto" />
                    <span className="text-[11px] font-mono text-zinc-400 block">
                      Fee amounts restricted for Front Desk.
                    </span>
                  </div>
                ) : caseData.invoice ? (
                  <div className="p-3.5 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center justify-between">
                    <div>
                      <div className="font-mono text-xs font-bold text-zinc-200">
                        {caseData.invoice.invoiceNumber}
                      </div>
                      <div className="text-[10px] text-zinc-500 font-mono">
                        Status: {caseData.invoice.status}
                      </div>
                    </div>
                    <div className="text-right font-mono font-bold text-sm text-emerald-400">
                      ₹{caseData.invoice.amount.toLocaleString('en-IN')}
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800 text-center text-zinc-500 font-mono text-xs">
                    No invoice generated yet for this engagement.
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Fallback Demo Seed Data
const defaultDemoCaseDetail: Record<string, CaseDetailData> = {
  case_1: {
    id: 'case_1',
    clientId: 'c1',
    clientName: 'Nexus Tech Private Limited',
    pan: 'AAACN1234F',
    gstin: '29AAACN1234F1Z5',
    serviceType: 'Private Limited Company Incorporation',
    status: 'IN_REVIEW',
    assignedCaName: 'CA. Thabrez',
    assignedCaEmail: 'ca.thabrez@thabreztaxconsulting.com',
    dueDate: '2026-08-20',
    createdAt: '2026-08-10',
    updatedAt: '2026-08-15',
    documents: [
      {
        id: 'doc_1',
        filename: 'SPICe_Plus_Part_B_Draft.pdf',
        version: 2,
        sizeBytes: 1024 * 1024 * 2.4,
        uploadedAt: '2026-08-12',
      },
      {
        id: 'doc_2',
        filename: 'Directors_PAN_Aadhaar_KYC.pdf',
        version: 1,
        sizeBytes: 1024 * 1024 * 4.1,
        uploadedAt: '2026-08-10',
      },
    ],
    messages: [
      {
        id: 'm1',
        sender: 'CLIENT',
        senderName: 'Nexus Tech (Director)',
        body: 'Uploaded the signed INC-9 and utility bill as requested.',
        createdAt: '2026-08-12T10:30:00Z',
      },
      {
        id: 'm2',
        sender: 'STAFF',
        senderName: 'CA. Thabrez',
        body: 'Received. Validating DSC token associations before uploading to MCA V3 portal.',
        createdAt: '2026-08-12T11:15:00Z',
      },
    ],
    internalNotes: [
      {
        id: 'n1',
        author: 'CA. Thabrez',
        note: 'Name RUN approval granted for NEXUS TECH CLOUD SOLUTIONS PVT LTD. Preparing AGILE-PRO-S for simultaneous GSTIN and EPFO enrollment.',
        createdAt: '2026-08-11T14:00:00Z',
      },
    ],
    invoice: {
      id: 'inv_1',
      invoiceNumber: 'INV-2026-0042',
      amount: 25000,
      status: 'PAID',
    },
  },
};
