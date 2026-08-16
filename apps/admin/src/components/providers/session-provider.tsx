'use client';

import * as React from 'react';
import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';

interface AuthSessionProviderProps {
  children: React.ReactNode;
}

export function AuthSessionProvider({ children }: AuthSessionProviderProps): JSX.Element {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
