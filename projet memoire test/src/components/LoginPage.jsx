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
      
      // حفظ التوكن والبيانات في الـ LocalStorage
      saveAuth(data.token, data.role, data.full_name || data.username);

      // الربط الحقيقي: إذا كان الأدمن (Ministry) أو Superuser
      if (data.role === 'ministry' || data.is_superuser === true) {
        console.log("Admin Access Granted");
        navigate('/admin');
      } else {
        console.log("User Access Granted");
        navigate('/'); // يروح للبروفايل أو الصفحة الرئيسية
      }
    } catch (err) {
      // إظهار الخطأ القادم من الباكيند (مثل "كلمة السر خاطئة")
      const msg = err?.data?.error || 'Login failed. Please check your credentials.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#fcfdf6] font-body text-gray-900 antialiased">
      <main className="min-h-screen flex items-stretch">
        {/* الجانب البصري */}
        <section className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#386a20]">
          <img
            alt="Agricultural Landscape"
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60"
            src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=2000"
          />
          <div className="relative z-10 flex flex-col justify-between p-12 h-full w-full">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>agriculture</span>
              </div>
              <span className="font-headline font-black text-2xl tracking-tight text-white uppercase">AgriGov</span>
            </div>
            <div className="max-w-lg">
              <h1 className="font-headline text-5xl font-extrabold text-white leading-tight mb-6">AgriGov Market</h1>
              <p className="text-white/80 text-lg leading-relaxed">Secure Government Marketplace for verified agricultural trade.</p>
            </div>
            <div className="text-white/40 text-sm">© 2026 AgriGov Infrastructure.</div>
          </div>
        </section>

        {/* جانب الفورم */}
        <section className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
          <div className="w-full max-w-md">
            <div className="mb-10">
              <h2 className="font-headline text-4xl font-extrabold text-gray-900 mb-2">Welcome back</h2>
              <p className="text-gray-500 font-medium">Please enter your credentials.</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                <span className="material-symbols-outlined text-red-600 text-xl">error</span>
                <p className="text-sm font-medium text-red-700">{error}</p>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700 uppercase">Email</label>
                <input
                  className="block w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#386a20]/20 focus:border-[#386a20] outline-none transition-all"
                  placeholder="admin@agrigov.dz" required type="email"
                  value={email} onChange={e => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700 uppercase">Password</label>
                <div className="relative">
                  <input
                    className="block w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#386a20]/20 focus:border-[#386a20] outline-none transition-all"
                    placeholder="••••••••" required
                    type={showPassword ? 'text' : 'password'}
                    value={password} onChange={e => setPassword(e.target.value)}
                  />
                  <button className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400" type="button" onClick={() => setShowPassword(!showPassword)}>
                    <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>

              <button
                className="w-full py-4 bg-[#386a20] text-white font-bold text-lg rounded-lg shadow-lg hover:bg-[#2d5519] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                type="submit" disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
                {!loading && <span className="material-symbols-outlined">arrow_forward</span>}
              </button>
            </form>

            <div className="mt-10 text-center border-t pt-6">
              <p className="text-gray-500 font-medium">
                Don't have an account? <Link className="text-[#386a20] font-bold hover:underline" to="/signup">Register Now</Link>
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}