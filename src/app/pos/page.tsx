'use client';
import { useState, useEffect } from 'react';
import { ShoppingCart, Printer, Plus, Minus, Trash2, CheckCircle, Search } from 'lucide-react';

export default function POS() {
  const [products, setProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastOrder, setLastOrder] = useState<any>(null);

  // جلب المنتجات (وهمية للتجربة، سيتم ربطها بالداتا بيز لاحقاً)
  useEffect(() => {
    setProducts([
      { id: 1, name: 'منتج تجريبي 1', price: 50, code: '1001' },
      { id: 2, name: 'منتج تجريبي 2', price: 120, code: '1002' },
      { id: 3, name: 'منتج تجريبي 3', price: 15, code: '1003' },
    ]);
  }, []);

  const addToCart = (product: any) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const order = {
      id: Math.floor(Math.random() * 1000000),
      date: new Date().toLocaleString('ar-SA'),
      items: [...cart],
      total: total
    };
    setLastOrder(order);
    setShowReceipt(true);
    setCart([]);
  };

  const printReceipt = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {/* واجهة الكاشير (تختفي عند الطباعة) */}
      <div className="flex-1 flex print:hidden">
        {/* قسم المنتجات */}
        <div className="flex-1 p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-black text-sky-600">نظام الكاشير (POS)</h1>
            <div className="relative w-1/2">
              <input 
                type="text" 
                placeholder="ابحث بالاسم أو الكود..." 
                className="w-full p-3 pr-10 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-400 outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="absolute right-3 top-3.5 text-gray-400 w-5 h-5" />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 overflow-y-auto pr-2">
            {products.filter(p => p.name.includes(search) || p.code.includes(search)).map(product => (
              <button 
                key={product.id} 
                onClick={() => addToCart(product)}
                className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:border-sky-400 hover:shadow-md transition-all flex flex-col items-center gap-2"
              >
                <div className="w-16 h-16 bg-sky-50 rounded-full flex items-center justify-center text-sky-500 font-bold text-xl">
                  {product.name.charAt(0)}
                </div>
                <span className="font-bold text-gray-800 text-center">{product.name}</span>
                <span className="text-sky-600 font-black">{product.price} ر.س</span>
              </button>
            ))}
          </div>
        </div>

        {/* قسم السلة */}
        <div className="w-96 bg-white shadow-xl flex flex-col border-r border-gray-100">
          <div className="p-6 border-b border-gray-100 bg-sky-50/50">
            <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
              <ShoppingCart className="text-sky-500" /> سلة الطلبات
            </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 text-sm">{item.name}</h3>
                  <p className="text-sky-600 font-bold text-sm">{item.price * item.qty} ر.س</p>
                </div>
                <div className="flex items-center gap-3 bg-white rounded-lg p-1 shadow-sm border border-gray-200">
                  <button onClick={() => setCart(cart.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i))} className="text-green-500 hover:bg-green-50 p-1 rounded"><Plus className="w-4 h-4" /></button>
                  <span className="font-bold w-4 text-center">{item.qty}</span>
                  <button onClick={() => item.qty > 1 ? setCart(cart.map(i => i.id === item.id ? { ...i, qty: i.qty - 1 } : i)) : setCart(cart.filter(i => i.id !== item.id))} className="text-red-500 hover:bg-red-50 p-1 rounded"><Minus className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
            {cart.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-3 pt-20">
                <ShoppingCart className="w-16 h-16 opacity-20" />
                <p>السلة فارغة</p>
              </div>
            )}
          </div>

          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600 font-bold">الإجمالي:</span>
              <span className="text-3xl font-black text-sky-600">{total} <span className="text-lg">ر.س</span></span>
            </div>
            <button 
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className="w-full bg-sky-500 hover:bg-sky-600 disabled:bg-gray-300 text-white font-black py-4 rounded-xl shadow-lg shadow-sky-200 transition-all flex justify-center items-center gap-2"
            >
              <CheckCircle className="w-6 h-6" /> دفع وإصدار الفاتورة
            </button>
          </div>
        </div>
      </div>

      {/* نافذة الفاتورة (تظهر فقط عند الدفع، وتكون الوحيدة الظاهرة عند الطباعة) */}
      {showReceipt && lastOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 print:bg-white print:backdrop-blur-none">
          <div className="bg-white w-full max-w-sm p-8 rounded-3xl shadow-2xl print:shadow-none print:p-0 print:max-w-full">
            
            {/* تصميم الفاتورة الحرارية */}
            <div id="receipt" className="text-center border-b-2 border-dashed border-gray-300 pb-6 mb-6 print:border-none">
              <h2 className="text-2xl font-black text-gray-800 mb-1">متجري.</h2>
              <p className="text-gray-500 text-sm mb-4">رقم ضريبي: 300000000000003</p>
              <div className="flex justify-between text-sm text-gray-600 border-y border-gray-200 py-2 mb-4">
                <span>رقم الطلب: #{lastOrder.id}</span>
                <span>{lastOrder.date}</span>
              </div>
              
              <table className="w-full text-sm mb-4">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-right py-2">الصنف</th>
                    <th className="text-center py-2">الكمية</th>
                    <th className="text-left py-2">السعر</th>
                  </tr>
                </thead>
                <tbody>
                  {lastOrder.items.map((item: any, index: number) => (
                    <tr key={index}>
                      <td className="text-right py-2 font-bold text-gray-800">{item.name}</td>
                      <td className="text-center py-2">{item.qty}</td>
                      <td className="text-left py-2">{item.price * item.qty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <div className="flex justify-between items-center text-lg font-black text-gray-800 pt-4 border-t border-gray-800">
                <span>الإجمالي الشامل:</span>
                <span>{lastOrder.total} ر.س</span>
              </div>
              <p className="text-center text-gray-500 text-sm mt-6">شكراً لتسوقكم معنا!</p>
            </div>

            {/* أزرار التحكم (تختفي عند الطباعة) */}
            <div className="flex gap-3 print:hidden">
              <button onClick={printReceipt} className="flex-1 bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 rounded-xl flex justify-center items-center gap-2 transition-all">
                <Printer className="w-5 h-5" /> طباعة الفاتورة
              </button>
              <button onClick={() => setShowReceipt(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 rounded-xl transition-all">
                طلب جديد
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}