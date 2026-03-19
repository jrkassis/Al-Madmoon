import { OnboardingFormData } from './types';

type Props = {
  formData: OnboardingFormData;
  updateForm: <K extends keyof OnboardingFormData>(key: K, value: OnboardingFormData[K]) => void;
};

export function StepDetails({ formData, updateForm }: Props) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Your details</h2>
        <p className="text-slate-600">Tell us about yourself.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
        <input
          type="text"
          value={formData.fullName}
          onChange={(e) => updateForm('fullName', e.target.value)}
          className="w-full px-4 py-2 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-500/50"
          placeholder="Jane Doe"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => updateForm('email', e.target.value)}
          className="w-full px-4 py-2 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-500/50"
          placeholder="jane@example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Phone (optional)</label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => updateForm('phone', e.target.value)}
          className="w-full px-4 py-2 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-500/50"
          placeholder="+1 (555) 000-0000"
        />
      </div>
    </div>
  );
}