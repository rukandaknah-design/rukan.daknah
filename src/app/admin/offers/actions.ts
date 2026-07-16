'use server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getOffers() {
  return await prisma.offer.findMany({ orderBy: { createdAt: 'desc' } });
}
export async function saveOffer(data: { id?: string, title: string, discount: number, type: string, isActive: boolean }) {
  if (data.id) {
    return await prisma.offer.update({ where: { id: data.id }, data });
  }
  return await prisma.offer.create({ data });
}
export async function deleteOffer(id: string) {
  return await prisma.offer.delete({ where: { id } });
}