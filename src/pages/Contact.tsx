import { motion } from 'motion/react';
import { Button } from '../components/ui/Button';
import { MessageCircle, Mail, MapPin, HelpCircle } from 'lucide-react';
import './Contact.css';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Contact() {
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
          Need help with your subscription or have questions about Al Madmoon? We're here to assist you.
        </motion.p>
      </div>

      <motion.div variants={stagger} className="contact-grid">
        <motion.div variants={fadeIn} className="contact-info-wrapper">
          <div>
            <h2 className="contact-info-header-title">Contact Information</h2>
            <p className="contact-info-header-desc">
              The fastest way to reach us is via WhatsApp. For business inquiries or partnership opportunities, please send us an email.
            </p>
          </div>

          <div className="contact-methods">
            <div className="contact-method-item">
              <div className="contact-icon-wrapper brand">
                <MessageCircle size={24} />
              </div>
              <div className="contact-method-content">
                <h3 className="contact-method-title">WhatsApp Support</h3>
                <p className="contact-method-desc">Available 24/7 for AI betting insights and subscription help.</p>
                <a href="https://wa.me/79027611?text=How%20can%20I%20get%20started%20with%20Al%20Madmoon%3F" target="_blank" rel="noopener noreferrer" className="contact-link">
                  +961 79 027 611
                </a>
              </div>
            </div>

            <div className="contact-method-item">
              <div className="contact-icon-wrapper slate">
                <Mail size={24} />
              </div>
              <div className="contact-method-content">
                <h3 className="contact-method-title">Email Us</h3>
                <p className="contact-method-desc">For general inquiries and business partnerships.</p>
                <a href="mailto:support@almadmoon.ai" className="contact-link">
                  support@almadmoon.ai
                </a>
              </div>
            </div>

            <div className="contact-method-item">
              <div className="contact-icon-wrapper slate">
                <MapPin size={24} />
              </div>
              <div className="contact-method-content">
                <h3 className="contact-method-title">Headquarters</h3>
                <p className="contact-method-text">Beirut, Lebanon</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={fadeIn} className="contact-form-container">
          <div className="contact-glow-bg" />
          <div className="contact-form-wrapper">
            <h2 className="contact-form-title">Send us a message</h2>
            <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group floating">
                <input
                  type="text"
                  id="name"
                  className="form-input"
                  placeholder=" "
                />
                <label htmlFor="name" className="form-label">Full Name</label>
              </div>
              <div className="form-group floating">
                <input
                  type="email"
                  id="email"
                  className="form-input"
                  placeholder=" "
                />
                <label htmlFor="email" className="form-label">Email Address</label>
              </div>
              <div className="form-group floating">
                <textarea
                  id="message"
                  className="form-input form-textarea"
                  placeholder=" "
                ></textarea>
                <label htmlFor="message" className="form-label">Message</label>
              </div>
              <Button variant="primary" size="lg" style={{ width: '100%', marginTop: '8px' }}>
                Send Message
              </Button>
            </form>
          </div>
        </motion.div>
      </motion.div>

      {/* FAQ Section */}
      <motion.div variants={fadeIn} className="contact-faq">
        <div className="contact-faq-icon">
          <HelpCircle size={32} />
        </div>
        <h2 className="contact-faq-title">Still have questions?</h2>
        <p className="contact-faq-desc">
          If you couldn't find the answer you were looking for in our Pricing FAQ, feel free to reach out to us directly on WhatsApp.
        </p>
        <a href="https://wa.me/79027611?text=How%20can%20I%20get%20started%20with%20Al%20Madmoon%3F" target="_blank" rel="noopener noreferrer">
          <Button variant="secondary" size="lg" className="btn-icon btn-shadow" style={{ display: 'inline-flex' }}>
            <MessageCircle size={20} />
            Chat with Support
          </Button>
        </a>
      </motion.div>
    </motion.div>
  );
}
