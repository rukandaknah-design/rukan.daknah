'use client';
import { TrendingUp, Users, Package, ShoppingBag, DollarSign, Activity, ArrowUpRight, Download } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const salesData = [
  { name: 'السبت', sales: 4000, orders: 24 },
  { name: 'الأحد', sales: 3000, orders: 18 },
  { name: 'الإثنين', sales: 5000, orders: 35 },
  { name: 'الثلاثاء', sales: 2780, orders: 15 },
  { name: 'الأربعاء', sales: 8900, orders: 60 },
  { name: 'الخميس', sales: 2390, orders: 12 },
  { name: 'الجمعة', sales: 3490, orders: 20 },
];

export default function AdminDashboard() {
  return (
    <div className="p-6 lg:p-10 space-y-8">
      {/* الترويسة */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-800 mb-1">مرحباً بك في لوحة القيادة 👋</h1>
          <p className="text-gray-500 font-medium">إليك ملخص أداء متجرك لهذا الأسبوع.</p>
        </div>
        <button className="bg-white border border-gray-200 text-gray-700 hover:border-sky-400 hover:text-sky-600 px-5 py-2.5 rounded-xl font-bold shadow-sm transition-all flex items-center gap-2">
          <Download className="w-4 h-4" /> تحميل التقرير
        </button>
      </div>

      {/* البطاقات الإحصائية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="إجمالي المبيعات" value="29,560 ر.س" icon={<DollarSign className="w-7 h-7"/>} color="text-green-500" bg="bg-green-50" trend="+12.5%" />
        <Card title="الطلبات الجديدة" value="184" icon={<ShoppingBag className="w-7 h-7"/>} color="text-sky-500" bg="bg-sky-50" trend="+5.2%" />
        <Card title="إجمالي العملاء" value="2,450" icon={<Users className="w-7 h-7"/>} color="text-purple-500" bg="bg-purple-50" trend="+18.1%" />
        <Card title="المنتجات المتوفرة" value="842" icon={<Package className="w-7 h-7"/>} color="text-orange-500" bg="bg-orange-50" trend="-2.4%" isDown />
      </div>

      {/* الرسوم البيانية */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 lg:p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <TrendingUp className="text-sky-500"/> المبيعات خلال الأسبوع
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dx={-10} />
                <Tooltip cursor={{stroke: '#e0e0e0', strokeWidth: 2}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Line type="monotone" dataKey="sales" name="المبيعات (ر.س)" stroke="#0ea5e9" strokeWidth={4} dot={{r: 4, strokeWidth: 2, fill: '#fff'}} activeDot={{r: 8, strokeWidth: 0}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 lg:p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Activity className="text-sky-500"/> حجم الطلبات اليومية
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dx={-10} />
                <Tooltip cursor={{fill: '#f0f9ff'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="orders" name="عدد الطلبات" fill="#0ea5e9" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* جدول أحدث الطلبات */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 lg:p-8 border-b border-gray-50 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">أحدث الطلبات</h2>
          <button className="text-sky-500 font-bold hover:underline text-sm">عرض الكل</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-gray-50/50 text-gray-500 text-sm">
              <tr>
                <th className="p-5 font-bold">رقم الطلب</th>
                <th className="p-5 font-bold">العميل</th>
                <th className="p-5 font-bold">التاريخ</th>
                <th className="p-5 font-bold">المبلغ</th>
                <th className="p-5 font-bold">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="hover:bg-sky-50/30 transition-colors group">
                  <td className="p-5 font-black text-gray-800">#ORD-00{i}</td>
                  <td className="p-5 text-gray-600 font-medium">عميل تجريبي {i}</td>
                  <td className="p-5 text-gray-500 text-sm">16 يوليو 2026</td>
                  <td className="p-5 font-black text-sky-600">{150 * i} ر.س</td>
                  <td className="p-5">
                    <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${i % 2 === 0 ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>
                      {i % 2 === 0 ? 'قيد التجهيز' : 'مكتمل'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value, icon, color, bg, trend, isDown }: any) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${bg} ${color} group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <span className={`flex items-center gap-1 text-sm font-bold px-2 py-1 rounded-lg ${isDown ? 'text-red-600 bg-red-50' : 'text-green-600 bg-green-50'}`}>
          {trend} <ArrowUpRight className={`w-3 h-3 ${isDown ? 'rotate-90' : ''}`} />
        </span>
      </div>
      <div>
        <p className="text-gray-500 text-sm font-bold mb-1">{title}</p>
        <h3 className="text-3xl font-black text-gray-800 tracking-tight">{value}</h3>
      </div>
    </div>
  );
}