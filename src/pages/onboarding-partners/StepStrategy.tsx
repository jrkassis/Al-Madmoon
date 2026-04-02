import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { partnerFormData } from './BecomePartner';

interface StepStrategyProps {
  formData: partnerFormData;
  onInputChange: (field: keyof partnerFormData, value: string) => void;
  errors: Partial<partnerFormData>;
  countries: string[];
}

export default function StepStrategy({ formData, onInputChange, errors, countries }: StepStrategyProps) {
  const [affiliateCode, setAffiliateCode] = useState<string>(formData.affiliateCode || "");
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  // Sanitize and enforce 4-6 uppercase letters (A-Z)
  const handleAffiliateInput = (raw: string) => {
    const sanitized = raw.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 6);
    setAffiliateCode(sanitized);
    onInputChange('affiliateCode', sanitized);
  };

  // Debounced availability check
  useEffect(() => {
    if (affiliateCode.length < 4 || affiliateCode.length > 6) {
      setIsAvailable(null);
      return;
    }

    let isCancelled = false;
    const id = setTimeout(async () => {
      setIsChecking(true);
      try {
        // Check availability in DB (Supabase)
        // Table: public.users, Column: affiliate_code
        // Efficient count-only query:
        const { count, error } = await supabase
          .from('users')
          .select('id', { count: 'exact', head: true })
          .eq('affiliate_code', affiliateCode);

        if (error) throw error;

        if (!isCancelled) setIsAvailable((count ?? 0) === 0);
      } catch (e) {
        if (!isCancelled) setIsAvailable(false);
      } finally {
        if (!isCancelled) setIsChecking(false);
      }
    }, 400); // debounce

    return () => {
      isCancelled = true;
      clearTimeout(id);
    };
  }, [affiliateCode]);

  const codeBorderClass =
    affiliateCode.length >= 4 && affiliateCode.length <= 6
      ? isAvailable === true
        ? 'border-emerald-500 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100'
        : isAvailable === false
          ? 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-100'
          : 'border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
      : 'border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100';

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Promotion Strategy & Details
        </h2>
        <div className="mb-2"></div>
        <p className="mt-2 text-slate-600">
          Tell us how you'll promote Al Madmoon
        </p>
      </div>

      {/* Country and PayPal Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-8">
        {/* Country Dropdown */}
        <div className="relative pt-2">
          <select
            id="country"
            value={formData.country}
            onChange={(e) => onInputChange('country', e.target.value)}
            className={`peer w-full appearance-none border-2 bg-white px-4 py-3 pr-10 rounded-lg text-slate-900 transition focus:outline-none pt-5 ${errors.country
              ? 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-100'
              : 'border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 hover:border-slate-300'
              }`}
          >
            <option value="">Select country</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
          <svg
            className="pointer-events-none absolute right-3 top-3.5 h-4 w-4 text-blue-600"
            fill="currentColor"
            viewBox="0 0 12 12"
          >
            <path d="M6 9L1 4h10z" />
          </svg>
          <label
            htmlFor="country"
            className={`absolute left-4 top-1 text-xs font-medium px-1 mx-[-4px] bg-white transition-all ${errors.country
              ? 'text-red-600'
              : 'text-slate-600'
              }`}
          >
            Country of Residence *
          </label>
          {errors.country && (
            <span className="mt-1 block text-sm font-medium text-red-600">
              {errors.country}
            </span>
          )}
        </div>

        {/* CODE GENERATOR */}
        <div className="relative pt-2">
          <input
            id="affiliateCode"
            type="text"
            value={affiliateCode}
            onChange={(e) => handleAffiliateInput(e.target.value)}
            placeholder="ABCD"
            maxLength={6}
            required
            className={`peer w-full appearance-none border-2 bg-white px-4 py-3 pr-10 rounded-lg text-slate-900 transition focus:outline-none pt-5 ${codeBorderClass}`}
          />
          {/* Right-side status icon / spinner */}
          {isChecking ? (
            <svg
              className="pointer-events-none absolute right-3 top-3.5 h-4 w-4 animate-spin text-slate-400"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 3a9 9 0 109 9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          ) : isAvailable === true ? (
            <svg
              className="pointer-events-none absolute right-3 top-3.5 h-4 w-4 text-emerald-600"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19l12-12-1.41-1.41z" />
            </svg>
          ) : isAvailable === false ? (
            <svg
              className="pointer-events-none absolute right-3 top-3.5 h-4 w-4 text-red-600"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2a10 10 0 1010 10A10.011 10.011 0 0012 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12z" />
            </svg>
          ) : null}
          <label
            htmlFor="affiliateCode"
            className={`absolute left-4 top-1 text-xs font-medium px-1 mx-[-4px] bg-white transition-all ${isAvailable === false ? 'text-red-600' : 'text-slate-600'}`}
          >
            Affiliate Code
          </label>
          {errors.affiliateCode && (
            <span className="block text-xs font-medium text-red-600">
              {errors.affiliateCode}
            </span>
          )}
          {affiliateCode.length === 0 && (
            <p className="mt-2 text-xs text-slate-500">
              This is the code you will share with your audience.
            </p>
          )}
          {affiliateCode.length > 0 && affiliateCode.length < 4 && (
            <span className="block text-xs font-medium text-red-600">
              Code must be at least 4 characters.
            </span>
          )}
          {affiliateCode.length > 6 && (
            <span className="block text-xs font-medium text-red-600">
              Code cannot exceed 6 characters.
            </span>
          )}
          {isAvailable === true && affiliateCode.length >= 4 && affiliateCode.length <= 6 && (
            <span className="block text-xs font-medium text-emerald-600">
              This code is available.
            </span>
          )}
          {isAvailable === false && affiliateCode.length >= 4 && affiliateCode.length <= 6 && (
            <span className="block text-xs font-medium text-red-600">
              This code is already taken. Try another.
            </span>
          )}
        </div>
      </div>

      {/* Promotion Strategy Textarea */}
      <div className="mb-8 relative pt-2">
        <textarea
          id="promotionStrategy"
          value={formData.promotionStrategy}
          onChange={(e) => onInputChange('promotionStrategy', e.target.value)}
          placeholder=" "
          rows={6}
          className={`peer w-full border-2 bg-white px-4 py-3 rounded-lg text-slate-900 placeholder-transparent font-sans transition focus:outline-none resize-none pt-5 ${errors.promotionStrategy
            ? 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-100'
            : 'border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 hover:border-slate-300'
            }`}
        />
        <label
          htmlFor="promotionStrategy"
          className={`absolute left-4 top-1 text-xs font-medium px-1 mx-[-4px] bg-white transition-all ${errors.promotionStrategy
            ? 'text-red-600'
            : 'text-slate-600'
            }`}
        >
          How Will You Promote Al Madmoon? *
        </label>
        <p className="mt-2 text-xs text-slate-500">
          Describe your promotion methods (e.g., social posts, reviews, emails, ads, etc.)
        </p>
        {errors.promotionStrategy && (
          <span className="mt-1 block text-sm font-medium text-red-600">
            {errors.promotionStrategy}
          </span>
        )}
      </div>

    </div>
  );
}