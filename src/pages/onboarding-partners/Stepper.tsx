import React from "react";
import { partnerStep } from "./BecomePartner";

interface StepperProps {
  steps: { id: partnerStep; label: string }[];
  currentStep: partnerStep;
}

export default function Stepper({ steps, currentStep }: StepperProps) {
  const currentIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className="flex items-center justify-center gap-0 sm:gap-2 w-full">
      {steps.map((step, index) => {
        const completed = index < currentIndex;
        const active = index === currentIndex;
        const isLast = index === steps.length - 1;

        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center min-w-">
              <div
                className={[
                  "flex items-center justify-center rounded-full z-10 mb-2",
                  "transition-colors duration-300",
                  completed
                    ? "bg-linear-to-br from-blue-600 to-blue-700 text-white"
                    : active
                    ? "border-2 border-blue-600 text-blue-700 bg-white"
                    : "border-2 border-slate-200 text-slate-400 bg-white",
                  "w-10 h-10 font-semibold text-lg"
                ].join(" ")}
              >
                {completed ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span
                className={[
                  "hidden sm:inline text-xs text-center font-medium mt-1 transition-colors duration-300",
                  completed || active ? "text-slate-900" : "text-slate-400"
                ].join(" ")}
                style={{ minWidth: 72 }}
              >
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div
                className={[
                  "flex-1 h-1 mx-2 sm:mx-4 rounded",
                  completed
                    ? "bg-linear-to-r from-blue-600 to-blue-700"
                    : "bg-slate-200"
                ].join(" ")}
                style={{ minWidth: 32, maxWidth: 80 }}
                aria-hidden
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}