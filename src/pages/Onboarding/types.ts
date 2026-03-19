export type PlanId = 'rookie' | 'pro' | 'sharp';

export type OnboardingFormData = {
  fullName: string;
  email: string;
  phone: string;
  selectedPlan: PlanId;
  paymentMethod: {
    cardNumber: string;
    expiry: string;
    cvc: string;
  };
};

export type OnboardingStep = 1 | 2 | 3 | 4;