import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const role = request.cookies.get('userRole')?.value;

  // حماية مسارات الإدارة
  if (path.startsWith('/admin') && !path.startsWith('/admin/login') && !path.startsWith('/admin/logout')) {
    if (role !== 'admin') return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // حماية مسارات الكاشير
  if (path.startsWith('/pos') && !path.startsWith('/pos/login') && !path.startsWith('/pos/logout')) {
    if (role !== 'admin' && role !== 'cashier') return NextResponse.redirect(new URL('/pos/login', request.url));
  }

  // منع الدخول لصفحة تسجيل الدخول إذا كان مسجلاً بالفعل
  if (path === '/admin/login' && role === 'admin') return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  if (path === '/pos/login' && (role === 'cashier' || role === 'admin')) return NextResponse.redirect(new URL('/pos', request.url));

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/pos/:path*'],
};