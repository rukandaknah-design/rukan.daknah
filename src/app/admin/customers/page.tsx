'use client';
import { useState, useEffect } from 'react';
import { Users, Plus, Trash2, Loader2, Phone, MapPin, ShoppingBag, DollarSign, Star } from 'lucide-react';
import { getCustomers, addCustomer, deleteCustomer } from './actions';

export default function Customers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const data = await getCustomers();
    setCustomers(data);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    await addCustomer(new FormData(e.currentTarget));
    e.currentTarget.reset();
    setShowForm(false);
    await loadData();
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if(confirm('هل أنت متأكد من حذف هذا العميل؟')) {
      await deleteCustomer(id);
      await loadData();
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">إدارة العملاء</h1>
          <p className="text-gray-500 text-sm mt-1">قاعدة بيانات عملائك، سجل مشترياتهم، وبيانات التواصل</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-sm">
          {showForm ? 'إلغاء الإضافة' : <><Plus className="w-5 h-5"/> إضافة عميل جديد</>}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6 animate-in slide-in-from-top-4 duration-300">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">اسم العميل *</label>
              <input type="text" name="name" required className="w-full border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:border-indigo-500" placeholder="الاسم الكامل" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">رقم الجوال *</label>
              <input type="text" name="phone" required className="w-full border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:border-indigo-500" placeholder="05xxxxxxxx" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">العنوان</label>
              <input type="text" name="address" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:border-indigo-500" placeholder="المدينة، الحي..." />
            </div>
            <div className="md:col-span-3 flex justify-end mt-2">
              <button type="submit" disabled={isSubmitting} className="bg-indigo-600 text-white font-bold py-2.5 px-8 rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-2 disabled:opacity-50">
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin"/> : 'حفظ العميل'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-10 flex justify-center items-center text-indigo-600 flex-col gap-3">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p className="font-bold">جاري تحميل بيانات العملاء...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right whitespace-nowrap">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="p-4 font-semibold text-gray-600">العميل</th>
                  <th className="p-4 font-semibold text-gray-600">بيانات التواصل</th>
                  <th className="p-4 font-semibold text-gray-600">إحصائيات الشراء</th>
                  <th className="p-4 font-semibold text-gray-600">تاريخ الإضافة</th>
                  <th className="p-4 font-semibold text-gray-600">إجراء</th>
                </tr>
              </thead>
              <tbody>
                {customers.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-gray-500 font-bold">لا يوجد عملاء مسجلين.</td></tr>
                ) : (
                  customers.map((customer) => {
                    const totalSpent = customer.orders?.reduce((sum: number, o: any) => sum + o.totalAmount, 0) || 0;
                    const ordersCount = customer.orders?.length || 0;
                    const isVIP = totalSpent > 1000 || ordersCount >= 5;

                    return (
                      <tr key={customer.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${isVIP ? 'bg-gradient-to-br from-yellow-400 to-orange-500 shadow-md' : 'bg-indigo-100 text-indigo-600'}`}>
                              {isVIP ? <Star className="w-5 h-5"/> : <Users className="w-5 h-5"/>}
                            </div>
                            <div>
                              <p className="font-bold text-gray-800 flex items-center gap-2">
                                {customer.name}
                                {isVIP && <span className="bg-yellow-100 text-yellow-700 text-[10px] px-2 py-0.5 rounded-md">VIP</span>}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-600"><Phone className="w-4 h-4 text-gray-400"/> <span dir="ltr">{customer.phone}</span></div>
                          {customer.address && <div className="flex items-center gap-2 text-sm text-gray-600"><MapPin className="w-4 h-4 text-gray-400"/> {customer.address}</div>}
                        </td>
                        <td className="p-4 space-y-1">
                          <div className="flex items-center gap-2 text-sm font-bold text-indigo-600"><ShoppingBag className="w-4 h-4"/> {ordersCount} طلبات</div>
                          <div className="flex items-center gap-2 text-sm font-bold text-green-600"><DollarSign className="w-4 h-4"/> {totalSpent} ر.س</div>
                        </td>
                        <td className="p-4 text-sm text-gray-500 font-medium">
                          {new Date(customer.createdAt).toLocaleDateString('ar-SA')}
                        </td>
                        <td className="p-4">
                          <button onClick={() => handleDelete(customer.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                            <Trash2 className="w-5 h-5"/>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}