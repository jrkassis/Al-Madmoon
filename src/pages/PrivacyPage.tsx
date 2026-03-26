import { Link } from "react-router-dom";
import { Shield, Lock, Eye, Cookie, UserCheck, Mail } from "lucide-react";

export function PrivacyPage() {
  const lastUpdated = new Date().toLocaleDateString("en-US", {
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
            <Shield className="w-8 h-8 text-sky-600" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground">
            Last updated: {lastUpdated}
          </p>
        </div>

        {/* Intro */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <p className="text-lg">
            At <strong>Al Madmoon</strong>, we take your privacy seriously.
            This policy describes how we collect, use, and protect your personal
            information when you use our AI‑powered betting assistant.
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Section 1 */}
          <section className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-6 h-6 text-sky-600" />
              <h2 className="text-2xl font-semibold">1. Information We Collect</h2>
            </div>
            <div className="prose prose-slate max-w-none">
              <p>We collect information that you voluntarily provide to us:</p>
              <ul>
                <li>
                  <strong>Account Information:</strong> When you create an account,
                  we collect your name, email address, and password.
                </li>
                <li>
                  <strong>Usage Data:</strong> We automatically collect information
                  about how you interact with our service, such as pages visited,
                  time spent, and features used.
                </li>
                <li>
                  <strong>Device Information:</strong> IP address, browser type,
                  operating system, and device identifiers.
                </li>
                <li>
                  <strong>Betting Preferences:</strong> With your consent, we may
                  collect sports and betting preferences to personalize recommendations.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-6 h-6 text-sky-600" />
              <h2 className="text-2xl font-semibold">2. How We Use Your Information</h2>
            </div>
            <div className="prose prose-slate max-w-none">
              <p>We use the information we collect to:</p>
              <ul>
                <li>Provide, maintain, and improve our services.</li>
                <li>Personalize your experience and deliver tailored insights.</li>
                <li>Communicate with you about updates, security alerts, and support.</li>
                <li>Analyze usage trends to enhance performance and user experience.</li>
                <li>Comply with legal obligations and enforce our terms.</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <Cookie className="w-6 h-6 text-sky-600" />
              <h2 className="text-2xl font-semibold">3. Cookies & Tracking Technologies</h2>
            </div>
            <div className="prose prose-slate max-w-none">
              <p>
                We use cookies and similar tracking technologies to track activity
                on our service and hold certain information. You can instruct your
                browser to refuse all cookies or to indicate when a cookie is being
                sent. However, if you do not accept cookies, you may not be able
                to use some portions of our service.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <UserCheck className="w-6 h-6 text-sky-600" />
              <h2 className="text-2xl font-semibold">4. Your Data Rights</h2>
            </div>
            <div className="prose prose-slate max-w-none">
              <p>Depending on your location, you may have the following rights:</p>
              <ul>
                <li>
                  <strong>Access:</strong> Request a copy of your personal data.
                </li>
                <li>
                  <strong>Correction:</strong> Update inaccurate or incomplete information.
                </li>
                <li>
                  <strong>Deletion:</strong> Request deletion of your personal data.
                </li>
                <li>
                  <strong>Opt‑out:</strong> Unsubscribe from marketing communications.
                </li>
              </ul>
              <p>
                To exercise these rights, contact us at{" "}
                <a href="mailto:privacy@almadmoon.com" className="text-sky-600 hover:underline">
                  privacy@almadmoon.com
                </a>
                .
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-6 h-6 text-sky-600" />
              <h2 className="text-2xl font-semibold">5. Contact Us</h2>
            </div>
            <div className="prose prose-slate max-w-none">
              <p>
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <ul>
                <li>By email: privacy@almadmoon.com</li>
                <li>By visiting this page on our website: <Link to="/contact" className="text-sky-600 hover:underline">Contact Us</Link></li>
                <li>By WhatsApp: <a href="https://wa.me/79027611" className="text-sky-600 hover:underline">+1 234 567 890</a></li>
              </ul>
            </div>
          </section>
        </div>

        {/* Footer note */}
        <div className="mt-8 text-sm text-center text-muted-foreground border-t pt-6">
          <p>We may update this policy from time to time. Continued use of the service constitutes acceptance of the updated policy.</p>
        </div>
      </div>
    </div>
  );
}