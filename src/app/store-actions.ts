'use server';
import { prisma } from '../lib/prisma';

export async function getStoreData() {
  const products = await prisma.product.findMany({
    include: { sizes: true, category: true },
    orderBy: { id: 'desc' }
  });
  const categories = await prisma.category.findMany();
  return { products, categories };
}