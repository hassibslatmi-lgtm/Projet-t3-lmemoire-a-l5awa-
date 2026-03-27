import React, { useState, useEffect } from 'react';
import { getValidatedUsers, toggleBlock } from '../services/api';

export default function BlockAccountsModal({ isOpen, onClose }) {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [togglingId, setTogglingId] = useState(null);

  useEffect(() => {
    if (isOpen) fetchValidated();
  }, [isOpen]);

  const fetchValidated = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getValidatedUsers();
      setAccounts(data);
    } catch (err) {
      setError('Failed to load accounts. Make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleToggle = async (id, currentStatus) => {
    setTogglingId(id);
    try {
      const res = await toggleBlock(id);
      setAccounts(prev =>
        prev.map(acc => acc.id === id ? { ...acc, status: res.new_status } : acc)
      );
    } catch (err) {
      alert('Action failed. Please try again.');
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#000000]/60 backdrop-blur-sm" onClick={onClose}></div>
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

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <p className="text-sm text-on-surface-variant font-medium bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30">
            Instantly block or unblock user access to the marketplace. Blocked accounts are immediately unauthorized from launching or accepting any transactions.
          </p>

          {loading && (
            <div className="flex items-center justify-center py-12">
              <span className="animate-spin material-symbols-outlined text-primary text-4xl">progress_activity</span>
            </div>
          )}

          {error && !loading && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-start gap-3">
              <span className="material-symbols-outlined text-red-600 flex-shrink-0">error</span>
              {error}
            </div>
          )}

          {!loading && !error && (
            <div className="space-y-3">
              {accounts.length === 0 && (
                <p className="text-center text-on-surface-variant py-8">No active or blocked accounts found.</p>
              )}
              {accounts.map(acc => {
                const isBlocked  = acc.status === 'blocked';
                const isToggling = togglingId === acc.id;
                return (
                  <div key={acc.id} className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-xl transition-all ${isBlocked ? 'bg-red-50/50 border-red-200 opacity-75' : 'border-outline-variant/30 hover:border-red-300 hover:shadow-sm'}`}>
                    <div className="flex items-center gap-4 mb-3 sm:mb-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${isBlocked ? 'bg-red-200 text-red-700' : 'bg-primary/20 text-primary'}`}>
                        {(acc.full_name || acc.username || '?').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-on-surface flex items-center gap-2">
                          {acc.full_name || acc.username}
                          {isBlocked && <span className="px-2 py-0.5 rounded bg-red-100 border border-red-200 text-[10px] text-red-700 font-bold uppercase">Blocked</span>}
                        </p>
                        <p className="text-sm font-medium text-primary capitalize">
                          {acc.role} <span className="text-on-surface-variant font-normal">• {acc.email}</span>
                        </p>
                      </div>
                    </div>

                    {isBlocked ? (
                      <button onClick={() => handleToggle(acc.id, acc.status)} disabled={isToggling}
                        className="px-5 py-2.5 bg-white border border-green-200 hover:bg-green-50 text-green-700 font-bold rounded-lg transition-all text-sm flex items-center gap-2 cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60">
                        {isToggling ? <span className="animate-spin material-symbols-outlined text-[18px]">progress_activity</span> : <span className="material-symbols-outlined text-[18px]">lock_open</span>}
                        Deblock
                      </button>
                    ) : (
                      <button onClick={() => handleToggle(acc.id, acc.status)} disabled={isToggling}
                        className="px-5 py-2.5 bg-white border border-red-200 hover:bg-red-50 text-red-600 font-bold rounded-lg transition-all text-sm flex items-center gap-2 cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60">
                        {isToggling ? <span className="animate-spin material-symbols-outlined text-[18px]">progress_activity</span> : <span className="material-symbols-outlined text-[18px]">block</span>}
                        Block User
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
