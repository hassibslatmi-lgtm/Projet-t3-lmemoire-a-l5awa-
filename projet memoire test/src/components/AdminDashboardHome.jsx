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
    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-surface-container-lowest">

      {/* Hero greeting */}
      <div className="mb-8">
        <h2 className="text-3xl font-black text-on-surface tracking-tight">{greeting}, Admin 👋</h2>
        <p className="text-on-surface-variant font-medium mt-1">Here's an overview of your platform's current activity.</p>
      </div>

      {/* ── 3 Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        {/* Total Users */}
        <div className="bg-white rounded-2xl border border-outline-variant/30 shadow-sm p-6 flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="bg-emerald-100 p-3.5 rounded-xl flex-shrink-0">
            <span className="material-symbols-outlined text-emerald-700 text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>group</span>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Total Users</p>
            <p className="text-3xl font-black text-on-surface mt-0.5">1,847</p>
            <span className="text-green-600 text-xs font-bold flex items-center gap-0.5 mt-1">
              <span className="material-symbols-outlined text-xs">trending_up</span> +18 this week
            </span>
          </div>
        </div>

        {/* Total Volume */}
        <div className="bg-white rounded-2xl border border-outline-variant/30 shadow-sm p-6 flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="bg-blue-100 p-3.5 rounded-xl flex-shrink-0">
            <span className="material-symbols-outlined text-blue-700 text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Total Volume</p>
            <p className="text-3xl font-black text-on-surface mt-0.5">$1,240,500</p>
            <span className="text-green-600 text-xs font-bold flex items-center gap-0.5 mt-1">
              <span className="material-symbols-outlined text-xs">trending_up</span> +12.5% this month
            </span>
          </div>
        </div>

        {/* Total Complaints */}
        <div className="bg-white rounded-2xl border border-outline-variant/30 shadow-sm p-6 flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="bg-amber-100 p-3.5 rounded-xl flex-shrink-0">
            <span className="material-symbols-outlined text-amber-600 text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>report_problem</span>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Total Complaints</p>
            <p className="text-3xl font-black text-on-surface mt-0.5">1,284</p>
            <span className="text-amber-600 text-xs font-bold flex items-center gap-0.5 mt-1">
              <span className="material-symbols-outlined text-xs">schedule</span> 5 pending review
            </span>
          </div>
        </div>
      </div>

      {/* ── Section Shortcuts ── */}
      <div className="mb-5">
        <h3 className="text-lg font-black text-on-surface tracking-tight">Quick Access</h3>
        <p className="text-sm text-on-surface-variant mt-0.5">Navigate directly to any management section.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {SECTION_SHORTCUTS.map(s => (
          <button
            key={s.key}
            onClick={() => onNavigate(s.key)}
            className="group bg-white rounded-2xl border border-outline-variant/30 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 text-left cursor-pointer overflow-hidden"
          >
            {/* Top gradient strip */}
            <div className={`h-2 w-full bg-gradient-to-r ${s.accent}`} />
            <div className="p-6">
              <div className={`${s.lightBg} ${s.lightText} p-3 rounded-xl w-fit mb-4`}>
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
              </div>
              <h4 className="font-black text-on-surface text-base mb-1 group-hover:text-primary transition-colors">{s.label}</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">{s.description}</p>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                Go to {s.label} <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
