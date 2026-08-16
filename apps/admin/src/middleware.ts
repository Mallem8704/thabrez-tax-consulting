import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

const STAFF_ROLES = new Set(['ASSOCIATE', 'SENIOR_CA', 'ADMIN', 'FRONT_DESK']);

// Route permission map defining allowed roles for sensitive staff sections
const ROUTE_PERMISSIONS: Record<string, string[]> = {
  '/invoices': ['ADMIN', 'SENIOR_CA'],
  '/admin/invoices': ['ADMIN', 'SENIOR_CA'],
  '/audit': ['ADMIN'],
  '/admin/audit': ['ADMIN'],
  '/users': ['ADMIN'],
  '/admin/users': ['ADMIN'],
};

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }

    const userRole = (token['role'] as string) || '';

    // Enforce that user is a staff member
    if (!STAFF_ROLES.has(userRole)) {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('error', 'StaffRoleRequired');
      return NextResponse.redirect(url);
    }

    // Check specific per-role route restrictions
    for (const [routePrefix, allowedRoles] of Object.entries(ROUTE_PERMISSIONS)) {
      if (pathname.startsWith(routePrefix)) {
        if (!allowedRoles.includes(userRole)) {
          const url = req.nextUrl.clone();
          url.pathname = '/';
          url.searchParams.set('error', 'InsufficientPermissions');
          url.searchParams.set('deniedPath', pathname);
          return NextResponse.redirect(url);
        }
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return !!token;
      },
    },
    pages: {
      signIn: '/login',
    },
  },
);

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - /login
     * - /api/auth
     * - /_next/static (static files)
     * - /_next/image (image optimization files)
     * - favicon.ico
     */
    '/((?!login|api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
};
