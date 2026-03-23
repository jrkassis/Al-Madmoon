import { OnboardingFormData } from './types';

type Props = {
  formData: OnboardingFormData;
  updatePayment: (key: 'cardNumber' | 'expiry' | 'cvc', value: string) => void;
};

export function StepPayment({ formData, updatePayment }: Props) {
  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Secure checkout</h2>
        <p className="text-slate-600">Start your 14-day free trial today.</p>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center py-4 border-b border-slate-100">
          <span className="font-semibold text-slate-600">Total Due Today</span>
          <span className="font-bold text-slate-900 text-2xl">$0.00</span>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Cardholder Name</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            placeholder="Jane Doe"
          />
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-slate-700 mb-1">Card Number</label>
          <input
            type="text"
            value={formData.paymentMethod.cardNumber}
            onChange={(e) => updatePayment('cardNumber', e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            placeholder="0000 0000 0000 0000"
          />
          <svg className="absolute right-4 top-9 text-slate-300 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Expiry Date</label>
            <input
              type="text"
              value={formData.paymentMethod.expiry}
              onChange={(e) => updatePayment('expiry', e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              placeholder="MM/YY"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">CVC</label>
            <input
              type="text"
              value={formData.paymentMethod.cvc}
              onChange={(e) => updatePayment('cvc', e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              placeholder="123"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 justify-center pt-2">
          <svg className="w-4 h-4 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Powered by Stripe Security
        </div>
      </div>
    </div>
  );
}