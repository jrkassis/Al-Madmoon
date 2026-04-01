import { DashboardLayout } from '../dashboards/DashboardLayout';
import { Button } from '../../components/ui/Button';

export default function AffiliateWithdraw() {
  const balance = 124.5;
  const withdrawals = [
    { amount: 50, date: 'Mar 10, 2025', status: 'completed' },
    { amount: 30, date: 'Feb 25, 2025', status: 'completed' },
  ];

  return (
    <DashboardLayout role="affiliate">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Withdraw Funds</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Withdrawal form */}
        <div className="lg:col-span-2 glass-panel p-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <span className="font-medium text-slate-600">Available balance</span>
              <span className="text-2xl font-bold text-brand-600">${balance.toFixed(2)}</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Amount to withdraw
              </label>
              <input
                type="number"
                placeholder="0.00"
                className="w-full px-4 py-2 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Payment method
              </label>
              <select className="w-full px-4 py-2 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-500/50">
                <option value="paypal">PayPal</option>
                <option value="bank">Bank transfer</option>
                <option value="wise">Wise</option>
              </select>
            </div>

            <Button variant="primary" size="md" className="w-full">
              Request Withdrawal
            </Button>
          </div>
        </div>

        {/* Withdrawal history */}
        <div className="glass-panel p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Recent withdrawals</h3>
          <div className="space-y-4">
            {withdrawals.map((w, i) => (
              <div key={i} className="flex justify-between items-center text-sm">
                <div>
                  <p className="font-medium text-slate-900">${w.amount}</p>
                  <p className="text-xs text-slate-400">{w.date}</p>
                </div>
                <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">
                  {w.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}