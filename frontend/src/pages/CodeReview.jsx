import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import api from '../services/api';

const CodeReview = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('JavaScript');
  const [reviewResult, setReviewResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const languages = ['JavaScript', 'Python', 'Java', 'C++', 'Other'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setError('');
    setReviewResult('');

    try {
      const response = await api.post('/review/analyze', { code, language });
      setReviewResult(response.data.answer);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container review-page">
      <div className="review-layout">
        <div className="review-input-section">
          <h2>Code Review</h2>
          <p>Paste your code below and get instant AI feedback on best practices, potential bugs, and optimization.</p>
          
          <form onSubmit={handleSubmit} className="review-form">
            <div className="form-group">
              <label htmlFor="language">Language</label>
              <select 
                id="language" 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                className="language-select"
              >
                {languages.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="code">Code</label>
              <textarea
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Paste your code here..."
                rows="15"
                required
                className="code-input"
              ></textarea>
            </div>
            
            <button type="submit" className="btn btn-primary" disabled={loading || !code.trim()}>
              {loading ? 'Analyzing Code...' : 'Review Code'}
            </button>
          </form>
          {error && <div className="error-message mt-2">{error}</div>}
        </div>
        
        <div className="review-result-section">
          <h2>Analysis Result</h2>
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Analyzing your code...</p>
            </div>
          ) : reviewResult ? (
            <div className="review-result-content glass-panel markdown-body">
              <ReactMarkdown>{reviewResult}</ReactMarkdown>
            </div>
          ) : (
            <div className="empty-state">
              <p>Submit your code to see the review results here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeReview;
