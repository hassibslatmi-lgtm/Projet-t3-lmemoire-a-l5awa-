import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  getAvailableMissions, 
  acceptMission, 
  rejectMission, 
  getName, 
  clearAuth 
} from '../services/api';
import NotificationDropdown from './NotificationDropdown';

export default function TransporterRequests() {
  const navigate = useNavigate();
  const location = useLocation();
  const profilePic = 'https://images.unsplash.com/photo-1541703138379-99a3c9b74074?auto=format&fit=crop&q=80&w=300';
  
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [historyTab, setHistoryTab] = useState('accepted');
  const [activeFilter, setActiveFilter] = useState('Newest');
  const [revealedContacts, setRevealedContacts] = useState({});

  useEffect(() => {
    fetchMissions();
    if (location.state?.openHistoryModal) {
      setShowHistory(true);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const fetchMissions = async () => {
    try {
      setLoading(true);
      const data = await getAvailableMissions();
      setMissions(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    try {
      await acceptMission(id);
      alert("✅ Mission Accepted!");
      fetchMissions(); // تحديث القائمة
    } catch (err) {
      alert(err.data?.error || "Error accepting mission");
    }
  };

  const handleReject = async (id) => {
    try {
      // استدعاء الـ API للرفض
      await rejectMission(id);
      // نقوم بحذفها من القائمة في الواجهة مباشرة (Client-side filtering)
      setMissions(prev => prev.filter(m => m.id !== id));
      alert("⚠️ Mission Rejected (It won't show in your list)");
    } catch (err) {
      alert("Error rejecting mission");
    }
  };

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  const sortedMissions = useMemo(() => {
    let sorted = [...missions];
    if (activeFilter === 'Price') {
      sorted.sort((a, b) => b.total_amount - a.total_amount);
    } else if (activeFilter === 'Newest') {
      sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    return sorted;
  }, [activeFilter, missions]);

  return (
    <div className="bg-surface-container-lowest text-on-surface antialiased font-sans min-h-screen">
      <div className="flex min-h-screen relative">

        {/* --- Sidebar (بقي كما هو تماماً دون أي تغيير) --- */}
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
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer font-medium"
                 onClick={() => navigate('/transporter/missions')}>
              <span className="material-symbols-outlined">local_shipping</span>
              <span>My Missions</span>
            </div>
          </nav>

          <div className="p-4 border-t border-outline-variant/30">
            <div className="flex items-center gap-3 p-2 bg-surface-container rounded-xl cursor-default">
              <div className="w-10 h-10 rounded-full bg-center bg-cover border border-outline-variant/50" style={{ backgroundImage: `url("${profilePic}")` }}></div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold truncate text-on-surface">{getName() || "Ahmed Transporter"}</p>
                <p className="text-xs text-on-surface-variant truncate">Transporter Account</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Body */}
        <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
          {/* Header */}
          <header className="h-16 bg-white border-b border-outline-variant/30 px-4 md:px-8 flex items-center justify-between sticky top-0 z-40 relative shadow-sm">
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
                <span>Logout</span>
              </button>
            </div>
          </header>

          <div className="p-4 md:px-10 md:py-8 space-y-6 flex-1 w-full max-w-5xl mx-auto">
            <h1 className="text-3xl font-black text-primary tracking-tight mt-2">Available Delivery Requests</h1>

            {/* Requests List */}
            <div className="grid grid-cols-1 gap-6">
              {loading ? (
                <div className="text-center py-10">Loading...</div>
              ) : sortedMissions.map((mission) => (
                <div key={mission.id} className="flex flex-col md:flex-row items-stretch rounded-2xl overflow-hidden border border-outline-variant/50 bg-surface shadow-sm">
                  {/* Image */}
                  <div className="w-full md:w-72 h-48 md:h-auto bg-center bg-cover" 
                       style={{ backgroundImage: `url(${mission.items?.[0]?.product_image ? `http://127.0.0.1:8000${mission.items[0].product_image}` : 'https://via.placeholder.com/600'})` }}>
                  </div>

                  <div className="flex-1 p-6 flex flex-col gap-4">
                    <div className="flex justify-between">
                      <h2 className="text-xl font-bold text-primary">Order #{mission.id}</h2>
                      <div className="text-right">
                        <p className="text-2xl font-black text-primary">{mission.total_amount} DZD</p>
                      </div>
                    </div>

                    <div className="bg-surface-container-lowest border border-outline-variant/30 p-4 rounded-xl space-y-3">
                      <div className="flex gap-2 text-sm">
                        <span className="material-symbols-outlined text-primary">location_on</span>
                        <p><strong>From:</strong> {mission.farmer_address}</p>
                      </div>
                      <div className="flex gap-2 text-sm">
                        <span className="material-symbols-outlined text-orange-600">flag</span>
                        <p><strong>To:</strong> {mission.shipping_address}</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button 
                        onClick={() => handleAccept(mission.id)}
                        className="flex-1 bg-primary text-white rounded-xl h-11 font-bold flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-lg">check_circle</span> Accept
                      </button>
                      
                      <button 
                         onClick={() => setRevealedContacts(prev => ({ ...prev, [mission.id]: true }))}
                         className="flex-1 border border-primary/30 text-primary rounded-xl h-11 font-bold flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-lg">call</span>
                        {revealedContacts[mission.id] ? mission.farmer_phone : "Contact"}
                      </button>

                      <button 
                        onClick={() => handleReject(mission.id)}
                        className="px-6 border border-red-200 text-red-600 rounded-xl h-11 font-bold hover:bg-red-50 transition-colors">
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* History Button */}
            <div className="mt-8 pt-8 border-t flex justify-center pb-12">
               <button onClick={() => setShowHistory(true)} className="flex items-center gap-3 px-8 py-4 bg-slate-800 text-white rounded-2xl font-bold">
                 <span className="material-symbols-outlined">history</span> View Missions History
               </button>
            </div>
          </div>
        </main>
      </div>
      
    </div>
  );
}