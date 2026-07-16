'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, Users, Tags, Settings, LogOut, Store, ShieldCheck } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const menu = [
    { name: 'الرئيسية', path: '/admin/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'الطلبات', path: '/admin/orders', icon: <ShoppingCart className="w-5 h-5" /> },
    { name: 'المخزون والمنتجات', path: '/admin/inventory', icon: <Package className="w-5 h-5" /> },
    { name: 'التصنيفات', path: '/admin/categories', icon: <Tags className="w-5 h-5" /> },
    { name: 'العملاء', path: '/admin/customers', icon: <Users className="w-5 h-5" /> },
    { name: 'المستخدمين والصلاحيات', path: '/admin/users', icon: <ShieldCheck className="w-5 h-5" /> },
    { name: 'الإعدادات', path: '/admin/settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans" dir="rtl">
      {/* الشريط الجانبي */}
      <aside className="w-72 bg-white border-l border-gray-100 flex flex-col shadow-sm hidden lg:flex z-10">
        <div className="p-8 border-b border-gray-50 flex items-center gap-3">
          <div className="bg-sky-500 p-2.5 rounded-xl text-white shadow-lg shadow-sky-200">
            <Store className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-800 tracking-tight">الإدارة<span className="text-sky-500">.</span></h2>
            <p className="text-xs text-gray-400 font-bold">نظام ERP المتكامل</p>
          </div>
        </div>
        
        <nav className="flex-1 p-5 space-y-2 overflow-y-auto">
          {menu.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link 
                key={item.path} 
                href={item.path} 
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all duration-300 ${isActive ? 'bg-sky-500 text-white shadow-md shadow-sky-200 translate-x-1' : 'text-gray-500 hover:bg-sky-50 hover:text-sky-600'}`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-5 border-t border-gray-50">
          <Link href="/" className="flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-red-500 hover:bg-red-50 transition-all">
            <LogOut className="w-5 h-5" /> تسجيل الخروج للمتجر
          </Link>
        </div>
      </aside>

      {/* محتوى الصفحة */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}