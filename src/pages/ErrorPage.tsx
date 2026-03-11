import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';

import './ErrorPage.css';

export default function ErrorPage() {
  return (
    <div className="error-page">

      <motion.div
        className="error-card"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Animated 404 number */}
        <motion.div
          className="error-number"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          4<span className="error-number-accent">0</span>4
        </motion.div>

        <motion.div
          className="error-badge"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <span className="error-pulse-dot" />
          Page Not Found
        </motion.div>

        <motion.h1
          className="error-title"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
        >
          Looks like this page doesn't exist
        </motion.h1>

        <motion.p
          className="error-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
        >
          The page you're looking for may have been moved, deleted, or never existed.
          Let's get you back to the action.
        </motion.p>

        <motion.div
          className="error-actions"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5 }}
        >
          <Link to="/" className="error-btn-primary">
            <Home size={18} />
            Back to Home
          </Link>
          <a
            href="https://wa.me/79027611?text=How%20can%20I%20get%20started%20with%20Al%20Madmoon%3F"
            target="_blank"
            rel="noopener noreferrer"
            className="error-btn-whatsapp"
          >
            <MessageCircle size={18} />
            Start on WhatsApp
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}