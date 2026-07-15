'use server';
import { prisma } from '../../../lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getCategories() {
  return await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { id: 'desc' }
  });
}

export async function addCategory(formData: FormData) {
  const name = formData.get('name') as string;
  if (!name) return;
  await prisma.category.create({ data: { name } });
  revalidatePath('/admin/categories');
}

export async function deleteCategory(id: string) {
  await prisma.category.delete({ where: { id } });
  revalidatePath('/admin/categories');
}