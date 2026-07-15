'use server';
import { prisma } from '../../lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const phone = formData.get('phone') as string;
  const password = formData.get('password') as string;

  // إنشاء الحسابات الافتراضية إذا لم تكن موجودة
  const adminExists = await prisma.user.findFirst({ where: { phone: '1' } });
  if (!adminExists) {
    await prisma.user.create({ data: { name: 'المدير العام', phone: '1', password: '1', role: 'ADMIN' } });
  }
  const cashierExists = await prisma.user.findFirst({ where: { phone: '2' } });
  if (!cashierExists) {
    await prisma.user.create({ data: { name: 'كاشير الفرع', phone: '2', password: '2', role: 'CASHIER' } });
  }

  // التحقق من بيانات الدخول
  const user = await prisma.user.findFirst({
    where: { phone, password }
  });

  if (!user) {
    return { error: 'رقم الجوال أو كلمة المرور غير صحيحة' };
  }

  // إنشاء جلسة مشفرة
  const sessionData = { id: user.id, name: user.name, role: user.role };
  const encodedSession = Buffer.from(JSON.stringify(sessionData)).toString('base64');

  cookies().set('auth_session', encodedSession, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7 // أسبوع واحد
  } );

  // التوجيه حسب الصلاحية
  if (user.role === 'ADMIN') {
    redirect('/admin/dashboard');
  } else {
    redirect('/pos');
  }
}