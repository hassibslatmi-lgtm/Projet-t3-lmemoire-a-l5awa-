import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SetPriceModal from './SetPriceModal';

const getToken = () => localStorage.getItem('agrigov_token');
const BASE_URL = 'http://127.0.0.1:8000';

// بيانات وهمية ثابتة للسجل (حتى تبرمج الباكيند الخاص بها لاحقاً)
const STATIC_TRANSACTIONS = [
  { id: '#TXN-88421', date: 'Oct 24, 2023', buyer: 'Urban Fresh Co.', seller: 'Green Valley Farm', amount: '4,250.00 DA', status: 'Completed' },
  { id: '#TXN-88420', date: 'Oct 24, 2023', buyer: 'Market Street', seller: 'Swift Logistics', amount: '840.00 DA', status: 'Pending' },
  { id: '#TXN-88419', date: 'Oct 23, 2023', buyer: 'AgroMart', seller: 'Sun-Ripe Orchards', amount: '12,400.00 DA', status: 'Failed' },
];

export default function AdminManagePrices() {
  const [products, setProducts] = useState([]); 
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [historyProduct, setHistoryProduct] = useState(null);

  // جلب البيانات من الباكيند
  const fetchPrices = async () => {
    setLoading(true);
    try {
      const [pricesRes, catRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/products/official-prices/`),
        axios.get(`${BASE_URL}/api/products/categories/`)
      ]);
      setProducts(pricesRes.data);
      setCategories(catRes.data);
    } catch (err) {
      console.error("Error fetching prices:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPrices(); }, []);

const handleSavePrice = async (formData) => {
    const token = getToken();
    const config = { 
      headers: { 
        'Authorization': `Token ${token}`
        // ملاحظة: نحينا Content-Type يدوياً، Axios سيتكفل بالأمر
      } 
    };

    try {
      if (editingProduct) {
        await axios.patch(`${BASE_URL}/api/products/official-prices/update/${editingProduct.id}/`, formData, config);
      } else {
        await axios.post(`${BASE_URL}/api/products/official-prices/add/`, formData, config);
      }
      fetchPrices(); 
      setIsModalOpen(false);
    } catch (err) { 
      // عرض تفاصيل الخطأ بدقة في حالة الـ 500 أو الـ 400
      const errorData = err.response?.data;
      alert("Error: " + (typeof errorData === 'object' ? JSON.stringify(errorData) : errorData || "Server Error"));
      console.error("Full Error Response:", err.response);
    }
  };

  // دالة الحذف
  const handleDeletePrice = async (id) => {
    if (!window.confirm("Are you sure you want to delete this price?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/products/official-prices/delete/${id}/`, {
        headers: { 'Authorization': `Token ${getToken()}` }
      });
      setProducts(products.filter(p => p.id !== id));
    } catch (err) { 
      alert("Delete failed"); 
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Transactions & Prices</h2>
          <p className="text-slate-500 font-medium mt-1">Monitor financial activities and set official product prices.</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-green-800 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-green-900 transition-all shadow-lg shadow-green-900/20">
          <span className="material-symbols-outlined text-xl">file_download</span> Export Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Volume" value="1,240,500 DA" trend="+12.5%" icon="payments" color="green" />
        <StatCard title="Successful" value="8,432" trend="+8.2%" icon="check_circle" color="green" />
        <StatCard title="Pending" value="124" trend="+5.4%" icon="schedule" color="amber" />
        <StatCard title="Failed" value="42" trend="-3.1%" icon="error" color="red" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* --- Transaction History (Static for now) --- */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b flex items-center justify-between bg-white">
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
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
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

        {/* --- Official Prices (Dynamic from Backend) --- */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b flex items-center justify-between bg-green-50/30">
            <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-green-700">sell</span> Official Prices
            </h3>
            <button onClick={() => { setEditingProduct(null); setIsModalOpen(true); }} className="bg-green-800 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 text-sm shadow-md hover:bg-green-900 transition-all">
              <span className="material-symbols-outlined text-base">add</span> Manage Price
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold border-b">
                <tr>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Price Info</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                   <tr><td colSpan="3" className="text-center py-10 text-slate-400">Loading Prices...</td></tr>
                ) : products.length === 0 ? (
                   <tr><td colSpan="3" className="text-center py-10 text-slate-400">No prices found.</td></tr>
                ) : products.map(prod => (
                  <tr key={prod.id} className="hover:bg-slate-50 transition-colors">
                    <td 
                        className="px-6 py-4 flex items-center gap-3 cursor-pointer group" 
                        onClick={() => setHistoryProduct(prod)}
                        title="View Price History"
                    >
                      <div className="relative">
                        <img 
                          src={prod.image || 'https://via.placeholder.com/100'} 
                          className="size-12 rounded-lg border object-cover shadow-sm group-hover:brightness-90 transition-all" 
                          onError={(e) => e.target.src='https://via.placeholder.com/100'} 
                        />
                        <div className="absolute -bottom-1 -right-1 bg-blue-100 text-blue-600 rounded-full p-0.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="material-symbols-outlined text-[10px]">history</span>
                        </div>
                      </div>
                      <div className="flex flex-col group-hover:text-blue-700 transition-colors">
                        <span className="font-bold text-sm text-slate-800 group-hover:text-blue-700 transition-colors">{prod.product_name}</span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <span className="material-symbols-outlined text-[12px]">calendar_today</span>
                          Added: {new Date(prod.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-black text-green-700 text-md">{prod.price} DA</span>
                        <span className="text-[10px] font-medium text-blue-500 flex items-center gap-1 mt-0.5">
                          <span className="material-symbols-outlined text-[12px]">update</span>
                          Updated: {new Date(prod.date_set).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => setHistoryProduct(prod)} className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all" title="View History">
                          <span className="material-symbols-outlined text-[20px]">history</span>
                        </button>
                        <button onClick={() => { setEditingProduct(prod); setIsModalOpen(true); }} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all" title="Edit Price">
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        <button onClick={() => handleDeletePrice(prod.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all">
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <SetPriceModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSavePrice} 
        initialData={editingProduct} 
        categories={categories}
      />

      {/* History Modal */}
      {historyProduct && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col border border-slate-200 overflow-hidden">
               <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white z-20">
                  <div className="flex items-center gap-3">
                     <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <span className="material-symbols-outlined">update</span>
                     </div>
                     <div>
                         <h2 className="text-lg font-black text-slate-800 leading-tight">Price History</h2>
                         <p className="text-xs text-slate-500 font-medium">Tracking changes for: <span className="font-bold text-slate-800">{historyProduct.product_name}</span></p>
                     </div>
                  </div>
                  <button onClick={() => setHistoryProduct(null)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors flex items-center justify-center">
                     <span className="material-symbols-outlined text-lg">close</span>
                  </button>
               </div>
               
               <div className="p-8 bg-slate-50/50 flex-1 overflow-y-auto max-h-[60vh]">
                   <div className="relative mx-auto max-w-md">
                      {/* Vertical Line */}
                      <div className="absolute left-6 top-5 bottom-5 w-0.5 bg-slate-200"></div>
                      
                      {/* Current Price */}
                      <div className="relative pl-16 py-4 group">
                          <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full border-4 border-slate-50 bg-blue-500 text-white shadow-sm z-10 transition-transform group-hover:scale-110">
                              <span className="material-symbols-outlined text-[14px]">sell</span>
                          </div>
                          <div className="bg-white p-5 rounded-xl border border-blue-100 shadow-sm relative">
                              <div className="absolute w-3 h-3 bg-white border-l border-b border-blue-100 rotate-45 -left-[7px] top-1/2 -translate-y-1/2"></div>
                              <div className="flex items-center justify-between mb-1">
                                  <span className="font-black text-slate-800 text-lg">{historyProduct.price} DA</span>
                                  <span className="text-[10px] uppercase tracking-wider font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100">Current Price</span>
                              </div>
                              <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                                Set on {new Date(historyProduct.date_set).toLocaleDateString()}
                              </p>
                          </div>
                      </div>

                      {/* Fake Past Price 1 */}
                      <div className="relative pl-16 py-4 group">
                          <div className="absolute left-2.5 top-1/2 -translate-y-1/2 flex items-center justify-center w-7 h-7 rounded-full border-4 border-slate-50 bg-slate-200 text-slate-500 shadow-sm z-10 transition-transform group-hover:scale-110">
                              <span className="material-symbols-outlined text-[12px]">history</span>
                          </div>
                          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm opacity-80 hover:opacity-100 transition-opacity relative">
                              <div className="absolute w-3 h-3 bg-white border-l border-b border-slate-200 rotate-45 -left-[7px] top-1/2 -translate-y-1/2"></div>
                              <div className="flex items-center justify-between mb-1">
                                  <span className="font-bold text-slate-700 text-base">{(parseFloat(historyProduct.price) * 0.9).toFixed(2)} DA</span>
                                  <span className="text-[10px] text-slate-400 font-medium">Previous</span>
                              </div>
                              <p className="text-xs text-slate-400 flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                                1 month ago
                              </p>
                          </div>
                      </div>

                      {/* Fake Past Price 2 */}
                      <div className="relative pl-16 py-4 group">
                          <div className="absolute left-2.5 top-1/2 -translate-y-1/2 flex items-center justify-center w-7 h-7 rounded-full border-4 border-slate-50 bg-slate-200 text-slate-500 shadow-sm z-10 transition-transform group-hover:scale-110">
                              <span className="material-symbols-outlined text-[12px]">history</span>
                          </div>
                          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm opacity-60 hover:opacity-100 transition-opacity relative">
                              <div className="absolute w-3 h-3 bg-white border-l border-b border-slate-200 rotate-45 -left-[7px] top-1/2 -translate-y-1/2"></div>
                              <div className="flex items-center justify-between mb-1">
                                  <span className="font-bold text-slate-700 text-base">{(parseFloat(historyProduct.price) * 0.82).toFixed(2)} DA</span>
                                  <span className="text-[10px] text-slate-400 font-medium">Previous</span>
                              </div>
                              <p className="text-xs text-slate-400 flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                                3 months ago
                              </p>
                          </div>
                      </div>

                   </div>
               </div>
               
               <div className="px-6 py-4 border-t border-slate-100 bg-white flex justify-end">
                   <button onClick={() => setHistoryProduct(null)} className="px-8 py-2.5 bg-slate-800 text-white font-bold rounded-xl shadow-md hover:bg-slate-900 transition-all text-sm">
                       Close Timeline
                   </button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, trend, icon, color }) {
  const colorMap = {
    green: "bg-green-100 text-green-600",
    amber: "bg-amber-100 text-amber-600",
    red: "bg-red-100 text-red-600"
  };
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">{title}</span>
        <div className={`p-2 rounded-lg ${colorMap[color]}`}>
          <span className="material-symbols-outlined">{icon}</span>
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-black text-slate-800">{value}</span>
        <span className={`${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'} text-xs font-bold bg-slate-50 px-1.5 py-0.5 rounded`}>
          {trend}
        </span>
      </div>
    </div>
  );
}