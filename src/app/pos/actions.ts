'use server';
import { prisma } from '../../lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getPosProducts() {
  return await prisma.product.findMany({
    include: { sizes: true, category: true },
    orderBy: { createdAt: 'desc' }
  });
}

export async function submitPosOrder(cart: any[], total: number) {
  // 1. إنشاء الفاتورة (الطلب)
  const order = await prisma.order.create({
    data: {
      customerName: 'عميل فرع (كاشير)',
      totalAmount: total,
      paymentMethod: 'CASH',
      source: 'POS',
      status: 'COMPLETED' // مكتمل فوراً لأنه كاشير
    }
  });

  // 2. خصم الكميات من المخزون
  for (const item of cart) {
    if (item.sizeId) {
      await prisma.productSize.update({
        where: { id: item.sizeId },
        data: { stock: { decrement: item.quantity } }
      });
    }
  }
  
  revalidatePath('/pos');
  revalidatePath('/admin/inventory');
  return order.id;
}