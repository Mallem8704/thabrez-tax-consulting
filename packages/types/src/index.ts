/**
 * @thabrez/types
 * Shared TypeScript enums, interfaces, and Zod schemas.
 * Used by apps/api (NestJS), apps/web, and apps/admin.
 *
 * No business logic lives here — only shape definitions.
 */

import { z } from 'zod';

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export enum UserRole {
  CLIENT = 'CLIENT',
  ASSOCIATE = 'ASSOCIATE',
  SENIOR_CA = 'SENIOR_CA',
  ADMIN = 'ADMIN',
}

export enum CaseStatus {
  RECEIVED = 'RECEIVED',
  IN_REVIEW = 'IN_REVIEW',
  AWAITING_CLIENT = 'AWAITING_CLIENT',
  IN_PROGRESS = 'IN_PROGRESS',
  FILED = 'FILED',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  CLOSED = 'CLOSED',
}

export enum ServiceType {
  ITR = 'ITR',
  GST_REGISTRATION = 'GST_REGISTRATION',
  GST_RETURN = 'GST_RETURN',
  TDS_RETURN = 'TDS_RETURN',
  ROC_FILING = 'ROC_FILING',
  COMPANY_INCORPORATION = 'COMPANY_INCORPORATION',
  ACCOUNTING = 'ACCOUNTING',
  AUDIT = 'AUDIT',
  ADVISORY = 'ADVISORY',
  OTHER = 'OTHER',
}

export enum DeadlineType {
  GST = 'GST',
  TDS = 'TDS',
  ROC = 'ROC',
  ITR = 'ITR',
  ADVANCE_TAX = 'ADVANCE_TAX',
  OTHER = 'OTHER',
}

export enum DeadlineStatus {
  UPCOMING = 'UPCOMING',
  REMINDER_SENT = 'REMINDER_SENT',
  COMPLETED = 'COMPLETED',
  OVERDUE = 'OVERDUE',
}

export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED',
}

export enum LeadStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  QUALIFIED = 'QUALIFIED',
  CONVERTED = 'CONVERTED',
  LOST = 'LOST',
}

export enum EntityType {
  INDIVIDUAL = 'INDIVIDUAL',
  HUF = 'HUF',
  PARTNERSHIP = 'PARTNERSHIP',
  LLP = 'LLP',
  PRIVATE_LIMITED = 'PRIVATE_LIMITED',
  PUBLIC_LIMITED = 'PUBLIC_LIMITED',
  TRUST = 'TRUST',
  OTHER = 'OTHER',
}

export enum ResourceType {
  ACT = 'ACT',
  RULE = 'RULE',
  FORM = 'FORM',
  CIRCULAR = 'CIRCULAR',
  NOTIFICATION = 'NOTIFICATION',
}

export enum AuditAction {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  DOWNLOAD = 'DOWNLOAD',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  PAYMENT = 'PAYMENT',
}

// ---------------------------------------------------------------------------
// Zod schemas (used for runtime validation in both API and forms)
// ---------------------------------------------------------------------------

export const LeadCreateSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().optional(),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  serviceInterest: z.nativeEnum(ServiceType).optional(),
  message: z.string().max(1000).optional(),
  source: z.string().max(50).optional(),
});

export const OtpRequestSchema = z.object({
  identifier: z.union([
    z.string().email(),
    z.string().regex(/^[6-9]\d{9}$/),
  ]),
});

export const OtpVerifySchema = z.object({
  identifier: z.string(),
  otp: z.string().length(6),
});

export const CaseCreateSchema = z.object({
  clientId: z.string().cuid(),
  serviceType: z.nativeEnum(ServiceType),
  assignedTo: z.string().cuid().optional(),
  dueDate: z.string().datetime().optional(),
  notes: z.string().max(2000).optional(),
});

export const CaseUpdateStatusSchema = z.object({
  status: z.nativeEnum(CaseStatus),
  note: z.string().max(500).optional(),
});

export const DocumentUploadRequestSchema = z.object({
  caseId: z.string().cuid(),
  filename: z.string().min(1).max(255),
  mimeType: z.string().min(1),
  sizeBytes: z.number().int().positive().max(50 * 1024 * 1024), // 50 MB cap
});

// ---------------------------------------------------------------------------
// Inferred TypeScript types from Zod schemas
// ---------------------------------------------------------------------------

export type LeadCreateDto = z.infer<typeof LeadCreateSchema>;
export type OtpRequestDto = z.infer<typeof OtpRequestSchema>;
export type OtpVerifyDto = z.infer<typeof OtpVerifySchema>;
export type CaseCreateDto = z.infer<typeof CaseCreateSchema>;
export type CaseUpdateStatusDto = z.infer<typeof CaseUpdateStatusSchema>;
export type DocumentUploadRequestDto = z.infer<typeof DocumentUploadRequestSchema>;

// ---------------------------------------------------------------------------
// Generic API response wrapper
// ---------------------------------------------------------------------------

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiPaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  statusCode: number;
  message: string;
  errors?: Record<string, string[]>;
}
