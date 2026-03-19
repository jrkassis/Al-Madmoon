import { DashboardLayout } from '../../pages/dashboards/DashboardLayout';

const referrals = [
  { id: 1, name: 'Alex Johnson', date: '2025-03-15', status: 'converted', commission: '$8.99' },
  { id: 2, name: 'Emily Davis', date: '2025-03-14', status: 'pending', commission: '$0.00' },
  { id: 3, name: 'Chris Lee', date: '2025-03-12', status: 'converted', commission: '$29.99' },
  { id: 4, name: 'Taylor Swift', date: '2025-03-10', status: 'converted', commission: '$15.50' },
];

export default function AffiliateReferrals() {
  const stats = {
    clicks: 1243,
    signups: 87,
    conversions: 23,
    totalCommission: 347.5,
  };

  return (
    <DashboardLayout role="affiliate">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Referral Analytics</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="glass-panel p-4">
          <p className="text-sm text-slate-500">Clicks</p>
          <p className="text-2xl font-bold text-slate-900">{stats.clicks}</p>
        </div>
        <div className="glass-panel p-4">
          <p className="text-sm text-slate-500">Sign-ups</p>
          <p className="text-2xl font-bold text-slate-900">{stats.signups}</p>
        </div>
        <div className="glass-panel p-4">
          <p className="text-sm text-slate-500">Conversions</p>
          <p className="text-2xl font-bold text-slate-900">{stats.conversions}</p>
        </div>
        <div className="glass-panel p-4">
          <p className="text-sm text-slate-500">Commission</p>
          <p className="text-2xl font-bold text-brand-600">${stats.totalCommission}</p>
        </div>
      </div>

      {/* Referrals table */}
      <div className="glass-panel overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900">Recent referrals</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left p-4 font-semibold text-slate-600">Name</th>
                <th className="text-left p-4 font-semibold text-slate-600">Date</th>
                <th className="text-left p-4 font-semibold text-slate-600">Status</th>
                <th className="text-left p-4 font-semibold text-slate-600">Commission</th>
              </tr>
            </thead>
            <tbody>
              {referrals.map((r) => (
                <tr key={r.id} className="border-b border-slate-100 last:border-0">
                  <td className="p-4 font-medium text-slate-900">{r.name}</td>
                  <td className="p-4 text-slate-600">{r.date}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        r.status === 'converted' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="p-4 font-semibold text-brand-600">{r.commission}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}