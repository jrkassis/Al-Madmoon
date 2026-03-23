import React from "react";
import { AffiliateFormData } from "./BecomeAffiliate";
import { Check } from "lucide-react";

interface StepFinishProps {
  formData: AffiliateFormData;
}

export default function StepFinish({ formData }: StepFinishProps) {
  return (
    <div className="step-content">
      <div className="step-header">
        <h2 className="step-title">Review Your Application</h2>
        <p className="step-description">Please review before submitting</p>
      </div>

      <div className="review-sections">
        <div className="review-section">
          <h3 className="review-title">Personal Information</h3>
          <div className="review-grid">
            <div className="review-item">
              <span className="review-label">Full Name:</span>
              <span className="review-value">{formData.fullName}</span>
            </div>
            <div className="review-item">
              <span className="review-label">Email:</span>
              <span className="review-value">{formData.email}</span>
            </div>
            {formData.whatsappNumber && (
              <div className="review-item">
                <span className="review-label">WhatsApp:</span>
                <span className="review-value">{formData.whatsappNumber}</span>
              </div>
            )}
            {formData.website && (
              <div className="review-item">
                <span className="review-label">Website:</span>
                <span className="review-value">{formData.website}</span>
              </div>
            )}
          </div>
        </div>

        <div className="review-section">
          <h3 className="review-title">Audience Information</h3>
          <div className="review-grid">
            <div className="review-item">
              <span className="review-label">Audience Size:</span>
              <span className="review-value">{formData.audienceSize}</span>
            </div>
            <div className="review-item full-width">
              <span className="review-label">Social Profiles:</span>
              <span className="review-value">{formData.socialProfiles}</span>
            </div>
          </div>
        </div>

        <div className="review-section">
          <div className="review-grid">
            <div className="review-item">
              <span className="review-label">Country:</span>
              <span className="review-value">{formData.country}</span>
            </div>
            <div className="review-item full-width">
              <span className="review-label">Promotion Strategy:</span>
              <span className="review-value">{formData.promotionStrategy}</span>
            </div>
            {formData.otherPrograms && (
              <div className="review-item full-width">
                <span className="review-label">Other Programs:</span>
                <span className="review-value">{formData.otherPrograms}</span>
              </div>
            )}
          </div>
        </div>

        <div className="review-section">
          <h3 className="review-title">Payment Details</h3>
          <div className="review-grid">
            <div className="review-item">
              <span className="review-label">PayPal Email:</span>
              <span className="review-value">{formData.paypalEmail}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="finish-info">
        <div className="success-icon">
          <Check size={44} />
        </div>
        <h3 className="finish-title">Everything looks good!</h3>
        <p className="finish-message">
          Your application is ready to be submitted. Click "Submit Application"
          to complete the process. We'll review it and get back to you within 48
          hours.
        </p>
      </div>
    </div>
  );
}
