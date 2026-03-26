import React, { useState } from 'react';
import SetPriceModal from './SetPriceModal';

const INITIAL_TRANSACTIONS = [
  { id: '#TXN-88421', date: 'Oct 24, 2023', buyer: 'Urban Fresh Co.', seller: 'Green Valley Farm', amount: '$4,250.00', method: 'Bank Transfer', status: 'Completed' },
  { id: '#TXN-88420', date: 'Oct 24, 2023', buyer: 'Market Street Grocers', seller: 'Swift Logistics', amount: '$840.00', method: 'Mobile Wallet', status: 'Pending' },
  { id: '#TXN-88419', date: 'Oct 23, 2023', buyer: 'AgroMart Distribution', seller: 'Sun-Ripe Orchards', amount: '$12,400.00', method: 'Bank Transfer', status: 'Failed' },
  { id: '#TXN-88418', date: 'Oct 23, 2023', buyer: 'Central Kitchen', seller: 'Local Dairy Co-op', amount: '$2,100.00', method: 'Credit Card', status: 'Refunded' },
  { id: '#TXN-88417', date: 'Oct 23, 2023', buyer: 'The Green Bistro', seller: 'Organic Acres', amount: '$530.00', method: 'Mobile Wallet', status: 'Completed' },
];

const INITIAL_OFFICIAL_PRICES = [
  { id: 101, name: 'Premium Wheat', price: '42.50', img: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=100&q=80', dateSet: 'Oct 20, 2023' },
  { id: 102, name: 'Organic Apples', price: '18.20', img: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6faa6?w=100&q=80', dateSet: 'Oct 22, 2023' },
  { id: 103, name: 'Red Onions', price: '12.00', img: 'https://images.unsplash.com/photo-1618512496248-a07ce83aa8cb?w=100&q=80', dateSet: 'Oct 25, 2023' },
];

export default function AdminManagePrices() {
  const [products, setProducts] = useState(INITIAL_OFFICIAL_PRICES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const handleManagePrice = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditPrice = (prod) => {
    setEditingProduct(prod);
    setIsModalOpen(true);
  };

  const handleDeletePrice = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const handleSavePrice = (productData) => {
    if (editingProduct) {
      setProducts(products.map(p => p.id === productData.id ? productData : p));
    } else {
      setProducts([productData, ...products]);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">Completed</span>;
      case 'Pending': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700">Pending</span>;
      case 'Failed': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700">Failed</span>;
      case 'Refunded': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">Refunded</span>;
      default: return null;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-surface-container-lowest">
      
      {/* Page Title & Export */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-on-surface tracking-tight">Transactions & Prices</h2>
          <p className="text-on-surface-variant font-medium mt-1">Monitor financial activities and set official product prices.</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20 shrink-0 cursor-pointer">
          <span className="material-symbols-outlined text-xl">file_download</span>
          Export Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-outline-variant/30 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-on-surface-variant text-sm font-semibold uppercase">Total Volume</span>
            <div className="bg-primary/10 p-2 rounded-lg text-primary">
              <span className="material-symbols-outlined">payments</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-on-surface">$1,240,500</span>
            <span className="text-green-600 text-xs font-bold">+12.5%</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-outline-variant/30 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-on-surface-variant text-sm font-semibold uppercase">Successful</span>
            <div className="bg-green-100 p-2 rounded-lg text-green-600">
              <span className="material-symbols-outlined">check_circle</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-on-surface">8,432</span>
            <span className="text-green-600 text-xs font-bold">+8.2%</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-outline-variant/30 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-on-surface-variant text-sm font-semibold uppercase">Pending</span>
            <div className="bg-amber-100 p-2 rounded-lg text-amber-600">
              <span className="material-symbols-outlined">schedule</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-on-surface">124</span>
            <span className="text-amber-600 text-xs font-bold">+5.4%</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-outline-variant/30 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-on-surface-variant text-sm font-semibold uppercase">Failed/Refunded</span>
            <div className="bg-red-100 p-2 rounded-lg text-red-600">
              <span className="material-symbols-outlined">error</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-on-surface">42</span>
            <span className="text-red-600 text-xs font-bold">-3.1%</span>
          </div>
        </div>
      </div>

      {/* Two-Column Layout for History and Prices */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Transaction History Column */}
        <div className="bg-white rounded-xl shadow-sm border border-outline-variant/30 flex flex-col h-full overflow-hidden">
          <div className="p-6 border-b border-outline-variant/30 flex items-center justify-between">
            <h3 className="font-bold text-lg text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">history</span> Transaction History
            </h3>
            <button className="text-primary text-sm font-bold hover:underline">View All</button>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
              <thead>
                <tr className="bg-surface-container-lowest text-on-surface-variant text-xs uppercase font-bold border-b border-outline-variant/30">
                  <th className="px-6 py-4">Transaction ID</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Buyer / Seller</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {INITIAL_TRANSACTIONS.map((txn, idx) => (
                  <tr key={idx} className="hover:bg-surface-container-lowest/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs font-semibold text-primary">{txn.id}</td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">{txn.date}</td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-on-surface">{txn.buyer}</p>
                      <p className="text-xs text-on-surface-variant">from {txn.seller}</p>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-on-surface">{txn.amount}</td>
                    <td className="px-6 py-4">{getStatusBadge(txn.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Official Prices Column */}
        <div className="bg-white rounded-xl shadow-sm border border-outline-variant/30 flex flex-col h-full overflow-hidden">
          <div className="p-6 border-b border-outline-variant/30 flex items-center justify-between bg-primary/5">
            <div>
              <h3 className="font-bold text-lg text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">sell</span> Official Prices
              </h3>
              <p className="text-xs text-on-surface-variant mt-1">Set standardized agricultural product rates.</p>
            </div>
            <button onClick={handleManagePrice} className="bg-primary text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-md shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer text-sm">
              <span className="material-symbols-outlined text-base">add</span>
              Manage Price
            </button>
          </div>
          
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-on-surface-variant text-xs uppercase font-bold border-b border-outline-variant/30">
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Official Price</th>
                  <th className="px-6 py-4">Date Set</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {products.length === 0 ? (
                   <tr>
                     <td colSpan="4" className="px-6 py-12 text-center text-on-surface-variant">
                       No official prices set. Click 'Manage Price' to add one.
                     </td>
                   </tr>
                ) : products.map(prod => (
                  <tr key={prod.id} className="hover:bg-surface-container-lowest/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="size-10 rounded-lg bg-surface-container-high flex-shrink-0 bg-cover bg-center border border-outline-variant/30 shadow-sm"
                          style={{ backgroundImage: `url('${prod.img}')` }}
                        ></div>
                        <p className="font-bold text-sm text-on-surface">{prod.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-black text-primary">${prod.price}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold px-2.5 py-1 bg-surface-container-lowest border border-outline-variant/30 rounded-lg text-on-surface-variant">
                        {prod.dateSet}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex items-center justify-end gap-1">
                      <button onClick={() => handleEditPrice(prod)} className="p-1.5 text-on-surface-variant hover:text-primary transition-colors cursor-pointer rounded-full hover:bg-primary/5" title="Modify Price">
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                      </button>
                      <button onClick={() => handleDeletePrice(prod.id)} className="p-1.5 text-on-surface-variant hover:text-red-500 transition-colors cursor-pointer rounded-full hover:bg-red-50" title="Remove">
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
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
      />
    </div>
  );
}
