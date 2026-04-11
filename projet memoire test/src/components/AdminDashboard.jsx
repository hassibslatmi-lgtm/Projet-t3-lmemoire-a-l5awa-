import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NotificationDropdown from './NotificationDropdown';
import ValidateAccountsModal from './ValidateAccountsModal';
import BlockAccountsModal from './BlockAccountsModal';
import AdminManageCategories from './AdminManageCategories';
import AdminManagePrices from './AdminManagePrices';
import AdminComplaints from './AdminComplaints';
import AdminDashboardHome from './AdminDashboardHome';
import { getAdminStats, clearAuth, getName } from '../services/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [isValidateModalOpen, setIsValidateModalOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ total_users: '—', pending_accounts: '—', blocked_accounts: '—' });
  const adminName = getName() || 'Admin';
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
        {/* Sidebar */}
        <aside className="hidden md:flex w-64 bg-surface border-r border-outline-variant/30 flex-col fixed h-full z-50">
          <div className="p-6 flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate('/home')}>
            <div className="bg-primary p-2 rounded-lg text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>agriculture</span>
            </div>
            <h2 className="text-primary text-xl font-bold tracking-tight">AgriGov</h2>
          </div>
          <nav className="flex-1 px-4 space-y-2 mt-4">
            <a onClick={() => setActiveTab('dashboard')} className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer ${activeTab === 'dashboard' ? 'bg-primary text-on-primary shadow-md shadow-primary/20' : 'text-on-surface-variant hover:bg-surface-container-high transition-colors'}`}>
              <span className="material-symbols-outlined" style={activeTab === 'dashboard' ? { fontVariationSettings: "'FILL' 1" } : {}}>dashboard</span>
              <span className="font-medium">Dashboard</span>
            </a>
            <a onClick={() => setActiveTab('accounts')} className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer ${activeTab === 'accounts' ? 'bg-primary text-on-primary shadow-md shadow-primary/20' : 'text-on-surface-variant hover:bg-surface-container-high transition-colors'}`}>
              <span className="material-symbols-outlined" style={activeTab === 'accounts' ? { fontVariationSettings: "'FILL' 1" } : {}}>group</span>
              <span className="font-medium">Accounts</span>
            </a>
            <a onClick={() => setActiveTab('categories')} className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer ${activeTab === 'categories' ? 'bg-primary text-on-primary shadow-md shadow-primary/20' : 'text-on-surface-variant hover:bg-surface-container-high transition-colors'}`}>
              <span className="material-symbols-outlined" style={activeTab === 'categories' ? { fontVariationSettings: "'FILL' 1" } : {}}>category</span>
              <span className="font-medium">Categories</span>
            </a>
            <a onClick={() => setActiveTab('prices')} className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer ${activeTab === 'prices' ? 'bg-primary text-on-primary shadow-md shadow-primary/20' : 'text-on-surface-variant hover:bg-surface-container-high transition-colors'}`}>
              <span className="material-symbols-outlined" style={activeTab === 'prices' ? { fontVariationSettings: "'FILL' 1" } : {}}>swap_horiz</span>
              <span className="font-medium">Transactions & Prices</span>
            </a>
            <a onClick={() => setActiveTab('complaints')} className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer ${activeTab === 'complaints' ? 'bg-primary text-on-primary shadow-md shadow-primary/20' : 'text-on-surface-variant hover:bg-surface-container-high transition-colors'}`}>
              <span className="material-symbols-outlined" style={activeTab === 'complaints' ? { fontVariationSettings: "'FILL' 1" } : {}}>report_problem</span>
              <span className="font-medium">Complaints</span>
            </a>
            <div className="pt-4 border-t border-outline-variant/30 mt-4">
              <a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors cursor-pointer">
                <span className="material-symbols-outlined">settings</span>
                <span className="font-medium">Settings</span>
              </a>
            </div>
          </nav>
          <div className="p-4 border-t border-outline-variant/30">
            <div className="flex items-center gap-3 p-2 bg-surface-container rounded-xl">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">{adminInitials}</div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold truncate">{adminName}</p>
                <p className="text-xs text-on-surface-variant truncate">Ministry Admin</p>
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
                <input className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" placeholder="Search accounts, roles, users..." type="text" />
              </div>
            </div>
            <div className="flex items-center gap-4 ml-auto">
              <NotificationDropdown role="admin" />
              <div className="h-8 w-px bg-outline-variant/30 mx-2 hidden sm:block"></div>
              <button onClick={handleLogout} className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors text-sm font-semibold cursor-pointer">
                <span className="material-symbols-outlined text-lg">logout</span>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </header>

          {/* Dashboard Content */}
          {activeTab === 'accounts' ? (
          <div className="p-4 md:p-8 space-y-8 flex-1">
            
            <div>
               <h1 className="text-2xl font-black text-on-surface font-headline tracking-tight">Account Management</h1>
               <p className="text-on-surface-variant mt-1 text-sm">Monitor and moderate registered farmers, buyers, and transporters.</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-surface p-6 rounded-xl border border-outline-variant/30 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">person</span>
                  <span className="text-xs font-bold text-green-600">+12%</span>
                </div>
                <h3 className="text-on-surface-variant text-sm font-medium uppercase tracking-wide">Total Users</h3>
                <p className="text-3xl font-bold mt-1 text-on-surface">{stats.total_users}</p>
              </div>
              <div className="bg-surface p-6 rounded-xl border border-outline-variant/30 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <span className="material-symbols-outlined text-amber-600 bg-amber-50 p-2 rounded-lg">pending_actions</span>
                  <span className="text-xs font-bold text-amber-600">Pending</span>
                </div>
                <h3 className="text-on-surface-variant text-sm font-medium uppercase tracking-wide">Pending Accounts</h3>
                <p className="text-3xl font-bold mt-1 text-on-surface">{stats.pending_accounts}</p>
              </div>
              <div className="bg-surface p-6 rounded-xl border border-outline-variant/30 shadow-sm hover:shadow-md transition-shadow border-l-4 border-red-500">
                <div className="flex items-center justify-between mb-4">
                  <span className="material-symbols-outlined text-red-600 bg-red-50 p-2 rounded-lg">block</span>
                  <span className="text-xs font-bold text-red-600">Action Required</span>
                </div>
                <h3 className="text-on-surface-variant text-sm font-medium uppercase tracking-wide">Blocked Accounts</h3>
                <p className="text-3xl font-bold mt-1 text-on-surface">{stats.blocked_accounts}</p>
              </div>
            </div>

            {/* Quick Actions */}
            <section>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-on-surface">
                <span className="material-symbols-outlined text-primary">bolt</span>
                Quick Actions
              </h3>
              <div className="flex flex-wrap gap-4">
                <button onClick={() => setIsValidateModalOpen(true)} className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-surface px-6 py-4 rounded-xl border border-outline-variant/30 hover:border-primary transition-all shadow-sm group cursor-pointer">
                  <span className="material-symbols-outlined text-primary bg-primary/5 p-2 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">how_to_reg</span>
                  <span className="font-semibold text-on-surface">Validate Accounts</span>
                </button>
                <button onClick={() => setIsBlockModalOpen(true)} className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-surface px-6 py-4 rounded-xl border border-outline-variant/30 hover:border-red-600 transition-all shadow-sm group cursor-pointer">
                  <span className="material-symbols-outlined text-red-600 bg-red-50 p-2 rounded-lg group-hover:bg-red-600 group-hover:text-white transition-colors">lock</span>
                  <span className="font-semibold text-on-surface">Block Accounts</span>
                </button>
              </div>
            </section>

            {/* Activity Table */}
            <section className="bg-surface rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-outline-variant/30 flex items-center justify-between">
                <h3 className="text-lg font-bold text-on-surface">Recent Account Activity</h3>
                <button className="text-primary text-sm font-bold hover:underline cursor-pointer">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-surface-container-lowest text-on-surface-variant uppercase text-xs font-bold tracking-wider">
                    <tr>
                      <th className="px-6 py-4 whitespace-nowrap">Action</th>
                      <th className="px-6 py-4 whitespace-nowrap">User Name</th>
                      <th className="px-6 py-4 whitespace-nowrap">Role</th>
                      <th className="px-6 py-4 whitespace-nowrap">Date</th>
                      <th className="px-6 py-4 whitespace-nowrap">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/30">
                    <tr className="hover:bg-surface-container-lowest transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                          <span className="font-medium text-on-surface">Account Verified</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-on-surface-variant font-medium">Ahmed Zidani</td>
                      <td className="px-6 py-4 text-on-surface-variant">Farmer</td>
                      <td className="px-6 py-4 text-on-surface-variant text-sm">2 mins ago</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-green-100/50 text-green-700 text-xs font-bold rounded border border-green-200">Completed</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-surface-container-lowest transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-red-600 text-lg">block</span>
                          <span className="font-medium text-on-surface">Account Blocked</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-on-surface-variant font-medium">AgroTrade Ltd</td>
                      <td className="px-6 py-4 text-on-surface-variant">Buyer</td>
                      <td className="px-6 py-4 text-on-surface-variant text-sm">1 hour ago</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-red-50 text-red-700 text-xs font-bold rounded border border-red-200">Blocked</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-surface-container-lowest transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-amber-600 text-lg">hourglass_empty</span>
                          <span className="font-medium text-on-surface">Verification Pending</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-on-surface-variant font-medium">Sarl Transport Nord</td>
                      <td className="px-6 py-4 text-on-surface-variant">Transporter</td>
                      <td className="px-6 py-4 text-on-surface-variant text-sm">3 hours ago</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded border border-amber-200">Pending</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>
          ) : activeTab === 'categories' ? (
            <AdminManageCategories />
          ) : activeTab === 'prices' ? (
            <AdminManagePrices />
          ) : activeTab === 'complaints' ? (
            <AdminComplaints />
          ) : activeTab === 'dashboard' ? (
            <AdminDashboardHome onNavigate={setActiveTab} />
          ) : null}

          {/* Footer */}
          <footer className="p-8 border-t border-outline-variant/30 text-center bg-surface mt-auto">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>agriculture</span>
              <span className="text-primary font-bold">AgriGov</span>
            </div>
            <p className="text-on-surface-variant text-sm">© 2026 AgriGov Management System. All rights reserved.</p>
          </footer>

          {/* Render Modals */}
          <ValidateAccountsModal 
            isOpen={isValidateModalOpen} 
            onClose={() => setIsValidateModalOpen(false)} 
          />
          <BlockAccountsModal 
            isOpen={isBlockModalOpen} 
            onClose={() => setIsBlockModalOpen(false)} 
          />
        </main>
      </div>
    </div>
  );
}
