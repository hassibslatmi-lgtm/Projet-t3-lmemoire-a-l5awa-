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
  const [farmerSearch, setFarmerSearch] = useState('');

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
    const interval = setInterval(fetchData, 30000);
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

  const filteredAnimals = animals.filter(a => {
    return (filterRegion === '' || a.region === filterRegion) &&
           (filterSpecies === '' || a.species === filterSpecies);
  });

  const regions = [...new Set(animals.map(a => a.region))];
  const speciesList = [...new Set(animals.map(a => a.species))];

  const totalLivestock = summary.reduce((acc, curr) => acc + curr.count, 0);
  const suspiciousCount = animals.filter(a => a.suspicious_movement).length;
  const activeFarmers = inventory.length;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-primary/10 p-8 mb-8 border border-primary/20 flex flex-col md:flex-row justify-between items-center gap-6">
         <div className="relative z-10 w-full text-center md:text-left">
            <h1 className="text-on-surface text-2xl md:text-3xl font-black mb-2">National Livestock Oversight</h1>
            <div className="flex items-center justify-center md:justify-start gap-2 text-primary font-medium">
               <span className="material-symbols-outlined text-lg">public</span>
               <span>Live Nationwide Monitoring System</span>
            </div>
         </div>
         <div className="px-6 py-2 bg-white rounded-full border border-primary/20 flex items-center gap-2 text-sm font-bold text-primary">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            IoT Connected
         </div>
      </div>

      {/* Quick Stats Grid */}
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
            <h2 className="text-lg font-black text-on-surface">National Animal Registry</h2>
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
                     <th className="px-6 py-4">Owner (Farmer)</th>
                     <th className="px-6 py-4">Species & Breed</th>
                     <th className="px-6 py-4">Location (Wilaya)</th>
                     <th className="px-6 py-4">Status</th>
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
                         <td className="px-6 py-4 font-mono font-bold text-primary">{a.rfid_tag}</td>
                         <td className="px-6 py-4">
                            <div className="font-bold text-on-surface">{a.farmer_name}</div>
                            <div className="text-[10px] text-on-surface-variant uppercase tracking-tighter">Verified Member</div>
                         </td>
                         <td className="px-6 py-4">
                            <div className="font-bold">{a.species}</div>
                            <div className="text-xs opacity-70">{a.breed}</div>
                         </td>
                         <td className="px-6 py-4">
                            <div className="flex items-center gap-1 font-medium text-on-surface">
                               <span className="material-symbols-outlined text-[16px] text-primary">location_on</span>
                               {a.region}
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
                            {!a.is_verified && (
                               <button onClick={() => handleVerify(a.id)} className="bg-primary text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-primary/90 transition-colors cursor-pointer">
                                  Verify
                               </button>
                            )}
                         </td>
                      </tr>
                    ))
                  )}
               </tbody>
            </table>
         </div>
      </div>

      {/* Farmer Inventory Table (Bottom) */}
      <div className="bg-surface rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden mt-8">
         <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center">
            <h2 className="text-lg font-black text-on-surface">Farmer Inventory Distribution</h2>
            <input 
              type="text"
              placeholder="Search farmer..."
              className="bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-1.5 text-sm outline-none w-48"
              value={farmerSearch}
              onChange={(e) => setFarmerSearch(e.target.value)}
            />
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-surface-container-low text-on-surface-variant text-xs uppercase font-bold">
                  <tr>
                     <th className="px-6 py-4">Farmer Details</th>
                     <th className="px-6 py-4 text-right">Total Animal Count</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-outline-variant/20">
                  {inventory.filter(f => (f.farmer__full_name || f.farmer__username).toLowerCase().includes(farmerSearch.toLowerCase())).map((f, idx) => (
                     <tr key={idx} className="hover:bg-surface-container-lowest transition-colors">
                        <td className="px-6 py-4 font-bold">{f.farmer__full_name || f.farmer__username}</td>
                        <td className="px-6 py-4 text-right">
                           <span className="bg-primary/10 text-primary px-3 py-1 rounded-lg font-black">
                              {f.total_animals} Heads
                           </span>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

    </div>
  );
};

export default NationalOversightTab;
