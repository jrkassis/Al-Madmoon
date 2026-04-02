import React, { useState } from 'react';
import { partnerFormData } from './BecomePartner';

interface StepInfoProps {
  formData: partnerFormData;
  onInputChange: (field: keyof partnerFormData, value: string | boolean) => void;
  errors: Partial<partnerFormData>;
}

export default function StepInfo({ formData, onInputChange, errors }: StepInfoProps) {
  const defaultCountryCode = "961";
  const [countryCode, setCountryCode] = useState(formData.phoneCountryCode || defaultCountryCode);

  const normalizePhoneNumber = (selectedCountryCode: string, localPhone: string) => {
    const digitsOnlyCountryCode = selectedCountryCode.replace(/\D/g, "");
    const digitsOnlyPhone = localPhone.replace(/\D/g, "").replace(/^0+/, "");
    if (!digitsOnlyCountryCode || !digitsOnlyPhone) return "";
    return `${digitsOnlyCountryCode}${digitsOnlyPhone}`;
  };

  const normalizedPhone = normalizePhoneNumber(countryCode, formData.whatsappNumber || "");

  const handlePhoneChange = (value: string) => {
    const sanitized = value.replace(/\D/g, "");
    onInputChange('whatsappNumber', sanitized);
  };

  const isPasswordMismatch =
    (formData.password?.trim() || "") !== "" &&
    (formData.confirmPassword?.trim() || "") !== "" &&
    formData.password !== formData.confirmPassword;

  return (
    <div>
      {/* Header */}
      <div className="mb-10 text-center sm:mb-12">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Personal Information
        </h2>
        <p className="mt-2 text-slate-600">
          Tell us about yourself
        </p>
      </div>

      {/* Form Fields styled similar to SignUp */}
      <div className="space-y-6 mb-2">

        {/* Full Name */}
        <div className="relative">
          <label
            htmlFor="fullName"
            className="block text-sm font-semibold text-slate-700 mb-2"
          >
            Full Name
          </label>
          <div className="relative">
            <input
              type="text"
              id="fullName"
              value={formData.fullName}
              onChange={(e) => onInputChange('fullName', e.target.value)}
              required
              className="w-full px-4 py-3 pl-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent text-slate-900 placeholder-slate-400 transition-all duration-300 hover:border-slate-300"
              placeholder="Full Name"
            />
          </div>
          {errors.fullName && (
            <span className="mt-1 block text-sm font-medium text-red-600">
              {errors.fullName}
            </span>
          )}
        </div>

        {/* Email */}
        <div className="relative">
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-slate-700 mb-2"
          >
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => onInputChange('email', e.target.value)}
              required
              className="w-full px-4 py-3 pl-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent text-slate-900 placeholder-slate-400 transition-all duration-300 hover:border-slate-300"
              placeholder="you@example.com"
            />
          </div>
          {errors.email && (
            <span className="mt-1 block text-sm font-medium text-red-600">
              {errors.email}
            </span>
          )}
        </div>

        {/* Phone Number (WhatsApp) */}
        <div className="relative">
          <label
            htmlFor="whatsappNumber"
            className="block text-sm font-semibold text-slate-700 mb-2"
          >
            WhatsApp Number
          </label>
          <div className="flex gap-2">
            <select
              id="countryCode"
              value={countryCode}
              onChange={(e) => {
                setCountryCode(e.target.value);
                onInputChange('phoneCountryCode', e.target.value);
              }}
              className="px-3 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent text-slate-900"
            >
              <option value="961">+961</option>
              <option value="966">+966</option>
              <option value="971">+971</option>
              <option value="20">+20</option>
            </select>
            <div className="relative flex-1">
              <input
                type="tel"
                id="whatsappNumber"
                value={formData.whatsappNumber}
                onChange={(e) => handlePhoneChange(e.target.value)}
                required
                className="w-full px-4 py-3 pl-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent text-slate-900 placeholder-slate-400 transition-all duration-300 hover:border-slate-300"
                placeholder="03 123 456"
              />
            </div>
          </div>
          {normalizedPhone && (
            <p className="mt-2 text-xs text-slate-500">
              Saved as: {normalizedPhone}
            </p>
          )}
          {errors.whatsappNumber && (
            <span className="mt-1 block text-sm font-medium text-red-600">
              {errors.whatsappNumber}
            </span>
          )}
        </div>

        {/* Password */}
        <div className="relative">
          <label
            htmlFor="password"
            className="block text-sm font-semibold text-slate-700 mb-2"
          >
            Password
          </label>
          <div className="relative">
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => onInputChange('password', e.target.value)}
              required
              className="w-full px-4 py-3 pl-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent text-slate-900 placeholder-slate-400 transition-all duration-300 hover:border-slate-300"
              placeholder="••••••••"
            />
          </div>
          {('password' in errors) && errors.password && (
            <span className="mt-1 block text-sm font-medium text-red-600">
              {String(errors.password)}
            </span>
          )}
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-semibold text-slate-700 mb-2"
          >
            Confirm Password
          </label>
          <div className="relative">
            <input
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) => onInputChange('confirmPassword', e.target.value)}
              required
              className="w-full px-4 py-3 pl-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent text-slate-900 placeholder-slate-400 transition-all duration-300 hover:border-slate-300"
              placeholder="••••••••"
            />
          </div>
          {('confirmPassword' in errors) && errors.confirmPassword && (
            <span className="mt-1 block text-sm font-medium text-red-600">
              {String(errors.confirmPassword)}
            </span>
          )}
          {!errors.confirmPassword && isPasswordMismatch && (
            <p className="mt-2 text-xs text-red-600">
              Password and confirm password must match.
            </p>
          )}
        </div>

        {/* Terms & Conditions */}
        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            id="acceptedTerms"
            checked={!!formData.acceptedTerms}
            onChange={(e) => onInputChange('acceptedTerms', e.target.checked)}
            className="w-4 h-4 mt-1 rounded border-slate-300 bg-white cursor-pointer accent-sky-500"
          />
          <label htmlFor="acceptedTerms" className="text-sm text-slate-600 cursor-pointer">
            I agree to the <a href="/" className="text-sky-500 font-semibold hover:text-sky-600">Terms & Conditions</a> and <a href="/" className="text-sky-500 font-semibold hover:text-sky-600">Privacy Policy</a>
          </label>
        </div>
        {('acceptedTerms' in errors) && errors.acceptedTerms && (
          <p className="text-xs text-red-600">{String(errors.acceptedTerms)}</p>
        )}

      </div>
    </div>
  );
}