import React, { useState } from 'react';

// Mock Pending Accounts combining dynamic role requirements
const MOCK_ACCOUNTS = [
  {
    id: 1,
    name: 'Abdennour Ghelbi',
    email: 'abdennour.ghelbi@univ-constantine2.dz',
    phone: '0794478087',
    role: 'Buyer',
    location: 'Constantine',
    registeredAt: 'Oct 12, 2026',
    gender: 'Male',
    dob: '1995-05-14',
    address: '123 Fake Street',
    dynamic: {
      commercialRegister: 'CR-8893-XQZ'
    }
  },
  {
    id: 2,
    name: 'Sarah Weber',
    email: 'sarah@weberfarms.dz',
    phone: '0654321098',
    role: 'Farmer',
    location: 'Algiers',
    registeredAt: 'Oct 15, 2026',
    gender: 'Female',
    dob: '1988-11-20',
    address: '44 Farm Road',
    dynamic: {
      farmerCard: 'F-8892-1111',
      farmArea: '45.0',
      farmLocation: 'Algiers'
    }
  },
  {
    id: 3,
    name: 'Marcus Johnson',
    email: 'm.johnson@logix.dz',
    phone: '0555667788',
    role: 'Transporter',
    location: 'Oran',
    registeredAt: 'Oct 20, 2026',
    gender: 'Male',
    dob: '1990-01-01',
    address: '99 Trans Route',
    dynamic: {
      driverLicense: 'DL-A-9988',
      vehicleName: 'Toyota Hilux 4x4',
      vehicleYear: '2019'
    }
  }
];

export default function ValidateAccountsModal({ isOpen, onClose }) {
  const [view, setView] = useState('list');
  const [selectedUser, setSelectedUser] = useState(null);
  const [accounts, setAccounts] = useState(MOCK_ACCOUNTS);

  if (!isOpen) return null;

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setView('details');
  };

  const handleBack = () => {
    setSelectedUser(null);
    setView('list');
  };

  const handleAction = (actionType) => {
    // Mock the backend action, dropping the user from the "pending" list locally.
    setAccounts(accounts.filter((a) => a.id !== selectedUser.id));
    handleBack();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#000000]/60 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal Card */}
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

        {/* Body View Container */}
        <div className="flex-1 overflow-y-auto p-6">
          {view === 'list' && (
            <div className="space-y-4">
              {accounts.length === 0 ? (
                <div className="text-center py-10">
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant/50 mb-2">check_circle</span>
                  <p className="text-on-surface-variant font-medium">All pending accounts have been validated!</p>
                </div>
              ) : (
                accounts.map(acc => (
                  <div key={acc.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-outline-variant/30 rounded-xl hover:bg-surface-container-lowest transition-colors group">
                    <div className="flex items-center gap-4 mb-3 sm:mb-0">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shadow-sm">
                        {acc.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-on-surface">{acc.name}</p>
                        <p className="text-sm font-semibold text-primary">{acc.role}</p>
                        <p className="text-xs text-on-surface-variant">{acc.email}</p>
                      </div>
                    </div>
                    <button onClick={() => handleSelectUser(acc)} className="px-4 py-2 bg-surface hover:bg-surface-container font-semibold text-primary border border-primary/20 rounded-lg transition-colors text-sm shadow-sm cursor-pointer">
                      Review Application
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {view === 'details' && selectedUser && (
            <div className="space-y-8 pb-4">
              {/* Profile Header */}
              <div>
                <h4 className="text-2xl font-black text-on-surface font-headline">{selectedUser.name}</h4>
                <p className="text-primary font-semibold">{selectedUser.role}</p>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="px-2 py-1 rounded text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
                    Pending Validation
                  </span>
                  <span className="text-xs text-on-surface-variant bg-surface-container-lowest px-2 py-1 rounded border border-outline-variant/50">
                    Reg: {selectedUser.registeredAt}
                  </span>
                </div>
              </div>

              {/* Personal Info grid */}
              <div>
                <h5 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-4">Core Information</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30">
                    <p className="text-xs text-on-surface-variant mb-1 uppercase font-semibold">Email Address</p>
                    <p className="text-sm font-semibold text-on-surface truncate" title={selectedUser.email}>{selectedUser.email}</p>
                  </div>
                  <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30">
                    <p className="text-xs text-on-surface-variant mb-1 uppercase font-semibold">Phone Number</p>
                    <p className="text-sm font-semibold text-on-surface">{selectedUser.phone}</p>
                  </div>
                  <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30">
                    <p className="text-xs text-on-surface-variant mb-1 uppercase font-semibold">Gender</p>
                    <p className="text-sm font-semibold text-on-surface">{selectedUser.gender}</p>
                  </div>
                  <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30">
                    <p className="text-xs text-on-surface-variant mb-1 uppercase font-semibold">Date of Birth</p>
                    <p className="text-sm font-semibold text-on-surface">{selectedUser.dob}</p>
                  </div>
                </div>
              </div>

              {/* Dynamic Role Info */}
              <div>
                <h5 className="text-sm font-bold uppercase tracking-widest text-primary mb-4">{selectedUser.role} Credentials</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedUser.role === 'Buyer' && (
                    <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 shadow-sm">
                      <p className="text-xs text-primary mb-1 uppercase font-bold">Commercial Register</p>
                      <p className="text-sm font-bold text-on-surface">{selectedUser.dynamic.commercialRegister}</p>
                    </div>
                  )}
                  {selectedUser.role === 'Farmer' && (
                    <>
                      <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 shadow-sm">
                        <p className="text-xs text-primary mb-1 uppercase font-bold">Farmer Card</p>
                        <p className="text-sm font-bold text-on-surface">{selectedUser.dynamic.farmerCard}</p>
                      </div>
                      <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 shadow-sm">
                        <p className="text-xs text-primary mb-1 uppercase font-bold">Farm Area</p>
                        <p className="text-sm font-bold text-on-surface">{selectedUser.dynamic.farmArea} Hectares</p>
                      </div>
                      <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 shadow-sm">
                        <p className="text-xs text-primary mb-1 uppercase font-bold">Location</p>
                        <p className="text-sm font-bold text-on-surface">{selectedUser.dynamic.farmLocation}</p>
                      </div>
                    </>
                  )}
                  {selectedUser.role === 'Transporter' && (
                    <>
                      <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 shadow-sm">
                        <p className="text-xs text-primary mb-1 uppercase font-bold">Driver License</p>
                        <p className="text-sm font-bold text-on-surface">{selectedUser.dynamic.driverLicense}</p>
                      </div>
                      <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 shadow-sm">
                        <p className="text-xs text-primary mb-1 uppercase font-bold">Vehicle Name</p>
                        <p className="text-sm font-bold text-on-surface">{selectedUser.dynamic.vehicleName}</p>
                      </div>
                      <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 shadow-sm">
                        <p className="text-xs text-primary mb-1 uppercase font-bold">Vehicle Year</p>
                        <p className="text-sm font-bold text-on-surface">{selectedUser.dynamic.vehicleYear}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions (Only visible in details view) */}
        {view === 'details' && (
          <div className="p-6 border-t border-outline-variant/30 bg-surface-container flex gap-4">
            <button onClick={() => handleAction('validate')} className="flex-1 py-3 px-4 bg-primary text-white font-bold rounded-xl editorial-shadow hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer border border-transparent">
              <span className="material-symbols-outlined text-lg">check_circle</span>
              Validate Account
            </button>
            <button onClick={() => handleAction('reject')} className="flex-1 py-3 px-4 bg-white text-red-600 border border-red-200 font-bold rounded-xl hover:bg-red-50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm">
              <span className="material-symbols-outlined text-lg">cancel</span>
              Reject Application
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
