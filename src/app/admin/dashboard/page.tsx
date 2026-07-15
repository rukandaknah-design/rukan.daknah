'use client';
import { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, Users, Package, Loader2, TrendingUp, ArrowUpRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { getDashboardData } from './actions';
import Link from 'next/link';

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const result = await getDashboardData();
      setData(result);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col justify-center items-center text-indigo-600 gap-4">
        <Loader2 className="w-12 h-12 animate-spin" />
        <p className="font-bold text-xl">جاري تحليل البيانات وإعداد الرسوم البيانية...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-800">نظرة عامة على الأداء</h1>
          <p className="text-gray-500 text-sm mt-1 font-medium">ملخص المبيعات والنشاطات لمتجرك وفروعك</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm text-sm font-bold text-gray-600 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-green-500"/> تحديث مباشر
        </div>
      </div>

      {/* البطاقات الإحصائية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="إجمالي الإيرادات" value={`${data.stats.totalRevenue} ر.س`} icon={<DollarSign className="w-7 h-7"/>} color="bg-green-50 text-green-600" />
        <StatCard title="إجمالي الطلبات" value={data.stats.totalOrders} icon={<ShoppingBag className="w-7 h-7"/>} color="bg-indigo-50 text-indigo-600" />
        <StatCard title="إجمالي العملاء" value={data.stats.totalCustomers} icon={<Users className="w-7 h-7"/>} color="bg-purple-50 text-purple-600" />
        <StatCard title="المنتجات بالمخزون" value={data.stats.totalProducts} icon={<Package className="w-7 h-7"/>} color="bg-orange-50 text-orange-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* الرسم البياني للمبيعات */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-lg font-black text-gray-800">مبيعات آخر 7 أيام</h2>
            <select className="bg-gray-50 border border-gray-100 text-sm font-bold rounded-lg px-3 py-1.5 outline-none">
              <option>آخر 7 أيام</option>
            </select>
          </div>
          <div className="h-80 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12, fontWeight: 'bold'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12, fontWeight: 'bold'}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold', textAlign: 'right'}}
                  itemStyle={{color: '#4f46e5'}}
                  formatter={(value) => [`${value} ر.س`, 'المبيعات']}
                />
                <Area type="monotone" dataKey="total" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorTotal)" activeDot={{r: 8, strokeWidth: 0}} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* أحدث الطلبات */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-black text-gray-800">أحدث الطلبات</h2>
            <Link href="/admin/orders" className="text-indigo-600 text-sm font-bold hover:underline flex items-center">الكل <ArrowUpRight className="w-4 h-4"/></Link>
          </div>
          
          <div className="space-y-4 flex-1">
            {data.recentOrders.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400 font-bold">لا توجد طلبات بعد</div>
            ) : (
              data.recentOrders.map((order: any) => (
                <div key={order.id} className="flex justify-between items-center p-4 hover:bg-gray-50 rounded-2xl transition-colors border border-gray-50 group">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${order.source === 'POS' ? 'bg-indigo-100 text-indigo-600' : 'bg-sky-100 text-sky-600'}`}>
                      {order.source === 'POS' ? 'POS' : 'WEB'}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{order.customerName}</p>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">{new Date(order.createdAt).toLocaleDateString('ar-SA')}</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="font-black text-gray-800">{order.totalAmount} <span className="text-xs text-gray-500">ر.س</span></p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({title, value, icon, color}: any) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${color}`}>
          {icon}
        </div>
      </div>
      <div>
        <p className="text-gray-500 text-sm font-bold mb-1">{title}</p>
        <h3 className="text-3xl font-black text-gray-800">{value}</h3>
      </div>
    </div>
  );
}