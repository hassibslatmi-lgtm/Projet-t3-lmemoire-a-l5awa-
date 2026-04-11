import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationDropdown from './NotificationDropdown';

export default function TransporterManageProfile() {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Mock static states for Transporter Profile Interface (no backend)
  const [profile, setProfile] = useState({
    full_name: 'Ahmed Transporter',
    username: 'ahmed_transport',
    email: 'ahmed.transporter@agrigov.dz',
    phone: '+213 550 12 34 56',
    sex: 'M',
    password: '',
    address: 'Alger, Algeria',
    driver_license_number: 'DL-8892-XXXX',
    license_type: 'Heavy Truck (Class C/E)',
    license_expiry_date: '2028-12-31',
    vehicle_name: 'Toyota Hilux Cargo',
    vehicle_year: '2022'
  });

  const [profilePic, setProfilePic] = useState('https://images.unsplash.com/photo-1541703138379-99a3c9b74074?auto=format&fit=crop&q=80&w=300');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

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
    // Basic mock logout
    localStorage.removeItem('agrigov_token');
    localStorage.removeItem('agrigov_role');
    navigate('/login');
  };

  const handleSaveProfile = () => {
    setLoading(true);
    setMessage('');

    // Mock an API call duration
    setTimeout(() => {
      setLoading(false);
      setMessage('Profile updated successfully! (Mocked Frontend Update)');
      setProfile(prev => ({ ...prev, password: '' }));
      
      // Auto-hide message
      setTimeout(() => setMessage(''), 3000);
    }, 1500);
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
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary text-on-primary shadow-md shadow-primary/20 cursor-pointer font-medium">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
              <span>Profile</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer font-medium"
                 onClick={() => navigate('/transporter/requests')}>
              <span className="material-symbols-outlined">assignment</span>
              <span>Requests</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer font-medium">
              <span className="material-symbols-outlined">local_shipping</span>
              <span>My Missions</span>
            </div>
          </nav>

          <div className="p-4 border-t border-outline-variant/30">
            <div className="flex items-center gap-3 p-2 bg-surface-container rounded-xl cursor-default">
              <div className="w-10 h-10 rounded-full bg-center bg-cover border border-outline-variant/50" style={{ backgroundImage: `url("${profilePic}")` }}></div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold truncate text-on-surface">{profile.full_name || 'Transporter'}</p>
                <p className="text-xs text-on-surface-variant truncate">Transporter Account</p>
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
              <NotificationDropdown role="transporter" />
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
                <h1 className="text-3xl font-black text-primary font-headline tracking-tight">Transporter Profile</h1>
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
                      <input className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl px-4 py-2.5 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium bg-surface-container text-on-surface-variant cursor-not-allowed"
                        type="text" value={profile.username} readOnly />
                      <p className="text-[10px] text-on-surface-variant ml-1 font-medium">Username cannot be changed after registration.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-on-surface-variant flex items-center gap-1 uppercase tracking-wider">
                          Email Address
                        </label>
                        <input className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl px-4 py-2.5 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium"
                          type="email" name="email" value={profile.email} onChange={handleChange} />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-on-surface-variant flex items-center gap-1 uppercase tracking-wider">
                          Phone Number
                        </label>
                        <input className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl px-4 py-2.5 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium relative"
                          type="tel" name="phone" value={profile.phone} onChange={handleChange} />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-on-surface-variant flex items-center gap-1 uppercase tracking-wider">
                        Gender
                      </label>
                      <select className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl px-4 py-2.5 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium"
                        name="sex" value={profile.sex} onChange={handleChange}>
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-on-surface-variant flex items-center gap-1 uppercase tracking-wider">
                        Address
                      </label>
                      <textarea className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl px-4 py-2.5 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium resize-none"
                        name="address" rows="2" value={profile.address} onChange={handleChange}></textarea>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-on-surface-variant flex items-center gap-1 uppercase tracking-wider">
                        <span className="material-symbols-outlined text-[14px]">lock</span> Password
                      </label>
                      <input className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl px-4 py-2.5 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium placeholder-on-surface-variant/50"
                        type="password" name="password" placeholder="Leave blank to keep current password" value={profile.password} onChange={handleChange} />
                    </div>
                  </div>
                </div>

                {/* Transporter Details Column */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-outline-variant/30 pb-3">
                    <span className="material-symbols-outlined text-primary bg-primary/10 p-1.5 rounded-lg" style={{ fontVariationSettings: "'FILL' 1" }}>local_shipping</span>
                    <h3 className="font-extrabold text-on-surface tracking-tight uppercase text-sm">Transporter Logistics</h3>
                  </div>
                  <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-2xl p-6 shadow-sm">
                    <div className="space-y-5">
                      
                      {/* Driver's License */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-on-surface flex items-center gap-1 uppercase tracking-wider">
                          License Number
                        </label>
                        <input className="w-full bg-white border border-outline-variant/50 rounded-xl px-4 py-2.5 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium shadow-sm"
                          type="text" name="driver_license_number" value={profile.driver_license_number} onChange={handleChange} />
                      </div>

                      <div className="grid grid-cols-2 gap-5">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-on-surface flex items-center gap-1 uppercase tracking-wider">
                            License Type
                          </label>
                          <select className="w-full bg-white border border-outline-variant/50 rounded-xl px-4 py-2.5 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium shadow-sm"
                            name="license_type" value={profile.license_type} onChange={handleChange}>
                            <option>Heavy Truck (Class C/E)</option>
                            <option>Light Commercial</option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-on-surface flex items-center gap-1 uppercase tracking-wider">
                            Expiry Date
                          </label>
                          <input className="w-full bg-white border border-outline-variant/50 rounded-xl px-4 py-2.5 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium shadow-sm"
                            type="date" name="license_expiry_date" value={profile.license_expiry_date} onChange={handleChange} />
                        </div>
                      </div>

                      {/* Vehicle Details */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-on-surface flex items-center gap-1 uppercase tracking-wider">
                          Vehicle Name / Model
                        </label>
                        <input className="w-full bg-white border border-outline-variant/50 rounded-xl px-4 py-2.5 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium shadow-sm"
                          type="text" name="vehicle_name" value={profile.vehicle_name} onChange={handleChange} placeholder="e.g. Toyota Hilux" />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-on-surface flex items-center gap-1 uppercase tracking-wider">
                          Vehicle Year
                        </label>
                        <input className="w-full bg-white border border-outline-variant/50 rounded-xl px-4 py-2.5 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium shadow-sm"
                          type="number" name="vehicle_year" value={profile.vehicle_year} onChange={handleChange} placeholder="e.g. 2021" />
                      </div>

                      {/* Warning Box */}
                      <div className="mt-6 bg-surface-container p-4 rounded-xl flex gap-3 border border-outline-variant/50">
                        <span className="material-symbols-outlined text-primary text-xl flex-shrink-0">verified_user</span>
                        <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
                          Your logistical information helps our platform match you with nearby farmers. 
                          False information may result in a permanent ban.
                        </p>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
