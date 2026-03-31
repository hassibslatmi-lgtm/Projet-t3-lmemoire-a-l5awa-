import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { getToken } from '../services/api'; // استيراد التوكن من ملفك

export default function ProductDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newReviewRating, setNewReviewRating] = useState(0);
  const [newReviewText, setNewReviewText] = useState('');
  const [reviews, setReviews] = useState([]);

  const handleSubmitReview = () => {
    if (!newReviewText.trim()) return;
    const newReview = {
      id: Date.now(),
      rating: newReviewRating || 5,
      text: newReviewText,
      author: 'Current User',
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    };
    setReviews([newReview, ...reviews]);
    setNewReviewText('');
    setNewReviewRating(0);
  };

  // جلب بيانات المنتج من السيرفر
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = getToken();
        const config = {
          headers: { 'Authorization': `Token ${token}` }
        };
        // نعيطو للـ API تاع تفاصيل المنتج
        const res = await axios.get(`http://127.0.0.1:8000/api/products/products/${id}/`, config);
        setProduct(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="p-20 text-center font-bold">Loading product details...</div>;
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
            <a className="text-primary text-sm font-medium transition-colors cursor-pointer" onClick={() => navigate('/home')}>Categories</a>
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
        <div className="flex flex-wrap gap-2 text-sm font-medium mb-8">
          <a className="text-slate-500 hover:text-primary cursor-pointer" onClick={() => navigate('/home')}>Home</a>
          <span className="text-slate-300"><span className="material-symbols-outlined text-xs">chevron_right</span></span>
          <span className="text-slate-900 font-bold">{product.name}</span>
        </div>

        {/* Product Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Image */}
          <div className="flex flex-col gap-4">
            <div 
              className="w-full aspect-[4/3] bg-center bg-no-repeat bg-cover rounded-xl shadow-sm border border-primary/5 bg-slate-100" 
              style={{ backgroundImage: `url(${product.image || "https://via.placeholder.com/600x450?text=No+Image"})` }}
            ></div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <span className="text-primary font-bold tracking-wider uppercase text-xs mb-2">Government Verified</span>
            <h1 className="text-4xl font-black text-slate-900 mb-2 leading-tight">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex text-amber-500">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              </div>
              <span className="text-slate-500 text-sm font-medium">Verified Product</span>
            </div>

            <p className="text-3xl font-bold text-slate-900 mb-6 flex items-end gap-2">
              {product.official_price} <span className="text-lg font-medium text-slate-500">DA / Unit</span>
            </p>
            
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              {product.description || "No description available for this product."}
            </p>

            {/* Farmer Card */}
            <div className="bg-primary/5 rounded-xl p-5 mb-8 flex items-center justify-between border border-primary/10">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-3xl">nature_people</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{product.farmer_name || "Official Farmer"}</p>
                  <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-1">
                    <span className="material-symbols-outlined text-[14px]">location_on</span> Algeria
                  </p>
                </div>
              </div>
              <span className="flex items-center gap-1 bg-primary/10 text-primary text-[10px] font-bold uppercase px-3 py-1.5 rounded-full">
                <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span> Verified Farmer
              </span>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap gap-4 items-center">
              <button onClick={() => navigate('/payment/' + id)} className="flex-1 min-w-[200px] bg-primary text-white font-bold py-3.5 px-8 rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
                 Place Order
              </button>
              <button className="size-12 flex items-center justify-center bg-rose-50 border border-rose-100 rounded-xl text-rose-500 hover:bg-rose-100 transition-colors">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section (Static UI as per design) */}
        <div className="mb-20 pt-8 border-t border-slate-200">
          <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="w-full lg:w-64 flex flex-col gap-6 shrink-0">
              <div className="flex flex-col">
                <p className="text-5xl font-black text-slate-900">5.0</p>
                <div className="flex text-amber-500 mb-1 mt-2">
                   {[1,2,3,4,5].map(i => <span key={i} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>)}
                </div>
                <p className="text-slate-500 text-sm font-medium">Verified Reviews</p>
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-8">
              {/* Add Review Form */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 mb-4 shadow-sm">
                <h3 className="font-bold text-lg mb-4">Write a Review</h3>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2 relative">
                    <label className="text-sm font-bold text-slate-600">Your Rating</label>
                    <div className="flex text-amber-500 gap-1 absolute top-7 cursor-pointer">
                       {[1, 2, 3, 4, 5].map((star) => (
                         <span 
                           key={star} 
                           onClick={() => setNewReviewRating(star)} 
                           className="material-symbols-outlined text-[24px]" 
                           style={{ fontVariationSettings: newReviewRating >= star ? "'FILL' 1" : "'FILL' 0" }}
                         >star</span>
                       ))}
                    </div>
                    <div className="h-8"></div>
                  </div>
                  <textarea 
                    className="w-full h-24 rounded-xl border border-slate-200 p-4 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-colors text-sm" 
                    placeholder="Share your thoughts about this product..."
                    value={newReviewText}
                    onChange={(e) => setNewReviewText(e.target.value)}
                  ></textarea>
                  <div className="flex justify-end mt-2">
                    <button 
                      onClick={handleSubmitReview}
                      className="bg-primary text-white font-bold py-2.5 px-6 rounded-xl hover:bg-primary/90 transition-all text-sm shadow-sm"
                    >
                      Submit Review
                    </button>
                  </div>
                </div>
              </div>

              {/* Render Reviews List */}
              <div className="flex flex-col gap-4">
                {reviews.map(review => (
                  <div key={review.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-slate-800">{review.author}</p>
                      <p className="text-xs font-medium text-slate-500">{review.date}</p>
                    </div>
                    <div className="flex text-amber-500 gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                         <span 
                           key={star} 
                           className="material-symbols-outlined text-[16px]" 
                           style={{ fontVariationSettings: review.rating >= star ? "'FILL' 1" : "'FILL' 0" }}
                         >star</span>
                      ))}
                    </div>
                    <p className="text-slate-600 text-sm mt-2">{review.text}</p>
                  </div>
                ))}
                {reviews.length === 0 && <p className="text-slate-500 text-sm py-4">No reviews yet. Be the first to add one!</p>}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ---------------- FOOTER ---------------- */}
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
              <li><a className="hover:text-primary transition-colors" href="#">About Us</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Farmer Registration</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-800 mb-6 uppercase tracking-wider text-xs">Support</h4>
            <ul className="flex flex-col gap-4 text-sm font-medium text-slate-500">
              <li><a className="hover:text-primary transition-colors" href="#">Help Center</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Contact Support</a></li>
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
