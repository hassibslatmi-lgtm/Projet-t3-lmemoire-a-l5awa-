import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function SignupPage() {
  const [role, setRole] = useState('Farmer');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());

    const payload = {
      full_name: data.full_name,
      username: data.username,
      email: data.email,
      password: data.password,
      sex: data.gender === 'Male' ? 'M' : 'F',
      role: role.toLowerCase(),
      extra_data: role === 'Farmer' ? {
        farmer_card: data.farmer_card,
        farm_area: data.farm_area,
        farm_location: data.farm_location
      } : role === 'Buyer' ? {
        registre_commerce: data.registre_commerce
      } : {
        driver_license: data.driver_license,
        license_type: data.license_type,
        vehicle_name: data.vehicle_name
      }
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/api/signup/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("تم التسجيل بنجاح! حسابك قيد المراجعة.");
        navigate('/login');
      } else {
        const errorData = await response.json();
        alert("خطأ: " + JSON.stringify(errorData));
      }
    } catch (error) {
      console.error("Connection Error:", error);
      alert("السيرفر مطفي، شعل Django قبل!");
    }
  }; // <--- تأكد بلي هاد القوس تاع الـ handleSubmit مغلوق هنا

  return (
    <div className="bg-background font-body text-on-surface antialiased overflow-x-hidden">
      <main className="min-h-screen flex flex-col md:flex-row">
        {/* Left Side: Editorial Content */}
        <section className="relative hidden md:flex md:w-5/12 lg:w-1/2 flex-col justify-between p-12 overflow-hidden bg-primary text-white">
          <div className="absolute inset-0 z-0">
            <img
              alt="Lush green hills"
              className="w-full h-full object-cover opacity-60"
              src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200"
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
            <div className="max-w-md">
              <h1 className="text-5xl lg:text-7xl font-extrabold font-headline leading-tight tracking-tight mb-6">AgriGov Platform</h1>
              <p className="text-lg text-on-primary-container leading-relaxed font-light mb-8">المستقبل الرقمي للزراعة في الجزائر.</p>
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

        {/* Right Side: Signup Form */}
        <section className="flex-1 flex flex-col items-center justify-center px-6 py-12 md:px-16 lg:px-24 bg-surface">
          <div className="w-full max-w-xl">
            <header className="mb-12">
              <h2 className="text-4xl font-extrabold font-headline text-primary mb-3">Join AgriGov</h2>
              <p className="text-on-surface-variant font-medium">Select your role and provide your details to join.</p>
            </header>

            {/* Role Selection Chips */}
            <div className="mb-10">
              <label className="block text-xs font-bold uppercase tracking-wider text-outline mb-4">Select Your Identity</label>
              <div className="grid grid-cols-3 gap-3">
                {['Farmer', 'Buyer', 'Transporter'].map((r) => (
                  <button key={r} type="button" onClick={() => setRole(r)}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-300 ${role === r ? 'border-primary bg-primary-fixed/20 text-primary' : 'border-transparent bg-surface-container text-on-surface-variant'}`}>
                    <span className="material-symbols-outlined mb-2" style={role === r ? { fontVariationSettings: "'FILL' 1" } : {}}>
                      {r === 'Farmer' ? 'agriculture' : r === 'Buyer' ? 'shopping_basket' : 'local_shipping'}
                    </span>
                    <span className="text-xs font-bold">{r}</span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Section 01: Personal Details */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-surface-container-high pb-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-bold">01</span>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-primary">Personal Details</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-on-surface">Full Name</label>
                    <input name="full_name" className="w-full px-4 py-3 bg-surface-container-lowest rounded-lg border outline-none" required placeholder="John Doe" type="text" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-on-surface">Username</label>
                    <input name="username" className="w-full px-4 py-3 bg-surface-container-lowest rounded-lg border outline-none" required placeholder="johndoe_agri" type="text" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-on-surface">Email Address</label>
                    <input name="email" className="w-full px-4 py-3 bg-surface-container-lowest rounded-lg border outline-none" required placeholder="john@agrigov.dz" type="email" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-on-surface">Phone Number</label>
                    <input name="phone" className="w-full px-4 py-3 bg-surface-container-lowest rounded-lg border outline-none" required placeholder="+213..." type="tel" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-on-surface">Gender</label>
                    <select name="gender" className="w-full px-4 py-3 bg-surface-container-lowest rounded-lg border outline-none">
                      <option>Male</option>
                      <option>Female</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-on-surface">Date of Birth</label>
                    <input name="dob" className="w-full px-4 py-3 bg-surface-container-lowest rounded-lg border outline-none" required type="date" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-on-surface">Password</label>
                  <input name="password" title="password" className="w-full px-4 py-3 bg-surface-container-lowest rounded-lg border outline-none" required placeholder="••••••••" type="password" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-on-surface">Residential Address</label>
                  <textarea name="address" className="w-full px-4 py-3 bg-surface-container-lowest rounded-lg border outline-none resize-none" required placeholder="Street, City" rows="2"></textarea>
                </div>
              </div>

              {/* Section 02: Role Specific */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-surface-container-high pb-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-bold">02</span>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-primary">{role} Credentials</h3>
                </div>

                {role === 'Farmer' && (
                  <div className="space-y-4">
                    <input name="farmer_card" className="w-full px-4 py-3 bg-surface-container-lowest rounded-lg border outline-none" required placeholder="Farmer Card Number" type="text" />
                    <div className="grid grid-cols-2 gap-4">
                      <input name="farm_area" className="w-full px-4 py-3 bg-surface-container-lowest rounded-lg border outline-none" required placeholder="Area (Hectares)" type="number" step="0.1" />
                      <input name="farm_location" className="w-full px-4 py-3 bg-surface-container-lowest rounded-lg border outline-none" required placeholder="Farm Location" type="text" />
                    </div>
                  </div>
                )}

                {role === 'Buyer' && (
                  <input name="registre_commerce" className="w-full px-4 py-3 bg-surface-container-lowest rounded-lg border outline-none" required placeholder="Commercial Register" type="text" />
                )}

                {role === 'Transporter' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <input name="driver_license" className="w-full px-4 py-3 bg-surface-container-lowest rounded-lg border outline-none" required placeholder="License No" type="text" />
                      <select name="license_type" className="w-full px-4 py-3 bg-surface-container-lowest rounded-lg border outline-none">
                        <option>Heavy Truck</option>
                        <option>Light Commercial</option>
                      </select>
                    </div>
                    <input name="vehicle_name" className="w-full px-4 py-3 bg-surface-container-lowest rounded-lg border outline-none" required placeholder="Vehicle Name" type="text" />
                  </div>
                )}
              </div>

              <div className="pt-8 space-y-4">
                <button type="submit" className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary-container transition-all flex items-center justify-center gap-2">
                  <span>Create {role} Account</span>
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </button>
                <div className="flex items-center justify-center gap-2 text-sm">
                  <span className="text-on-surface-variant">Already have an account?</span>
                  <Link to="/login" className="text-primary font-bold hover:underline">Log in here</Link>
                </div>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}