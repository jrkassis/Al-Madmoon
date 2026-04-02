import React from 'react';
import { partnerFormData } from './BecomePartner';

interface StepAudienceProps {
  formData: partnerFormData;
  onInputChange: (field: keyof partnerFormData, value: string | boolean) => void;
  errors: Partial<partnerFormData>;
}

export default function StepAudience({ formData, onInputChange, errors }: StepAudienceProps) {
  return (
    <div>
      {/* Header */}
      <div className="mb-10 text-center sm:mb-12">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Your Audience
        </h2>
        <p className="mt-2 text-slate-600">
          Tell us about your followers
        </p>
      </div>

      {/* Audience Size, Website, Social Profiles */}
      <div className="mb-8 grid grid-cols-1 gap-6">
        {/* Audience Size */}
        <div className="relative">
          <label htmlFor="audienceSize" className="block text-sm font-semibold text-slate-700 mb-2">
            Audience Size
          </label>
          <div className="relative">
            <select
              id="audienceSize"
              value={formData.audienceSize}
              onChange={(e) => onInputChange('audienceSize', e.target.value)}
              className="peer w-full appearance-none border-2 bg-white px-4 py-3 pr-10 rounded-xl text-slate-900 transition focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 border-slate-200 hover:border-slate-300"
            >
              <option value="">Select audience size</option>
              <option value="0-50k">Less than 50k</option>
              <option value="50k-100k">50k – 100k</option>
              <option value="100k-200k">100k – 200k</option>
              <option value="200k-500k">200k - 500k</option>
              <option value="500k-1M">500k - 1M</option>
              <option value="1M+">1M+</option>
            </select>
            <svg
              className="pointer-events-none absolute right-3 top-3.5 h-4 w-4 text-blue-600"
              fill="currentColor"
              viewBox="0 0 12 12"
            >
              <path d="M6 9L1 4h10z" />
            </svg>
          </div>
          {errors.audienceSize && (
            <span className="mt-1 block text-sm font-medium text-red-600">
              {errors.audienceSize}
            </span>
          )}
        </div>

        {/* Website / Blog URL */}
        <div className="relative">
          <label
            htmlFor="website"
            className="block text-sm font-semibold text-slate-700 mb-2"
          >
            Website / Blog URL
          </label>
          <div className="relative">
            <input
              type="url"
              id="website"
              value={formData.website}
              onChange={(e) => onInputChange('website', e.target.value)}
              className="w-full px-4 py-3 pl-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 text-slate-900 placeholder-slate-400 transition-all duration-300 hover:border-slate-300"
              placeholder="https://example.com"
            />
          </div>
          {errors.website && (
            <span className="mt-1 block text-sm font-medium text-red-600">
              {errors.website}
            </span>
          )}
        </div>

        {/* Social Media Profiles */}
        <div className="relative">
          <label
            htmlFor="socialProfiles"
            className="block text-sm font-semibold text-slate-700 mb-2"
          >
            Social Media Profiles
          </label>
          <textarea
            id="socialProfiles"
            value={formData.socialProfiles}
            onChange={(e) => onInputChange('socialProfiles', e.target.value)}
            placeholder="Instagram, YouTube, Telegram, TikTok, etc."
            rows={4}
            className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 text-slate-900 placeholder-slate-400 transition-all duration-300 hover:border-slate-300 resize-none"
          />
          {errors.socialProfiles && (
            <span className="mt-1 block text-sm font-medium text-red-600">
              {errors.socialProfiles}
            </span>
          )}
        </div>
      </div>

      {/* Info Box */}
      <div className="mb-8 border-l-4 border-blue-600 bg-blue-50 p-6 rounded-r-lg">
        <h3 className="text-base font-semibold text-slate-900">
          Audience Focus
        </h3>
        <div className="mt-2"></div>
        <p className="text-sm text-slate-700 leading-relaxed">
          Your audience should be interested in sports betting and analysis. This helps us understand your reach and potential impact.
        </p>
      </div>
    </div>
  );
}