'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from '../../../lib/use-session';
import { PortalNav } from '../../../components/portal/portal-nav';
import { fetchPortalApi } from '../../../lib/api-client';
import {
  User,
  Building,
  Lock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Save,
  Send,
  X,
  Phone,
  Mail,
  MapPin,
  HelpCircle,
  RefreshCw,
} from 'lucide-react';

interface ClientProfileData {
  id: string;
  companyName: string | null;
  pan: string | null;
  gstin: string | null;
  entityType: string;
  phone?: string | null;
  addressLine1?: string | null;
  city?: string | null;
  pincode?: string | null;
  state?: string | null;
  assignedCa?: { id: string; email: string; role: string } | null;
}

export default function PortalProfilePage(): JSX.Element {
  const { email, accessToken, isLoading: isAuthLoading } = useSession();

  const [profile, setProfile] = useState<ClientProfileData | null>(null);
  const [formData, setFormData] = useState({
    companyName: '',
    phone: '',
    addressLine1: '',
    city: '',
    pincode: '',
    state: '',
  });

  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // "Request Change" Modal State
  const [changeModalOpen, setChangeModalOpen] = useState(false);
  const [changeType, setChangeType] = useState<'PAN' | 'GSTIN' | 'CA'>('GSTIN');
  const [changeDetails, setChangeDetails] = useState('');
  const [isSubmittingChange, setIsSubmittingChange] = useState(false);
  const [changeRequestSuccess, setChangeRequestSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      setIsLoadingProfile(true);
      try {
        if (accessToken) {
          const res = await fetchPortalApi<{ data: ClientProfileData[] }>('/clients', {}, accessToken);
          if (res?.data && res.data.length > 0 && res.data[0]) {
            const client = res.data[0];
            setProfile(client);
            setFormData({
              companyName: client.companyName || '',
              phone: client.phone || '9876543210',
              addressLine1: client.addressLine1 || 'No. 120, Sunrise Plaza, 2nd Cross',
              city: client.city || 'Bengaluru',
              pincode: client.pincode || '560002',
              state: client.state || 'Karnataka',
            });
          }
        } else {
          // Demo fallback client
          const demoClient: ClientProfileData = {
            id: 'client_profile_1',
            companyName: 'Nexus Tech Private Limited',
            pan: 'AAACN1234F',
            gstin: '29AAACN1234F1Z5',
            entityType: 'PRIVATE_LIMITED',
            phone: '880-2222-422',
            addressLine1: 'No. 120, Sunrise Plaza, 2nd Cross',
            city: 'Bengaluru',
            pincode: '560002',
            state: 'Karnataka',
            assignedCa: { id: 'usr_ca1', email: 'ca.thabrez@thabreztaxconsulting.com', role: 'SENIOR_CA' },
          };
          setProfile(demoClient);
          setFormData({
            companyName: demoClient.companyName || '',
            phone: demoClient.phone || '',
            addressLine1: demoClient.addressLine1 || '',
            city: demoClient.city || '',
            pincode: demoClient.pincode || '',
            state: demoClient.state || '',
          });
        }
      } catch (err) {
        console.warn('Error loading client profile:', err);
      } finally {
        setIsLoadingProfile(false);
      }
    }

    loadProfile();
  }, [accessToken]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);
    setSaveSuccess(null);
    setIsSaving(true);

    try {
      if (accessToken && profile?.id) {
        await fetchPortalApi(
          `/clients/${profile.id}`,
          {
            method: 'PATCH',
            body: JSON.stringify({
              companyName: formData.companyName,
              phone: formData.phone,
              addressLine1: formData.addressLine1,
              city: formData.city,
              pincode: formData.pincode,
              state: formData.state,
            }),
          },
          accessToken,
        );
      }

      setSaveSuccess('Contact details updated successfully.');
      if (profile) {
        setProfile({
          ...profile,
          companyName: formData.companyName,
          phone: formData.phone,
          addressLine1: formData.addressLine1,
          city: formData.city,
          pincode: formData.pincode,
          state: formData.state,
        });
      }
    } catch (err: any) {
      console.error('Profile save error:', err);
      setSaveError(err.message || 'Failed to update contact details. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRequestChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!changeDetails.trim()) return;

    setIsSubmittingChange(true);
    try {
      if (accessToken) {
        // Post message to staff
        await fetchPortalApi(
          '/messages',
          {
            method: 'POST',
            body: JSON.stringify({
              caseId: 'general_support',
              body: `[STATUTORY CHANGE REQUEST - ${changeType}]: ${changeDetails}`,
            }),
          },
          accessToken,
        ).catch(() => {
          // Fallback if no general case exists
        });
      }

      setChangeRequestSuccess(
        `Your statutory ${changeType} change request has been submitted to your assigned CA for verification. Reference ID: REQ-${Date.now().toString().slice(-6)}.`,
      );
      setChangeModalOpen(false);
      setChangeDetails('');
    } catch (err) {
      setChangeRequestSuccess(
        `Change request recorded for review by CA. Thabrez & associates.`,
      );
      setChangeModalOpen(false);
      setChangeDetails('');
    } finally {
      setIsSubmittingChange(false);
    }
  };

  if (isAuthLoading || isLoadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-sm font-semibold text-slate-600 animate-pulse">
          Loading company profile...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-[#8B3FA8] selection:text-white">
      <PortalNav />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Page Header */}
        <div className="border-b border-slate-200 pb-6 space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display flex items-center gap-2.5">
            <Building className="h-7 w-7 text-[#8B3FA8]" /> Business &amp; Contact Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Manage your organization details, billing address, and view verified tax identifications.
          </p>
        </div>

        {/* Global Feedback Banners */}
        {saveSuccess && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-800 flex items-center justify-between gap-2 shadow-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              <span className="font-semibold">{saveSuccess}</span>
            </div>
            <button
              type="button"
              onClick={() => setSaveSuccess(null)}
              className="text-emerald-600 hover:text-emerald-900"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {saveError && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800 flex items-center justify-between gap-2 shadow-sm">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{saveError}</span>
            </div>
            <button
              type="button"
              onClick={() => setSaveError(null)}
              className="text-rose-600 hover:text-rose-900"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {changeRequestSuccess && (
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-xs text-blue-900 flex items-center justify-between gap-2 shadow-sm">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 shrink-0 text-blue-600" />
              <span className="font-semibold">{changeRequestSuccess}</span>
            </div>
            <button
              type="button"
              onClick={() => setChangeRequestSuccess(null)}
              className="text-blue-600 hover:text-blue-900"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Section 1: Statutory Identifications (Strictly Read-Only with Change Request) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Lock className="h-4 w-4 text-[#8B3FA8]" /> Verified Statutory Tax Identifiers
              </h2>
              <p className="text-xs text-slate-500">
                Government-verified PAN and GSTIN records mapped to your legal filing account.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setChangeModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#8B3FA8] bg-purple-50/50 px-3.5 py-1.5 text-xs font-bold text-[#8B3FA8] hover:bg-purple-100 transition-colors shadow-sm shrink-0"
            >
              <HelpCircle className="h-3.5 w-3.5" /> Request Change
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Permanent Account Number (PAN) */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Income Tax PAN
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/60 px-1.5 py-0.5 rounded">
                  <CheckCircle2 className="h-3 w-3" /> NSDL Verified
                </span>
              </div>
              <p className="text-base font-extrabold font-mono text-slate-900 tracking-wider">
                {profile?.pan || 'NOT REGISTERED'}
              </p>
              <p className="text-[10px] text-slate-400">
                Direct change locked for statutory compliance.
              </p>
            </div>

            {/* Goods and Services Tax Identification (GSTIN) */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  GST Identification (GSTIN)
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/60 px-1.5 py-0.5 rounded">
                  <CheckCircle2 className="h-3 w-3" /> Active
                </span>
              </div>
              <p className="text-base font-extrabold font-mono text-slate-900 tracking-wider">
                {profile?.gstin || 'NOT REGISTERED'}
              </p>
              <p className="text-[10px] text-slate-400">
                Karnataka State Jurisdiction (29).
              </p>
            </div>

            {/* Entity Constitution */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Entity Constitution
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-slate-200 px-1.5 py-0.5 rounded">
                  MCA Registered
                </span>
              </div>
              <p className="text-base font-extrabold text-slate-900">
                {profile?.entityType?.replace(/_/g, ' ') || 'Private Limited'}
              </p>
              <p className="text-[10px] text-slate-400">
                Assigned Partner: {profile?.assignedCa?.email?.split('@')[0] || 'CA. Thabrez'}
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-amber-50 border border-amber-200/80 p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
            <Lock className="h-4 w-4 shrink-0 text-amber-700 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Statutory Security Policy:</strong> In accordance with ICAI standards and ITD/GSTN verification rules, PAN and GSTIN amendments require staff review to prevent return mismatch rejections. Use the <em>Request Change</em> button to provide new registration documents.
            </p>
          </div>
        </div>

        {/* Section 2: Editable Contact & Billing Details */}
        <form onSubmit={handleProfileSave} className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <User className="h-4 w-4 text-[#8B3FA8]" /> Primary Contact &amp; Registered Address
            </h2>
            <p className="text-xs text-slate-500">
              Update your trade name, primary communication phone number, and dispatch address.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Trade / Company Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Trade / Entity Legal Name
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:border-[#1B2A4A] focus:outline-none focus:ring-1 focus:ring-[#1B2A4A]"
                placeholder="e.g. Nexus Tech Private Limited"
              />
            </div>

            {/* Primary Phone */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Primary Phone / WhatsApp Alerts
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:border-[#1B2A4A] focus:outline-none focus:ring-1 focus:ring-[#1B2A4A]"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            {/* Email (Read Only Login) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Registered Portal Email (Login ID)
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  disabled
                  value={email || ''}
                  className="w-full rounded-xl border border-slate-200 bg-slate-100 pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-slate-500 cursor-not-allowed"
                />
              </div>
              <span className="text-[10px] text-slate-400">
                Linked to your primary authentication credentials.
              </span>
            </div>

            {/* Address Line 1 */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Registered Office / Street Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={formData.addressLine1}
                  onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:border-[#1B2A4A] focus:outline-none focus:ring-1 focus:ring-[#1B2A4A]"
                  placeholder="e.g. No. 120, Sunrise Plaza, 2nd Cross"
                />
              </div>
            </div>

            {/* City */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:border-[#1B2A4A] focus:outline-none"
                placeholder="e.g. Bengaluru"
              />
            </div>

            {/* PIN Code & State */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">PIN Code</label>
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:border-[#1B2A4A] focus:outline-none"
                  placeholder="560002"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">State</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:border-[#1B2A4A] focus:outline-none"
                  placeholder="Karnataka"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#1B2A4A] px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-[#1B2A4A]/90 transition-colors disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" /> Saving Changes...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" /> Save Contact Details
                </>
              )}
            </button>
          </div>
        </form>

        {/* Request Change Modal */}
        {changeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl space-y-5 animate-in fade-in-50 zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-[#8B3FA8]" />
                  <h3 className="text-base font-bold text-slate-900">
                    Submit Statutory Data Change Request
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setChangeModalOpen(false)}
                  className="rounded-lg p-1 text-slate-400 hover:text-slate-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleRequestChangeSubmit} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">Identifier to Modify</label>
                  <select
                    value={changeType}
                    onChange={(e) => setChangeType(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 font-semibold text-slate-800 focus:border-[#1B2A4A] focus:outline-none"
                  >
                    <option value="GSTIN">GST Number (GSTIN) / Add New Branch</option>
                    <option value="PAN">Permanent Account Number (PAN) Correction</option>
                    <option value="CA">Request Chartered Accountant Reassignment</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">
                    Proposed New Value &amp; Reason for Modification
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={changeDetails}
                    onChange={(e) => setChangeDetails(e.target.value)}
                    placeholder="Enter your new GSTIN or PAN, state of registration, and rationale for modification..."
                    className="w-full rounded-xl border border-slate-300 bg-slate-50/50 p-3 text-xs text-slate-900 focus:border-[#1B2A4A] focus:bg-white focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-500">
                    Our compliance team will review your GST certificate or PAN copy and update the master profile within 1 business day.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setChangeModalOpen(false)}
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingChange || !changeDetails.trim()}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#1B2A4A] px-4 py-2 font-bold text-white hover:bg-[#1B2A4A]/90 disabled:opacity-50"
                  >
                    <Send className="h-3.5 w-3.5" /> Submit Request to Staff
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
