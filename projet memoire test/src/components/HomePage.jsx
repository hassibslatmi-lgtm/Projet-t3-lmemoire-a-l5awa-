import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#f6f7f6] font-sans text-slate-900 antialiased min-h-screen flex flex-col">
      {/* Header */}
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
            <a className="text-slate-700 text-sm font-medium hover:text-primary transition-colors" href="#">Categories</a>
            {/* Removed "Verified" Link */}
          </nav>
          <div className="flex gap-3">
            <button onClick={() => navigate('/login')} className="flex items-center justify-center rounded-xl h-10 w-10 bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all shadow-sm">
              <span className="material-symbols-outlined">person</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <div className="px-4 md:px-20 py-6">
          <div className="relative min-h-[520px] flex flex-col items-center justify-center overflow-hidden rounded-xl bg-slate-900">
            <div className="absolute inset-0 opacity-60">
              <img 
                alt="Lush green farm field at sunrise" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhnGJOlfrB-l6nhVMjPcxOXdvCbVxxTgGIvjhtOUpS4o19_ksIwAhoj8l7tvV6USUmdzug4xIaqQ-f9A7L0aO5uoKsL-gypvEq5gRrE4F9mq_QIOaB93jbP4-TRJI2dQjEXV8L36jWGWSODqInueToUE19YRAn0dY9G2SaPqfkS3KyFG_Z8XKC3xhKsviab7FeijF0A6c79NDG4htZrs7h8i9FBbKGnKU4Z_qjsGfuvRJKHxh61xialaAePRxVnAUvlpvp16B9X4s"
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
                <button className="bg-primary hover:bg-primary/90 text-white px-10 py-4 rounded-xl text-lg font-bold transition-all shadow-lg hover:shadow-primary/20">
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Section */}
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

        {/* Categories Grid */}
        <div className="px-4 md:px-20 py-10">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-slate-800">Browse Categories</h2>
              <p className="text-slate-500">Explore our wide selection of agricultural goods</p>
            </div>
            <a className="text-primary font-bold hover:underline" href="#">View All</a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <a className="group flex flex-col gap-3 cursor-pointer" onClick={() => navigate('/category/fruits')}>
              <div className="w-full aspect-square overflow-hidden rounded-xl bg-slate-100">
                <img alt="Fresh organic fruits" className="w-full h-full object-cover transition-transform group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdNmF5VshUu6NtPuVpOxohCSDv7lIC9G6EGwMplzCkn0zqkjBj57V4shEUFA5iPH2GSgebXd2aXoYciSjE0UfXsyTfEKtDnowegyxECM2x1s3U6PWSSmvvP8vNE3IQ8WW6V0PIvVcVoqP0pBWfLx_Kq0QRyTTE9QatnKPWEo_ztijPk5yrO85QW1bkqEFwTxnK5CxqLaBdItlxd_J1ddhDy9-Bdc-AC9h9MEnp37uQVtgIIsQQd_J5P0CstklT5XEOEAsNSogyvJ8"/>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-primary transition-colors">Fruits</h3>
                <p className="text-sm text-slate-500">Fresh seasonal picks</p>
              </div>
            </a>
            <a className="group flex flex-col gap-3 cursor-pointer" onClick={() => navigate('/category/vegetables')}>
              <div className="w-full aspect-square overflow-hidden rounded-xl bg-slate-100">
                <img alt="Fresh green vegetables" className="w-full h-full object-cover transition-transform group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4sRCGyo_10DcIVaaJrGT_m259BeAKNjiY1zhFrhlX14bKd-atqUscRYyXU3XxbpIWRJRw4NxjtDaprcUojHy3SEk-bEdE2lhykG8BfcTfJ-MYlt2Qpcv7Blq5B8FDBKuu2u1gGmEb9Ey4z-fGY9aFTE1NoiNTMZljWcdwncJzVmwa_LW70rL4ptPiDc5k0pCSyGwtF-7A-XOQU00Ii19p0aVz7-MjNhWA0DfWtgwrrAR4M21lNVH2qSvxkKjelt0clVRid1BXvN8"/>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-primary transition-colors">Vegetables</h3>
                <p className="text-sm text-slate-500">Farm fresh organic greens</p>
              </div>
            </a>
            <a className="group flex flex-col gap-3 cursor-pointer" onClick={() => navigate('/category/grains')}>
              <div className="w-full aspect-square overflow-hidden rounded-xl bg-slate-100">
                <img alt="Various grains and pulses" className="w-full h-full object-cover transition-transform group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuByhkHQp-kJlXQuI9e_BHBxeWFimnW8aAXpr0p7u-xRU3I_fsqlUhDP9VawtZx-FC7NYT-eZr1sS2UETuShkMklJFMYShgENFjgtC7dAU9mkyJaz28N_KmXXK7yWdIuA8TLMyV5bIQS5-Up4wPm5c_bnMRInHB6Vppp6yvk4uFIjxhrCfhJ-4LLW14UT4tpVb-GZY_APyO3FAY294OSLGdBbZwxVvPd4b8wE_81OjxdpttZfMyWBxqewOds-0qhTVRocyMDMfMpXko"/>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-primary transition-colors">Grains</h3>
                <p className="text-sm text-slate-500">Premium quality staples</p>
              </div>
            </a>
            <a className="group flex flex-col gap-3 cursor-pointer" onClick={() => navigate('/category/dairy')}>
              <div className="w-full aspect-square overflow-hidden rounded-xl bg-slate-100">
                <img alt="Fresh dairy products" className="w-full h-full object-cover transition-transform group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1psl66QRg0HpaeIn9RPkgWBG_JUFDgb-8m-GHZlGA72Y2gmHnoQir3c4DrGyNU_cZmE-Hke1sfE-DaBgLATeIX1i9wl2wynPtQRQu_mCSJYuV2cS5D81ZY-gE-BZQwe2fYPMJh3LeyvriLxqOUPqQQef-tpaT0zLviwJU09uQS6TiLHseKygRJP9Q7fohkIHworAzcyU3aIQNisZURERDb0oagqQ4huauQvDNrB-RTCMrfz179_jroaztrVlmVZyx2dRGSlOxwdQ"/>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-primary transition-colors">Dairy</h3>
                <p className="text-sm text-slate-500">Local farm fresh dairy</p>
              </div>
            </a>
            <a className="group flex flex-col gap-3 cursor-pointer" onClick={() => navigate('/category/equipment')}>
              <div className="w-full aspect-square overflow-hidden rounded-xl bg-slate-100">
                <img alt="Modern agricultural equipment" className="w-full h-full object-cover transition-transform group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPJlpnxRRLAEwerGbrBki0hVgk-kYBPvhTwznL4o6yTm82jcidyhTXAlBvW9qiLCJAMpZaaHJ83F7i3gikiYnrlF1FvXp4S42yvYJ2ofAVt6YkATPwsHTzfWSIWx_Xnlsx36uLfBh-aktVJRh-APCFeebKuy1Q441LV-bt07spwpNFM2tHUjLJyQF386yNSzu8jCkJBqgR32u0XFDOq18Dapp6iqW95NoBfZU0KIK_2cJriQbiYAneBGMqCVdYwyfjOKWDw3X0PLg"/>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-primary transition-colors">Equipment</h3>
                <p className="text-sm text-slate-500">Reliable tools & machinery</p>
              </div>
            </a>
          </div>
        </div>

        {/* Promotions Banner */}
        <div className="px-4 md:px-20 py-10">
          <div className="bg-primary rounded-xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between relative overflow-hidden shadow-lg shadow-primary/20">
            <div className="absolute right-0 top-0 w-1/2 h-full opacity-10 pointer-events-none">
              <span className="material-symbols-outlined text-[300px] leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>potted_plant</span>
            </div>
            <div className="relative z-10 text-center md:text-left">
              <span className="inline-block px-4 py-1.5 bg-lime-400 text-primary text-xs font-black rounded-full mb-4 uppercase tracking-wider">Best Offers</span>
              <h2 className="text-white text-3xl md:text-5xl font-black mb-4 tracking-tight">Farmer's Market Special</h2>
              <p className="text-white/80 text-lg md:text-xl">Discover incredible daily deals on fresh goods near you.</p>
            </div>
            <div className="relative z-10 mt-8 md:mt-0">
               {/* Removed Claim Discount button */}
            </div>
          </div>
        </div>

        {/* Featured / Best Rating Products */}
        <div className="px-4 md:px-20 py-10 bg-primary/5 border-t border-primary/10">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-slate-800">Best Rating Products</h2>
              <p className="text-slate-500">Verified top-tier products chosen by our community</p>
            </div>
            <a className="text-primary font-bold hover:underline" href="#">See All</a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Product Card 1 */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all group flex flex-col cursor-pointer" onClick={() => navigate('/product/1')}>
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                <img alt="Fresh organic red apples" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCw8tAwIDLXfn4SX0TvHgaBz7XT-vupe0PlYkVb87YpJ9UGV97p_egBoajiekA_dwnLNN3C5YBm_uFqvjDwIRsPWl3XnxYjKfXdWxbOSXx6oKlPk6vWoGrKtbyBVDpf11UQBwoPsjY13yhmQGvy2EXmIfsX3GPniORxpeuR1zQJGzUjtiQwPcXbB_QLa2N1g5jK57Kg41PYjebyJ7VFJhE4hiC21V4NfjZvyc7X-Aq4ZpeY-qR7pioNbqM2I9EudWFs8w_OTHmXnis"/>
                <div className="absolute top-3 left-3 bg-amber-400 text-amber-900 text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                  <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span> 4.9
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-slate-800 mb-1">Fresh Organic Apples</h3>
                <p className="text-sm text-slate-500 mb-4">Crisp, sweet and 100% natural</p>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-2xl font-black text-primary">$4.50<span className="text-xs font-bold text-slate-400">/kg</span></span>
                  <button className="size-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                    <span className="material-symbols-outlined">add_shopping_cart</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Product Card 2 */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all group flex flex-col cursor-pointer" onClick={() => navigate('/product/2')}>
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                <img alt="Premium basmati rice" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsMYDKRAZR9y8nWMcIkQ6FmI3nWpgepPMTQzvMZQzLOEZkL5xDHEoKONIITG7JLw1n0TldyNdGCzpYe7cviGCkgk-C71l0BYXStI-5px_nl8kgFr-jrmyPyVWDpniyln5XBKJoPaDWBUjFLN5t5X6luo_P2YJcSOq9OVarY-Xk1aaFViMpulmH5w1yYzs7TGVbpMgwFT0-6aBkmKWfDW6T5tCtb8wL_6MC-DNE3klfYKq-Zrv_PtNhktn_EPmW3_rq71mi7wj-U7Y"/>
                <div className="absolute top-3 left-3 bg-amber-400 text-amber-900 text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                  <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span> 4.8
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-slate-800 mb-1">Premium Basmati Rice</h3>
                <p className="text-sm text-slate-500 mb-4">Aromatic long grain excellence</p>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-2xl font-black text-primary">$12.00<span className="text-xs font-bold text-slate-400">/5kg</span></span>
                  <button className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary/90 transition-all text-sm">
                    Place Order
                  </button>
                </div>
              </div>
            </div>

            {/* Product Card 3 */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all group flex flex-col cursor-pointer" onClick={() => navigate('/product/3')}>
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                <img alt="Fresh farm milk" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9lesiMgq7rwR9YcMpU4aXqF74hIKNmLl93gaFxN1Fg53Y0cFHInWiZPYYS6ckktK3oivi7Ywk1YwOpVormJx3xGS8LUJbwZilKNlhu2cmp3ewLEm8z3RUi9WUJw594zf3tQaKSEujFC4RXtowl6tItWng-bn1F9qsHurmeNUXR2XVeSDHRTRqHFPeBvuyEZG8oSvAkzrlqrTm7mYaIeHGkNBC-LAql71XUdhmpWMjGsZBeKA9Y_NsXtWAvQJPwLCmXRuazZ0VZR8"/>
                <div className="absolute top-3 left-3 bg-amber-400 text-amber-900 text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                  <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span> 5.0
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-slate-800 mb-1">Pure Farm Fresh Milk</h3>
                <p className="text-sm text-slate-500 mb-4">Unpasteurized natural dairy</p>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-2xl font-black text-primary">$2.20<span className="text-xs font-bold text-slate-400">/L</span></span>
                  <button className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary/90 transition-all text-sm">
                    Place Order
                  </button>
                </div>
              </div>
            </div>

            {/* Product Card 4 */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all group flex flex-col cursor-pointer" onClick={() => navigate('/product/4')}>
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                <img alt="Local blossom honey" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCze8JIUGvBPpflYxgnCGfKnuoRtmQMOSNNjXShMdIRJgfE7MvZpJQECpH0yLWjpQCxBKyCZQVcACEfFKBQzLBWVs4luUikUJKFHPaAACM3F-Fb0HXkiJKAuawj-EJ6Aga_z_B58nT39WhKg4luycXzp0zD_v3lm58-5LR2RigYAAcPih10Co2VPu1frPXJXkENXQlz2a5IE4W5oE_ztk1u18q9f0I6EaoJN0zlTzg1l1WeR6TvWzSbb-NmjI2DHgCTh60823n5PT8"/>
                <div className="absolute top-3 left-3 bg-amber-400 text-amber-900 text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                  <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span> 4.7
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-slate-800 mb-1">Raw Wildflower Honey</h3>
                <p className="text-sm text-slate-500 mb-4">Pure, unfiltered natural sweetener</p>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-2xl font-black text-primary">$8.75<span className="text-xs font-bold text-slate-400">/500g</span></span>
                  <button className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary/90 transition-all text-sm">
                    Place Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
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
