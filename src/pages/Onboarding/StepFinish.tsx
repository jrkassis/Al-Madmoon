import { Button } from '../../components/ui/Button';
import { OnboardingFormData } from './types';

type Props = {
  formData: OnboardingFormData;
  onComplete: () => void;
};

export function StepFinish({ formData, onComplete }: Props) {
  return (
    <div className="text-center py-8 space-y-8">
      <div className="w-24 h-24 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-brand-200">
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <div>
        <h2 className="text-4xl font-bold text-slate-900 mb-4">You're all set!</h2>
        <p className="text-slate-600 text-lg max-w-sm mx-auto">
          Your account is ready. We've sent a confirmation to <strong>{formData.email}</strong>.
        </p>
      </div>

      <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 text-left max-w-md mx-auto">
        <h4 className="font-bold text-slate-900 uppercase tracking-widest text-[10px] mb-4">Next Steps</h4>

        <div className="space-y-4">
          {[
            'Check your email to verify your account.',
            'Open WhatsApp and start asking questions.',
            'Join our Telegram group for tips.',
          ].map((step, i) => (
            <div key={step} className="flex gap-4">
              <div className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                {i + 1}
              </div>
              <p className="text-sm font-semibold text-slate-600">{step}</p>
            </div>
          ))}
        </div>
      </div>

      <Button variant="primary" size="lg" onClick={onComplete}>
        Go to Dashboard
      </Button>
    </div>
  );
}