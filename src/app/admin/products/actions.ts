'use server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getProductsData() {
  const products = await prisma.product.findMany({ 
    include: { category: true, offer: true },
    orderBy: { createdAt: 'desc' }
  });
  const categories = await prisma.category.findMany();
  const offers = await prisma.offer.findMany({ where: { isActive: true } });
  return { products, categories, offers };
}

export async function saveProduct(data: any) {
  const payload = {
    name: data.name,
    cost: Number(data.cost),
    price: Number(data.price),
    images: JSON.stringify(data.images),
    sizes: JSON.stringify(data.sizes),
    categoryId: data.categoryId || null,
    offerId: data.offerId || null,
  };
  if (data.id) {
    return await prisma.product.update({ where: { id: data.id }, data: payload });
  }
  return await prisma.product.create({ data: payload });
}

export async function deleteProduct(id: string) {
  return await prisma.product.delete({ where: { id } });
}