import Link from 'next/link';
import { LayoutDashboard, ShoppingCart, Users, Tags, Package, UserCog, ScrollText, Settings, Percent, Store } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const menuItems = [
    { name: 'الرئيسية', path: '/admin/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'الطلبات', path: '/admin/orders', icon: <ShoppingCart className="w-5 h-5" /> },
    { name: 'العملاء', path: '/admin/customers', icon: <Users className="w-5 h-5" /> },
    { name: 'التصنيفات', path: '/admin/categories', icon: <Tags className="w-5 h-5" /> },
    { name: 'المخزون والمنتجات', path: '/admin/inventory', icon: <Package className="w-5 h-5" /> },
    { name: 'العروض والخصومات', path: '/admin/offers', icon: <Percent className="w-5 h-5" /> },
    { name: 'المستخدمين', path: '/admin/users', icon: <UserCog className="w-5 h-5" /> },
    { name: 'حركة النظام', path: '/admin/logs', icon: <ScrollText className="w-5 h-5" /> },
    { name: 'الإعدادات', path: '/admin/settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      {/* شريط التنقل الجانبي */}
      <aside className="w-64 bg-white border-l border-gray-200 flex flex-col shadow-sm">
        <div className="p-6 border-b border-gray-200 text-center">
          <h2 className="text-2xl font-bold text-indigo-600">لوحة الإدارة</h2>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <Link key={item.path} href={item.path} className="flex items-center gap-3 p-3 text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200">
          <Link href="/" className="flex items-center gap-3 p-3 text-gray-500 rounded-lg hover:bg-gray-100 transition-colors">
            <Store className="w-5 h-5" />
            <span className="font-medium">العودة للمتجر</span>
          </Link>
        </div>
      </aside>

      {/* محتوى الصفحة المتغير */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="bg-white rounded-xl shadow-sm p-6 min-h-full border border-gray-100">
          {children}
        </div>
      </main>
    </div>
  );
}