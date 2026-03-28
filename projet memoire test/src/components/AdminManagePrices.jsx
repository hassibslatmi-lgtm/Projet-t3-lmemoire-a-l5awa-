import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SetPriceModal from './SetPriceModal';

const getToken = () => localStorage.getItem('agrigov_token');
const BASE_URL = 'http://127.0.0.1:8000';

// بيانات وهمية ثابتة للسجل (حتى تبرمج الباكيند الخاص بها)
const STATIC_TRANSACTIONS = [
  { id: '#TXN-88421', date: 'Oct 24, 2023', buyer: 'Urban Fresh Co.', seller: 'Green Valley Farm', amount: '$4,250.00', status: 'Completed' },
  { id: '#TXN-88420', date: 'Oct 24, 2023', buyer: 'Market Street', seller: 'Swift Logistics', amount: '$840.00', status: 'Pending' },
  { id: '#TXN-88419', date: 'Oct 23, 2023', buyer: 'AgroMart', seller: 'Sun-Ripe Orchards', amount: '$12,400.00', status: 'Failed' },
];

export default function AdminManagePrices() {
  const [products, setProducts] = useState([]); // هذه تأتي من الباكيند
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchPrices = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/products/official-prices/`);
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching prices:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPrices(); }, []);

  const handleSavePrice = async (formData) => {
    const token = getToken();
    const config = { headers: { 'Authorization': `Token ${token}`, 'Content-Type': 'multipart/form-data' } };
    try {
      if (editingProduct) {
        await axios.patch(`${BASE_URL}/api/products/official-prices/update/${editingProduct.id}/`, formData, config);
      } else {
        await axios.post(`${BASE_URL}/api/products/official-prices/add/`, formData, config);
      }
      fetchPrices();
      setIsModalOpen(false);
    } catch (err) { alert("Error: " + JSON.stringify(err.response?.data)); }
  };

  const handleDeletePrice = async (id) => {
    if (!window.confirm("Delete this price?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/products/official-prices/delete/${id}/`, {
        headers: { 'Authorization': `Token ${getToken()}` }
      });
      setProducts(products.filter(p => p.id !== id));
    } catch (err) { alert("Delete failed"); }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Transactions & Prices</h2>
          <p className="text-slate-500 font-medium mt-1">Monitor financial activities and set official product prices.</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-green-800 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-green-900 transition-all shadow-lg">
          <span className="material-symbols-outlined text-xl">file_download</span> Export Report
        </button>
      </div>

      {/* Stats Grid (بقي ثابتاً كما في الصورة) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Volume" value="$1,240,500" trend="+12.5%" icon="payments" color="green" />
        <StatCard title="Successful" value="8,432" trend="+8.2%" icon="check_circle" color="green" />
        <StatCard title="Pending" value="124" trend="+5.4%" icon="schedule" color="amber" />
        <StatCard title="Failed" value="42" trend="-3.1%" icon="error" color="red" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* --- قسم السجل (ثابت حالياً) --- */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b flex items-center justify-between">
            <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-green-700">history</span> Transaction History
            </h3>
            <button className="text-green-700 text-sm font-bold hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold border-b">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Buyer/Seller</th>
                  <th className="px-6 py-4">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {STATIC_TRANSACTIONS.map((txn, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-mono text-xs font-bold text-green-700">{txn.id}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{txn.date}</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-800">{txn.buyer}</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-800">{txn.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- قسم الأسعار (ديناميكي من الباكيند) --- */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b flex items-center justify-between bg-green-50/30">
            <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-green-700">sell</span> Official Prices
            </h3>
            <button onClick={() => { setEditingProduct(null); setIsModalOpen(true); }} className="bg-green-800 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 text-sm shadow-md">
              <span className="material-symbols-outlined text-base">add</span> Manage Price
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold border-b">
                <tr>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                   <tr><td colSpan="3" className="text-center py-6 text-slate-400">Loading Prices...</td></tr>
                ) : products.map(prod => (
                  <tr key={prod.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <img src={prod.image} className="size-10 rounded border object-cover" onError={(e) => e.target.src='https://via.placeholder.com/100'} />
                      <span className="font-bold text-sm text-slate-800">{prod.product_name}</span>
                    </td>
                    <td className="px-6 py-4 font-black text-green-700">{prod.price} DA</td>
                    <td className="px-6 py-4 text-right flex justify-end gap-1">
                      <button onClick={() => { setEditingProduct(prod); setIsModalOpen(true); }} className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors">
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                      <button onClick={() => handleDeletePrice(prod.id)} className="p-1.5 text-slate-400 hover:text-red-600 transition-colors">
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <SetPriceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSavePrice} initialData={editingProduct} />
    </div>
  );
}

// مكون صغير للكروت العلوية (Stats)
function StatCard({ title, value, trend, icon, color }) {
  const colorMap = {
    green: "bg-green-100 text-green-600",
    amber: "bg-amber-100 text-amber-600",
    red: "bg-red-100 text-red-600"
  };
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-slate-500 text-xs font-bold uppercase">{title}</span>
        <div className={`p-2 rounded-lg ${colorMap[color]}`}><span className="material-symbols-outlined">{icon}</span></div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-slate-800">{value}</span>
        <span className={`${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'} text-xs font-bold`}>{trend}</span>
      </div>
    </div>
  );
}