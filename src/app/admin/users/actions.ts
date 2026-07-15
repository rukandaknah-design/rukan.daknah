'use server';
import { prisma } from '../../../lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getUsers() {
  return await prisma.user.findMany({
    orderBy: { id: 'desc' }
  });
}

export async function addUser(formData: FormData) {
  const name = formData.get('name') as string;
  const phone = formData.get('phone') as string;
  const password = formData.get('password') as string;
  const role = formData.get('role') as string;

  await prisma.user.create({
    data: { name, phone, password, role }
  });
  revalidatePath('/admin/users');
}

export async function deleteUser(id: string) {
  await prisma.user.delete({ where: { id } });
  revalidatePath('/admin/users');
}