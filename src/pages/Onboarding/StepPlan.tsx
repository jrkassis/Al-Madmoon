import { OnboardingFormData, PlanId } from './types';
import { PLANS } from './data';

type Props = {
  formData: OnboardingFormData;
  updateForm: (key: 'selectedPlan', value: PlanId) => void;
};

export function StepPlan({ formData, updateForm }: Props) {
  const selectedPlan = PLANS.find(p => p.id === formData.selectedPlan)!;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Choose your plan</h2>
        <p className="text-slate-600">Pick the tier that fits your betting style.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            onClick={() => updateForm('selectedPlan', plan.id)}
            className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
              formData.selectedPlan === plan.id
                ? 'border-brand-500 bg-brand-50/50 shadow-lg shadow-brand-100'
                : 'border-slate-100 hover:border-slate-200'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-bold text-slate-900">{plan.name}</h4>
              {formData.selectedPlan === plan.id && (
                <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>

            <div className="text-2xl font-bold text-slate-900 mb-1">
              {typeof plan.price === 'number' ? `$${plan.price}` : plan.price}
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">/ month</p>
          </div>
        ))}
      </div>

      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
        <h5 className="font-bold text-sm text-slate-700 mb-3">Included in {selectedPlan.name}:</h5>
        <ul className="grid md:grid-cols-2 gap-3">
          {selectedPlan.features.map((f) => (
            <li key={f} className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <svg className="w-3 h-3 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {f}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}