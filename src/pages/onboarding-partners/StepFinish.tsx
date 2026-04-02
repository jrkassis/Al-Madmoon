import React from "react";
import { partnerFormData } from "./BecomePartner";
import { Check } from "lucide-react";

interface StepFinishProps {
  formData: partnerFormData;
}

export default function StepFinish({ formData }: StepFinishProps) {
  return (
    <div>
      {/* Header */}
      <div className="mb-10 text-center sm:mb-8">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Review Your Application
        </h2>
        <p className="mt-2 text-slate-600">
          Please review before submitting
        </p>
      </div>

      {/* Review Sections */}
      <div className="space-y-8 mb-12">
        {/* Personal Information */}
        <div className="border-b border-slate-200 pb-8 last:border-b-0">
          <h3 className="mb-6 text-lg font-semibold text-slate-900">
            Personal Information
          </h3>
          <div className="mb-4"></div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-600">
                Full Name:
              </p>
              <p className="mt-1 text-slate-900 font-medium">
                {formData.fullName}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-slate-600">
                Email:
              </p>
              <p className="mt-1 text-slate-900 font-medium">
                {formData.email}
              </p>
            </div>
            {formData.whatsappNumber && (
              <div>
                <p className="text-xs font-semibold uppercase text-slate-600">
                  WhatsApp:
                </p>
                <p className="mt-1 text-slate-900 font-medium">
                  {formData.whatsappNumber}
                </p>
              </div>
            )}
            {formData.password && (
              <div>
                <p className="text-xs font-semibold uppercase text-slate-600">
                  Password:
                </p>
                <p className="mt-1 text-slate-900 font-medium">
                  {'•'.repeat(formData.password.length)}
                </p>
              </div>
            )}
            <div>
              <p className="text-xs font-semibold uppercase text-slate-600">
                Accepted Terms:
              </p>
              <p className="mt-1 text-slate-900 font-medium">
                {formData.acceptedTerms ? 'Yes' : 'No'}
              </p>
            </div>
          </div>
        </div>

        {/* Audience Information */}
        <div className="border-b border-slate-200 pb-8 last:border-b-0">
          <h3 className="mb-6 text-lg font-semibold text-slate-900">
            Audience Information
          </h3>
          <div className="mb-4"></div>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-600">
                Audience Size:
              </p>
              <p className="mt-1 text-slate-900 font-medium">
                {formData.audienceSize}
              </p>
            </div>
            {formData.website && (
              <div>
                <p className="text-xs font-semibold uppercase text-slate-600">
                  Website:
                </p>
                <p className="mt-1 text-slate-900 font-medium break-all">
                  {formData.website}
                </p>
              </div>
            )}
            <div>
              <p className="text-xs font-semibold uppercase text-slate-600">
                Social Profiles:
              </p>
              <p className="mt-1 text-slate-900 font-medium whitespace-pre-wrap wrap-break-word">
                {formData.socialProfiles}
              </p>
            </div>
          </div>
        </div>

        {/* Strategy & Country */}
        <div className="border-b border-slate-200 pb-8 last:border-b-0">
          <h3 className="mb-6 text-lg font-semibold text-slate-900">
            Strategy & Location
          </h3>
          <div className="mb-4"></div>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-600">
                Country:
              </p>
              <p className="mt-1 text-slate-900 font-medium">
                {formData.country}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-slate-600">
                Promotion Strategy:
              </p>
              <p className="mt-1 text-slate-900 font-medium whitespace-pre-wrap wrap-break-word">
                {formData.promotionStrategy}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-slate-600">
                Affiliate Code:
              </p>
              <div className="mb-3"></div>
              <p className="mt-1 text-blue-700 font-bold text-2xl whitespace-pre-wrap wrap-break-word">
                {formData.affiliateCode}
              </p>
            </div>
            {formData.otherPrograms && (
              <div>
                <p className="text-xs font-semibold uppercase text-slate-600">
                  Other Programs:
                </p>
                <p className="mt-1 text-slate-900 font-medium whitespace-pre-wrap wrap-break-word">
                  {formData.otherPrograms}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Success Message */}
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-green-100 to-green-50">
          <Check className="text-green-600" size={44} />
        </div>

        <h3 className="mt-4 text-xl font-semibold text-slate-900 text-center">
          Everything looks good!
        </h3>
        
        <div className="mb-4"></div>

        <p className="mx-auto mt-2 max-w-md text-sm text-slate-600 leading-relaxed text-center">
          Your link is ready to be shared. Click "Get Link" to complete the process.
        </p>
      </div>
    </div>
  );
}