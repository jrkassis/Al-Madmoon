import React, { useState } from "react";
import { Layout } from "../../components/Layout";
import Stepper from "./Stepper";
import StepInfo from "./StepInfo";
import StepAudience from "./StepAudience";
import StepStrategy from "./StepStrategy";
import StepFinish from "./StepFinish";
import "./BecomeAffiliate.css";
import { Check } from "lucide-react";

export type AffiliateStep = "info" | "audience" | "strategy" | "finish";

export interface AffiliateFormData {
  fullName: string;
  email: string;
  whatsappNumber: string;
  website: string;
  socialProfiles: string;
  audienceSize: string;
  activeYears: string;
  otherPrograms: string;
  promotionStrategy: string;
  country: string;
  paypalEmail: string;
}

const steps: { id: AffiliateStep; label: string }[] = [
  { id: "info", label: "Personal Info" },
  { id: "audience", label: "Audience" },
  { id: "strategy", label: "Strategy" },
  { id: "finish", label: "Complete" },
];

const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Spain",
  "Italy",
  "Netherlands",
  "Belgium",
  "Sweden",
  "Norway",
  "Denmark",
  "Finland",
  "Ireland",
  "Austria",
  "Switzerland",
  "Poland",
  "Czech Republic",
  "Greece",
  "Portugal",
  "New Zealand",
  "Singapore",
  "Malaysia",
  "Thailand",
  "Philippines",
  "Indonesia",
  "Vietnam",
  "India",
  "UAE",
  "Saudi Arabia",
  "South Africa",
  "Mexico",
  "Brazil",
  "Argentina",
  "Chile",
  "Colombia",
  "Other",
];

export default function BecomeAffiliate() {
  const [currentStep, setCurrentStep] = useState<AffiliateStep>("info");
  const [formData, setFormData] = useState<AffiliateFormData>({
    fullName: "",
    email: "",
    whatsappNumber: "",
    website: "",
    socialProfiles: "",
    audienceSize: "",
    activeYears: "",
    otherPrograms: "",
    promotionStrategy: "",
    country: "",
    paypalEmail: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<AffiliateFormData>>({});

  const handleInputChange = (field: keyof AffiliateFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateStep = (): boolean => {
    const newErrors: Partial<AffiliateFormData> = {};

    switch (currentStep) {
      case "info":
        if (!formData.fullName.trim())
          newErrors.fullName = "Full name is required";
        if (!formData.email.trim()) {
          newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = "Invalid email format";
        }
        if (
          formData.whatsappNumber &&
          !/^\+?[0-9]{7,15}$/.test(
            formData.whatsappNumber.replace(/[\s\-()]/g, ""),
          )
        ) {
          newErrors.whatsappNumber = "Invalid phone number format";
        }
        if (formData.website && !/^https?:\/\//.test(formData.website)) {
          newErrors.website = "Invalid URL format";
        }
        break;
      case "audience":
        if (!formData.audienceSize)
          newErrors.audienceSize = "Audience size is required";
        if (!formData.socialProfiles.trim())
          newErrors.socialProfiles = "Social profiles are required";
        break;
      case "strategy":
        if (!formData.promotionStrategy.trim())
          newErrors.promotionStrategy = "Promotion strategy is required";
        if (!formData.country) newErrors.country = "Country is required";
        if (!formData.paypalEmail.trim()) {
          newErrors.paypalEmail = "PayPal email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.paypalEmail)) {
          newErrors.paypalEmail = "Invalid email format";
        }
        break;
      case "finish":
        break;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;

    const stepOrder: AffiliateStep[] = [
      "info",
      "audience",
      "strategy",
      "finish",
    ];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }
  };

  const handlePrev = () => {
    const stepOrder: AffiliateStep[] = [
      "info",
      "audience",
      "strategy",
      "finish",
    ];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    try {
      console.log("Affiliate Application Data:", formData);
      setSubmitted(true);
    } catch (error) {
      console.error("Submission error:", error);
      setErrors({
        fullName: "Failed to submit application. Please try again.",
      });
    }
  };
  console.log("becomeandaddiliate");
  return (
    <div className="affiliate-container bg-white">
      {/* Hero Section */}
      <div className="affiliate-hero">
        <div className="affiliate-hero-content">
          <h1 className="affiliate-hero-title">Become an Affiliate</h1>
          <p className="affiliate-hero-subtitle">
            Partner with Al Madmoon and earn commissions by referring bettors to
            our AI‑powered WhatsApp service.
          </p>
        </div>
      </div>

      {/* Application Section */}
      <div className="affiliate-section">
        <Stepper steps={steps} currentStep={currentStep} />

        {/* Form Steps */}
        <div className="affiliate-form-container">
          {!submitted ? (
            <div className="glass-panel affiliate-form-panel">
              {currentStep === "info" && (
                <StepInfo
                  formData={formData}
                  onInputChange={handleInputChange}
                  errors={errors}
                />
              )}

              {currentStep === "audience" && (
                <StepAudience
                  formData={formData}
                  onInputChange={handleInputChange}
                  errors={errors}
                />
              )}

              {currentStep === "strategy" && (
                <StepStrategy
                  formData={formData}
                  onInputChange={handleInputChange}
                  errors={errors}
                  countries={COUNTRIES}
                />
              )}

              {currentStep === "finish" && <StepFinish formData={formData} />}

              {/* Navigation Buttons */}
              <div className="affiliate-form-actions flex justify-between items-center w-full mt-6">
                {/* LEFT (Previous) */}
                {currentStep !== "info" ? (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="btn-secondary rounded-full"
                  >
                    ← Previous
                  </button>
                ) : (
                  <div /> // keeps spacing
                )}

                {/* RIGHT (Next / Submit) */}
                {currentStep !== "finish" ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="btn-primary rounded-full"
                  >
                    Next →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="btn-primary btn-submit rounded-full"
                  >
                    Submit Application
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className=" affiliate-success">
              <div className="success-icon">
                <Check size={44} />
              </div>
              <h2 className="success-title">Application Received!</h2>
              <p className="success-message">
                Thank you for your interest in becoming an Al Madmoon affiliate.
                We'll review your application carefully and contact you within
                48 hours.
              </p>
              <p className="success-email">
                Check your email at <strong>{formData.email}</strong> for
                updates.
              </p>
              <button
                onClick={() => (window.location.href = "/")}
                className="btn-secondary rounded-full"
              >
                Return to Home
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
