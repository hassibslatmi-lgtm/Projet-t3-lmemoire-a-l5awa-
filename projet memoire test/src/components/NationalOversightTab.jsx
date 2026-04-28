import React, { useState, useEffect } from 'react';
import { 
  getNationalSummary, 
  getAllAnimals, 
  getFarmerInventory, 
  verifyAnimal 
} from '../services/api';

const NationalOversightTab = () => {
  const [summary, setSummary] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRegion, setFilterRegion] = useState('');
  const [filterSpecies, setFilterSpecies] = useState('');

  const fetchData = async () => {
    try {
      const [sumData, animData, invData] = await Promise.all([
        getNationalSummary(),
        getAllAnimals(),
        getFarmerInventory()
      ]);
      setSummary(sumData);
      setAnimals(animData || []);
      setInventory(invData || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching oversight data:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Real-time Monitoring: Refresh every 10 seconds
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleVerify = async (id) => {
    try {
      await verifyAnimal(id);
      fetchData();
    } catch (err) {
      alert("Verification failed");
    }
  };

  const openInMap = (lat, lng) => {
    if (!lat || !lng) {
      alert("GPS coordinates not available for this animal.");
      return;
    }
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
  };

  const filteredAnimals = animals.filter(a => {
    return (filterRegion === '' || a.region === filterRegion) &&
           (filterSpecies === '' || a.species === filterSpecies);
  });

  const regions = [...new Set(animals.map(a => a.region))];
  const speciesList = [...new Set(animals.map(a => a.species))];

  const totalLivestock = animals.length;
  const suspiciousCount = animals.filter(a => a.suspicious_movement).length;
  const activeFarmers = inventory.length;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* ── Wilaya Statistics (Analytics) ── */}
      <div className="bg-surface p-6 rounded-2xl border border-outline-variant/30 shadow-sm">
         <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-black text-on-surface flex items-center gap-2">
               <span className="material-symbols-outlined text-primary">analytics</span>
               National Distribution (by Wilaya)
            </h3>
            <div className="flex items-center gap-2 text-[10px] font-black text-primary bg-primary/10 px-3 py-1 rounded-full animate-pulse">
               <span className="w-2 h-2 bg-primary rounded-full"></span>
               LIVE GPS TRACKING ACTIVE
            </div>
         </div>
         <div className="flex flex-wrap gap-3">
            {summary.map((s, idx) => (
               <div key={idx} className="bg-surface-container-low border border-outline-variant/50 px-4 py-2 rounded-xl flex items-center gap-3 hover:border-primary transition-colors cursor-default">
                  <span className="font-black text-primary">{s.region}</span>
                  <div className="h-4 w-px bg-outline-variant/30"></div>
                  <span className="text-on-surface font-bold">{s.count} <small className="text-[10px] opacity-50 uppercase">heads</small></span>
               </div>
            ))}
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         <div className="bg-surface p-6 rounded-2xl border border-outline-variant/30 shadow-sm">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl w-fit mb-4">
               <span className="material-symbols-outlined">agriculture</span>
            </div>
            <p className="text-on-surface-variant text-sm font-bold uppercase mb-1">National Livestock</p>
            <h3 className="text-3xl font-black text-on-surface">{totalLivestock.toLocaleString()}</h3>
         </div>
         
         <div className="bg-surface p-6 rounded-2xl border border-outline-variant/30 shadow-sm border-l-4 border-red-500">
            <div className="p-3 bg-red-100 text-red-600 rounded-xl w-fit mb-4">
               <span className="material-symbols-outlined">warning</span>
            </div>
            <p className="text-on-surface-variant text-sm font-bold uppercase mb-1">Flagged Suspicious</p>
            <h3 className="text-3xl font-black text-red-600">{suspiciousCount}</h3>
         </div>

         <div className="bg-surface p-6 rounded-2xl border border-outline-variant/30 shadow-sm">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl w-fit mb-4">
               <span className="material-symbols-outlined">group</span>
            </div>
            <p className="text-on-surface-variant text-sm font-bold uppercase mb-1">Active Farmers</p>
            <h3 className="text-3xl font-black text-on-surface">{activeFarmers}</h3>
         </div>
      </div>

      {/* Main Registry Table */}
      <div className="bg-surface rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden">
         <div className="p-6 border-b border-outline-variant/30 flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-lg font-black text-on-surface flex items-center gap-2">
               <span className="material-symbols-outlined text-primary">list_alt</span>
               National Registry
            </h2>
            <div className="flex gap-3">
               <select 
                 className="bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-2 text-sm font-bold outline-none"
                 onChange={(e) => setFilterRegion(e.target.value)} 
                 value={filterRegion}
               >
                  <option value="">All Regions</option>
                  {regions.map(r => <option key={r} value={r}>{r}</option>)}
               </select>
               <select 
                 className="bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-2 text-sm font-bold outline-none"
                 onChange={(e) => setFilterSpecies(e.target.value)} 
                 value={filterSpecies}
               >
                  <option value="">All Species</option>
                  {speciesList.map(s => <option key={s} value={s}>{s}</option>)}
               </select>
            </div>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-surface-container-low text-on-surface-variant text-xs uppercase font-bold">
                  <tr>
                     <th className="px-6 py-4">Animal ID</th>
                     <th className="px-6 py-4">Owner</th>
                     <th className="px-6 py-4">Location</th>
                     <th className="px-6 py-4">Signal Status</th>
                     <th className="px-6 py-4">Security</th>
                     <th className="px-6 py-4 text-right">Action</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-outline-variant/20">
                  {loading ? (
                    <tr><td colSpan="6" className="text-center py-10 font-bold opacity-50">Synchronizing...</td></tr>
                  ) : filteredAnimals.length === 0 ? (
                    <tr><td colSpan="6" className="text-center py-10 opacity-50">No livestock found.</td></tr>
                  ) : (
                    filteredAnimals.map(a => (
                      <tr key={a.id} className={`hover:bg-surface-container-lowest transition-colors ${a.suspicious_movement ? 'bg-red-50/50' : ''}`}>
                         <td className="px-6 py-4">
                            <div className="font-mono font-bold text-primary">{a.rfid_tag}</div>
                            <div className="text-[10px] opacity-70 font-bold">{a.species} - {a.breed}</div>
                         </td>
                         <td className="px-6 py-4 font-bold text-on-surface">{a.farmer_name}</td>
                         <td className="px-6 py-4">
                            <div className="flex flex-col">
                               <div className="flex items-center gap-1 font-bold text-on-surface">
                                  <span className="material-symbols-outlined text-[16px] text-primary">location_on</span>
                                  {a.region}
                               </div>
                               <div className="text-[10px] text-on-surface-variant ml-5 font-medium">{a.location_name || 'Calculating...'}</div>
                            </div>
                         </td>
                         <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                               <div className="text-xs font-bold text-on-surface">Online</div>
                            </div>
                            <div className="text-[10px] text-on-surface-variant ml-4">
                               Last seen: {new Date(a.updated_at).toLocaleTimeString()}
                            </div>
                         </td>
                         <td className="px-6 py-4">
                            <div className="flex flex-col gap-1">
                               {a.suspicious_movement ? (
                                  <div className="bg-red-600 text-white px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-1 w-fit animate-pulse">
                                     <span className="material-symbols-outlined text-[12px]">warning</span>
                                     SUSPICIOUS
                                  </div>
                               ) : a.is_verified ? (
                                  <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-1 w-fit">
                                     <span className="material-symbols-outlined text-[12px]">verified</span>
                                     VERIFIED
                                  </div>
                               ) : (
                                  <div className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-1 w-fit">
                                     <span className="material-symbols-outlined text-[12px]">schedule</span>
                                     PENDING
                                  </div>
                               )}
                            </div>
                         </td>
                         <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                               <button 
                                 onClick={() => openInMap(a.latitude, a.longitude)}
                                 className="flex items-center gap-1 bg-surface-container-high border border-outline-variant/50 text-on-surface px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-primary hover:text-white hover:border-primary transition-all cursor-pointer"
                               >
                                  <span className="material-symbols-outlined text-[16px]">map</span>
                                  Map
                               </button>
                               {!a.is_verified && (
                                  <button onClick={() => handleVerify(a.id)} className="bg-primary text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-primary/90 transition-colors cursor-pointer">
                                     Verify
                                  </button>
                               )}
                            </div>
                         </td>
                      </tr>
                    ))
                  )}
               </tbody>
            </table>
         </div>
      </div>

    </div>
  );
};

export default NationalOversightTab;
