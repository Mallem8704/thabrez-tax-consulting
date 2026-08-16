import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const API_BASE_URL = process.env['API_URL'] || process.env['NEXT_PUBLIC_API_URL'] || 'http://localhost:4000/api/v1';

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
      name: 'Client Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'client@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter both email and password.');
        }

        try {
          const res = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const data = await res.json();

          if (!res.ok) {
            // Forward the NestJS error message (e.g. invalid password or 15-min lockout)
            throw new Error(data.message || 'Authentication failed. Please check your credentials.');
          }

          // Ensure only CLIENT role users log into the client portal
          if (data.user?.role !== 'CLIENT') {
            throw new Error(
              'This portal is for clients only. Staff members (CA / Admin) must log in via the Staff Console at port 3001.',
            );
          }

          if (data.status !== 'SUCCESS' || !data.tokens) {
            throw new Error(data.message || 'Unable to sign in at this time.');
          }

          return {
            id: data.user.id,
            email: data.user.email,
            name: data.user.email?.split('@')[0] || 'Client',
            role: data.user.role,
            accessToken: data.tokens.accessToken,
            refreshToken: data.tokens.refreshToken,
          };
        } catch (error) {
          if (error instanceof Error) {
            throw error;
          }
          throw new Error('An unexpected error occurred during sign in.');
        }
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
