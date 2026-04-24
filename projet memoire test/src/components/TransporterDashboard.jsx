import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationDropdown from './NotificationDropdown';
import { getTransporterStats, getTransporterMissions, getName, clearAuth, getFarmerProfile } from '../services/api';

const BASE_URL = 'http://127.0.0.1:8000';

export default function TransporterDashboard() {
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({ missions_completed: 0, active_missions: 0 });
  const [missions, setMissions] = useState([]);
  const [profile, setProfile] = useState({ full_name: '', photo: null });
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [historyTab, setHistoryTab] = useState('accepted');

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${BASE_URL}${url}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, missionsData, profileData] = await Promise.all([
          getTransporterStats(),
          getTransporterMissions(),
          getFarmerProfile() // Using same profile endpoint for all roles
        ]);

        setStats(statsData);
        setMissions(missionsData);
        setProfile({
          full_name: profileData.full_name || profileData.username,
          photo: getImageUrl(profileData.profile_photo_url || profileData.profile_photo)
        });

      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalRevenue = useMemo(() => {
    return missions
      .filter(m => m.status === 'delivered')
      .reduce((sum, m) => sum + parseFloat(m.total_amount || 0), 0);
  }, [missions]);

  const activeMissionsList = missions.filter(m => m.status === 'shipped' || m.status === 'processing');
  const activeMission = activeMissionsList.length > 0 ? activeMissionsList[0] : null;

  const handleLogout = () => {
    clearAuth();
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
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary text-on-primary shadow-md shadow-primary/20 cursor-pointer font-medium">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
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
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer font-medium"
                 onClick={() => navigate('/transporter/missions')}>
              <span className="material-symbols-outlined">local_shipping</span>
              <span>My Missions</span>
            </div>
          </nav>

          <div className="p-4 border-t border-outline-variant/30">
            <div className="flex items-center gap-3 p-2 bg-surface-container rounded-xl cursor-default">
              <div className="w-10 h-10 rounded-full bg-center bg-cover border border-outline-variant/50 bg-slate-100 flex items-center justify-center text-primary font-bold"
                   style={profile.photo ? { backgroundImage: `url("${profile.photo}")` } : {}}>
                {!profile.photo && (profile.full_name?.charAt(0).toUpperCase() || 'T')}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold truncate text-on-surface">{profile.full_name}</p>
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
              <NotificationDropdown role="transporter" />
              <div className="h-8 w-px bg-outline-variant/30 mx-2 hidden sm:block"></div>
              <button onClick={handleLogout} className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors text-sm font-semibold cursor-pointer">
                <span className="material-symbols-outlined text-lg">logout</span>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </header>

          <div className="flex-grow flex flex-col p-4 md:p-8 gap-10 w-full max-w-[1600px] mx-auto">
            
            {/* Welcome Title */}
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-black text-primary tracking-tight">Welcome, {profile.full_name?.split(' ')[0] || 'Transporter'}!</h1>
              <p className="text-slate-500 font-medium">Here is a quick overview of your transport operations.</p>
            </div>

            {/* Statistics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-outline-variant/30 flex items-center gap-6">
                <div className="size-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-3xl">payments</span>
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-bold uppercase tracking-wide">Total Revenue</p>
                  <p className="text-3xl md:text-4xl font-black text-slate-800">{loading ? '...' : `${totalRevenue} DZD`}</p>
                </div>
              </div>
              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-outline-variant/30 flex items-center gap-6">
                <div className="size-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-3xl">assignment</span>
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-bold uppercase tracking-wide">Total Requested</p>
                  <p className="text-3xl md:text-4xl font-black text-slate-800">{loading ? '...' : missions.length}</p>
                </div>
              </div>
              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-outline-variant/30 flex items-center gap-6">
                <div className="size-16 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-3xl">check_circle</span>
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-bold uppercase tracking-wide">Completed Missions</p>
                  <p className="text-3xl md:text-4xl font-black text-slate-800">{loading ? '...' : stats.missions_completed}</p>
                </div>
              </div>
              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-outline-variant/30 flex items-center gap-6">
                <div className="size-16 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-3xl">local_shipping</span>
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-bold uppercase tracking-wide">Active Missions</p>
                  <p className="text-3xl md:text-4xl font-black text-slate-800">{loading ? '...' : stats.active_missions}</p>
                </div>
              </div>
            </div>

            {/* Main Grid Two Column */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Mission History Preview (col-span-1) */}
              <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-outline-variant/30 p-5 flex flex-col min-h-[550px]">
                <div className="flex items-center justify-between xl:mb-4 mb-2 pb-2 border-b border-outline-variant/30">
                  <h3 className="font-bold text-lg text-slate-800">Mission History</h3>
                  <button 
                    onClick={() => setShowHistory(true)}
                    className="text-sm font-bold text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    View All
                  </button>
                </div>
                
                <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2">
                  {loading ? (
                    <p className="text-center text-slate-500 mt-10">Loading history...</p>
                  ) : missions.slice(0, 5).map((m, i) => (
                    <div key={m.id} className="flex items-center gap-3">
                      <div className={`size-10 rounded-full flex items-center justify-center shrink-0 ${m.status === 'delivered' ? 'bg-green-50 text-green-600' : 'bg-primary/10 text-primary'}`}>
                        <span className="material-symbols-outlined text-[20px]">
                          {m.status === 'delivered' ? 'check' : 'local_shipping'}
                        </span>
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-bold text-slate-800 truncate">Delivery #{m.id} - Order</p>
                        <p className="text-xs text-slate-500 truncate">Status: {m.status}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-black text-primary">+{m.total_amount} DZD</p>
                      </div>
                    </div>
                  ))}
                  {!loading && missions.length === 0 && (
                    <p className="text-center text-slate-500 mt-10">No missions yet.</p>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-outline-variant/20 text-center">
                   <p className="text-xs text-slate-400">Showing last 5 interactions</p>
                </div>
              </div>

              {/* Right Column: Current Mission Square Widget (col-span-2) */}
              <div className={`lg:col-span-2 bg-white rounded-3xl shadow-md border ${activeMission ? 'border-primary/20 cursor-pointer hover:shadow-lg' : 'border-outline-variant/30 opacity-70'} overflow-hidden flex flex-col md:flex-row relative transition-all group min-h-[550px]`}
                   onClick={() => activeMission ? navigate('/transporter/missions', { state: { mission: activeMission } }) : null}>
                
                {activeMission ? (
                  <>
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors z-30 pointer-events-none flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="bg-white px-4 py-2 rounded-xl shadow-lg border border-primary/20 font-bold text-primary flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                        Manage Mission <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </div>
                    </div>

                    <div className="w-full md:w-5/12 bg-slate-50 flex flex-col">
                      <div className="h-48 md:h-1/2 w-full bg-cover bg-center relative" 
                           style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600")' }}>
                        <div className="absolute top-4 left-4">
                          <span className="bg-primary text-white text-xs font-black tracking-wider uppercase px-3 py-1.5 rounded-lg shadow-md backdrop-blur-sm bg-primary/90">
                            Active Now
                          </span>
                        </div>
                      </div>
                      <div className="p-6 md:p-8 flex-1 flex flex-col gap-2 justify-center border-r border-outline-variant/30">
                        <p className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-1">Current Cargo</p>
                        <h3 className="text-2xl font-black text-slate-800 leading-tight">Order #{activeMission.id}</h3>
                        
                        <div className="mt-4 space-y-3">
                          <div className="flex items-start gap-3">
                            <span className="material-symbols-outlined text-sm text-primary mt-0.5">location_on</span>
                            <div className="flex flex-col">
                              <p className="text-xs text-slate-500 uppercase tracking-wide font-bold">Pickup</p>
                              <p className="text-sm font-medium text-slate-800">{activeMission.pickup_address || 'Farm'}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <span className="material-symbols-outlined text-sm text-orange-600 mt-0.5">flag</span>
                            <div className="flex flex-col">
                              <p className="text-xs text-slate-500 uppercase tracking-wide font-bold">Delivery</p>
                              <p className="text-sm font-medium text-slate-800">{activeMission.shipping_address}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right side: Map widget */}
                    <div className="w-full md:w-7/12 relative h-64 md:h-auto min-h-[300px]">
                      {/* Interactive OpenStreetMap Embed */}
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
                      
                      {/* Floating Map Data */}
                      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl shadow-md border border-slate-200 flex items-center gap-2">
                        <div className="size-2.5 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-xs font-bold text-slate-700">En Route</span>
                      </div>
                      
                      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-4 py-3 rounded-xl shadow-lg border border-slate-200">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Time Remaining</p>
                        <p className="text-xl font-black text-primary tracking-tight">45 mins</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-10 text-slate-400">
                    <span className="material-symbols-outlined text-6xl mb-4">local_shipping</span>
                    <h3 className="text-2xl font-bold text-slate-600">No Active Mission</h3>
                    <p className="mt-2 text-center">You don't have any cargo to transport right now.</p>
                    <button 
                      onClick={(e) => { e.stopPropagation(); navigate('/transporter/requests'); }}
                      className="mt-6 px-6 py-3 bg-primary/10 text-primary font-bold rounded-xl hover:bg-primary hover:text-white transition-colors">
                      Browse Requests
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowHistory(false)}></div>
          <div className="relative bg-surface w-full max-w-4xl max-h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between p-6 md:p-8 border-b border-outline-variant/30 bg-surface">
              <div>
                <h3 className="text-2xl md:text-3xl font-black text-on-surface">Missions History</h3>
                <p className="text-sm md:text-base text-slate-500 mt-1">Review your past accepted and rejected jobs</p>
              </div>
              <button 
                onClick={() => setShowHistory(false)}
                className="w-12 h-12 bg-surface-container hover:bg-surface-container-high text-on-surface-variant rounded-full flex items-center justify-center transition-colors">
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div className="flex px-6 md:px-8 border-b border-outline-variant/30 bg-surface-container-lowest">
              <button 
                onClick={() => setHistoryTab('accepted')}
                className={`py-5 px-8 font-bold text-base transition-colors border-b-2 ${historyTab === 'accepted' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
                Accepted Missions
              </button>
              <button 
                onClick={() => setHistoryTab('rejected')}
                className={`py-5 px-8 font-bold text-base transition-colors border-b-2 ${historyTab === 'rejected' ? 'border-red-500 text-red-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
                Rejected Missions
              </button>
            </div>

            <div className="p-6 md:p-8 overflow-y-auto flex-1 bg-surface-container-lowest">
              {historyTab === 'accepted' && (
                <div className="space-y-4">
                  {missions.filter(m => m.status === 'delivered').length === 0 ? (
                    <p className="text-center text-slate-500">No completed missions yet.</p>
                  ) : missions.filter(m => m.status === 'delivered').map((m) => (
                    <div key={m.id} className="flex flex-col sm:flex-row items-center gap-6 p-5 border border-outline-variant/50 rounded-2xl hover:border-primary/50 transition-colors bg-white shadow-sm">
                      <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center text-primary flex-shrink-0">
                        <span className="material-symbols-outlined text-4xl">check_circle</span>
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <h4 className="font-black text-xl text-slate-800">Delivery #{m.id}</h4>
                        <p className="text-base text-slate-500 mt-1">Completed on {new Date(m.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-primary text-2xl">+{m.total_amount} DZD</p>
                        <p className="text-sm font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg mt-2 inline-block shadow-sm">PAID</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {historyTab === 'rejected' && (
                <div className="space-y-4">
                   <div className="flex flex-col sm:flex-row items-center gap-6 p-5 border border-outline-variant/30 rounded-2xl opacity-75 grayscale-[30%] bg-surface">
                      <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 flex-shrink-0">
                        <span className="material-symbols-outlined text-4xl">cancel</span>
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <h4 className="font-black text-xl text-slate-700">No data available</h4>
                        <p className="text-base text-slate-500 mt-1">Rejected missions are not stored.</p>
                      </div>
                    </div>
                </div>
              )}
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
}
