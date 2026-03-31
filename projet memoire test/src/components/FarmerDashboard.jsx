import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearAuth, getName } from '../services/api';

export default function FarmerDashboard() {
  const navigate = useNavigate();
  const userName = getName() || 'Farmer';
  
  // Modal state
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [showAllProductsModal, setShowAllProductsModal] = useState(false);
  const [showAllOrdersModal, setShowAllOrdersModal] = useState(false);
  const [complaintText, setComplaintText] = useState('');

  // Dummy fallback data since backend endpoints for dashboard aren't built yet
  const stats = {
    totalProducts: 24,
    totalOrders: 156,
    totalRevenue: '12,450 DZD',
  };

  const recentProducts = [
    { id: 1, name: 'Organic Tomatoes', date: '2023-10-20', stock: '200 kg' },
    { id: 2, name: 'Fresh Potatoes', date: '2023-10-21', stock: '500 kg' },
    { id: 3, name: 'Green Apples', date: '2023-10-22', stock: '150 kg' },
    { id: 4, name: 'Carrots', date: '2023-10-23', stock: '300 kg' },
  ];

  const recentOrders = [
    { id: '#ORD-7742', customer: 'Organic Fresh Co.', date: '2023-10-22', status: 'On the way', amount: '1,240 DZD' },
    { id: '#ORD-7741', customer: 'Sarah Johnson', date: '2023-10-21', status: 'Order Placed', amount: '450 DZD' },
    { id: '#ORD-7740', customer: 'City Mart Hub', date: '2023-10-20', status: 'Delivered', amount: '2,890 DZD' },
    { id: '#ORD-7739', customer: 'Green Valley Retail', date: '2023-10-19', status: 'Delivered', amount: '890 DZD' },
  ];

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  const handleSendComplaint = () => {
    // In the future: send complaintText to backend
    alert('Complaint sent to administration successfully!');
    setComplaintText('');
    setShowComplaintModal(false);
  };

  return (
    <div className="bg-surface-container-lowest text-on-surface antialiased font-sans min-h-screen">
      <div className="flex min-h-screen relative">
        
        {/* --- Sidebar --- */}
        <aside className="hidden md:flex w-64 bg-surface border-r border-outline-variant/30 flex-col fixed h-full z-50">
          <div className="p-6 flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate('/home')}>
            <div className="bg-primary p-2 rounded-lg text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>agriculture</span>
            </div>
            <h2 className="text-primary text-xl font-bold tracking-tight">AgriGov</h2>
          </div>

          <nav className="flex-1 px-4 space-y-2 mt-4">
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary text-on-primary shadow-md shadow-primary/20 cursor-pointer font-medium">
              <span className="material-symbols-outlined">dashboard</span>
              <span>Dashboard</span>
            </div>
            <div onClick={() => navigate('/farmer/profile')} className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer font-medium">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
              <span>My Profile</span>
            </div>
            <div onClick={() => navigate('/farmer/products')} className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer font-medium">
              <span className="material-symbols-outlined">inventory_2</span>
              <span>My Products</span>
            </div>
          </nav>
          
          <div className="p-4 border-t border-outline-variant/30">
            <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-2xl border border-outline-variant/20 shadow-sm">
              <div className="w-11 h-11 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shadow-inner shrink-0 overflow-hidden">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-black truncate text-on-surface leading-tight">
                    {userName}
                </p>
                <p className="text-[11px] text-on-surface-variant truncate opacity-80">
                    Farmer Account
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* --- Main Content --- */}
        <main className="flex-1 md:ml-64 flex flex-col min-h-screen relative">
          
          {/* Header */}
          <header className="h-16 bg-surface border-b border-outline-variant/30 px-4 md:px-8 flex items-center justify-between sticky top-0 z-40">
            <div className="flex-1 max-w-md hidden sm:block">
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">search</span>
                <input className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" placeholder="Search products, orders..." type="text" />
              </div>
            </div>
            
            <div className="flex items-center gap-4 ml-auto">
              <button className="w-10 h-10 rounded-xl flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors relative cursor-pointer">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-surface"></span>
              </button>
              <div className="h-8 w-px bg-outline-variant/30 mx-2 hidden sm:block"></div>
              <button onClick={handleLogout} className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors text-sm font-bold cursor-pointer">
                <span className="material-symbols-outlined text-lg">logout</span>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </header>

          {/* Page Content */}
          <div className="p-4 md:p-8 space-y-6 flex-1 max-w-7xl w-full mx-auto">
            
            {/* Welcome Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-primary/10 p-8 md:p-10 mb-8 border border-primary/20 flex flex-col md:flex-row justify-between items-center md:items-end gap-6">
               <div className="relative z-10 w-full text-center md:text-left">
                  <h1 className="text-on-surface text-2xl md:text-3xl font-black leading-tight tracking-tight mb-2">Welcome back, {userName}!</h1>
                  <div className="flex items-center justify-center md:justify-start gap-2 text-primary font-medium text-sm md:text-base">
                     <span className="material-symbols-outlined text-lg">calendar_today</span>
                     <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} • Reporting</span>
                  </div>
               </div>
               <button onClick={() => setShowComplaintModal(true)} className="relative z-10 px-6 py-3 bg-red-600/10 text-red-700 border border-red-200/50 font-bold rounded-xl hover:bg-red-600/20 transition-all flex items-center gap-2 whitespace-nowrap">
                  <span className="material-symbols-outlined text-[20px]">report_problem</span>
                  Send Complaint
               </button>
               {/* Background decors */}
               <div className="absolute right-[-20px] bottom-[-40px] opacity-5 pointer-events-none transform -rotate-12">
                  <span className="material-symbols-outlined text-[200px]" style={{ fontVariationSettings: "'FILL' 1" }}>agriculture</span>
               </div>
            </div>

            {/* Quick Stats Grid (3 columns as requested) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
               <div className="bg-surface p-6 rounded-2xl border border-outline-variant/30 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                     <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                        <span className="material-symbols-outlined">inventory</span>
                     </div>
                  </div>
                  <p className="text-on-surface-variant text-sm font-bold uppercase tracking-wider mb-1">Total Products</p>
                  <h3 className="text-3xl font-black text-on-surface">{stats.totalProducts}</h3>
               </div>
               
               <div className="bg-surface p-6 rounded-2xl border border-outline-variant/30 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                     <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                        <span className="material-symbols-outlined">shopping_cart_checkout</span>
                     </div>
                  </div>
                  <p className="text-on-surface-variant text-sm font-bold uppercase tracking-wider mb-1">Total Orders</p>
                  <h3 className="text-3xl font-black text-on-surface">{stats.totalOrders}</h3>
               </div>

               <div className="bg-surface p-6 rounded-2xl border border-outline-variant/30 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                     <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                        <span className="material-symbols-outlined">payments</span>
                     </div>
                  </div>
                  <p className="text-on-surface-variant text-sm font-bold uppercase tracking-wider mb-1">Total Revenue</p>
                  <h3 className="text-3xl font-black text-on-surface">{stats.totalRevenue}</h3>
               </div>
            </div>

            {/* Two Lists Section */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
               
               {/* Recent Products List */}
               <div className="bg-surface rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden flex flex-col">
                  <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-lowest">
                     <h2 className="text-lg font-black text-on-surface">Recent Products</h2>
                     <button onClick={() => setShowAllProductsModal(true)} className="text-primary text-sm font-bold hover:underline cursor-pointer">View All</button>
                  </div>
                  <div className="p-0 overflow-x-auto">
                     <table className="w-full text-left border-collapse">
                        <thead className="bg-surface-container-low text-on-surface-variant text-xs uppercase font-bold tracking-wider">
                           <tr>
                              <th className="px-6 py-4 border-b border-outline-variant/20">Product Name</th>
                              <th className="px-6 py-4 border-b border-outline-variant/20">Date Listed</th>
                              <th className="px-6 py-4 border-b border-outline-variant/20 text-right">Stock</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/20">
                           {recentProducts.map(product => (
                              <tr key={product.id} className="hover:bg-surface-container-lowest transition-colors group">
                                 <td className="px-6 py-4 font-bold text-on-surface group-hover:text-primary transition-colors">{product.name}</td>
                                 <td className="px-6 py-4 text-on-surface-variant text-sm font-medium">{product.date}</td>
                                 <td className="px-6 py-4 text-right font-bold text-on-surface">{product.stock}</td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>

               {/* Recent Orders List */}
               <div className="bg-surface rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden flex flex-col">
                  <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-lowest">
                     <h2 className="text-lg font-black text-on-surface">Recent Orders</h2>
                     <button onClick={() => setShowAllOrdersModal(true)} className="text-primary text-sm font-bold hover:underline cursor-pointer">View All</button>
                  </div>
                  <div className="p-0 overflow-x-auto">
                     <table className="w-full text-left border-collapse">
                        <thead className="bg-surface-container-low text-on-surface-variant text-xs uppercase font-bold tracking-wider">
                           <tr>
                              <th className="px-6 py-4 border-b border-outline-variant/20">Order ID</th>
                              <th className="px-6 py-4 border-b border-outline-variant/20">Status</th>
                              <th className="px-6 py-4 border-b border-outline-variant/20 text-right">Amount</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/20">
                           {recentOrders.map(order => (
                              <tr key={order.id} className="hover:bg-surface-container-lowest transition-colors group relative">
                                 <td className="px-6 py-4 font-bold text-on-surface">
                                    {order.id}
                                    <div className="text-xs text-on-surface-variant font-medium mt-1">{order.customer}</div>
                                 </td>
                                 <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${
                                       order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                       order.status === 'On the way' ? 'bg-blue-100 text-blue-700' :
                                       'bg-amber-100 text-amber-700'
                                    }`}>
                                       {order.status}
                                    </span>
                                 </td>
                                 <td className="px-6 py-4 text-right font-bold text-on-surface">{order.amount}</td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>

            </div>

          </div>
          
          {/* Footer */}
          <footer className="p-8 border-t border-outline-variant/30 text-center bg-surface mt-auto">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>agriculture</span>
              <span className="text-primary font-bold">AgriGov</span>
            </div>
            <p className="text-on-surface-variant text-sm">© 2026 AgriGov Management System. All rights reserved.</p>
          </footer>

        </main>
      </div>

      {/* Complaint Modal */}
      {showComplaintModal && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-surface w-full max-w-lg rounded-[2rem] shadow-2xl flex flex-col border border-outline-variant/20 overflow-hidden">
               <div className="px-8 py-6 border-b border-outline-variant/30 flex items-center justify-between bg-surface/95 backdrop-blur z-20">
                  <div className="flex items-center gap-3">
                     <span className="material-symbols-outlined text-red-600 bg-red-50 p-2 rounded-xl">report_problem</span>
                     <h2 className="text-xl font-black text-on-surface">Submit Complaint</h2>
                  </div>
                  <button onClick={() => setShowComplaintModal(false)} className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors flex items-center justify-center">
                     <span className="material-symbols-outlined text-lg">close</span>
                  </button>
               </div>
               
               <div className="p-8 space-y-5 flex-1">
                  <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/50 flex flex-col gap-1">
                     <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Date</span>
                     <span className="font-bold text-on-surface">{new Date().toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })}</span>
                  </div>
                  <div>
                     <label className="block text-sm font-bold uppercase tracking-wider text-on-surface-variant mb-2">Describe Your Issue</label>
                     <textarea 
                        value={complaintText}
                        onChange={(e) => setComplaintText(e.target.value)}
                        placeholder="Please write the details of your complaint here. It will be sent to the administration..."
                        className="w-full rounded-xl border border-outline-variant/50 bg-surface-container-lowest p-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none font-medium min-h-[150px]"
                     ></textarea>
                  </div>
               </div>

               <div className="px-8 py-5 border-t border-outline-variant/30 flex justify-end gap-3 bg-surface-container-lowest">
                  <button onClick={() => setShowComplaintModal(false)} className="px-6 py-2.5 rounded-xl border border-outline-variant/50 font-bold hover:bg-surface-container-high transition-colors text-on-surface-variant">Cancel</button>
                  <button onClick={handleSendComplaint} disabled={!complaintText.trim()} className="px-8 py-2.5 bg-red-600 text-white font-bold rounded-xl shadow-md hover:bg-red-700 hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50">
                     <span className="material-symbols-outlined text-sm">send</span> Send to Admin
                  </button>
               </div>
            </div>
         </div>
      )}

      {/* All Products Modal */}
      {showAllProductsModal && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-surface w-full max-w-3xl max-h-[85vh] rounded-[2rem] shadow-2xl flex flex-col border border-outline-variant/20 overflow-hidden">
               <div className="px-8 py-6 border-b border-outline-variant/30 flex items-center justify-between bg-surface/95 backdrop-blur z-20">
                  <div className="flex items-center gap-3">
                     <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-xl" style={{ fontVariationSettings: "'FILL' 1" }}>inventory_2</span>
                     <h2 className="text-xl font-black text-on-surface">All Products</h2>
                  </div>
                  <button onClick={() => setShowAllProductsModal(false)} className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors flex items-center justify-center cursor-pointer">
                     <span className="material-symbols-outlined text-lg">close</span>
                  </button>
               </div>
               
               <div className="p-0 overflow-y-auto flex-1">
                  <table className="w-full text-left border-collapse">
                     <thead className="bg-surface-container-low text-on-surface-variant text-xs uppercase font-bold tracking-wider sticky top-0 z-10 shadow-sm">
                        <tr>
                           <th className="px-8 py-4 border-b border-outline-variant/20">Product Name</th>
                           <th className="px-8 py-4 border-b border-outline-variant/20">Date Listed</th>
                           <th className="px-8 py-4 border-b border-outline-variant/20 text-right">Stock</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-outline-variant/20">
                        {recentProducts.concat(recentProducts).map((product, idx) => (
                           <tr key={`${product.id}-${idx}`} className="hover:bg-surface-container-lowest transition-colors group">
                              <td className="px-8 py-4 font-bold text-on-surface">{product.name}</td>
                              <td className="px-8 py-4 text-on-surface-variant text-sm font-medium">{product.date}</td>
                              <td className="px-8 py-4 text-right font-bold text-on-surface">{product.stock}</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>

               <div className="px-8 py-5 border-t border-outline-variant/30 flex justify-end bg-surface-container-lowest">
                  <button onClick={() => setShowAllProductsModal(false)} className="px-6 py-2.5 rounded-xl bg-surface border border-outline-variant/50 font-bold hover:bg-surface-container transition-colors text-on-surface">Close</button>
               </div>
            </div>
         </div>
      )}

      {/* All Orders Modal */}
      {showAllOrdersModal && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-surface w-full max-w-4xl max-h-[85vh] rounded-[2rem] shadow-2xl flex flex-col border border-outline-variant/20 overflow-hidden">
               <div className="px-8 py-6 border-b border-outline-variant/30 flex items-center justify-between bg-surface/95 backdrop-blur z-20">
                  <div className="flex items-center gap-3">
                     <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-xl" style={{ fontVariationSettings: "'FILL' 1" }}>list_alt</span>
                     <h2 className="text-xl font-black text-on-surface">Order History</h2>
                  </div>
                  <button onClick={() => setShowAllOrdersModal(false)} className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors flex items-center justify-center cursor-pointer">
                     <span className="material-symbols-outlined text-lg">close</span>
                  </button>
               </div>
               
               <div className="p-0 overflow-y-auto flex-1">
                  <table className="w-full text-left border-collapse">
                     <thead className="bg-surface-container-low text-on-surface-variant text-xs uppercase font-bold tracking-wider sticky top-0 z-10 shadow-sm">
                        <tr>
                           <th className="px-8 py-4 border-b border-outline-variant/20">Order ID</th>
                           <th className="px-8 py-4 border-b border-outline-variant/20">Customer</th>
                           <th className="px-8 py-4 border-b border-outline-variant/20">Date</th>
                           <th className="px-8 py-4 border-b border-outline-variant/20">Status</th>
                           <th className="px-8 py-4 border-b border-outline-variant/20 text-right">Amount</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-outline-variant/20">
                        {recentOrders.concat(recentOrders).map((order, idx) => (
                           <tr key={`${order.id}-${idx}`} className="hover:bg-surface-container-lowest transition-colors group">
                              <td className="px-8 py-4 font-bold text-on-surface font-mono">{order.id}</td>
                              <td className="px-8 py-4 font-bold text-on-surface">{order.customer}</td>
                              <td className="px-8 py-4 text-sm text-on-surface-variant font-medium">{order.date}</td>
                              <td className="px-8 py-4">
                                 <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${
                                    order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                    order.status === 'On the way' ? 'bg-blue-100 text-blue-700' :
                                    'bg-amber-100 text-amber-700'
                                 }`}>
                                    {order.status}
                                 </span>
                              </td>
                              <td className="px-8 py-4 text-right font-bold text-on-surface">{order.amount}</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>

               <div className="px-8 py-5 border-t border-outline-variant/30 flex justify-end bg-surface-container-lowest">
                  <button onClick={() => setShowAllOrdersModal(false)} className="px-6 py-2.5 rounded-xl bg-surface border border-outline-variant/50 font-bold hover:bg-surface-container transition-colors text-on-surface">Close</button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
}
