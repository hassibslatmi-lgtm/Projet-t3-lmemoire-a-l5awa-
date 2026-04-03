import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function TransporterMissions() {
  const navigate = useNavigate();
  const location = useLocation();
  const mission = location.state?.mission;
  
  const profilePic = 'https://images.unsplash.com/photo-1541703138379-99a3c9b74074?auto=format&fit=crop&q=80&w=300';
  
  // Statuses: 'placed', 'on_way', 'delivered'
  const [currentStatus, setCurrentStatus] = useState('placed');
  const [transportFee, setTransportFee] = useState(mission?.price || '');

  const handleLogout = () => {
    localStorage.removeItem('agrigov_token');
    localStorage.removeItem('agrigov_role');
    navigate('/login');
  };

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
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer font-medium"
                 onClick={() => navigate('/transporter/requests')}>
              <span className="material-symbols-outlined">assignment</span>
              <span>Requests</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary text-on-primary shadow-md shadow-primary/20 cursor-pointer font-medium">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>local_shipping</span>
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

          <div className="flex-grow flex flex-col p-4 md:p-8 gap-8 max-w-7xl mx-auto w-full">
            {/* Page Title */}
            <div className="flex flex-col gap-2">
              <nav className="flex text-sm text-slate-500 gap-2 items-center">
                <span className="hover:text-primary cursor-pointer" onClick={() => navigate('/transporter/profile')}>Dashboard</span>
                <span className="material-symbols-outlined text-xs">chevron_right</span>
                <span className="text-slate-900 font-medium">My Missions</span>
              </nav>
              <h1 className="text-primary text-3xl font-black tracking-tight">Current Mission</h1>
            </div>

            {!mission ? (
              <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-outline-variant/30 shadow-sm mt-8 border-dashed">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
                  <span className="material-symbols-outlined text-4xl">inventory_2</span>
                </div>
                <h2 className="text-xl font-bold text-slate-800 mb-2">No Active Mission</h2>
                <p className="text-slate-500 text-center max-w-md mb-6">You currently have no active deliveries. Browse the available requests to accept a new mission.</p>
                <button 
                  onClick={() => navigate('/transporter/requests')}
                  className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-all">
                  Browse Requests
                </button>
              </div>
            ) : (
              /* Two Column Layout */
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column: Mission Info & Status */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                  {/* Current Mission Card */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-primary/20 flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                      <div>
                        {currentStatus === 'delivered' ? (
                          <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded tracking-wider uppercase">Completed</span>
                        ) : (
                          <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded tracking-wider uppercase">In Progress</span>
                        )}
                        <h3 className="text-lg font-bold mt-2 text-slate-800">Mission #MS-849{mission.id}</h3>
                      </div>
                      <span className="material-symbols-outlined text-primary">local_shipping</span>
                    </div>

                    <div className="space-y-4 pt-2">
                      {mission.image && (
                         <div className="w-full h-32 rounded-xl bg-cover bg-center border border-slate-200" style={{ backgroundImage: `url("${mission.image}")` }}></div>
                      )}
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-slate-400 text-xl">{mission.icon || 'inventory_2'}</span>
                        <p className="text-sm font-medium text-slate-700">{mission.title}</p>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-slate-400 text-xl text-primary">location_on</span>
                        <div className="flex flex-col">
                          <p className="text-[10px] text-slate-500 uppercase tracking-wide font-black">Pickup</p>
                          <p className="text-sm font-bold text-slate-800">{mission.pickup}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-slate-400 text-xl text-orange-600">flag</span>
                        <div className="flex flex-col">
                          <p className="text-[10px] text-slate-500 uppercase tracking-wide font-black">Delivery</p>
                          <p className="text-sm font-bold text-slate-800">{mission.delivery}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Transportation Fee Section */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-2">
                    <h3 className="text-slate-900 font-bold mb-2 text-lg">Agreed Transportation Fee</h3>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-lg material-symbols-outlined">payments</span>
                      <input 
                        type="number" 
                        placeholder="Enter agreed fee..." 
                        value={transportFee}
                        onChange={(e) => setTransportFee(e.target.value)}
                        className="w-full bg-surface-container border border-outline-variant/50 rounded-xl pl-12 pr-4 py-4 text-lg font-black text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white outline-none transition-all"
                      />
                    </div>
                    <p className="text-xs text-slate-500 font-medium">Please enter the delivery fee confirmed with the buyer.</p>
                  </div>

                  {/* Status Selection Section */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/30">
                    <h3 className="text-slate-900 font-bold mb-6 text-lg">Select Current Status</h3>
                    <div className="flex flex-col gap-4">
                      
                      {/* Status Option 1 (Order Placed - Disabled but Checked) */}
                      <div className="relative flex items-center p-4 rounded-xl border border-primary/20 bg-primary/5 opacity-80 select-none">
                        <div className="flex items-center gap-4 w-full">
                          <div className="size-10 rounded-full bg-primary flex items-center justify-center text-white">
                            <span className="material-symbols-outlined">check</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900">Order Placed</span>
                            <span className="text-xs text-slate-500">Always Verified</span>
                          </div>
                        </div>
                      </div>

                      {/* Status Option 2 (On the Way) */}
                      <label 
                        className={`relative flex items-center p-4 rounded-xl cursor-pointer transition-all ${
                          currentStatus === 'on_way' 
                            ? 'border-2 border-primary bg-white shadow-lg shadow-primary/5' 
                            : 'border border-slate-200 bg-white hover:border-primary/50'
                        }`}>
                        <input 
                          checked={currentStatus === 'on_way'} 
                          onChange={() => setCurrentStatus('on_way')}
                          className="hidden" 
                          name="status" 
                          type="radio" 
                        />
                        <div className="flex items-center gap-4 w-full">
                          <div className={`size-10 rounded-full flex items-center justify-center ${
                            currentStatus === 'on_way' || currentStatus === 'delivered' ? 'bg-primary/20 text-primary ring-2 ring-primary' : 'bg-slate-100 text-slate-400'
                          }`}>
                            <span className="material-symbols-outlined">{currentStatus === 'delivered' ? 'check' : 'route'}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className={`font-bold ${currentStatus === 'on_way' ? 'text-primary' : 'text-slate-600'}`}>On the Way</span>
                            {currentStatus === 'on_way' && <span className="text-xs text-primary/70">Transit Active</span>}
                          </div>
                          {currentStatus === 'on_way' && (
                            <div className="ml-auto">
                              <div className="size-5 rounded-full border-4 border-primary"></div>
                            </div>
                          )}
                        </div>
                      </label>

                      {/* Status Option 3 (Delivered) */}
                      <label 
                        className={`relative flex items-center p-4 rounded-xl cursor-pointer transition-all ${
                          currentStatus === 'delivered' 
                            ? 'border-2 border-primary bg-white shadow-lg shadow-primary/5' 
                            : 'border border-slate-200 bg-white hover:border-primary/50'
                        }`}>
                        <input 
                          checked={currentStatus === 'delivered'} 
                          onChange={() => setCurrentStatus('delivered')}
                          className="hidden" 
                          name="status" 
                          type="radio" 
                        />
                        <div className="flex items-center gap-4 w-full">
                          <div className={`size-10 rounded-full flex items-center justify-center ${
                            currentStatus === 'delivered' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'
                          }`}>
                            <span className="material-symbols-outlined">{currentStatus === 'delivered' ? 'verified' : 'check_circle'}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className={`font-bold ${currentStatus === 'delivered' ? 'text-primary' : 'text-slate-500'}`}>Delivered</span>
                            <span className="text-xs text-slate-400">Final destination drop-off</span>
                          </div>
                           {currentStatus === 'delivered' && (
                            <div className="ml-auto">
                              <div className="size-5 rounded-full border-4 border-primary"></div>
                            </div>
                          )}
                        </div>
                      </label>

                    </div>
                  </div>
                </div>

                {/* Right Column: Map View */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                  <div className="relative bg-slate-100 p-2 rounded-2xl shadow-sm border border-primary/20 h-[500px] md:h-full min-h-[500px] overflow-hidden">
                    
                    {/* Interactive OpenStreetMap iframe centered roughly on Algeria (Algiers) */}
                    <div className="absolute inset-0 z-0 rounded-xl overflow-hidden shadow-inner">
                       <iframe 
                         width="100%" 
                         height="100%" 
                         frameBorder="0" 
                         scrolling="no" 
                         marginHeight="0" 
                         marginWidth="0" 
                         src="https://www.openstreetmap.org/export/embed.html?bbox=2.9127502441406254%2C36.67139265215682%2C3.1709289550781254%2C36.79157297838501&amp;layer=mapnik" 
                         className="w-full h-full object-cover">
                       </iframe>
                    </div>

                    {/* Floating Map Info Overlay */}
                    <div className="absolute top-6 left-6 z-10 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-xl border border-primary/20 max-w-xs min-w-[200px]">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`size-3 rounded-full ${currentStatus === 'delivered' ? 'bg-slate-400' : 'bg-green-500 animate-pulse'}`}></div>
                        <span className="text-sm font-bold text-slate-800">Live Tracking</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">Speed</span>
                          <span className="font-bold text-slate-700">{currentStatus === 'delivered' ? '0' : '45'} mph</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">Distance Left</span>
                          <span className="font-bold text-slate-700">{currentStatus === 'delivered' ? '0' : '12.4'} km</span>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-2">
                          <div className={`h-full transition-all duration-1000 ${currentStatus === 'delivered' ? 'w-full bg-green-500' : currentStatus === 'on_way' ? 'w-[65%] bg-primary' : 'w-[10%] bg-orange-400'}`}></div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            )}
            
          </div>
        </main>
      </div>
    </div>
  );
}
