import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const role = request.cookies.get('userRole')?.value;

  // حماية لوحة الإدارة (للمدير فقط)
  if (path.startsWith('/admin')) {
    if (role !== 'admin') return NextResponse.redirect(new URL('/login', request.url));
  }

  // حماية الكاشير (للمدير والكاشير)
  if (path.startsWith('/pos')) {
    if (role !== 'admin' && role !== 'cashier') return NextResponse.redirect(new URL('/login', request.url));
  }

  // منع الدخول لصفحة تسجيل الدخول إذا كان مسجلاً بالفعل
  if (path === '/login') {
    if (role === 'admin') return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    if (role === 'cashier') return NextResponse.redirect(new URL('/pos', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/pos/:path*', '/login'],
};