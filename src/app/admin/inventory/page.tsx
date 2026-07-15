'use client';
import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Loader2, X, Image as ImageIcon, UploadCloud, Package, DollarSign, Tags } from 'lucide-react';
import { getProducts, getCategories, addProduct, updateProduct, deleteProduct } from './actions';

export default function Inventory() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<any | null>(null);
  
  // حالات النموذج
  const [sizes, setSizes] = useState<{size: string, stock: string}[]>([{ size: '', stock: '' }]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const loadData = async () => {
    setLoading(true);
    setProducts(await getProducts());
    setCategories(await getCategories());
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const parseImages = (imagesStr: string) => {
    try { return JSON.parse(imagesStr || '[]'); } catch { return []; }
  };

  const handleEdit = (product: any) => {
    setEditProduct(product);
    setSizes(product.sizes.length > 0 ? product.sizes.map((s:any) => ({ size: s.size, stock: s.stock.toString() })) : [{ size: '', stock: '' }]);
    setImagePreviews(parseImages(product.images));
    setImageFiles([]);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if(confirm('هل أنت متأكد من حذف هذا المنتج نهائياً؟')) {
      await deleteProduct(id);
      await loadData();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 10); // الحد الأقصى 10 صور
      setImageFiles(files);
      const previews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    formData.append('sizes', JSON.stringify(sizes.filter(s => s.size && s.stock)));
    
    // إضافة الصور للـ FormData
    imageFiles.forEach(file => formData.append('images', file));
    
    try {
      if (editProduct) {
        await updateProduct(editProduct.id, formData);
      } else {
        await addProduct(formData);
      }
      e.currentTarget.reset();
      setSizes([{ size: '', stock: '' }]);
      setImagePreviews([]);
      setImageFiles([]);
      setEditProduct(null);
      setShowForm(false);
      await loadData();
    } catch (error) {
      alert('حدث خطأ، تأكد من أن كود المنتج غير مكرر.');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">المخزون والمنتجات</h1>
        <button onClick={() => {setShowForm(!showForm); setEditProduct(null); setSizes([{ size: '', stock: '' }]); setImagePreviews([]); setImageFiles([]);}} className="bg-sky-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-sky-700 flex items-center gap-2 shadow-md">
          {showForm ? <X className="w-5 h-5"/> : <Plus className="w-5 h-5"/>}
          {showForm ? 'إلغاء' : 'إضافة منتج جديد'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-[2rem] shadow-xl border border-sky-50 p-8 animate-in slide-in-from-top-4">
          <div className="mb-8 border-b border-gray-100 pb-4">
            <h2 className="text-2xl font-black text-gray-800">{editProduct ? 'تعديل بيانات المنتج' : 'إضافة منتج جديد'}</h2>
            <p className="text-gray-500 mt-1">يرجى تعبئة كافة التفاصيل بدقة لضمان ظهورها بشكل ممتاز في المتجر.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* القسم الأول: البيانات الأساسية */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <div className="flex items-center gap-2 mb-4 text-sky-600"><Package className="w-5 h-5"/><h3 className="font-bold text-lg">البيانات الأساسية</h3></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div><label className="block text-sm font-bold mb-2 text-gray-700">اسم المنتج *</label><input type="text" name="name" defaultValue={editProduct?.name} required className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-sky-500 bg-white" placeholder="مثال: عباية كلوش سوداء" /></div>
                <div><label className="block text-sm font-bold mb-2 text-gray-700">كود المنتج (SKU) *</label><input type="text" name="code" defaultValue={editProduct?.code} required className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-sky-500 bg-white" placeholder="مثال: ABY-001" /></div>
                <div><label className="block text-sm font-bold mb-2 text-gray-700">كود المورد</label><input type="text" name="supplierCode" defaultValue={editProduct?.supplierCode} className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-sky-500 bg-white" placeholder="اختياري" /></div>
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-700">التصنيف *</label>
                  <select name="categoryId" defaultValue={editProduct?.categoryId} required className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-sky-500 bg-white appearance-none">
                    <option value="">اختر التصنيف...</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div><label className="block text-sm font-bold mb-2 text-gray-700">الماركة</label><input type="text" name="brand" defaultValue={editProduct?.brand} className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-sky-500 bg-white" placeholder="مثال: زارا" /></div>
                <div className="md:col-span-3"><label className="block text-sm font-bold mb-2 text-gray-700">التفاصيل والوصف</label><textarea name="details" defaultValue={editProduct?.details} rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-sky-500 bg-white resize-none" placeholder="اكتب وصفاً جذاباً للمنتج يظهر للعملاء..."></textarea></div>
              </div>
            </div>

            {/* القسم الثاني: التسعير */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <div className="flex items-center gap-2 mb-4 text-green-600"><DollarSign className="w-5 h-5"/><h3 className="font-bold text-lg">التسعير</h3></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label className="block text-sm font-bold mb-2 text-gray-700">التكلفة (ر.س) *</label><input type="number" step="0.01" name="cost" defaultValue={editProduct?.cost} required className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-green-500 bg-white" placeholder="0.00" /></div>
                <div><label className="block text-sm font-bold mb-2 text-gray-700">سعر البيع (ر.س) *</label><input type="number" step="0.01" name="price" defaultValue={editProduct?.price} required className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-green-500 bg-white" placeholder="0.00" /></div>
              </div>
            </div>

            {/* القسم الثالث: الصور */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <div className="flex items-center gap-2 mb-4 text-purple-600"><ImageIcon className="w-5 h-5"/><h3 className="font-bold text-lg">صور المنتج (حتى 10 صور)</h3></div>
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center bg-white hover:bg-gray-50 transition-colors relative">
                <input type="file" multiple accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" title="اضغط لرفع الصور" />
                <UploadCloud className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 font-bold">اضغط هنا أو اسحب الصور للإفلات</p>
                <p className="text-sm text-gray-400 mt-1">يدعم JPG, PNG (الحد الأقصى 10 صور)</p>
              </div>
              {/* معاينة الصور */}
              {imagePreviews.length > 0 && (
                <div className="mt-4 grid grid-cols-5 gap-4">
                  {imagePreviews.map((src, idx) => (
                    <div key={idx} className="aspect-square rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm relative group">
                      <img src={src} alt="preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">صورة {idx + 1}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* القسم الرابع: المقاسات والمخزون */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2 text-orange-600"><Tags className="w-5 h-5"/><h3 className="font-bold text-lg">المقاسات والمخزون *</h3></div>
                <button type="button" onClick={() => setSizes([...sizes, { size: '', stock: '' }])} className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-100 shadow-sm">+ إضافة مقاس</button>
              </div>
              <div className="space-y-3">
                {sizes.map((s, i) => (
                  <div key={i} className="flex gap-4 items-center bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex-1">
                      <input type="text" placeholder="المقاس (مثال: XL أو 42 أو One Size)" value={s.size} onChange={(e) => {const newSizes = [...sizes]; newSizes[i].size = e.target.value; setSizes(newSizes);}} required className="w-full border-none outline-none bg-transparent font-bold text-gray-700" />
                    </div>
                    <div className="w-px h-8 bg-gray-200"></div>
                    <div className="flex-1">
                      <input type="number" placeholder="الكمية المتوفرة" value={s.stock} onChange={(e) => {const newSizes = [...sizes]; newSizes[i].stock = e.target.value; setSizes(newSizes);}} required className="w-full border-none outline-none bg-transparent font-bold text-gray-700" />
                    </div>
                    {sizes.length > 1 && (
                      <button type="button" onClick={() => setSizes(sizes.filter((_, index) => index !== i))} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"><Trash2 className="w-5 h-5"/></button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button type="submit" disabled={isSubmitting} className="bg-sky-600 text-white font-black py-4 px-12 rounded-xl hover:bg-sky-700 flex items-center gap-3 shadow-lg shadow-sky-200 transition-all hover:-translate-y-1">
                {isSubmitting && <Loader2 className="w-6 h-6 animate-spin"/>} {editProduct ? 'حفظ التعديلات' : 'نشر المنتج في المتجر'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* جدول المنتجات المفصل */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-10 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-sky-600" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right whitespace-nowrap">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="p-4 font-semibold text-gray-600">المنتج والكود</th>
                  <th className="p-4 font-semibold text-gray-600">التصنيف والماركة</th>
                  <th className="p-4 font-semibold text-gray-600">التكلفة / السعر</th>
                  <th className="p-4 font-semibold text-gray-600">المقاسات والمخزون</th>
                  <th className="p-4 font-semibold text-gray-600">إجراء</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-gray-500 font-bold">لا توجد منتجات مضافة.</td></tr>
                ) : (
                  products.map((product) => {
                    const images = parseImages(product.images);
                    const totalStock = product.sizes.reduce((sum: number, s: any) => sum + s.stock, 0);
                    return (
                      <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="p-4 flex items-center gap-4">
                          <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200 shadow-sm">
                            {images[0] ? <img src={images[0]} alt="" className="w-full h-full object-cover" /> : <ImageIcon className="w-6 h-6 text-gray-400"/>}
                          </div>
                          <div>
                            <p className="font-bold text-gray-800 text-lg">{product.name}</p>
                            <p className="text-sm text-gray-500 font-mono bg-gray-100 px-2 py-0.5 rounded mt-1 w-fit">{product.code}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="font-bold text-gray-700">{product.category?.name || 'عام'}</p>
                          <p className="text-sm text-gray-500 mt-1">{product.brand || '-'}</p>
                        </td>
                        <td className="p-4">
                          <p className="font-black text-sky-600 text-lg">{product.price} ر.س</p>
                          <p className="text-sm text-gray-500 mt-1">التكلفة: {product.cost} ر.س</p>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col gap-1.5">
                            {product.sizes.map((s: any) => (
                              <div key={s.id} className="flex items-center gap-2 text-sm">
                                <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-bold min-w-[3rem] text-center">{s.size}</span>
                                <span className={s.stock > 0 ? 'text-green-600 font-bold' : 'text-red-500 font-bold'}>({s.stock})</span>
                              </div>
                            ))}
                            <div className="mt-2 pt-2 border-t border-gray-100">
                              <span className="text-sm font-black text-gray-800">الإجمالي: {totalStock} حبة</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button onClick={() => handleEdit(product)} className="text-blue-600 bg-blue-50 hover:bg-blue-100 p-2.5 rounded-xl transition-colors shadow-sm" title="تعديل"><Edit className="w-5 h-5"/></button>
                            <button onClick={() => handleDelete(product.id)} className="text-red-600 bg-red-50 hover:bg-red-100 p-2.5 rounded-xl transition-colors shadow-sm" title="حذف"><Trash2 className="w-5 h-5"/></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}