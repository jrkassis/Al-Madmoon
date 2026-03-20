import React from 'react';
import { AffiliateStep } from './BecomeAffiliate';

interface StepperProps {
  steps: { id: AffiliateStep; label: string }[];
  currentStep: AffiliateStep;
}

export default function Stepper({ steps, currentStep }: StepperProps) {
  const currentIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <div className="affiliate-stepper">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div
            className={`stepper-step ${
              index <= currentIndex ? 'active' : ''
            } ${index < currentIndex ? 'completed' : ''}`}
          >
            <div className="stepper-circle">
              {index < currentIndex ? (
                <svg fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            <div className="stepper-label">{step.label}</div>
          </div>

          {index < steps.length - 1 && (
            <div className={`stepper-line ${index < currentIndex ? 'completed' : ''}`}></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}