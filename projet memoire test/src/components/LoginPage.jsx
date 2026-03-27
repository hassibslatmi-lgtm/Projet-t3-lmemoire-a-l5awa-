import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login, saveAuth } from '../services/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(email, password);
      saveAuth(data.token, data.role, data.full_name || data.username);
      if (data.role === 'ministry') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      const msg = err?.data?.error || 'Login failed. Please check your credentials.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface font-body text-on-surface antialiased">
      <main className="min-h-screen flex items-stretch">
        {/* Visual Side */}
        <section className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary">
          <img
            alt="Agricultural Landscape"
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-80"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtutIcRE7Z3e_q55icmD-Fp8ves6JDlFr3d8JLDREiNwFGBCPudmMrAIPUtX5xvEbrhWqvZHkEoocBAb5Jt_PnaLmapv84m2dxTz5gVBM9j-ZNCw6KDeEd4NX5-N3LW5ytzmHCr6euZ0KOj9Mb5l2VwOVFvjZJsRE78EwWDPeOWTMN7QkfC4fINAAy41O70at_YCmfXNMWPiY_PguAstENJWX2s7IHukBEOntUtGoRhlXPj4KS3YnsP94sQOj1IrtEwSnnivCAHIw"
          />
          <div className="relative z-10 flex flex-col justify-between p-12 h-full w-full">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary-fixed rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-on-secondary-fixed" style={{ fontVariationSettings: "'FILL' 1" }}>agriculture</span>
              </div>
              <span className="font-headline font-black text-2xl tracking-tight text-white">AgriGov</span>
            </div>
            <div className="max-w-lg">
              <div className="glass-badge inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6">
                <span className="material-symbols-outlined text-secondary-fixed text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                <span className="text-white text-xs font-bold tracking-widest uppercase">Government Verified</span>
              </div>
              <h1 className="font-headline text-5xl font-extrabold text-white leading-tight mb-6">AgriGov Market</h1>
              <p className="text-white/80 text-lg leading-relaxed">Access the nation's agricultural marketplace. Verified farmers, transparent pricing, and direct supply chains.</p>
            </div>
            <div className="text-white/40 text-sm">© 2026 AgriGov. Secure Government Infrastructure.</div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-primary to-transparent opacity-60"></div>
        </section>

        {/* Form Side */}
        <section className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 lg:p-24 bg-surface">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center gap-3 mb-12">
              <div className="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>agriculture</span>
              </div>
              <span className="font-headline font-black text-2xl tracking-tight text-primary">AgriGov</span>
            </div>
            <div className="mb-10">
              <h2 className="font-headline text-4xl font-extrabold text-on-surface tracking-tight mb-2">Welcome back</h2>
              <p className="text-on-surface-variant font-medium">Please enter your details to access your account.</p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                <span className="material-symbols-outlined text-red-600 text-xl flex-shrink-0">error</span>
                <p className="text-sm font-medium text-red-700">{error}</p>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-on-surface tracking-wide uppercase" htmlFor="email">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-outline group-focus-within:text-primary transition-colors">mail</span>
                  </div>
                  <input
                    className="block w-full pl-12 pr-4 py-4 bg-surface-container-highest border-0 rounded-lg focus:ring-2 focus:ring-primary/20 transition-all text-on-surface placeholder:text-outline"
                    id="email" name="email" placeholder="admin@agrigov.gov" required type="email"
                    value={email} onChange={e => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-bold text-on-surface tracking-wide uppercase" htmlFor="password">Password</label>
                  <a className="text-sm font-semibold text-primary hover:text-secondary transition-colors underline decoration-2 underline-offset-4 decoration-primary/10 hover:decoration-secondary/20" href="#">Forgot password?</a>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-outline group-focus-within:text-primary transition-colors">lock</span>
                  </div>
                  <input
                    className="block w-full pl-12 pr-12 py-4 bg-surface-container-highest border-0 rounded-lg focus:ring-2 focus:ring-primary/20 transition-all text-on-surface placeholder:text-outline"
                    id="password" name="password" placeholder="••••••••" required
                    type={showPassword ? 'text' : 'password'}
                    value={password} onChange={e => setPassword(e.target.value)}
                  />
                  <button className="absolute inset-y-0 right-0 pr-4 flex items-center text-outline hover:text-on-surface transition-colors" type="button" onClick={() => setShowPassword(v => !v)}>
                    <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                className="w-full py-4 px-6 bg-primary text-on-primary font-headline font-bold text-lg rounded-lg editorial-shadow hover:bg-primary/95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                type="submit" disabled={loading}
              >
                {loading ? (
                  <><span className="animate-spin material-symbols-outlined text-xl">progress_activity</span> Signing in...</>
                ) : (
                  <>Login <span className="material-symbols-outlined text-xl">arrow_forward</span></>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-10 pt-10 border-t border-outline-variant/30 text-center">
              <p className="text-on-surface-variant font-medium">
                Don't have an account?
                <Link className="text-primary font-bold hover:text-secondary transition-colors ml-1" to="/signup">Sign up for free</Link>
              </p>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-surface-container-low flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-tighter leading-tight">Quality Control</span>
              </div>
              <div className="p-4 rounded-xl bg-surface-container-low flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>gpp_maybe</span>
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-tighter leading-tight">Government Pricing</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
