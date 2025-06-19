import React, { useState, useRef, useEffect } from 'react';
import './ChatbotWidget.css';

const BOT_LABEL = "Want to better understand how your brain works? Ask me!";

const RobotSVG = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="16" fill="#6366f1" />
    <rect x="8" y="12" width="16" height="10" rx="5" fill="#fff" />
    <circle cx="12" cy="17" r="2" fill="#6366f1" />
    <circle cx="20" cy="17" r="2" fill="#6366f1" />
    <rect x="14" y="21" width="4" height="2" rx="1" fill="#6366f1" />
    <rect x="15" y="7" width="2" height="6" rx="1" fill="#6366f1" />
  </svg>
);

const CloseSVG = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="10" fill="#6366f1" />
    <path d="M6 6l8 8M14 6l-8 8" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const SendSVG = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 10L18 3L11 19L9 11L2 10Z" fill="#6366f1" stroke="#6366f1" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

const ChatbotWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! I am your BrainBot. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: 'user', text: input };
    setMessages((msgs) => [...msgs, userMessage]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/gemini/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: input })
      });
      const data = await res.json();
      setMessages((msgs) => [...msgs, { sender: 'bot', text: data.answer || 'Sorry, I could not answer.' }]);
    } catch (e) {
      setMessages((msgs) => [...msgs, { sender: 'bot', text: 'Error contacting the bot.' }]);
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <>
      {/* Floating Bot Button */}
      <div className="chatbot-widget-bot-btn" onClick={() => setOpen(true)}>
        <RobotSVG size={32} />
        <span className="chatbot-widget-label">{BOT_LABEL}</span>
      </div>
      {/* Chat Popup */}
      {open && (
        <div className="chatbot-widget-popup">
          <div className="chatbot-widget-header">
            <RobotSVG size={24} /> BrainBot
            <span className="chatbot-widget-close" onClick={() => setOpen(false)}><CloseSVG size={20} /></span>
          </div>
          <div className="chatbot-widget-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chatbot-widget-msg chatbot-widget-msg-${msg.sender}`}>{msg.text}</div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="chatbot-widget-input-row">
            <input
              type="text"
              placeholder="Type your question..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <button onClick={handleSend} disabled={loading || !input.trim()}>
              <SendSVG size={20} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;
