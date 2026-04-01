import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// استيراد الدوال والمساعدات من ملف api.js الخاص بك
import { getCategories, getToken, getRole } from '../services/api'; 

export default function HomePage() {
  const navigate = useNavigate();

  // 1. States لتخزين البيانات
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // 2. جلب البيانات عند تحميل الصفحة
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken(); // جلب التوكن 'agrigov_token'

        // إذا لم يوجد توكن، يمكنك توجيه المستخدم للـ Login
        if (!token) {
          console.warn("No token found, redirecting to login...");
          navigate('/login');
          return;
        }

        const config = {
          headers: { 'Authorization': `Token ${token}` }
        };

        // جلب الأصناف باستخدام الدالة الجاهزة
        const categoriesData = await getCategories();
        setCategories(categoriesData);

        // جلب المنتجات (آخر 4) 
        const prodRes = await axios.get('http://127.0.0.1:8000/api/products/search/?limit=4', config);
        setFeaturedProducts(prodRes.data);

      } catch (error) {
        console.error("Error fetching data:", error);
        // إذا انتهت صلاحية التوكن (401)، ارجع لصفحة اللوڨن
        if (error.response && error.response.status === 401) {
          navigate('/login');
        }
      }
    };
    fetchData();
  }, [navigate]);

  // 3. دالة البحث العامة (عند الضغط على Enter)
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/search?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handlePersonaClick = () => {
    const role = getRole();
    if (role === 'ministry') {
      navigate('/admin');
    } else if (role === 'farmer') {
      navigate('/farmer/dashboard');
    } else if (role === 'buyer') {
      navigate('/buyer');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="bg-[#f6f7f6] font-sans text-slate-900 antialiased min-h-screen flex flex-col">
      {/* --- Header --- */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-primary/10 px-6 md:px-20 py-4 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 text-primary cursor-pointer" onClick={() => navigate('/home')}>
            <div className="size-8 flex items-center justify-center bg-primary text-white rounded-lg">
              <span className="material-symbols-outlined">agriculture</span>
            </div>
            <h2 className="text-primary text-xl font-bold leading-tight tracking-[-0.015em]">AgriGov</h2>
          </div>
          <div className="hidden md:flex flex-col min-w-64">
            <form onSubmit={handleSearch} className="flex w-full flex-1 items-stretch rounded-xl h-10">
              <button type="submit" className="text-primary/60 flex border-none bg-primary/5 items-center justify-center pl-4 rounded-l-xl hover:bg-primary/10 transition-colors cursor-pointer">
                <span className="material-symbols-outlined">search</span>
              </button>
              <input 
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-xl text-slate-900 focus:outline-0 focus:ring-1 focus:ring-primary border-none bg-primary/5 h-full placeholder:text-primary/40 px-4 text-base font-normal outline-none" 
                placeholder="Search for fresh produce..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>
        </div>
        <div className="flex flex-1 justify-end gap-8 items-center">
          <nav className="hidden lg:flex items-center gap-8">
            <button onClick={() => navigate('/shop')} className="text-slate-700 text-sm font-medium hover:text-primary transition-colors">Shop</button>
            <a className="text-slate-700 text-sm font-medium hover:text-primary transition-colors" href="#categories">Categories</a>
          </nav>
          <div className="flex gap-3">
            <button onClick={handlePersonaClick} className="flex items-center justify-center rounded-xl h-10 w-10 bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all shadow-sm">
              <span className="material-symbols-outlined">person</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* --- Hero Section --- */}
        <div className="px-4 md:px-20 py-6">
          <div className="relative min-h-[520px] flex flex-col items-center justify-center overflow-hidden rounded-xl bg-slate-900">
            <div className="absolute inset-0 opacity-60">
              <img 
                alt="Lush green farm field" 
                className="w-full h-full object-cover" 
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=2000"
              />
            </div>
            <div className="relative z-10 flex flex-col gap-6 text-center max-w-3xl px-6">
              <h1 className="text-white text-4xl md:text-6xl font-black leading-tight tracking-tight">
                Quality Farm Products, <span className="text-lime-400">Government Verified</span>
              </h1>
              <p className="text-white/90 text-lg md:text-xl font-normal max-w-xl mx-auto">
                Connecting you directly with trusted local farmers for the freshest, certified organic produce.
              </p>
              <div className="mt-4">
                <button onClick={() => navigate('/shop')} className="bg-primary hover:bg-primary/90 text-white px-10 py-4 rounded-xl text-lg font-bold transition-all shadow-lg hover:shadow-primary/20">
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- Trust Section --- */}
        <div className="px-4 md:px-20 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center gap-4 p-6 bg-white rounded-xl shadow-sm border border-primary/5">
            <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-3xl">verified_user</span>
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-800">Government Verified</h3>
              <p className="text-sm text-slate-500">Every farmer is strictly audited</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-6 bg-white rounded-xl shadow-sm border border-primary/5">
            <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-3xl">local_shipping</span>
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-800">Direct from Farmers</h3>
              <p className="text-sm text-slate-500">No middlemen, fair pricing</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-6 bg-white rounded-xl shadow-sm border border-primary/5">
            <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-3xl">security</span>
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-800">Official Pricing</h3>
              <p className="text-sm text-slate-500">Safe transactions guaranteed</p>
            </div>
          </div>
        </div>

        {/* --- Categories Grid --- */}
        <div id="categories" className="px-4 md:px-20 py-10">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-slate-800">Browse Categories</h2>
              <p className="text-slate-500">Explore our wide selection of agricultural goods</p>
            </div>
            <button onClick={() => navigate('/shop')} className="text-primary font-bold hover:underline">View All</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((cat) => (
              <div 
                key={cat.id} 
                className="group flex flex-col gap-3 cursor-pointer" 
                onClick={() => navigate(`/category/${cat.id}`)} // تم تعديل المسار ليوجهك لصفحة الصنف مباشرة بالـ ID
              >
                <div className="w-full aspect-square overflow-hidden rounded-xl bg-slate-100">
                  <img 
                    alt={cat.name} 
                    className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                    src={cat.image || "https://via.placeholder.com/300?text=Agri"}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 group-hover:text-primary transition-colors">{cat.name}</h3>
                  <p className="text-sm text-slate-500 line-clamp-1">{cat.description || "Fresh seasonal picks"}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- Featured Products --- */}
        <div className="px-4 md:px-20 py-10 bg-primary/5 border-t border-primary/10">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-slate-800">Best Rating Products</h2>
              <p className="text-slate-500">Verified top-tier products chosen by our community</p>
            </div>
            <button onClick={() => navigate('/shop')} className="text-primary font-bold hover:underline">See All</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div 
                key={product.id} 
                className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all group flex flex-col cursor-pointer" 
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  <img 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    src={product.image || "https://via.placeholder.com/400x300?text=Product"}
                  />
                  <div className="absolute top-3 left-3 bg-amber-400 text-amber-900 text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                    <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span> 4.9
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-slate-800 mb-1">{product.name}</h3>
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2">{product.description}</p>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-2xl font-black text-primary">
                      {product.official_price} <span className="text-xs font-bold text-slate-400">DA</span>
                    </span>
                    <button className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary/90 transition-all text-sm">
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* --- Footer --- */}
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
          </div>
          <div>
            <h4 className="font-bold text-slate-800 mb-6 uppercase tracking-wider text-xs">Quick Links</h4>
            <ul className="flex flex-col gap-4 text-sm font-medium text-slate-500">
              <li><button onClick={() => navigate('/home')} className="hover:text-primary transition-colors text-left">About Us</button></li>
              <li><button onClick={() => navigate('/login')} className="hover:text-primary transition-colors text-left">Farmer Registration</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-800 mb-6 uppercase tracking-wider text-xs">Support</h4>
            <ul className="flex flex-col gap-4 text-sm font-medium text-slate-500">
              <li><button className="hover:text-primary transition-colors text-left">Help Center</button></li>
              <li><button className="hover:text-primary transition-colors text-left">Contact Support</button></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-slate-400">
          <p>© 2026 AgriGov Marketplace. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}