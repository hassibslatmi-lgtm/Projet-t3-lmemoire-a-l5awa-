import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function TransporterRequests() {
  const navigate = useNavigate();
  const location = useLocation();
  const profilePic = 'https://images.unsplash.com/photo-1541703138379-99a3c9b74074?auto=format&fit=crop&q=80&w=300';
  
  const [showHistory, setShowHistory] = useState(false);
  const [historyTab, setHistoryTab] = useState('accepted');
  const [activeFilter, setActiveFilter] = useState('Newest');

  useEffect(() => {
    if (location.state?.openHistoryModal) {
      setShowHistory(true);
      // Clean up the state so it doesn't reopen upon refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Hardcoded missions dataset
  const initialMissions = [
    {
      id: 1,
      title: '50kg Organic Wheat',
      tags: ['Grains • Grade A'],
      icon: 'inventory_2',
      price: 45.00,
      pickup: 'Green Valley Farm',
      pickupDistance: 2.4, // total distance representation
      delivery: 'Central Silo',
      deliveryDistance: 10.0,
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600',
      dateAdded: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
    },
    {
      id: 2,
      title: '120kg Fresh Tomatoes',
      tags: ['Perishable • Temp Controlled'],
      icon: 'ac_unit',
      price: 112.50,
      pickup: 'Sunshine Orchard',
      pickupDistance: 5.8,
      delivery: 'Metro Market Terminal',
      deliveryDistance: 22.5,
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=600',
      dateAdded: new Date(Date.now() - 1000 * 60 * 60 * 5) // 5 hours ago
    },
    {
      id: 3,
      title: '200L Fresh Dairy Milk', // Changed from Bio-Fertilizer
      tags: ['Perishable • Liquid Load'],
      icon: 'water_drop',
      price: 78.00,
      pickup: 'Eco-Supply Hub',
      pickupDistance: 1.2,
      delivery: 'Hilltop Cooperative',
      deliveryDistance: 14.8,
      image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=600', // Milk image
      dateAdded: new Date(Date.now() - 1000 * 60 * 15) // 15 mins ago
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('agrigov_token');
    localStorage.removeItem('agrigov_role');
    navigate('/login');
  };

  const sortedMissions = useMemo(() => {
    let sorted = [...initialMissions];
    if (activeFilter === 'Distance') {
      sorted.sort((a, b) => a.deliveryDistance - b.deliveryDistance);
    } else if (activeFilter === 'Price') {
      sorted.sort((a, b) => b.price - a.price); // Highest to lowest
    } else if (activeFilter === 'Newest') {
      sorted.sort((a, b) => b.dateAdded - a.dateAdded);
    }
    return sorted;
  }, [activeFilter, initialMissions]);

  return (
    <div className="bg-surface-container-lowest text-on-surface antialiased font-sans min-h-screen">
      <div className="flex min-h-screen relative">

        {/* Sidebar */}
        <aside className="hidden md:flex w-64 bg-surface border-r border-outline-variant/30 flex-col fixed h-full z-50">
          <div className="p-6 flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate('/home')}>
            <div className="bg-primary p-2 rounded-lg text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>agriculture</span>
            </div>
            <h2 className="text-primary text-xl font-bold tracking-tight">AgriGov</h2>
          </div>
          <nav className="flex-1 px-4 space-y-2 mt-4">
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer font-medium"
                 onClick={() => navigate('/transporter/dashboard')}>
              <span className="material-symbols-outlined">dashboard</span>
              <span>Dashboard</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer font-medium"
                 onClick={() => navigate('/transporter/profile')}>
              <span className="material-symbols-outlined">person</span>
              <span>Profile</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary text-on-primary shadow-md shadow-primary/20 cursor-pointer font-medium">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>assignment</span>
              <span>Requests</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer font-medium">
              <span className="material-symbols-outlined">local_shipping</span>
              <span>My Missions</span>
            </div>
          </nav>

          <div className="p-4 border-t border-outline-variant/30">
            <div className="flex items-center gap-3 p-2 bg-surface-container rounded-xl cursor-default">
              <div className="w-10 h-10 rounded-full bg-center bg-cover border border-outline-variant/50" style={{ backgroundImage: `url("${profilePic}")` }}></div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold truncate text-on-surface">Ahmed Transporter</p>
                <p className="text-xs text-on-surface-variant truncate">Transporter Account</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Body */}
        <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
          {/* Header */}
          <header className="h-16 bg-white border-b border-outline-variant/30 px-4 md:px-8 flex items-center justify-between sticky top-0 z-40 relative shadow-sm">
            <div className="md:hidden flex items-center gap-2 text-primary font-bold text-lg mr-4">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>agriculture</span>
            </div>
            <div className="flex-1 max-w-md hidden sm:block">
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">search</span>
                <input className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" placeholder="Search routes..." type="text" />
              </div>
            </div>
            <div className="flex items-center gap-4 ml-auto">
              <button className="w-10 h-10 rounded-xl flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors relative cursor-pointer">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-surface"></span>
              </button>
              <div className="h-8 w-px bg-outline-variant/30 mx-2 hidden sm:block"></div>
              <button onClick={handleLogout} className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors text-sm font-semibold cursor-pointer">
                <span className="material-symbols-outlined text-lg">logout</span>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </header>

          {/* Page Content */}
          <div className="p-4 md:px-10 md:py-8 space-y-6 flex-1 w-full max-w-5xl mx-auto">
            {/* Title Section */}
            <div className="flex flex-col gap-2 pt-2 pb-2">
              <h1 className="text-3xl font-black text-primary font-headline tracking-tight mt-2">Available Delivery Requests</h1>
              <p className="text-on-surface-variant text-sm md:text-base font-medium max-w-3xl">
                Browse and accept agricultural transport missions in your region. Help farmers deliver their fresh produce efficiently.
              </p>
            </div>
            
            {/* Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 py-2 p-3 bg-white rounded-2xl shadow-md border border-outline-variant/30">
              <div className="flex gap-2">
                <button 
                  onClick={() => setActiveFilter('Distance')}
                  className={`flex h-11 items-center justify-center gap-x-2 rounded-xl px-5 text-sm font-bold transition-all ${activeFilter === 'Distance' ? 'bg-primary text-white shadow-sm' : 'bg-transparent text-slate-600 hover:bg-slate-100'}`}>
                  <span className="material-symbols-outlined text-lg">near_me</span>
                  Distance
                </button>
                <button 
                  onClick={() => setActiveFilter('Price')}
                  className={`flex h-11 items-center justify-center gap-x-2 rounded-xl px-5 text-sm font-bold transition-all ${activeFilter === 'Price' ? 'bg-primary text-white shadow-sm' : 'bg-transparent text-slate-600 hover:bg-slate-100'}`}>
                  <span className="material-symbols-outlined text-lg">payments</span>
                  Price
                </button>
                <button 
                  onClick={() => setActiveFilter('Newest')}
                  className={`flex h-11 items-center justify-center gap-x-2 rounded-xl px-5 text-sm font-bold transition-all ${activeFilter === 'Newest' ? 'bg-primary text-white shadow-sm' : 'bg-transparent text-slate-600 hover:bg-slate-100'}`}>
                  <span className="material-symbols-outlined text-lg">schedule</span>
                  Newest
                </button>
              </div>
            </div>

            {/* Requests List */}
            <div className="grid grid-cols-1 gap-6 mt-4">
              {sortedMissions.map((mission) => (
                <div key={mission.id} className="flex flex-col md:flex-row items-stretch justify-start rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-outline-variant/50 bg-surface transition-all">
                  <div className="w-full md:w-72 h-48 md:h-auto bg-center bg-no-repeat bg-cover border-r border-outline-variant/20" 
                       style={{ backgroundImage: `url("${mission.image}")` }}>
                  </div>
                  <div className="flex flex-1 flex-col p-6 gap-5">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-primary font-bold text-xl md:text-2xl">{mission.title}</p>
                        <p className="text-slate-500 text-sm mt-1.5 flex items-center gap-1 font-medium">
                          <span className="material-symbols-outlined text-[16px]">{mission.icon}</span>
                          {mission.tags.join(', ')}
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <p className="text-primary text-2xl md:text-3xl font-black tracking-tight">${mission.price.toFixed(2)}</p>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mt-1">Est. Earnings</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-surface-container-lowest border border-outline-variant/30 p-5 rounded-xl">
                      <div className="flex gap-3">
                        <span className="material-symbols-outlined text-primary bg-primary/10 p-1.5 rounded-lg h-fit">location_on</span>
                        <div>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Pickup</p>
                          <p className="text-sm font-bold text-slate-800">{mission.pickup}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{mission.pickupDistance} miles away</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <span className="material-symbols-outlined text-orange-600 bg-orange-50 p-1.5 rounded-lg h-fit">flag</span>
                        <div>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Delivery</p>
                          <p className="text-sm font-bold text-slate-800">{mission.delivery}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{mission.deliveryDistance} miles total</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3 mt-2">
                      <button 
                        onClick={() => navigate('/transporter/missions', { state: { mission } })}
                        className="flex-1 bg-primary text-white rounded-xl h-11 font-bold text-sm hover:bg-primary/90 hover:shadow-md transition-all flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-lg">check_circle</span>
                        Accept Mission
                      </button>
                      <button className="px-8 border border-red-200 text-red-600 rounded-xl h-11 font-bold text-sm hover:bg-red-50 hover:border-red-300 transition-colors">
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 py-6 mt-4">
              <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface border border-outline-variant/50 text-slate-600 hover:text-primary transition-colors hover:bg-surface-container shadow-sm">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white font-bold shadow-sm">1</button>
              <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface border border-outline-variant/50 text-slate-600 hover:text-primary transition-colors hover:bg-surface-container shadow-sm">2</button>
              <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface border border-outline-variant/50 text-slate-600 hover:text-primary transition-colors hover:bg-surface-container shadow-sm">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>

            {/* Missions History Action */}
            <div className="mt-8 pt-8 border-t border-outline-variant/30 flex justify-center pb-12">
               <button 
                 onClick={() => setShowHistory(true)}
                 className="flex items-center gap-3 px-8 py-4 bg-slate-800 text-white rounded-2xl hover:bg-slate-900 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 font-bold">
                 <span className="material-symbols-outlined text-2xl">history</span>
                 View Missions History
                 <span className="material-symbols-outlined ml-2 opacity-50">arrow_forward</span>
               </button>
            </div>
          </div>
        </main>
      </div>

      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowHistory(false)}></div>
          <div className="relative bg-surface w-full max-w-3xl max-h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between p-6 md:p-8 border-b border-outline-variant/30 bg-surface">
              <div>
                <h3 className="text-2xl font-black text-on-surface">Missions History</h3>
                <p className="text-sm text-slate-500 mt-1">Review your past accepted and rejected jobs</p>
              </div>
              <button 
                onClick={() => setShowHistory(false)}
                className="w-10 h-10 bg-surface-container hover:bg-surface-container-high text-on-surface-variant rounded-full flex items-center justify-center transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex px-6 md:px-8 border-b border-outline-variant/30 bg-surface-container-lowest">
              <button 
                onClick={() => setHistoryTab('accepted')}
                className={`py-4 px-6 font-bold text-sm transition-colors border-b-2 ${historyTab === 'accepted' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
                Accepted Missions
              </button>
              <button 
                onClick={() => setHistoryTab('rejected')}
                className={`py-4 px-6 font-bold text-sm transition-colors border-b-2 ${historyTab === 'rejected' ? 'border-red-500 text-red-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
                Rejected Missions
              </button>
            </div>

            <div className="p-6 md:p-8 overflow-y-auto flex-1 bg-surface-container-lowest">
              {historyTab === 'accepted' && (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex flex-col sm:flex-row items-center gap-4 p-4 border border-outline-variant/50 rounded-2xl hover:border-primary/50 transition-colors bg-white">
                      <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                        <span className="material-symbols-outlined text-3xl">check_circle</span>
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <h4 className="font-bold text-lg text-slate-800">Delivery #{8493 + i} - Potatoes</h4>
                        <p className="text-sm text-slate-500">Completed on {new Date().toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-primary text-xl">+$85.00</p>
                        <p className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded mt-1 inline-block">PAID</p>
                      </div>
                    </div>
                  ))}
                  {/* Removed "End of accepted history" test as requested */}
                </div>
              )}

              {historyTab === 'rejected' && (
                <div className="space-y-4">
                   <div className="flex flex-col sm:flex-row items-center gap-4 p-4 border border-outline-variant/30 rounded-2xl opacity-75 grayscale-[30%] bg-surface">
                      <div className="w-16 h-16 bg-red-50 rounded-xl flex items-center justify-center text-red-500 flex-shrink-0">
                        <span className="material-symbols-outlined text-3xl">cancel</span>
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <h4 className="font-bold text-lg text-slate-700">Delivery #8491 - Apples</h4>
                        <p className="text-sm text-slate-500">Rejected • Too far from current location</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-400 text-lg sm:line-through">$40.00</p>
                      </div>
                    </div>
                    {/* Kept "No more rejected missions" but removed the one from accepted. */}
                </div>
              )}
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
}
