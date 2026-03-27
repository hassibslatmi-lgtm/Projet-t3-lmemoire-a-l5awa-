import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../services/api';

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
      if (role === 'Farmer')      extra_data = { farmer_card: extra.farmer_card, farm_area: parseFloat(extra.farm_area), farm_location: extra.farm_location };
      if (role === 'Buyer')       extra_data = { registre_commerce: extra.registre_commerce };
      if (role === 'Transporter') extra_data = { driver_license_number: extra.driver_license_number, license_type: extra.license_type, license_expiry_date: extra.license_expiry_date, vehicle_name: extra.vehicle_name, vehicle_year: extra.vehicle_year ? parseInt(extra.vehicle_year) : null };

      await signup({ ...form, role: role.toLowerCase(), extra_data });
      setSuccess(true);
    } catch (err) {
      const errData = err?.data || {};
      // Handle network error (server not running)
      if (err?.status === 0) {
        setError(errData.error || 'Cannot connect to server.');
        return;
      }
      // Flatten Django REST Framework error object (can be nested: { field: ["msg"] })
      const flatten = (obj, prefix = '') =>
        Object.entries(obj).flatMap(([k, v]) =>
          Array.isArray(v)
            ? v.map(s => `${prefix}${k}: ${s}`)
            : typeof v === 'object' && v !== null
              ? flatten(v, `${k} — `)
              : [`${prefix}${k}: ${v}`]
        );
      const messages = flatten(errData);
      setError(messages.length ? messages.join('  •  ') : 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-8">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-green-600 text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          </div>
          <h2 className="text-3xl font-extrabold text-on-surface font-headline mb-3">Account Submitted!</h2>
          <p className="text-on-surface-variant mb-8">Your account is now under review by the ministry administration. You will receive an email once it's approved.</p>
          <Link to="/login" className="inline-flex items-center gap-2 bg-primary text-white font-bold px-8 py-3 rounded-xl hover:bg-primary/90 transition-all">
            <span className="material-symbols-outlined">login</span> Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background font-body text-on-surface antialiased overflow-x-hidden">
      <main className="min-h-screen flex flex-col md:flex-row">
        {/* Left Side */}
        <section className="relative hidden md:flex md:w-5/12 lg:w-1/2 flex-col justify-between p-12 overflow-hidden bg-primary text-white">
          <div className="absolute inset-0 z-0">
            <img alt="Lush rolling green hills" className="w-full h-full object-cover opacity-60"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCm8BXKcuLAyWgf3Te62kNpdJxrMEJbJz_TGdza1hpv2esVWw1E0ervJiRV7GHs_NVLVWN87T7uUJ6S1-WgxA8Yy2X5rqGph05XbqoVMfQlGRALnUIJ47BXOCLjT7F-5aIFpA4dW3WrVdFioNjS5YawCn2k6uwF7FCBFjJtL_fdn6qSha2IWIF1ep4XizvPxvYra-OW5ipzy0WP6DSIPx3T9mJHoQ8HgtPsg3ZB1iy6IihXHRE53CLFLkK-n2w0kr608OKnVjWqqMk"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-primary/40 via-primary/80 to-primary"></div>
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-16">
              <div className="w-10 h-10 bg-primary-fixed rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>agriculture</span>
              </div>
              <span className="text-2xl font-black tracking-tighter font-headline">AgriGov</span>
            </div>
          </div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10">
              <span className="material-symbols-outlined text-secondary-fixed">verified_user</span>
              <div>
                <p className="text-xs uppercase tracking-widest font-bold text-secondary-fixed">Identity Protocol</p>
                <p className="text-sm font-medium">Government Verified Marketplace</p>
              </div>
            </div>
          </div>
        </section>

        {/* Right Side */}
        <section className="flex-1 flex flex-col items-center justify-center px-6 py-12 md:px-16 lg:px-24 bg-surface">
          <div className="w-full max-w-xl">
            <div className="md:hidden flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>agriculture</span>
              </div>
              <span className="font-headline font-black text-2xl tracking-tight text-primary">AgriGov</span>
            </div>

            <header className="mb-8">
              <h2 className="text-4xl font-extrabold font-headline text-primary mb-3">Join AgriGov</h2>
              <p className="text-on-surface-variant font-medium">Select your role and provide your details to join the agricultural marketplace.</p>
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
              <label className="block text-xs font-bold uppercase tracking-wider text-outline mb-4">Select Your Identity</label>
              <div className="grid grid-cols-3 gap-3">
                {[['Farmer', 'agriculture'], ['Buyer', 'shopping_basket'], ['Transporter', 'local_shipping']].map(([r, icon]) => (
                  <button key={r} type="button" onClick={() => setRole(r)}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-300 ${role === r ? 'border-primary bg-primary-fixed/20 text-primary' : 'border-transparent bg-surface-container hover:bg-surface-container-high text-on-surface-variant'}`}>
                    <span className="material-symbols-outlined mb-2" style={role === r ? { fontVariationSettings: "'FILL' 1" } : {}}>{icon}</span>
                    <span className="text-xs font-bold">{r}</span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Section 01 — Personal Details */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-surface-container-high pb-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-bold">01</span>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-primary">Personal Details</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {[['Full Name', 'full_name', 'text', 'John Doe'],['Username', 'username', 'text', 'johndoe_agri'],['Email Address', 'email', 'email', 'john@agrigov.dz'],['Phone Number', 'phone', 'tel', '+213 550 00 00 00']].map(([label, key, type, ph]) => (
                    <div key={key} className="space-y-1.5">
                      <label className="text-sm font-semibold text-on-surface">{label}</label>
                      <input className="w-full px-4 py-3 bg-surface-container-lowest rounded-lg focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline/50 transition-all border outline-none"
                        required placeholder={ph} type={type} value={form[key]} onChange={setF(key)} />
                    </div>
                  ))}
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-on-surface">Gender</label>
                    <select className="w-full px-4 py-3 bg-surface-container-lowest rounded-lg focus:ring-2 focus:ring-primary/20 text-on-surface transition-all border outline-none" value={form.sex} onChange={setF('sex')}>
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-on-surface">Password</label>
                  <input className="w-full px-4 py-3 bg-surface-container-lowest rounded-lg focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline/50 transition-all border outline-none"
                    required placeholder="••••••••" type="password" value={form.password} onChange={setF('password')} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-on-surface">Residential Address</label>
                  <textarea className="w-full px-4 py-3 bg-surface-container-lowest rounded-lg focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline/50 transition-all resize-none border outline-none"
                    required placeholder="Street, City, Province" rows="2" value={form.address} onChange={setF('address')} />
                </div>
              </div>

              {/* Section 02 — Role Credentials */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-surface-container-high pb-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-bold">02</span>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-primary">{role} Credentials</h3>
                </div>

                {role === 'Farmer' && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-on-surface">Farmer Card Number</label>
                      <input className="w-full px-4 py-3 bg-surface-container-lowest rounded-lg focus:ring-2 focus:ring-primary/20 text-on-surface transition-all border outline-none"
                        required placeholder="F-8892-XXXX" type="text" value={extra.farmer_card} onChange={setE('farmer_card')} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-on-surface">Farm Area (Hectares)</label>
                        <input className="w-full px-4 py-3 bg-surface-container-lowest rounded-lg focus:ring-2 focus:ring-primary/20 text-on-surface transition-all border outline-none"
                          required placeholder="25.5" type="number" step="0.1" value={extra.farm_area} onChange={setE('farm_area')} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-on-surface">Farm Location</label>
                        <input className="w-full px-4 py-3 bg-surface-container-lowest rounded-lg focus:ring-2 focus:ring-primary/20 text-on-surface transition-all border outline-none"
                          required placeholder="City, Province" type="text" value={extra.farm_location} onChange={setE('farm_location')} />
                      </div>
                    </div>
                  </>
                )}

                {role === 'Buyer' && (
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-on-surface">Commercial Register</label>
                    <input className="w-full px-4 py-3 bg-surface-container-lowest rounded-lg focus:ring-2 focus:ring-primary/20 text-on-surface transition-all border outline-none"
                      required placeholder="CR-2026-XYZ" type="text" value={extra.registre_commerce} onChange={setE('registre_commerce')} />
                  </div>
                )}

                {role === 'Transporter' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-on-surface">Driver License Number</label>
                        <input className="w-full px-4 py-3 bg-surface-container-lowest rounded-lg focus:ring-2 focus:ring-primary/20 text-on-surface transition-all border outline-none"
                          required placeholder="DL-123456" type="text" value={extra.driver_license_number} onChange={setE('driver_license_number')} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-on-surface">License Type</label>
                        <select className="w-full px-4 py-3 bg-surface-container-lowest rounded-lg focus:ring-2 focus:ring-primary/20 text-on-surface transition-all border outline-none" value={extra.license_type} onChange={setE('license_type')}>
                          <option>Heavy Truck (Class C/E)</option>
                          <option>Light Commercial</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-on-surface">License Expiry Date</label>
                      <input className="w-full px-4 py-3 bg-surface-container-lowest rounded-lg focus:ring-2 focus:ring-primary/20 text-on-surface transition-all border outline-none"
                        required type="date" value={extra.license_expiry_date} onChange={setE('license_expiry_date')} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-on-surface">Vehicle Name</label>
                        <input className="w-full px-4 py-3 bg-surface-container-lowest rounded-lg focus:ring-2 focus:ring-primary/20 text-on-surface transition-all border outline-none"
                          required placeholder="Toyota Hilux" type="text" value={extra.vehicle_name} onChange={setE('vehicle_name')} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-on-surface">Vehicle Year (Optional)</label>
                        <input className="w-full px-4 py-3 bg-surface-container-lowest rounded-lg focus:ring-2 focus:ring-primary/20 text-on-surface transition-all border outline-none"
                          placeholder="2022" type="number" min="1900" max="2099" value={extra.vehicle_year} onChange={setE('vehicle_year')} />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Submit */}
              <div className="pt-4 space-y-4">
                <button type="submit" disabled={loading}
                  className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-container transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                  {loading ? (
                    <><span className="animate-spin material-symbols-outlined text-lg">progress_activity</span> Creating account...</>
                  ) : (
                    <><span>Create {role} Account</span><span className="material-symbols-outlined text-lg">arrow_forward</span></>
                  )}
                </button>
                <div className="flex items-center justify-center gap-2 text-sm">
                  <span className="text-on-surface-variant">Already have an account?</span>
                  <Link to="/login" className="text-primary font-bold hover:underline decoration-2 underline-offset-4 transition-all">Log in here</Link>
                </div>
              </div>
            </form>

            <footer className="mt-12 text-center">
              <p className="text-[11px] text-outline leading-relaxed px-12">
                By signing up, you agree to the AgriGov Terms of Service and Privacy Policy. All agricultural data is encrypted and handled according to national data sovereignty laws.
              </p>
            </footer>
          </div>
        </section>
      </main>
    </div>
  );
}
