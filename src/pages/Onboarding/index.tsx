import { useState, useMemo } from 'react';
import { Button } from '../../components/ui/Button';
import { Stepper } from './Stepper';
import { StepDetails } from './StepDetails';
import { StepPlan } from './StepPlan';
import { StepPayment } from './StepPayment';
import { StepFinish } from './StepFinish';
import { OnboardingFormData, OnboardingStep } from './types';

const initialForm: OnboardingFormData = {
  fullName: '',
  email: '',
  phone: '',
  selectedPlan: 'pro',
  paymentMethod: {
    cardNumber: '',
    expiry: '',
    cvc: '',
  },
};

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(1);
  const [formData, setFormData] = useState<OnboardingFormData>(initialForm);

  const canContinue = useMemo(() => {
    if (currentStep === 1) {
      return !!formData.fullName && !!formData.email;
    }
    return true;
  }, [currentStep, formData]);

  const updateForm = <K extends keyof OnboardingFormData>(
    key: K,
    value: OnboardingFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const updatePayment = (key: 'cardNumber' | 'expiry' | 'cvc', value: string) => {
    setFormData((prev) => ({
      ...prev,
      paymentMethod: { ...prev.paymentMethod, [key]: value },
    }));
  };

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep((s) => (s + 1) as OnboardingStep);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((s) => (s - 1) as OnboardingStep);
    else {
      // Navigate back to home or pricing
      window.history.back();
    }
  };

  const handleComplete = () => {
    // Redirect to dashboard
    window.location.href = '/dashboard';
  };

  return (
    <div className="animated-mesh-bg min-h-screen flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-3xl p-8 md:p-12">
        <Stepper currentStep={currentStep} />

        {currentStep === 1 && (
          <StepDetails formData={formData} updateForm={updateForm} />
        )}
        {currentStep === 2 && (
          <StepPlan formData={formData} updateForm={updateForm} />
        )}
        {currentStep === 3 && (
          <StepPayment formData={formData} updatePayment={updatePayment} />
        )}
        {currentStep === 4 && (
          <StepFinish formData={formData} onComplete={handleComplete} />
        )}

        {currentStep < 4 && (
          <div className="flex justify-between items-center mt-12 pt-4 border-t border-slate-100">
            <Button variant="outline" size="md" onClick={handleBack}>
              ← Back
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleNext}
              disabled={!canContinue}
            >
              {currentStep === 3 ? 'Complete Setup' : 'Continue'} →
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}