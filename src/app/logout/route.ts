import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // توجيه المستخدم لصفحة الدخول ومسح ذاكرة الصلاحيات
  const response = NextResponse.redirect(new URL('/login', request.url));
  response.cookies.delete('userRole');
  return response;
}