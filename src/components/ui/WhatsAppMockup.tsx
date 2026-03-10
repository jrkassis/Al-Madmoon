import { motion } from 'motion/react';
import { Send, MoreVertical, Phone, Video } from 'lucide-react';
import './WhatsAppMockup.css';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    time: string;
}

const mockMessages: Message[] = [
    { id: '1', text: 'Arsenal vs Chelsea tonight', sender: 'user', time: '10:00 AM' },
    { id: '2', text: 'Prediction\nArsenal Win Probability: 61%\n\nBest Bet:\nArsenal Draw No Bet @ 1.58\n\nConfidence:\nHigh (79%)\n\nKey Insights:\n• Arsenal unbeaten in last 7 home matches\n• Chelsea missing key defenders\n• Model probability higher than bookmaker implied odds', sender: 'bot', time: '10:02 AM' }
];

export function WhatsAppMockup() {
    return (
        <div className="wa-phone-container">
            <div className="wa-phone-hardware">
                {/* Notch */}
                <div className="wa-phone-notch">
                    <div className="wa-phone-camera"></div>
                </div>

                <div className="wa-screen">
                    {/* WhatsApp Header */}
                    <div className="wa-header">
                        <div className="wa-header-left">
                            <div className="wa-avatar">
                                <div className="wa-avatar-inner"><img src="/Main.png" alt="Logo" width='32' height='32'/></div>
                            </div>
                            <div className="wa-contact-info">
                                <div className="wa-contact-name">Al Madmoon</div>
                                <div className="wa-contact-status">online</div>
                            </div>
                        </div>
                        <div className="wa-header-right">
                            <Video size={18} />
                            <Phone size={18} />
                            <MoreVertical size={18} />
                        </div>
                    </div>

                    {/* Chat Background */}
                    <div className="wa-chat-area">
                        <div className="wa-date-pill">Today</div>

                        <div className="wa-messages">
                            {mockMessages.map((msg, index) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ delay: index * 1.5 + 0.5, duration: 0.4, type: 'spring' }}
                                    className={`wa-message-wrapper ${msg.sender === 'user' ? 'wa-message-right' : 'wa-message-left'}`}
                                >
                                    <div className={`wa-message-bubble ${msg.sender === 'user' ? 'wa-message-user' : 'wa-message-bot'}`}>
                                        <div className="wa-message-text">{msg.text}</div>
                                        <div className="wa-message-time">{msg.time}</div>
                                    </div>
                                </motion.div>
                            ))}

                            {/* Typing indicator */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{ delay: mockMessages.length * 1.5 + 0.5, duration: 2, repeat: Infinity }}
                                className="wa-message-wrapper wa-message-left"
                            >
                                <div className="wa-message-bubble wa-message-bot wa-typing">
                                    <span className="dot"></span>
                                    <span className="dot"></span>
                                    <span className="dot"></span>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Input Area */}
                    <div className="wa-input-area">
                        <div className="wa-input-box">
                            <span className="wa-input-placeholder">Message</span>
                        </div>
                        <div className="wa-send-btn">
                            <Send size={16} color="white" style={{ marginLeft: '-2px' }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative Orbs behind phone */}
            <div className="wa-glow-orb orb-1"></div>
            <div className="wa-glow-orb orb-2"></div>
        </div>
    );
}
