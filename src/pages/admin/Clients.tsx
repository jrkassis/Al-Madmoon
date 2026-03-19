import { useState } from 'react';
import { DashboardLayout } from '../../pages/dashboards/DashboardLayout';
import { Button } from '../../components/ui/Button';

const clients = [
  { id: 1, name: 'John Smith', email: 'john@example.com', plan: 'Pro', status: 'active', joined: '2025-02-15' },
  { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', plan: 'Sharp', status: 'active', joined: '2025-03-01' },
  { id: 3, name: 'Mike Brown', email: 'mike@example.com', plan: 'Rookie', status: 'trialing', joined: '2025-03-10' },
  { id: 4, name: 'Emily Davis', email: 'emily@example.com', plan: 'Pro', status: 'inactive', joined: '2025-01-20' },
];

export default function AdminClients() {
  const [search, setSearch] = useState('');

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout role="admin">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Clients</h1>
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search clients..."
            className="w-full px-4 py-2 pl-10 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left p-4 font-semibold text-slate-600">Name</th>
                <th className="text-left p-4 font-semibold text-slate-600">Email</th>
                <th className="text-left p-4 font-semibold text-slate-600">Plan</th>
                <th className="text-left p-4 font-semibold text-slate-600">Status</th>
                <th className="text-left p-4 font-semibold text-slate-600">Joined</th>
                <th className="text-left p-4 font-semibold text-slate-600"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((client) => (
                <tr key={client.id} className="border-b border-slate-100 last:border-0">
                  <td className="p-4 font-medium text-slate-900">{client.name}</td>
                  <td className="p-4 text-slate-600">{client.email}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700">
                      {client.plan}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        client.status === 'active'
                          ? 'bg-green-50 text-green-700'
                          : client.status === 'trialing'
                          ? 'bg-yellow-50 text-yellow-700'
                          : 'bg-slate-50 text-slate-600'
                      }`}
                    >
                      {client.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600">{client.joined}</td>
                  <td className="p-4">
                    <Button variant="ghost" size="sm">...</Button>
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