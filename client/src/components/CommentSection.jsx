import React, { useEffect, useState } from 'react';
import { api } from '../context/AuthContext';
import { Send, User, Clock, MessageSquare } from 'lucide-react';

function formatCommentDate(dateStr) {
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function CommentSection({ ticketId, user, draftComment }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Sync draft comment if provided by parent
  useEffect(() => {
    if (draftComment) {
      setNewComment(draftComment);
    }
  }, [draftComment]);


  const fetchComments = async () => {
    try {
      const { data } = await api.get(`/tickets/${ticketId}/comments`);
      if (data.success) {
        setComments(data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [ticketId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      setError('');
      const { data } = await api.post(`/tickets/${ticketId}/comments`, {
        comment: newComment,
      });
      if (data.success) {
        setComments((prev) => [...prev, data.data]);
        setNewComment('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send comment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <MessageSquare size={18} style={{ color: '#2563eb' }} />
        <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
          Comments ({comments.length})
        </h3>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: 16 }}>
          {error}
        </div>
      )}

      {/* Comment history list */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
          {[1, 2].map((i) => (
            <div
              key={i}
              style={{
                height: 48,
                background: 'var(--surface-2)',
                borderRadius: 8,
                animation: 'pulse 1.5s ease-in-out infinite',
              }}
            />
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div
          style={{
            padding: '24px 0',
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: 13,
            borderBottom: '1px solid var(--border)',
            marginBottom: 20,
          }}
        >
          No comments yet. Start the conversation below.
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            maxHeight: 400,
            overflowY: 'auto',
            marginBottom: 20,
            paddingRight: 4,
          }}
        >
          {comments.map((c) => {
            const initials = c.userId?.name
              ? c.userId.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
              : 'U';
            const isMe = c.userId?._id === user?._id;

            return (
              <div
                key={c._id}
                style={{
                  display: 'flex',
                  gap: 10,
                  alignItems: 'flex-start',
                  alignSelf: isMe ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                }}
              >
                {!isMe && (
                  <div
                    className="avatar avatar-sm avatar-navy"
                    style={{ fontSize: 10, width: 28, height: 28 }}
                  >
                    {initials}
                  </div>
                )}
                <div
                  style={{
                    background: isMe ? '#dbeafe' : 'var(--surface-2)',
                    border: '1px solid var(--border)',
                    borderRadius: 12,
                    padding: '10px 14px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: 8,
                      marginBottom: 3,
                    }}
                  >
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>
                      {c.userId?.name}
                    </span>
                    <span
                      className={`badge badge-${c.userId?.role}`}
                      style={{ fontSize: 9, padding: '0px 6px', fontWeight: 600 }}
                    >
                      {c.userId?.role}
                    </span>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                      {formatCommentDate(c.createdAt)}
                    </span>
                  </div>
                  <div style={{ fontSize: 13.5, color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>
                    {c.comment}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* New comment input */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10 }}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="form-input"
          placeholder="Write a reply..."
          rows={1}
          style={{ minHeight: 40, resize: 'none', padding: '10px 14px' }}
        />
        <button
          type="submit"
          className="btn btn-primary"
          style={{ padding: '0 16px', height: 40 }}
          disabled={submitting || !newComment.trim()}
        >
          {submitting ? (
            <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
          ) : (
            <Send size={16} />
          )}
        </button>
      </form>
    </div>
  );
}
