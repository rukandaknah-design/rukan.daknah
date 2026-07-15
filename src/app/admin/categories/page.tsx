'use client';
import { useState, useEffect } from 'react';
import { Tags, Plus, Trash2, Loader2 } from 'lucide-react';
import { getCategories, addCategory, deleteCategory } from './actions';

export default function Categories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const data = await getCategories();
    setCategories(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    await addCategory(formData);
    e.currentTarget.reset();
    await loadData();
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string, productsCount: number) => {
    if (productsCount > 0) {
      alert('لا يمكن حذف هذا التصنيف لأنه يحتوي على منتجات!');
      return;
    }
    if(confirm('هل أنت متأكد من حذف هذا التصنيف؟')) {
      await deleteCategory(id);
      await loadData();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">إدارة التصنيفات</h1>
          <p className="text-gray-500 text-sm mt-1">إضافة وتعديل أقسام المنتجات</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* نموذج إضافة تصنيف */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 h-fit">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-indigo-600"/> إضافة تصنيف جديد
          </h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">اسم التصنيف</label>
              <input type="text" name="name" required className="w-full border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all" placeholder="مثال: أحذية رياضية" />
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-colors flex justify-center items-center gap-2 disabled:opacity-50">
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin"/> : 'حفظ التصنيف'}
            </button>
          </form>
        </div>

        {/* جدول التصنيفات */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-10 flex justify-center items-center text-indigo-600 flex-col gap-3">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p className="font-bold">جاري تحميل التصنيفات...</p>
            </div>
          ) : (
            <table className="w-full text-right">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="p-4 font-semibold text-gray-600">اسم التصنيف</th>
                  <th className="p-4 font-semibold text-gray-600">عدد المنتجات</th>
                  <th className="p-4 font-semibold text-gray-600">إجراء</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr><td colSpan={3} className="p-8 text-center text-gray-500 font-bold">لا توجد تصنيفات حالياً.</td></tr>
                ) : (
                  categories.map((category) => (
                    <tr key={category.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-bold text-gray-800 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                          <Tags className="w-4 h-4"/>
                        </div>
                        {category.name}
                      </td>
                      <td className="p-4 text-gray-600 font-bold">
                        <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">{category._count.products} منتج</span>
                      </td>
                      <td className="p-4">
                        <button 
                          onClick={() => handleDelete(category.id, category._count.products)} 
                          className={`p-2 rounded-lg transition-colors ${category._count.products > 0 ? 'text-gray-300 cursor-not-allowed' : 'text-red-500 hover:bg-red-50'}`}
                          title={category._count.products > 0 ? 'لا يمكن حذف تصنيف يحتوي على منتجات' : 'حذف التصنيف'}
                        >
                          <Trash2 className="w-5 h-5"/>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}