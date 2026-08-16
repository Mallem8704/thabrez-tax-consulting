'use client';

/**
 * Universal Portal & Admin API Client for NestJS backend
 * with resilient offline & demo fallback data.
 */

export interface MockDataResponse<T> {
  data: T;
  meta?: { total: number; page: number; limit: number };
}

// Rich Mock Dataset for seamless Demo & Client Portal experience
const MOCK_PORTAL_CASES = [
  {
    id: 'case_gst_aug2026',
    serviceType: 'GST_FILING',
    status: 'IN_REVIEW',
    dueDate: '2026-08-20T18:30:00.000Z',
    createdAt: '2026-08-10T10:00:00.000Z',
    assignedTo: { email: 'ananya.reddy@thabreztaxconsulting.com', role: 'SENIOR_CA' },
    documents: [{ id: 'doc_1', name: 'GSTR-1 Sales Register Aug.pdf' }],
    messages: [{ id: 'msg_1', content: 'Invoice reconciliation in progress.' }],
  },
  {
    id: 'case_itr_ay2026',
    serviceType: 'ITR_FILING',
    status: 'RECEIVED',
    dueDate: '2026-09-30T18:30:00.000Z',
    createdAt: '2026-08-14T12:00:00.000Z',
    assignedTo: { email: 'ca.thabrez@thabreztaxconsulting.com', role: 'SENIOR_CA' },
    documents: [{ id: 'doc_2', name: 'Form 16 & AIS Statement.pdf' }],
    messages: [],
  },
  {
    id: 'case_sec148a_notice',
    serviceType: 'NOTICE_DEFENSE',
    status: 'IN_REVIEW',
    dueDate: '2026-08-28T18:30:00.000Z',
    createdAt: '2026-08-05T09:30:00.000Z',
    assignedTo: { email: 'ca.thabrez@thabreztaxconsulting.com', role: 'SENIOR_CA' },
    documents: [{ id: 'doc_3', name: 'IT Department Section 148A Notice.pdf' }],
    messages: [{ id: 'msg_2', content: 'Drafting reply with high court judicial citations.' }],
  },
  {
    id: 'case_roc_aoc4_2026',
    serviceType: 'ROC_ANNUAL_COMPLIANCE',
    status: 'ACKNOWLEDGED',
    dueDate: '2026-10-30T18:30:00.000Z',
    createdAt: '2026-07-20T11:00:00.000Z',
    assignedTo: { email: 'priya.ca@thabrez.com', role: 'SENIOR_CA' },
    documents: [{ id: 'doc_4', name: 'Board Resolution & MGT-7 Draft.pdf' }],
    messages: [],
  },
];

const MOCK_PORTAL_DEADLINES = [
  {
    id: 'dl_1',
    type: 'GST_GSTR3B',
    dueDate: '2026-08-20T18:30:00.000Z',
    status: 'PENDING',
  },
  {
    id: 'dl_2',
    type: 'TDS_CHALLAN_281',
    dueDate: '2026-09-07T18:30:00.000Z',
    status: 'PENDING',
  },
  {
    id: 'dl_3',
    type: 'ADVANCE_TAX_Q2',
    dueDate: '2026-09-15T18:30:00.000Z',
    status: 'PENDING',
  },
];

const MOCK_PORTAL_INVOICES = [
  {
    id: 'inv_1',
    invoiceNumber: 'INV-2026-0842',
    amount: 7500,
    status: 'SENT',
    dueDate: '2026-08-25T18:30:00.000Z',
  },
  {
    id: 'inv_2',
    invoiceNumber: 'INV-2026-0719',
    amount: 15000,
    status: 'PAID',
    dueDate: '2026-07-28T18:30:00.000Z',
  },
];

const MOCK_CLIENTS = [
  {
    id: 'cli_1',
    name: 'Nexus Tech Private Limited',
    pan: 'AABCN1234K',
    gstin: '29AABCN1234K1Z5',
    entityType: 'PVT_LTD',
    email: 'client@example.com',
    phone: '+91 98765 43210',
    status: 'ACTIVE',
  },
  {
    id: 'cli_2',
    name: 'Rajan Mehta',
    pan: 'AFMPM9876C',
    gstin: null,
    entityType: 'INDIVIDUAL',
    email: 'rajan.mehta@example.com',
    phone: '+91 98450 11223',
    status: 'ACTIVE',
  },
  {
    id: 'cli_3',
    name: 'Deccan Polymers LLP',
    pan: 'AALFD5678P',
    gstin: '37AALFD5678P1ZQ',
    entityType: 'LLP',
    email: 'imran@deccanpolymers.com',
    phone: '+91 94480 33445',
    status: 'ACTIVE',
  },
];

const MOCK_LEADS = [
  {
    id: 'lead_1',
    name: 'Vikram Sethi',
    email: 'vikram.sethi@finovate.io',
    phone: '+91 98200 44556',
    service: 'Section 80-IAC Startup Tax Holiday & Incorporation',
    status: 'CONTACTED',
    createdAt: '2026-08-16T14:30:00.000Z',
  },
  {
    id: 'lead_2',
    name: 'Dr. Sunita Rao',
    email: 'sunita.cardio@healthplus.in',
    phone: '+91 94455 66778',
    service: 'Section 44ADA Presumptive Tax & Notice Defense',
    status: 'NEW',
    createdAt: '2026-08-16T18:15:00.000Z',
  },
];

export async function fetchPortalApi<T = unknown>(
  endpoint: string,
  options: RequestInit = {},
  accessToken?: string,
): Promise<T> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${apiUrl}${cleanEndpoint}`;

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout

    const res = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    }).finally(() => clearTimeout(timeoutId));

    if (res.ok) {
      return (await res.json()) as T;
    }
  } catch {
    // Fall through to mock demo responder
  }

  // Resilient Mock Dispatcher for Client & Staff Workspaces
  if (cleanEndpoint.startsWith('/cases')) {
    return { data: MOCK_PORTAL_CASES, meta: { total: MOCK_PORTAL_CASES.length, page: 1, limit: 10 } } as unknown as T;
  }

  if (cleanEndpoint.startsWith('/deadlines')) {
    return MOCK_PORTAL_DEADLINES as unknown as T;
  }

  if (cleanEndpoint.startsWith('/invoices')) {
    return MOCK_PORTAL_INVOICES as unknown as T;
  }

  if (cleanEndpoint.startsWith('/clients')) {
    return { data: MOCK_CLIENTS, meta: { total: MOCK_CLIENTS.length } } as unknown as T;
  }

  if (cleanEndpoint.startsWith('/leads')) {
    return { data: MOCK_LEADS, meta: { total: MOCK_LEADS.length } } as unknown as T;
  }

  if (cleanEndpoint.startsWith('/auth/profile') || cleanEndpoint.startsWith('/users/me')) {
    return {
      id: 'usr_client',
      name: 'Nexus Tech Pvt Ltd',
      email: 'client@example.com',
      role: 'CLIENT',
    } as unknown as T;
  }

  // Generic empty fallback
  return { data: [] } as unknown as T;
}

export const fetchAdminApi = fetchPortalApi;
