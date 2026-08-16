import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const API_BASE_URL =
  process.env['API_URL'] ||
  process.env['NEXT_PUBLIC_API_URL'] ||
  'http://localhost:4000/api/v1';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Unified Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'user@example.com' },
        password: { label: 'Password', type: 'password' },
        totpCode: { label: 'TOTP Code', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter both email and password.');
        }

        const email = credentials.email.trim().toLowerCase();
        const password = credentials.password;
        const totpCode = credentials.totpCode?.trim();

        // 1. Attempt live API authentication with NestJS
        try {
          const endpoint = totpCode ? `${API_BASE_URL}/auth/mfa/login-step2` : `${API_BASE_URL}/auth/login`;
          const payload = totpCode ? { email, password, totpCode } : { email, password };

          const res = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });

          if (res.ok) {
            const data = await res.json();
            return {
              id: data.user?.id || `usr_${email.split('@')[0]}`,
              email: data.user?.email || email,
              name: data.user?.name || email.split('@')[0]?.replace('.', ' ').toUpperCase(),
              role: data.user?.role || 'CLIENT',
              accessToken: data.tokens?.accessToken || 'mock_access_token',
              refreshToken: data.tokens?.refreshToken || 'mock_refresh_token',
            };
          }
        } catch {
          // Fall through to fallback demo accounts
        }

        // 2. Demo Staff Accounts Fallback
        const DEMO_STAFF: Record<string, { pass: string; role: string; name: string }> = {
          'admin@thabrez.com': { pass: 'Admin@1234', role: 'ADMIN', name: 'Thabrez Admin' },
          'priya.ca@thabrez.com': { pass: 'CA@1234', role: 'SENIOR_CA', name: 'CA Priya Sharma' },
          'arun.associate@thabrez.com': { pass: 'Assoc@1234', role: 'ASSOCIATE', name: 'Arun Kumar' },
          'desk@thabrez.com': { pass: 'Desk@1234', role: 'FRONT_DESK', name: 'Front Desk' },
        };

        if (DEMO_STAFF[email] && DEMO_STAFF[email].pass === password) {
          const staff = DEMO_STAFF[email];
          return {
            id: `staff_${email.split('@')[0]}`,
            email: email,
            name: staff.name,
            role: staff.role,
            accessToken: `jwt_staff_token_${Date.now()}`,
            refreshToken: `jwt_staff_refresh_${Date.now()}`,
          };
        }

        // 3. Demo Client Accounts Fallback
        const DEMO_CLIENTS: Record<string, string> = {
          'rajan.mehta@example.com': 'Client@1234',
          'client@example.com': 'Client@1234',
          'demo@thabrez.com': 'Client@1234',
          'accounts@patelenterprises.example.com': 'Client@1234',
        };

        if (DEMO_CLIENTS[email] && DEMO_CLIENTS[email] === password) {
          return {
            id: `usr_${email.split('@')[0]}`,
            email: email,
            name: email.split('@')[0]?.replace('.', ' ').toUpperCase() || 'Demo Client',
            role: 'CLIENT',
            accessToken: `jwt_demo_token_${Date.now()}`,
            refreshToken: `jwt_demo_refresh_${Date.now()}`,
          };
        }

        throw new Error('Invalid credentials. Use demo: client@example.com / Client@1234 or admin@thabrez.com / Admin@1234');
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
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
        session.user.role = (token.role as string) || 'CLIENT';
      }
      if (token.accessToken) {
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  secret: process.env['NEXTAUTH_SECRET'] || 'default-thabrez-secret-key-change-in-prod',
};
