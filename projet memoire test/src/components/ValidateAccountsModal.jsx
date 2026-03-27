import React, { useState, useEffect } from 'react';
import { getPendingUsers, manageUser } from '../services/api';

// Map backend keys to display labels for role-specific fields
function RoleCredentials({ user }) {
  const role = user.role;
  const f = user.farmer;
  const b = user.buyer;
  const t = user.transporter;

  if (role === 'farmer' && f) return (
    <>
      <InfoCard label="Farmer Card" value={f.farmer_card} />
      <InfoCard label="Farm Area" value={`${f.farm_area} Hectares`} />
      <InfoCard label="Farm Location" value={f.farm_location} />
    </>
  );
  if (role === 'buyer' && b) return (
    <InfoCard label="Commercial Register" value={b.registre_commerce} />
  );
  if (role === 'transporter' && t) return (
    <>
      <InfoCard label="Driver License" value={t.driver_license_number} />
      <InfoCard label="License Type" value={t.license_type} />
      <InfoCard label="License Expiry" value={t.license_expiry_date} />
      <InfoCard label="Vehicle" value={`${t.vehicle_name} ${t.vehicle_year ? `(${t.vehicle_year})` : ''}`} />
    </>
  );
  return null;
}

function InfoCard({ label, value }) {
  return (
    <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 shadow-sm">
      <p className="text-xs text-primary mb-1 uppercase font-bold">{label}</p>
      <p className="text-sm font-bold text-on-surface">{value || '—'}</p>
    </div>
  );
}

export default function ValidateAccountsModal({ isOpen, onClose }) {
  const [view, setView] = useState('list');
  const [selectedUser, setSelectedUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setView('list');
      setSelectedUser(null);
      fetchPending();
    }
  }, [isOpen]);

  const fetchPending = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getPendingUsers();
      setAccounts(data);
    } catch (err) {
      setError('Failed to load pending accounts. Make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setView('details');
  };

  const handleBack = () => {
    setSelectedUser(null);
    setView('list');
  };

  const handleAction = async (action) => {
    setActionLoading(true);
    try {
      await manageUser(selectedUser.id, action);
      setAccounts(prev => prev.filter(a => a.id !== selectedUser.id));
      handleBack();
    } catch (err) {
      alert('Action failed. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#000000]/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-2xl bg-surface rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-outline-variant/30">
          <div className="flex items-center gap-3">
            {view === 'details' && (
              <button onClick={handleBack} className="p-2 hover:bg-surface-container-high rounded-full text-on-surface-variant transition-colors cursor-pointer">
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
            )}
            <h3 className="text-xl font-bold text-on-surface font-headline">
              {view === 'list' ? 'Validate Pending Accounts' : 'Review User Details'}
            </h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface-container-high rounded-full text-on-surface-variant transition-colors cursor-pointer">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading && (
            <div className="flex items-center justify-center py-16">
              <span className="animate-spin material-symbols-outlined text-primary text-4xl">progress_activity</span>
            </div>
          )}

          {error && !loading && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-start gap-3">
              <span className="material-symbols-outlined text-red-600 flex-shrink-0">error</span>
              {error}
            </div>
          )}

          {!loading && !error && view === 'list' && (
            <div className="space-y-4">
              {accounts.length === 0 ? (
                <div className="text-center py-10">
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant/50 mb-2">check_circle</span>
                  <p className="text-on-surface-variant font-medium">All pending accounts have been validated!</p>
                </div>
              ) : accounts.map(acc => (
                <div key={acc.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-outline-variant/30 rounded-xl hover:bg-surface-container-lowest transition-colors group">
                  <div className="flex items-center gap-4 mb-3 sm:mb-0">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shadow-sm">
                      {(acc.full_name || acc.username || '?').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-on-surface">{acc.full_name || acc.username}</p>
                      <p className="text-sm font-semibold text-primary capitalize">{acc.role}</p>
                      <p className="text-xs text-on-surface-variant">{acc.email}</p>
                    </div>
                  </div>
                  <button onClick={() => handleSelectUser(acc)} className="px-4 py-2 bg-surface hover:bg-surface-container font-semibold text-primary border border-primary/20 rounded-lg transition-colors text-sm shadow-sm cursor-pointer">
                    Review Application
                  </button>
                </div>
              ))}
            </div>
          )}

          {!loading && !error && view === 'details' && selectedUser && (
            <div className="space-y-8 pb-4">
              <div>
                <h4 className="text-2xl font-black text-on-surface font-headline">{selectedUser.full_name || selectedUser.username}</h4>
                <p className="text-primary font-semibold capitalize">{selectedUser.role}</p>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="px-2 py-1 rounded text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">Pending Validation</span>
                  <span className="text-xs text-on-surface-variant bg-surface-container-lowest px-2 py-1 rounded border border-outline-variant/50">
                    Joined: {new Date(selectedUser.date_joined || selectedUser.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Core Info */}
              <div>
                <h5 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-4">Core Information</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[['Email Address', selectedUser.email], ['Phone Number', selectedUser.phone], ['Gender', selectedUser.sex === 'M' ? 'Male' : selectedUser.sex === 'F' ? 'Female' : '—'], ['Address', selectedUser.address]].map(([label, value]) => (
                    <div key={label} className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30">
                      <p className="text-xs text-on-surface-variant mb-1 uppercase font-semibold">{label}</p>
                      <p className="text-sm font-semibold text-on-surface truncate" title={value}>{value || '—'}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Role Credentials */}
              <div>
                <h5 className="text-sm font-bold uppercase tracking-widest text-primary mb-4 capitalize">{selectedUser.role} Credentials</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <RoleCredentials user={selectedUser} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {view === 'details' && !loading && (
          <div className="p-6 border-t border-outline-variant/30 bg-surface-container flex gap-4">
            <button onClick={() => handleAction('approve')} disabled={actionLoading}
              className="flex-1 py-3 px-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60">
              {actionLoading ? <span className="animate-spin material-symbols-outlined text-lg">progress_activity</span> : <span className="material-symbols-outlined text-lg">check_circle</span>}
              Validate Account
            </button>
            <button onClick={() => handleAction('reject')} disabled={actionLoading}
              className="flex-1 py-3 px-4 bg-white text-red-600 border border-red-200 font-bold rounded-xl hover:bg-red-50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-60">
              <span className="material-symbols-outlined text-lg">cancel</span>
              Reject Application
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
