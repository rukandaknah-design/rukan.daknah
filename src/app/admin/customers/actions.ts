'use server';
import { prisma } from '../../../lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getCustomers() {
  // 1. جلب العملاء
  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: 'desc' }
  });
  
  // 2. جلب جميع الطلبات
  const orders = await prisma.order.findMany();
  
  // 3. دمج الطلبات مع العملاء برمجياً (عن طريق رقم الجوال)
  return customers.map(customer => {
    const customerOrders = orders.filter(o => o.customerName && o.customerName.includes(customer.phone));
    return {
      ...customer,
      orders: customerOrders
    };
  });
}

export async function addCustomer(formData: FormData) {
  const name = formData.get('name') as string;
  const phone = formData.get('phone') as string;
  const address = formData.get('address') as string;

  await prisma.customer.create({
    data: { name, phone, address }
  });
  revalidatePath('/admin/customers');
}

export async function deleteCustomer(id: string) {
  await prisma.customer.delete({ where: { id } });
  revalidatePath('/admin/customers');
}