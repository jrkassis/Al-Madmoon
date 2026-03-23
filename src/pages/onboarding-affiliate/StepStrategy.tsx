import React from 'react';
import { AffiliateFormData } from './BecomeAffiliate';

interface StepStrategyProps {
  formData: AffiliateFormData;
  onInputChange: (field: keyof AffiliateFormData, value: string) => void;
  errors: Partial<AffiliateFormData>;
  countries: string[];
}

export default function StepStrategy({ formData, onInputChange, errors, countries }: StepStrategyProps) {
  return (
    <div className="step-content">
      <div className="step-header">
        <h2 className="step-title">Promotion Strategy & Details</h2>
        <p className="step-description">Tell us how you'll promote Al Madmoon</p>
      </div>

      <div className="form-grid">
        <div className="form-group floating full-width">
          <textarea
            id="promotionStrategy"
            className={`form-input form-textarea ${errors.promotionStrategy ? 'error' : ''}`}
            value={formData.promotionStrategy}
            onChange={(e) => onInputChange('promotionStrategy', e.target.value)}
            placeholder=" "
            rows={6}
          ></textarea>
          <label htmlFor="promotionStrategy">How Will You Promote Al Madmoon? *</label>
          <small>Describe your promotion methods (e.g., social posts, reviews, emails, ads, etc.)</small>
          {errors.promotionStrategy && <span className="error-message">{errors.promotionStrategy}</span>}
        </div>

        <div className="form-group floating full-width">
          <select
            id="country"
            className={`form-input form-select ${errors.country ? 'error' : ''}`}
            value={formData.country}
            onChange={(e) => onInputChange('country', e.target.value)}
          >
            <option value="">Select country</option>
            {countries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
          <label htmlFor="country">Country of Residence *</label>
          {errors.country && <span className="error-message">{errors.country}</span>}
        </div>

        <div className="form-group floating full-width">
          <input
            type="email"
            id="paypalEmail"
            className={`form-input ${errors.paypalEmail ? 'error' : ''}`}
            value={formData.paypalEmail}
            onChange={(e) => onInputChange('paypalEmail', e.target.value)}
            placeholder=" "
            required
          />
          <label htmlFor="paypalEmail">PayPal Email (for commissions) *</label>
          {errors.paypalEmail && <span className="error-message">{errors.paypalEmail}</span>}
        </div>
      </div>

      <div className="strategy-info">
        <h3 className="info-title">Payment Information</h3>
        <p className="info-text">
          We'll use your PayPal email to send affiliate commissions. Make sure it's accurate!
        </p>
      </div>
    </div>
  );
}