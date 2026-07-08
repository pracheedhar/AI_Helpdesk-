import React, { useState, useEffect } from 'react';
import { api } from '../context/AuthContext';
import { Sparkles, RefreshCw, MessageSquare, AlertTriangle, FileText } from 'lucide-react';

export default function AiInsightsPanel({ ticketId, user, onApplyReply }) {
  const [summary, setSummary] = useState('');
  const [suggestedReply, setSuggestedReply] = useState('');
  const [duplicates, setDuplicates] = useState([]);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingReply, setLoadingReply] = useState(false);
  const [loadingDuplicates, setLoadingDuplicates] = useState(true);
  const [error, setError] = useState('');

  const isAgentOrAdmin = ['agent', 'admin'].includes(user?.role);

  const fetchDuplicates = async () => {
    try {
      const { data } = await api.get(`/tickets/${ticketId}/ai-duplicates`);
      if (data.success) {
        setDuplicates(data.data || []);
      }
    } catch (err) {
      // Fail silently for background loads
    } finally {
      setLoadingDuplicates(false);
    }
  };

  useEffect(() => {
    fetchDuplicates();
  }, [ticketId]);

  const generateSummary = async () => {
    try {
      setLoadingSummary(true);
      setError('');
      const { data } = await api.get(`/tickets/${ticketId}/ai-summary`);
      if (data.success) {
        setSummary(data.summary);
      }
    } catch (err) {
      setError('Failed to generate summary');
    } finally {
      setLoadingSummary(false);
    }
  };

  const getSuggestedReply = async () => {
    try {
      setLoadingReply(true);
      setError('');
      const { data } = await api.get(`/tickets/${ticketId}/ai-suggested-reply`);
      if (data.success) {
        setSuggestedReply(data.reply);
      }
    } catch (err) {
      setError('Failed to get suggested reply');
    } finally {
      setLoadingReply(false);
    }
  };

  return (
    <div className="card" style={{ padding: '20px', border: '1px solid #bfdbfe', background: '#eff6ff' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Sparkles size={16} style={{ color: '#2563eb' }} />
        <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1e40af' }}>
          AI Copilot Insights
        </h3>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: 12, padding: '6px 10px', fontSize: 12 }}>
          {error}
        </div>
      )}

      {/* Summarization */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#1e3a8a' }}>Conversation Summary</span>
          <button
            onClick={generateSummary}
            className="btn btn-secondary btn-sm"
            style={{ padding: '2px 8px', fontSize: 10, background: 'white' }}
            disabled={loadingSummary}
          >
            {loadingSummary ? 'Running...' : summary ? 'Regenerate' : 'Generate'}
          </button>
        </div>
        {summary ? (
          <div style={{ fontSize: 12.5, color: '#1e40af', background: 'white', padding: 10, borderRadius: 6, border: '1px solid #dbeafe', lineHeight: 1.5 }}>
            {summary}
          </div>
        ) : (
          <div style={{ fontSize: 11.5, color: '#60a5fa', fontStyle: 'italic' }}>
            No summary generated yet.
          </div>
        )}
      </div>

      {/* Suggested replies for agents/admins */}
      {isAgentOrAdmin && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#1e3a8a' }}>Suggested Draft Reply</span>
            <button
              onClick={getSuggestedReply}
              className="btn btn-secondary btn-sm"
              style={{ padding: '2px 8px', fontSize: 10, background: 'white' }}
              disabled={loadingReply}
            >
              {loadingReply ? 'Drafting...' : suggestedReply ? 'Regenerate' : 'Draft Reply'}
            </button>
          </div>
          {suggestedReply ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontSize: 12.5, color: '#1e40af', background: 'white', padding: 10, borderRadius: 6, border: '1px solid #dbeafe', lineHeight: 1.5 }}>
                {suggestedReply}
              </div>
              <button
                onClick={() => onApplyReply(suggestedReply)}
                className="btn btn-primary btn-sm"
                style={{ alignSelf: 'flex-end', fontSize: 10, padding: '4px 10px' }}
              >
                Use This Draft
              </button>
            </div>
          ) : (
            <div style={{ fontSize: 11.5, color: '#60a5fa', fontStyle: 'italic' }}>
              Draft replies are generated based on ticket context.
            </div>
          )}
        </div>
      )}

      {/* Duplicate Ticket Finder */}
      <div>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#1e3a8a', display: 'block', marginBottom: 6 }}>
          Potential Duplicates
        </span>
        {loadingDuplicates ? (
          <div style={{ fontSize: 11.5, color: '#60a5fa' }}>Searching database...</div>
        ) : duplicates.length === 0 ? (
          <div style={{ fontSize: 11.5, color: '#1e40af', background: '#dbeafe', padding: '6px 10px', borderRadius: 6 }}>
            ✓ No duplicate tickets detected.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {duplicates.map((d) => (
              <div
                key={d.ticketId}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'white',
                  padding: '8px 10px',
                  borderRadius: 6,
                  border: '1px solid #dbeafe',
                  fontSize: 12,
                }}
              >
                <div style={{ minWidth: 0, flex: 1, marginRight: 8 }}>
                  <span
                    style={{
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      display: 'block',
                    }}
                  >
                    {d.title}
                  </span>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                    Status: {d.status}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    background: d.score > 70 ? '#fee2e2' : '#fef3c7',
                    color: d.score > 70 ? '#991b1b' : '#92400e',
                    padding: '2px 6px',
                    borderRadius: 4,
                    flexShrink: 0,
                  }}
                >
                  {d.score}% Match
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
