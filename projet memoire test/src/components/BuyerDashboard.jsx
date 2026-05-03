import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NotificationDropdown from './NotificationDropdown';
import ChatWidget from './ChatWidget';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';

const BASE_URL = 'http://127.0.0.1:8000';

const statusConfig = {
  'Delivered': { color: 'bg-green-100 text-green-700 border-green-200', icon: 'check_circle' },
  'On the Way': { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: 'local_shipping' },
  'Order Placed': { color: 'bg-amber-100 text-amber-700 border-amber-200', icon: 'package_2' },
};

export default function BuyerDashboard() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [activeSection, setActiveSection] = useState('profile');
  const [profilePic, setProfilePic] = useState('https://via.placeholder.com/150');
  const [profile, setProfile] = useState({
    full_name: '',
    username: '',
    email: '',
    phone: '',
    sex: 'M',
    address: '',
    password: '',
    commercial_register: '',
  });

  const [orders, setOrders] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [complaint, setComplaint] = useState('');
  const [complaintSent, setComplaintSent] = useState(false);
  const [totalSpending, setTotalSpending] = useState(0);
  const [complaintsList, setComplaintsList] = useState([
    { id: 'CMP-001', subject: 'Late Delivery', status: 'Resolved', date: '2026-04-15' },
    { id: 'CMP-002', subject: 'Damaged Products', status: 'Pending', date: '2026-04-28' },
  ]);

  const token = localStorage.getItem('agrigov_token');

  const getImageUrl = (url) => {
    if (!url) return 'https://via.placeholder.com/150';
    if (url.startsWith('http')) return url;
    return `${BASE_URL}${url}`;
  };

  // --- Mock Data for Charts ---
  const priceHistoryData = [
    { month: 'Jan', price: 120 },
    { month: 'Feb', price: 135 },
    { month: 'Mar', price: 125 },
    { month: 'Apr', price: 140 },
    { month: 'May', price: 155 },
    { month: 'Jun', price: 145 },
  ];

  const orderAnalyticsData = [
    { name: 'Potatoes', volume: 400 },
    { name: 'Tomatoes', volume: 300 },
    { name: 'Onions', volume: 500 },
    { name: 'Carrots', volume: 200 },
  ];

  const spendingHistoryData = [
    { month: 'Jan', amount: 12000 },
    { month: 'Feb', amount: 15000 },
    { month: 'Mar', amount: 11000 },
    { month: 'Apr', amount: 18000 },
    { month: 'May', amount: 22000 },
    { month: 'Jun', amount: 19000 },
  ];

  const priceTrendData = [
    { week: 'Week 1', price: 120 },
    { week: 'Week 2', price: 115 },
    { week: 'Week 3', price: 130 },
    { week: 'Week 4', price: 125 },
    { week: 'Week 5', price: 140 },
    { week: 'Week 6', price: 135 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setFetching(true);
      try {
        const headers = { Authorization: `Token ${token}` };

        // Fetch Profile
        const profileRes = await axios.get(`${BASE_URL}/users/profile/manage/`, { headers });
        const p = profileRes.data;
        setProfile({
          full_name: p.full_name || '',
          username: p.username || '',
          email: p.email || '',
          phone: p.phone || '',
          sex: p.sex || 'M',
          address: p.address || '',
          password: '',
          commercial_register: p.buyer?.commercial_register || '',
        });
        if (p.profile_photo_url) {
          setProfilePic(getImageUrl(p.profile_photo_url));
        }

        // Fetch Orders
        const ordersRes = await axios.get(`${BASE_URL}/api/orders/buyer/orders/`, { headers });
        const mappedOrders = ordersRes.data.map(order => {
          // Status mapping
          let displayStatus = 'Order Placed';
          if (order.status === 'delivered') displayStatus = 'Delivered';
          else if (order.status === 'shipped') displayStatus = 'On the Way';

          // Get product info from first item
          const firstItem = order.items?.[0] || {};

          return {
            id: order.id,
            product: firstItem.product_name || 'Agri Product',
            img: getImageUrl(firstItem.product_image),
            date: order.created_at,
            price: `DZD ${order.total_amount}`,
            status: displayStatus,
          };
        });
        setOrders(mappedOrders);

        // Calculate total spending for stats
        const total = mappedOrders.reduce((sum, order) => {
          const amount = parseFloat(order.price.replace('DZD ', '')) || 0;
          return sum + amount;
        }, 0);
        setTotalSpending(total);

      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleImageClick = () => fileInputRef.current.click();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async () => {
    setIsUpdating(true);
    try {
      const formData = new FormData();
      formData.append('full_name', profile.full_name);
      formData.append('phone', profile.phone);
      formData.append('email', profile.email);
      formData.append('sex', profile.sex);
      formData.append('address', profile.address);
      if (profile.password) formData.append('password', profile.password);

      // Commercial register is in extra_data for buyer
      const extra_data = { commercial_register: profile.commercial_register };
      formData.append('extra_data', JSON.stringify(extra_data));

      if (fileInputRef.current?.files[0]) {
        formData.append('profile_photo', fileInputRef.current.files[0]);
      }

      await axios.patch(`${BASE_URL}/users/profile/manage/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Token ${token}`
        }
      });

      // Sync UI
      window.location.reload();
    } catch (err) {
      console.error('Update error:', err);
      alert('Failed to update profile.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSendComplaint = () => {
    if (!complaint.trim()) return;
    const newComplaint = {
      id: `CMP-00${complaintsList.length + 1}`,
      subject: complaint.length > 30 ? complaint.substring(0, 30) + '...' : complaint,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0]
    };
    setComplaintsList([newComplaint, ...complaintsList]);
    setComplaintSent(true);
    setTimeout(() => {
      setShowComplaintModal(false);
      setComplaintSent(false);
      setComplaint('');
    }, 1800);
  };

  const navItems = [
    { key: 'profile', label: 'Manage Profile', icon: 'person' },
    { key: 'orders', label: 'My Orders', icon: 'receipt_long' },
    { key: 'complaints', label: 'Complaints & Reports', icon: 'report_gmailerrorred' },
  ];

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="text-on-surface-variant font-bold">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest text-on-surface antialiased font-sans min-h-screen">
      <div className="flex min-h-screen relative">

        {/* ── Sidebar ── */}
        <aside className="hidden md:flex w-64 bg-surface border-r border-outline-variant/30 flex-col fixed h-full z-50">
          <div className="p-6 flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate('/home')}>
            <div className="bg-primary p-2 rounded-lg text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>agriculture</span>
            </div>
            <h2 className="text-primary text-xl font-bold tracking-tight">AgriGov</h2>
          </div>

          <nav className="flex-1 px-4 space-y-2 mt-4">
            {navItems.map(item => (
              <div
                key={item.key}
                onClick={() => setActiveSection(item.key)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer font-medium transition-colors ${activeSection === item.key
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'text-on-surface-variant hover:bg-surface-container-high'
                  }`}
              >
                <span className="material-symbols-outlined" style={activeSection === item.key ? { fontVariationSettings: "'FILL' 1" } : {}}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </nav>

          {/* Sidebar user mini-card */}
          <div className="p-4 border-t border-outline-variant/30 space-y-3">
            <button
              onClick={() => navigate('/home')}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-primary/20 text-primary font-bold text-sm hover:bg-primary/5 transition-all group"
            >
              <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
              Back to Shopping
            </button>

            <div className="flex items-center gap-3 p-2 bg-surface-container rounded-xl">
              <div className="w-10 h-10 rounded-full bg-center bg-cover border border-outline-variant/50" style={{ backgroundImage: `url("${profilePic}")` }}></div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold truncate text-on-surface">{profile.full_name || 'Buyer'}</p>
                <p className="text-xs text-on-surface-variant truncate">Buyer Account</p>
              </div>
            </div>
          </div>
        </aside>

        {/* ── Main Body ── */}
        <main className="flex-1 md:ml-64 flex flex-col min-h-screen">

          {/* Top Header */}
          <header className="h-16 bg-surface border-b border-outline-variant/30 px-4 md:px-8 flex items-center justify-between sticky top-0 z-40">
            <div className="md:hidden flex items-center gap-2 text-primary font-bold text-lg">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>agriculture</span>
            </div>
            <div className="flex-1 max-w-md hidden sm:block">
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">search</span>
                <input className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" placeholder="Search orders..." type="text" />
              </div>
            </div>
            <div className="flex items-center gap-4 ml-auto">
              <NotificationDropdown role="buyer" />
              <div className="h-8 w-px bg-outline-variant/30 mx-2 hidden sm:block"></div>
              <button onClick={() => navigate('/login')} className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors text-sm font-semibold">
                <span className="material-symbols-outlined text-lg">logout</span>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </header>

          {/* ══ PAGE CONTENT ══ */}
          <div className="p-4 md:p-8 space-y-8 flex-1 max-w-5xl mx-auto w-full">


            {/* ─── MANAGE PROFILE ─── */}
            {activeSection === 'profile' && (
              <>
                {/* Welcome Banner */}
                <div className="bg-primary/5 border border-primary/15 rounded-xl px-6 py-5 flex items-center gap-4">
                  <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>waving_hand</span>
                  <div>
                    <h1 className="text-xl font-black text-on-surface">Welcome back, {profile.full_name?.split(' ')[0] || 'User'}! 👋</h1>
                    <p className="text-on-surface-variant text-sm mt-0.5">Keep your information up to date</p>
                  </div>
                </div>

                {/* Page Header Row */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-on-surface tracking-tight">Manage Profile</h2>
                    <p className="text-on-surface-variant mt-1 text-sm">Review and update your account details.</p>
                  </div>
                  <div className="flex gap-3">
                    <button className="px-6 py-2.5 rounded-xl border border-outline-variant/50 text-on-surface-variant font-bold text-sm hover:bg-surface-container-high transition-colors">Cancel</button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={isUpdating}
                      className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:brightness-105 transition-all shadow-sm flex items-center gap-2"
                    >
                      {isUpdating && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                      Save Changes
                    </button>
                  </div>
                </div>

                {/* Hidden file input */}
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />

                {/* Profile Card */}
                <section className="bg-surface rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden pb-8">
                  <div className="h-32 bg-surface-container-high relative overflow-hidden">
                    <div className="absolute inset-0 bg-primary/10"></div>
                  </div>
                  <div className="px-6 md:px-10 -mt-12 flex flex-col md:flex-row items-end gap-6 relative z-10 border-b border-outline-variant/20 pb-8">
                    <div className="relative group cursor-pointer" onClick={handleImageClick}>
                      <div
                        className="size-32 rounded-full border-4 border-surface bg-surface-container overflow-hidden shadow-md bg-center bg-cover transition-transform group-hover:scale-[1.02]"
                        style={{ backgroundImage: `url("${profilePic}")` }}
                      ></div>
                      <button className="absolute bottom-1 right-1 size-8 bg-primary text-white rounded-full flex items-center justify-center border-2 border-surface shadow-sm hover:brightness-110">
                        <span className="material-symbols-outlined text-sm">photo_camera</span>
                      </button>
                    </div>
                    <div className="flex-1 pb-2">
                      <h2 className="text-2xl font-black text-on-surface">{profile.full_name}</h2>
                      <p className="text-on-surface-variant font-medium text-sm mt-1">
                        Username: <span className="text-primary font-bold">@{profile.username}</span> • Buyer Account
                      </p>
                    </div>
                    <button onClick={handleImageClick} className="mb-2 flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/50 text-on-surface-variant font-bold text-xs uppercase tracking-wider hover:bg-surface-container transition-colors">
                      <span className="material-symbols-outlined text-[16px]">edit</span> Edit Photo
                    </button>
                  </div>

                  <div className="px-6 md:px-10 pt-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Account info column */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 border-b border-outline-variant/30 pb-3">
                        <span className="material-symbols-outlined text-primary bg-primary/10 p-1.5 rounded-lg">person</span>
                        <h3 className="font-extrabold text-on-surface tracking-tight uppercase text-sm">Account Information</h3>
                      </div>
                      <div className="space-y-5">
                        {[
                          { label: 'Full Name', name: 'full_name', type: 'text' },
                          { label: 'Username', name: 'username', type: 'text', readOnly: true },
                          { label: 'Email Address', name: 'email', type: 'email' },
                          { label: 'Phone Number', name: 'phone', type: 'tel' },
                        ].map(field => (
                          <div key={field.name} className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{field.label}</label>
                            <input
                              className={`w-full border border-outline-variant/50 rounded-xl px-4 py-2.5 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium ${field.readOnly ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-surface-container-lowest'}`}
                              type={field.type} name={field.name} value={profile[field.name]} onChange={handleChange} readOnly={field.readOnly}
                            />
                          </div>
                        ))}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Gender</label>
                          <select className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl px-4 py-2.5 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium"
                            name="sex" value={profile.sex} onChange={handleChange}>
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Change Password</label>
                          <input
                            className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl px-4 py-2.5 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-outline/40 font-medium"
                            type="password" name="password" placeholder="Leave blank to keep unchanged" value={profile.password} onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Address column */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 border-b border-outline-variant/30 pb-3">
                        <span className="material-symbols-outlined text-amber-600 bg-amber-50 p-1.5 rounded-lg">home_pin</span>
                        <h3 className="font-extrabold text-on-surface tracking-tight uppercase text-sm">Address</h3>
                      </div>
                      <div className="space-y-5">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Residential Address</label>
                          <textarea
                            className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl px-4 py-2.5 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium resize-none min-h-[80px]"
                            name="address" rows="3" value={profile.address} onChange={handleChange}
                          ></textarea>
                        </div>

                        {/* Buyer Credentials */}
                        <div className="flex flex-col gap-1.5 pt-2">
                          <label className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1 mb-1">
                            <span className="material-symbols-outlined text-sm">verified</span>
                            Official Buyer Credentials
                          </label>
                          <div className="p-5 bg-surface-container-lowest border border-primary/20 rounded-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                              <span className="material-symbols-outlined text-8xl" style={{ fontVariationSettings: "'FILL' 1" }}>policy</span>
                            </div>
                            <div className="relative z-10 flex flex-col gap-1.5">
                              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Commercial Register Number</label>
                              <input
                                className="w-full bg-surface border border-outline-variant/50 rounded-lg px-4 py-2.5 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none font-medium"
                                type="text" name="commercial_register" value={profile.commercial_register} onChange={handleChange}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </>
            )}

            {/* ─── MY ORDERS ─── */}
            {activeSection === 'orders' && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
                {/* Header Banner */}
                <div className="bg-primary/10 border border-primary/20 rounded-[2rem] px-10 py-8 flex flex-col md:flex-row items-center gap-8 shadow-sm">
                  <div className="bg-primary p-4 rounded-2xl text-white shadow-lg shadow-primary/20">
                    <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>receipt_long</span>
                  </div>
                  <div className="text-center md:text-left">
                    <h1 className="text-3xl font-black text-on-surface tracking-tight">Order History & Analytics</h1>
                    <p className="text-on-surface-variant text-base mt-1 font-medium opacity-80">Track your spending, market trends, and delivery status in one place.</p>
                  </div>
                </div>

                {/* Stats Cards Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-surface p-6 rounded-[2rem] border border-outline-variant/30 shadow-sm flex items-center gap-5 hover:shadow-md transition-all">
                    <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                      <span className="material-symbols-outlined text-2xl font-black">shopping_bag</span>
                    </div>
                    <div>
                      <p className="text-xs font-black text-on-surface-variant uppercase tracking-widest mb-1">Total Orders</p>
                      <h3 className="text-2xl font-black text-on-surface">{orders.length}</h3>
                    </div>
                  </div>

                  <div className="bg-surface p-6 rounded-[2rem] border border-outline-variant/30 shadow-sm flex items-center gap-5 hover:shadow-md transition-all">
                    <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                      <span className="material-symbols-outlined text-2xl font-black">payments</span>
                    </div>
                    <div>
                      <p className="text-xs font-black text-on-surface-variant uppercase tracking-widest mb-1">Total Spending</p>
                      <h3 className="text-2xl font-black text-on-surface">{totalSpending.toLocaleString()} DZD</h3>
                    </div>
                  </div>

                  <div className="bg-surface p-6 rounded-[2rem] border border-outline-variant/30 shadow-sm flex items-center gap-5 hover:shadow-md transition-all">
                    <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
                      <span className="material-symbols-outlined text-2xl font-black">storefront</span>
                    </div>
                    <div>
                      <p className="text-xs font-black text-on-surface-variant uppercase tracking-widest mb-1">Market Products</p>
                      <h3 className="text-2xl font-black text-on-surface">2,450</h3>
                    </div>
                  </div>
                </div>

                {/* Orders List & Main Chart */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                  {/* Recent Orders List */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                      <h2 className="text-2xl font-black text-on-surface tracking-tight">Recent Orders</h2>
                      <button className="text-primary font-bold text-sm hover:underline">View All History</button>
                    </div>
                    <div className="bg-surface rounded-[2rem] border border-outline-variant/30 shadow-sm overflow-hidden h-[500px] overflow-y-auto">
                      <div className="divide-y divide-outline-variant/10">
                        {orders.length > 0 ? orders.map(order => {
                          const sc = statusConfig[order.status] || statusConfig['Order Placed'];
                          return (
                            <div key={order.id} className="flex items-center gap-4 px-5 py-4 hover:bg-surface-container-lowest/50 transition-colors">
                              <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-outline-variant/20 bg-slate-100">
                                <img src={order.img} alt={order.product} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-on-surface truncate text-sm">{order.product}</p>
                                <p className="text-[11px] text-on-surface-variant mt-0.5 flex items-center gap-1 font-medium">
                                  <span className="material-symbols-outlined text-[12px]">calendar_today</span>
                                  {new Date(order.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                </p>
                              </div>
                              <div className="text-right shrink-0">
                                <p className="font-black text-primary text-sm">{order.price}</p>
                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-black border uppercase mt-1 ${sc.color}`}>
                                  {order.status}
                                </span>
                              </div>
                            </div>
                          );
                        }) : (
                          <div className="p-12 text-center text-on-surface-variant font-medium">
                            No orders found.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Spending History Chart */}
                  <div className="space-y-6">
                    <div className="flex items-center px-2">
                      <h2 className="text-2xl font-black text-on-surface tracking-tight">Spending Behavior</h2>
                    </div>
                    <div className="bg-surface p-8 rounded-[2rem] border border-outline-variant/30 shadow-sm flex flex-col h-[500px]">
                      <div className="flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={spendingHistoryData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                              dataKey="month"
                              axisLine={false}
                              tickLine={false}
                              tick={{ fontSize: 12, fill: '#64748b', fontWeight: 'bold' }}
                              dy={15}
                            />
                            <YAxis
                              axisLine={false}
                              tickLine={false}
                              tick={{ fontSize: 12, fill: '#64748b', fontWeight: 'bold' }}
                            />
                            <RechartsTooltip
                              contentStyle={{
                                borderRadius: '24px',
                                border: 'none',
                                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                padding: '16px'
                              }}
                            />
                            <Area
                              type="monotone"
                              dataKey="amount"
                              stroke="#3b82f6"
                              strokeWidth={4}
                              fillOpacity={1}
                              fill="url(#colorSpending)"
                              animationDuration={1500}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Secondary Charts Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <h2 className="text-xl font-black text-on-surface tracking-tight px-2 flex items-center gap-2">
                      <span className="material-symbols-outlined text-amber-500 font-black">trending_up</span>
                      Market Price Trend: Tomatoes
                    </h2>
                    <div className="bg-surface p-8 rounded-[2.5rem] border border-outline-variant/30 shadow-sm h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={priceTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b', fontWeight: 'bold' }} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b', fontWeight: 'bold' }} />
                          <RechartsTooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                          <Line type="monotone" dataKey="price" stroke="#f59e0b" strokeWidth={4} dot={{ r: 6, strokeWidth: 3, fill: '#fff' }} activeDot={{ r: 8 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h2 className="text-xl font-black text-on-surface tracking-tight px-2 flex items-center gap-2">
                      <span className="material-symbols-outlined text-emerald-500 font-black">bar_chart</span>
                      Most Purchased Categories
                    </h2>
                    <div className="bg-surface p-8 rounded-[2.5rem] border border-outline-variant/30 shadow-sm h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={orderAnalyticsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b', fontWeight: 'bold' }} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b', fontWeight: 'bold' }} />
                          <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                          <Bar dataKey="volume" fill="#10b981" radius={[8, 8, 0, 0]} barSize={50} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Complaint Support Section */}
                <div className="bg-red-50/50 border border-red-100 rounded-[3rem] p-12 text-center flex flex-col items-center gap-6 mt-16">
                  <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-3xl font-black">support_agent</span>
                  </div>
                  <div className="max-w-xl">
                    <h3 className="text-2xl font-black text-on-surface">Encountered an issue with an order?</h3>
                    <p className="text-on-surface-variant font-medium mt-2 leading-relaxed">
                      Our customer support team is here to help 24/7. Whether it's a delivery delay, product quality concern, or platform bug, we've got you covered.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowComplaintModal(true)}
                    className="flex items-center gap-3 px-10 py-4 bg-red-600 text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-red-600/20 hover:bg-red-700 hover:scale-105 active:scale-95"
                  >
                    <span className="material-symbols-outlined text-xl">report_problem</span>
                    Submit a Complaint
                  </button>
                </div>
              </div>
            )}

            {/* ─── COMPLAINTS & REPORTS ─── */}
            {activeSection === 'complaints' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-red-500/5 border border-red-500/15 rounded-xl px-6 py-5 flex items-center gap-4">
                  <span className="material-symbols-outlined text-red-500 text-3xl">report_gmailerrorred</span>
                  <div>
                    <h1 className="text-xl font-black text-on-surface">Complaints & Reports</h1>
                    <p className="text-on-surface-variant text-sm mt-0.5">View the status of your reported issues and platform feedback.</p>
                  </div>
                </div>

                <section className="bg-surface rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-surface-container-low text-on-surface-variant text-xs uppercase font-bold border-b border-outline-variant/30">
                        <tr>
                          <th className="px-6 py-4">ID</th>
                          <th className="px-6 py-4">Issue / Subject</th>
                          <th className="px-6 py-4">Date Submitted</th>
                          <th className="px-6 py-4 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/20">
                        {complaintsList.map(item => (
                          <tr key={item.id} className="hover:bg-surface-container-lowest transition-colors">
                            <td className="px-6 py-4 font-mono font-bold text-primary text-xs">{item.id}</td>
                            <td className="px-6 py-4">
                              <p className="font-bold text-on-surface text-sm">{item.subject}</p>
                            </td>
                            <td className="px-6 py-4 text-xs font-medium text-on-surface-variant">
                              {new Date(item.date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase ${item.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                }`}>
                                {item.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
            )}
          </div>

          {/* Footer */}
          <footer className="p-8 border-t border-outline-variant/30 text-center bg-surface mt-auto">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>agriculture</span>
              <span className="text-primary font-bold">AgriGov</span>
            </div>
            <p className="text-on-surface-variant text-sm">© 2026 AgriGov Management System. All rights reserved.</p>
          </footer>
        </main>
      </div>

      {/* ── Complaint Modal ── */}
      {showComplaintModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="bg-surface rounded-2xl shadow-2xl w-full max-w-md border border-outline-variant/30 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/20">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-red-500" style={{ fontVariationSettings: "'FILL' 1" }}>report_problem</span>
                <h2 className="font-bold text-on-surface text-lg">Send a Complaint</h2>
              </div>
              <button onClick={() => setShowComplaintModal(false)} className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <div className="px-6 py-6 space-y-4">
              {!complaintSent ? (
                <>
                  <div>
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-2">Date</label>
                    <input
                      type="text"
                      readOnly
                      value={new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                      className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl px-4 py-2.5 text-on-surface-variant font-medium text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-2">Describe your complaint</label>
                    <textarea
                      rows={5}
                      value={complaint}
                      onChange={e => setComplaint(e.target.value)}
                      placeholder="Please describe the issue with your order or the platform..."
                      className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl px-4 py-3 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium resize-none text-sm"
                    />
                  </div>
                  <div className="flex gap-3 justify-end pt-2">
                    <button onClick={() => setShowComplaintModal(false)} className="px-5 py-2.5 rounded-xl border border-outline-variant/50 text-on-surface-variant font-bold text-sm hover:bg-surface-container-high transition-colors">
                      Cancel
                    </button>
                    <button
                      onClick={handleSendComplaint}
                      disabled={!complaint.trim()}
                      className="px-5 py-2.5 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">send</span>
                      Send Complaint
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-3 py-6 text-center">
                  <span className="material-symbols-outlined text-5xl text-green-500" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  <p className="font-bold text-on-surface text-lg">Complaint Sent!</p>
                  <p className="text-on-surface-variant text-sm">Our team will review your complaint shortly.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <ChatWidget role="BUYER" />
    </div>
  );
}
