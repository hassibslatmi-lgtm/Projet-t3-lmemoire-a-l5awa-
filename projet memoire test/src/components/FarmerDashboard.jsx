import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import NotificationDropdown from './NotificationDropdown';
import ChatWidget from './ChatWidget';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, BarChart, Bar } from 'recharts';
import { 
  clearAuth, 
  getName, 
  getFarmerStats, 
  getFarmerOrders,
  getFarmerProducts,
  getFarmerProfile,
  getAllAnimals,
  addFarmerProduct,
  getCategories,
  getOfficialProducts
} from '../services/api';

const BASE_URL = 'http://127.0.0.1:8000';

export default function FarmerDashboard() {
  const navigate = useNavigate();
  
  // Modal state
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [showAllOrdersModal, setShowAllOrdersModal] = useState(false);
  const [showAllProductsModal, setShowAllProductsModal] = useState(false); 
  const [complaintText, setComplaintText] = useState('');
  const [complaintsList, setComplaintsList] = useState([
    { id: 'CMP-F001', subject: 'Late Pickup', status: 'Resolved', date: '2026-04-10' },
    { id: 'CMP-F002', subject: 'Equipment Failure', status: 'Pending', date: '2026-04-25' },
  ]);
  
  // Add Product Modal State
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [officialProducts, setOfficialProducts] = useState([]);
  const initialFormState = { name: '', category: '', description: '', quantity: '', image: null, imageFile: null };
  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = React.useRef(null);
  
  // Navigation State
  // Navigation State
  const location = useLocation();
  const [activeSection, setActiveSection] = useState(location.state?.section || 'dashboard');

  useEffect(() => {
    if (location.state?.section) {
       setActiveSection(location.state.section);
    }
  }, [location.state]);
  const [orderSort, setOrderSort] = useState('date-desc');

  // --- Real Backend State ---
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: '0.00 DZD',
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]); 
  const [livestock, setLivestock] = useState([]); // IoT Tracking
  const [profile, setProfile] = useState({ full_name: '', photo: null });
  const [loading, setLoading] = useState(true);

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${BASE_URL}${url}`;
  };

  // --- Mock Data for Charts ---
  const revenueData = [
    { name: 'Jan', revenue: 40000 },
    { name: 'Feb', revenue: 30000 },
    { name: 'Mar', revenue: 50000 },
    { name: 'Apr', revenue: 45000 },
    { name: 'May', revenue: 60000 },
    { name: 'Jun', revenue: 55000 },
  ];

  const livestockData = [
    { name: 'Cows', value: 40 },
    { name: 'Sheep', value: 30 },
    { name: 'Goats', value: 20 },
  ];
  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

  const productStockData = [
    { name: 'Tomatoes', stock: 1200 },
    { name: 'Carrots', stock: 800 },
    { name: 'Potatoes', stock: 2500 },
    { name: 'Onions', stock: 1500 },
    { name: 'Wheat', stock: 5000 },
  ];

  const ordersPerProductData = [
    { name: 'Tomatoes', orders: 45 },
    { name: 'Carrots', orders: 20 },
    { name: 'Potatoes', orders: 60 },
    { name: 'Onions', orders: 35 },
    { name: 'Wheat', orders: 15 },
  ];

  // --- Fetch Data from Backend ---
  const fetchDashboardData = async () => {
    try {
      const [statsData, ordersData, productsData, profileData, animalsData] = await Promise.all([
          getFarmerStats(),
          getFarmerOrders(),
          getFarmerProducts(),
          getFarmerProfile(),
          getAllAnimals()
      ]);

      setStats({
        totalProducts: statsData.total_products || 0,
        totalOrders: statsData.total_orders || 0,
        totalRevenue: `${statsData.total_revenue || 0} DZD`,
      });

      setRecentOrders(ordersData || []);
      setRecentProducts(productsData || []);
      setLivestock(animalsData || []);
      setProfile({
          full_name: profileData.full_name || profileData.username,
          photo: getImageUrl(profileData.profile_photo_url || profileData.profile_photo)
      });

      setLoading(false);
    } catch (error) {
      console.error("Error fetching farmer dashboard data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const loadFormOptions = async () => {
        try {
            const [catRes, officialRes] = await Promise.all([getCategories(), getOfficialProducts()]);
            setCategories(catRes || []);
            setOfficialProducts(officialRes || []);
            if (catRes?.length > 0) {
               setFormData(prev => ({ ...prev, category: catRes[0].id }));
            }
        } catch(e) {}
    };
    loadFormOptions();

    // Real-time Monitoring: Polling every 10 seconds
    const interval = setInterval(fetchDashboardData, 10000);
    return () => clearInterval(interval);
  }, []);

  const openInMap = (lat, lng) => {
    if (!lat || !lng) {
      alert("GPS Signal lost. Cannot pinpoint location.");
      return;
    }
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
  };

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'name') {
        const op = officialProducts.find(o => o.product_name === value);
        if (op && op.category) {
          updated.category = op.category;
        }
      }
      return updated;
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: URL.createObjectURL(file), imageFile: file }));
    }
  };

  const getPriceFromOfficialProduct = (productName) => {
    const op = officialProducts.find(o => o.product_name === productName);
    return op ? op.price : '0.00';
  };

  const handleSaveProduct = async () => {
    if (!formData.name || !formData.quantity) {
      alert("Please fill name and quantity.");
      return;
    }
    setIsSubmitting(true);
    const data = new FormData();
    data.append('name', formData.name);
    data.append('category', formData.category);
    data.append('description', formData.description);
    data.append('quantity', formData.quantity);
    if (formData.imageFile) data.append('image', formData.imageFile);

    try {
      await addFarmerProduct(data);
      setShowAddProductModal(false);
      setFormData({ ...initialFormState, category: categories[0]?.id || '' });
      fetchDashboardData();
    } catch (err) {
      alert(err.data?.error || "Operation failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendComplaint = () => {
    if (!complaintText.trim()) return;
    const newComplaint = {
      id: `CMP-F00${complaintsList.length + 1}`,
      subject: complaintText.length > 30 ? complaintText.substring(0, 30) + '...' : complaintText,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0]
    };
    setComplaintsList([newComplaint, ...complaintsList]);
    alert('Complaint sent to administration successfully!');
    setComplaintText('');
    setShowComplaintModal(false);
  };

  return (
    <div className="bg-surface-container-lowest text-on-surface antialiased font-sans min-h-screen">
      <div className="flex min-h-screen relative">
        
        {/* --- Sidebar --- */}
        <aside className="hidden md:flex w-64 bg-surface border-r border-outline-variant/30 flex-col fixed h-full z-50">
          <div className="p-6 flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate('/home')}>
            <div className="bg-primary p-2 rounded-lg text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>agriculture</span>
            </div>
            <h2 className="text-primary text-xl font-bold tracking-tight">AgriGov</h2>
          </div>

          <nav className="flex-1 px-4 space-y-2 mt-4">
            <div onClick={() => setActiveSection('dashboard')} className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer font-medium transition-colors ${activeSection === 'dashboard' ? 'bg-primary text-on-primary shadow-md shadow-primary/20' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
              <span className="material-symbols-outlined">dashboard</span>
              <span>Dashboard</span>
            </div>
            <div onClick={() => navigate('/farmer/profile')} className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer font-medium">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
              <span>My Profile</span>
            </div>
            <div onClick={() => setActiveSection('products')} className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer font-medium transition-colors ${activeSection === 'products' ? 'bg-primary text-on-primary shadow-md shadow-primary/20' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
              <span className="material-symbols-outlined">inventory_2</span>
              <span>My Products</span>
            </div>
            <div onClick={() => setActiveSection('orders')} className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer font-medium transition-colors ${activeSection === 'orders' ? 'bg-primary text-on-primary shadow-md shadow-primary/20' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
              <span className="material-symbols-outlined">receipt_long</span>
              <span>Orders</span>
            </div>
            <div onClick={() => setActiveSection('complaints')} className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer font-medium transition-colors ${activeSection === 'complaints' ? 'bg-primary text-on-primary shadow-md shadow-primary/20' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
              <span className="material-symbols-outlined">report_gmailerrorred</span>
              <span>Complaints & Reports</span>
            </div>
          </nav>
          
          <div className="p-4 border-t border-outline-variant/30">
            <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-2xl border border-outline-variant/20 shadow-sm">
              <div className="w-11 h-11 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shadow-inner shrink-0 overflow-hidden bg-center bg-cover"
                   style={profile.photo ? { backgroundImage: `url("${profile.photo}")` } : {}}>
                {!profile.photo && (profile.full_name?.charAt(0).toUpperCase() || 'F')}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-black truncate text-on-surface leading-tight">{profile.full_name}</p>
                <p className="text-[11px] text-on-surface-variant truncate opacity-80">Farmer Account</p>
              </div>
            </div>
          </div>
        </aside>

        {/* --- Main Content --- */}
        <main className="flex-1 md:ml-64 flex flex-col min-h-screen relative">
          
          <header className="h-16 bg-surface border-b border-outline-variant/30 px-4 md:px-8 flex items-center justify-between sticky top-0 z-40">
            <div className="flex-1 max-w-md hidden sm:block">
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">search</span>
                <input className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" placeholder="Search..." type="text" />
              </div>
            </div>
            
            <div className="flex items-center gap-4 ml-auto">
              <NotificationDropdown role="farmer" />
              <div className="h-8 w-px bg-outline-variant/30 mx-2 hidden sm:block"></div>
              <button onClick={handleLogout} className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors text-sm font-bold cursor-pointer">
                <span className="material-symbols-outlined text-lg">logout</span>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </header>

          <div className="p-4 md:p-8 space-y-6 flex-1 max-w-7xl w-full mx-auto">
            
            {/* Welcome Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-primary/10 p-8 mb-8 border border-primary/20 flex flex-col md:flex-row justify-between items-center gap-6">
               <div className="relative z-10 w-full text-center md:text-left">
                  <h1 className="text-on-surface text-2xl md:text-3xl font-black mb-2">Welcome back, {profile.full_name?.split(' ')[0] || 'Farmer'}!</h1>
                  <div className="flex items-center justify-center md:justify-start gap-2 text-primary font-medium">
                     <span className="material-symbols-outlined text-lg">calendar_today</span>
                     <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
               </div>
               <div className="flex gap-3">
                  <div className="px-4 py-2 bg-white rounded-full border border-primary/20 flex items-center gap-2 text-xs font-bold text-primary animate-pulse">
                     <span className="w-2 h-2 bg-primary rounded-full"></span>
                     LIVE GPS TRACKING
                  </div>
                  <button onClick={() => setShowComplaintModal(true)} className="px-6 py-3 bg-red-600/10 text-red-700 border border-red-200/50 font-bold rounded-xl hover:bg-red-600/20 transition-all flex items-center gap-2 cursor-pointer">
                     <span className="material-symbols-outlined text-[20px]">report_problem</span>
                     Send Complaint
                  </button>
               </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
               <div className="bg-surface p-6 rounded-2xl border border-outline-variant/30 shadow-sm hover:border-primary transition-colors">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-xl w-fit mb-4">
                     <span className="material-symbols-outlined">inventory</span>
                  </div>
                  <p className="text-on-surface-variant text-sm font-bold uppercase mb-1">Total Products</p>
                  <h3 className="text-3xl font-black text-on-surface">{stats.totalProducts}</h3>
               </div>

               <div className="bg-surface p-6 rounded-2xl border border-outline-variant/30 shadow-sm hover:border-primary transition-colors">
                  <div className="p-3 bg-amber-100 text-amber-600 rounded-xl w-fit mb-4">
                     <span className="material-symbols-outlined">receipt_long</span>
                  </div>
                  <p className="text-on-surface-variant text-sm font-bold uppercase mb-1">Total Orders</p>
                  <h3 className="text-3xl font-black text-on-surface">{stats.totalOrders}</h3>
               </div>
               
               <div className="bg-surface p-6 rounded-2xl border border-outline-variant/30 shadow-sm hover:border-primary transition-colors">
                  <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl w-fit mb-4">
                     <span className="material-symbols-outlined">satellite_alt</span>
                  </div>
                  <p className="text-on-surface-variant text-sm font-bold uppercase mb-1">Livestock Heads</p>
                  <h3 className="text-3xl font-black text-on-surface">{livestock.length}</h3>
               </div>

               <div className="bg-surface p-6 rounded-2xl border border-outline-variant/30 shadow-sm hover:border-primary transition-colors">
                  <div className="p-3 bg-purple-100 text-purple-600 rounded-xl w-fit mb-4">
                     <span className="material-symbols-outlined">payments</span>
                  </div>
                  <p className="text-on-surface-variant text-sm font-bold uppercase mb-1">Total Revenue</p>
                  <h3 className="text-3xl font-black text-on-surface">{stats.totalRevenue}</h3>
               </div>
            </div>

            {activeSection === 'dashboard' && (
              <>
                {/* --- Analytics Charts Section --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
               <div className="bg-surface p-6 rounded-2xl border border-outline-variant/30 shadow-sm hover:border-primary transition-colors">
                  <h2 className="text-lg font-black text-on-surface mb-4 flex items-center gap-2">
                     <span className="material-symbols-outlined text-primary">trending_up</span>
                     Revenue Trends (6 Months)
                  </h2>
                  <div className="h-64 w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                           <defs>
                              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                 <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                              </linearGradient>
                           </defs>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                           <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                           <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dx={-10} />
                           <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                           <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                        </AreaChart>
                     </ResponsiveContainer>
                  </div>
               </div>

               <div className="bg-surface p-6 rounded-2xl border border-outline-variant/30 shadow-sm hover:border-primary transition-colors">
                  <h2 className="text-lg font-black text-on-surface mb-4 flex items-center gap-2">
                     <span className="material-symbols-outlined text-primary">donut_large</span>
                     Livestock Distribution
                  </h2>
                  <div className="h-64 w-full flex items-center justify-center">
                     <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                           <Pie
                              data={livestockData}
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              paddingAngle={0}
                              dataKey="value"
                              stroke="none"
                              cornerRadius={0}
                           >
                              {livestockData.map((entry, index) => (
                                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                           </Pie>
                           <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                           <Legend verticalAlign="bottom" height={36} iconType="circle" />
                        </PieChart>
                     </ResponsiveContainer>
                  </div>
               </div>
            </div>

            {/* --- Analytics and GPS Row --- */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
               
               {/* Product Stock Chart */}
               <div className="bg-surface p-6 rounded-2xl border border-outline-variant/30 shadow-sm hover:border-primary transition-colors flex flex-col">
                  <h2 className="text-lg font-black text-on-surface mb-4 flex items-center gap-2">
                     <span className="material-symbols-outlined text-primary">inventory_2</span>
                     Product Stock Levels
                  </h2>
                  <div className="h-96 w-full flex-1">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={productStockData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                           <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280', fontWeight: 'bold' }} dy={10} />
                           <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dx={-10} />
                           <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                           <Bar name="Stock (KG)" dataKey="stock" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                     </ResponsiveContainer>
                  </div>
               </div>

               {/* --- GPS Livestock Tracking Section (Live Polling) --- */}
               <div className="bg-surface rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden flex flex-col">
               <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center">
                  <h2 className="text-lg font-black text-on-surface flex items-center gap-2">
                     <span className="material-symbols-outlined text-primary">broadcast_on_home</span>
                     Real-Time GPS Monitoring
                  </h2>
                  <div className="flex items-center gap-2 text-[10px] font-black text-on-surface-variant bg-surface-container-high px-3 py-1 rounded-full">
                     <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span>
                     AUTO-REFRESHING EVERY 10S
                  </div>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                     <thead className="bg-surface-container-low text-on-surface-variant text-xs uppercase font-bold">
                        <tr>
                           <th className="px-6 py-4">RFID Tag</th>
                           <th className="px-6 py-4">Current Location</th>
                           <th className="px-6 py-4">Last Updated</th>
                           <th className="px-6 py-4">Security</th>
                           <th className="px-6 py-4 text-right">Navigation</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-outline-variant/20">
                        {livestock.length === 0 ? (
                           <tr><td colSpan="5" className="text-center py-6 opacity-50 font-bold">Waiting for GPS signal...</td></tr>
                        ) : (
                           livestock.map(animal => (
                              <tr key={animal.id} className="hover:bg-surface-container-lowest transition-colors">
                                 <td className="px-6 py-4 font-mono font-bold text-primary">{animal.rfid_tag}</td>
                                 <td className="px-6 py-4">
                                    <div className="flex items-center gap-1 font-bold text-on-surface">
                                       <span className="material-symbols-outlined text-[16px] text-primary">location_on</span>
                                       {animal.region}
                                    </div>
                                    <div className="text-[10px] text-on-surface-variant ml-5 font-medium">{animal.location_name || 'Locating...'}</div>
                                 </td>
                                 <td className="px-6 py-4">
                                    <div className="text-xs font-bold text-on-surface">{new Date(animal.updated_at).toLocaleTimeString()}</div>
                                    <div className="text-[10px] text-on-surface-variant">Today</div>
                                 </td>
                                 <td className="px-6 py-4">
                                    {animal.suspicious_movement ? (
                                       <div className="bg-red-600 text-white px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-1 w-fit animate-pulse">
                                          <span className="material-symbols-outlined text-[12px]">warning</span>
                                          SUSPICIOUS
                                       </div>
                                    ) : (
                                       <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-1 w-fit">
                                          <span className="material-symbols-outlined text-[12px]">check_circle</span>
                                          SECURE
                                       </div>
                                    )}
                                 </td>
                                 <td className="px-6 py-4 text-right">
                                    <button 
                                      onClick={() => openInMap(animal.latitude, animal.longitude)}
                                      className="bg-primary text-white px-4 py-1.5 rounded-lg text-[10px] font-black hover:shadow-lg hover:shadow-primary/30 transition-all cursor-pointer flex items-center gap-1 ml-auto"
                                    >
                                       <span className="material-symbols-outlined text-[14px]">map</span>
                                       VIEW ON MAP
                                    </button>
                                 </td>
                              </tr>
                           ))
                        )}
                     </tbody>
                  </table>
               </div>
               </div>
            </div>

            {/* --- Table Section (Products & Orders) --- */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
               
               {/* Recent Products Table */}
               <div className="bg-surface rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center">
                     <h2 className="text-lg font-black text-on-surface">Recent Products</h2>
                     <button onClick={() => setShowAllProductsModal(true)} className="text-primary text-sm font-bold hover:underline cursor-pointer">View All</button>
                  </div>
                  <div className="overflow-x-auto">
                     <table className="w-full text-left">
                        <thead className="bg-surface-container-low text-on-surface-variant text-xs uppercase font-bold">
                           <tr>
                              <th className="px-6 py-4">Product Name</th>
                              <th className="px-6 py-4">Date Listed</th>
                              <th className="px-6 py-4 text-right">Stock</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/20">
                           {loading ? (
                             <tr><td colSpan="3" className="text-center py-6">Loading...</td></tr>
                           ) : recentProducts.length === 0 ? (
                             <tr><td colSpan="3" className="text-center py-6 opacity-50">No products found.</td></tr>
                           ) : (
                             recentProducts.slice(0, 5).map(product => (
                               <tr key={product.id} className="hover:bg-surface-container-lowest transition-colors">
                                  <td className="px-6 py-4 font-bold text-on-surface">{product.name}</td>
                                  <td className="px-6 py-4 text-sm font-medium">{new Date(product.created_at || Date.now()).toLocaleDateString()}</td>
                                  <td className="px-6 py-4 text-right font-bold">{product.quantity} KG</td>
                               </tr>
                             ))
                           )}
                        </tbody>
                     </table>
                  </div>
               </div>

               {/* Recent Orders Table */}
               <div className="bg-surface rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center">
                     <h2 className="text-lg font-black text-on-surface">Recent Orders</h2>
                     <button onClick={() => setShowAllOrdersModal(true)} className="text-primary text-sm font-bold hover:underline cursor-pointer">View All</button>
                  </div>
                  <div className="overflow-x-auto">
                     <table className="w-full text-left">
                        <thead className="bg-surface-container-low text-on-surface-variant text-xs uppercase font-bold">
                           <tr>
                              <th className="px-6 py-4">Order & Customer</th>
                              <th className="px-6 py-4">Status</th>
                              <th className="px-6 py-4 text-right">Amount</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/20">
                           {loading ? (
                             <tr><td colSpan="3" className="text-center py-6">Loading...</td></tr>
                           ) : recentOrders.length === 0 ? (
                             <tr><td colSpan="3" className="text-center py-6 opacity-50">No orders yet.</td></tr>
                           ) : (
                             recentOrders.slice(0, 5).map(order => (
                               <tr key={order.id} className="hover:bg-surface-container-lowest transition-colors">
                                  <td className="px-6 py-4 font-bold">
                                    #{order.id}
                                    <div className="text-xs text-on-surface-variant font-medium">{order.buyer_name}</div>
                                  </td>
                                  <td className="px-6 py-4">
                                     <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase ${
                                         order.status === 'paid' ? 'bg-green-100 text-green-700' : (order.status === 'delivered' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700')
                                     }`}>
                                         {order.status}
                                     </span>
                                  </td>
                                  <td className="px-6 py-4 text-right font-bold">{order.total_amount} DZD</td>
                               </tr>
                             ))
                           )}
                        </tbody>
                     </table>
                  </div>
               </div>

               </div>

            </>
            )}

            {/* --- Products Section --- */}
            {activeSection === 'products' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-black text-on-surface">My Products</h2>
                  <button 
                    onClick={() => setShowAddProductModal(true)}
                    className="bg-primary text-white px-4 py-2 rounded-lg font-bold hover:shadow-lg hover:shadow-primary/30 transition-all flex items-center gap-2">
                    <span className="material-symbols-outlined">add</span>
                    Add Product
                  </button>
                </div>
                
                {/* Full Products Table */}
                <div className="bg-surface rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden">
                   <div className="overflow-x-auto">
                      <table className="w-full text-left">
                         <thead className="bg-surface-container-low text-on-surface-variant text-xs uppercase font-bold border-b border-outline-variant/30">
                            <tr>
                               <th className="px-6 py-4">Product Name</th>
                               <th className="px-6 py-4">Date Listed</th>
                               <th className="px-6 py-4">Status</th>
                               <th className="px-6 py-4 text-right">Stock</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-outline-variant/20">
                            {loading ? (
                              <tr><td colSpan="4" className="text-center py-6">Loading...</td></tr>
                            ) : recentProducts.length === 0 ? (
                              <tr><td colSpan="4" className="text-center py-6 opacity-50">No products found.</td></tr>
                            ) : (
                              recentProducts.map(product => (
                                <tr key={product.id} className="hover:bg-surface-container-lowest transition-colors">
                                   <td className="px-6 py-4 font-bold text-on-surface">{product.name}</td>
                                   <td className="px-6 py-4 text-sm font-medium">{new Date(product.created_at || Date.now()).toLocaleDateString()}</td>
                                   <td className="px-6 py-4">
                                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase bg-green-100 text-green-700">Available</span>
                                   </td>
                                   <td className="px-6 py-4 text-right font-bold">{product.quantity} KG</td>
                                </tr>
                              ))
                            )}
                         </tbody>
                      </table>
                   </div>
                </div>

                {/* Product Stock Chart for Products Section */}
                <div className="bg-surface p-6 rounded-2xl border border-outline-variant/30 shadow-sm hover:border-primary transition-colors">
                  <h2 className="text-lg font-black text-on-surface mb-4 flex items-center gap-2">
                     <span className="material-symbols-outlined text-primary">inventory_2</span>
                     Product Stock Overview
                  </h2>
                  <div className="h-72 w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={productStockData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                           <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280', fontWeight: 'bold' }} dy={10} />
                           <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dx={-10} />
                           <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                           <Bar name="Stock (KG)" dataKey="stock" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                     </ResponsiveContainer>
                  </div>
               </div>
              </div>
            )}

            {/* --- Orders Section --- */}
            {activeSection === 'orders' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-black text-on-surface">Orders Management</h2>
                  <div className="flex items-center gap-2 bg-surface p-1 rounded-lg border border-outline-variant/30">
                     <span className="material-symbols-outlined text-on-surface-variant pl-2">sort</span>
                     <select 
                       className="bg-transparent text-sm font-bold text-on-surface outline-none pr-4 py-1"
                       value={orderSort}
                       onChange={(e) => setOrderSort(e.target.value)}
                     >
                        <option value="date-desc">Date (Newest)</option>
                        <option value="date-asc">Date (Oldest)</option>
                        <option value="name-asc">Customer Name (A-Z)</option>
                        <option value="name-desc">Customer Name (Z-A)</option>
                     </select>
                  </div>
                </div>

                {/* Full Orders Table */}
                <div className="bg-surface rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden">
                   <div className="overflow-x-auto">
                      <table className="w-full text-left">
                         <thead className="bg-surface-container-low text-on-surface-variant text-xs uppercase font-bold border-b border-outline-variant/30">
                            <tr>
                               <th className="px-6 py-4">Order ID</th>
                               <th className="px-6 py-4">Customer</th>
                               <th className="px-6 py-4">Date</th>
                               <th className="px-6 py-4">Status</th>
                               <th className="px-6 py-4 text-right">Amount</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-outline-variant/20">
                            {loading ? (
                              <tr><td colSpan="5" className="text-center py-6">Loading...</td></tr>
                            ) : recentOrders.length === 0 ? (
                              <tr><td colSpan="5" className="text-center py-6 opacity-50">No orders found.</td></tr>
                            ) : (
                              [...recentOrders].sort((a, b) => {
                                if (orderSort === 'name-asc') return (a.buyer_name || '').localeCompare(b.buyer_name || '');
                                if (orderSort === 'name-desc') return (b.buyer_name || '').localeCompare(a.buyer_name || '');
                                if (orderSort === 'date-asc') return new Date(a.created_at || 0) - new Date(b.created_at || 0);
                                // default 'date-desc'
                                return new Date(b.created_at || 0) - new Date(a.created_at || 0);
                              }).map(order => (
                                <tr key={order.id} className="hover:bg-surface-container-lowest transition-colors">
                                   <td className="px-6 py-4 font-mono font-bold text-primary">#{order.id}</td>
                                   <td className="px-6 py-4 font-bold">{order.buyer_name || 'N/A'}</td>
                                   <td className="px-6 py-4 text-sm font-medium text-on-surface-variant">{new Date(order.created_at || Date.now()).toLocaleDateString()}</td>
                                   <td className="px-6 py-4">
                                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase ${
                                          order.status === 'paid' ? 'bg-green-100 text-green-700' : (order.status === 'delivered' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700')
                                      }`}>
                                          {order.status}
                                      </span>
                                   </td>
                                   <td className="px-6 py-4 text-right font-bold">{order.total_amount} DZD</td>
                                </tr>
                              ))
                            )}
                         </tbody>
                      </table>
                   </div>
                </div>

                {/* Orders per Product Chart */}
                <div className="bg-surface p-6 rounded-2xl border border-outline-variant/30 shadow-sm hover:border-primary transition-colors">
                  <h2 className="text-lg font-black text-on-surface mb-4 flex items-center gap-2">
                     <span className="material-symbols-outlined text-primary">bar_chart</span>
                     Orders per Product
                  </h2>
                  <div className="h-72 w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={ordersPerProductData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                           <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280', fontWeight: 'bold' }} dy={10} />
                           <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dx={-10} />
                           <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                           <Bar name="Total Orders" dataKey="orders" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                     </ResponsiveContainer>
                  </div>
               </div>
              </div>
            )}

            {/* --- COMPLAINTS & REPORTS --- */}
            {activeSection === 'complaints' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-red-500/5 border border-red-500/15 rounded-2xl px-8 py-6 flex items-center gap-5">
                  <div className="bg-red-500 p-3 rounded-xl text-white">
                    <span className="material-symbols-outlined text-3xl">report_gmailerrorred</span>
                  </div>
                  <div>
                    <h1 className="text-2xl font-black text-on-surface">Complaints & Platform Feedback</h1>
                    <p className="text-on-surface-variant text-sm mt-1">Manage your reports and track responses from the administration team.</p>
                  </div>
                </div>

                <div className="bg-surface rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden">
                  <div className="px-8 py-6 border-b border-outline-variant/20 flex items-center justify-between bg-surface-container-low/30">
                    <h2 className="font-bold text-on-surface">Submission History</h2>
                    <button 
                      onClick={() => setShowComplaintModal(true)}
                      className="bg-red-600 text-white px-5 py-2 rounded-xl text-sm font-black flex items-center gap-2 hover:bg-red-700 transition-colors shadow-md"
                    >
                      <span className="material-symbols-outlined text-lg">add</span>
                      New Complaint
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-surface-container-low text-on-surface-variant text-xs uppercase font-bold border-b border-outline-variant/30">
                        <tr>
                          <th className="px-8 py-4">ID</th>
                          <th className="px-8 py-4">Issue Description</th>
                          <th className="px-8 py-4">Submission Date</th>
                          <th className="px-8 py-4 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/20">
                        {complaintsList.map(item => (
                          <tr key={item.id} className="hover:bg-surface-container-lowest transition-colors">
                            <td className="px-8 py-4 font-mono font-bold text-primary text-sm">{item.id}</td>
                            <td className="px-8 py-4">
                              <p className="font-bold text-on-surface">{item.subject}</p>
                            </td>
                            <td className="px-8 py-4 text-sm font-medium text-on-surface-variant">
                              {new Date(item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </td>
                            <td className="px-8 py-4 text-right">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                item.status === 'Resolved' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-amber-100 text-amber-700 border border-amber-200'
                              }`}>
                                {item.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* --- All Products Modal --- */}
      {showAllProductsModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-surface w-full max-w-3xl max-h-[85vh] rounded-[2rem] shadow-2xl border border-outline-variant/20 overflow-hidden flex flex-col">
               <div className="px-8 py-6 border-b border-outline-variant/30 flex items-center justify-between">
                  <h2 className="text-xl font-black">All Products</h2>
                  <button onClick={() => setShowAllProductsModal(false)} className="material-symbols-outlined cursor-pointer">close</button>
               </div>
               <div className="overflow-y-auto flex-1">
                  <table className="w-full text-left">
                     <thead className="bg-surface-container-low sticky top-0">
                        <tr>
                           <th className="px-8 py-4">Name</th>
                           <th className="px-8 py-4">Stock</th>
                           <th className="px-8 py-4 text-right">Date</th>
                        </tr>
                     </thead>
                     <tbody>
                        {recentProducts.map(product => (
                           <tr key={product.id} className="border-b border-outline-variant/10">
                              <td className="px-8 py-4 font-bold">{product.name}</td>
                              <td className="px-8 py-4">{product.quantity} KG</td>
                              <td className="px-8 py-4 text-right">{new Date(product.created_at).toLocaleDateString()}</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
               <div className="p-6 text-right">
                  <button onClick={() => setShowAllProductsModal(false)} className="px-6 py-2 bg-primary text-white rounded-lg cursor-pointer">Close</button>
               </div>
            </div>
          </div>
      )}

      {/* --- Other Modals (Complaint & All Orders) --- */}
      {showComplaintModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-surface w-full max-w-lg rounded-[2rem] shadow-2xl border border-outline-variant/20 overflow-hidden">
               <div className="px-8 py-6 border-b border-outline-variant/30 flex items-center justify-between">
                  <h2 className="text-xl font-black">Submit Complaint</h2>
                  <button onClick={() => setShowComplaintModal(false)} className="material-symbols-outlined cursor-pointer">close</button>
               </div>
               <div className="p-8">
                  <textarea 
                    value={complaintText}
                    onChange={(e) => setComplaintText(e.target.value)}
                    placeholder="Describe your issue..."
                    className="w-full rounded-xl border border-outline-variant/50 bg-surface-container-lowest p-4 min-h-[150px] outline-none focus:border-primary"
                  />
               </div>
               <div className="px-8 py-5 border-t border-outline-variant/30 flex justify-end gap-3">
                  <button onClick={() => setShowComplaintModal(false)} className="px-6 py-2.5 font-bold cursor-pointer">Cancel</button>
                  <button onClick={handleSendComplaint} className="px-8 py-2.5 bg-red-600 text-white font-bold rounded-xl cursor-pointer">Send</button>
               </div>
            </div>
          </div>
      )}

      {showAllOrdersModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-surface w-full max-w-4xl max-h-[85vh] rounded-[2rem] shadow-2xl border border-outline-variant/20 overflow-hidden flex flex-col">
               <div className="px-8 py-6 border-b border-outline-variant/30 flex items-center justify-between">
                  <h2 className="text-xl font-black">Order History</h2>
                  <button onClick={() => setShowAllOrdersModal(false)} className="material-symbols-outlined cursor-pointer">close</button>
               </div>
               <div className="overflow-y-auto flex-1">
                  <table className="w-full text-left">
                     <thead className="bg-surface-container-low sticky top-0">
                        <tr>
                           <th className="px-8 py-4">ID</th>
                           <th className="px-8 py-4">Customer</th>
                           <th className="px-8 py-4">Status</th>
                           <th className="px-8 py-4 text-right">Amount</th>
                        </tr>
                     </thead>
                     <tbody>
                        {recentOrders.map(order => (
                           <tr key={order.id} className="border-b border-outline-variant/10">
                              <td className="px-8 py-4 font-mono">#{order.id}</td>
                              <td className="px-8 py-4 font-bold">{order.buyer_name}</td>
                              <td className="px-8 py-4">{order.status}</td>
                              <td className="px-8 py-4 text-right font-bold">{order.total_amount} DZD</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
               <div className="p-6 text-right">
                  <button onClick={() => setShowAllOrdersModal(false)} className="px-6 py-2 bg-primary text-white rounded-lg cursor-pointer">Close</button>
               </div>
            </div>
          </div>
      )}
      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-surface w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2rem] shadow-2xl flex flex-col border border-outline-variant/20">
            <div className="px-8 py-5 border-b border-outline-variant/30 flex items-center justify-between sticky top-0 bg-surface/95 backdrop-blur z-20 rounded-t-[2rem]">
              <h2 className="text-xl font-black text-on-surface">Add New Product</h2>
              <button onClick={() => setShowAddProductModal(false)} className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors flex items-center justify-center">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <div className="p-8 space-y-6 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Product Name</label>
                    <select name="name" value={formData.name} onChange={handleFormChange} className="w-full rounded-xl border border-outline-variant/50 bg-surface-container-lowest h-12 px-4 outline-none font-medium appearance-none">
                      <option value="" disabled>Select Official Product</option>
                      {officialProducts.map(op => <option key={op.id} value={op.product_name}>{op.product_name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Category (Auto-selected)</label>
                    <select name="category" value={formData.category} onChange={handleFormChange} disabled className="w-full rounded-xl border border-outline-variant/50 bg-surface-container-lowest h-12 px-4 outline-none font-medium appearance-none opacity-70 cursor-not-allowed">
                       <option value="" disabled>Auto-filled</option>
                       {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                    <p className="mt-2 text-xs font-bold text-green-600">Base Price: {getPriceFromOfficialProduct(formData.name)} DZD</p>
                  </div>
              </div>
              <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Description</label>
                  <textarea name="description" value={formData.description} onChange={handleFormChange} className="w-full rounded-xl border border-outline-variant/50 bg-surface-container-lowest p-4 outline-none resize-none font-medium min-h-[90px]"></textarea>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Stock KG</label>
                <input type="number" name="quantity" value={formData.quantity} onChange={handleFormChange} className="w-full rounded-xl border border-outline-variant/50 bg-surface-container-lowest h-12 px-4 outline-none font-medium" />
              </div>
              <button onClick={() => fileInputRef.current?.click()} className="w-full px-4 py-4 border-2 border-dashed border-outline-variant/50 rounded-xl text-primary font-bold hover:bg-surface-container transition-colors flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined">upload_file</span> {formData.image ? "Change Product Image" : "Upload Product Image"}
              </button>
            </div>
            <div className="px-8 py-5 border-t border-outline-variant/30 flex justify-end gap-3 bg-surface-container-lowest rounded-b-[2rem]">
              <button onClick={() => setShowAddProductModal(false)} className="px-6 py-2.5 rounded-xl border border-outline-variant/50 font-bold hover:bg-surface-container-high transition-colors text-on-surface-variant">Cancel</button>
              <button onClick={handleSaveProduct} disabled={isSubmitting} className="px-8 py-2.5 bg-primary text-on-primary font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                  {isSubmitting && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>} Save Product
              </button>
            </div>
          </div>
        </div>
      )}
      <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />

      <ChatWidget role="FARMER" />
    </div>
  );
}