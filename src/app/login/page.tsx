'use client';
import { useState } from 'react';
import { Lock, Phone, Key, Loader2, ShieldCheck } from 'lucide-react';
import { login } from './actions';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const formData = new FormData(e.currentTarget);
    const result = await login(formData);
    
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-indigo-50 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden border border-white/50 relative">
        
        {/* تصميم علوي */}
        <div className="bg-indigo-600 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-inner border border-white/30">
            <ShieldCheck className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white">تسجيل الدخول للنظام</h1>
          <p className="text-indigo-100 mt-2 text-sm">الرجاء إدخال بيانات الاعتماد الخاصة بك</p>
        </div>

        {/* نموذج الدخول */}
        <div className="p-8">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold mb-6 border border-red-100 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">رقم الجوال</label>
              <div className="relative">
                <Phone className="w-5 h-5 absolute right-4 top-3.5 text-gray-400" />
                <input type="text" name="phone" required className="w-full bg-gray-50 border border-gray-200 rounded-xl pr-12 pl-4 py-3 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all font-mono text-left" placeholder="رقم الجوال" dir="ltr" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">كلمة المرور</label>
              <div className="relative">
                <Key className="w-5 h-5 absolute right-4 top-3.5 text-gray-400" />
                <input type="password" name="password" required className="w-full bg-gray-50 border border-gray-200 rounded-xl pr-12 pl-4 py-3 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all font-mono text-left" placeholder="••••••••" dir="ltr" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white font-black text-lg py-4 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 flex justify-center items-center gap-2 mt-4">
              {loading ? <Loader2 className="w-6 h-6 animate-spin"/> : <><Lock className="w-5 h-5"/> دخول آمن</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}