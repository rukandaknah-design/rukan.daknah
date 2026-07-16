'use client';
import { useState, useEffect } from 'react';
import { Tags, Plus, Edit, Trash2, X } from 'lucide-react';
import { getCategories, saveCategory, deleteCategory } from './actions';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id: '', name: '' });

  const loadData = async () => {
    const data = await getCategories();
    setCategories(data);
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveCategory(formData);
    setShowModal(false);
    loadData();
  };

  return (
    <div className="p-6 lg:p-10 space-y-8" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-800 flex items-center gap-3">
            <Tags className="text-sky-500 w-8 h-8" /> إدارة التصنيفات
          </h1>
          <p className="text-gray-500 mt-2 font-medium">أضف وعدل تصنيفات متجرك بسهولة</p>
        </div>
        <button onClick={() => { setFormData({ id: '', name: '' }); setShowModal(true); }} className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-sky-200 transition-all flex items-center gap-2">
          <Plus className="w-5 h-5" /> تصنيف جديد
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map(cat => (
          <div key={cat.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-2 h-full bg-sky-500 opacity-0 group-hover:opacity-100 transition-all"></div>
            <h3 className="text-xl font-black text-gray-800 mb-4">{cat.name}</h3>
            <div className="flex gap-2">
              <button onClick={() => { setFormData(cat); setShowModal(true); }} className="flex-1 bg-gray-50 hover:bg-sky-50 text-gray-600 hover:text-sky-600 py-2 rounded-xl font-bold text-sm transition-all flex justify-center items-center gap-2">
                <Edit className="w-4 h-4" /> تعديل
              </button>
              <button onClick={async () => { if(confirm('متأكد من الحذف؟')) { await deleteCategory(cat.id); loadData(); } }} className="flex-1 bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600 py-2 rounded-xl font-bold text-sm transition-all flex justify-center items-center gap-2">
                <Trash2 className="w-4 h-4" /> حذف
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl">
            <div className="bg-sky-50 p-6 flex justify-between items-center border-b border-sky-100">
              <h2 className="text-xl font-black text-sky-900">{formData.id ? 'تعديل التصنيف' : 'إضافة تصنيف'}</h2>
              <button onClick={() => setShowModal(false)} className="text-sky-400 hover:text-sky-600 bg-white p-2 rounded-full shadow-sm"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">اسم التصنيف</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 focus:border-sky-500 focus:ring-4 focus:ring-sky-50 rounded-xl py-3 px-4 outline-none transition-all font-medium" placeholder="مثال: ملابس رجالية" />
              </div>
              <button type="submit" className="w-full bg-sky-500 hover:bg-sky-600 text-white font-black py-4 rounded-xl shadow-lg shadow-sky-200 transition-all">
                حفظ التصنيف
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}