import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getCategories, getToken, getRole } from '../services/api';
import ChatWidget from './ChatWidget';

export default function ShopPage() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest"); // default sort

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const token = getToken();
        const config = {
          headers: token ? { 'Authorization': `Token ${token}` } : {}
        };
        // Fetch up to 20 products for the 4x5 grid
        const res = await axios.get('http://127.0.0.1:8000/api/products/search/?limit=20', config);
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, []);

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

  // Sorting Logic
  const getSortedProducts = () => {
    let sorted = [...products];
    if (sortBy === "name") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "price") {
      sorted.sort((a, b) => parseFloat(a.official_price) - parseFloat(b.official_price));
    } else if (sortBy === "date") {
      // Assuming a 'created_at' or 'id' available, if not, fallback to id
      sorted.sort((a, b) => (b.created_at || b.id) > (a.created_at || a.id) ? 1 : -1);
    } else if (sortBy === "rating") {
        // Mock rating sort since actual rating is not in API, but shown as fixed 4.9 in cards
        // If rating is added to API later, this will work.
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    return sorted;
  };

  const sortedProducts = getSortedProducts();

  return (
    <div className="bg-[#f6f7f6] font-sans text-slate-900 antialiased min-h-screen flex flex-col">
      {/* --- Header (Shared with Home) --- */}
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
            <button onClick={() => navigate('/shop')} className="text-primary text-sm font-bold transition-colors">Shop</button>
            <button onClick={() => navigate('/home')} className="text-slate-700 text-sm font-medium hover:text-primary transition-colors">Categories</button>
          </nav>
          <div className="flex gap-3">
            <button onClick={handlePersonaClick} className="flex items-center justify-center rounded-xl h-10 w-10 bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all shadow-sm">
              <span className="material-symbols-outlined">person</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* --- Shop Hero Section --- */}
        <div className="relative h-[300px] flex flex-col items-center justify-center overflow-hidden bg-slate-900 mb-8">
            <div className="absolute inset-0 opacity-70">
              <img 
                alt="Agricultural field" 
                className="w-full h-full object-cover" 
                src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=2000"
              />
            </div>
            <div className="relative z-10 flex flex-col gap-4 text-center max-w-3xl px-6">
              <h1 className="text-white text-3xl md:text-5xl font-black leading-tight tracking-tight shadow-sm">
                Find all the <span className="text-lime-400">agriculture products</span> you want Here
              </h1>
              <p className="text-white/90 text-lg font-medium">Explore the widest selection of government-verified farm goods.</p>
            </div>
        </div>

        {/* --- Content Area --- */}
        <div className="max-w-[1440px] mx-auto px-6 md:px-20 pb-20 w-full">
          {/* Sorting Controls */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
              <div className="flex items-center gap-2">
                 <span className="material-symbols-outlined text-primary">filter_list</span>
                 <h2 className="text-xl font-bold text-slate-800 tracking-tight">Our Marketplace</h2>
              </div>
              
              <div className="flex items-center gap-4 bg-white p-2 rounded-xl shadow-sm border border-slate-200">
                <label className="text-sm font-bold text-slate-500 ml-2">Sort by:</label>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-primary/5 text-primary text-sm font-bold px-4 py-2 rounded-lg border-none focus:ring-1 focus:ring-primary outline-none transition-colors cursor-pointer"
                >
                  <option value="newest">Latest Added</option>
                  <option value="name">Product Name (A-Z)</option>
                  <option value="price">Cheapest First</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
          </div>

          {/* Product Grid (4x5) */}
          {loading ? (
             <div className="flex flex-col items-center justify-center py-20">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
               <p className="mt-4 text-slate-500 font-medium font-bold">Refreshing our harvest...</p>
             </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
                {sortedProducts.map((product) => (
                  <div 
                    key={product.id} 
                    className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col cursor-pointer" 
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                      <img 
                        alt={product.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        src={product.image || "https://via.placeholder.com/400x300?text=Product"}
                      />
                      <div className="absolute top-4 left-4 bg-amber-400 text-amber-900 text-[11px] font-black px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg backdrop-blur-sm bg-opacity-90">
                        <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span> 
                        {product.rating ? product.rating.toFixed(1) : "4.9"}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:from-black/40 transition-all duration-300"></div>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-black text-slate-800 leading-tight group-hover:text-primary transition-colors">{product.name}</h3>
                      </div>
                      <p className="text-sm text-slate-500 mb-6 line-clamp-2 leading-relaxed font-medium">
                        {product.description || "Premium quality agricultural product, verified by the local authorities for standard and health safety."}
                      </p>
                      <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
                        <div className="flex flex-col">
                           <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Starting From</span>
                           <span className="text-2xl font-black text-primary">
                             {product.official_price} <span className="text-sm font-bold">DA</span>
                           </span>
                        </div>
                        <button className="bg-primary hover:bg-primary/90 text-white font-bold size-10 rounded-xl transition-all shadow-md flex items-center justify-center active:scale-95">
                          <span className="material-symbols-outlined text-lg">arrow_forward</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {sortedProducts.length === 0 && (
                <div className="text-center py-24 bg-white rounded-[2rem] border border-dashed border-slate-300">
                  <div className="inline-flex items-center justify-center size-20 rounded-full bg-slate-50 mb-6">
                    <span className="material-symbols-outlined text-4xl text-slate-300">agriculture</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">No products found</h3>
                  <p className="text-slate-500 max-w-xs mx-auto">We couldn't find any products in the harvest right now. Please check back later.</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* --- Footer (Shared with Home) --- */}
      <footer className="bg-white border-t border-primary/10 pt-20 pb-10 px-6 md:px-20 mt-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-20">
          <div className="col-span-1 border-r border-slate-100 pr-4">
            <div className="flex items-center gap-3 text-primary mb-8">
              <div className="size-10 flex items-center justify-center bg-primary text-white rounded-xl">
                <span className="material-symbols-outlined text-2xl">agriculture</span>
              </div>
              <h2 className="text-primary text-2xl font-black leading-tight tracking-tight">AgriGov</h2>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-8 font-medium">
              The official platform for government-verified agricultural trade. Empowering farmers and feeding nations since 2026.
            </p>
          </div>
          <div>
            <h4 className="font-black text-slate-800 mb-8 uppercase tracking-widest text-xs">Quick Links</h4>
            <ul className="flex flex-col gap-6 text-sm font-bold text-slate-500">
              <li><button onClick={() => navigate('/home')} className="hover:text-primary transition-colors text-left uppercase text-[11px] tracking-wider">About Us</button></li>
              <li><button onClick={() => navigate('/login')} className="hover:text-primary transition-colors text-left uppercase text-[11px] tracking-wider">Farmer Registration</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-slate-800 mb-8 uppercase tracking-widest text-xs">Support Center</h4>
            <ul className="flex flex-col gap-6 text-sm font-bold text-slate-500">
              <li><button className="hover:text-primary transition-colors text-left uppercase text-[11px] tracking-wider">Help Center</button></li>
              <li><button className="hover:text-primary transition-colors text-left uppercase text-[11px] tracking-wider">Contact Official Support</button></li>
            </ul>
          </div>
        </div>
        <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">
          <p>© 2026 AgriGov Marketplace. Standard Government Protocol v3.1</p>
        </div>
      </footer>
      <ChatWidget role="BUYER" />
    </div>
  );
}
