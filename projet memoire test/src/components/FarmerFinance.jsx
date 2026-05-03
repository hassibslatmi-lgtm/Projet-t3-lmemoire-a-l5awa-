import React, { useState, useMemo, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { getExpenses, addExpense, updateExpense, deleteExpense } from '../services/api';

const EXPENSE_CATEGORIES = [
  { key: 'inputs', label: 'Inputs (Seeds/Fertilizers)', icon: 'spa', color: '#10b981' },
  { key: 'utilities', label: 'Utilities (Water/Electricity)', icon: 'bolt', color: '#3b82f6' },
  { key: 'labor', label: 'Labor', icon: 'engineering', color: '#f59e0b' },
  { key: 'logistics', label: 'Logistics', icon: 'local_shipping', color: '#ef4444' },
];

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

const initialExpenseForm = { title: '', amount: '', category: 'inputs', date: new Date().toISOString().split('T')[0], description: '' };

export default function FarmerFinance({ orders = [], products = [] }) {
  // --- Expenses State (API-backed) ---
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expenseForm, setExpenseForm] = useState(initialExpenseForm);
  const [editingId, setEditingId] = useState(null);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [expenseFilter, setExpenseFilter] = useState('all');
  const [expFilterStart, setExpFilterStart] = useState('');
  const [expFilterEnd, setExpFilterEnd] = useState('');

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const data = await getExpenses();
      setExpenses(data);
    } catch (err) {
      console.error('Failed to fetch expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveExpense = async () => {
    if (!expenseForm.title.trim() || !expenseForm.amount) return;
    
    const payload = { 
      ...expenseForm, 
      amount: parseFloat(expenseForm.amount)
    };

    try {
      if (editingId) {
        await updateExpense(editingId, payload);
      } else {
        await addExpense(payload);
      }
      fetchExpenses();
      setExpenseForm(initialExpenseForm);
      setEditingId(null);
      setShowExpenseForm(false);
    } catch (err) {
      alert('Error saving expense: ' + (err.data?.error || 'Unknown error'));
    }
  };

  const handleEditExpense = (exp) => {
    setExpenseForm({ 
      title: exp.title, 
      amount: String(exp.amount), 
      category: exp.category, 
      date: exp.date,
      description: exp.description || '' 
    });
    setEditingId(exp.id);
    setShowExpenseForm(true);
  };

  const handleDeleteExpense = async (id) => {
    if (window.confirm('Delete this expense?')) {
      try {
        await deleteExpense(id);
        fetchExpenses();
      } catch (err) {
        alert('Error deleting expense');
      }
    }
  };

  // --- Date-filtered expenses ---
  const filteredExpenses = useMemo(() => {
    const now = new Date();
    return expenses.filter(e => {
      const d = new Date(e.date);
      if (isNaN(d.getTime())) return false;
      if (expenseFilter === 'today') return d.toDateString() === now.toDateString();
      if (expenseFilter === 'month') return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      if (expenseFilter === 'year') return d.getFullYear() === now.getFullYear();
      if (expenseFilter === 'custom') {
        const s = expFilterStart ? new Date(expFilterStart + 'T00:00:00') : null;
        const en = expFilterEnd ? new Date(expFilterEnd + 'T23:59:59') : null;
        if (s && en) return d >= s && d <= en;
        if (s) return d >= s;
        if (en) return d <= en;
      }
      return true;
    });
  }, [expenses, expenseFilter, expFilterStart, expFilterEnd]);

  // --- Financial Analytics ---
  const analytics = useMemo(() => {
    const totalExpenses = filteredExpenses.reduce((s, e) => s + e.amount, 0);
    const totalRevenue = orders.reduce((s, o) => s + (parseFloat(o.total_amount) || 0), 0);
    const totalQuantity = orders.reduce((s, o) => s + (parseFloat(o.quantity) || 0), 0);
    const costPerKG = totalQuantity > 0 ? (totalExpenses / totalQuantity) : 0;
    const netProfit = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100) : 0;

    // Expense breakdown by category
    const byCategory = EXPENSE_CATEGORIES.map(cat => ({
      name: cat.label.split(' (')[0],
      value: filteredExpenses.filter(e => e.category === cat.key).reduce((s, e) => s + e.amount, 0),
      color: cat.color,
    })).filter(c => c.value > 0);

    // Winner products analysis
    const productMap = {};
    orders.forEach(o => {
      const name = o.product_name || o.product?.name || 'Unknown';
      if (!productMap[name]) productMap[name] = { name, revenue: 0, quantity: 0, orders: 0, firstSale: o.created_at, lastSale: o.created_at };
      productMap[name].revenue += parseFloat(o.total_amount) || 0;
      productMap[name].quantity += parseFloat(o.quantity) || 0;
      productMap[name].orders += 1;
      if (new Date(o.created_at) > new Date(productMap[name].lastSale)) productMap[name].lastSale = o.created_at;
      if (new Date(o.created_at) < new Date(productMap[name].firstSale)) productMap[name].firstSale = o.created_at;
    });

    const winnerProducts = Object.values(productMap)
      .map(p => {
        const expShare = totalRevenue > 0 ? (p.revenue / totalRevenue) * totalExpenses : 0;
        const profit = p.revenue - expShare;
        const margin = p.revenue > 0 ? ((profit / p.revenue) * 100) : 0;
        const daySpan = Math.max(1, (new Date(p.lastSale) - new Date(p.firstSale)) / (1000 * 60 * 60 * 24));
        const velocity = p.orders / daySpan;
        let rating = 'Stable';
        if (velocity > 0.5) rating = 'High Demand';
        else if (velocity < 0.1) rating = 'Low Demand';
        return { ...p, expShare, profit, margin, velocity, rating };
      })
      .sort((a, b) => b.revenue - a.revenue);

    return { totalExpenses, totalRevenue, totalQuantity, costPerKG, netProfit, profitMargin, byCategory, winnerProducts };
  }, [filteredExpenses, orders]);

  const getCatInfo = (key) => EXPENSE_CATEGORIES.find(c => c.key === key) || EXPENSE_CATEGORIES[0];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-500/10 to-indigo-500/10 p-8 border border-violet-200/30">
        <div className="relative z-10">
          <h1 className="text-2xl md:text-3xl font-black text-on-surface flex items-center gap-3">
            <span className="material-symbols-outlined text-violet-600 text-3xl">analytics</span>
            Finance & Analytics
          </h1>
          <p className="text-on-surface-variant mt-1">Track expenses, analyze profitability, and discover your winner products.</p>
        </div>
      </div>

      {/* --- KPI Cards --- */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Revenue', value: `${analytics.totalRevenue.toLocaleString()}`, unit: 'DZD', icon: 'trending_up', bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'hover:border-emerald-400' },
          { label: 'Total Expenses', value: `${analytics.totalExpenses.toLocaleString()}`, unit: 'DZD', icon: 'trending_down', bg: 'bg-red-100', text: 'text-red-700', border: 'hover:border-red-400' },
          { label: 'Net Profit', value: `${analytics.netProfit.toLocaleString()}`, unit: 'DZD', icon: 'savings', bg: analytics.netProfit >= 0 ? 'bg-emerald-100' : 'bg-red-100', text: analytics.netProfit >= 0 ? 'text-emerald-700' : 'text-red-700', border: 'hover:border-violet-400' },
          { label: 'Cost / KG', value: analytics.costPerKG.toFixed(2), unit: 'DZD', icon: 'scale', bg: 'bg-blue-100', text: 'text-blue-700', border: 'hover:border-blue-400' },
          { label: 'Profit Margin', value: analytics.profitMargin.toFixed(1), unit: '%', icon: 'percent', bg: 'bg-violet-100', text: 'text-violet-700', border: 'hover:border-violet-400' },
        ].map((kpi, i) => (
          <div key={i} className={`bg-surface p-5 rounded-2xl border border-outline-variant/30 shadow-sm ${kpi.border} transition-colors group`}>
            <div className={`p-2 ${kpi.bg} ${kpi.text} rounded-xl w-fit mb-3 group-hover:scale-110 transition-transform`}>
              <span className="material-symbols-outlined text-xl">{kpi.icon}</span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">{kpi.label}</p>
            <h3 className="text-2xl font-black text-on-surface">{kpi.value} <span className="text-sm font-bold text-on-surface-variant">{kpi.unit}</span></h3>
          </div>
        ))}
      </div>

      {/* --- Expense Breakdown Chart + Add Expense --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-surface p-6 rounded-2xl border border-outline-variant/30 shadow-sm">
          <h2 className="text-lg font-black text-on-surface mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-violet-600">donut_large</span>
            Expense Breakdown
          </h2>
          {analytics.byCategory.length > 0 ? (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={analytics.byCategory} cx="50%" cy="50%" outerRadius={90} paddingAngle={3} dataKey="value" stroke="none" cornerRadius={4}>
                    {analytics.byCategory.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(v) => `${v.toLocaleString()} DZD`} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-72 flex flex-col items-center justify-center gap-3 text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl opacity-30">pie_chart</span>
              <p className="font-bold text-sm">No expense data yet</p>
              <p className="text-xs">Add expenses to see the breakdown</p>
            </div>
          )}
        </div>

        {/* Add / Edit Expense Form */}
        <div className="bg-surface p-6 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-violet-600">add_card</span>
              {editingId ? 'Edit Expense' : 'Add Expense'}
            </h2>
            {!showExpenseForm && (
              <button onClick={() => setShowExpenseForm(true)} className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 text-white font-bold text-sm rounded-lg hover:shadow-lg transition-all cursor-pointer">
                <span className="material-symbols-outlined text-[18px]">add</span> New
              </button>
            )}
          </div>
          {showExpenseForm ? (
            <div className="space-y-4 flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1.5">Category</label>
                  <select value={expenseForm.category} onChange={e => setExpenseForm(p => ({...p, category: e.target.value}))} className="w-full h-11 rounded-xl border border-outline-variant/50 bg-surface-container-lowest px-3 text-sm font-medium outline-none focus:border-violet-500">
                    {EXPENSE_CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1.5">Date</label>
                  <input type="date" value={expenseForm.date} onChange={e => setExpenseForm(p => ({...p, date: e.target.value}))} className="w-full h-11 rounded-xl border border-outline-variant/50 bg-surface-container-lowest px-3 text-sm font-medium outline-none focus:border-violet-500" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1.5">Title / Item</label>
                <input type="text" value={expenseForm.title} onChange={e => setExpenseForm(p => ({...p, title: e.target.value}))} placeholder="e.g. NPK Fertilizer bags" className="w-full h-11 rounded-xl border border-outline-variant/50 bg-surface-container-lowest px-4 text-sm font-medium outline-none focus:border-violet-500" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1.5">Amount (DZD)</label>
                <input type="number" value={expenseForm.amount} onChange={e => setExpenseForm(p => ({...p, amount: e.target.value}))} placeholder="0.00" className="w-full h-11 rounded-xl border border-outline-variant/50 bg-surface-container-lowest px-4 text-sm font-medium outline-none focus:border-violet-500" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1.5">Optional Description</label>
                <textarea value={expenseForm.description} onChange={e => setExpenseForm(p => ({...p, description: e.target.value}))} placeholder="Add more details..." className="w-full h-20 rounded-xl border border-outline-variant/50 bg-surface-container-lowest p-3 text-sm font-medium outline-none focus:border-violet-500 resize-none"></textarea>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => { setShowExpenseForm(false); setEditingId(null); setExpenseForm(initialExpenseForm); }} className="px-5 py-2.5 rounded-xl border border-outline-variant/50 font-bold text-sm text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer">Cancel</button>
                <button onClick={handleSaveExpense} className="px-6 py-2.5 bg-violet-600 text-white font-bold text-sm rounded-xl hover:shadow-lg transition-all cursor-pointer flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">{editingId ? 'save' : 'add'}</span>
                  {editingId ? 'Update' : 'Add Expense'}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-2 text-on-surface-variant py-8">
              <span className="material-symbols-outlined text-4xl opacity-30">receipt_long</span>
              <p className="font-bold text-sm">Track your farm expenses</p>
              <p className="text-xs text-center max-w-xs">Click "New" to add seeds, fertilizer, labor, or logistics costs.</p>
            </div>
          )}
        </div>
      </div>

      {/* --- Expenses Date Filter + List --- */}
      <div className="bg-surface rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-outline-variant/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <h2 className="text-lg font-black text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-violet-600">list_alt</span>
            Expenses Log ({filteredExpenses.length})
          </h2>
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { key: 'all', label: 'All' }, { key: 'today', label: 'Today' },
              { key: 'month', label: 'Month' }, { key: 'year', label: 'Year' },
              { key: 'custom', label: 'Custom' },
            ].map(f => (
              <button key={f.key} onClick={() => setExpenseFilter(f.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${expenseFilter === f.key ? 'bg-violet-600 text-white shadow-md' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
                {f.label}
              </button>
            ))}
            {expenseFilter === 'custom' && (
              <div className="flex items-center gap-2">
                <input type="date" value={expFilterStart} onChange={e => setExpFilterStart(e.target.value)} className="h-8 px-2 rounded-lg border border-outline-variant/50 text-xs outline-none focus:border-violet-500" />
                <span className="text-xs font-bold text-on-surface-variant">{'\u2192'}</span>
                <input type="date" value={expFilterEnd} onChange={e => setExpFilterEnd(e.target.value)} className="h-8 px-2 rounded-lg border border-outline-variant/50 text-xs outline-none focus:border-violet-500" />
              </div>
            )}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container-low text-on-surface-variant text-[10px] uppercase font-bold border-b border-outline-variant/30">
              <tr>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3 text-right">Amount</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {loading ? (
                <tr><td colSpan="5" className="text-center py-12 text-on-surface-variant animate-pulse">Loading expenses...</td></tr>
              ) : filteredExpenses.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-12 text-on-surface-variant">
                  <span className="material-symbols-outlined text-3xl opacity-30 block mb-2">receipt_long</span>
                  <p className="font-bold">No expenses recorded</p>
                </td></tr>
              ) : (
                filteredExpenses.sort((a, b) => new Date(b.date) - new Date(a.date)).map(exp => {
                  const cat = getCatInfo(exp.category);
                  return (
                    <tr key={exp.id} className="hover:bg-surface-container-lowest transition-colors">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg" style={{ backgroundColor: cat.color + '20', color: cat.color }}>
                            <span className="material-symbols-outlined text-[16px]">{cat.icon}</span>
                          </div>
                          <span className="text-xs font-bold">{cat.label.split(' (')[0]}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold">{exp.title}</span>
                          {exp.description && <span className="text-[10px] text-on-surface-variant">{exp.description}</span>}
                        </div>
                      </td>
                      <td className="px-6 py-3 text-sm text-on-surface-variant font-medium">{new Date(exp.date).toLocaleDateString()}</td>
                      <td className="px-6 py-3 text-right font-bold text-red-600 text-sm">{exp.amount.toLocaleString()} DZD</td>
                      <td className="px-6 py-3 text-right">
                        <div className="flex items-center gap-1 justify-end">
                          <button onClick={() => handleEditExpense(exp)} className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors text-blue-600 cursor-pointer"><span className="material-symbols-outlined text-[16px]">edit</span></button>
                          <button onClick={() => handleDeleteExpense(exp.id)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-red-500 cursor-pointer"><span className="material-symbols-outlined text-[16px]">delete</span></button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {filteredExpenses.length > 0 && (
          <div className="px-6 py-3 border-t border-outline-variant/20 flex justify-between items-center bg-surface-container-low/30">
            <span className="text-xs font-bold text-on-surface-variant">{filteredExpenses.length} expense(s)</span>
            <span className="text-sm font-black text-red-600">{filteredExpenses.reduce((s, e) => s + e.amount, 0).toLocaleString()} DZD</span>
          </div>
        )}
      </div>

      {/* --- Winner Products Deep-Dive --- */}
      <div className="bg-surface rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-outline-variant/20">
          <h2 className="text-lg font-black text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-500">emoji_events</span>
            Winner Products Deep-Dive
          </h2>
          <p className="text-xs text-on-surface-variant mt-1">Profit margins and performance ratings for each product</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container-low text-on-surface-variant text-[10px] uppercase font-bold border-b border-outline-variant/30">
              <tr>
                <th className="px-6 py-3">#</th>
                <th className="px-6 py-3">Product</th>
                <th className="px-6 py-3 text-center">Orders</th>
                <th className="px-6 py-3 text-center">Qty Sold</th>
                <th className="px-6 py-3 text-right">Revenue</th>
                <th className="px-6 py-3 text-right">Est. Expenses</th>
                <th className="px-6 py-3 text-right">Profit</th>
                <th className="px-6 py-3 text-center">Margin</th>
                <th className="px-6 py-3 text-center">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {analytics.winnerProducts.length === 0 ? (
                <tr><td colSpan="9" className="text-center py-12 text-on-surface-variant">
                  <span className="material-symbols-outlined text-3xl opacity-30 block mb-2">inventory_2</span>
                  <p className="font-bold">No product data available</p>
                </td></tr>
              ) : (
                analytics.winnerProducts.map((p, i) => (
                  <tr key={i} className="hover:bg-surface-container-lowest transition-colors">
                    <td className="px-6 py-3">
                      {i < 3 ? (
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${i === 0 ? 'bg-amber-100 text-amber-700' : i === 1 ? 'bg-gray-100 text-gray-600' : 'bg-orange-100 text-orange-700'}`}>
                          {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
                        </div>
                      ) : <span className="text-on-surface-variant font-bold text-sm pl-2">{i + 1}</span>}
                    </td>
                    <td className="px-6 py-3 font-bold text-on-surface">{p.name}</td>
                    <td className="px-6 py-3 text-center font-medium">{p.orders}</td>
                    <td className="px-6 py-3 text-center font-medium">{p.quantity}</td>
                    <td className="px-6 py-3 text-right font-bold text-emerald-700">{p.revenue.toLocaleString()} DZD</td>
                    <td className="px-6 py-3 text-right font-medium text-red-500">{Math.round(p.expShare).toLocaleString()} DZD</td>
                    <td className="px-6 py-3 text-right font-bold" style={{ color: p.profit >= 0 ? '#059669' : '#dc2626' }}>{Math.round(p.profit).toLocaleString()} DZD</td>
                    <td className="px-6 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <div className="w-16 h-2 bg-surface-container-high rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(100, Math.max(0, p.margin))}%`, backgroundColor: p.margin > 40 ? '#059669' : p.margin > 15 ? '#f59e0b' : '#dc2626' }} />
                        </div>
                        <span className="text-[10px] font-black text-on-surface-variant">{p.margin.toFixed(0)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        p.rating === 'High Demand' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                        p.rating === 'Low Demand' ? 'bg-red-100 text-red-700 border border-red-200' :
                        'bg-amber-100 text-amber-700 border border-amber-200'
                      }`}>
                        {p.rating}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
