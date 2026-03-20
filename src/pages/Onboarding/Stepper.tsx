import { STEPS } from './data';

type Props = {
  currentStep: number;
};

export function Stepper({ currentStep }: Props) {
  return (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        {STEPS.map((step, idx) => {
          const stepNumber = idx + 1;
          const isActive = stepNumber <= currentStep;
          const isDone = stepNumber < currentStep;

          return (
            <div key={step} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  isActive
                    ? 'bg-brand-600 text-black shadow-lg shadow-brand-200'
                    : 'bg-slate-200 text-slate-400'
                }`}
              >
                {isDone ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  stepNumber
                )}
              </div>
              <span
                className={`text-[10px] uppercase font-bold tracking-widest mt-1 ${
                  isActive ? 'text-brand-700' : 'text-slate-400'
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>

      <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-brand-600 transition-all duration-700 ease-out"
          style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
        />
      </div>
    </div>
  );
}