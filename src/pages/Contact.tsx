import { motion } from "motion/react";
import { Button } from "../components/ui/Button";
import { MessageCircle, Mail, MapPin, HelpCircle } from "lucide-react";
import { useState } from "react";
import { supabase } from "../lib/supabase";
import "./Contact.css";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function Contact() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<"success" | "error" | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);
    setStatusType(null);

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      setStatusType("error");
      setStatusMsg("Please fill in all fields.");
      return;
    }

    try {
      setSubmitting(true);
      const { error } = await supabase.from("contact_messages").insert({
        full_name: trimmedName,
        email: trimmedEmail,
        message: trimmedMessage,
        status: "unread",
      });
      if (error) throw error;
      setStatusType("success");
      setStatusMsg("Message sent successfully. We'll get back to you soon.");
      setFullName("");
      setEmail("");
      setMessage("");
    } catch (err: any) {
      setStatusType("error");
      setStatusMsg(err?.message ?? "Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      className="contact-container"
    >
      <div className="contact-header">
        <motion.h1 variants={fadeIn} className="contact-title">
          Get in touch.
        </motion.h1>
        <motion.p variants={fadeIn} className="contact-subtitle">
          Need help with your subscription or have questions about Al Madmoon?
          We're here to assist you.
        </motion.p>
      </div>

      <motion.div variants={stagger} className="contact-grid">
        <motion.div variants={fadeIn} className="contact-info-wrapper">
          <div>
            <h2 className="contact-info-header-title">Contact Information</h2>
            <p className="contact-info-header-desc">
              The fastest way to reach us is via WhatsApp. For business
              inquiries or partnership opportunities, please send us an email.
            </p>
          </div>

          <div className="contact-methods">
            {/* HOW IT WORKS */}
            <div className="contact-method-item">
              <div className="contact-icon-wrapper slate">
                <MessageCircle size={24} />
              </div>
              <div className="contact-method-content">
                <h3 className="contact-method-title">Instant Support</h3>
                <p className="contact-method-desc">
                  Send us a message using the form and our team will review it
                  instantly from our dashboard.
                </p>
              </div>
            </div>

            {/* RESPONSE TIME */}
            <div className="contact-method-item">
              <div className="contact-icon-wrapper slate">
                <Mail size={24} />
              </div>
              <div className="contact-method-content">
                <h3 className="contact-method-title">Fast Response</h3>
                <p className="contact-method-desc">
                  We usually reply within a few hours depending on request
                  volume.
                </p>
              </div>
            </div>

            {/* LOCATION (optional keep) */}
            <div className="contact-method-item">
              <div className="contact-icon-wrapper slate">
                <MapPin size={24} />
              </div>
              <div className="contact-method-content">
                <h3 className="contact-method-title">Based in</h3>
                <p className="contact-method-text">Beirut, Lebanon</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={fadeIn} className="contact-form-container">
          <div className="contact-form-wrapper">
            <h2 className="contact-form-title">Send us a message</h2>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group floating">
                <input
                  type="text"
                  id="name"
                  className="form-input"
                  placeholder=" "
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
                <label htmlFor="name" className="form-label">
                  Full Name
                </label>
              </div>
              <div className="form-group floating">
                <input
                  type="email"
                  id="email"
                  className="form-input"
                  placeholder=" "
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
              </div>
              <div className="form-group floating">
                <textarea
                  id="message"
                  className="form-input form-textarea"
                  placeholder=" "
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
                <label htmlFor="message" className="form-label">
                  Message
                </label>
              </div>
              {statusMsg && (
                <p
                  className={`text-sm ${statusType === "success" ? "text-emerald-600" : "text-red-600"}`}
                >
                  {statusMsg}
                </p>
              )}
              <Button
                variant="outline"
                size="lg"
                style={{ width: "100%", marginTop: "8px" }}
                disabled={submitting}
              >
                {submitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
