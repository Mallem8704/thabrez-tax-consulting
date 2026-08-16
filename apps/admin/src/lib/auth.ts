import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const API_BASE_URL =
  process.env['API_URL'] ||
  process.env['NEXT_PUBLIC_API_URL'] ||
  'http://localhost:4000/api/v1';

const STAFF_ROLES = new Set(['ASSOCIATE', 'SENIOR_CA', 'ADMIN', 'FRONT_DESK']);

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days max (client-side 30-min inactivity handles active logout)
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Staff Credentials + TOTP MFA',
      credentials: {
        email: { label: 'Staff Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        totpCode: { label: '6-digit TOTP Code', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please provide both email and password.');
        }

        if (!credentials.totpCode) {
          throw new Error('MFA_REQUIRED: 6-digit TOTP verification code is mandatory for staff login.');
        }

        try {
          const res = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email.trim(),
              password: credentials.password,
              totpCode: credentials.totpCode.trim(),
            }),
          });

          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.message || 'Staff authentication failed.');
          }

          // Enforce staff role validation
          if (!STAFF_ROLES.has(data.user?.role)) {
            throw new Error(
              'Access denied: This console is strictly for staff members. Clients must use the Client Portal.',
            );
          }

          if (data.status !== 'SUCCESS' || !data.tokens) {
            throw new Error(data.message || 'Authentication incomplete.');
          }

          return {
            id: data.user.id,
            email: data.user.email,
            name: data.user.email?.split('@')[0] || 'Staff',
            role: data.user.role,
            mfaEnabled: data.user.mfaEnabled,
            accessToken: data.tokens.accessToken,
            refreshToken: data.tokens.refreshToken,
          };
        } catch (error) {
          if (error instanceof Error) {
            throw error;
          }
          throw new Error('An unexpected error occurred during authentication.');
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        if (typeof user.mfaEnabled === 'boolean') {
          token.mfaEnabled = user.mfaEnabled;
        }
        if (user.accessToken) {
          token.accessToken = user.accessToken;
        }
        if (user.refreshToken) {
          token.refreshToken = user.refreshToken;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) || '';
        session.user.role = (token.role as string) || 'STAFF';
        if (typeof token.mfaEnabled === 'boolean') {
          session.user.mfaEnabled = token.mfaEnabled;
        }
      }
      if (token.accessToken) {
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  secret: process.env['NEXTAUTH_SECRET'] || 'default-thabrez-secret-key-change-in-prod',
};
