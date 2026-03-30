import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function PaymentPage() {
  const navigate = useNavigate();
  const { productId } = useParams();

  // Mock product data based on ID (or fallback)
  const product = {
    id: productId || '1',
    name: 'Raw Wildflower Honey',
    pricePerPiece: 8.75,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmQmY7sm_OTojHO4cWRX8rmsfYF-uTsym8XYyNsCv99mKF-XnYxXwl3Er3AMqRWzFdQu8E_16G3XXr2d-h0D0ugfUJbieyh4iHgTPs-0IzRXP-Dt92Xi4Tw10gTzMjpNjnPG5Sz0WMt7EJMz0_kRGJEiSnKFM0SEcBYl3UkeQqsiulJRnWQKBxOTgcMFVBKfCTge9xJ9vN_RvKvWnrodk--jZvYD206vqHB6z67vlg3sP_sivZq4wVMTfelJoBxVrGrXkLJR0AZ7E'
  };

  const [quantity, setQuantity] = useState(1);
  const [shippingAddress, setShippingAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const shippingFee = 12.50;
  // Calculate total: (quantity * pricePerPiece) + shippingFee
  const subtotal = quantity * product.pricePerPiece;
  const total = subtotal + shippingFee;

  const handleConfirmOrder = () => {
    // Basic validation
    if (!quantity || quantity < 1) {
      alert("Please enter a valid quantity.");
      return;
    }
    if (!shippingAddress.trim() || !phoneNumber.trim()) {
      alert("Please fill in your delivery information.");
      return;
    }

    // Since we are not doing a real backend integration yet, just simulate success and go to buyer dashboard
    alert("Order confirmed successfully!");
    navigate('/buyer');
  };

  return (
    <div className="bg-[#f6f7f6] font-sans text-slate-900 antialiased min-h-screen flex flex-col">
      {/* ---------------- HEADER (Same as HomePage) ---------------- */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-primary/10 px-6 md:px-20 py-4 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 text-primary cursor-pointer" onClick={() => navigate('/')}>
            <div className="size-8 flex items-center justify-center bg-primary text-white rounded-lg">
              <span className="material-symbols-outlined">agriculture</span>
            </div>
            <h2 className="text-primary text-xl font-bold leading-tight tracking-[-0.015em]">AgriGov</h2>
          </div>
        </div>
        <div className="flex flex-1 justify-end gap-8 items-center">
          <nav className="hidden lg:flex items-center gap-8">
            <a className="text-slate-700 text-sm font-medium hover:text-primary transition-colors" href="#">Shop</a>
            <a className="text-primary text-sm font-medium transition-colors cursor-pointer" onClick={() => navigate('/category')}>Categories</a>
          </nav>
          <div className="flex gap-3">
            <button onClick={() => navigate('/login')} className="flex items-center justify-center rounded-xl h-10 w-10 bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all shadow-sm">
              <span className="material-symbols-outlined">person</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow px-4 md:px-10 lg:px-40 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Page Title */}
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-black mb-6">Complete Your Purchase</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Delivery Information */}
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
                      placeholder="Enter quantity"
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
                        placeholder="0555-012345"
                      />
                    </div>
                  </div>
                  
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-semibold mb-2">Shipping Address</label>
                    <textarea 
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      className="w-full bg-slate-50 border-slate-200 lg:rounded-lg py-3 px-4 focus:ring-primary focus:border-primary outline-none transition-all resize-none" 
                      placeholder="123 Farm Road, Green Valley, AG 45678" 
                      rows="3"
                    ></textarea>
                  </div>
                </div>
              </section>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 lg:rounded-lg shadow-sm border border-primary/5 sticky top-24">
                <h3 className="text-xl font-bold mb-6">Order</h3>
                
                {/* Product Detail in Order */}
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                    <div 
                        className="w-16 h-16 rounded-lg bg-cover bg-center border border-slate-200 shrink-0"
                        style={{ backgroundImage: `url("${product.img}")` }}
                    ></div>
                    <div>
                        <h4 className="font-bold text-slate-800 text-sm">{product.name}</h4>
                        <p className="text-primary font-medium text-sm mt-1">${product.pricePerPiece.toFixed(2)} <span className="text-slate-400 text-xs">per piece</span></p>
                    </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal ({quantity} items)</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Shipping Fee</span>
                    <span className="font-medium">${shippingFee.toFixed(2)}</span>
                  </div>
                  
                  <div className="h-px bg-slate-100 my-2"></div>
                  
                  <div className="flex justify-between text-xl font-black">
                    <span>Total</span>
                    <span className="text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="bg-primary/5 p-4 lg:rounded-lg mb-6 flex gap-3">
                  <span className="material-symbols-outlined text-primary text-sm mt-0.5">info</span>
                  <p className="text-xs text-slate-600 leading-relaxed">Cash on delivery. By confirming, you agree to AgriGov's terms of service and delivery policies.</p>
                </div>

                <button 
                  onClick={handleConfirmOrder}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 lg:rounded-lg transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                >
                  <span>Confirm Order</span>
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
                
                <button 
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="w-full mt-4 text-slate-500 font-medium py-2 text-sm hover:text-primary transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span> Return to Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ---------------- FOOTER (Same as HomePage) ---------------- */}
      <footer className="bg-white border-t border-primary/10 pt-16 pb-10 px-6 md:px-20 mt-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <div className="col-span-1 border-r border-slate-100 pr-4">
            <div className="flex items-center gap-3 text-primary mb-6">
              <div className="size-8 flex items-center justify-center bg-primary text-white rounded-lg">
                <span className="material-symbols-outlined">agriculture</span>
              </div>
              <h2 className="text-primary text-xl font-bold leading-tight">AgriGov</h2>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-6 font-medium">
              The official platform for government-verified agricultural trade. Empowering farmers and feeding nations since 2026.
            </p>
            <div className="flex gap-4">
              <a className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all" href="#">
                <span className="material-symbols-outlined text-base">share</span>
              </a>
              <a className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all" href="#">
                <span className="material-symbols-outlined text-base">mail</span>
              </a>
              <a className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all" href="#">
                <span className="material-symbols-outlined text-base">call</span>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-800 mb-6 uppercase tracking-wider text-xs">Quick Links</h4>
            <ul className="flex flex-col gap-4 text-sm font-medium text-slate-500">
              <li><a className="hover:text-primary transition-colors" href="#">About Us</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Farmer Registration</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Verification Process</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Marketplace Rules</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-800 mb-6 uppercase tracking-wider text-xs">Support</h4>
            <ul className="flex flex-col gap-4 text-sm font-medium text-slate-500">
              <li><a className="hover:text-primary transition-colors" href="#">Help Center</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Shipping Info</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Returns & Refunds</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Contact Support</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-slate-400">
          <p>© 2026 AgriGov Marketplace. All rights reserved.</p>
          <div className="flex gap-6">
            <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
            <a className="hover:text-primary transition-colors" href="#">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
