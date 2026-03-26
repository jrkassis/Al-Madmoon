import { useState } from "react";
import { Link } from "react-router-dom";
import {
  MessageCircle,
  Mail,
  Phone,
  ChevronDown,
  Send,
  CheckCircle,
  HelpCircle,
} from "lucide-react";

export function SupportPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "How accurate are the predictions?",
      answer:
        "Our AI models analyze historical data, team performance, player stats, and real‑time factors to provide insights. While we strive for high accuracy, sports outcomes are inherently unpredictable. Use our recommendations as one of many tools in your decision‑making process.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Yes. We use industry‑standard encryption and security practices to protect your information. For more details, please see our <Link to='/privacy' className='text-sky-600 hover:underline'>Privacy Policy</Link>.",
    },
    {
      question: "Can I cancel my subscription?",
      answer:
        "Absolutely. You can cancel your subscription at any time from your account dashboard. If you need assistance, contact our support team.",
    },
    {
      question: "How do I reset my password?",
      answer:
        "Click 'Forgot Password' on the login page and follow the instructions sent to your email. If you don't receive an email, check your spam folder or contact support.",
    },
    {
      question: "Do you offer a free trial?",
      answer:
        "Yes, new users can try our service free for 7 days. No credit card required. Sign up on our <Link to='/onboarding' className='text-sky-600 hover:underline'>Get Started</Link> page.",
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="bg-gradient-to-b from-slate-50 to-white min-h-screen">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-sky-100 rounded-full mb-4">
            <HelpCircle className="w-8 h-8 text-sky-600" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Support Center</h1>
          <p className="text-muted-foreground text-lg">
            We're here to help. Choose the best way to reach us.
          </p>
        </div>

        {/* Contact Methods Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* WhatsApp */}
          <div className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">WhatsApp</h3>
            <p className="text-sm text-slate-600 mb-3">
              Quick replies within minutes
            </p>
            <a
              href="https://wa.me/79027611"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-600 text-sm font-medium hover:underline"
            >
              Start chat →
            </a>
          </div>

          {/* Email */}
          <div className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-sky-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Email Support</h3>
            <p className="text-sm text-slate-600 mb-3">
              Responses within 24 hours
            </p>
            <a
              href="mailto:support@almadmoon.com"
              className="text-sky-600 text-sm font-medium hover:underline"
            >
              support@almadmoon.com
            </a>
          </div>

          {/* Phone */}
          <div className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-6 h-6 text-sky-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Phone Support</h3>
            <p className="text-sm text-slate-600 mb-3">
              Mon–Fri, 9am–5pm GMT
            </p>
            <a
              href="tel:+1234567890"
              className="text-sky-600 text-sm font-medium hover:underline"
            >
              +1 (234) 567-890
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-12">
          <h2 className="text-2xl font-semibold mb-4">Send a Message</h2>
          {formSubmitted ? (
            <div className="flex items-center gap-3 text-green-600 bg-green-50 p-4 rounded-lg">
              <CheckCircle className="w-5 h-5" />
              <span>Thanks for reaching out! We'll get back to you soon.</span>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // Handle form submission (e.g., send to backend)
                setFormSubmitted(true);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Subject</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea
                  rows={4}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                ></textarea>
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-sky-600 text-white px-6 py-2 rounded-lg hover:bg-sky-700 transition-colors"
              >
                <Send className="w-4 h-4" />
                Send Message
              </button>
            </form>
          )}
        </div>

        {/* FAQ Accordion */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex justify-between items-center p-4 text-left font-medium hover:bg-slate-50 transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-500 transition-transform ${
                      openFaq === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="p-4 border-t bg-slate-50 text-slate-700">
                    <p dangerouslySetInnerHTML={{ __html: faq.answer }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            Can't find what you're looking for?{" "}
            <Link to="/contact" className="text-sky-600 hover:underline">
              Contact us
            </Link>{" "}
            and we'll be happy to help.
          </p>
        </div>
      </div>
    </div>
  );
}