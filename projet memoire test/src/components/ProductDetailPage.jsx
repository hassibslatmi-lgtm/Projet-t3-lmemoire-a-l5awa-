import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function ProductDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Selected rating for the new review form
  const [newReviewRating, setNewReviewRating] = useState(0);

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
            <a className="text-primary text-sm font-medium transition-colors cursor-pointer" onClick={() => navigate('/category')}>Categories</a>
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
          <a className="text-slate-500 hover:text-primary cursor-pointer" onClick={() => navigate('/')}>Home</a>
          <span className="text-slate-300"><span className="material-symbols-outlined text-xs">chevron_right</span></span>
          <a className="text-slate-500 hover:text-primary cursor-pointer" onClick={() => navigate('/category/honey')}>Honey & Pantry</a>
          <span className="text-slate-300"><span className="material-symbols-outlined text-xs">chevron_right</span></span>
          <span className="text-slate-900 font-bold">Raw Wildflower Honey</span>
        </div>

        {/* Product Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Main Product Image (thumbnails removed) */}
          <div className="flex flex-col gap-4">
            <div 
              className="w-full aspect-[4/3] bg-center bg-no-repeat bg-cover rounded-xl shadow-sm border border-primary/5 bg-slate-100" 
              style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDmQmY7sm_OTojHO4cWRX8rmsfYF-uTsym8XYyNsCv99mKF-XnYxXwl3Er3AMqRWzFdQu8E_16G3XXr2d-h0D0ugfUJbieyh4iHgTPs-0IzRXP-Dt92Xi4Tw10gTzMjpNjnPG5Sz0WMt7EJMz0_kRGJEiSnKFM0SEcBYl3UkeQqsiulJRnWQKBxOTgcMFVBKfCTge9xJ9vN_RvKvWnrodk--jZvYD206vqHB6z67vlg3sP_sivZq4wVMTfelJoBxVrGrXkLJR0AZ7E")' }}
            ></div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <span className="text-primary font-bold tracking-wider uppercase text-xs mb-2">Organic Certified</span>
            <h1 className="text-4xl font-black text-slate-900 mb-2 leading-tight">Raw Wildflower Honey</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex text-amber-500">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              </div>
              <span className="text-slate-500 text-sm font-medium">312 reviews</span>
            </div>

            <p className="text-3xl font-bold text-slate-900 mb-6 flex items-end gap-2">
              $8.75 <span className="text-lg font-medium text-slate-500">/ 500g</span>
            </p>
            
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Pure, unfiltered natural sweetener harvested from organic wildflower fields. Rich in antioxidants and enzymes, our honey preserves all the natural goodness and distinct floral notes of the seasons.
            </p>

            {/* Farmer Card Component */}
            <div className="bg-primary/5 rounded-xl p-5 mb-8 flex items-center justify-between border border-primary/10">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-3xl">nature_people</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Sunny Valley Apiaries</p>
                  <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-1">
                    <span className="material-symbols-outlined text-[14px]">location_on</span> Greenwood Hills
                  </p>
                </div>
              </div>
              <span className="flex items-center gap-1 bg-primary/10 text-primary text-[10px] font-bold uppercase px-3 py-1.5 rounded-full">
                <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span> Verified Farmer
              </span>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center border border-primary/20 rounded-xl overflow-hidden bg-white">
                <button className="px-4 py-3 hover:bg-primary/5 text-primary outline-none"><span className="material-symbols-outlined text-sm">remove</span></button>
                <input className="w-12 text-center border-none focus:ring-0 text-slate-900 bg-transparent font-bold outline-none" type="text" readOnly value="1"/>
                <button className="px-4 py-3 hover:bg-primary/5 text-primary outline-none"><span className="material-symbols-outlined text-sm">add</span></button>
              </div>
              <button className="flex-1 min-w-[200px] bg-primary text-white font-bold py-3.5 px-8 rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
                 Place Order
              </button>
              <button className="size-12 flex items-center justify-center bg-rose-50 border border-rose-100 rounded-xl text-rose-500 hover:bg-rose-100 transition-colors">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
              </button>
            </div>
          </div>
        </div>

        {/* Product specs & tabs removed as requested */}

        {/* Reviews Section */}
        <div className="mb-20 pt-8 border-t border-slate-200">
          <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>
          
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Reviews Summary */}
            <div className="w-full lg:w-64 flex flex-col gap-6 shrink-0">
              <div className="flex flex-col">
                <p className="text-5xl font-black text-slate-900">4.9</p>
                <div className="flex text-amber-500 mb-1 mt-2">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                </div>
                <p className="text-slate-500 text-sm font-medium">Based on 312 reviews</p>
              </div>
              
              <div className="space-y-3">
                <div className="grid grid-cols-[10px_1fr_40px] items-center gap-x-3">
                  <p className="text-xs font-bold text-slate-600">5</p>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 w-[92%]"></div>
                  </div>
                  <p className="text-xs text-slate-500 text-right">92%</p>
                </div>
                <div className="grid grid-cols-[10px_1fr_40px] items-center gap-x-3">
                  <p className="text-xs font-bold text-slate-600">4</p>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 w-[6%]"></div>
                  </div>
                  <p className="text-xs text-slate-500 text-right">6%</p>
                </div>
                <div className="grid grid-cols-[10px_1fr_40px] items-center gap-x-3">
                  <p className="text-xs font-bold text-slate-600">3</p>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 w-[2%]"></div>
                  </div>
                  <p className="text-xs text-slate-500 text-right">2%</p>
                </div>
              </div>
            </div>

            {/* Comments List & Add Review */}
            <div className="flex-1 flex flex-col gap-8">
              
              {/* Add New Review Form */}
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
                         >
                           star
                         </span>
                       ))}
                    </div>
                    <div className="h-8"></div> {/* Spacer for absolute positioned stars */}
                  </div>
                  <textarea 
                    className="w-full h-24 rounded-xl border border-slate-200 p-4 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-colors text-sm" 
                    placeholder="Share your thoughts about this product..."
                  ></textarea>
                  <div className="flex justify-end mt-2">
                    <button className="bg-primary text-white font-bold py-2.5 px-6 rounded-xl hover:bg-primary/90 transition-all text-sm shadow-sm">
                      Submit Review
                    </button>
                  </div>
                </div>
              </div>

              {/* Review 1 */}
              <div className="pb-8 border-b border-slate-100">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-slate-200 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB-vcgXM9PPUqNaJ5KUkOIoBVAuhokoI0Ir0ZOhAzffIfogNqXTlwf-CWDWEVNLdeprsSX5nnEtW24V-u9PSqwDCBgMuaWp7NR71FdlqKWkQQDLS1keOT6Uq09zC2xKVU4hMVwj61et0p0zHrrHIdLpxwRU79sd_1ZXruYGRMEY7U7PUVj_Qh_L_U8AUN8A4QuSRWv4dE12gFLlnA2wtfX-THhTDAE1fQM5RCJrSf0rfi4vcIsjenmBRRIfPU9-O1nm-zIbaCTU-Lk')" }}></div>
                    <div>
                      <span className="font-bold text-sm block text-slate-800">Sarah Miller</span>
                      <div className="flex text-amber-500 mt-1">
                        <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-slate-400 text-xs font-medium">2 weeks ago</span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mt-2 pl-[52px]">
                  "The best honey I've ever tasted. You can really tell the difference with raw honey. It has a beautiful floral undertone. Highly recommended!"
                </p>
              </div>

              {/* Review 2 */}
              <div className="pb-8 border-b border-slate-100">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-slate-200 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCN0uXVn4LZgWIO7XLmDMcJ3Gq4cXoyQFEdL91w0GPiINIFxKFM4kHzsY78Yc4P4ADlEEsLHbr-GI-X9RKyYbsBcq10ETyNpO0UTCRkaD9inowMtzGDgyITNV2I7tqEnIYmEM6B-Ig-bndFpmzgDX8D7Dbd1Vo9Mhe9Dkn53QXf8NQ_DXQX6y9TmqxyrHG7CfIjlWnLccxjcXuAi5RI4nIAVREKQsEd2HG8Va988ItF6Z7tt4u2qJLs_GRSy5GNca_RtZ5DV69IfEs')" }}></div>
                    <div>
                      <span className="font-bold text-sm block text-slate-800">David Chen</span>
                      <div className="flex text-amber-500 mt-1">
                        <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-slate-400 text-xs font-medium">1 month ago</span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mt-2 pl-[52px]">
                  "Excellent packaging and super fast delivery. The honey is thick and delicious. Will definitely be ordering more for my family."
                </p>
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
