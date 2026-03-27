import React, { useState, useMemo } from 'react';

const MOCK_COMPLAINTS = [
  { id: 'C-8821', name: 'Sarah Chen', role: 'Farmer', date: '2023-10-24', dateLabel: 'Oct 24, 2023', type: 'Product Quality', status: 'In Progress', initials: 'SC', color: 'bg-rose-400',
    product: 'Organic Red Tomatoes - 5kg', message: '"The product I received was damaged and the delivery was late."',
    chat: [{ from: 'user', text: 'Is there any way to get a refund? The tomatoes are bruised.', time: '10:45 AM' }, { from: 'admin', text: "Hello Sarah, I'm sorry to hear that. Could you please upload a photo of the damaged items?", time: '10:52 AM' }, { from: 'user', text: 'Sure, sending them now.', time: '11:05 AM' }] },
  { id: 'C-8819', name: 'Robert Miller', role: 'Buyer', date: '2023-10-23', dateLabel: 'Oct 23, 2023', type: 'Delivery', status: 'Open', initials: 'RM', color: 'bg-blue-400',
    product: 'Organic Wheat Bags - 50kg', message: '"My delivery arrived 5 days late with no notification."',
    chat: [{ from: 'user', text: 'Where is my order? It was supposed to arrive 5 days ago.', time: '09:12 AM' }] },
  { id: 'C-8815', name: 'Emma Wilson', role: 'Buyer', date: '2023-10-22', dateLabel: 'Oct 22, 2023', type: 'Payment', status: 'Resolved', initials: 'EW', color: 'bg-purple-400',
    product: 'Dairy Yogurt Pack - 12 Units', message: '"I was double charged for my last order."',
    chat: [{ from: 'user', text: 'I was charged twice for the same order.', time: '02:30 PM' }, { from: 'admin', text: 'We have processed a full refund for the duplicate charge.', time: '03:45 PM' }, { from: 'user', text: 'Thank you! I can see the refund now.', time: '04:00 PM' }] },
  { id: 'C-8812', name: 'David Smith', role: 'Farmer', date: '2023-10-22', dateLabel: 'Oct 22, 2023', type: 'Product Quality', status: 'Open', initials: 'DS', color: 'bg-amber-500',
    product: 'Fresh Apple Crate - 20kg', message: '"More than half the apples were rotten on arrival."',
    chat: [{ from: 'user', text: 'Half the apples in my crate were rotten!', time: '11:00 AM' }] },
  { id: 'C-8809', name: 'Leila Mansouri', role: 'Transporter', date: '2023-10-20', dateLabel: 'Oct 20, 2023', type: 'Service', status: 'Pending', initials: 'LM', color: 'bg-teal-500',
    product: 'Transport Service — Oran Route', message: '"The transporter did not show up at the agreed time."',
    chat: [{ from: 'user', text: 'The transporter never showed up on time. We lost the whole load.', time: '08:00 AM' }] },
];

const STATUS_STYLES = {
  'In Progress': 'bg-amber-100 text-amber-700',
  'Open':        'bg-slate-100 text-slate-600',
  'Resolved':    'bg-green-100 text-green-700',
  'Pending':     'bg-blue-100 text-blue-700',
};

const ROLE_STYLES = {
  'Farmer':      'bg-green-100 text-green-800',
  'Buyer':       'bg-blue-100 text-blue-800',
  'Transporter': 'bg-orange-100 text-orange-800',
};

const TABS = ['All', 'Open', 'In Progress', 'Resolved', 'Pending'];
const ROLES = ['All Roles', 'Farmer', 'Buyer', 'Transporter'];

export default function AdminComplaints() {
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterRole, setFilterRole] = useState('All Roles');
  const [sortBy, setSortBy] = useState('Date');
  const [selectedId, setSelectedId] = useState('C-8821');
  const [replyText, setReplyText] = useState('');
  const [complaints, setComplaints] = useState(MOCK_COMPLAINTS);
  const [searchText, setSearchText] = useState('');

  const selected = complaints.find(c => c.id === selectedId);

  const filtered = useMemo(() => {
    let result = complaints;
    if (filterStatus !== 'All') result = result.filter(c => c.status === filterStatus);
    if (filterRole !== 'All Roles') result = result.filter(c => c.role === filterRole);
    if (searchText) result = result.filter(c =>
      c.name.toLowerCase().includes(searchText.toLowerCase()) ||
      c.id.toLowerCase().includes(searchText.toLowerCase()) ||
      c.type.toLowerCase().includes(searchText.toLowerCase())
    );
    if (sortBy === 'Date') result = [...result].sort((a, b) => new Date(b.date) - new Date(a.date));
    if (sortBy === 'Status') result = [...result].sort((a, b) => a.status.localeCompare(b.status));
    if (sortBy === 'Type') result = [...result].sort((a, b) => a.type.localeCompare(b.type));
    if (sortBy === 'User') result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === 'Role') result = [...result].sort((a, b) => a.role.localeCompare(b.role));
    return result;
  }, [complaints, filterStatus, filterRole, sortBy, searchText]);

  const handleResolve = () => {
    setComplaints(prev => prev.map(c => c.id === selectedId ? { ...c, status: 'Resolved' } : c));
  };

  const handleReply = () => {
    if (!replyText.trim()) return;
    const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    setComplaints(prev => prev.map(c => c.id === selectedId
      ? { ...c, chat: [...c.chat, { from: 'admin', text: replyText, time: now }] }
      : c
    ));
    setReplyText('');
  };

  const totalOpen = complaints.filter(c => c.status === 'Open' || c.status === 'In Progress').length;
  const totalResolved = complaints.filter(c => c.status === 'Resolved').length;

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-surface-container-lowest flex flex-col gap-6">

      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-on-surface tracking-tight">Complaints Management</h2>
          <p className="text-on-surface-variant font-medium mt-1">Review and resolve farmer and buyer concerns.</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20 shrink-0 cursor-pointer">
          <span className="material-symbols-outlined text-xl">download</span>
          Export Report
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-outline-variant/30 shadow-sm">
          <p className="text-on-surface-variant text-xs font-bold uppercase tracking-wider">Total Complaints</p>
          <div className="flex items-end justify-between mt-1">
            <p className="text-2xl font-black text-on-surface">{complaints.length}</p>
            <span className="text-green-600 text-xs font-bold flex items-center bg-green-50 px-1.5 py-0.5 rounded">+12% <span className="material-symbols-outlined text-xs">trending_up</span></span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-outline-variant/30 shadow-sm">
          <p className="text-on-surface-variant text-xs font-bold uppercase tracking-wider">Open</p>
          <div className="flex items-end justify-between mt-1">
            <p className="text-2xl font-black text-on-surface">{totalOpen}</p>
            <span className="text-primary text-xs font-bold bg-primary/5 px-1.5 py-0.5 rounded">Active cases</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-outline-variant/30 shadow-sm">
          <p className="text-on-surface-variant text-xs font-bold uppercase tracking-wider">Resolved</p>
          <div className="flex items-end justify-between mt-1">
            <p className="text-2xl font-black text-on-surface">{totalResolved}</p>
            <span className="text-slate-400 text-xs font-bold flex items-center bg-slate-50 px-1.5 py-0.5 rounded"><span className="material-symbols-outlined text-xs">check_circle</span></span>
          </div>
        </div>
      </div>

      {/* Main split-view */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">

        {/* Left: List */}
        <div className="lg:col-span-2 flex flex-col gap-4">

          {/* Filters + Role Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-outline-variant/30 shadow-sm">
            <div className="flex flex-wrap gap-1 items-center">
              {/* Status Tabs */}
              {TABS.map(tab => (
                <button key={tab} onClick={() => setFilterStatus(tab)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${filterStatus === tab ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
                  {tab}
                </button>
              ))}
              <span className="mx-1 text-outline-variant/40">|</span>
              {/* Role Buttons */}
              {ROLES.map(role => (
                <button key={role} onClick={() => setFilterRole(role)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                    filterRole === role
                      ? role === 'All Roles' ? 'bg-slate-600 text-white' : `${ROLE_STYLES[role]} ring-1 ring-inset ring-current`
                      : 'text-on-surface-variant hover:bg-surface-container-high'
                  }`}>
                  {role}
                </button>
              ))}
            </div>
            {/* Sort By */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase">Sort by:</label>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="bg-surface-container-lowest border border-outline-variant/50 rounded-lg text-xs font-bold py-1.5 pl-2 pr-6 focus:ring-1 focus:ring-primary/40 cursor-pointer">
                <option>Date</option>
                <option>Status</option>
                <option>Type</option>
                <option>User</option>
                <option>Role</option>
              </select>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
            <input value={searchText} onChange={e => setSearchText(e.target.value)} type="text" placeholder="Search by user, type, or ID..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-outline-variant/30 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 transition-all" />
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[560px]">
                <thead>
                  <tr className="bg-surface-container-lowest border-b border-outline-variant/30">
                    <th className="px-5 py-3 text-xs font-bold text-on-surface-variant uppercase">User</th>
                    <th className="px-5 py-3 text-xs font-bold text-on-surface-variant uppercase">Role</th>
                    <th className="px-5 py-3 text-xs font-bold text-on-surface-variant uppercase">Type</th>
                    <th className="px-5 py-3 text-xs font-bold text-on-surface-variant uppercase">Date</th>
                    <th className="px-5 py-3 text-xs font-bold text-on-surface-variant uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {filtered.length === 0 ? (
                    <tr><td colSpan="5" className="py-12 text-center text-on-surface-variant text-sm">No complaints match your filter.</td></tr>
                  ) : filtered.map(c => (
                    <tr key={c.id} onClick={() => setSelectedId(c.id)}
                      className={`cursor-pointer transition-colors hover:bg-primary/5 ${selectedId === c.id ? 'bg-primary/5 border-l-4 border-primary' : ''}`}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`size-9 rounded-full ${c.color} flex items-center justify-center text-white text-xs font-black flex-shrink-0`}>{c.initials}</div>
                          <div>
                            <p className="text-sm font-bold text-on-surface">{c.name}</p>
                            <p className="text-[10px] text-on-surface-variant">#{c.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${ROLE_STYLES[c.role] || 'bg-slate-100 text-slate-600'}`}>{c.role}</span>
                      </td>
                      <td className="px-5 py-4 text-sm font-medium text-on-surface">{c.type}</td>
                      <td className="px-5 py-4 text-sm text-on-surface-variant">{c.dateLabel}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${STATUS_STYLES[c.status] || 'bg-slate-100 text-slate-600'}`}>{c.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-surface-container-lowest flex items-center justify-between border-t border-outline-variant/20">
              <p className="text-xs text-on-surface-variant">Showing {filtered.length} of {complaints.length} results</p>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-xs border border-outline-variant/40 rounded-lg hover:bg-white transition-colors">Prev</button>
                <button className="px-3 py-1 text-xs border border-outline-variant/40 rounded-lg hover:bg-white transition-colors">Next</button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Detail / Chat Panel */}
        {selected ? (
          <div className="bg-white rounded-xl border border-outline-variant/30 shadow-lg flex flex-col overflow-hidden min-h-[500px]">
            {/* Header */}
            <div className="p-5 border-b border-outline-variant/20">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`size-12 rounded-xl ${selected.color} flex items-center justify-center text-white font-black text-lg flex-shrink-0`}>{selected.initials}</div>
                  <div>
                    <h3 className="font-bold text-lg text-on-surface">{selected.name}</h3>
                    <p className="text-xs font-semibold text-primary">#{selected.id}</p>
                    <span className={`mt-1 inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${ROLE_STYLES[selected.role] || 'bg-slate-100 text-slate-600'}`}>{selected.role}</span>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${STATUS_STYLES[selected.status] || 'bg-slate-100 text-slate-600'}`}>{selected.status}</span>
              </div>
              <div className="space-y-3">
                <div className="bg-primary/5 p-3 rounded-lg">
                  <p className="text-xs font-bold text-on-surface-variant uppercase mb-1">Product</p>
                  <p className="text-sm font-medium text-on-surface">{selected.product}</p>
                </div>
                <div className="bg-surface-container-lowest p-3 rounded-lg">
                  <p className="text-xs font-bold text-on-surface-variant uppercase mb-1">Initial Complaint</p>
                  <p className="text-sm italic text-on-surface-variant">{selected.message}</p>
                </div>
              </div>
            </div>

            {/* Chat */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-surface-container-lowest/30">
              {selected.chat.map((msg, i) => (
                <div key={i} className={`flex flex-col gap-1 ${msg.from === 'admin' ? 'items-end' : 'items-start'}`}>
                  <div className={`px-4 py-2.5 rounded-2xl shadow-sm max-w-[85%] text-sm ${msg.from === 'admin' ? 'bg-primary text-white rounded-tr-none' : 'bg-white text-on-surface rounded-tl-none border border-outline-variant/30'}`}>
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-on-surface-variant">{msg.time}</span>
                </div>
              ))}
            </div>

            {/* Reply Input */}
            <div className="p-5 bg-white border-t border-outline-variant/20">
              <textarea
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleReply(); }}}
                className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-3 text-sm focus:ring-1 focus:ring-primary/30 resize-none mb-3"
                placeholder="Write your response..."
                rows="2"
              />
              <div className="flex gap-2">
                <button onClick={handleReply} className="flex-1 px-4 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:opacity-90 transition-all cursor-pointer">
                  Respond
                </button>
                <button onClick={handleResolve} disabled={selected.status === 'Resolved'} className="flex-1 px-4 py-2.5 bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-1">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  Resolve
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-outline-variant/30 shadow-sm flex items-center justify-center text-on-surface-variant text-sm min-h-[300px]">
            Select a complaint to view details
          </div>
        )}

      </div>
    </div>
  );
}
