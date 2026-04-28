const SECTION_SHORTCUTS = [
  {
    key: 'accounts',
    label: 'Accounts',
    description: 'Validate, block, and manage platform user accounts.',
    icon: 'group',
    accent: 'from-emerald-500 to-green-700',
    lightBg: 'bg-emerald-50',
    lightText: 'text-emerald-700',
  },
  {
    key: 'categories',
    label: 'Categories',
    description: 'Add, edit, or remove agricultural product categories.',
    icon: 'category',
    accent: 'from-teal-500 to-cyan-700',
    lightBg: 'bg-teal-50',
    lightText: 'text-teal-700',
  },
  {
    key: 'prices',
    label: 'Transactions & Prices',
    description: 'Monitor financial activity and set official product prices.',
    icon: 'payments',
    accent: 'from-blue-500 to-indigo-700',
    lightBg: 'bg-blue-50',
    lightText: 'text-blue-700',
  },
  {
    key: 'complaints',
    label: 'Complaints',
    description: 'Review and resolve farmer and buyer concerns.',
    icon: 'report_problem',
    accent: 'from-amber-500 to-orange-600',
    lightBg: 'bg-amber-50',
    lightText: 'text-amber-700',
  },
];

export default function AdminDashboardHome({ onNavigate }) {
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good Morning' : currentHour < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="flex-1 overflow-y-auto animate-in fade-in duration-700">

      {/* Hero Greeting & Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-primary/10 p-8 md:p-12 mb-10 border border-primary/20">
         <div className="relative z-10">
            <h2 className="text-4xl font-black text-on-surface tracking-tight mb-2">{greeting}, Ministry Admin 👋</h2>
            <p className="text-on-surface-variant font-bold text-lg max-w-xl leading-relaxed">
              Your comprehensive command center for national agricultural data, user moderation, and livestock oversight.
            </p>
         </div>
         {/* Decorative element */}
         <div className="absolute right-[-20px] top-[-20px] opacity-10">
            <span className="material-symbols-outlined text-[200px]" style={{ fontVariationSettings: "'FILL' 1" }}>agriculture</span>
         </div>
      </div>

      {/* ── 3 Rich Stat Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Total Users */}
        <div className="bg-white rounded-[2rem] border border-outline-variant/30 shadow-sm p-8 flex items-center gap-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="bg-emerald-100 p-4 rounded-2xl flex-shrink-0">
            <span className="material-symbols-outlined text-emerald-700 text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>group</span>
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.1em] text-on-surface-variant mb-1">Total Users</p>
            <p className="text-4xl font-black text-on-surface tabular-nums">1,847</p>
            <div className="mt-2 flex items-center gap-1.5 px-2 py-0.5 bg-green-50 text-green-700 rounded-full w-fit">
               <span className="material-symbols-outlined text-[14px] font-bold">trending_up</span>
               <span className="text-[11px] font-black">+18 this week</span>
            </div>
          </div>
        </div>

        {/* Total Volume */}
        <div className="bg-white rounded-[2rem] border border-outline-variant/30 shadow-sm p-8 flex items-center gap-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="bg-blue-100 p-4 rounded-2xl flex-shrink-0">
            <span className="material-symbols-outlined text-blue-700 text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.1em] text-on-surface-variant mb-1">Total Volume</p>
            <p className="text-4xl font-black text-on-surface tabular-nums">1.24M <small className="text-lg font-bold">DZD</small></p>
            <div className="mt-2 flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full w-fit">
               <span className="material-symbols-outlined text-[14px] font-bold">trending_up</span>
               <span className="text-[11px] font-black">+12.5% Growth</span>
            </div>
          </div>
        </div>

        {/* Total Complaints */}
        <div className="bg-white rounded-[2rem] border border-outline-variant/30 shadow-sm p-8 flex items-center gap-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-l-4 border-amber-500">
          <div className="bg-amber-100 p-4 rounded-2xl flex-shrink-0">
            <span className="material-symbols-outlined text-amber-600 text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>report_problem</span>
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.1em] text-on-surface-variant mb-1">Active Reports</p>
            <p className="text-4xl font-black text-on-surface tabular-nums">1,284</p>
            <div className="mt-2 flex items-center gap-1.5 px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full w-fit">
               <span className="material-symbols-outlined text-[14px] font-bold">schedule</span>
               <span className="text-[11px] font-black">5 pending review</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Visual Activity Graph (Mock) ── */}
      <div className="bg-white rounded-[2.5rem] border border-outline-variant/30 shadow-sm p-8 mb-12">
         <div className="flex justify-between items-center mb-8">
            <div>
               <h3 className="text-xl font-black text-on-surface">Platform Growth Activity</h3>
               <p className="text-sm text-on-surface-variant font-medium">Monthly engagement and registration metrics.</p>
            </div>
            <div className="flex gap-2">
               <span className="px-4 py-1.5 bg-surface-container-low border border-outline-variant/50 rounded-full text-xs font-bold text-on-surface-variant">Last 30 Days</span>
            </div>
         </div>
         {/* Mock Graph Visualization */}
         <div className="h-48 w-full flex items-end justify-between px-4 gap-2">
            {[30, 45, 60, 40, 85, 70, 95, 110, 80, 120, 140, 160].map((h, i) => (
               <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="w-full bg-primary/10 rounded-t-lg group-hover:bg-primary transition-all duration-500 relative" style={{ height: `${h}px` }}>
                     <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-on-surface text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        {h * 10}
                     </div>
                  </div>
                  <span className="text-[10px] font-black text-on-surface-variant opacity-50 uppercase">{['J','F','M','A','M','J','J','A','S','O','N','D'][i]}</span>
               </div>
            ))}
         </div>
      </div>

      {/* ── Section Shortcuts ── */}
      <div className="mb-6 flex justify-between items-center">
         <div>
            <h3 className="text-2xl font-black text-on-surface tracking-tight">Management Shortcuts</h3>
            <p className="text-sm text-on-surface-variant font-medium">Quickly jump to specific control modules.</p>
         </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {SECTION_SHORTCUTS.map(s => (
          <button
            key={s.key}
            onClick={() => onNavigate(s.key)}
            className="group bg-white rounded-[2rem] border border-outline-variant/30 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-left cursor-pointer overflow-hidden flex flex-col"
          >
            <div className={`h-2.5 w-full bg-gradient-to-r ${s.accent}`} />
            <div className="p-8 flex-1 flex flex-col">
              <div className={`${s.lightBg} ${s.lightText} p-4 rounded-2xl w-fit mb-6 shadow-sm`}>
                <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
              </div>
              <h4 className="font-black text-on-surface text-xl mb-2 group-hover:text-primary transition-colors">{s.label}</h4>
              <p className="text-sm text-on-surface-variant font-medium leading-relaxed mb-6 flex-1">{s.description}</p>
              <div className="mt-auto flex items-center gap-2 text-sm font-black text-primary group-hover:translate-x-2 transition-transform">
                Enter Module <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
