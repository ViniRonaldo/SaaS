import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { canAccessAdminArea, canAccessUserArea, getDefaultRoute } from '@/lib/access-control';

const publicPaths = ['/', '/login', '/cadastro', '/esqueci-senha', '/painel'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('filasaude-token')?.value;
  const role = request.cookies.get('filasaude-role')?.value;

  if (publicPaths.some((p) => pathname === p || pathname.startsWith('/api') || pathname.startsWith('/_next'))) {
    if (token && (pathname === '/login' || pathname === '/cadastro')) {
      return NextResponse.redirect(new URL(getDefaultRoute(role), request.url));
    }

    return NextResponse.next();
  }

  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith('/dashboard') && !canAccessAdminArea(role)) {
    return NextResponse.redirect(new URL(getDefaultRoute(role), request.url));
  }

  if (pathname.startsWith('/usuario') && !canAccessUserArea(role)) {
    return NextResponse.redirect(new URL(getDefaultRoute(role), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icons|manifest.json).*)'],
};
