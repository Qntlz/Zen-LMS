import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isLoginPage = path === '/login';

  // Check for credentials in cookies
  const hasCredentials = 
    request.cookies.has('canvasUrl') && 
    request.cookies.has('apiToken');

  // Redirect authenticated users away from login
  if (isLoginPage && hasCredentials) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect unauthenticated users to login
  if (!isLoginPage && !hasCredentials) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|Zen-LMS_Logo.svg|login).*)',
  ],
};
