'use server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginAdmin(formData: FormData) {
  const phone = formData.get('phone');
  const password = formData.get('password');
  // للتجربة: نقبل الدخول إذا كان الرمز 123456
  if (password === '123456') {
    cookies().set('admin_token', 'authenticated', { secure: true, httpOnly: true } );
    redirect('/admin/dashboard');
  }
}

export async function loginPos(formData: FormData) {
  const phone = formData.get('phone');
  const password = formData.get('password');
  if (password === '123456') {
    cookies().set('pos_token', 'authenticated', { secure: true, httpOnly: true } );
    redirect('/pos');
  }
}