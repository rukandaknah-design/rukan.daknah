'use client';
import { useState, useEffect } from 'react';
import { ShoppingCart, Search, Plus, Minus, Trash2, CheckCircle, X, PackageOpen, Loader2, LogOut, Printer } from 'lucide-react';
import { getPosProducts, submitPosOrder } from './actions';
import Link from 'next/link';

export default function POS() {
  const [products, setProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null); // بيانات الفاتورة للطباعة

  const loadProducts = async () => {
    setLoading(true);
    const data = await getPosProducts();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = products.filter(p => 
    p.name.includes(search) || p.code.includes(search)
  );

  const handleProductClick = (product: any) => {
    const totalStock = product.sizes?.reduce((sum: number, s: any) => sum + s.stock, 0) || 0;
    if (totalStock === 0) return;
    setSelectedProduct(product);
  };

  const addToCart = (product: any, size: any) => {
    if (size.stock <= 0) return;
    const cartItemId = `${product.id}-${size.id}`;
    const existing = cart.find(item => item.cartItemId === cartItemId);

    if (existing) {
      if (existing.quantity < size.stock) {
        setCart(cart.map(item => item.cartItemId === cartItemId ? { ...item, quantity: item.quantity + 1 } : item));
      } else {
        alert('الكمية المطلوبة تتجاوز المخزون المتوفر!');
      }
    } else {
      setCart([...cart, {
        cartItemId,
        productId: product.id,
        name: product.name,
        price: product.price,
        sizeId: size.id,
        sizeName: size.size,
        quantity: 1,
        maxStock: size.stock
      }]);
    }
    setSelectedProduct(null);
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.cartItemId === cartItemId) {
        const newQ = item.quantity + delta;
        if (newQ > 0 && newQ <= item.maxStock) return { ...item, quantity: newQ };
      }
      return item;
    }));
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(cart.filter(item => item.cartItemId !== cartItemId));
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsSubmitting(true);
    
    // إرسال الطلب لقاعدة البيانات
    const orderId = await submitPosOrder(cart, total);
    
    // تجهيز بيانات الفاتورة للطباعة
    setReceiptData({
      orderId,
      items: [...cart],
      total,
      date: new Date().toLocaleString('ar-SA')
    });

    setCart([]);
    await loadProducts();
    setIsSubmitting(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* واجهة الكاشير الأساسية (تختفي عند الطباعة) */}
      <div className="h-screen flex bg-gray-50 font-sans overflow-hidden print:hidden" dir="rtl">
        
        {/* النافذة المنبثقة لاختيار المقاس */}
        {selectedProduct && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="bg-indigo-600 p-4 flex justify-between items-center text-white">
                <h3 className="font-bold text-lg">اختر المقاس: {selectedProduct.name}</h3>
                <button onClick={() => setSelectedProduct(null)} className="hover:bg-white/20 p-1 rounded-lg transition-colors"><X className="w-6 h-6"/></button>
              </div>
              <div className="p-6">
                {selectedProduct.sizes?.length === 0 ? (
                  <p className="text-center text-gray-500 font-bold py-4">لم يتم إضافة مقاسات لهذا المنتج.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {selectedProduct.sizes?.map((size: any) => (
                      <button 
                        key={size.id}
                        onClick={() => addToCart(selectedProduct, size)}
                        disabled={size.stock === 0}
                        className={`p-4 rounded-xl border-2 text-center transition-all ${size.stock > 0 ? 'border-indigo-100 hover:border-indigo-500 hover:bg-indigo-50 text-gray-800' : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'}`}
                      >
                        <div className="font-black text-xl mb-1">{size.size}</div>
                        {size.stock > 0 ? (
                          <div className="text-sm text-green-600 font-bold">متوفر: {size.stock}</div>
                        ) : (
                          <div className="text-sm text-red-500 font-bold">نفدت الكمية</div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* قسم السلة (اليمين) */}
        <div className="w-1/3 bg-white border-l border-gray-200 flex flex-col shadow-xl z-10">
          <div className="p-6 border-b border-gray-100 bg-indigo-600 text-white flex justify-between items-center">
            <h2 className="text-2xl font-black flex items-center gap-2"><ShoppingCart className="w-6 h-6"/> الفاتورة</h2>
            <Link href="/login" className="text-indigo-100 hover:text-white bg-indigo-700 p-2 rounded-lg transition-colors" title="تسجيل الخروج"><LogOut className="w-5 h-5"/></Link>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-3">
                <ShoppingCart className="w-16 h-16 opacity-20"/>
                <p className="font-bold">الفاتورة فارغة</p>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.cartItemId} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-800">{item.name}</h3>
                      <span className="text-xs font-bold bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md mt-1 inline-block">مقاس: {item.sizeName}</span>
                    </div>
                    <button onClick={() => removeFromCart(item.cartItemId)} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors"><Trash2 className="w-5 h-5"/></button>
                  </div>
                  <div className="flex justify-between items-center border-t border-gray-50 pt-3">
                    <span className="font-black text-indigo-600">{item.price * item.quantity} ر.س</span>
                    <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-1 border border-gray-100">
                      <button onClick={() => updateQuantity(item.cartItemId, 1)} disabled={item.quantity >= item.maxStock} className="bg-white text-gray-600 p-1.5 rounded-lg shadow-sm hover:text-indigo-600 disabled:opacity-50"><Plus className="w-4 h-4"/></button>
                      <span className="font-bold w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.cartItemId, -1)} disabled={item.quantity <= 1} className="bg-white text-gray-600 p-1.5 rounded-lg shadow-sm hover:text-red-600 disabled:opacity-50"><Minus className="w-4 h-4"/></button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-500 font-bold">الإجمالي المطلوب</span>
              <span className="text-3xl font-black text-indigo-600">{total} <span className="text-lg">ر.س</span></span>
            </div>
            <button 
              onClick={handleCheckout}
              disabled={cart.length === 0 || isSubmitting}
              className="w-full bg-indigo-600 text-white font-black text-xl py-4 rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:shadow-none flex justify-center items-center gap-2"
            >
              {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin"/> : <><CheckCircle className="w-6 h-6"/> دفع وإصدار الفاتورة</>}
            </button>
          </div>
        </div>

        {/* قسم المنتجات (اليسار) */}
        <div className="w-2/3 flex flex-col bg-gray-50">
          <div className="p-6 bg-white border-b border-gray-200 flex gap-4 items-center shadow-sm z-0">
            <div className="relative flex-1">
              <Search className="w-6 h-6 absolute right-4 top-3.5 text-gray-400" />
              <input 
                type="text" 
                placeholder="ابحث بالاسم أو الكود (الباركود)..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl pr-14 pl-4 py-3.5 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all text-lg font-medium" 
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="h-full flex justify-center items-center text-indigo-600 flex-col gap-4">
                <Loader2 className="w-12 h-12 animate-spin" />
                <p className="font-bold text-xl">جاري تحميل المنتجات...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="h-full flex justify-center items-center text-gray-400 flex-col gap-4">
                <PackageOpen className="w-16 h-16 opacity-50" />
                <p className="font-bold text-xl">لا توجد منتجات مطابقة</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map((product) => {
                  const totalStock = product.sizes?.reduce((sum: number, s: any) => sum + s.stock, 0) || 0;
                  const isOutOfStock = totalStock === 0;

                  return (
                    <button 
                      key={product.id} 
                      onClick={() => handleProductClick(product)}
                      disabled={isOutOfStock}
                      className={`bg-white rounded-2xl p-4 border text-right transition-all flex flex-col h-full ${isOutOfStock ? 'border-gray-200 opacity-60 cursor-not-allowed grayscale' : 'border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-300 hover:-translate-y-1'}`}
                    >
                      <div className="bg-gray-50 aspect-square rounded-xl mb-3 flex items-center justify-center text-gray-300 font-medium w-full">
                        صورة
                      </div>
                      <div className="text-xs font-bold text-gray-400 mb-1">{product.code}</div>
                      <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 leading-tight">{product.name}</h3>
                      
                      <div className="mt-auto pt-3 flex justify-between items-end w-full">
                        <span className="font-black text-indigo-600 text-lg">{product.price} ر.س</span>
                        {isOutOfStock ? (
                          <span className="bg-red-50 text-red-600 text-xs font-bold px-2 py-1 rounded-md">غير متوفر</span>
                        ) : (
                          <span className="bg-green-50 text-green-600 text-xs font-bold px-2 py-1 rounded-md">متوفر: {totalStock}</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* نافذة الفاتورة للطباعة (تظهر فقط بعد الدفع) */}
      {receiptData && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 print:bg-white print:backdrop-blur-none print:static print:inset-auto print:p-0 print:flex-col print:justify-start" dir="rtl">
          
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 print:shadow-none print:rounded-none print:w-full print:max-w-full">
            
            {/* هيدر الشاشة (يختفي في الطباعة) */}
            <div className="bg-green-500 p-4 flex justify-between items-center text-white print:hidden">
              <h3 className="font-bold text-lg flex items-center gap-2"><CheckCircle className="w-5 h-5"/> تمت العملية بنجاح</h3>
              <button onClick={() => setReceiptData(null)} className="hover:bg-white/20 p-1 rounded-lg transition-colors"><X className="w-6 h-6"/></button>
            </div>

            {/* منطقة الطباعة الفعلية (شكل فاتورة حرارية) */}
            <div className="p-8 bg-white text-black" id="printable-receipt">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-black mb-1">متجري.</h2>
                <p className="text-gray-500 text-sm">الرقم الضريبي: 300000000000003</p>
                <p className="text-gray-500 text-sm">الرياض، المملكة العربية السعودية</p>
              </div>
              
              <div className="border-t border-b border-dashed border-gray-300 py-3 mb-4 space-y-1 text-sm font-medium">
                <div className="flex justify-between"><span>رقم الفاتورة:</span> <span className="font-mono font-bold">#{receiptData.orderId.slice(-6).toUpperCase()}</span></div>
                <div className="flex justify-between"><span>التاريخ:</span> <span>{receiptData.date}</span></div>
                <div className="flex justify-between"><span>الكاشير:</span> <span>الفرع الرئيسي</span></div>
              </div>

              <table className="w-full text-sm mb-4">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-right py-2 font-bold">الصنف</th>
                    <th className="text-center py-2 font-bold">الكمية</th>
                    <th className="text-left py-2 font-bold">السعر</th>
                  </tr>
                </thead>
                <tbody>
                  {receiptData.items.map((item: any, idx: number) => (
                    <tr key={idx} className="border-b border-gray-100 border-dashed">
                      <td className="py-3">
                        <div className="font-bold text-gray-800">{item.name}</div>
                        <div className="text-xs text-gray-500 mt-0.5">مقاس: {item.sizeName}</div>
                      </td>
                      <td className="text-center py-3 font-bold">{item.quantity}</td>
                      <td className="text-left py-3 font-bold">{item.price * item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="border-t-2 border-black pt-3 mb-6">
                <div className="flex justify-between items-center text-lg font-black">
                  <span>الإجمالي المطلوب:</span>
                  <span>{receiptData.total} ر.س</span>
                </div>
                <div className="text-center text-xs text-gray-500 mt-2 font-bold">الأسعار تشمل ضريبة القيمة المضافة 15%</div>
              </div>

              <div className="text-center space-y-2">
                <p className="font-bold text-sm">شكراً لتسوقكم معنا!</p>
                <div className="font-mono text-xs text-gray-400">*** نسخة العميل ***</div>
              </div>
            </div>

            {/* أزرار التحكم (تختفي في الطباعة) */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-3 print:hidden">
              <button onClick={handlePrint} className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors flex justify-center items-center gap-2">
                <Printer className="w-5 h-5"/> طباعة الفاتورة
              </button>
              <button onClick={() => setReceiptData(null)} className="flex-1 bg-white text-gray-700 border border-gray-200 font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors">
                طلب جديد
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}