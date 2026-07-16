'use client';
import { useState, useEffect } from 'react';
import { Package, Plus, Edit, Trash2, X, Image as ImageIcon, Ruler } from 'lucide-react';
import { getProductsData, saveProduct, deleteProduct } from './actions';

export default function ProductsPage() {
  const [data, setData] = useState({ products: [], categories: [], offers: [] });
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id: '', name: '', cost: 0, price: 0, categoryId: '', offerId: '', images: [''], sizes: [{ size: '', qty: 0 }] });

  const loadData = async () => {
    const res = await getProductsData();
    setData(res as any);
  };

  useEffect(() => { loadData(); }, []);

  const openModal = (prod: any = null) => {
    if (prod) {
      setFormData({
        id: prod.id, name: prod.name, cost: prod.cost, price: prod.price,
        categoryId: prod.categoryId || '', offerId: prod.offerId || '',
        images: JSON.parse(prod.images || '[""]'),
        sizes: JSON.parse(prod.sizes || '[{"size":"","qty":0}]')
      });
    } else {
      setFormData({ id: '', name: '', cost: 0, price: 0, categoryId: '', offerId: '', images: [''], sizes: [{ size: '', qty: 0 }] });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveProduct(formData);
    setShowModal(false);
    loadData();
  };

  return (
    <div className="p-6 lg:p-10 space-y-8" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-800 flex items-center gap-3">
            <Package className="text-sky-500 w-8 h-8" /> إدارة المنتجات
          </h1>
          <p className="text-gray-500 mt-2 font-medium">تحكم في المخزون، الأسعار، والصور</p>
        </div>
        <button onClick={() => openModal()} className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-sky-200 transition-all flex items-center gap-2">
          <Plus className="w-5 h-5" /> منتج جديد
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.products.map((prod: any) => {
          const images = JSON.parse(prod.images || '[]');
          const sizes = JSON.parse(prod.sizes || '[]');
          const totalQty = sizes.reduce((acc: number, curr: any) => acc + Number(curr.qty), 0);
          
          return (
            <div key={prod.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
              <div className="h-48 bg-gray-100 relative">
                {images[0] ? (
                  <img src={images[0]} alt={prod.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400"><ImageIcon className="w-12 h-12 opacity-50" /></div>
                )}
                {prod.offer && <div className="absolute top-4 right-4 bg-rose-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">{prod.offer.title}</div>}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-black text-gray-800 mb-2">{prod.name}</h3>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sky-600 font-black text-lg">{prod.price} ريال</span>
                  <span className="text-sm font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-lg">المخزون: {totalQty}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openModal(prod)} className="flex-1 bg-sky-50 hover:bg-sky-100 text-sky-600 py-2 rounded-xl font-bold text-sm transition-all flex justify-center items-center gap-2"><Edit className="w-4 h-4" /> تعديل</button>
                  <button onClick={async () => { if(confirm('حذف المنتج؟')) { await deleteProduct(prod.id); loadData(); } }} className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-xl font-bold text-sm transition-all flex justify-center items-center gap-2"><Trash2 className="w-4 h-4" /> حذف</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-[2rem] w-full max-w-3xl shadow-2xl my-8">
            <div className="bg-sky-50 p-6 flex justify-between items-center border-b border-sky-100 rounded-t-[2rem]">
              <h2 className="text-xl font-black text-sky-900">{formData.id ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h2>
              <button onClick={() => setShowModal(false)} className="text-sky-400 hover:text-sky-600 bg-white p-2 rounded-full shadow-sm"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* البيانات الأساسية */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">اسم المنتج</label>
                    <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 rounded-xl py-3 px-4 outline-none font-medium" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">التكلفة (عليك)</label>
                      <input type="number" required value={formData.cost} onChange={(e) => setFormData({...formData, cost: Number(e.target.value)})} className="w-full bg-gray-50 border border-gray-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 rounded-xl py-3 px-4 outline-none font-medium" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">سعر البيع</label>
                      <input type="number" required value={formData.price} onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} className="w-full bg-gray-50 border border-gray-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 rounded-xl py-3 px-4 outline-none font-medium" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">التصنيف</label>
                      <select value={formData.categoryId} onChange={(e) => setFormData({...formData, categoryId: e.target.value})} className="w-full bg-gray-50 border border-gray-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 rounded-xl py-3 px-4 outline-none font-medium">
                        <option value="">بدون تصنيف</option>
                        {data.categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">العرض (الخصم)</label>
                      <select value={formData.offerId} onChange={(e) => setFormData({...formData, offerId: e.target.value})} className="w-full bg-gray-50 border border-gray-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 rounded-xl py-3 px-4 outline-none font-medium">
                        <option value="">بدون عرض</option>
                        {data.offers.map((o: any) => <option key={o.id} value={o.id}>{o.title}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* الصور والمقاسات */}
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-sm font-bold text-gray-700 flex items-center gap-2"><ImageIcon className="w-4 h-4 text-sky-500"/> روابط الصور (حتى 10)</label>
                      {formData.images.length < 10 && (
                        <button type="button" onClick={() => setFormData({...formData, images: [...formData.images, '']})} className="text-xs bg-sky-100 text-sky-600 px-2 py-1 rounded-lg font-bold">+ إضافة صورة</button>
                      )}
                    </div>
                    <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
                      {formData.images.map((img, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input type="text" value={img} onChange={(e) => { const newImgs = [...formData.images]; newImgs[idx] = e.target.value; setFormData({...formData, images: newImgs}); }} placeholder="رابط الصورة..." className="flex-1 bg-white border border-gray-200 rounded-lg py-2 px-3 text-sm outline-none focus:border-sky-500" />
                          {formData.images.length > 1 && <button type="button" onClick={() => { const newImgs = formData.images.filter((_, i) => i !== idx); setFormData({...formData, images: newImgs}); }} className="bg-red-50 text-red-500 px-3 rounded-lg hover:bg-red-100"><Trash2 className="w-4 h-4"/></button>}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-sm font-bold text-gray-700 flex items-center gap-2"><Ruler className="w-4 h-4 text-sky-500"/> المقاسات والمخزون</label>
                      <button type="button" onClick={() => setFormData({...formData, sizes: [...formData.sizes, {size: '', qty: 0}]})} className="text-xs bg-sky-100 text-sky-600 px-2 py-1 rounded-lg font-bold">+ إضافة مقاس</button>
                    </div>
                    <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
                      {formData.sizes.map((sz, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input type="text" value={sz.size} onChange={(e) => { const newSz = [...formData.sizes]; newSz[idx].size = e.target.value; setFormData({...formData, sizes: newSz}); }} placeholder="المقاس (مثال: XL)" className="w-1/2 bg-white border border-gray-200 rounded-lg py-2 px-3 text-sm outline-none focus:border-sky-500" />
                          <input type="number" value={sz.qty} onChange={(e) => { const newSz = [...formData.sizes]; newSz[idx].qty = Number(e.target.value); setFormData({...formData, sizes: newSz}); }} placeholder="الكمية" className="w-1/3 bg-white border border-gray-200 rounded-lg py-2 px-3 text-sm outline-none focus:border-sky-500" />
                          {formData.sizes.length > 1 && <button type="button" onClick={() => { const newSz = formData.sizes.filter((_, i) => i !== idx); setFormData({...formData, sizes: newSz}); }} className="bg-red-50 text-red-500 px-3 rounded-lg hover:bg-red-100"><Trash2 className="w-4 h-4"/></button>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <button type="submit" className="w-full bg-sky-500 hover:bg-sky-600 text-white font-black py-4 rounded-xl shadow-lg shadow-sky-200 transition-all text-lg">
                حفظ المنتج
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}