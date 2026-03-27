import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.access);
        alert(`مرحباً بك`);
        navigate('/'); 
      } else {
        alert(data.error || "خطأ في الدخول");
      }
    } catch(error) {
      console.error("Connection Error:", error);
      alert("السيرفر مطفي!");
    }

  };

  return (
    <div className="bg-surface font-body text-on-surface antialiased">
      <main className="min-h-screen flex items-stretch">
        <section className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary">
          <img
            alt="Landscape"
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-80"
            src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1200"
          />
          <div className="relative z-10 flex flex-col justify-between p-12 h-full w-full">
            <div className="flex items-center gap-3">
              <span className="font-headline font-black text-2xl text-white">AgriGov</span>
            </div>
            <div className="max-w-lg">
              <h1 className="font-headline text-5xl font-extrabold text-white mb-6">AgriGov Market</h1>
              <p className="text-white/80 text-lg">المنصة الوطنية للمنتجات الفلاحية.</p>
            </div>
          </div>
        </section>

        <section className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-surface">
          <div className="w-full max-w-md">
            <h2 className="font-headline text-4xl font-extrabold mb-6">Welcome back</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold mb-2">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-4 bg-gray-100 rounded-lg outline-none"
                  type="email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Password</label>
                <div className="relative">
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-4 bg-gray-100 rounded-lg outline-none"
                    type={showPassword ? "text" : "password"}
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-4"
                  >
                    <span className="material-symbols-outlined">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              <button type="submit" className="w-full py-4 bg-primary text-white font-bold rounded-lg shadow-md">
                Login
              </button>
            </form>

            <p className="mt-8 text-center">
              Don't have an account? <Link to="/signup" className="text-primary font-bold">Sign up</Link>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}