import { Link } from "react-router-dom";
import { FileText, Scale, AlertTriangle, Gavel, RefreshCw, Mail } from "lucide-react";

export function TermsPage() {
  const effectiveDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="bg-gradient-to-b from-slate-50 to-white min-h-screen">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-sky-100 rounded-full mb-4">
            <FileText className="w-8 h-8 text-sky-600" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-muted-foreground">Effective: {effectiveDate}</p>
        </div>

        {/* Intro */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <p className="text-lg">
            Welcome to <strong>Al Madmoon</strong>. By accessing or using our
            AI‑powered betting assistant, you agree to be bound by these Terms.
            If you do not agree, please do not use the service.
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Section 1 */}
          <section className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <Scale className="w-6 h-6 text-sky-600" />
              <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
            </div>
            <div className="prose prose-slate max-w-none">
              <p>
                These Terms of Service ("Terms") constitute a legally binding
                agreement between you and Al Madmoon. By registering for an account
                or using the service, you acknowledge that you have read, understood,
                and agree to be bound by these Terms.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-sky-600" />
              <h2 className="text-2xl font-semibold">2. Service Description</h2>
            </div>
            <div className="prose prose-slate max-w-none">
              <p>
                Al Madmoon provides AI‑generated betting insights, predictions,
                and analysis. The information is for informational and entertainment
                purposes only. It does not constitute financial, legal, or professional
                advice. You are solely responsible for your betting decisions.
              </p>
              <p className="mt-2">
                <strong>Important:</strong> Gambling involves risk. Only bet what
                you can afford to lose. If you have a gambling problem, seek help
                from a professional organization.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <Gavel className="w-6 h-6 text-sky-600" />
              <h2 className="text-2xl font-semibold">3. User Responsibilities</h2>
            </div>
            <div className="prose prose-slate max-w-none">
              <p>You agree to:</p>
              <ul>
                <li>Provide accurate and complete information when creating an account.</li>
                <li>Maintain the security of your account credentials.</li>
                <li>Not use the service for any illegal or unauthorized purpose.</li>
                <li>Not interfere with or disrupt the service or servers.</li>
                <li>Comply with all applicable laws and regulations.</li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <RefreshCw className="w-6 h-6 text-sky-600" />
              <h2 className="text-2xl font-semibold">4. Account Termination</h2>
            </div>
            <div className="prose prose-slate max-w-none">
              <p>
                We reserve the right to suspend or terminate your account at any
                time, without notice, for conduct that we believe violates these
                Terms or is harmful to other users, us, or third parties. Upon
                termination, your right to use the service will cease immediately.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-sky-600" />
              <h2 className="text-2xl font-semibold">5. Limitation of Liability</h2>
            </div>
            <div className="prose prose-slate max-w-none">
              <p>
                To the maximum extent permitted by law, Al Madmoon shall not be
                liable for any indirect, incidental, special, consequential, or
                punitive damages, or any loss of profits or revenues, whether
                incurred directly or indirectly, or any loss of data, use, goodwill,
                or other intangible losses, resulting from:
              </p>
              <ul>
                <li>Your use or inability to use the service.</li>
                <li>Any unauthorized access to or use of our servers and/or any personal information stored therein.</li>
                <li>Any errors or omissions in any content.</li>
              </ul>
            </div>
          </section>

          {/* Section 6 */}
          <section className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-6 h-6 text-sky-600" />
              <h2 className="text-2xl font-semibold">6. Contact Information</h2>
            </div>
            <div className="prose prose-slate max-w-none">
              <p>
                If you have any questions about these Terms, please contact us:
              </p>
              <ul>
                <li>By email: legal@almadmoon.com</li>
                <li>By visiting this page: <Link to="/contact" className="text-sky-600 hover:underline">Contact Us</Link></li>
              </ul>
            </div>
          </section>
        </div>

        <div className="mt-8 text-sm text-center text-muted-foreground border-t pt-6">
          <p>We may modify these Terms at any time. Your continued use of the service after changes constitutes acceptance.</p>
        </div>
      </div>
    </div>
  );
}