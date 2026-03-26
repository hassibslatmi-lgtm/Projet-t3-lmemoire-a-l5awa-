import React, { useState } from 'react';

// Mock list of active accounts that could be blocked
const MOCK_ACTIVE_ACCOUNTS = [
  { id: 101, name: 'Green Valley Farms', email: 'contact@greenvalley.dz', role: 'Farmer', status: 'Active' },
  { id: 102, name: 'AgroTrade Ltd', email: 'admin@agrotrade.dz', role: 'Buyer', status: 'Active' },
  { id: 103, name: 'Sarl Transport Nord', email: 'dispatch@sarlnord.dz', role: 'Transporter', status: 'Active' },
  { id: 104, name: 'Djurdjura Produce', email: 'sales@djurdjura.dz', role: 'Farmer', status: 'Active'}
];

export default function BlockAccountsModal({ isOpen, onClose }) {
  const [accounts, setAccounts] = useState(MOCK_ACTIVE_ACCOUNTS);

  if (!isOpen) return null;

  const handleToggleBlock = (id, currentStatus) => {
    // Simulate updating the backend and locally patching the status
    const newStatus = currentStatus === 'Active' ? 'Blocked' : 'Active';
    setAccounts(accounts.map(acc => acc.id === id ? { ...acc, status: newStatus } : acc));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#000000]/60 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-surface rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-outline-variant/30 bg-red-50/30">
          <div className="flex items-center gap-3">
             <span className="material-symbols-outlined text-red-600 bg-red-100 p-2 rounded-lg">lock</span>
             <h3 className="text-xl font-bold text-on-surface font-headline">Manage Active Accounts</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface-container-high rounded-full text-on-surface-variant transition-colors cursor-pointer">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Body Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <p className="text-sm text-on-surface-variant font-medium mb-6 bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30">
            Instantly block user access to the marketplace. Blocked accounts are immediately unauthorized from launching or accepting any transactions across the application.
          </p>

          <div className="space-y-3">
            {accounts.map(acc => (
              <div key={acc.id} className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-xl transition-all ${acc.status === 'Blocked' ? 'bg-red-50/50 border-red-200 opacity-60' : 'border-outline-variant/30 hover:border-red-300 hover:shadow-sm'}`}>
                
                <div className="flex items-center gap-4 mb-3 sm:mb-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${acc.status === 'Blocked' ? 'bg-red-200 text-red-700' : 'bg-primary/20 text-primary'}`}>
                    {acc.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-on-surface flex items-center gap-2">
                      {acc.name}
                      {acc.status === 'Blocked' && <span className="px-2 py-0.5 rounded bg-red-100 border border-red-200 text-[10px] text-red-700 font-bold uppercase">Blocked</span>}
                    </p>
                    <p className="text-sm font-medium text-primary">{acc.role} <span className="text-on-surface-variant font-normal">&bull; {acc.email}</span></p>
                  </div>
                </div>
                
                {acc.status === 'Active' ? (
                  <button onClick={() => handleToggleBlock(acc.id, acc.status)} className="px-5 py-2.5 bg-white border border-red-200 hover:bg-red-50 text-red-600 font-bold rounded-lg transition-all text-sm flex items-center gap-2 cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98]">
                    <span className="material-symbols-outlined text-[18px]">block</span>
                    Block User
                  </button>
                ) : (
                  <button onClick={() => handleToggleBlock(acc.id, acc.status)} className="px-5 py-2.5 bg-white border border-green-200 hover:bg-green-50 text-green-700 font-bold rounded-lg transition-all text-sm flex items-center gap-2 cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98]">
                    <span className="material-symbols-outlined text-[18px]">lock_open</span>
                    Deblock
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
