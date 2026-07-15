import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isAuthRoute = path === '/login';
  const isAdminRoute = path.startsWith('/admin');
  const isPosRoute = path.startsWith('/pos');

  // قراءة جلسة الدخول من الكوكيز
  const authCookie = request.cookies.get('auth_session')?.value;

  // إذا لم يكن مسجلاً للدخول وحاول دخول الإدارة أو الكاشير، اطرده لصفحة الدخول
  if (!authCookie && (isAdminRoute || isPosRoute)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (authCookie) {
    try {
      // فك تشفير الجلسة لمعرفة الصلاحية
      const session = JSON.parse(Buffer.from(authCookie, 'base64').toString());
      
      // إذا كان مسجلاً وحاول دخول صفحة تسجيل الدخول، وجهه لمكانه الصحيح
      if (isAuthRoute) {
        if (session.role === 'ADMIN') return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        if (session.role === 'CASHIER') return NextResponse.redirect(new URL('/pos', request.url));
      }

      // منع الكاشير من دخول الإدارة
      if (isAdminRoute && session.role === 'CASHIER') {
        return NextResponse.redirect(new URL('/pos', request.url));
      }
    } catch (e) {
      request.cookies.delete('auth_session');
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/pos/:path*', '/login'],
};