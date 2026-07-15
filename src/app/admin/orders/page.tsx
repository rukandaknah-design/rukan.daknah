'use client';
import { useState, useEffect } from 'react';
import { Search, Eye, Filter, CheckCircle, Clock, XCircle, ShoppingBag, Store, Loader2 } from 'lucide-react';
import { getOrders, updateOrderStatus } from './actions';

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    setLoading(true);
    const data = await getOrders();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    await updateOrderStatus(id, newStatus);
    await loadOrders();
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'COMPLETED': return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><CheckCircle className="w-3 h-3"/> مكتمل</span>;
      case 'PENDING': return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Clock className="w-3 h-3"/> قيد الانتظار</span>;
      case 'CANCELLED': return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><XCircle className="w-3 h-3"/> ملغي</span>;
      default: return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  const getSourceBadge = (source: string) => {
    if (source === 'POS') return <span className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded text-xs font-bold flex items-center gap-1 w-fit"><Store className="w-3 h-3"/> كاشير الفرع</span>;
    return <span className="bg-sky-50 text-sky-600 px-2 py-1 rounded text-xs font-bold flex items-center gap-1 w-fit"><ShoppingBag className="w-3 h-3"/> المتجر الإلكتروني</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">إدارة الطلبات والفواتير</h1>
          <p className="text-gray-500 text-sm mt-1">متابعة طلبات المتجر وفواتير الكاشير الحقيقية</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-10 flex justify-center items-center text-indigo-600 flex-col gap-3">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p className="font-bold">جاري تحميل الطلبات...</p>
          </div>
        ) : (
          <table className="w-full text-right">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 font-semibold text-gray-600">رقم الطلب</th>
                <th className="p-4 font-semibold text-gray-600">العميل</th>
                <th className="p-4 font-semibold text-gray-600">المصدر</th>
                <th className="p-4 font-semibold text-gray-600">الإجمالي</th>
                <th className="p-4 font-semibold text-gray-600">الحالة</th>
                <th className="p-4 font-semibold text-gray-600">التاريخ</th>
                <th className="p-4 font-semibold text-gray-600">تغيير الحالة</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan={7} className="p-8 text-center text-gray-500 font-bold">لا توجد طلبات أو فواتير حتى الآن.</td></tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-mono text-sm text-gray-500 font-bold">#{order.id.slice(-6).toUpperCase()}</td>
                    <td className="p-4 font-bold text-gray-800">{order.customerName}</td>
                    <td className="p-4">{getSourceBadge(order.source)}</td>
                    <td className="p-4 font-black text-indigo-600">{order.totalAmount} ر.س</td>
                    <td className="p-4">{getStatusBadge(order.status)}</td>
                    <td className="p-4 text-sm text-gray-500 font-medium">{new Date(order.createdAt).toLocaleDateString('ar-SA')}</td>
                    <td className="p-4">
                      <select 
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="bg-white border border-gray-200 text-sm font-bold text-gray-700 rounded-lg px-3 py-1.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all cursor-pointer"
                      >
                        <option value="PENDING">قيد الانتظار</option>
                        <option value="COMPLETED">مكتمل</option>
                        <option value="CANCELLED">إلغاء الطلب</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}