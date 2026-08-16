'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useSession } from '../../../../lib/use-session';
import { PortalNav } from '../../../../components/portal/portal-nav';
import { DocumentUploadManager, type CaseDocument } from '../../../../components/portal/document-upload-manager';
import { fetchPortalApi } from '../../../../lib/api-client';
import {
  ArrowLeft,
  CheckCircle2,
  Send,
  User,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

interface CaseDetail {
  id: string;
  serviceType: string;
  status: 'RECEIVED' | 'IN_REVIEW' | 'FILED' | 'ACKNOWLEDGED' | 'CLOSED';
  dueDate: string | null;
  createdAt: string;
  assignedTo?: { id: string; email: string; role: string } | null;
  client?: { id: string; companyName: string | null; pan: string | null; gstin: string | null };
  documents?: CaseDocument[];
  messages?: MessageItem[];
}

interface MessageItem {
  id: string;
  body: string;
  createdAt: string;
  sender?: { id: string; email: string; role: string } | null;
}

export default function CaseDetailPage(): JSX.Element {
  const params = useParams();
  const caseId = (params?.id as string) || '';
  const { user, email, accessToken, isLoading: isAuthLoading } = useSession();

  const [caseData, setCaseData] = useState<CaseDetail | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [documents, setDocuments] = useState<CaseDocument[]>([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isLoadingCase, setIsLoadingCase] = useState(true);

  useEffect(() => {
    async function loadCaseDetail() {
      setIsLoadingCase(true);
      try {
        if (accessToken && caseId) {
          const data = await fetchPortalApi<CaseDetail>(`/cases/${caseId}`, {}, accessToken);
          if (data) {
            setCaseData(data);
            setDocuments(data.documents || []);
            setMessages(data.messages || []);
          }
        } else {
          // Demo fallback case for preview
          const demoCase: CaseDetail = {
            id: caseId || 'case_gst_aug2026',
            serviceType: 'GST_FILING',
            status: 'IN_REVIEW',
            dueDate: '2026-08-20T18:30:00.000Z',
            createdAt: '2026-08-10T10:00:00.000Z',
            assignedTo: { id: 'usr_ca1', email: 'ananya.reddy@thabreztaxconsulting.com', role: 'SENIOR_CA' },
            client: { id: 'cli_1', companyName: 'Nexus Tech Private Limited', pan: 'AAACN1234F', gstin: '29AAACN1234F1Z5' },
            documents: [
              {
                id: 'doc_1',
                filename: 'GSTR_1_Sales_Ledger_July2026.xlsx',
                fileSize: 245000,
                version: 1,
                uploadedAt: '2026-08-10T10:30:00.000Z',
              },
              {
                id: 'doc_2',
                filename: 'Purchase_Invoices_Summary_July2026.pdf',
                fileSize: 1250000,
                version: 1,
                uploadedAt: '2026-08-10T11:00:00.000Z',
              },
            ],
            messages: [
              {
                id: 'msg_1',
                body: 'Hello, we have uploaded the sales register and purchase vouchers for July 2026. Please reconcile with GSTR-2B.',
                createdAt: '2026-08-10T11:15:00.000Z',
                sender: { id: 'usr_client', email: email || 'client@example.com', role: 'CLIENT' },
              },
              {
                id: 'msg_2',
                body: 'Received. We have downloaded your data and are currently running the 2B ITC mismatch reconciliation. Form GSTR-3B draft computation will be ready shortly.',
                createdAt: '2026-08-11T09:30:00.000Z',
                sender: { id: 'usr_ca1', email: 'ananya.reddy@thabreztaxconsulting.com', role: 'SENIOR_CA' },
              },
            ],
          };

          setCaseData(demoCase);
          setDocuments(demoCase.documents || []);
          setMessages(demoCase.messages || []);
        }
      } catch (err) {
        console.warn('Error loading case detail:', err);
      } finally {
        setIsLoadingCase(false);
      }
    }

    loadCaseDetail();
  }, [caseId, accessToken, email]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;

    setIsSendingMessage(true);
    const tempId = `temp_${Date.now()}`;
    const textToSend = newMessageText.trim();
    setNewMessageText('');

    const newMsgObj: MessageItem = {
      id: tempId,
      body: textToSend,
      createdAt: new Date().toISOString(),
      sender: {
        id: user?.id || 'client_id',
        email: email || 'client@example.com',
        role: 'CLIENT',
      },
    };

    setMessages((prev) => [...prev, newMsgObj]);

    try {
      if (accessToken) {
        await fetchPortalApi(
          '/messages',
          {
            method: 'POST',
            body: JSON.stringify({
              caseId,
              body: textToSend,
            }),
          },
          accessToken,
        );
      }
    } catch (err) {
      console.warn('Message send failed over API, kept in local state:', err);
    } finally {
      setIsSendingMessage(false);
    }
  };

  // Status Stepper configuration
  const steps = [
    { key: 'RECEIVED', label: '1. Received', desc: 'Documents received & verified' },
    { key: 'IN_REVIEW', label: '2. In Review', desc: 'Reconciliation & CA preparation' },
    { key: 'FILED', label: '3. Filed', desc: 'Transmitted to government portal' },
    { key: 'ACKNOWLEDGED', label: '4. Acknowledged', desc: 'Statutory challan & ARN generated' },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'RECEIVED':
        return 0;
      case 'IN_REVIEW':
        return 1;
      case 'FILED':
        return 2;
      case 'ACKNOWLEDGED':
      case 'CLOSED':
        return 3;
      default:
        return 0;
    }
  };

  const currentStepIndex = getStepIndex(caseData?.status || 'RECEIVED');

  if (isAuthLoading || isLoadingCase) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-sm font-semibold text-slate-600 animate-pulse">
          Opening Case Workspace...
        </div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <PortalNav />
        <main className="flex-1 max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
          <AlertCircle className="mx-auto h-12 w-12 text-rose-500" />
          <h2 className="text-xl font-bold text-slate-900">Case Not Found</h2>
          <p className="text-xs sm:text-sm text-slate-600">
            This case does not exist or you do not have permission to view it.
          </p>
          <Link
            href="/portal/cases"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#1B2A4A] px-4 py-2 text-xs font-bold text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Back to My Cases
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-[#8B3FA8] selection:text-white">
      <PortalNav />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top Breadcrumb & Case Title */}
        <div className="space-y-4 border-b border-slate-200 pb-6">
          <Link
            href="/portal/cases"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to All Cases
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-500">
                  Case Reference: #{caseData.id}
                </span>
                <span className="rounded-md bg-[#1B2A4A] px-2.5 py-0.5 text-xs font-bold text-white font-display">
                  {caseData.serviceType.replace(/_/g, ' ')}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
                {caseData.client?.companyName || 'Client Statutory Filing Workspace'}
              </h1>
            </div>

            <div className="text-right text-xs">
              <span className="text-slate-500 block">Target Statutory Deadline:</span>
              <span className="font-mono font-bold text-base text-[#E8823A]">
                {caseData.dueDate
                  ? new Date(caseData.dueDate).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })
                  : 'Ongoing Compliance'}
              </span>
            </div>
          </div>
        </div>

        {/* Visual Stepper / Status Timeline */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            Statutory Filing Progress Timeline
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
            {steps.map((step, idx) => {
              const isCompleted = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div
                  key={step.key}
                  className={`rounded-xl border p-4 transition-all relative ${
                    isCurrent
                      ? 'border-[#8B3FA8] bg-[#8B3FA8]/5 ring-2 ring-[#8B3FA8]/20'
                      : isCompleted
                      ? 'border-emerald-200 bg-emerald-50/50'
                      : 'border-slate-200 bg-slate-50/60 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    ) : isCurrent ? (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#8B3FA8] text-white text-[11px] font-bold animate-pulse">
                        {idx + 1}
                      </div>
                    ) : (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-300 text-slate-700 text-[11px] font-bold">
                        {idx + 1}
                      </div>
                    )}
                    <span
                      className={`text-xs font-bold ${
                        isCurrent
                          ? 'text-[#8B3FA8]'
                          : isCompleted
                          ? 'text-emerald-900'
                          : 'text-slate-600'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Split Grid: Document Management (Left) + Threaded Chat (Right) */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Documents Section (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <DocumentUploadManager
              caseId={caseId}
              accessToken={accessToken}
              initialDocuments={documents}
              onDocumentsUpdated={(updated) => setDocuments(updated)}
            />

            {/* Assigned CA Officer Info Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#8B3FA8]" /> Assigned Professional
              </h4>
              <div className="flex items-center justify-between text-slate-700">
                <span>Practicing CA / Officer:</span>
                <span className="font-semibold text-slate-900">
                  {caseData.assignedTo?.email || 'CA. Ananya Reddy (Senior Partner)'}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span>Direct Helpline:</span>
                <span className="font-semibold text-slate-900">+91 880-2222-422</span>
              </div>
            </div>
          </div>

          {/* Threaded Messages Section (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col h-[520px]">
              <div className="border-b border-slate-100 pb-3 mb-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <User className="h-5 w-5 text-[#8B3FA8]" /> Case Advisory Thread
                </h3>
                <p className="text-[11px] text-slate-500">
                  Direct communication channel with your assigned Chartered Accountant.
                </p>
              </div>

              {/* Message Stream */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-2">
                    <User className="h-8 w-8 text-slate-300" />
                    <p className="text-xs font-semibold text-slate-600">No messages in this case thread yet.</p>
                    <p className="text-[11px] text-slate-400">Type a message below to consult with your CA officer.</p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isClientSender =
                      msg.sender?.role === 'CLIENT' || msg.sender?.email === email;

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${
                          isClientSender ? 'items-end' : 'items-start'
                        }`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl p-3.5 text-xs shadow-sm ${
                            isClientSender
                              ? 'bg-[#1B2A4A] text-white rounded-br-none'
                              : 'bg-slate-100 text-slate-900 rounded-bl-none border border-slate-200/80'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3 text-[10px] opacity-75 mb-1 font-mono">
                            <span>
                              {isClientSender
                                ? 'You'
                                : msg.sender?.email?.split('@')[0] || 'CA Partner'}
                            </span>
                            <span>
                              {new Date(msg.createdAt).toLocaleTimeString('en-IN', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          <p className="leading-relaxed whitespace-pre-line">{msg.body}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Message Input Form */}
              <form onSubmit={handleSendMessage} className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type a message or compliance query..."
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                  className="flex-1 rounded-xl border border-slate-300 bg-slate-50/50 px-4 py-2.5 text-xs text-slate-900 focus:border-[#1B2A4A] focus:bg-white focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isSendingMessage || !newMessageText.trim()}
                  className="rounded-xl bg-[#1B2A4A] p-2.5 text-white shadow hover:bg-[#1B2A4A]/90 transition-colors disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
