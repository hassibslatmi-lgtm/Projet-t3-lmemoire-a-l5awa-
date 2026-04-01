import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProductsByCategory, getCategoryDetail, getRole } from '../services/api'; 

export default function CategoryPage() {
  const navigate = useNavigate();
  const { categoryName } = useParams(); // هذا هو الـ ID (مثلاً 4)
  const [products, setProducts] = useState([]);
  const [categoryDetail, setCategoryDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        
        // 1. جلب تفاصيل الصنف (الاسم والصورة)
        try {
          const catData = await getCategoryDetail(categoryName);
          setCategoryDetail(catData);
        } catch (err) {
          console.error("Could not fetch category details", err);
        }

        // 2. جلب المنتجات (استعمال الرابط الذي نجح في Postman)
        const prodData = await getProductsByCategory(categoryName);
        setProducts(prodData);

      } catch (error) {
        console.error("Error fetching category products:", error);
      } finally {
        setLoading(false);
      }
    };

    if (categoryName) {
      fetchCategoryData();
    }
  }, [categoryName]);

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
      {/* Header */}
      <header className="flex items-center justify-between border-b border-primary/10 px-6 md:px-20 py-4 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 text-primary cursor-pointer" onClick={() => navigate('/home')}>
            <div className="size-8 flex items-center justify-center bg-primary text-white rounded-lg">
              <span className="material-symbols-outlined">agriculture</span>
            </div>
            <h2 className="text-primary text-xl font-bold leading-tight tracking-tight">AgriGov</h2>
          </div>
        </div>
        <div className="flex gap-6 items-center">
            <button onClick={() => navigate('/home')} className="text-sm font-bold text-slate-600 hover:text-primary">Back to Home</button>
            <button onClick={handlePersonaClick} className="flex items-center justify-center rounded-xl h-10 w-10 bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all shadow-sm">
              <span className="material-symbols-outlined">person</span>
            </button>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-6 md:px-20 py-8 w-full flex-1">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <button className="text-primary font-medium text-sm flex items-center gap-1 hover:underline" onClick={() => navigate('/home')}>
            <span className="material-symbols-outlined text-sm">home</span> Home
          </button>
          <span className="material-symbols-outlined text-slate-400 text-sm">chevron_right</span>
          <span className="text-slate-500 text-sm capitalize">
            {categoryDetail ? categoryDetail.name : 'Category'}
          </span>
        </div>

        {/* Hero Section */}
        <div className="mb-10">
          <h1 className="text-3xl font-black text-slate-900 mb-6 tracking-tight capitalize">
            {categoryDetail ? categoryDetail.name : 'Category Selection'}
          </h1>
          <div className="relative w-full h-64 rounded-2xl overflow-hidden shadow-lg group">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" 
              style={{ 
                backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.2)), url(${categoryDetail?.image || 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&q=80&w=2000'})` 
              }}
            ></div>
            <div className="absolute inset-0 flex flex-col justify-center px-12">
              <p className="text-white text-4xl font-bold max-w-md leading-tight">
                Fresh {categoryDetail ? categoryDetail.name : 'Produce'}
              </p>
              <p className="text-white/80 mt-2 text-lg">
                {categoryDetail?.description || 'Directly from verified local organic farms'}
              </p>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-slate-500 font-medium">Loading fresh products...</p>
          </div>
        ) : (
          <>
            <div className="mb-6 text-sm text-slate-500">
              Found <span className="font-bold text-slate-900">{products.length}</span> products
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div 
                  key={product.id} 
                  className="bg-white rounded-xl overflow-hidden border border-primary/5 hover:border-primary/20 hover:shadow-xl transition-all group flex flex-col cursor-pointer" 
                  onClick={() => navigate('/product/' + product.id)}
                >
                  <div className="relative h-52 overflow-hidden bg-slate-100">
                    <img 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      src={product.image || "https://via.placeholder.com/400x300?text=Product"}
                    />
                    <div className="absolute top-3 left-3 bg-primary/90 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 backdrop-blur-sm">
                      <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span> VERIFIED
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-lg text-slate-900 mb-2">{product.name}</h3>
                    <div className="mt-auto flex items-center justify-between">
                      <p className="text-xl font-black text-primary">{product.official_price} <span className="text-xs uppercase">DA</span></p>
                      <button className="bg-primary/10 text-primary hover:bg-primary hover:text-white font-bold py-2 px-4 rounded-lg transition-all text-xs">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {products.length === 0 && (
              <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
                <span className="material-symbols-outlined text-5xl text-slate-300 mb-4">inventory_2</span>
                <p className="text-slate-500 font-bold">No products available in this category right now.</p>
                <button onClick={() => navigate('/home')} className="mt-4 text-primary font-bold hover:underline">Browse other categories</button>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="bg-white border-t border-primary/10 py-10 px-6 md:px-20 mt-auto text-center text-xs font-bold text-slate-400">
        <p>© 2026 AgriGov Marketplace. All rights reserved.</p>
      </footer>
    </div>
  );
}