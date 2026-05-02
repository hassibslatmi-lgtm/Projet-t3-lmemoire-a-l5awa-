import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NotificationDropdown from './NotificationDropdown';
import ChatWidget from './ChatWidget';

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

  const token = localStorage.getItem('agrigov_token');

  const getImageUrl = (url) => {
    if (!url) return 'https://via.placeholder.com/150';
    if (url.startsWith('http')) return url;
    return `${BASE_URL}${url}`;
  };

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
          <div className="p-4 border-t border-outline-variant/30">
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
              <>
                {/* Welcome Banner */}
                <div className="bg-primary/5 border border-primary/15 rounded-xl px-6 py-5 flex items-center gap-4">
                  <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>receipt_long</span>
                  <div>
                    <h1 className="text-xl font-black text-on-surface">Welcome back, {profile.full_name?.split(' ')[0] || 'User'}! 👋</h1>
                    <p className="text-on-surface-variant text-sm mt-0.5">Here is your complete order history</p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-on-surface tracking-tight">My Orders</h2>
                    <p className="text-on-surface-variant mt-1 text-sm">{orders.length} orders total</p>
                  </div>
                </div>

                {/* Orders List */}
                <section className="bg-surface rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden">
                  <div className="divide-y divide-outline-variant/20">
                    {orders.length > 0 ? orders.map(order => {
                      const sc = statusConfig[order.status] || statusConfig['Order Placed'];
                      return (
                        <div key={order.id} className="flex items-center gap-5 px-6 py-5 hover:bg-surface-container-lowest/50 transition-colors">
                          {/* Product image */}
                          <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-outline-variant/20 bg-slate-100">
                            <img src={order.img} alt={order.product} className="w-full h-full object-cover" />
                          </div>
                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-on-surface truncate">{order.product}</p>
                            <p className="text-xs text-on-surface-variant mt-0.5 flex items-center gap-1">
                              <span className="material-symbols-outlined text-[13px]">calendar_today</span>
                              {new Date(order.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                            <p className="text-xs text-on-surface-variant mt-0.5 font-mono">#{order.id}</p>
                          </div>
                          {/* Price */}
                          <p className="font-black text-primary text-lg shrink-0">{order.price}</p>
                          {/* Status badge */}
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${sc.color} shrink-0`}>
                            <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>{sc.icon}</span>
                            {order.status}
                          </span>
                        </div>
                      );
                    }) : (
                      <div className="p-12 text-center text-on-surface-variant font-medium">
                        No orders found. Start shopping to see your history!
                      </div>
                    )}
                  </div>
                </section>

                {/* Complaint button */}
                <div className="flex justify-center pt-2">
                  <button
                    onClick={() => setShowComplaintModal(true)}
                    className="flex items-center gap-2 px-6 py-3 border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl font-bold text-sm transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">report_problem</span>
                    Send a Complaint
                  </button>
                </div>
              </>
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
