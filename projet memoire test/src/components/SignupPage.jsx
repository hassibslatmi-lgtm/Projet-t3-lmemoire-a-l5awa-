import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function SignupPage() {
  const [role, setRole] = useState('Farmer');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Navigate to login after successful mock registration
    navigate('/login');
  };

  return (
    <div className="bg-background font-body text-on-surface antialiased overflow-x-hidden">
      <main className="min-h-screen flex flex-col md:flex-row">
        {/* Left Side: Editorial Content & Branding */}
        <section className="relative hidden md:flex md:w-5/12 lg:w-1/2 flex-col justify-between p-12 overflow-hidden bg-primary text-white">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              alt="Lush rolling green hills"
              className="w-full h-full object-cover opacity-60"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCm8BXKcuLAyWgf3Te62kNpdJxrMEJbJz_TGdza1hpv2esVWw1E0ervJiRV7GHs_NVLVWN87T7uUJ6S1-WgxA8Yy2X5rqGph05XbqoVMfQlGRALnUIJ47BXOCLjT7F-5aIFpA4dW3WrVdFioNjS5YawCn2k6uwF7FCBFjJtL_fdn6qSha2IWIF1ep4XizvPxvYra-OW5ipzy0WP6DSIPx3T9mJHoQ8HgtPsg3ZB1iy6IihXHRE53CLFLkK-n2w0kr608OKnVjWqqMk"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-primary/40 via-primary/80 to-primary"></div>
          </div>
          {/* Content Overlays */}
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-16">
              <div className="w-10 h-10 bg-primary-fixed rounded-lg flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-primary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  agriculture
                </span>
              </div>
              <span className="text-2xl font-black tracking-tighter font-headline">AgriGov</span>
            </div>
            <div className="max-w-md">
              <h1 className="text-5xl lg:text-7xl font-extrabold font-headline leading-tight tracking-tight mb-6" />
              <p className="text-lg text-on-primary-container leading-relaxed font-light mb-8" />
            </div>
          </div>
          {/* Trust Badge Section */}
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

        {/* Right Side: Multi-step Signup Form */}
        <section className="flex-1 flex flex-col items-center justify-center px-6 py-12 md:px-16 lg:px-24 bg-surface">
          <div className="w-full max-w-xl">
            {/* Mobile Logo  */}
            <div className="md:hidden flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-on-primary-container"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  agriculture
                </span>
              </div>
              <span className="font-headline font-black text-2xl tracking-tight text-primary">AgriGov</span>
            </div>

            <header className="mb-12">
              <h2 className="text-4xl font-extrabold font-headline text-primary mb-3">Join AgriGov</h2>
              <p className="text-on-surface-variant font-medium">Select your role and provide your details to join the agricultural marketplace.</p>
            </header>

            {/* Role Selection Chips */}
            <div className="mb-10">
              <label className="block text-xs font-bold uppercase tracking-wider text-outline mb-4">Select Your Identity</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('Farmer')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-300 ${role === 'Farmer' ? 'border-primary bg-primary-fixed/20 text-primary' : 'border-transparent bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
                    }`}
                >
                  <span className="material-symbols-outlined mb-2" style={role === 'Farmer' ? { fontVariationSettings: "'FILL' 1" } : {}}>agriculture</span>
                  <span className="text-xs font-bold">Farmer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('Buyer')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-300 ${role === 'Buyer' ? 'border-primary bg-primary-fixed/20 text-primary' : 'border-transparent bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
                    }`}
                >
                  <span className="material-symbols-outlined mb-2" style={role === 'Buyer' ? { fontVariationSettings: "'FILL' 1" } : {}}>shopping_basket</span>
                  <span className="text-xs font-bold">Buyer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('Transporter')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-300 ${role === 'Transporter' ? 'border-primary bg-primary-fixed/20 text-primary' : 'border-transparent bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
                    }`}
                >
                  <span className="material-symbols-outlined mb-2" style={role === 'Transporter' ? { fontVariationSettings: "'FILL' 1" } : {}}>local_shipping</span>
                  <span className="text-xs font-bold">Transporter</span>
                </button>
              </div>
            </div>

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Common Information Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-surface-container-high pb-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-bold">01</span>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-primary">Personal Details</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-on-surface">Full Name</label>
                    <input className="w-full px-4 py-3 bg-surface-container-lowest rounded-lg focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline/50 transition-all border outline-none" required placeholder="John Doe" type="text" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-on-surface">Username</label>
                    <input className="w-full px-4 py-3 bg-surface-container-lowest rounded-lg focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline/50 transition-all border outline-none" required placeholder="johndoe_agri" type="text" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-on-surface">Email Address</label>
                    <input className="w-full px-4 py-3 bg-surface-container-lowest rounded-lg focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline/50 transition-all border outline-none" required placeholder="john@agrigov.dz" type="email" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-on-surface">Phone Number</label>
                    <input className="w-full px-4 py-3 bg-surface-container-lowest rounded-lg focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline/50 transition-all border outline-none" required placeholder="+213 550 00 00 00" type="tel" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-on-surface">Gender</label>
                    <select className="w-full px-4 py-3 bg-surface-container-lowest rounded-lg focus:ring-2 focus:ring-primary/20 text-on-surface transition-all border outline-none">
                      <option>Male</option>
                      <option>Female</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-on-surface">Date of Birth</label>
                    <input className="w-full px-4 py-3 bg-surface-container-lowest rounded-lg focus:ring-2 focus:ring-primary/20 text-on-surface transition-all border outline-none" required type="date" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-on-surface">Password</label>
                  <input className="w-full px-4 py-3 bg-surface-container-lowest rounded-lg focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline/50 transition-all border outline-none" required placeholder="••••••••" type="password" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-on-surface">Residential Address</label>
                  <textarea className="w-full px-4 py-3 bg-surface-container-lowest rounded-lg focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline/50 transition-all resize-none border outline-none" required placeholder="Street, City, Province" rows="2"></textarea>
                </div>
              </div>

              {/* Role Specific Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-surface-container-high pb-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-bold">02</span>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-primary">{role} Credentials</h3>
                </div>

                {role === 'Farmer' && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-on-surface">Farmer Card Number</label>
                      <input className="w-full px-4 py-3 bg-surface-container-lowest rounded-lg focus:ring-2 focus:ring-primary/20 text-on-surface transition-all border outline-none" required placeholder="F-8892-XXXX" type="text" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-on-surface">Farm Area (Hectares)</label>
                        <input className="w-full px-4 py-3 bg-surface-container-lowest rounded-lg focus:ring-2 focus:ring-primary/20 text-on-surface transition-all border outline-none" required placeholder="25.5" type="number" step="0.1" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-on-surface">Farm Location</label>
                        <input className="w-full px-4 py-3 bg-surface-container-lowest rounded-lg focus:ring-2 focus:ring-primary/20 text-on-surface transition-all border outline-none" required placeholder="City, Province" type="text" />
                      </div>
                    </div>
                  </>
                )}

                {role === 'Buyer' && (
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-on-surface">Commercial Register</label>
                    <input className="w-full px-4 py-3 bg-surface-container-lowest rounded-lg focus:ring-2 focus:ring-primary/20 text-on-surface transition-all border outline-none" required placeholder="CR-2026-XYZ" type="text" />
                  </div>
                )}

                {role === 'Transporter' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-on-surface">Driver License Number</label>
                        <input className="w-full px-4 py-3 bg-surface-container-lowest rounded-lg focus:ring-2 focus:ring-primary/20 text-on-surface transition-all border outline-none" required placeholder="DL-123456" type="text" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-on-surface">License Type</label>
                        <select className="w-full px-4 py-3 bg-surface-container-lowest rounded-lg focus:ring-2 focus:ring-primary/20 text-on-surface transition-all border outline-none">
                          <option>Heavy Truck (Class C/E)</option>
                          <option>Light Commercial</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-on-surface">License Expiry Date</label>
                      <input className="w-full px-4 py-3 bg-surface-container-lowest rounded-lg focus:ring-2 focus:ring-primary/20 text-on-surface transition-all border outline-none" required type="date" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-on-surface">Vehicle Name</label>
                        <input className="w-full px-4 py-3 bg-surface-container-lowest rounded-lg focus:ring-2 focus:ring-primary/20 text-on-surface transition-all border outline-none" required placeholder="Toyota Hilux" type="text" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-on-surface">Vehicle Year (Optional)</label>
                        <input className="w-full px-4 py-3 bg-surface-container-lowest rounded-lg focus:ring-2 focus:ring-primary/20 text-on-surface transition-all border outline-none" placeholder="2022" type="number" min="1900" max="2099" />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Submit & Actions */}
              <div className="pt-8 space-y-4">
                <button
                  type="submit"
                  className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-container transition-all flex items-center justify-center gap-2"
                >
                  <span>Create {role} Account</span>
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </button>
                <div className="flex items-center justify-center gap-2 text-sm">
                  <span className="text-on-surface-variant">Already have an account?</span>
                  <Link to="/login" className="text-primary font-bold hover:underline decoration-2 underline-offset-4 transition-all">
                    Log in here
                  </Link>
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
