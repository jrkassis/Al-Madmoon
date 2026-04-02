import React, { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { CheckCircle, ArrowRight, Mail } from "lucide-react";

interface LocationState {
  partnerName?: string;
}

export default function PartnerSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | null;
  const partnerName = state?.partnerName || "Partner";

  // Redirect to home if no submission state (e.g., direct URL access)
  useEffect(() => {
    if (!state) {
      const timer = setTimeout(() => {
        navigate("/become-a-partner");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [state, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 px-4 py-12">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-12 shadow-lg sm:p-16">
        {/* Success Icon */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex items-center justify-center rounded-full bg-linear-to-br from-green-100 to-green-50 p-4">
            <CheckCircle className="h-20 w-20 text-green-600" />
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-center text-3xl font-bold text-slate-900 sm:text-4xl">
          Application Submitted Successfully!
        </h1>

        <p className="mt-4 text-center text-lg text-slate-600">
          Thank you {partnerName}, we received your application and will review it shortly.
        </p>

        {/* Info Cards */}
        <div className="my-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-linear-to-br from-slate-50 to-slate-100 p-6 text-center transition hover:border-blue-600 hover:shadow-md">
            <div className="mb-4 flex justify-center text-3xl">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-slate-900">Check Your Email</h3>
            <p className="mt-2 text-sm text-slate-600">
              We'll send you a confirmation email with next steps and your referral link.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-linear-to-br from-slate-50 to-slate-100 p-6 text-center transition hover:border-blue-600 hover:shadow-md">
            <div className="mb-4 flex justify-center text-3xl">
              ⏱️
            </div>
            <h3 className="font-semibold text-slate-900">Review Timeline</h3>
            <p className="mt-2 text-sm text-slate-600">
              Our team will review your application within 24-48 hours.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-linear-to-br from-slate-50 to-slate-100 p-6 text-center transition hover:border-blue-600 hover:shadow-md">
            <div className="mb-4 flex justify-center text-3xl">
              📊
            </div>
            <h3 className="font-semibold text-slate-900">Track Progress</h3>
            <p className="mt-2 text-sm text-slate-600">
              Sign in to your dashboard to track your referrals and earnings.
            </p>
          </div>
        </div>

        {/* What Happens Next */}
        <div className="mb-12 rounded-xl border-l-4 border-l-blue-600 bg-blue-50 p-8">
          <h2 className="mb-6 text-xl font-bold text-slate-900">
            What Happens Next?
          </h2>

          <ol className="space-y-6">
            <li className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-r from-blue-600 to-blue-700 font-bold text-white">
                1
              </span>
              <div>
                <h4 className="font-semibold text-slate-900">
                  Application Review
                </h4>
                <p className="mt-1 text-sm text-slate-600">
                  Our team will review your information within 24-48 hours.
                </p>
              </div>
            </li>

            <li className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-r from-blue-600 to-blue-700 font-bold text-white">
                2
              </span>
              <div>
                <h4 className="font-semibold text-slate-900">
                  Approval & Setup
                </h4>
                <p className="mt-1 text-sm text-slate-600">
                  Once approved, you'll receive your unique referral link via email.
                </p>
              </div>
            </li>

            <li className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-r from-blue-600 to-blue-700 font-bold text-white">
                3
              </span>
              <div>
                <h4 className="font-semibold text-slate-900">
                  Dashboard Access
                </h4>
                <p className="mt-1 text-sm text-slate-600">
                  Log in to view creatives, track referrals, and manage your account.
                </p>
              </div>
            </li>

            <li className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-r from-blue-600 to-blue-700 font-bold text-white">
                4
              </span>
              <div>
                <h4 className="font-semibold text-slate-900">
                  Start Earning
                </h4>
                <p className="mt-1 text-sm text-slate-600">
                  Share your link with your audience and start earning commissions!
                </p>
              </div>
            </li>
          </ol>
        </div>

        {/* CTA Buttons */}
        <div className="mb-12 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/partner"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-linear-to-r from-blue-600 to-blue-700 px-8 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
          >
            Go to Dashboard <ArrowRight size={18} />
          </Link>

          <Link
            to="/become-a-partner"
            className="inline-flex items-center justify-center rounded-lg border-2 border-blue-600 px-8 py-3 font-semibold text-blue-600 transition hover:bg-blue-50 active:translate-y-0.5"
          >
            Back to Partner Page
          </Link>
        </div>

        {/* FAQ */}
        <div className="border-t border-slate-200 pt-8">
          <h3 className="mb-6 text-lg font-bold text-slate-900">
            Frequently Asked Questions
          </h3>

          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-slate-900">
                How long does the review process take?
              </h4>
              <p className="mt-2 text-sm text-slate-600">
                We typically review applications within 24-48 hours. You'll receive an email with the decision.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900">
                What if my application is rejected?
              </h4>
              <p className="mt-2 text-sm text-slate-600">
                If your application doesn't meet our criteria, we'll provide feedback and suggestions for improvement.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900">
                Can I edit my application after submission?
              </h4>
              <p className="mt-2 text-sm text-slate-600">
                Contact our support team at support@almadmoon.com and we'll help you update your information.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900">
                When do I get my referral link?
              </h4>
              <p className="mt-2 text-sm text-slate-600">
                You'll receive your unique referral link immediately after approval via email and dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}