'use client';
import { useState } from 'react';
import { Store, Percent, Phone, MapPin, Mail, Save, Loader2, Image as ImageIcon } from 'lucide-react';

export default function Settings() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // محاكاة حفظ البيانات
    setTimeout(() => {
      setIsSubmitting(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">إعدادات النظام</h1>
          <p className="text-gray-500 text-sm mt-1">التحكم في بيانات المتجر، الضرائب، ومعلومات التواصل</p>
        </div>
        <button onClick={(e) => handleSave(e as any)} disabled={isSubmitting} className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50 shadow-sm">
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin"/> : <><Save className="w-5 h-5"/> حفظ التعديلات</>}
        </button>
      </div>

      {saved && (
        <div className="bg-green-50 text-green-600 p-4 rounded-xl font-bold border border-green-100 flex items-center gap-2 shadow-sm">
          ✅ تم حفظ الإعدادات بنجاح!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* الإعدادات العامة */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-50 pb-4">
              <Store className="w-5 h-5 text-indigo-600"/> البيانات الأساسية
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">اسم المتجر</label>
                <input type="text" defaultValue="متجري" className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">العملة الافتراضية</label>
                <select className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all bg-white">
                  <option>ريال سعودي (SAR)</option>
                  <option>دولار أمريكي (USD)</option>
                  <option>درهم إماراتي (AED)</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">وصف المتجر (يظهر في الفوتر)</label>
                <textarea rows={3} defaultValue="الوجهة الأولى للتسوق الإلكتروني. نقدم لك أفضل المنتجات بأعلى جودة وأفضل الأسعار." className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all"></textarea>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-50 pb-4">
              <Phone className="w-5 h-5 text-indigo-600"/> بيانات التواصل
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">رقم الجوال / واتساب</label>
                <div className="relative">
                  <Phone className="w-5 h-5 absolute right-4 top-3.5 text-gray-400" />
                  <input type="text" defaultValue="0500000000" className="w-full border border-gray-200 rounded-xl pr-12 pl-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all" dir="ltr" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">البريد الإلكتروني</label>
                <div className="relative">
                  <Mail className="w-5 h-5 absolute right-4 top-3.5 text-gray-400" />
                  <input type="email" defaultValue="support@mystore.com" className="w-full border border-gray-200 rounded-xl pr-12 pl-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all" dir="ltr" />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">العنوان الفعلي</label>
                <div className="relative">
                  <MapPin className="w-5 h-5 absolute right-4 top-3.5 text-gray-400" />
                  <input type="text" defaultValue="الرياض، المملكة العربية السعودية" className="w-full border border-gray-200 rounded-xl pr-12 pl-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* الإعدادات الجانبية */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-50 pb-4">
              <ImageIcon className="w-5 h-5 text-indigo-600"/> شعار المتجر
            </h2>
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl p-8 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group">
              <div className="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 text-indigo-500 font-black text-3xl group-hover:scale-110 transition-transform">
                M.
              </div>
              <p className="text-sm font-bold text-gray-600">تغيير الشعار</p>
              <p className="text-xs text-gray-400 mt-2">PNG, JPG (Max 2MB)</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-50 pb-4">
              <Percent className="w-5 h-5 text-indigo-600"/> الضرائب والرسوم
            </h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">نسبة ضريبة القيمة المضافة (%)</label>
                <input type="number" defaultValue="15" className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">رسوم التوصيل الافتراضية</label>
                <input type="number" defaultValue="25" className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all" />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <input type="checkbox" id="tax-inc" defaultChecked className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer" />
                <label htmlFor="tax-inc" className="text-sm font-bold text-gray-700 cursor-pointer">الأسعار المدخلة تشمل الضريبة</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}