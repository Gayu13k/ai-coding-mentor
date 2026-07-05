import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import api from '../services/api';

const LANGUAGES = [
  'General / Agnostic',
  'JavaScript',
  'Python',
  'Java',
  'C++',
  'TypeScript',
  'Rust',
  'Go',
  'Ruby'
];

const MentorChat = () => {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('concept');
  const [language, setLanguage] = useState('General / Agnostic');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const newQuestion = question.trim();
    setQuestion('');
    setMessages(prev => [...prev, { type: 'user', content: newQuestion }]);
    setLoading(true);

    try {
      const response = await api.post('/mentor/ask', { 
        question: newQuestion,
        mode: mode,
        language: language
      });
      setMessages(prev => [...prev, { type: 'ai', content: response.data.answer }]);
    } catch (err) {
      setMessages(prev => [...prev, { 
        type: 'error', 
        content: err.response?.data?.message || 'Sorry, I encountered an error while trying to answer your question.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container chat-page">
      <div className="chat-container glass-panel">
        <div className="chat-header-glass">
          <div className="mode-toggle">
            <button 
              className={`toggle-btn ${mode === 'concept' ? 'active' : ''}`}
              onClick={() => setMode('concept')}
            >
              Concept Theory
            </button>
            <button 
              className={`toggle-btn ${mode === 'code' ? 'active' : ''}`}
              onClick={() => setMode('code')}
            >
              Code Logic
            </button>
          </div>
          <div className="lang-selector-glass">
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              className="glass-select"
            >
              {LANGUAGES.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="chat-history">
          {messages.length === 0 ? (
            <div className="empty-state">
              <div className="floating-cube"></div>
              <h3>AI Mentor: {mode === 'concept' ? 'Concept Mode' : 'Logic Mode'}</h3>
              <p>
                {mode === 'concept' 
                  ? 'Ask about architectural decisions, analogies, and the "why" behind programming.' 
                  : 'Paste code or ask for algorithms, optimal solutions, and syntax.'}
              </p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div key={index} className={`message-wrapper ${msg.type}`}>
                <div className={`message-bubble ${msg.type} glass-bubble markdown-body`}>
                  {msg.type === 'ai' ? <ReactMarkdown>{msg.content}</ReactMarkdown> : msg.content}
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="message-wrapper ai">
              <div className="message-bubble ai loading glass-bubble">
                <span className="dot glowing-dot"></span>
                <span className="dot glowing-dot"></span>
                <span className="dot glowing-dot"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="chat-input-container glass-input-area">
          <form onSubmit={handleSubmit} className="chat-form">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={mode === 'concept' ? "Ask a conceptual question..." : "Ask for code or logic..."}
              disabled={loading}
              className="chat-input glass-input"
            />
            <button type="submit" className="btn btn-primary glow-btn" disabled={loading || !question.trim()}>
              Ask
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MentorChat;
