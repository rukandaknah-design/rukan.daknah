'use client';
import { Search, Filter, Activity, User, Clock, AlertCircle, CheckCircle, Info, ShieldAlert } from 'lucide-react';

export default function Logs() {
  // بيانات وهمية لحركة النظام
  const mockLogs = [
    { id: 1, user: 'أحمد محمد (مدير)', action: 'إضافة منتج', details: 'تم إضافة منتج جديد: حذاء رياضي كلاسيك (NK-2026)', type: 'success', time: 'اليوم - 10:30 ص' },
    { id: 2, user: 'خالد عبدالله (كاشير)', action: 'إصدار فاتورة', details: 'تم إصدار فاتورة مبيعات رقم #ORD-2026-004 بقيمة 350 ر.س', type: 'info', time: 'اليوم - 09:15 ص' },
    { id: 3, user: 'أحمد محمد (مدير)', action: 'تعديل صلاحيات', details: 'تم إيقاف حساب المستخدم: سعد فهد', type: 'warning', time: 'أمس - 04:20 م' },
    { id: 4, user: 'النظام الآلي', action: 'تنبيه مخزون', details: 'المنتج "قميص قطني صيفي" قارب على النفاذ (الكمية المتبقية: 2)', type: 'danger', time: 'أمس - 02:00 م' },
    { id: 5, user: 'خالد عبدالله (كاشير)', action: 'تسجيل دخول', details: 'تسجيل دخول ناجح من جهاز (الفرع الرئيسي)', type: 'success', time: '13 يوليو - 08:00 ص' },
    { id: 6, user: 'مجهول', action: 'محاولة دخول فاشلة', details: 'محاولة تسجيل دخول بكلمة مرور خاطئة (IP: 192.168.1.5)', type: 'danger', time: '12 يوليو - 11:45 م' },
  ];

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'success': return <div className="p-2 bg-green-50 text-green-600 rounded-lg"><CheckCircle className="w-5 h-5"/></div>;
      case 'info': return <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Info className="w-5 h-5"/></div>;
      case 'warning': return <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg"><AlertCircle className="w-5 h-5"/></div>;
      case 'danger': return <div className="p-2 bg-red-50 text-red-600 rounded-lg"><ShieldAlert className="w-5 h-5"/></div>;
      default: return <div className="p-2 bg-gray-50 text-gray-600 rounded-lg"><Activity className="w-5 h-5"/></div>;
    }
  };

  return (
    <div className="space-y-6">
      {/* رأس الصفحة */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">حركة النظام (Logs)</h1>
          <p className="text-gray-500 text-sm mt-1">سجل أمني شامل لجميع العمليات التي تمت في المتجر والكاشير</p>
        </div>
        <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-sm font-medium">
          <Filter className="w-5 h-5" />
          تصفية السجل
        </button>
      </div>

      {/* شريط البحث */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex gap-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute right-3 top-3 text-gray-400" />
          <input type="text" placeholder="ابحث عن عملية، مستخدم، أو تفاصيل..." className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>
        <select className="border border-gray-200 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500 text-gray-600 bg-gray-50">
          <option>جميع العمليات</option>
          <option>المبيعات</option>
          <option>المنتجات</option>
          <option>النظام والأمان</option>
        </select>
      </div>

      {/* السجل (Timeline/Table) */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 font-semibold text-gray-600 w-16">النوع</th>
              <th className="p-4 font-semibold text-gray-600">العملية</th>
              <th className="p-4 font-semibold text-gray-600">التفاصيل</th>
              <th className="p-4 font-semibold text-gray-600">المستخدم</th>
              <th className="p-4 font-semibold text-gray-600">الوقت والتاريخ</th>
            </tr>
          </thead>
          <tbody>
            {mockLogs.map((log) => (
              <tr key={log.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="p-4">{getTypeIcon(log.type)}</td>
                <td className="p-4 font-bold text-gray-800">{log.action}</td>
                <td className="p-4 text-gray-600 text-sm">{log.details}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <User className="w-4 h-4 text-gray-400"/> {log.user}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4"/> {log.time}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}