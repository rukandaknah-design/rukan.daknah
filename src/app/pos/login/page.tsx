'use client';
import { useState } from 'react';
import { Store, Lock, User } from 'lucide-react';

export default function POSLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === '2' && password === '2') {
      document.cookie = 'userRole=cashier; path=/; max-age=86400';
      window.location.href = '/pos';
    } else {
      setError('بيانات الموظف غير صحيحة!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans" dir="rtl">
      <div className="bg-white w-full max-w-md rounded-[2rem] shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <div className="bg-emerald-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-500">
            <Store className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-gray-800">نظام نقاط البيع</h1>
          <p className="text-gray-500 font-medium mt-2">تسجيل دخول الموظفين (الكاشير)</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold mb-6 text-center border border-red-100">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="relative">
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 rounded-xl py-4 px-4 pr-12 outline-none transition-all font-bold text-lg" placeholder="رقم الموظف" />
            <User className="w-6 h-6 text-gray-400 absolute right-4 top-4" />
          </div>
          <div className="relative">
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 rounded-xl py-4 px-4 pr-12 outline-none transition-all font-bold text-lg" placeholder="الرقم السري" />
            <Lock className="w-6 h-6 text-gray-400 absolute right-4 top-4" />
          </div>
          <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-4 rounded-xl shadow-lg shadow-emerald-200 transition-all mt-6 text-lg">
            فتح الصندوق
          </button>
        </form>
      </div>
    </div>
  );
}