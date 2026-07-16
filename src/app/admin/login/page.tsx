'use client';
import { useState } from 'react';
import { ShieldCheck, Lock, User } from 'lucide-react';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === '1' && password === '1') {
      document.cookie = 'userRole=admin; path=/; max-age=86400';
      window.location.href = '/admin/dashboard';
    } else {
      setError('بيانات الإدارة غير صحيحة!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans relative overflow-hidden" dir="rtl">
      {/* تأثيرات إضاءة في الخلفية */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-sky-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-50"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-50"></div>

      <div className="bg-slate-800/50 backdrop-blur-2xl w-full max-w-md rounded-[2rem] shadow-2xl p-8 border border-slate-700 relative z-10">
        <div className="text-center mb-8">
          <div className="bg-slate-700/50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-sky-400 border border-slate-600 shadow-lg">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">بوابة الإدارة العليا</h1>
          <p className="text-slate-400 font-medium mt-2">الوصول مصرح للمدراء فقط</p>
        </div>

        {error && <div className="bg-red-500/10 text-red-400 p-4 rounded-xl text-sm font-bold mb-6 text-center border border-red-500/20">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <div className="relative">
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-slate-900/50 border border-slate-700 text-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl py-4 px-4 pr-12 outline-none transition-all font-medium placeholder-slate-500" placeholder="اسم المستخدم (المدير)" />
              <User className="w-5 h-5 text-slate-500 absolute right-4 top-4" />
            </div>
          </div>
          <div>
            <div className="relative">
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-900/50 border border-slate-700 text-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl py-4 px-4 pr-12 outline-none transition-all font-medium placeholder-slate-500" placeholder="كلمة المرور" />
              <Lock className="w-5 h-5 text-slate-500 absolute right-4 top-4" />
            </div>
          </div>
          <button type="submit" className="w-full bg-sky-500 hover:bg-sky-400 text-white font-black py-4 rounded-xl shadow-lg shadow-sky-500/25 transition-all mt-6 text-lg">
            تسجيل الدخول
          </button>
        </form>
      </div>
    </div>
  );
}