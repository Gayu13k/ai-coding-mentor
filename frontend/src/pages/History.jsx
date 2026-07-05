import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import api from '../services/api';

const History = () => {
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await api.get('/mentor/history');
      setHistoryItems(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch history.');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="page-container history-page">
      <div className="history-container glass-panel">
        <h2 className="history-title">Your Learning Timeline</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p className="typewriter-text">Reconstructing timeline...</p>
          </div>
        ) : historyItems.length === 0 ? (
          <div className="empty-state">
            <div className="floating-cube"></div>
            <h3>Timeline is empty.</h3>
            <p>Your interactions with the AI will be recorded here.</p>
          </div>
        ) : (
          <div className="timeline-wrapper">
            <div className="timeline-line"></div>
            {historyItems.map((item) => (
              <div 
                key={item.id} 
                className={`timeline-node ${expandedId === item.id ? 'expanded' : ''}`}
              >
                <div className="timeline-dot"></div>
                <div 
                  className="timeline-content glass-panel" 
                  onClick={() => toggleExpand(item.id)}
                >
                  <div className="history-header">
                    <div className="history-question">{item.question}</div>
                    <div className="history-date">{formatDate(item.createdAt)}</div>
                  </div>
                  {expandedId === item.id && (
                    <div className="history-answer markdown-body">
                      <hr className="history-divider" />
                      <ReactMarkdown>{item.answer}</ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
