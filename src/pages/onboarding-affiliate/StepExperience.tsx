import React from 'react';
import { AffiliateFormData } from './BecomeAffiliate';

interface StepExperienceProps {
  formData: AffiliateFormData;
  onInputChange: (field: keyof AffiliateFormData, value: string) => void;
  errors: Partial<AffiliateFormData>;
}

export default function StepExperience({ formData, onInputChange, errors }: StepExperienceProps) {
  return (
    <div className="step-content">
      <div className="step-header">
        <h2 className="step-title">Your Experience</h2>
        <p className="step-description">Background in sports betting niche</p>
      </div>

      <div className="form-grid">
        <div className="form-group floating full-width">
          <select
            id="activeYears"
            className={`form-input form-select ${errors.activeYears ? 'error' : ''}`}
            value={formData.activeYears}
            onChange={(e) => onInputChange('activeYears', e.target.value)}
          >
            <option value="">Select experience level</option>
            <option value="less-6m">Less than 6 months</option>
            <option value="6m-1y">6 months – 1 year</option>
            <option value="1-3y">1 – 3 years</option>
            <option value="3+">3+ years</option>
          </select>
          <label htmlFor="activeYears">How long active in sports/betting niche? *</label>
          {errors.activeYears && <span className="error-message">{errors.activeYears}</span>}
        </div>
      </div>

      <div className="form-group floating full-width">
        <textarea
          id="otherPrograms"
          className="form-input form-textarea"
          value={formData.otherPrograms}
          onChange={(e) => onInputChange('otherPrograms', e.target.value)}
          placeholder=" "
          rows={4}
        ></textarea>
        <label htmlFor="otherPrograms">Other Affiliate Programs You Promote</label>
        <small>List any other affiliate or sponsorship programs you currently promote</small>
      </div>

      <div className="experience-info">
        <h3 className="info-title">Why We Ask</h3>
        <p className="info-text">
          Your experience helps us understand your expertise level and how well you understand the sports betting market.
        </p>
      </div>
    </div>
  );
}