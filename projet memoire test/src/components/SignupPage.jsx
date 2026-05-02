import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// التأكد من استيراد دالة signup من الـ API المنظم
import { signup } from '../services/api';

import farmerImg from '../assets/farmer.jpg';
import buyerImg from '../assets/buyer.jpg';
import transporterImg from '../assets/transporter.jpg';

export default function SignupPage() {
  const [role, setRole] = useState('Farmer');
  const navigate  = useNavigate();
  const [loading, setLoading]   = useState(false);
  const [error,   setError]     = useState('');
  const [success, setSuccess]   = useState(false);

  // Common fields
  const [form, setForm] = useState({
    full_name: '', username: '', email: '', phone: '', sex: 'M', password: '', address: '',
  });
  
  // Role-specific fields
  const [extra, setExtra] = useState({
    farmer_card: '', farm_area: '', farm_location: '',
    registre_commerce: '',
    driver_license_number: '', license_type: 'Heavy Truck (Class C/E)', license_expiry_date: '', vehicle_name: '', vehicle_year: '',
  });

  const setF = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));
  const setE = (key) => (e) => setExtra(x => ({ ...x, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let extra_data = {};
      
      // تجهيز الداتا حسب الـ Role
      if (role === 'Farmer') {
        extra_data = { 
          farmer_card: extra.farmer_card, 
          farm_area: parseFloat(extra.farm_area), 
          farm_location: extra.farm_location 
        };
      } else if (role === 'Buyer') {
        extra_data = { registre_commerce: extra.registre_commerce };
      } else if (role === 'Transporter') {
        extra_data = { 
          driver_license_number: extra.driver_license_number, 
          license_type: extra.license_type, 
          license_expiry_date: extra.license_expiry_date, 
          vehicle_name: extra.vehicle_name, 
          vehicle_year: extra.vehicle_year ? parseInt(extra.vehicle_year) : null 
        };
      }

      // إرسال الطلب للـ Backend
      await signup({ ...form, role: role.toLowerCase(), extra_data });
      setSuccess(true);
    } catch (err) {
      // التعامل مع أخطاء الـ Validation (Django Rest Framework)
      const errData = err?.data || {};
      
      if (err?.status === 0) {
        setError('Cannot connect to server. Please check if backend is running.');
        return;
      }

      // تحويل أخطاء الـ JSON المعقدة إلى نص مفهوم (Flattening)
      const flattenMessages = (obj) => {
        let msgs = [];
        for (const [key, value] of Object.entries(obj)) {
          if (Array.isArray(value)) {
            msgs.push(`${key}: ${value.join(' ')}`);
          } else if (typeof value === 'object') {
            msgs.push(...flattenMessages(value));
          } else {
            msgs.push(`${key}: ${value}`);
          }
        }
        return msgs;
      };

      const messages = flattenMessages(errData);
      setError(messages.length ? messages.join(' | ') : (errData.error || 'Registration failed.'));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#fcfdf6] flex items-center justify-center p-8">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-green-600 text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 font-headline mb-3">Account Submitted!</h2>
          <p className="text-gray-600 mb-8">Your account is now under review by the ministry administration. You will receive an email once it's approved.</p>
          <Link to="/login" className="inline-flex items-center gap-2 bg-[#386a20] text-white font-bold px-8 py-3 rounded-xl hover:bg-[#2d5519] transition-all">
            <span className="material-symbols-outlined">login</span> Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fcfdf6] font-body text-gray-900 antialiased overflow-x-hidden">
      <main className="min-h-screen flex flex-col md:flex-row">
        {/* Left Side (Image & Brand) */}
        <section className="relative hidden md:flex md:w-5/12 lg:w-1/2 flex-col justify-between p-12 overflow-hidden bg-black text-white">
          <div className="absolute inset-0 z-0">
            <img 
              alt={`${role} background`} 
              className="w-full h-full object-cover opacity-80 transition-opacity duration-500" 
              src={
                role === 'Farmer' 
                  ? farmerImg
                  : role === 'Buyer'
                  ? buyerImg
                  : transporterImg
              } 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-16">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>agriculture</span>
              </div>
              <span className="text-2xl font-black tracking-tighter font-headline uppercase">AgriGov</span>
            </div>
          </div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10">
              <span className="material-symbols-outlined text-green-200">verified_user</span>
              <div>
                <p className="text-xs uppercase tracking-widest font-bold text-green-200">Identity Protocol</p>
                <p className="text-sm font-medium">Government Verified Marketplace</p>
              </div>
            </div>
          </div>
        </section>

        {/* Right Side (Form) */}
        <section className="flex-1 flex flex-col items-center justify-center px-6 py-12 md:px-16 lg:px-24 bg-white">
          <div className="w-full max-w-xl">
            <header className="mb-8">
              <h2 className="text-4xl font-extrabold font-headline text-[#386a20] mb-3">Join AgriGov</h2>
              <p className="text-gray-600 font-medium">Select your role and provide your details to join the agricultural marketplace.</p>
            </header>

            {/* Error Banner */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                <span className="material-symbols-outlined text-red-600 text-xl flex-shrink-0">error</span>
                <p className="text-sm font-medium text-red-700">{error}</p>
              </div>
            )}

            {/* Role Selection */}
            <div className="mb-8">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Select Your Identity</label>
              <div className="grid grid-cols-3 gap-3">
                {[['Farmer', 'agriculture'], ['Buyer', 'shopping_basket'], ['Transporter', 'local_shipping']].map(([r, icon]) => (
                  <button key={r} type="button" onClick={() => setRole(r)}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-300 ${role === r ? 'border-[#386a20] bg-green-50 text-[#386a20]' : 'border-transparent bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>
                    <span className="material-symbols-outlined mb-2" style={role === r ? { fontVariationSettings: "'FILL' 1" } : {}}>{icon}</span>
                    <span className="text-xs font-bold">{r}</span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Section 01 — Personal Details */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-2">
                  <span className="w-6 h-6 rounded-full bg-[#386a20] text-white text-[10px] flex items-center justify-center font-bold">01</span>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-[#386a20]">Personal Details</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {[['Full Name', 'full_name', 'text', 'John Doe'],['Username', 'username', 'text', 'johndoe_agri'],['Email Address', 'email', 'email', 'john@agrigov.dz'],['Phone Number', 'phone', 'tel', '+213 550 00 00 00']].map(([label, key, type, ph]) => (
                    <div key={key} className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700">{label}</label>
                      <input className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-[#386a20] focus:ring-1 focus:ring-[#386a20] outline-none transition-all"
                        required placeholder={ph} type={type} value={form[key]} onChange={setF(key)} />
                    </div>
                  ))}
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">Gender</label>
                    <select className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 outline-none" value={form.sex} onChange={setF('sex')}>
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">Password</label>
                    <input className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 outline-none"
                      required placeholder="••••••••" type="password" value={form.password} onChange={setF('password')} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Residential Address</label>
                  <textarea className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 outline-none resize-none"
                    required placeholder="Street, City, Province" rows="2" value={form.address} onChange={setF('address')} />
                </div>
              </div>

              {/* Section 02 — Role Specific Fields */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-2">
                  <span className="w-6 h-6 rounded-full bg-[#386a20] text-white text-[10px] flex items-center justify-center font-bold">02</span>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-[#386a20]">{role} Credentials</h3>
                </div>

                {role === 'Farmer' && (
                  <div className="space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700">Farmer Card Number</label>
                      <input className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 outline-none"
                        required placeholder="F-8892-XXXX" type="text" value={extra.farmer_card} onChange={setE('farmer_card')} />
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Farm Area (Ha)</label>
                        <input className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 outline-none"
                          required placeholder="25.5" type="number" step="0.1" value={extra.farm_area} onChange={setE('farm_area')} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Farm Location</label>
                        <input className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 outline-none"
                          required placeholder="City, Province" type="text" value={extra.farm_location} onChange={setE('farm_location')} />
                      </div>
                    </div>
                  </div>
                )}

                {role === 'Buyer' && (
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">Commercial Register Number</label>
                    <input className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 outline-none"
                      required placeholder="CR-2026-XYZ" type="text" value={extra.registre_commerce} onChange={setE('registre_commerce')} />
                  </div>
                )}

                {role === 'Transporter' && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">License Number</label>
                        <input className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 outline-none"
                          required placeholder="DL-123456" type="text" value={extra.driver_license_number} onChange={setE('driver_license_number')} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">License Type</label>
                        <select className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 outline-none" value={extra.license_type} onChange={setE('license_type')}>
                          <option>Heavy Truck (Class C/E)</option>
                          <option>Light Commercial</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Vehicle Name</label>
                        <input className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 outline-none"
                          required placeholder="Toyota Hilux" type="text" value={extra.vehicle_name} onChange={setE('vehicle_name')} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Expiry Date</label>
                        <input className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 outline-none"
                          required type="date" value={extra.license_expiry_date} onChange={setE('license_expiry_date')} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button type="submit" disabled={loading}
                className="w-full py-4 bg-[#386a20] text-white font-bold rounded-xl shadow-lg hover:bg-[#2d5519] transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                {loading ? (
                  <><span className="animate-spin material-symbols-outlined text-lg">progress_activity</span> Processing...</>
                ) : (
                  <><span>Create {role} Account</span><span className="material-symbols-outlined">arrow_forward</span></>
                )}
              </button>

              <p className="text-center text-sm text-gray-500">
                Already have an account? <Link to="/login" className="text-[#386a20] font-bold hover:underline">Log in</Link>
              </p>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}