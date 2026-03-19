import { useState } from 'react';
import { DashboardLayout } from '../../pages/dashboards/DashboardLayout';

const affiliates = [
  { id: 1, name: 'BetKing', referrals: 45, conversion: '12%', earned: '$134.50', status: 'active' },
  { id: 2, name: 'SportsGuru', referrals: 32, conversion: '18%', earned: '$98.20', status: 'active' },
  { id: 3, name: 'TipsterPro', referrals: 18, conversion: '9%', earned: '$45.75', status: 'pending' },
  { id: 4, name: 'WinningEdge', referrals: 27, conversion: '15%', earned: '$112.30', status: 'active' },
];

export default function AdminAffiliates() {
  const [search, setSearch] = useState('');

  const filtered = affiliates.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout role="admin">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Affiliates</h1>
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search affiliates..."
            className="w-full px-4 py-2 pl-10 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
        </div>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left p-4 font-semibold text-slate-600">Name</th>
                <th className="text-left p-4 font-semibold text-slate-600">Referrals</th>
                <th className="text-left p-4 font-semibold text-slate-600">Conv. rate</th>
                <th className="text-left p-4 font-semibold text-slate-600">Earned</th>
                <th className="text-left p-4 font-semibold text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id} className="border-b border-slate-100 last:border-0">
                  <td className="p-4 font-medium text-slate-900">{a.name}</td>
                  <td className="p-4 text-slate-600">{a.referrals}</td>
                  <td className="p-4 text-slate-600">{a.conversion}</td>
                  <td className="p-4 font-semibold text-brand-600">{a.earned}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        a.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}