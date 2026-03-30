import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function CategoryPage() {
  const navigate = useNavigate();
  // Optional route parameter: e.g. /category/fruits -> categoryName = "fruits"
  const { categoryName } = useParams();

  // Create an array of 12 product instances to display 3 rows of 4 products as requested
  const mockProducts = [
    {
      id: 1,
      name: "Premium Gala Apples",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCM_-get8Wg4mUTfkL4PeIf97fQ5A-o6L19Uk9r3B75LPhfC9oYrebx7f2e7a3Q7Dlf1jtLC_usIX_JTO1LQZ89cmEGt6IlPFC85ycrsmmTfGuGLT71Gl2w0_TFZzRhPzLlEKkCAm2maydlwGtnB7vikG0V77beupV4tJxrp39Te0ef89FBNaeMhXiuG76bxEDzcpgzvHTFGkZavdPsJesWoI1yfA9u1n4fAWRUJ54SImXQjnKy_88mOeL5L2FeueSlm6ghBkhvf8k",
      price: "$4.50",
      oldPrice: "$5.25",
      type: "Organic • 2kg",
      rating: 4.5,
      reviews: 128
    },
    {
      id: 2,
      name: "Organic Bananas",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAp3zhbL-yjqSS6CtpR5tREha8AG5AHBGtMFHVFFvx-V2_8jOmPKFwg7kPrXABTRNcZ-zqmgqs3ZzOgf3ZuquihbdBGy1KU57e1a-GFpQ6awroVVWOvaBzmf-O8blgRhUhATRH6tv7nZDqQlAYnZUmnWyv_wJH81pMDFFBktnKaxijrHkqB3xOlfrOYJYjncyF9fsYKL3qrsOPHRqQAtd1HJOu4Q-nsxFtZsLNYCNTywTZHPgoxCTfnHEULHMEAFHJb6p9XDbX0Xfc",
      price: "$2.80",
      type: "Fair Trade • 1 Bunch",
      rating: 5.0,
      reviews: 342
    },
    {
      id: 3,
      name: "Seedless Red Grapes",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA0VYBrxSDrgCXBNVj0EduyhSM6V438tV9yOOsqjtqQV2vIMsOpi22s37fCgfBMg0Ae92wMSHhMxz7JZWVPZJRKzjw8gv9M33lvgldV77GvDepvzMRrTimwKEZm7U9rIwA5OaIfO9Jxo6DAmq-911xf1JhvLB0giwJcw8N8gt_ZgCaTKLHaGxnzkWd_6B0Bdsn7u5IQ0nXt2bKbDDQOcE-6nEHV5Ep0Zqo_L94kkSX-GbtdhugF9Mf59O4m4k8jMPML3O6I0oqhfRU",
      price: "$5.99",
      type: "Freshly Picked • 500g",
      rating: 4.0,
      reviews: 86,
      limited: true
    },
    {
      id: 4,
      name: "Sweet Wild Strawberries",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBsH93oLVsQ7VC-smOewZwDVCAN9jKvCsitrXxi9eSqvDr_CFTsAMRrfoXA80BcjVVuBCBqJjQkKLQTbloCE-KOZcljaQkiROuqcBK95otzgg2-6DUwZS8xo3RNJeJvx2R6HJ2dTjuNuuNUcLvMbgNCt57wd0IlCSilwCcHrv4iy1DrOyIjSOY26sqvZ_57NDu6por1YOAx9SOIduuWxpIfcvpF0pDRvtz_9TKGb9d9oh-1u5yqD3QeijnlkfwoGD4PMB_O35z900Y",
      price: "$6.20",
      type: "Local Farm • 250g",
      rating: 5.0,
      reviews: 215
    },
    {
      id: 5,
      name: "Sun-Ripened Oranges",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAGA0oocnx7ywKKXa5CykfrPnTLqTqjMxxGSzmMQFxrIj73DY7plrkXqXj4IiMldHQhUYfyOKtpjQHsgmit4eC6XeBLr7Tjjdlm2sJTZXdwAg3_IURZTmxq1oxMEl-6_GowAWV8wyJOIZ4aYk_bhkaS-EaTug3me_NBnE66y38YzR8G3vUN92KfkrtKp0YyNzWOawiunU2vhyywgedIxuq9xg8jElDKf5I07G1IPzlXsf66ydhSa2bSufLuB0soZ7YBuduvyLegZOA",
      price: "$3.15",
      type: "Vitamin C Rich • 1kg",
      rating: 4.0,
      reviews: 154
    },
    {
      id: 6,
      name: "Wild Blueberries",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBKGHqe4rYCx8ezj9Cst4lLZl8m9H_bcZKCl7IvceT1h-2ZDWH1Dry-iGY2YThx_xV5HTyWlGtQwtD5alA1Nq-71IqhqXzDpYZyR1c8mU2ZSH6HBLUz51VkL_79wWZqifaDwy68qEpZohTKSUdltgHZ7bwQA0x7aCz3wPK7CT1f8cbDbWwbVNZyEbEZonw0CaSBDWhNHmlws5PYZ6flnVkZ5R2nF1-M916BIibhVkMlihzZjSfWCHoDtSEzIpAPgwv5IOmY60S9pEc",
      price: "$7.50",
      type: "Organic • 150g",
      rating: 5.0,
      reviews: 412
    }
  ];

  // Repeat products to fulfill exactly 12 items for 3 rows of 4
  const displayProducts = [...mockProducts, ...mockProducts];

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
          <div className="hidden md:flex flex-col min-w-64">
            <div className="flex w-full flex-1 items-stretch rounded-xl h-10">
              <div className="text-primary/60 flex border-none bg-primary/5 items-center justify-center pl-4 rounded-l-xl">
                <span className="material-symbols-outlined">search</span>
              </div>
              <input 
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-xl text-slate-900 focus:outline-0 focus:ring-1 focus:ring-primary border-none bg-primary/5 h-full placeholder:text-primary/40 px-4 text-base font-normal outline-none" 
                placeholder="Search for fresh produce..." 
              />
            </div>
          </div>
        </div>
        <div className="flex flex-1 justify-end gap-8 items-center">
          <nav className="hidden lg:flex items-center gap-8">
            <a className="text-slate-700 text-sm font-medium hover:text-primary transition-colors" href="#">Shop</a>
            <a className="text-primary text-sm font-medium transition-colors" href="#">Categories</a>
          </nav>
          <div className="flex gap-3">
            <button onClick={() => navigate('/login')} className="flex items-center justify-center rounded-xl h-10 w-10 bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all shadow-sm">
              <span className="material-symbols-outlined">person</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-6 md:px-20 py-8 w-full flex-1">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <a className="text-primary font-medium text-sm flex items-center gap-1 hover:underline cursor-pointer" onClick={() => navigate('/')}>
            <span className="material-symbols-outlined text-sm">home</span> Home
          </a>
          <span className="material-symbols-outlined text-slate-400 text-sm">chevron_right</span>
          <span className="text-slate-500 text-sm capitalize">{categoryName || 'Fruits'}</span>
        </div>

        {/* Category Title & Hero Banner */}
        <div className="mb-10">
          <h1 className="text-3xl font-black text-slate-900 mb-6 tracking-tight capitalize">{categoryName || 'Fresh Fruits'}</h1>
          <div className="relative w-full h-64 rounded-xl overflow-hidden shadow-lg group">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" 
              style={{ backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.6), transparent), url("https://lh3.googleusercontent.com/aida-public/AB6AXuDGwthv2X-jjPbNSwAJZR0jQ21Qg4WbfUJ_kxBOLpAaKZpfl7j39iRO0P9GBMeLIQ_6giCbUbhmRpK2LkIT1ghjoqD1s5aXVrQjqenqCILGtLahX_HFqhGW6F72UoGXJYXblU9OP7QjlMDDTENPX8rMnr90GUmTPNsiA7Jij0BDAgW12hwhN26nh99c9A3leK4Np9nAA7-Sik4WYE82T7_dfWb8I6JuSvJo9DiuPDm3QLm8nJ7scG0EbXodA-7sln0m8U7WFWQcUYQ")' }}
            ></div>
            <div className="absolute inset-0 flex flex-col justify-center px-12">
              <p className="text-white text-4xl font-bold max-w-md leading-tight">Nature's Finest Selection</p>
              <p className="text-white/80 mt-2 text-lg">Directly from verified local organic farms</p>
            </div>
          </div>
        </div>

        {/* Sorting & Layout Bar */}
        <div className="bg-white p-4 rounded-xl border border-primary/10 shadow-sm mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-slate-500">
            Showing <span className="font-bold text-slate-900">{displayProducts.length}</span> results for "<span className="capitalize">{categoryName || 'Fruits'}</span>"
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Sort by:</span>
              <select className="form-select bg-primary/5 border-none rounded-lg text-base px-4 py-2 font-bold focus:ring-1 focus:ring-primary text-slate-700 outline-none cursor-pointer">
                <option>Price</option>
                <option>Date</option>
                <option>Name</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid (4 columns layout) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayProducts.map((product, idx) => (
            <div key={`${product.id}-${idx}`} className="bg-white rounded-xl overflow-hidden border border-primary/5 hover:border-primary/20 hover:shadow-xl transition-all group flex flex-col cursor-pointer" onClick={() => navigate('/product/' + product.id)}>
              <div className="relative h-56 overflow-hidden bg-slate-100">
                <img 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  src={product.img}
                />
                <div className="absolute top-3 left-3 bg-primary/90 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 backdrop-blur-sm">
                  <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span> VERIFIED FARMER
                </div>
                <button className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white text-rose-500 rounded-full shadow-sm transition-colors opacity-0 group-hover:opacity-100">
                  <span className="material-symbols-outlined text-xl">favorite</span>
                </button>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <p className="text-xs text-primary font-bold uppercase tracking-wider mb-1">{product.type}</p>
                <h3 className="font-bold text-lg text-slate-900 mb-2">{product.name}</h3>
                <div className="flex items-center gap-1 mb-4">
                  <div className="flex text-amber-400">
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>{product.rating === 5.0 ? 'star' : 'star_half'}</span>
                  </div>
                  <span className="text-xs text-slate-400 font-medium select-none">({product.reviews})</span>
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-black text-primary">{product.price}</p>
                  </div>
                  <button className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary/90 transition-all text-sm">
                    Place Order
                  </button>
                </div>
              </div>
            </div>
          ))}
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
