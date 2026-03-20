import React from 'react';
import { AffiliateFormData } from './BecomeAffiliate';

interface StepAudienceProps {
  formData: AffiliateFormData;
  onInputChange: (field: keyof AffiliateFormData, value: string) => void;
  errors: Partial<AffiliateFormData>;
}

export default function StepAudience({ formData, onInputChange, errors }: StepAudienceProps) {
  return (
    <div className="step-content">
      <div className="step-header">
        <h2 className="step-title">Your Audience</h2>
        <p className="step-description">Tell us about your followers</p>
      </div>

      <div className="form-grid">
        <div className="form-group floating full-width">
          <select
            id="audienceSize"
            className={`form-input form-select ${errors.audienceSize ? 'error' : ''}`}
            value={formData.audienceSize}
            onChange={(e) => onInputChange('audienceSize', e.target.value)}
          >
            <option value="">Select audience size</option>
            <option value="less-1k">Less than 1,000</option>
            <option value="1k-10k">1,000 – 10,000</option>
            <option value="10k-50k">10,000 – 50,000</option>
            <option value="50k-100k">50,000 – 100,000</option>
            <option value="100k+">100,000+</option>
          </select>
          <label htmlFor="audienceSize">Audience Size *</label>
          {errors.audienceSize && <span className="error-message">{errors.audienceSize}</span>}
        </div>
      </div>

      <div className="audience-info">
        <h3 className="info-title">Audience Focus</h3>
        <p className="info-text">
          Your audience should be interested in sports betting and analysis. This helps us understand your reach and potential impact.
        </p>
      </div>

      <div className="form-group floating full-width">
        <textarea
          id="socialProfilesDetail"
          className={`form-input form-textarea ${errors.socialProfiles ? 'error' : ''}`}
          value={formData.socialProfiles}
          onChange={(e) => onInputChange('socialProfiles', e.target.value)}
          placeholder=" "
          rows={5}
        ></textarea>
        <label htmlFor="socialProfilesDetail">Your Main Platforms & Links *</label>
        <small>Provide links and brief description of your main audience channels</small>
        {errors.socialProfiles && <span className="error-message">{errors.socialProfiles}</span>}
      </div>
    </div>
  );
}