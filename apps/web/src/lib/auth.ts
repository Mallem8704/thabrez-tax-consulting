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
      name: 'Client Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'client@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter both email and password.');
        }

        const email = credentials.email.trim().toLowerCase();
        const password = credentials.password;

        try {
          const res = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });

          if (res.ok) {
            const data = await res.json();
            if (data.user?.role !== 'CLIENT') {
              throw new Error(
                'This portal is for clients only. Staff members (CA / Admin) must log in via the Staff Console at port 3001.',
              );
            }

            return {
              id: data.user.id,
              email: data.user.email,
              name: data.user.email?.split('@')[0] || 'Client',
              role: data.user.role,
              accessToken: data.tokens?.accessToken || 'mock_client_access_token',
              refreshToken: data.tokens?.refreshToken || 'mock_client_refresh_token',
            };
          }
        } catch {
          // Fall through to seed/demo authentication
        }

        // Demo accounts fallback (useful when running without live Postgres container)
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

        throw new Error('Invalid email or password. Use demo account: client@example.com / Client@1234');
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
