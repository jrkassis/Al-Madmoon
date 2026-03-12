import React from 'react';
import { motion } from 'motion/react';
import { ExternalLink, MessageCircle, Globe, ArrowRight, DollarSign } from 'lucide-react';
import './Links.css';

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

interface LinkItem {
  id: string;
  title: string;
  url: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  description?: string;
}

const whatsappLink: LinkItem = {
  id: 'whatsapp',
  title: 'Get Started on WhatsApp',
  url: 'https://wa.me/79027611?text=How%20can%20I%20get%20started%20with%20Al%20Madmoon%3F',
  icon: MessageCircle,
  description: ''
};

const links: LinkItem[] = [
  {
    id: '2',
    title: 'View Pricing',
    url: '/pricing',
    icon: DollarSign,
    description: 'See our subscription plans'
  },
  {
    id: '3',
    title: 'Learn How It Works',
    url: '/how-it-works',
    icon: ArrowRight,
    description: 'Understand our process'
  },
  {
    id: '4',
    title: 'Explore Features',
    url: '/features',
    icon: Globe,
    description: 'Discover what we offer'
  },
  {
    id: '5',
    title: 'Contact Us',
    url: '/contact',
    icon: MessageCircle,
    description: 'Get in touch with our team'
  }
];

export default function Links() {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      className="links-container"
    >
      <motion.div variants={stagger} className="links-content">
        {/* Profile Section */}
        <motion.div variants={fadeIn} className="links-profile">
          <div className="links-avatar">
            <img src="/Main.png" alt="Al Madmoon Logo" className="links-avatar-img" />
          </div>
          <h1 className="links-name">Al Madmoon</h1>
          <p className="links-bio">
            Your AI-powered sports betting assistant. Get instant insights, predictions, and recommendations directly through WhatsApp.
          </p>
        </motion.div>

        {/* Main CTA - WhatsApp */}
        <motion.div variants={fadeIn} className="links-cta-wrapper">
          <motion.a
            href={whatsappLink.url}
            className="links-cta-card"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="links-cta-content">
              <div className="links-cta-icon">
                <MessageCircle size={28} />
              </div>
              <div className="links-cta-text">
                <h3 className="links-cta-title">{whatsappLink.title}</h3>
                <p className="links-cta-description">{whatsappLink.description}</p>
              </div>
              <div className="links-cta-arrow">
                <ExternalLink size={24} />
              </div>
            </div>
          </motion.a>
        </motion.div>

        {/* Links List */}
        <motion.div variants={stagger} className="links-list">
          {links.map((link) => {
            const IconComponent = link.icon || ExternalLink;
            return (
              <motion.a
                key={link.id}
                href={link.url}
                variants={fadeIn}
                className="links-card"
                target={link.url.startsWith('http') ? '_blank' : undefined}
                rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="links-card-content">
                  <div className="links-card-icon">
                    <IconComponent size={28} />
                  </div>
                  <h3 className="links-card-title">{link.title}</h3>
                </div>
              </motion.a>
            );
          })}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
