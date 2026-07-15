'use server';
import { prisma } from '../../../lib/prisma';

export async function getDashboardData() {
  // 1. الإحصائيات العلوية
  const totalOrders = await prisma.order.count();
  const totalCustomers = await prisma.customer.count();
  const totalProducts = await prisma.product.count();
  
  const revenueResult = await prisma.order.aggregate({
    _sum: { totalAmount: true }
  });
  const totalRevenue = revenueResult._sum.totalAmount || 0;

  // 2. أحدث الطلبات
  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' }
  });

  // 3. بيانات الرسم البياني (مبيعات آخر 7 أيام)
  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 7);

  const orders = await prisma.order.findMany({
    where: { createdAt: { gte: last7Days } },
    select: { createdAt: true, totalAmount: true }
  });

  const groupedData: Record<string, number> = {};
  
  // تجهيز الأيام بصفر مبدئياً
  for(let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    groupedData[d.toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' })] = 0;
  }

  // تجميع المبيعات حسب اليوم
  orders.forEach(o => {
    const dateStr = o.createdAt.toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' });
    if(groupedData[dateStr] !== undefined) {
      groupedData[dateStr] += o.totalAmount;
    }
  });

  const chartData = Object.keys(groupedData).map(date => ({
    date,
    total: groupedData[date]
  }));

  return {
    stats: { totalOrders, totalCustomers, totalProducts, totalRevenue },
    recentOrders,
    chartData
  };
}