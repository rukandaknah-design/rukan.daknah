'use client';
import { useState, useEffect } from 'react';
import { ShoppingCart, User, Search, Menu, Phone, Mail, MapPin, Image as ImageIcon, BookOpen, X, Send, Loader2, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { getStoreData } from './store-actions';

export default function StoreHome() {
  const [data, setData] = useState<{products: any[], categories: any[]}>({ products: [], categories: [] });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [selectedSize, setSelectedSize] = useState<any | null>(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      const result = await getStoreData();
      setData(result);
      setLoading(false);
      const savedCart = localStorage.getItem('store_cart');
      if (savedCart) setCartCount(JSON.parse(savedCart).length);
    };
    loadData();
  }, []);

  const filteredProducts = data.products.filter(p => {
    const matchesSearch = p.name.includes(searchQuery) || p.code.includes(searchQuery);
    const matchesCategory = selectedCategory ? p.categoryId === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const parseImages = (imagesStr: string) => {
    try { return JSON.parse(imagesStr || '[]'); } catch { return []; }
  };

  const addToCart = () => {
    if (!selectedSize) return alert('الرجاء اختيار المقاس أولاً');
    const cartItem = {
      cartItemId: Date.now().toString(),
      productId: selectedProduct.id,
      name: selectedProduct.name,
      price: selectedProduct.price,
      sizeId: selectedSize.id,
      sizeName: selectedSize.size,
      quantity: 1,
      image: parseImages(selectedProduct.images)[0] || null
    };
    const existingCart = JSON.parse(localStorage.getItem('store_cart') || '[]');
    existingCart.push(cartItem);
    localStorage.setItem('store_cart', JSON.stringify(existingCart));
    setCartCount(existingCart.length);
    setSelectedProduct(null);
    setSelectedSize(null);
    alert('تمت الإضافة للسلة بنجاح!');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans flex flex-col selection:bg-sky-200" dir="rtl">
      {/* الهيدر */}
      <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-40 border-b border-sky-100">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-3xl font-black text-sky-600 tracking-tight">متجري<span className="text-sky-400">.</span></Link>
          </div>
          <div className="hidden lg:flex flex-1 max-w-2xl relative group">
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="ابحث عن منتجات، ماركات، أو أكواد..." className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-sky-400 focus:ring-4 focus:ring-sky-100 rounded-2xl py-3 px-6 pr-12 outline-none transition-all" />
            <Search className="w-5 h-5 text-gray-400 absolute right-4 top-3.5" />
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowAuthModal(true)} className="hidden md:flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-sky-600 bg-gray-50 hover:bg-sky-50 px-4 py-2.5 rounded-xl transition-all border border-gray-100">
              <User className="w-5 h-5" /> حسابي
            </button>
            <Link href="/checkout" className="text-white bg-sky-500 p-2.5 px-5 rounded-xl shadow-md shadow-sky-200 hover:bg-sky-600 transition-all relative flex items-center gap-2 font-bold">
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden md:inline">السلة</span>
              {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">{cartCount}</span>}
            </Link>
          </div>
        </div>
      </header>

      {/* البانر */}
      <section className="container mx-auto px-4 mt-6">
        <div className="bg-gradient-to-l from-sky-600 via-sky-500 to-indigo-500 text-white rounded-[2rem] p-10 md:p-20 flex flex-col items-center text-center shadow-xl relative overflow-hidden">
          <h1 className="text-4xl md:text-6xl font-black mb-6 relative z-10">تسوق أحدث التشكيلات   
 بأسعار لا تقبل المنافسة</h1>
          <p className="text-sky-50 text-lg md:text-xl mb-10 max-w-2xl relative z-10 font-medium">اكتشف الجودة العالية والتصاميم العصرية. توصيل سريع لجميع مناطق المملكة.</p>
        </div>
      </section>

      {/* التصنيفات */}
      <section className="container mx-auto px-4 mt-10">
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
          <button onClick={() => setSelectedCategory(null)} className={`flex-shrink-0 px-6 py-3 rounded-2xl font-bold transition-all ${selectedCategory === null ? 'bg-sky-600 text-white' : 'bg-white text-gray-600 border border-gray-100'}`}>الكل</button>
          {data.categories.map(cat => (
            <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`flex-shrink-0 px-6 py-3 rounded-2xl font-bold transition-all ${selectedCategory === cat.id ? 'bg-sky-600 text-white' : 'bg-white text-gray-600 border border-gray-100'}`}>{cat.name}</button>
          ))}
        </div>
      </section>

      {/* المنتجات */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-20 text-sky-600 flex-col gap-4"><Loader2 className="w-12 h-12 animate-spin" /><p className="font-bold">جاري التحميل...</p></div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex justify-center items-center py-20 text-gray-400 flex-col gap-4 bg-white rounded-3xl border border-gray-100"><Search className="w-16 h-16 opacity-50" /><p className="font-bold text-xl">لا توجد منتجات</p></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const images = parseImages(product.images);
              const mainImage = images.length > 0 ? images[0] : null;
              const totalStock = product.sizes?.reduce((sum: number, s: any) => sum + s.stock, 0) || 0;
              const isOutOfStock = totalStock === 0;

              return (
                <div key={product.id} className="bg-white rounded-3xl p-4 shadow-sm hover:shadow-xl hover:shadow-sky-100 transition-all duration-300 border border-gray-100 hover:-translate-y-1 group flex flex-col relative">
                  {isOutOfStock && <div className="absolute top-4 left-4 z-10 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">نفدت الكمية</div>}
                  <div className="bg-gray-50 aspect-square rounded-2xl mb-4 relative overflow-hidden flex items-center justify-center cursor-pointer" onClick={() => setSelectedProduct(product)}>
                    {mainImage ? <img src={mainImage} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <ImageIcon className="w-10 h-10 text-gray-300" />}
                  </div>
                  <div className="text-xs text-sky-600 font-black mb-2 bg-sky-50 w-fit px-2 py-1 rounded-md">{product.category?.name || 'عام'}</div>
                  <h3 className="font-bold text-gray-800 mb-2 text-lg line-clamp-1 cursor-pointer hover:text-sky-600" onClick={() => setSelectedProduct(product)}>{product.name}</h3>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                    <span className="text-2xl font-black text-sky-600">{product.price} <span className="text-sm font-bold text-sky-400">ر.س</span></span>
                    <button onClick={() => setSelectedProduct(product)} className="bg-gray-50 text-gray-600 p-3 rounded-xl hover:bg-sky-500 hover:text-white transition-all shadow-sm"><ShoppingCart className="w-5 h-5" /></button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* المدونة */}
      <section className="bg-white py-16 border-y border-gray-100 mt-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-10">
            <BookOpen className="w-8 h-8 text-sky-500" />
            <h2 className="text-3xl font-black text-gray-800">مدونة المتجر</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="group cursor-pointer">
                <div className="aspect-video rounded-3xl overflow-hidden mb-4 bg-gray-100">
                  <img src={`https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&q=80&random=${i}`} alt="blog" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="text-sm text-sky-500 font-bold mb-2">15 يوليو 2026</div>
                <h3 className="text-xl font-black text-gray-800 mb-2 group-hover:text-sky-600 transition-colors">دليلك الشامل للتسوق الذكي</h3>
                <p className="text-gray-500 font-medium leading-relaxed">نصائح وحيل لاختيار المنتجات المناسبة لك وتوفير المال...</p>
              </div>
             ))}
          </div>
        </div>
      </section>

      {/* تواصل معنا */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-sky-600 rounded-[2rem] p-8 md:p-12 text-white shadow-xl flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-black mb-4">نحن هنا لمساعدتك!</h2>
            <p className="text-sky-100 text-lg mb-8">فريق الدعم الفني متواجد على مدار الساعة لخدمتك.</p>
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl"><Phone className="w-6 h-6 text-sky-200" /><span className="font-bold text-xl" dir="ltr">+966 50 000 0000</span></div>
              <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl"><Mail className="w-6 h-6 text-sky-200" /><span className="font-bold text-lg">support@mystore.com</span></div>
            </div>
          </div>
          <div className="md:w-1/2 w-full">
            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <h3 className="text-xl font-black text-gray-800 mb-4">أرسل رسالة</h3>
              <div className="space-y-4">
                <input type="text" placeholder="الاسم الكريم" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-sky-500 text-gray-800" />
                <input type="text" placeholder="رقم الجوال" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-sky-500 text-gray-800" />
                <textarea placeholder="كيف يمكننا مساعدتك؟" rows={3} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-sky-500 text-gray-800 resize-none"></textarea>
                <button className="w-full bg-sky-600 text-white font-black py-3 rounded-xl hover:bg-sky-700 transition-colors flex justify-center items-center gap-2"><Send className="w-5 h-5" /> إرسال</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* الفوتر */}
      <footer className="bg-white border-t border-gray-100 pt-12 pb-8 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-black text-sky-600 mb-4">متجري<span className="text-sky-400">.</span></h3>
          <p className="text-gray-500 font-medium mb-6 max-w-md mx-auto">الوجهة الأولى للتسوق الإلكتروني. نقدم لك أفضل المنتجات بأعلى جودة وأفضل الأسعار.</p>
          <div className="text-gray-400 font-medium pt-6 border-t border-gray-50">جميع الحقوق محفوظة © 2026</div>
        </div>
      </footer>

      {/* نافذة تفاصيل المنتج */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col md:flex-row">
            <button onClick={() => {setSelectedProduct(null); setSelectedSize(null);}} className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur p-2 rounded-full text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors shadow-sm"><X className="w-6 h-6" /></button>
            <div className="md:w-1/2 bg-gray-50 p-8 flex items-center justify-center min-h-[300px]">
              {parseImages(selectedProduct.images)[0] ? <img src={parseImages(selectedProduct.images)[0]} alt={selectedProduct.name} className="w-full h-full object-contain mix-blend-multiply" /> : <ImageIcon className="w-24 h-24 text-gray-300" />}
            </div>
            <div className="md:w-1/2 p-8 flex flex-col">
              <div className="text-sm text-sky-600 font-black mb-2 bg-sky-50 w-fit px-3 py-1 rounded-lg">{selectedProduct.category?.name || 'عام'}</div>
              <h2 className="text-3xl font-black text-gray-800 mb-2">{selectedProduct.name}</h2>
              <p className="text-gray-500 font-medium mb-6">{selectedProduct.details || 'لا يوجد وصف متاح لهذا المنتج.'}</p>
              <div className="mb-6">
                <h3 className="font-bold text-gray-800 mb-3">اختر المقاس:</h3>
                <div className="flex flex-wrap gap-3">
                  {selectedProduct.sizes.map((s: any) => (
                    <button key={s.id} disabled={s.stock === 0} onClick={() => setSelectedSize(s)} className={`px-4 py-2 rounded-xl font-bold border-2 transition-all ${s.stock === 0 ? 'opacity-50 cursor-not-allowed bg-gray-50 border-gray-200 text-gray-400' : selectedSize?.id === s.id ? 'border-sky-500 bg-sky-50 text-sky-600' : 'border-gray-200 text-gray-600 hover:border-sky-300'}`}>
                      {s.size} {s.stock === 0 && '(نفد)'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
                <span className="text-3xl font-black text-sky-600">{selectedProduct.price} <span className="text-lg font-bold text-sky-400">ر.س</span></span>
                <button onClick={addToCart} className="bg-sky-500 text-white px-8 py-4 rounded-xl font-black hover:bg-sky-600 transition-all shadow-lg shadow-sky-200 flex items-center gap-2"><ShoppingCart className="w-5 h-5"/> أضف للسلة</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* نافذة تسجيل الدخول / إنشاء حساب */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl relative">
            <button onClick={() => setShowAuthModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"><X className="w-6 h-6" /></button>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-sky-100 text-sky-500 rounded-full flex items-center justify-center mx-auto mb-4"><User className="w-8 h-8" /></div>
              <h2 className="text-2xl font-black text-gray-800">{authMode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}</h2>
              <p className="text-gray-500 mt-2 text-sm">مرحباً بك في متجرك المفضل</p>
            </div>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('تم تسجيل الدخول بنجاح!'); setShowAuthModal(false); }}>
              {authMode === 'register' && (
                <input type="text" placeholder="الاسم الكامل" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-sky-500" />
              )}
              <input type="text" placeholder="رقم الجوال" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-sky-500" dir="ltr" />
              <input type="password" placeholder="كلمة المرور" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-sky-500" dir="ltr" />
              <button type="submit" className="w-full bg-sky-600 text-white font-black py-3.5 rounded-xl hover:bg-sky-700 transition-all shadow-lg shadow-sky-200 mt-2">
                {authMode === 'login' ? 'دخول' : 'تسجيل'}
              </button>
            </form>
            <div className="mt-6 text-center text-sm font-bold text-gray-500">
              {authMode === 'login' ? 'ليس لديك حساب؟ ' : 'لديك حساب بالفعل؟ '}
              <button onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} className="text-sky-600 hover:underline">
                {authMode === 'login' ? 'سجل الآن' : 'سجل دخول'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}