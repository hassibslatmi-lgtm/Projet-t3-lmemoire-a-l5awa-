import React, { useState, useMemo, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { getBuyerStock, addBuyerStock, updateBuyerStock, deleteBuyerStock } from '../services/api';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const initialStockForm = { product_name: '', quantity: '', buy_price: '', sell_price: '', farmer: '' };

export default function BuyerStockPurchases({ orders = [] }) {
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory', 'history', 'suppliers'
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stockForm, setStockForm] = useState(initialStockForm);
  const [editingId, setEditingId] = useState(null);
  const [showStockForm, setShowStockForm] = useState(false);
  const [dateFilter, setDateFilter] = useState('all');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState(null); // For drill-down

  useEffect(() => {
    fetchStock();
  }, []);

  const fetchStock = async () => {
    setLoading(true);
    try {
      const data = await getBuyerStock();
      setStock(data);
    } catch (err) {
      console.error('Failed to fetch stock:', err);
    } finally {
      setLoading(false);
    }
  };

  // --- Derived Data ---
  const suppliers = useMemo(() => {
    const map = new Map();
    orders.forEach(o => {
      if (!map.has(o.farmer)) {
        map.set(o.farmer, {
          id: o.farmer,
          name: o.farmer_name,
          phone: o.farmer_phone,
          address: o.farmer_address,
          totalPurchased: 0,
          orderCount: 0,
          history: []
        });
      }
      const s = map.get(o.farmer);
      s.totalPurchased += parseFloat(o.total_amount);
      s.orderCount += 1;
      s.history.push(o);
    });
    return Array.from(map.values()).sort((a, b) => b.totalPurchased - a.totalPurchased);
  }, [orders]);

  const handleSaveStock = async () => {
    if (!stockForm.product_name || !stockForm.quantity || !stockForm.buy_price) return;
    const payload = {
      ...stockForm,
      quantity: parseFloat(stockForm.quantity),
      buy_price: parseFloat(stockForm.buy_price),
      sell_price: parseFloat(stockForm.sell_price || 0),
      farmer: stockForm.farmer || null
    };

    try {
      if (editingId) {
        await updateBuyerStock(editingId, payload);
      } else {
        await addBuyerStock(payload);
      }
      fetchStock();
      setStockForm(initialStockForm);
      setEditingId(null);
      setShowStockForm(false);
    } catch (err) {
      alert('Error saving stock');
    }
  };

  const handleEditStock = (item) => {
    setStockForm({
      product_name: item.product_name,
      quantity: String(item.quantity),
      buy_price: String(item.buy_price),
      sell_price: String(item.sell_price),
      farmer: item.farmer || ''
    });
    setEditingId(item.id);
    setShowStockForm(true);
  };

  const handleDeleteStock = async (id) => {
    if (window.confirm('Remove from inventory?')) {
      try {
        await deleteBuyerStock(id);
        fetchStock();
      } catch (err) {
        alert('Error deleting stock');
      }
    }
  };

  // --- Filtering Logic ---
  const filteredPurchases = useMemo(() => {
    const now = new Date();
    return orders.filter(o => {
      const d = new Date(o.created_at);
      if (dateFilter === 'today') return d.toDateString() === now.toDateString();
      if (dateFilter === 'month') return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      if (dateFilter === 'year') return d.getFullYear() === now.getFullYear();
      if (dateFilter === 'custom') {
        const s = customStart ? new Date(customStart) : null;
        const e = customEnd ? new Date(customEnd) : null;
        if (s && e) return d >= s && d <= e;
      }
      return true;
    });
  }, [orders, dateFilter, customStart, customEnd]);

  // --- Analytics ---
  const analytics = useMemo(() => {
    const totalInventoryCost = stock.reduce((s, i) => s + (i.quantity * i.buy_price), 0);
    const expectedSalesValue = stock.reduce((s, i) => s + (i.quantity * i.sell_price), 0);
    const potentialProfit = expectedSalesValue - totalInventoryCost;

    const stockDistribution = stock.map(i => ({
      name: i.product_name,
      value: i.quantity * i.buy_price
    })).sort((a, b) => b.value - a.value).slice(0, 5);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData = months.map((m, idx) => {
      const total = orders.filter(o => new Date(o.created_at).getMonth() === idx).reduce((s, o) => s + parseFloat(o.total_amount), 0);
      return { name: m, amount: total };
    });

    return { totalInventoryCost, expectedSalesValue, potentialProfit, stockDistribution, monthlyData };
  }, [stock, orders]);

  const handleExport = () => {
    const headers = ['ID', 'Product', 'Supplier', 'Quantity', 'Total', 'Date'];
    const rows = filteredPurchases.map(o => [o.id, o.product_name, o.farmer_name, o.quantity, o.total_amount, new Date(o.created_at).toLocaleDateString()]);
    const csvContent = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Buyer_Purchases_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // --- Pricing Automation ---
  const purchasedProducts = useMemo(() => {
    const list = [];
    const seen = new Set();
    orders.forEach(o => {
      if (!seen.has(o.product_name)) {
        seen.add(o.product_name);
        const lastOrder = [...orders].reverse().find(order => order.product_name === o.product_name);
        list.push({
          name: o.product_name,
          lastPrice: lastOrder ? (parseFloat(lastOrder.total_amount) / lastOrder.quantity) : 0
        });
      }
    });
    return list.sort((a, b) => a.name.localeCompare(b.name));
  }, [orders]);

  const profit = parseFloat(stockForm.sell_price || 0) - parseFloat(stockForm.buy_price || 0);
  const isLoss = stockForm.sell_price && parseFloat(stockForm.sell_price) < parseFloat(stockForm.buy_price);

  const handleProductNameChange = (val) => {
    const productInfo = purchasedProducts.find(p => p.name === val);
    setStockForm(prev => ({
      ...prev,
      product_name: val,
      buy_price: productInfo ? String(productInfo.lastPrice) : prev.buy_price
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* ... (existing header code) ... */}
      <div className="bg-surface p-6 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">inventory</span>
            Stock & Purchases
          </h1>
          <div className="flex items-center gap-4 mt-2">
            <button onClick={() => setActiveTab('inventory')} className={`text-xs font-black uppercase tracking-widest pb-1 border-b-2 transition-all ${activeTab === 'inventory' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}>Inventory</button>
            <button onClick={() => setActiveTab('history')} className={`text-xs font-black uppercase tracking-widest pb-1 border-b-2 transition-all ${activeTab === 'history' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}>Purchase History</button>
            <button onClick={() => setActiveTab('suppliers')} className={`text-xs font-black uppercase tracking-widest pb-1 border-b-2 transition-all ${activeTab === 'suppliers' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}>My Suppliers</button>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap bg-surface-container-low p-1.5 rounded-xl border border-outline-variant/20">
          {['all', 'today', 'month', 'year', 'custom'].map(f => (
            <button key={f} onClick={() => setDateFilter(f)} className={`px-4 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all ${dateFilter === f ? 'bg-primary text-on-primary shadow-md' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
              {f}
            </button>
          ))}
          {dateFilter === 'custom' && (
            <div className="flex items-center gap-2 ml-2">
              <input type="date" value={customStart} onChange={e => setCustomStart(e.target.value)} className="h-8 px-2 rounded-lg border border-outline-variant/50 text-xs outline-none" />
              <input type="date" value={customEnd} onChange={e => setCustomEnd(e.target.value)} className="h-8 px-2 rounded-lg border border-outline-variant/50 text-xs outline-none" />
            </div>
          )}
        </div>
      </div>

      {activeTab === 'inventory' && (
        <>
          {/* --- KPI Cards --- */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: 'Inventory Value (Cost)', value: analytics.totalInventoryCost, icon: 'account_balance_wallet', color: 'text-blue-600', bg: 'bg-blue-100' },
              { label: 'Expected Revenue', value: analytics.expectedSalesValue, icon: 'payments', color: 'text-emerald-600', bg: 'bg-emerald-100' },
              { label: 'Potential Profit', value: analytics.potentialProfit, icon: 'trending_up', color: 'text-violet-600', bg: 'bg-violet-100' },
              { label: 'Total Purchases', value: orders.reduce((s,o) => s + parseFloat(o.total_amount), 0), icon: 'shopping_cart', color: 'text-amber-600', bg: 'bg-amber-100' },
            ].map((card, i) => (
              <div key={i} className="bg-surface p-5 rounded-2xl border border-outline-variant/30 shadow-sm">
                <div className={`w-10 h-10 ${card.bg} ${card.color} rounded-xl flex items-center justify-center mb-3`}>
                  <span className="material-symbols-outlined">{card.icon}</span>
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">{card.label}</p>
                <h3 className="text-2xl font-black text-on-surface">{card.value.toLocaleString()} <span className="text-xs text-on-surface-variant">DZD</span></h3>
              </div>
            ))}
          </div>

          {/* --- Charts Section --- */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-surface p-6 rounded-2xl border border-outline-variant/30 shadow-sm">
              <h2 className="text-lg font-black text-on-surface mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">bar_chart</span>
                Monthly Purchases (DZD)
              </h2>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} />
                    <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-surface p-6 rounded-2xl border border-outline-variant/30 shadow-sm">
              <h2 className="text-lg font-black text-on-surface mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600">pie_chart</span>
                Stock Value Distribution
              </h2>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={analytics.stockDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none" cornerRadius={6}>
                      {analytics.stockDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <RechartsTooltip formatter={(v) => `${v.toLocaleString()} DZD`} />
                    <Legend iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* --- Stock Management --- */}
          <div className="bg-surface rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-outline-variant/20 flex items-center justify-between">
              <h2 className="text-lg font-black text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">inventory_2</span>
                Gestion de Stock
              </h2>
              <button 
                onClick={() => {
                  if (showStockForm) {
                    setStockForm(initialStockForm);
                    setEditingId(null);
                  }
                  setShowStockForm(!showStockForm);
                }} 
                className={`px-4 py-2 rounded-xl text-sm font-black flex items-center gap-2 hover:shadow-lg transition-all ${editingId ? 'bg-amber-500 text-white' : 'bg-primary text-on-primary'}`}
              >
                <span className="material-symbols-outlined">{showStockForm ? 'close' : (editingId ? 'edit' : 'add')}</span>
                {showStockForm ? 'Cancel' : (editingId ? 'Editing Item...' : 'Add Item')}
              </button>

            </div>
            {showStockForm && (
              <div className="p-6 bg-surface-container-low/30 border-b border-outline-variant/20 animate-in slide-in-from-top-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Product Name</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">inventory</span>
                      <input 
                        list="purchased-products" 
                        type="text" 
                        placeholder="e.g. Tomatoes" 
                        value={stockForm.product_name} 
                        onChange={e => handleProductNameChange(e.target.value)} 
                        className="h-11 pl-10 pr-4 w-full rounded-xl border border-outline-variant/50 bg-white text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium" 
                      />
                    </div>
                    <datalist id="purchased-products">
                      {purchasedProducts.map(p => <option key={p.name} value={p.name} />)}
                    </datalist>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Supplier Source</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">person</span>
                      <select 
                        value={stockForm.farmer} 
                        onChange={e => setStockForm({...stockForm, farmer: e.target.value})} 
                        className="h-11 pl-10 pr-4 w-full rounded-xl border border-outline-variant/50 bg-white text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium appearance-none"
                      >
                        <option value="">Manual Entry / Other</option>
                        {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Quantity (Units/KG)</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">production_quantity_limits</span>
                      <input 
                        type="number" 
                        placeholder="0.00" 
                        value={stockForm.quantity} 
                        onChange={e => setStockForm({...stockForm, quantity: e.target.value})} 
                        className="h-11 pl-10 pr-4 w-full rounded-xl border border-outline-variant/50 bg-white text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium" 
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Unit Buy Price (DZD)</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">shopping_cart</span>
                      <input 
                        type="number" 
                        placeholder="0.00" 
                        value={stockForm.buy_price} 
                        onChange={e => setStockForm({...stockForm, buy_price: e.target.value})} 
                        className="h-11 pl-10 pr-4 w-full rounded-xl border border-outline-variant/50 bg-white text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium" 
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                  {/* Sell Price Input */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Unit Sell Price (DZD)</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">sell</span>
                      <input 
                        type="number" 
                        placeholder="0.00" 
                        value={stockForm.sell_price} 
                        onChange={e => setStockForm({...stockForm, sell_price: e.target.value})} 
                        className="h-11 pl-10 pr-4 w-full rounded-xl border border-outline-variant/50 bg-white text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium" 
                      />
                    </div>
                  </div>

                  {/* Profit Insight Row */}
                  <div className="lg:col-span-2 flex flex-col md:flex-row items-center justify-between p-4 bg-surface rounded-2xl border border-outline-variant/30 shadow-sm gap-4">
                    <div className="flex items-center gap-6">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest">Expected Profit / Unit</span>
                        <span className={`text-xl font-black ${profit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                          {profit.toLocaleString()} <span className="text-xs">DZD</span>
                        </span>
                      </div>
                      <div className="h-10 w-px bg-outline-variant/20 hidden md:block"></div>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest">Margin %</span>
                        <span className={`text-sm font-black ${profit >= 0 ? 'text-on-surface' : 'text-red-600'}`}>
                          {stockForm.buy_price && parseFloat(stockForm.buy_price) !== 0 
                            ? ((profit / parseFloat(stockForm.buy_price)) * 100).toFixed(1) 
                            : '0'}%
                        </span>
                      </div>
                    </div>

                    {isLoss ? (
                      <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-xl border border-red-100 animate-pulse">
                        <span className="material-symbols-outlined text-sm font-black">warning</span>
                        <span className="text-[10px] font-black uppercase tracking-tight">Warning: Selling at Loss!</span>
                      </div>
                    ) : (
                      <button 
                        onClick={handleSaveStock} 
                        className={`w-full md:w-auto h-12 px-8 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center justify-center gap-3 ${editingId ? 'bg-amber-500 text-white shadow-amber-200' : 'bg-primary text-on-primary shadow-primary/30'}`}
                      >
                        <span className="material-symbols-outlined text-xl">{editingId ? 'published_with_changes' : 'add_task'}</span>
                        {editingId ? 'Save Changes' : 'Confirm & Add to Stock'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Submit button for loss case (to allow it if they really want) */}
                {isLoss && (
                   <div className="mt-4 flex justify-end">
                      <button 
                        onClick={handleSaveStock} 
                        className="h-11 px-8 rounded-xl bg-red-600 text-white font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-all flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-sm">priority_high</span>
                        Proceed with Loss
                      </button>
                   </div>
                )}
              </div>
            )}


            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-container-low text-on-surface-variant text-[10px] uppercase font-bold border-b border-outline-variant/30">
                  <tr>
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4">Supplier</th>
                    <th className="px-6 py-4">Quantity</th>
                    <th className="px-6 py-4">Buy Price</th>
                    <th className="px-6 py-4">Current Value</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {loading ? (
                    <tr><td colSpan="6" className="text-center py-10">Loading...</td></tr>
                  ) : stock.length === 0 ? (
                    <tr><td colSpan="6" className="text-center py-10 text-on-surface-variant font-medium italic">Your inventory is empty.</td></tr>
                  ) : (
                    stock.map(item => (
                      <tr key={item.id} className="hover:bg-surface-container-lowest transition-colors">
                        <td className="px-6 py-4 font-bold text-on-surface">{item.product_name}</td>
                        <td className="px-6 py-4 text-xs font-medium text-on-surface-variant">{item.farmer_name || 'Manual'}</td>
                        <td className="px-6 py-4 font-medium">{item.quantity} units</td>
                        <td className="px-6 py-4 text-on-surface-variant">{item.buy_price} DZD</td>
                        <td className="px-6 py-4 font-black">{(item.quantity * item.buy_price).toLocaleString()} DZD</td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => handleEditStock(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><span className="material-symbols-outlined text-[20px]">edit</span></button>
                          <button onClick={() => handleDeleteStock(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><span className="material-symbols-outlined text-[20px]">delete</span></button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'history' && (
        <div className="bg-surface rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden no-print animate-in fade-in">
          <div className="p-6 border-b border-outline-variant/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <h2 className="text-lg font-black text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-500">shopping_basket</span>
              Purchase History (Achats)
            </h2>
            <div className="flex items-center gap-2">
              <button onClick={handlePrint} className="px-4 py-2 bg-gray-100 text-on-surface font-bold text-sm rounded-xl flex items-center gap-2 hover:bg-gray-200 transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-lg">print</span> Print
              </button>
              <button onClick={handleExport} className="px-4 py-2 bg-emerald-600 text-white font-bold text-sm rounded-xl flex items-center gap-2 hover:shadow-lg transition-all cursor-pointer">
                <span className="material-symbols-outlined text-lg">download</span> Excel
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low text-on-surface-variant text-[10px] uppercase font-bold border-b border-outline-variant/30">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Farmer / Supplier</th>
                  <th className="px-6 py-4 text-center">Qty</th>
                  <th className="px-6 py-4 text-right">Total Amount</th>
                  <th className="px-6 py-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {filteredPurchases.length === 0 ? (
                  <tr><td colSpan="6" className="text-center py-10 text-on-surface-variant italic">No purchases found for this period.</td></tr>
                ) : (
                  filteredPurchases.map(o => (
                    <tr key={o.id} className="hover:bg-surface-container-lowest transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-primary">#{o.id}</td>
                      <td className="px-6 py-4 font-bold">{o.product_name}</td>
                      <td className="px-6 py-4 text-on-surface-variant font-medium">{o.farmer_name}</td>
                      <td className="px-6 py-4 text-center font-bold">{o.quantity}</td>
                      <td className="px-6 py-4 text-right font-black text-emerald-600">{parseFloat(o.total_amount).toLocaleString()} DZD</td>
                      <td className="px-6 py-4 text-right text-sm text-on-surface-variant">{new Date(o.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'suppliers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in">
          {suppliers.length === 0 ? (
            <div className="col-span-full py-12 text-center bg-surface rounded-2xl border border-outline-variant/30">
              <span className="material-symbols-outlined text-4xl opacity-20 block mb-2">person_off</span>
              <p className="text-on-surface-variant font-bold">No suppliers found yet.</p>
            </div>
          ) : (
            suppliers.map(s => (
              <div key={s.id} onClick={() => setSelectedSupplier(s)} className="bg-surface p-6 rounded-2xl border border-outline-variant/30 shadow-sm hover:border-primary transition-all cursor-pointer group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                    {s.name?.charAt(0) || 'S'}
                  </div>
                  <div>
                    <h3 className="font-black text-on-surface">{s.name}</h3>
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{s.orderCount} Orders total</p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                    <span className="material-symbols-outlined text-[16px]">call</span> {s.phone || 'N/A'}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                    <span className="material-symbols-outlined text-[16px]">location_on</span> <span className="truncate">{s.address || 'N/A'}</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-outline-variant/20 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-on-surface-variant">Total Volume</span>
                  <span className="text-sm font-black text-primary">{s.totalPurchased.toLocaleString()} DZD</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* --- Supplier Detail Modal --- */}
      {selectedSupplier && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-surface w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border border-outline-variant/30 animate-in zoom-in-95 duration-200">
            <div className="p-6 bg-primary text-white flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-black">
                  {selectedSupplier.name?.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-black">{selectedSupplier.name}</h2>
                  <p className="text-white/70 text-xs font-bold uppercase tracking-widest">Supplier Purchase History</p>
                </div>
              </div>
              <button onClick={() => setSelectedSupplier(null)} className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20">
                  <p className="text-[10px] font-black uppercase text-on-surface-variant mb-1">Total Spent</p>
                  <p className="text-xl font-black text-primary">{selectedSupplier.totalPurchased.toLocaleString()} DZD</p>
                </div>
                <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20">
                  <p className="text-[10px] font-black uppercase text-on-surface-variant mb-1">Order Count</p>
                  <p className="text-xl font-black text-on-surface">{selectedSupplier.orderCount} Transactions</p>
                </div>
                <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20">
                  <p className="text-[10px] font-black uppercase text-on-surface-variant mb-1">Contact</p>
                  <p className="text-sm font-bold text-on-surface">{selectedSupplier.phone}</p>
                </div>
              </div>
              <table className="w-full text-left">
                <thead className="text-[10px] uppercase font-black text-on-surface-variant border-b border-outline-variant/30">
                  <tr>
                    <th className="pb-3 px-4">Order ID</th>
                    <th className="pb-3 px-4">Product</th>
                    <th className="pb-3 px-4 text-center">Qty</th>
                    <th className="pb-3 px-4 text-right">Price</th>
                    <th className="pb-3 px-4 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10 text-sm">
                  {selectedSupplier.history.map(o => (
                    <tr key={o.id} className="hover:bg-surface-container-lowest transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-primary">#{o.id}</td>
                      <td className="py-3 px-4 font-bold">{o.product_name}</td>
                      <td className="py-3 px-4 text-center font-bold">{o.quantity}</td>
                      <td className="py-3 px-4 text-right font-black text-emerald-600">{parseFloat(o.total_amount).toLocaleString()} DZD</td>
                      <td className="py-3 px-4 text-right text-xs text-on-surface-variant">{new Date(o.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-surface-container-low border-t border-outline-variant/20 flex justify-end">
               <button onClick={() => setSelectedSupplier(null)} className="px-6 py-2 bg-on-surface text-surface rounded-xl font-black text-sm hover:opacity-90 transition-opacity">Close Report</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
