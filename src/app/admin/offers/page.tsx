'use client';
import { useState, useEffect } from 'react';
import { TicketPercent, Plus, Edit, Trash2, X } from 'lucide-react';
import { getOffers, saveOffer, deleteOffer } from './actions';

export default function OffersPage() {
  const [offers, setOffers] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id: '', title: '', discount: 0, type: 'PERCENTAGE', isActive: true });

  const loadData = async () => {
    const data = await getOffers();
    setOffers(data);
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveOffer({ ...formData, discount: Number(formData.discount) });
    setShowModal(false);
    loadData();
  };

  return (
    <div className="p-6 lg:p-10 space-y-8" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-800 flex items-center gap-3">
            <TicketPercent className="text-rose-500 w-8 h-8" /> إدارة العروض
          </h1>
          <p className="text-gray-500 mt-2 font-medium">تحكم في الخصومات والكوبونات</p>
        </div>
        <button onClick={() => { setFormData({ id: '', title: '', discount: 0, type: 'PERCENTAGE', isActive: true }); setShowModal(true); }} className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-rose-200 transition-all flex items-center gap-2">
          <Plus className="w-5 h-5" /> عرض جديد
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map(offer => (
          <div key={offer.id} className={p-6 rounded-3xl shadow-sm border transition-all relative overflow-hidden }>
            <div className={bsolute top-0 right-0 w-2 h-full }></div>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-black text-gray-800">{offer.title}</h3>
              <span className={px-3 py-1 rounded-full text-xs font-bold }>
                {offer.isActive ? 'نشط' : 'متوقف'}
              </span>
            </div>
            <div className="text-3xl font-black text-rose-500 mb-6" dir="ltr">
              {offer.type === 'PERCENTAGE' ? ${offer.discount}% : ${offer.discount} SAR}
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setFormData(offer); setShowModal(true); }} className="flex-1 bg-gray-100 hover:bg-rose-50 text-gray-600 hover:text-rose-600 py-2 rounded-xl font-bold text-sm transition-all flex justify-center items-center gap-2">
                <Edit className="w-4 h-4" /> تعديل
              </button>
              <button onClick={async () => { if(confirm('متأكد من الحذف؟')) { await deleteOffer(offer.id); loadData(); } }} className="flex-1 bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 py-2 rounded-xl font-bold text-sm transition-all flex justify-center items-center gap-2">
                <Trash2 className="w-4 h-4" /> حذف
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl">
            <div className="bg-rose-50 p-6 flex justify-between items-center border-b border-rose-100">
              <h2 className="text-xl font-black text-rose-900">{formData.id ? 'تعديل العرض' : 'إضافة عرض'}</h2>
              <button onClick={() => setShowModal(false)} className="text-rose-400 hover:text-rose-600 bg-white p-2 rounded-full shadow-sm"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">اسم العرض</label>
                <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full bg-gray-50 border border-gray-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-50 rounded-xl py-3 px-4 outline-none transition-all font-medium" placeholder="مثال: خصم الصيف" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">قيمة الخصم</label>
                  <input type="number" required value={formData.discount} onChange={(e) => setFormData({...formData, discount: Number(e.target.value)})} className="w-full bg-gray-50 border border-gray-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-50 rounded-xl py-3 px-4 outline-none transition-all font-medium" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">نوع الخصم</label>
                  <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full bg-gray-50 border border-gray-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-50 rounded-xl py-3 px-4 outline-none transition-all font-medium">
                    <option value="PERCENTAGE">نسبة مئوية (%)</option>
                    <option value="FIXED">مبلغ ثابت (ريال)</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
                <input type="checkbox" id="isActive" checked={formData.isActive} onChange={(e) => setFormData({...formData, isActive: e.target.checked})} className="w-5 h-5 text-rose-500 rounded focus:ring-rose-500" />
                <label htmlFor="isActive" className="font-bold text-gray-700 cursor-pointer">تفعيل العرض حالياً</label>
              </div>
              <button type="submit" className="w-full bg-rose-500 hover:bg-rose-600 text-white font-black py-4 rounded-xl shadow-lg shadow-rose-200 transition-all mt-2">
                حفظ العرض
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}