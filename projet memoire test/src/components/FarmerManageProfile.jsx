import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateFarmerProfile, getFarmerProfile, clearAuth } from '../services/api';

export default function FarmerManageProfile() {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // 1. تعريف الـ State بجميع الحقول المطلوبة
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

  const [profilePic, setProfilePic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // 2. جلب البيانات (GET) عند تحميل الصفحة
  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        // نعيطو للـ API: profile/manage/ (GET)
        const data = await getFarmerProfile(); 
        
        setProfile({
          full_name: data.full_name || '',
          username: data.username || '',
          email: data.email || '',
          phone: data.phone || '',
          sex: data.sex || 'M',
          address: data.address || '',
          // هنا نجيبو بيانات الفلاح من داخل الأوبجيكت 'farmer' اللي يبعثو الباكند
          farmer_card: data.farmer?.farmer_card || '',
          farm_area: data.farmer?.farm_area || '',
          farm_location: data.farmer?.farm_location || '',
          password: '' // ديما نخلوه فارغ في العرض
        });

        // الصورة: نستعمل الحقل profile_photo_url اللي يجي من السيريالايزر
        if (data.profile_photo_url) {
          setProfilePic(data.profile_photo_url);
        }
      } catch (err) {
        console.error("Load Error:", err);
        setMessage('Failed to load profile data.');
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleImageClick = () => fileInputRef.current.click();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePic(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  // 3. حفظ البيانات (PATCH/PUT) إلى profile/manage/
  const handleSaveProfile = async () => {
    setLoading(true);
    setMessage('');
    
    const formData = new FormData();

    // إضافة بيانات المستخدم الأساسية
    formData.append('full_name', profile.full_name);
    formData.append('email', profile.email);
    formData.append('phone', profile.phone);
    formData.append('sex', profile.sex);
    formData.append('address', profile.address);
    if (profile.password) {
      formData.append('password', profile.password);
    }

    // إضافة بيانات الفلاح داخل 'extra_data' كـ JSON (لأن الباكند يقرأها هكذا)
    const farmerExtra = {
      farmer_card: profile.farmer_card,
      farm_location: profile.farm_location,
      farm_area: profile.farm_area
    };
    formData.append('extra_data', JSON.stringify(farmerExtra));

    // إضافة الصورة إذا تم اختيار ملف جديد
    if (fileInputRef.current.files[0]) {
      formData.append('profile_photo', fileInputRef.current.files[0]);
    }

    try {
      await updateFarmerProfile(formData);
      setMessage('Profile updated successfully! ✅');
    } catch (error) {
      console.error("Update Error:", error);
      setMessage('Update failed. Please check your connection.');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="bg-surface-container-lowest text-on-surface antialiased font-sans min-h-screen">
      <div className="flex min-h-screen relative">
        
        {/* Sidebar */}
        <aside className="hidden md:flex w-64 bg-surface border-r border-outline-variant/30 flex-col fixed h-full z-50">
          <div className="p-6 flex items-center gap-3">
            <div className="bg-primary p-2 rounded-lg text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">agriculture</span>
            </div>
            <h2 className="text-primary text-xl font-bold">AgriGov</h2>
          </div>
          <nav className="flex-1 px-4 space-y-2 mt-4">
            <a href="/farmer/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer">
              <span className="material-symbols-outlined">dashboard</span>
              <span className="font-medium">Dashboard</span>
            </a>
            <a href="/farmer/profile" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary text-on-primary shadow-md cursor-pointer">
              <span className="material-symbols-outlined">person</span>
              <span className="font-medium">Profile</span>
            </a>
          </nav>
          <div className="p-4 border-t border-outline-variant/30 text-center">
             <p className="text-xs font-bold text-primary italic uppercase tracking-widest">Farmer Portal</p>
          </div>
        </aside>

        {/* Main Body */}
        <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
          <header className="h-16 bg-surface border-b border-outline-variant/30 px-4 md:px-8 flex items-center justify-between sticky top-0 z-40">
            <div className="flex-1"></div>
            <button onClick={handleLogout} className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors text-sm font-semibold">
              <span className="material-symbols-outlined text-lg">logout</span> Logout
            </button>
          </header>

          <div className="p-4 md:p-8 space-y-8 flex-1 max-w-5xl mx-auto w-full">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl font-black">Farmer Profile</h1>
                <p className="text-on-surface-variant text-sm mt-1">Review and update your official registration details.</p>
              </div>
              <button 
                onClick={handleSaveProfile}
                disabled={loading}
                className="px-8 py-3 rounded-xl bg-primary text-on-primary font-bold text-sm hover:shadow-lg transition-all disabled:opacity-70"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>

            {message && (
              <div className={`p-4 rounded-xl font-bold border ${message.includes('successfully') ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                {message}
              </div>
            )}

            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />

            <section className="bg-surface rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden pb-8">
              <div className="h-32 bg-primary/5 relative"></div>
              <div className="px-6 md:px-10 -mt-12 flex flex-col md:flex-row items-end gap-6 border-b border-outline-variant/20 pb-8">
                <div className="relative group cursor-pointer" onClick={handleImageClick}>
                  <div className="size-32 rounded-full border-4 border-surface bg-surface-container bg-center bg-cover shadow-sm" style={{ backgroundImage: `url("${profilePic || '/default-avatar.png'}")` }}></div>
                  <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"><span className="material-symbols-outlined">photo_camera</span></div>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-black">{profile.full_name || 'Agri User'}</h2>
                  <p className="text-on-surface-variant text-sm font-medium">@{profile.username}</p>
                </div>
              </div>

              <div className="px-6 md:px-10 pt-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Account Details */}
                <div className="space-y-5">
                  <h3 className="font-extrabold text-primary uppercase text-xs tracking-widest border-b pb-2">Account Information</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-on-surface-variant uppercase ml-1">Full Name</label>
                      <input className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl px-4 py-2.5 outline-none focus:border-primary" name="full_name" value={profile.full_name} onChange={handleChange} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                        <label className="text-[10px] font-bold text-on-surface-variant uppercase ml-1">Phone</label>
                        <input className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl px-4 py-2.5 outline-none focus:border-primary" name="phone" value={profile.phone} onChange={handleChange} />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-on-surface-variant uppercase ml-1">Gender</label>
                        <select className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl px-4 py-2.5 outline-none focus:border-primary" name="sex" value={profile.sex} onChange={handleChange}>
                          <option value="M">Male</option>
                          <option value="F">Female</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-on-surface-variant uppercase ml-1">New Password</label>
                      <input className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl px-4 py-2.5 outline-none focus:border-primary" type="password" name="password" placeholder="Leave empty to keep current" value={profile.password} onChange={handleChange} />
                    </div>
                  </div>
                </div>

                {/* Farmer/Official Details */}
                <div className="space-y-5">
                  <h3 className="font-extrabold text-amber-600 uppercase text-xs tracking-widest border-b pb-2">Official Farm Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-on-surface-variant uppercase ml-1">Farm Address</label>
                      <textarea className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl px-4 py-2.5 outline-none focus:border-primary" name="address" rows="1" value={profile.address} onChange={handleChange}></textarea>
                    </div>
                    <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-2xl space-y-4">
                        <div>
                          <label className="text-[10px] font-bold text-amber-800 uppercase ml-1">Farmer Card Number</label>
                          <input className="w-full bg-white border border-amber-200 rounded-lg px-4 py-2.5 outline-none focus:border-amber-500" name="farmer_card" value={profile.farmer_card} onChange={handleChange} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-bold text-amber-800 uppercase ml-1">Area (Ha)</label>
                            <input className="w-full bg-white border border-amber-200 rounded-lg px-4 py-2.5 outline-none focus:border-amber-500" type="number" name="farm_area" value={profile.farm_area} onChange={handleChange} />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-amber-800 uppercase ml-1">Location</label>
                            <input className="w-full bg-white border border-amber-200 rounded-lg px-4 py-2.5 outline-none focus:border-amber-500" name="farm_location" value={profile.farm_location} onChange={handleChange} />
                          </div>
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