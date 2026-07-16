'use client';
import { useState } from 'react';
import { Store, Lock, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // التحقق من بيانات المدير
    if (username === '1' && password === '1') {
      document.cookie = 'userRole=admin; path=/; max-age=86400';
      window.location.href = '/admin/dashboard';
    } 
    // التحقق من بيانات الكاشير
    else if (username === '2' && password === '2') {
      document.cookie = 'userRole=cashier; path=/; max-age=86400';
      window.location.href = '/pos';
    } 
    // بيانات خاطئة
    else {
      setError('بيانات الدخول غير صحيحة!');
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f9ff] flex items-center justify-center p-4 font-sans" dir="rtl">
      <div className="bg-white w-full max-w-md rounded-[2rem] shadow-xl shadow-sky-100 p-8 border border-sky-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-sky-400 to-blue-500"></div>
        
        <div className="text-center mb-8">
          <div className="bg-sky-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-sky-500 shadow-inner">
            <Store className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-gray-800">تسجيل الدخول</h1>
          <p className="text-gray-500 font-medium mt-2">أدخل بياناتك للوصول للنظام</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold mb-6 text-center border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">اسم المستخدم</label>
            <div className="relative">
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 rounded-xl py-3 px-4 pr-11 outline-none transition-all font-medium"
                placeholder="أدخل اسم المستخدم"
              />
              <User className="w-5 h-5 text-gray-400 absolute right-4 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">كلمة المرور</label>
            <div className="relative">
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 rounded-xl py-3 px-4 pr-11 outline-none transition-all font-medium"
                placeholder="أدخل كلمة المرور"
              />
              <Lock className="w-5 h-5 text-gray-400 absolute right-4 top-3.5" />
            </div>
          </div>

          <button type="submit" className="w-full bg-sky-500 hover:bg-sky-600 text-white font-black py-4 rounded-xl shadow-lg shadow-sky-200 transition-all mt-4">
            دخول
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link href="/" className="text-sky-500 font-bold hover:underline flex items-center justify-center gap-2">
            العودة للمتجر <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}