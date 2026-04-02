import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Stepper from "./Stepper";
import StepInfo from "./StepInfo";
import StepAudience from "./StepAudience";
import StepStrategy from "./StepStrategy";
import StepFinish from "./StepFinish";
import { partnerStep, partnerFormData } from "./BecomePartner";
import { CheckCheck, CheckCheckIcon, CheckCircleIcon, CheckLine, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "../../lib/supabase";

// List of countries for the dropdown
const COUNTRIES = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia",
    "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados",
    "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina",
    "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia",
    "Cameroon", "Canada", "Cape Verde", "Central African Republic", "Chad", "Chile",
    "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus",
    "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador",
    "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini",
    "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany",
    "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
    "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq",
    "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya",
    "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho",
    "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar",
    "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania",
    "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro",
    "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands",
    "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia",
    "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea",
    "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania",
    "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia",
    "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe",
    "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore",
    "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea",
    "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland",
    "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo",
    "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
    "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States",
    "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam",
    "Yemen", "Zambia", "Zimbabwe"
];

interface Errors {
    fullName?: string;
    email?: string;
    whatsappNumber?: string;
    password?: string;
    confirmPassword?: string;
    acceptedTerms?: string;
    Code?: string;
    website?: string;
    socialProfiles?: string;
    audienceSize?: string;
    country?: string;
    promotionStrategy?: string;
    paypalEmail?: string;
    otherPrograms?: string;
}

export default function PartnerOnboarding() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState<partnerStep>("info");
    const [errors, setErrors] = useState<Errors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState<partnerFormData>({
        fullName: "",
        email: "",
        whatsappNumber: "",
        phoneCountryCode: "961",
        password: "",
        confirmPassword: "",
        acceptedTerms: false,
        affiliateCode: "",
        website: "",
        socialProfiles: "",
        audienceSize: "",
        country: "",
        promotionStrategy: "",
        paypalEmail: "",
        otherPrograms: "",
    });

    const steps: { id: partnerStep; label: string }[] = [
        { id: "info", label: "Personal Info" },
        { id: "audience", label: "Your Audience" },
        { id: "strategy", label: "Strategy" },
        { id: "finish", label: "Review" },
    ];

    // Handle input changes
    const handleInputChange = (field: keyof partnerFormData, value: string | boolean) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
        // Clear error for this field when user starts typing
        if (errors[field as keyof Errors]) {
            setErrors((prev) => ({
                ...prev,
                [field]: undefined,
            }));
        }
    };

    // Validation logic
    const validateStep = (step: partnerStep): boolean => {
        const newErrors: Errors = {};

        switch (step) {
            case "info":
                if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
                if (!formData.email.trim()) newErrors.email = "Email is required";
                else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
                    newErrors.email = "Invalid email format";
                if (!formData.whatsappNumber.trim()) {
                    newErrors.whatsappNumber = "Phone number is required";
                } else if (
                    !/^\+?[\d\s\-()]{7,}$/.test(formData.whatsappNumber.replace(/\s/g, ""))
                ) {
                    newErrors.whatsappNumber = "Invalid phone number format";
                }
                if (!formData.password.trim()) {
                    newErrors.password = "Password is required";
                } else if (formData.password.length < 6) {
                    newErrors.password = "Password must be at least 6 characters";
                }
                if (!formData.confirmPassword.trim())
                    newErrors.confirmPassword = "Confirm your password";
                if (
                    formData.password.trim() &&
                    formData.confirmPassword.trim() &&
                    formData.password !== formData.confirmPassword
                )
                    newErrors.confirmPassword = "Passwords do not match";
                if (!formData.acceptedTerms)
                    newErrors.acceptedTerms = "You must accept Terms and Privacy Policy";
                break;

            case "audience":
                if (!formData.audienceSize) newErrors.audienceSize = "Audience size is required";
                if (!formData.socialProfiles.trim())
                    newErrors.socialProfiles = "Social profiles are required";
                if (
                    formData.website &&
                    !/^https?:\/\/.+\..+/.test(formData.website)
                )
                    newErrors.website = "Invalid URL format (must start with http:// or https://)";
                break;

            case "strategy":
                if (!formData.promotionStrategy.trim())
                    newErrors.promotionStrategy = "Promotion strategy is required";
                if (!formData.country) newErrors.country = "Country is required";
                if (!formData.affiliateCode || formData.affiliateCode.length < 4) {
                    newErrors.Code = "Affiliate code is required";
                }
                break;

            case "finish":
                // No validation needed on finish step
                break;
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return false;
        }

        setErrors({});
        return true;
    };

    // Move to next step
    const normalizePhoneNumber = (selectedCountryCode: string, localPhone: string) => {
        const digitsOnlyCountryCode = (selectedCountryCode || "").replace(/\D/g, "");
        const digitsOnlyPhone = (localPhone || "").replace(/\D/g, "").replace(/^0+/, "");
        if (!digitsOnlyCountryCode || !digitsOnlyPhone) return "";
        return `${digitsOnlyCountryCode}${digitsOnlyPhone}`;
    };

    const handleNextStep = async () => {
        if (!validateStep(currentStep)) return;

        // Additional async checks for info step: email and phone uniqueness
        if (currentStep === "info") {
            const newErrors: Errors = {};
            const normalizedPhone = normalizePhoneNumber(formData.phoneCountryCode, formData.whatsappNumber);
            try {
                // Email availability
                const { count: emailCount, error: emailErr } = await supabase
                    .from("users")
                    .select("id", { count: "exact", head: true })
                    .eq("email", formData.email.trim());
                if (emailErr) throw emailErr;
                if ((emailCount ?? 0) > 0) {
                    newErrors.email = "Email is already registered";
                }
                // Phone availability
                const { count: phoneCount, error: phoneErr } = await supabase
                    .from("users")
                    .select("id", { count: "exact", head: true })
                    .eq("phone", normalizedPhone);
                if (phoneErr) throw phoneErr;
                if ((phoneCount ?? 0) > 0) {
                    newErrors.whatsappNumber = "Phone number is already in use";
                }
            } catch (e) {
                // Network/permission issues: surface generic error
            }

            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                return;
            }
        }

        const stepOrder: partnerStep[] = ["info", "audience", "strategy", "finish"];
        const currentIndex = stepOrder.indexOf(currentStep);
        if (currentIndex < stepOrder.length - 1) {
            setCurrentStep(stepOrder[currentIndex + 1]);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    // Move to previous step
    const handlePrevStep = () => {
        const stepOrder: partnerStep[] = ["info", "audience", "strategy", "finish"];
        const currentIndex = stepOrder.indexOf(currentStep);
        if (currentIndex > 0) {
            setCurrentStep(stepOrder[currentIndex - 1]);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    // Submit form
    const handleSubmit = async () => {
        if (!validateStep(currentStep)) return;

        setIsSubmitting(true);
        try {
            // Insert partner user into DB
            const normalizedPhone = normalizePhoneNumber(formData.phoneCountryCode, formData.whatsappNumber);

            // Create auth user first so it exists in auth.users
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                email: formData.email.trim(),
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.fullName.trim(),
                        role: "partner",
                    },
                },
            });
            if (signUpError) throw signUpError;

            const { error } = await supabase
                .from("users")
                .insert([
                    {
                        // Ensure public.users row maps to the auth user id for reliable lookups
                        id: signUpData.user?.id,
                        email: formData.email.trim(),
                        full_name: formData.fullName.trim(),
                        affiliate_code: formData.affiliateCode?.trim() || null,
                        phone: normalizedPhone,
                        role: "partner",
                    },
                ]);

            if (error) throw error;

            // Success! Navigate to confirmation page
            navigate("/become-a-partner/success", { state: { partnerName: formData.fullName } });
        } catch (error) {
            console.error("Submission error:", error);
            setErrors({
                ...errors,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Determine if we're on the last step
    const isLastStep = currentStep === "finish";
    const stepOrder: partnerStep[] = ["info", "audience", "strategy", "finish"];
    const isFirstStep = currentStep === "info";

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 px-4 py-10 sm:py-16">
            {/* Main content */}
            <div className="mx-auto max-w-2xl mt-12">
                {/* Stepper */}
                <div className="mb-8 rounded-lg border border-slate-200 bg-white p-8 shadow-sm sm:p-8">
                    <Stepper steps={steps} currentStep={currentStep} />
                </div>

                {/* Step content */}
                <div className="mb-8 rounded-lg border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
                    <div className="animate-fadeIn">
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

                        {currentStep === "finish" && (
                            <StepFinish formData={formData} />
                        )}
                    </div>
                </div>

                {/* Navigation buttons */}
                <div className="flex gap-3 flex-row justify-between items-center">
                    {/* Container wrapper ensures button stays left when alone */}
                    <div className="flex-1 flex justify-start">
                        {!isFirstStep && (
                            <button
                                onClick={handlePrevStep}
                                className="flex items-center justify-center gap-2 rounded-lg border-2 border-slate-300 bg-white px-6 py-3 font-semibold text-slate-900 transition-all hover:border-blue-600 hover:bg-blue-50 hover:text-blue-600 active:translate-y-0.5 sm:min-w-[140px]"
                            >
                                <ChevronLeft size={20} />
                                Previous
                            </button>
                        )}
                    </div>

                    {/* Container wrapper ensures buttons stay right */}
                    <div className="flex-1 flex justify-end">
                        {!isLastStep ? (
                            <button
                                onClick={handleNextStep}
                                className="flex items-center justify-center gap-2 rounded-lg border-2 border-slate-300 bg-white px-6 py-3 font-semibold text-slate-900 transition-all hover:border-blue-600 hover:bg-blue-50 hover:text-blue-600 active:translate-y-0.5 sm:min-w-[140px]"
                            >
                                Next
                                <ChevronRight size={20} />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="flex items-center justify-center gap-2 rounded-lg border-2 border-slate-300 bg-white px-6 py-3 font-semibold text-slate-900 transition-all hover:border-blue-600 hover:bg-blue-50 hover:text-blue-600 active:translate-y-0.5 sm:min-w-[140px]"
                            >
                                {isSubmitting ? "Creating Link..." : "Get Link"}
                                <CheckCircleIcon size={20} />
                            </button>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}