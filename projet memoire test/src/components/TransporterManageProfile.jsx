import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NotificationDropdown from './NotificationDropdown';

export default function TransporterManageProfile() {
  const [profile, setProfile] = useState({
    full_name: '',
    phone: '',
    username: '',
    email: '',
  });
  const [transporterData, setTransporterData] = useState({
    driver_license_number: '',
    license_type: '',
    vehicle_name: '',
    license_expiry_date: ''
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [alert, setAlert] = useState({ type: '', message: '' });

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('agrigov_token');
  const API_URL = 'http://127.0.0.1:8000/users/profile/manage/';

  // Initial Data Fetch (GET)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(API_URL, {
          headers: { Authorization: `Token ${token}` },
        });
        const data = response.data;
        setProfile({
          full_name: data.full_name || '',
          phone: data.phone || '',
          username: data.username || '',
          email: data.email || '',
        });
        if (data.transporter) {
          setTransporterData({
            driver_license_number: data.transporter.driver_license_number || '',
            license_type: data.transporter.license_type || '',
            vehicle_name: data.transporter.vehicle_name || '',
            license_expiry_date: data.transporter.license_expiry_date || ''
          });
        }
        if (data.profile_photo_url) {
          setPreviewImage(data.profile_photo_url);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        showAlert('error', 'Failed to load profile data. Check your connection.');
      } finally {
        setFetching(false);
      }
    };
    fetchProfile();
  }, [token]);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: '', message: '' }), 4000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleTransporterInputChange = (e) => {
    const { name, value } = e.target;
    setTransporterData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Update Functionality (PATCH)
  const handleSave = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    const formData = new FormData();
    formData.append('full_name', profile.full_name);
    formData.append('phone', profile.phone);
    formData.append('username', profile.username);
    formData.append('email', profile.email);
    formData.append('extra_data', JSON.stringify(transporterData));
    
    if (selectedFile) {
      formData.append('profile_photo', selectedFile);
    }

    try {
      await axios.patch(API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Token ${token}`,
        },
      });
      showAlert('success', 'Profile updated successfully! ✅');
      
      // Post-Update Sync: Page Refresh
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMsg = error.response?.data?.error || 'Update failed. Please check your data.';
      showAlert('error', errorMsg);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('agrigov_token');
    localStorage.removeItem('agrigov_role');
    navigate('/login');
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#2D5A27]/20 border-t-[#2D5A27] rounded-full animate-spin"></div>
          <p className="text-gray-600 font-bold">Fetching Profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest text-on-surface antialiased font-sans min-h-screen flex">
      {/* Sidebar - Consistent with Dashboard */}
      <aside className="hidden lg:flex w-64 bg-surface border-r border-outline-variant/30 flex-col fixed h-full z-50">
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
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary text-on-primary shadow-md shadow-primary/20 cursor-pointer font-medium">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
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
           <div className="flex items-center gap-3 p-2 bg-surface-container rounded-xl">
             <img src={previewImage || 'https://ui-avatars.com/api/?name=User'} className="w-10 h-10 rounded-full object-cover border border-outline-variant/50" alt="Profile" />
             <div className="flex-1 overflow-hidden">
               <p className="text-xs font-bold truncate text-on-surface">{profile.full_name || 'Transporter'}</p>
               <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Transporter</p>
             </div>
           </div>
        </div>
      </aside>

      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-16 bg-white border-b border-outline-variant/30 px-6 flex items-center justify-between sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-bold text-on-surface lg:block hidden">Manage Profile</h1>
          </div>
          <div className="flex items-center gap-4">
            <NotificationDropdown role="transporter" />
            <div className="h-8 w-px bg-outline-variant/30 mx-2"></div>
            <button onClick={handleLogout} className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors text-sm font-bold">
              <span className="material-symbols-outlined text-lg">logout</span>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Centered Content Area */}
        <div className="flex-1 p-6 md:p-12 flex justify-center items-start">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
            {/* Header / Banner */}
            <div className="h-32 bg-gradient-to-r from-[#2D5A27] to-[#3A7532] relative">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/graphy.png')" }}></div>
            </div>

            {/* Profile Avatar Overlay */}
            <div className="px-8 pb-10 -mt-16 relative">
              <div className="flex flex-col items-center">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-xl overflow-hidden relative">
                    <img 
                      src={previewImage || 'https://ui-avatars.com/api/?name=User'} 
                      alt="Profile Preview"
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    />
                  </div>
                  <button 
                    onClick={() => fileInputRef.current.click()}
                    className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-white text-3xl">photo_camera</span>
                  </button>
                  <input 
                    type="file" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleImageChange} 
                    accept="image/*"
                  />
                </div>
                <h2 className="mt-4 text-2xl font-black text-gray-900">{profile.full_name || 'Your Name'}</h2>
                <p className="text-[#2D5A27] font-bold text-sm">@{profile.username || 'username'}</p>
              </div>

              {/* Alerts */}
              {alert.message && (
                <div className={`mt-6 p-4 rounded-xl flex items-center gap-3 animate-bounce ${alert.type === 'success' ? 'bg-green-50 text-green-800 border border-green-100' : 'bg-red-50 text-red-800 border border-red-100'}`}>
                  <span className="material-symbols-outlined">{alert.type === 'success' ? 'check_circle' : 'error'}</span>
                  <p className="font-bold text-sm">{alert.message}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSave} className="mt-10 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                    <input 
                      type="text" 
                      name="full_name"
                      value={profile.full_name}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-[#2D5A27]/10 focus:border-[#2D5A27] outline-none transition-all font-semibold"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Phone Number</label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={profile.phone}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-[#2D5A27]/10 focus:border-[#2D5A27] outline-none transition-all font-semibold"
                      placeholder="+213 5XX XX XX XX"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Username</label>
                  <input 
                    type="text" 
                    name="username"
                    value={profile.username}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 bg-gray-100 border border-gray-200 rounded-2xl text-gray-500 cursor-not-allowed font-semibold"
                    readOnly
                  />
                  <p className="text-[10px] text-gray-400 ml-2">Username cannot be modified after registration.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={profile.email}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-[#2D5A27]/10 focus:border-[#2D5A27] outline-none transition-all font-semibold"
                    placeholder="email@example.com"
                    required
                  />
                </div>

                {/* Transporter Credentials Section */}
                <div className="mt-8 pt-8 border-t border-gray-100">
                  <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#2D5A27]">local_shipping</span>
                    Transporter Credentials
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">License Number</label>
                      <input 
                        type="text" 
                        name="driver_license_number"
                        value={transporterData.driver_license_number}
                        onChange={handleTransporterInputChange}
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-[#2D5A27]/10 focus:border-[#2D5A27] outline-none transition-all font-semibold"
                        placeholder="DL-123456"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">License Type</label>
                      <select 
                        name="license_type"
                        value={transporterData.license_type}
                        onChange={handleTransporterInputChange}
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-[#2D5A27]/10 focus:border-[#2D5A27] outline-none transition-all font-semibold cursor-pointer appearance-none"
                        required
                      >
                        <option value="">Select License Type</option>
                        <option value="Heavy Truck (Class C/E)">Heavy Truck (Class C/E)</option>
                        <option value="Light Commercial">Light Commercial</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Vehicle Name</label>
                      <input 
                        type="text" 
                        name="vehicle_name"
                        value={transporterData.vehicle_name}
                        onChange={handleTransporterInputChange}
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-[#2D5A27]/10 focus:border-[#2D5A27] outline-none transition-all font-semibold"
                        placeholder="Toyota Hilux"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Expiry Date</label>
                      <input 
                        type="date" 
                        name="license_expiry_date"
                        value={transporterData.license_expiry_date}
                        onChange={handleTransporterInputChange}
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-[#2D5A27]/10 focus:border-[#2D5A27] outline-none transition-all font-semibold cursor-pointer"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <button 
                    type="submit"
                    disabled={isUpdating}
                    className="w-full py-4 bg-[#2D5A27] text-white font-black text-lg rounded-2xl shadow-xl shadow-[#2D5A27]/20 hover:bg-[#23461E] hover:scale-[1.01] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpdating ? (
                      <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <span className="material-symbols-outlined">save</span>
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
