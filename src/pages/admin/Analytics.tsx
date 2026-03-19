import { DashboardLayout } from '../../pages/dashboards/DashboardLayout';

// If you don't have a Card component, just use a div with glass-panel class
export default function AdminAnalytics() {
  const metrics = [
    { label: 'MRR', value: '$12,450', change: '+12%', icon: '💰' },
    { label: 'Active Users', value: '1,234', change: '+8%', icon: '👥' },
    { label: 'API Cost', value: '$342', change: '+5%', icon: '⚙️' },
    { label: 'Queries (24h)', value: '45.2K', change: '+23%', icon: '📊' },
  ];

  return (
    <DashboardLayout role="admin">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Analytics</h1>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {metrics.map((metric) => (
          <div key={metric.label} className="glass-panel p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl">{metric.icon}</span>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                {metric.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{metric.value}</p>
            <p className="text-sm text-slate-500">{metric.label}</p>
          </div>
        ))}
      </div>

      {/* Charts placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="glass-panel p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Revenue trend</h3>
          <div className="h-64 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
            Chart placeholder (Revenue)
          </div>
        </div>
        <div className="glass-panel p-6">
          <h3 className="font-semibold text-slate-900 mb-4">User growth</h3>
          <div className="h-64 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
            Chart placeholder (Users)
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="glass-panel p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Recent activity</h3>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-4 py-2 border-b border-slate-100 last:border-0">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">New user signed up</p>
                <p className="text-xs text-slate-400">2 minutes ago</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}