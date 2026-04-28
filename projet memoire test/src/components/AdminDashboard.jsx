import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationDropdown from './NotificationDropdown';
import ValidateAccountsModal from './ValidateAccountsModal';
import BlockAccountsModal from './BlockAccountsModal';
import AdminManageCategories from './AdminManageCategories';
import AdminManagePrices from './AdminManagePrices';
import AdminComplaints from './AdminComplaints';
import AdminDashboardHome from './AdminDashboardHome';
import NationalOversightTab from './NationalOversightTab';
import { getAdminStats, clearAuth, getName } from '../services/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [isValidateModalOpen, setIsValidateModalOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ total_users: '—', pending_accounts: '—', blocked_accounts: '—' });
  
  const adminName = getName() || 'Abdou';
  const adminInitials = adminName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  useEffect(() => {
    getAdminStats().then(data => setStats(data)).catch(() => {});
  }, [isValidateModalOpen, isBlockModalOpen]);

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <div className="bg-surface-container-lowest text-on-surface antialiased font-sans min-h-screen">
      <div className="flex min-h-screen relative">
        
        {/* --- Sidebar (Unified White Style - FULL MENU) --- */}
        <aside className="hidden md:flex w-64 bg-surface border-r border-outline-variant/30 flex-col fixed h-full z-50">
          <div className="p-6 flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate('/home')}>
            <div className="bg-primary p-2 rounded-lg text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>agriculture</span>
            </div>
            <h2 className="text-primary text-xl font-bold tracking-tight">AgriGov</h2>
          </div>

          <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto custom-scrollbar">
            <div onClick={() => setActiveTab('dashboard')} 
                 className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer font-medium transition-all ${activeTab === 'dashboard' ? 'bg-primary text-on-primary shadow-md shadow-primary/20' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
              <span className="material-symbols-outlined" style={activeTab === 'dashboard' ? { fontVariationSettings: "'FILL' 1" } : {}}>dashboard</span>
              <span>Dashboard</span>
            </div>
            
            <div onClick={() => setActiveTab('oversight')} 
                 className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer font-medium transition-all ${activeTab === 'oversight' ? 'bg-primary text-on-primary shadow-md shadow-primary/20' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
              <span className="material-symbols-outlined" style={activeTab === 'oversight' ? { fontVariationSettings: "'FILL' 1" } : {}}>analytics</span>
              <span>National Oversight</span>
            </div>

            <div onClick={() => setActiveTab('accounts')} 
                 className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer font-medium transition-all ${activeTab === 'accounts' ? 'bg-primary text-on-primary shadow-md shadow-primary/20' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
              <span className="material-symbols-outlined" style={activeTab === 'accounts' ? { fontVariationSettings: "'FILL' 1" } : {}}>group</span>
              <span>Accounts</span>
            </div>

            <div onClick={() => setActiveTab('categories')} 
                 className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer font-medium transition-all ${activeTab === 'categories' ? 'bg-primary text-on-primary shadow-md shadow-primary/20' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
              <span className="material-symbols-outlined" style={activeTab === 'categories' ? { fontVariationSettings: "'FILL' 1" } : {}}>category</span>
              <span>Categories</span>
            </div>

            <div onClick={() => setActiveTab('prices')} 
                 className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer font-medium transition-all ${activeTab === 'prices' ? 'bg-primary text-on-primary shadow-md shadow-primary/20' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
              <span className="material-symbols-outlined" style={activeTab === 'prices' ? { fontVariationSettings: "'FILL' 1" } : {}}>swap_horiz</span>
              <span>Transactions</span>
            </div>

            <div onClick={() => setActiveTab('complaints')} 
                 className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer font-medium transition-all ${activeTab === 'complaints' ? 'bg-primary text-on-primary shadow-md shadow-primary/20' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
              <span className="material-symbols-outlined" style={activeTab === 'complaints' ? { fontVariationSettings: "'FILL' 1" } : {}}>report_problem</span>
              <span>Complaints</span>
            </div>
          </nav>
          
          <div className="p-4 border-t border-outline-variant/30">
            <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-2xl border border-outline-variant/20 shadow-sm">
              <div className="w-11 h-11 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shadow-inner shrink-0">
                {adminInitials || 'A'}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-black truncate text-on-surface leading-tight">{adminName}</p>
                <p className="text-[11px] text-on-surface-variant truncate opacity-80 uppercase tracking-wider">Ministry Admin</p>
              </div>
            </div>
          </div>
        </aside>

        {/* --- Main Content --- */}
        <main className="flex-1 md:ml-64 flex flex-col min-h-screen relative">
          
          <header className="h-16 bg-surface border-b border-outline-variant/30 px-4 md:px-8 flex items-center justify-between sticky top-0 z-40">
            <div className="flex-1 max-w-md hidden sm:block">
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">search</span>
                <input className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" placeholder="Search accounts, reports, data..." type="text" />
              </div>
            </div>
            
            <div className="flex items-center gap-4 ml-auto">
              <NotificationDropdown role="admin" />
              <div className="h-8 w-px bg-outline-variant/30 mx-2 hidden sm:block"></div>
              <button onClick={handleLogout} className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors text-sm font-bold cursor-pointer">
                <span className="material-symbols-outlined text-lg">logout</span>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </header>

          <div className="p-4 md:p-8 space-y-6 flex-1 max-w-7xl w-full mx-auto">
            {activeTab === 'accounts' ? (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div>
                  <h1 className="text-2xl font-black text-on-surface tracking-tight">Account Management</h1>
                  <p className="text-on-surface-variant mt-1 text-sm">Monitor and moderate registered farmers, buyers, and transporters.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-surface p-6 rounded-2xl border border-outline-variant/30 shadow-sm">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-xl w-fit mb-4">
                      <span className="material-symbols-outlined">person</span>
                    </div>
                    <p className="text-on-surface-variant text-sm font-bold uppercase mb-1">Total Users</p>
                    <h3 className="text-3xl font-black text-on-surface">{stats.total_users}</h3>
                  </div>
                  <div className="bg-surface p-6 rounded-2xl border border-outline-variant/30 shadow-sm">
                    <div className="p-3 bg-amber-100 text-amber-600 rounded-xl w-fit mb-4">
                      <span className="material-symbols-outlined">pending_actions</span>
                    </div>
                    <p className="text-on-surface-variant text-sm font-bold uppercase mb-1">Pending Accounts</p>
                    <h3 className="text-3xl font-black text-on-surface">{stats.pending_accounts}</h3>
                  </div>
                  <div className="bg-surface p-6 rounded-2xl border border-outline-variant/30 shadow-sm border-l-4 border-red-500">
                    <div className="p-3 bg-red-100 text-red-600 rounded-xl w-fit mb-4">
                      <span className="material-symbols-outlined">block</span>
                    </div>
                    <p className="text-on-surface-variant text-sm font-bold uppercase mb-1">Blocked Accounts</p>
                    <h3 className="text-3xl font-black text-on-surface">{stats.blocked_accounts}</h3>
                  </div>
                </div>

                <section>
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">bolt</span>
                    Quick Actions
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    <button onClick={() => setIsValidateModalOpen(true)} className="flex items-center gap-3 bg-surface px-6 py-4 rounded-xl border border-outline-variant/30 hover:border-primary transition-all shadow-sm group cursor-pointer">
                      <span className="material-symbols-outlined text-primary bg-primary/5 p-2 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">how_to_reg</span>
                      <span className="font-bold">Validate Accounts</span>
                    </button>
                    <button onClick={() => setIsBlockModalOpen(true)} className="flex items-center gap-3 bg-surface px-6 py-4 rounded-xl border border-outline-variant/30 hover:border-red-600 transition-all shadow-sm group cursor-pointer">
                      <span className="material-symbols-outlined text-red-600 bg-red-50 p-2 rounded-lg group-hover:bg-red-600 group-hover:text-white transition-colors">lock</span>
                      <span className="font-bold">Block Accounts</span>
                    </button>
                  </div>
                </section>
              </div>
            ) : activeTab === 'oversight' ? (
              <NationalOversightTab />
            ) : activeTab === 'categories' ? (
              <AdminManageCategories />
            ) : activeTab === 'prices' ? (
              <AdminManagePrices />
            ) : activeTab === 'complaints' ? (
              <AdminComplaints />
            ) : activeTab === 'dashboard' ? (
              <AdminDashboardHome onNavigate={setActiveTab} />
            ) : null}
          </div>

          <footer className="p-8 border-t border-outline-variant/30 text-center bg-surface mt-auto">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>agriculture</span>
              <span className="text-primary font-bold">AgriGov</span>
            </div>
            <p className="text-on-surface-variant text-sm font-medium">© 2026 AgriGov Management System. All rights reserved.</p>
          </footer>

          <ValidateAccountsModal isOpen={isValidateModalOpen} onClose={() => setIsValidateModalOpen(false)} />
          <BlockAccountsModal isOpen={isBlockModalOpen} onClose={() => setIsBlockModalOpen(false)} />
        </main>
      </div>
    </div>
  );
}
