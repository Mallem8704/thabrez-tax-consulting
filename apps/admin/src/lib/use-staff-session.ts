'use client';

import { useSession as useNextAuthSession } from 'next-auth/react';

export interface StaffSessionUser {
  id: string;
  email: string | null;
  name: string | null;
  role: 'ASSOCIATE' | 'SENIOR_CA' | 'ADMIN' | 'FRONT_DESK' | string;
  mfaEnabled?: boolean | undefined;
}

export interface UseStaffSessionReturn {
  user: StaffSessionUser | null;
  role: string | null;
  id: string | null;
  email: string | null;
  isAdmin: boolean;
  isSeniorCa: boolean;
  isAssociate: boolean;
  isFrontDesk: boolean;
  isStaff: boolean;
  status: 'authenticated' | 'unauthenticated' | 'loading';
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken?: string | undefined;
}

/**
 * useStaffSession hook for staff admin console components.
 * Provides role breakdown helpers (isAdmin, isSeniorCa, etc.).
 */
export function useStaffSession(): UseStaffSessionReturn {
  const { data: session, status } = useNextAuthSession();

  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated' && !!session?.user;

  const user: StaffSessionUser | null = session?.user
    ? {
        id: session.user.id,
        email: session.user.email ?? null,
        name: session.user.name ?? null,
        role: session.user.role,
        mfaEnabled: session.user.mfaEnabled,
      }
    : null;

  const role = user?.role ?? null;

  return {
    user,
    role,
    id: user?.id ?? null,
    email: user?.email ?? null,
    isAdmin: role === 'ADMIN',
    isSeniorCa: role === 'SENIOR_CA',
    isAssociate: role === 'ASSOCIATE',
    isFrontDesk: role === 'FRONT_DESK',
    isStaff: ['ADMIN', 'SENIOR_CA', 'ASSOCIATE', 'FRONT_DESK'].includes(role || ''),
    status,
    isAuthenticated,
    isLoading,
    accessToken: session?.accessToken,
  };
}
