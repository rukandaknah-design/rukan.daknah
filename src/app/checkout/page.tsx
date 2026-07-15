'use client';
import { useState, useEffect } from 'react';
import { ShoppingCart, ArrowRight, CheckCircle, Loader2, UploadCloud, MapPin, Phone, User, CreditCard, Banknote } from 'lucide-react';
import Link from 'next/link';
import { submitWebOrder } from './actions';

export default function Checkout() {
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('store_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    setLoading(false);
  }, []);

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (cart.length === 0) return;
    
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    formData.append('cart', JSON.stringify(cart));
    
    await submitWebOrder(formData);
    
    // تفريغ السلة بعد نجاح الطلب
    localStorage.removeItem('store_cart');
    setCart([]);
    setIsSubmitting(false);
    setSuccess(true);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#f0f9ff]"><Loader2 className="w-12 h-12 animate-spin text-sky-500"/></div>;

  // شاشة النجاح
  if (success) {
    return (
      <div className="min-h-screen bg-[#f0f9ff] flex items-center justify-center p-4" dir="rtl">
        <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md w-full text-center animate-in zoom-in duration-300 border border-sky-100">
          <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <CheckCircle className="w-12 h-12" />
          </div>
          <h1 className="text-3xl font-black text-gray-800 mb-4">تم استلام طلبك بنجاح! 🎉</h1>
          <p className="text-gray-500 font-medium mb-8 leading-relaxed">شكراً لتسوقك معنا. طلبك الآن قيد المراجعة، وسنقوم بالتواصل معك قريباً لتأكيد الطلب وتحديد موعد التوصيل.</p>
          <Link href="/" className="bg-sky-500 text-white font-black text-lg py-4 px-8 rounded-xl hover:bg-sky-600 transition-all shadow-lg shadow-sky-200 inline-block w-full">
            العودة للمتجر
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f9ff] font-sans pb-20" dir="rtl">
      {/* الهيدر */}
      <header className="bg-white shadow-sm sticky top-0 z-40 border-b border-sky-100">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="bg-sky-50 text-sky-600 p-2.5 rounded-xl hover:bg-sky-500 hover:text-white transition-all"><ArrowRight className="w-6 h-6"/></Link>
          <h1 className="text-2xl font-black text-gray-800">إتمام الطلب</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 mt-8 max-w-6xl">
        {cart.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-sky-50">
            <ShoppingCart className="w-24 h-24 text-sky-200 mx-auto mb-6" />
            <h2 className="text-3xl font-black text-gray-800 mb-4">سلة المشتريات فارغة</h2>
            <p className="text-gray-500 mb-8 text-lg">لم تقم بإضافة أي منتجات إلى السلة بعد.</p>
            <Link href="/" className="bg-sky-500 text-white font-black py-4 px-10 rounded-xl hover:bg-sky-600 transition-all shadow-lg shadow-sky-200 inline-block">تصفح المنتجات</Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* قسم النماذج (اليمين) */}
            <div className="lg:w-2/3">
              <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
                
                {/* بيانات العميل */}
                <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-sky-50">
                  <h2
className="text-xl font-black text-gray-800 mb-6 flex items-center gap-2"><User className="w-6 h-6 text-sky-500"/> بيانات التوصيل</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">الاسم الكامل *</label>
                      <div className="relative">
                        <User className="w-5 h-5 absolute right-4 top-3.5 text-gray-400" />
                        <input type="text" name="name" required className="w-full bg-gray-50 border border-gray-200 rounded-xl pr-12 pl-4 py-3 outline-none focus:bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-100 transition-all" placeholder="الاسم الثلاثي" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">رقم الجوال *</label>
                      <div className="relative">
                        <Phone className="w-5 h-5 absolute right-4 top-3.5 text-gray-400" />
                        <input type="tel" name="phone" required className="w-full bg-gray-50 border border-gray-200 rounded-xl pr-12 pl-4 py-3 outline-none focus:bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-100 transition-all" placeholder="05xxxxxxxx" dir="ltr" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">عنوان التوصيل بالتفصيل *</label>
                      <div className="relative">
                        <MapPin className="w-5 h-5 absolute right-4 top-3.5 text-gray-400" />
                        <input type="text" name="address" required className="w-full bg-gray-50 border border-gray-200 rounded-xl pr-12 pl-4 py-3 outline-none focus:bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-100 transition-all" placeholder="المدينة، الحي، الشارع، رقم المبنى" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* طرق الدفع */}
                <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-sky-50">
                  <h2 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-2"><CreditCard className="w-6 h-6 text-sky-500"/> طريقة الدفع</h2>
                  <div className="space-y-4">
                    <label className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'cash' ? 'border-sky-500 bg-sky-50' : 'border-gray-100 hover:border-sky-200'}`}>
                      <input type="radio" name="paymentMethod" value="cash" checked={paymentMethod === 'cash'} onChange={() => setPaymentMethod('cash')} className="w-5 h-5 text-sky-600" />
                      <div className="flex-1">
                        <div className="font-bold text-gray-800 flex items-center gap-2"><Banknote className="w-5 h-5 text-green-500"/> الدفع عند الاستلام</div>
                        <div className="text-sm text-gray-500 mt-1">ادفع نقداً أو بالشبكة لمندوب التوصيل</div>
                      </div>
                    </label>

                    <label className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'transfer' ? 'border-sky-500 bg-sky-50' : 'border-gray-100 hover:border-sky-200'}`}>
                      <input type="radio" name="paymentMethod" value="transfer" checked={paymentMethod === 'transfer'} onChange={() => setPaymentMethod('transfer')} className="w-5 h-5 text-sky-600" />
                      <div className="flex-1">
                        <div className="font-bold text-gray-800 flex items-center gap-2"><CreditCard className="w-5 h-5 text-sky-500"/> تحويل بنكي</div>
                        <div className="text-sm text-gray-500 mt-1">قم بالتحويل لحساب المؤسسة وارفق الإيصال</div>
                      </div>
                    </label>
                  </div>

                  {/* تفاصيل التحويل البنكي */}
                  {paymentMethod === 'transfer' && (
                    <div className="mt-6 p-6 bg-gray-50 rounded-2xl border border-gray-200 animate-in slide-in-from-top-2">
                      <h3 className="font-bold text-gray-800 mb-4">بيانات الحساب البنكي:</h3>
                      <div className="space-y-2 mb-6 text-sm font-medium text-gray-600">
                        <div className="flex justify-between bg-white p-3 rounded-lg border border-gray-100"><span>البنك:</span> <span className="font-bold text-gray-800">مصرف الراجحي</span></div>
                        <div className="flex justify-between bg-white p-3 rounded-lg border border-gray-100"><span>اسم الحساب:</span> <span className="font-bold text-gray-800">مؤسسة متجري للتجارة</span></div>
                        <div className="flex justify-between bg-white p-3 rounded-lg border border-gray-100"><span>رقم الحساب:</span> <span className="font-bold text-gray-800 font-mono">123456789012345</span></div>
                        <div className="flex justify-between bg-white p-3 rounded-lg border border-gray-100"><span>الآيبان (IBAN):</span> <span className="font-bold text-gray-800 font-mono">SA0000000000000000000000</span></div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">إرفاق صورة الإيصال *</label>
                        <div className="border-2 border-dashed border-sky-200 rounded-xl p-6 text-center bg-white hover:bg-sky-50 transition-colors relative">
                          <input type="file" name="receipt" required accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                          <UploadCloud className="w-8 h-8 text-sky-400 mx-auto mb-2" />
                          <p className="text-sm font-bold text-sky-600">اضغط هنا لرفع صورة الإيصال</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </form>
            </div>

            {/* ملخص الطلب (اليسار) */}
            <div className="lg:w-1/3">
              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-sky-50 sticky top-24">
                <h2 className="text-xl font-black text-gray-800 mb-6">ملخص الطلب</h2>
                
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
                  {cart.map(item => (
                    <div key={item.cartItemId} className="flex gap-4 items-center border-b border-gray-50 pb-4">
                      <div className="w-16 h-16 bg-gray-50 rounded-xl border border-gray-100 overflow-hidden flex-shrink-0">
                        {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">صورة</div>}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800 text-sm line-clamp-1">{item.name}</h3>
                        <div className="text-xs text-gray-500 mt-1">مقاس: {item.sizeName} | الكمية: {item.quantity}</div>
                        <div className="font-black text-sky-600 mt-1">{item.price * item.quantity} ر.س</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-3 mb-6">
                  <div className="flex justify-between text-gray-500 font-medium"><span>المجموع الفرعي</span> <span>{total} ر.س</span></div>
                  <div className="flex justify-between text-gray-500 font-medium"><span>رسوم التوصيل</span> <span className="text-green-500 font-bold">مجاناً</span></div>
                  <div className="flex justify-between text-xl font-black text-gray-800 pt-3 border-t border-gray-100">
                    <span>الإجمالي المطلوب</span>
                    <span className="text-sky-600">{total} ر.س</span>
                  </div>
                </div>

                <button 
                  type="submit" 
                  form="checkout-form"
                  disabled={isSubmitting}
                  className="w-full bg-sky-500 text-white font-black text-xl py-4 rounded-2xl hover:bg-sky-600 transition-all shadow-lg shadow-sky-200 disabled:opacity-50 disabled:shadow-none flex justify-center items-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin"/> : <><CheckCircle className="w-6 h-6"/> تأكيد الطلب</>}
                </button>
                <p className="text-center text-xs text-gray-400 mt-4 font-medium">بالضغط على تأكيد الطلب، أنت توافق على الشروط والأحكام.</p>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}