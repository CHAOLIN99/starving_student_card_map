// src/components/Chatbot.jsx
import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css'; // You'll create this file next

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    // Focus the input when opening the chat
    if (!isOpen) {
        setTimeout(() => document.getElementById('chat-input').focus(), 300);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    
    // 1. Add user message
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      // 2. Send question to the new backend API
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: userMessage }),
      });

      const data = await response.json();

      let botResponse = '';
      if (response.ok) {
        botResponse = data.answer;
      } else {
        botResponse = data.message || "Sorry, I ran into an error trying to answer that question.";
      }
      
      // 3. Add bot response
      setMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);

    } catch (error) {
      console.error("Chat API fetch error:", error);
      setMessages(prev => [...prev, { sender: 'bot', text: "A network error occurred. Please check the server." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`chatbot-container ${isOpen ? 'open' : 'closed'}`}>
      <div className="chatbot-header" onClick={toggleChat}>
        Starving Student Bot 🤖
        <span className="toggle-icon">{isOpen ? '−' : '+'}</span>
      </div>

      {isOpen && (
        <div className="chatbot-body">
          <div className="chatbot-messages">
            {messages.length === 0 && (
                <div className="welcome-message">
                    Hello! I can answer questions about the deals available in the database.
                    Try asking something like, "What free deals are available?" or "Which stores have deals with unlimited uses?"
                </div>
            )}
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className="message bot loading">
                <div className="loading-dot"></div><div className="loading-dot"></div><div className="loading-dot"></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <form className="chatbot-input-area" onSubmit={handleSubmit}>
            <input
              id="chat-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about the deals..."
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading}>
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;