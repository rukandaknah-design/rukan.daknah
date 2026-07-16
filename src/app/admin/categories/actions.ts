'use server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getCategories() {
  return await prisma.category.findMany({ orderBy: { createdAt: 'desc' } });
}
export async function saveCategory(data: { id?: string, name: string }) {
  if (data.id) {
    return await prisma.category.update({ where: { id: data.id }, data: { name: data.name } });
  }
  return await prisma.category.create({ data: { name: data.name } });
}
export async function deleteCategory(id: string) {
  return await prisma.category.delete({ where: { id } });
}