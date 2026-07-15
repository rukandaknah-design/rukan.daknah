'use server';
import { prisma } from '../../../lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getProducts() {
  return await prisma.product.findMany({
    include: { sizes: true, category: true },
    orderBy: { createdAt: 'desc' }
  });
}

export async function getCategories() {
  return await prisma.category.findMany();
}

async function saveImages(formData: FormData) {
  const imageFiles = formData.getAll('images') as File[];
  let imageUrls: string[] = [];
  const hasNewImages = imageFiles.length > 0 && imageFiles[0].size > 0;

  if (hasNewImages) {
    for (const file of imageFiles) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      // تحويل الصورة إلى نص Base64 لتعمل في Vercel بدون سيرفر ملفات
      const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;
      imageUrls.push(base64);
    }
  }
  return { hasNewImages, imageUrls };
}

export async function addProduct(formData: FormData) {
  const name = formData.get('name') as string;
  const code = formData.get('code') as string;
  const supplierCode = formData.get('supplierCode') as string;
  const brand = formData.get('brand') as string;
  const categoryId = formData.get('categoryId') as string;
  const cost = parseFloat(formData.get('cost') as string);
  const price = parseFloat(formData.get('price') as string);
  const details = formData.get('details') as string;
  const sizes = JSON.parse(formData.get('sizes') as string);

  const { imageUrls } = await saveImages(formData);

  await prisma.product.create({
    data: {
      name, code, supplierCode, brand, categoryId, cost, price, details,
      images: JSON.stringify(imageUrls),
      sizes: { create: sizes.map((s: any) => ({ size: s.size, stock: parseInt(s.stock) })) }
    }
  });
  revalidatePath('/admin/inventory');
}

export async function updateProduct(id: string, formData: FormData) {
  const name = formData.get('name') as string;
  const code = formData.get('code') as string;
  const supplierCode = formData.get('supplierCode') as string;
  const brand = formData.get('brand') as string;
  const categoryId = formData.get('categoryId') as string;
  const cost = parseFloat(formData.get('cost') as string);
  const price = parseFloat(formData.get('price') as string);
  const details = formData.get('details') as string;
  const sizes = JSON.parse(formData.get('sizes') as string);

  const { hasNewImages, imageUrls } = await saveImages(formData);

  const dataToUpdate: any = { name, code, supplierCode, brand, categoryId, cost, price, details };
  if (hasNewImages) dataToUpdate.images = JSON.stringify(imageUrls);

  await prisma.size.deleteMany({ where: { productId: id } });

  await prisma.product.update({
    where: { id },
    data: {
      ...dataToUpdate,
      sizes: { create: sizes.map((s: any) => ({ size: s.size, stock: parseInt(s.stock) })) }
    }
  });
  revalidatePath('/admin/inventory');
}

export async function deleteProduct(id: string) {
  await prisma.size.deleteMany({ where: { productId: id } });
  await prisma.product.delete({ where: { id } });
  revalidatePath('/admin/inventory');
}