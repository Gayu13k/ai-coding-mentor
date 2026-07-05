import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import api from '../services/api';

const Typewriter = ({ text, delay = 50 }) => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentText('');
    setCurrentIndex(0);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText(prevText => prevText + text[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, delay, text]);

  return <span>{currentText}<span className="cursor">_</span></span>;
};

const DoubtSolver = () => {
  const [doubt, setDoubt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!doubt.trim()) return;

    setLoading(true);
    setError('');
    setResult('');

    try {
      const response = await api.post('/mentor/doubt', { question: doubt });
      setResult(response.data.answer);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze doubt.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container review-page">
      <div className="review-layout">
        <div className="review-input-section">
          <h2>Doubt Analyzer</h2>
          <p>Stuck on an error or a confusing concept? Describe it below and the AI will analyze the root cause and provide a step-by-step fix.</p>
          
          <form onSubmit={handleSubmit} className="review-form">
            <div className="form-group">
              <label htmlFor="doubt">Your Doubt or Error Message</label>
              <textarea
                id="doubt"
                value={doubt}
                onChange={(e) => setDoubt(e.target.value)}
                placeholder="Paste the exact error message or explain what you are confused about..."
                rows="8"
                required
                className="code-input"
              ></textarea>
            </div>
            
            <button type="submit" className="btn btn-primary btn-block" disabled={loading || !doubt.trim()}>
              {loading ? 'Analyzing...' : 'Solve Doubt'}
            </button>
          </form>
          {error && <div className="error-message mt-2">{error}</div>}
        </div>
        
        <div className="review-result-section">
          <h2>Analysis Result</h2>
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p className="typewriter-text"><Typewriter text="Analyzing logic... identifying root cause... formulating solution..." delay={40} /></p>
            </div>
          ) : result ? (
            <div className="review-result-content glass-panel markdown-body">
              <ReactMarkdown>{result}</ReactMarkdown>
            </div>
          ) : (
            <div className="empty-state">
              <h3><Typewriter text="System Ready." delay={100} /></h3>
              <p>Awaiting input for analysis...</p>
            </div>
          )}
        </div>
      </div>
      <style>{`
        .cursor { animation: blink 1s step-start infinite; }
        @keyframes blink { 50% { opacity: 0; } }
        .typewriter-text { font-family: 'Fira Code', monospace; color: var(--primary-color); font-weight: 500; }
      `}</style>
    </div>
  );
};

export default DoubtSolver;
