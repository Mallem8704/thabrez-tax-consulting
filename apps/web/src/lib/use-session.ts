'use client';

import { useSession as useNextAuthSession } from 'next-auth/react';

export interface ClientSessionUser {
  id: string;
  email: string | null;
  name: string | null;
  role: string;
}

export interface UseClientSessionReturn {
  user: ClientSessionUser | null;
  role: string | null;
  id: string | null;
  email: string | null;
  status: 'authenticated' | 'unauthenticated' | 'loading';
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken?: string | undefined;
}

/**
 * useSession hook tailored for the Thabrez Client Portal.
 * Returns typed client identification and auth status.
 */
export function useSession(): UseClientSessionReturn {
  const { data: session, status } = useNextAuthSession();

  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated' && !!session?.user;

  const user: ClientSessionUser | null = session?.user
    ? {
        id: session.user.id,
        email: session.user.email ?? null,
        name: session.user.name ?? null,
        role: session.user.role,
      }
    : null;

  return {
    user,
    role: user?.role ?? null,
    id: user?.id ?? null,
    email: user?.email ?? null,
    status,
    isAuthenticated,
    isLoading,
    accessToken: session?.accessToken,
  };
}
