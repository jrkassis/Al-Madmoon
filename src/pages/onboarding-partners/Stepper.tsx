import React from "react";
import { partnerStep } from "./BecomePartner";

interface StepperProps {
  steps: { id: partnerStep; label: string }[];
  currentStep: partnerStep;
}

export default function Stepper({ steps, currentStep }: StepperProps) {
  const currentIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className="partner-stepper">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div
            className={`stepper-step ${
              index <= currentIndex ? "text-brand-600" : "text-white"
            }`}
          >
            <div
              className={`stepper-circle flex items-center justify-center ${
                index < currentIndex
                  ? "bg-brand-600 text-white"
                  : index === currentIndex
                    ? "border-2 border-brand-600 text-brand-600"
                    : "border border-white"
              }`}
            >
              {index < currentIndex ? (
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              ) : (
                <span>{index + 1}</span>
              )}
            </div>

            <div className="stepper-label">{step.label}</div>
          </div>

          {index < steps.length - 1 && (
            <div className="m-4"
            ></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
