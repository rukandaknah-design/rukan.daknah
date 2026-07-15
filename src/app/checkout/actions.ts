'use server';
import { prisma } from '../../lib/prisma';
import { revalidatePath } from 'next/cache';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function submitWebOrder(formData: FormData) {
  const name = formData.get('name') as string;
  const phone = formData.get('phone') as string;
  const address = formData.get('address') as string;
  const paymentMethod = formData.get('paymentMethod') as string;
  const cartJson = formData.get('cart') as string;
  const cart = JSON.parse(cartJson || '[]');
  const total = cart.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

  // حفظ صورة الإيصال إذا اختار العميل تحويل بنكي
  let receiptUrl = '';
  const receiptFile = formData.get('receipt') as File;
  if (receiptFile && receiptFile.size > 0) {
    try {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      await mkdir(uploadDir, { recursive: true });
      const bytes = await receiptFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `${Date.now()}-receipt-${receiptFile.name.replace(/\s+/g, '-')}`;
      const filePath = path.join(uploadDir, fileName);
      await writeFile(filePath, buffer);
      receiptUrl = `/uploads/${fileName}`;
    } catch (e) {
      console.error("خطأ في حفظ الإيصال:", e);
    }
  }

  // إنشاء العميل في قاعدة البيانات (أو جلبه إذا كان مسجلاً مسبقاً برقم الجوال)
  let customer = await prisma.customer.findFirst({ where: { phone } });
  if (!customer) {
    customer = await prisma.customer.create({
      data: { name, phone, address }
    });
  }

  // إنشاء الطلب في قاعدة البيانات
  const orderName = `${name} (${phone})`;
  const order = await prisma.order.create({
    data: {
      customerName: orderName,
      totalAmount: total,
      paymentMethod: paymentMethod === 'transfer' ? 'BANK_TRANSFER' : 'CASH_ON_DELIVERY',
      source: 'WEB',
      status: 'PENDING' // قيد الانتظار حتى يوافق عليه الإدمن
    }
  });

  // خصم الكميات المباعة من المخزون الفعلي
  for (const item of cart) {
    if (item.sizeId) {
      await prisma.productSize.update({
        where: { id: item.sizeId },
        data: { stock: { decrement: item.quantity } }
      });
    }
  }

  // تحديث واجهات الإدارة لترى الطلب الجديد فوراً
  revalidatePath('/admin/orders');
  revalidatePath('/admin/dashboard');
  revalidatePath('/admin/inventory');
  revalidatePath('/admin/customers');
  
  return order.id;
}