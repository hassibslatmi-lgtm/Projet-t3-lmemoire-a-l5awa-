import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { request, createOrder } from '../services/api'; // استيراد الدوال التي أضفناها لـ api.js

export default function PaymentPage() {
  const navigate = useNavigate();
  const { productId } = useParams(); // تأكد أن الاسم في App.js هو productId

  // حالة المنتج (سنأتي بها من السيرفر)
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [shippingAddress, setShippingAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  const shippingFee = 0; // يمكنك تعديلها أو تركها 0 لأن السعر الرسمي غالباً لا يشمل الشحن

  // 1. جلب بيانات المنتج الحقيقية عند فتح الصفحة
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const data = await request(`/api/products/products/${productId}/`);
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setFetchLoading(false);
      }
    };
    if (productId) fetchProductData();
  }, [productId]);

  // الحسابات
  const subtotal = product ? (quantity * product.official_price) : 0;
  const total = subtotal + shippingFee;

  const handleConfirmOrder = async () => {
    // التحقق من البيانات
    if (!quantity || quantity < 1) {
      alert("Please enter a valid quantity.");
      return;
    }
    if (!shippingAddress.trim() || !phoneNumber.trim()) {
      alert("Please fill in your delivery information.");
      return;
    }

    setLoading(true);
    try {
      // 2. إرسال الطلب للـ Backend (الدالة التي أضفناها في api.js)
      const res = await createOrder({
        product_id: productId,
        quantity: quantity,
        address: shippingAddress,
        phone: phoneNumber
      });

      // 3. التوجه لرابط شارجيلي للدفع
      if (res.checkout_url) {
        window.location.href = res.checkout_url;
      } else {
        alert("Success! Order placed, but no payment link received.");
        navigate('/buyer');
      }
    } catch (err) {
      console.error("Order error:", err);
      alert(err.data?.error || "Failed to place order. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) return <div className="p-20 text-center font-bold">Loading order details...</div>;
  if (!product) return <div className="p-20 text-center font-bold text-red-500">Product not found!</div>;

  return (
    <div className="bg-[#f6f7f6] font-sans text-slate-900 antialiased min-h-screen flex flex-col">
      {/* ---------------- HEADER ---------------- */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-primary/10 px-6 md:px-20 py-4 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 text-primary cursor-pointer" onClick={() => navigate('/home')}>
            <div className="size-8 flex items-center justify-center bg-primary text-white rounded-lg">
              <span className="material-symbols-outlined">agriculture</span>
            </div>
            <h2 className="text-primary text-xl font-bold leading-tight tracking-[-0.015em]">AgriGov</h2>
          </div>
        </div>
        <div className="flex flex-1 justify-end gap-8 items-center">
          <div className="flex gap-3">
            <button onClick={() => navigate(-1)} className="text-sm font-bold text-slate-500">Back</button>
          </div>
        </div>
      </header>

      <main className="flex-grow px-4 md:px-10 lg:px-40 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-black mb-6">Complete Your Purchase</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <section className="bg-white p-6 lg:rounded-lg shadow-sm border border-primary/5">
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-primary">local_shipping</span>
                  <h3 className="text-xl font-bold">Delivery Information</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-semibold mb-2">Quantity</label>
                    <input 
                      type="number" 
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                      className="w-full bg-slate-50 border-slate-200 lg:rounded-lg py-3 px-4 focus:ring-primary focus:border-primary outline-none transition-all" 
                    />
                  </div>
                  
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-semibold mb-2">Phone Number</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <span className="material-symbols-outlined text-[18px]">call</span>
                      </span>
                      <input 
                        type="tel" 
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full bg-slate-50 border-slate-200 lg:rounded-lg py-3 pl-10 pr-4 focus:ring-primary focus:border-primary outline-none transition-all" 
                        placeholder="05XX XX XX XX"
                      />
                    </div>
                  </div>
                  
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-semibold mb-2">Shipping Address</label>
                    <textarea 
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      className="w-full bg-slate-50 border-slate-200 lg:rounded-lg py-3 px-4 focus:ring-primary focus:border-primary outline-none transition-all resize-none" 
                      placeholder="Your full address..." 
                      rows="3"
                    ></textarea>
                  </div>
                </div>
              </section>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white p-6 lg:rounded-lg shadow-sm border border-primary/5 sticky top-24">
                <h3 className="text-xl font-bold mb-6">Order Summary</h3>
                
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                    <div 
                        className="w-16 h-16 rounded-lg bg-cover bg-center border border-slate-200 shrink-0"
                        style={{ backgroundImage: `url("${product.image}")` }}
                    ></div>
                    <div>
                        <h4 className="font-bold text-slate-800 text-sm">{product.name}</h4>
                        <p className="text-primary font-medium text-sm mt-1">{product.official_price} <span className="text-slate-400 text-xs">DA per unit</span></p>
                    </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal ({quantity} items)</span>
                    <span className="font-medium">{subtotal.toFixed(2)} DA</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Shipping Fee</span>
                    <span className="font-medium">{shippingFee.toFixed(2)} DA</span>
                  </div>
                  <div className="h-px bg-slate-100 my-2"></div>
                  <div className="flex justify-between text-xl font-black">
                    <span>Total</span>
                    <span className="text-primary">{total.toFixed(2)} DA</span>
                  </div>
                </div>

                <div className="bg-primary/5 p-4 lg:rounded-lg mb-6 flex gap-3">
                  <span className="material-symbols-outlined text-primary text-sm mt-0.5">security</span>
                  <p className="text-xs text-slate-600 leading-relaxed">Secure Payment via Chargily. You will be redirected to the payment gateway.</p>
                </div>

                <button 
                  onClick={handleConfirmOrder}
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 lg:rounded-lg transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>{loading ? "Processing..." : "Pay with Card / CIB"}</span>
                  {!loading && <span className="material-symbols-outlined">payments</span>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-primary/10 pt-16 pb-10 px-6 md:px-20 mt-auto text-center text-xs font-bold text-slate-400">
        <p>© 2026 AgriGov Marketplace. All rights reserved.</p>
      </footer>
    </div>
  );
}