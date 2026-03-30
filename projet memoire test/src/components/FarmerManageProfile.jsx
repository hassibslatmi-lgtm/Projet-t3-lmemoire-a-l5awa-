import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFarmerProfile, updateFarmerProfile, clearAuth } from '../services/api';

const BASE_URL = 'http://127.0.0.1:8000';

export default function FarmerManageProfile() {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // States matching Signup fields for Farmer
  const [profile, setProfile] = useState({
    full_name: '',
    username: '',
    email: '',
    phone: '',
    sex: 'M',
    password: '',
    address: '',
    farmer_card: '',
    farm_area: '',
    farm_location: ''
  });

  const [profilePic, setProfilePic] = useState('https://via.placeholder.com/150');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState('');

  // Fetch real data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getFarmerProfile();
        setProfile({
          full_name: data.full_name || '',
          username: data.username || '',
          email: data.email || '',
          phone: data.phone || '',
          sex: data.sex || 'M',
          password: '', // Always empty for security
          address: data.address || '',
          farmer_card: data.farmer?.farmer_card || '',
          farm_area: data.farmer?.farm_area || '',
          farm_location: data.farmer?.farm_location || ''
        });

        // Use profile_photo_url from backend if available
        if (data.profile_photo_url) {
          setProfilePic(data.profile_photo_url);
        } else if (data.profile_photo) {
          const fullUrl = data.profile_photo.startsWith('http')
            ? data.profile_photo
            : `${BASE_URL}${data.profile_photo}`;
          setProfilePic(fullUrl);
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        setMessage('Could not load profile data.');
      } finally {
        setFetching(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setMessage('');

    try {
      const formData = new FormData();

      // Basic Info
      formData.append('full_name', profile.full_name);
      formData.append('username', profile.username);
      formData.append('email', profile.email);
      formData.append('phone', profile.phone);
      formData.append('sex', profile.sex);
      formData.append('address', profile.address);
      if (profile.password) formData.append('password', profile.password);

      // Farmer Specific Extra Data
      const extra_data = {
        farmer_card: profile.farmer_card,
        farm_area: profile.farm_area,
        farm_location: profile.farm_location
      };
      formData.append('extra_data', JSON.stringify(extra_data));

      // Image Handling - Match backend field: profile_photo
      if (fileInputRef.current?.files[0]) {
        formData.append('profile_photo', fileInputRef.current.files[0]);
      }

      await updateFarmerProfile(formData);
      setMessage('Profile updated successfully!');

      // Optional: hide password after save
      setProfile(prev => ({ ...prev, password: '' }));

    } catch (error) {
      const errorMsg = error.data?.error || 'Failed to update profile. Please try again.';
      setMessage(errorMsg);
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-container-lowest">
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
          <p className="text-on-surface-variant font-bold">Loading Profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest text-on-surface antialiased font-sans min-h-screen">
      <div className="flex min-h-screen relative">

        {/* Sidebar */}
        <aside className="hidden md:flex w-64 bg-surface border-r border-outline-variant/30 flex-col fixed h-full z-50">
          <div className="p-6 flex items-center gap-3">
            <div className="bg-primary p-2 rounded-lg text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>agriculture</span>
            </div>
            <h2 className="text-primary text-xl font-bold tracking-tight">AgriGov</h2>
          </div>
          <nav className="flex-1 px-4 space-y-2 mt-4">
            <div onClick={() => navigate('/farmer/dashboard')} className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer font-medium">
              <span className="material-symbols-outlined">dashboard</span>
              <span>Dashboard</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary text-on-primary shadow-md shadow-primary/20 cursor-pointer font-medium">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
              <span>Profile</span>
            </div>
            <div onClick={() => navigate('/farmer/products')} className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer font-medium">
              <span className="material-symbols-outlined">inventory_2</span>
              <span>My Products</span>
            </div>
          </nav>

          <div className="p-4 border-t border-outline-variant/30">
            <div className="flex items-center gap-3 p-2 bg-surface-container rounded-xl cursor-default">
              <div className="w-10 h-10 rounded-full bg-center bg-cover border border-outline-variant/50" style={{ backgroundImage: `url("${profilePic}")` }}></div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold truncate text-on-surface">{profile.full_name || 'Farmer'}</p>
                <p className="text-xs text-on-surface-variant truncate">Farmer Account</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Body */}
        <main className="flex-1 md:ml-64 flex flex-col min-h-screen">

          {/* Header */}
          <header className="h-16 bg-surface border-b border-outline-variant/30 px-4 md:px-8 flex items-center justify-between sticky top-0 z-40">
            <div className="md:hidden flex items-center gap-2 text-primary font-bold text-lg mr-4">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>agriculture</span>
            </div>
            <div className="flex-1 max-w-md hidden sm:block">
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">search</span>
                <input className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" placeholder="Search resources..." type="text" />
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
          <div className="p-4 md:p-8 space-y-8 flex-1 max-w-5xl mx-auto w-full">

            {/* Page Title & Actions */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl font-black text-on-surface font-headline tracking-tight">Farmer Profile</h1>
                <p className="text-on-surface-variant mt-1 text-sm">Review and update your official registration details.</p>
              </div>
              <div className="flex gap-3">
                <button className="px-6 py-2.5 rounded-xl border border-outline-variant/50 text-on-surface-variant font-bold text-sm hover:bg-surface-container-high transition-colors">
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-sm hover:shadow-md flex items-center gap-2 transition-all disabled:opacity-70"
                >
                  {loading ? <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span> : null}
                  Save Changes
                </button>
              </div>
            </div>

            {/* Notification Message */}
            {message && (
              <div className={`p-4 rounded-xl font-bold flex items-center gap-2 ${message.includes('successfully') ? 'bg-green-100/50 text-green-800 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                <span className="material-symbols-outlined">{message.includes('successfully') ? 'check_circle' : 'error'}</span>
                {message}
              </div>
            )}

            {/* Hidden File Input for Image Upload */}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />

            {/* Profile Card Section */}
            <section className="bg-surface rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden pb-8">
              <div className="h-32 bg-surface-container-high relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/10"></div>
                {/* Decorative Pattern overlay */}
                <div className="absolute inset-0 opacity-10 mix-blend-overlay" style={{ backgroundImage: "radial-gradient(var(--tw-colors-primary) 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
              </div>
              <div className="px-6 md:px-10 -mt-12 flex flex-col md:flex-row items-end gap-6 relative z-10 border-b border-outline-variant/20 pb-8">
                <div className="relative group cursor-pointer" onClick={handleImageClick}>
                  <div
                    className="size-32 rounded-full border-4 border-surface bg-surface-container overflow-hidden shadow-md bg-center bg-cover transition-transform group-hover:scale-[1.02]"
                    style={{ backgroundImage: `url("${profilePic}")` }}
                  ></div>
                  <button className="absolute bottom-1 right-1 size-8 bg-primary text-on-primary rounded-full flex items-center justify-center border-2 border-surface shadow-sm hover:brightness-110 transition-colors">
                    <span className="material-symbols-outlined text-sm">photo_camera</span>
                  </button>
                </div>
                <div className="flex-1 pb-2">
                  <h2 className="text-2xl font-black font-headline text-on-surface">{profile.full_name || 'Your Name'}</h2>
                  <p className="text-on-surface-variant font-medium text-sm mt-1">Username: <span className="text-primary font-bold">@{profile.username}</span> • Member since recently</p>
                </div>
                <button
                  onClick={handleImageClick}
                  className="mb-2 flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/50 text-on-surface-variant font-bold text-xs uppercase tracking-wider hover:bg-surface-container transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                  Edit Photo
                </button>
              </div>

              <div className="px-6 md:px-10 pt-8 grid grid-cols-1 lg:grid-cols-2 gap-12">

                {/* Account Information Column */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-outline-variant/30 pb-3">
                    <span className="material-symbols-outlined text-primary bg-primary/10 p-1.5 rounded-lg">person</span>
                    <h3 className="font-extrabold text-on-surface tracking-tight uppercase text-sm">Account Information</h3>
                  </div>
                  <div className="space-y-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-on-surface-variant flex items-center gap-1 uppercase tracking-wider">
                        Full Name
                      </label>
                      <input className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl px-4 py-2.5 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium"
                        type="text" name="full_name" value={profile.full_name} onChange={handleChange} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-on-surface-variant flex items-center gap-1 uppercase tracking-wider">
                        Username
                      </label>
                      <input className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl px-4 py-2.5 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium"
                        type="text" name="username" value={profile.username} onChange={handleChange} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-on-surface-variant flex items-center gap-1 uppercase tracking-wider">
                        Email Address
                      </label>
                      <input className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl px-4 py-2.5 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium"
                        type="email" name="email" value={profile.email} onChange={handleChange} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Gender</label>
                        <select className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl px-4 py-2.5 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium"
                          name="sex" value={profile.sex} onChange={handleChange}>
                          <option value="M">Male</option>
                          <option value="F">Female</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Phone Number</label>
                        <input className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl px-4 py-2.5 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium"
                          type="tel" name="phone" value={profile.phone} onChange={handleChange} />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Change Password</label>
                      <input className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl px-4 py-2.5 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-outline/40 font-medium"
                        type="password" name="password" placeholder="Leave blank to keep unchanged" value={profile.password} onChange={handleChange} />
                    </div>
                  </div>
                </div>

                {/* Farm Details Column */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-outline-variant/30 pb-3">
                    <span className="material-symbols-outlined text-amber-600 bg-amber-50 p-1.5 rounded-lg">home_pin</span>
                    <h3 className="font-extrabold text-on-surface tracking-tight uppercase text-sm">Farm Details</h3>
                  </div>
                  <div className="space-y-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Residential Address</label>
                      <textarea className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl px-4 py-2.5 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium resize-none min-h-[50px]"
                        name="address" rows="2" value={profile.address} onChange={handleChange}></textarea>
                    </div>

                    <div className="flex flex-col gap-1.5 pt-2">
                      <label className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1 mb-1">
                        <span className="material-symbols-outlined text-sm">verified</span>
                        Official Farmer Credentials
                      </label>
                      <div className="p-5 bg-surface-container-lowest border border-primary/20 rounded-xl space-y-4 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                          <span className="material-symbols-outlined text-8xl" style={{ fontVariationSettings: "'FILL' 1" }}>policy</span>
                        </div>
                        <div className="relative z-10 flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Farmer Card Number</label>
                          <input className="w-full bg-surface border border-outline-variant/50 rounded-lg px-4 py-2.5 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none font-medium"
                            type="text" name="farmer_card" value={profile.farmer_card} onChange={handleChange} />
                        </div>
                        <div className="relative z-10 grid grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider text-[10px]">Area (Ha)</label>
                            <input className="w-full bg-surface border border-outline-variant/50 rounded-lg px-4 py-2.5 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none font-medium"
                              type="number" step="0.1" name="farm_area" value={profile.farm_area} onChange={handleChange} />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider text-[10px]">Location</label>
                            <input className="w-full bg-surface border border-outline-variant/50 rounded-lg px-4 py-2.5 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none font-medium"
                              type="text" name="farm_location" value={profile.farm_location} onChange={handleChange} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </section>

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
    </div>
  );
}