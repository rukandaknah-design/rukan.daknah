import { Shield } from 'lucide-react';
import { loginAdmin } from '../../auth-actions';

export default function AdminLogin() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-100">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4"><Shield className="w-8 h-8"/></div>
          <h1 className="text-2xl font-black text-gray-800">دخول الإدارة</h1>
        </div>
        <form action={loginAdmin} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">رقم الجوال</label>
            <input type="text" name="phone" required className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-purple-500" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">كلمة المرور</label>
            <input type="password" name="password" required defaultValue="123456" className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-purple-500" />
          </div>
          <button type="submit" className="w-full bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700 transition-colors">تسجيل الدخول</button>
        </form>
      </div>
    </div>
  );
}