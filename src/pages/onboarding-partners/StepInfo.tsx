import React from 'react';
import { partnerFormData } from './BecomePartner';

interface StepInfoProps {
  formData: partnerFormData;
  onInputChange: (field: keyof partnerFormData, value: string) => void;
  errors: Partial<partnerFormData>;
}

export default function StepInfo({ formData, onInputChange, errors }: StepInfoProps) {
  return (
    <div className="step-content">
      <div className="step-header">
        <h2 className="step-title">Personal Information</h2>
        <p className="step-description">Tell us about yourself</p>
      </div>

      <div className="form-grid">
        <div className="form-group floating">
          <input
            type="text"
            id="fullName"
            className={`form-input ${errors.fullName ? 'error' : ''}`}
            value={formData.fullName}
            onChange={(e) => onInputChange('fullName', e.target.value)}
            placeholder=" "
            required
          />
          <label htmlFor="fullName">Full Name *</label>
          {errors.fullName && <span className="error-message">{errors.fullName}</span>}
        </div>

        <div className="form-group floating">
          <input
            type="email"
            id="email"
            className={`form-input ${errors.email ? 'error' : ''}`}
            value={formData.email}
            onChange={(e) => onInputChange('email', e.target.value)}
            placeholder=" "
            required
          />
          <label htmlFor="email">Email Address *</label>
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group floating">
          <input
            type="tel"
            id="whatsappNumber"
            className={`form-input ${errors.whatsappNumber ? 'error' : ''}`}
            value={formData.whatsappNumber}
            onChange={(e) => onInputChange('whatsappNumber', e.target.value)}
            placeholder=" "
          />
          <label htmlFor="whatsappNumber">WhatsApp Number</label>
          {errors.whatsappNumber && <span className="error-message">{errors.whatsappNumber}</span>}
        </div>

        <div className="form-group floating">
          <input
            type="url"
            id="website"
            className={`form-input ${errors.website ? 'error' : ''}`}
            value={formData.website}
            onChange={(e) => onInputChange('website', e.target.value)}
            placeholder=" "
          />
          <label htmlFor="website">Website / Blog URL</label>
          {errors.website && <span className="error-message">{errors.website}</span>}
        </div>
      </div>

      <div className="form-group floating full-width">
        <textarea
          id="socialProfiles"
          className={`form-input form-textarea ${errors.socialProfiles ? 'error' : ''}`}
          value={formData.socialProfiles}
          onChange={(e) => onInputChange('socialProfiles', e.target.value)}
          placeholder=" "
          rows={4}
        ></textarea>
        <label htmlFor="socialProfiles">Social Media Profiles *</label>
        <small>Instagram, YouTube, Telegram, TikTok, etc.</small>
        {errors.socialProfiles && <span className="error-message">{errors.socialProfiles}</span>}
      </div>
    </div>
  );
}