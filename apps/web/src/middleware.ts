import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isPortalRoute = req.nextUrl.pathname.startsWith('/portal');

    // Only allow CLIENT role in client portal routes
    if (isPortalRoute && token && token['role'] !== 'CLIENT') {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('error', 'StaffPortalRedirect');
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Return true if authenticated, false will trigger redirect to signIn page
        return !!token;
      },
    },
    pages: {
      signIn: '/login',
    },
  },
);

export const config = {
  matcher: ['/portal/:path*'],
};
