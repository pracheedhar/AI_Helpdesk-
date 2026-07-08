import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { AlertCircle, CheckCircle, ChevronRight } from 'lucide-react';

const CATEGORIES = [
  'Technical Issue',
  'Account Access',
  'Billing',
  'Feature Request',
  'Bug Report',
  'General Inquiry',
  'Other',
];

const PRIORITIES = [
  { value: 'low', label: 'Low', color: '#16a34a', bg: '#dcfce7', desc: 'Minor issue, no urgency' },
  { value: 'medium', label: 'Medium', color: '#d97706', bg: '#fef3c7', desc: 'Moderate impact, can wait' },
  { value: 'high', label: 'High', color: '#ea580c', bg: '#ffedd5', desc: 'Significant impact, needs attention' },
  { value: 'critical', label: 'Critical', color: '#dc2626', bg: '#fee2e2', desc: 'Urgent, blocking operations' },
];

export default function CreateTicket() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'General Inquiry',
    priority: 'medium',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title.trim() || !form.description.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    try {
      setLoading(true);
      const { data } = await api.post('/tickets', form);
      if (data.success) {
        setSuccess(true);
        setTimeout(() => navigate(`/tickets/${data.data._id}`), 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Create Ticket" />

        <main style={{ flex: 1, padding: '28px 28px 40px' }}>
          <div style={{ maxWidth: 720 }}>
            {/* Header */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>
                <span
                  style={{ cursor: 'pointer', color: '#2563eb' }}
                  onClick={() => navigate('/tickets')}
                >
                  Tickets
                </span>
                <ChevronRight size={14} />
                <span>New Ticket</span>
              </div>
              <h1 className="page-title">Submit a Support Ticket</h1>
              <p className="page-subtitle">
                Describe your issue and our team will get back to you as soon as possible.
              </p>
            </div>

            {success && (
              <div className="alert alert-success" style={{ marginBottom: 24 }}>
                <CheckCircle size={16} style={{ flexShrink: 0 }} />
                Ticket created successfully! Redirecting…
              </div>
            )}

            {error && (
              <div className="alert alert-error" style={{ marginBottom: 24 }}>
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="card" style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 22 }}>
                {/* Title */}
                <div className="form-group">
                  <label className="form-label" htmlFor="ticket-title">
                    Title <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    id="ticket-title"
                    type="text"
                    required
                    value={form.title}
                    onChange={set('title')}
                    className="form-input"
                    placeholder="Brief summary of your issue"
                    maxLength={200}
                  />
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'right' }}>
                    {form.title.length}/200
                  </div>
                </div>

                {/* Description */}
                <div className="form-group">
                  <label className="form-label" htmlFor="ticket-description">
                    Description <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <textarea
                    id="ticket-description"
                    required
                    value={form.description}
                    onChange={set('description')}
                    className="form-textarea"
                    placeholder="Provide as much detail as possible about the issue. Include steps to reproduce, expected vs actual behavior, and any error messages."
                    rows={6}
                    maxLength={5000}
                  />
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'right' }}>
                    {form.description.length}/5000
                  </div>
                </div>

                {/* Category */}
                <div className="form-group">
                  <label className="form-label" htmlFor="ticket-category">Category</label>
                  <select
                    id="ticket-category"
                    value={form.category}
                    onChange={set('category')}
                    className="form-select"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Priority */}
                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                    {PRIORITIES.map((p) => (
                      <label
                        key={p.value}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: '12px 14px',
                          border: `1.5px solid ${form.priority === p.value ? p.color : 'var(--border)'}`,
                          borderRadius: 8,
                          cursor: 'pointer',
                          background: form.priority === p.value ? p.bg : 'var(--white)',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <input
                          type="radio"
                          name="priority"
                          value={p.value}
                          checked={form.priority === p.value}
                          onChange={() => setForm((f) => ({ ...f, priority: p.value }))}
                          style={{ accentColor: p.color, width: 15, height: 15, flexShrink: 0 }}
                        />
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: p.color }}>
                            {p.label}
                          </div>
                          <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 1 }}>
                            {p.desc}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* AI Notice */}
                <div
                  style={{
                    padding: '12px 16px',
                    background: '#eff6ff',
                    borderRadius: 8,
                    border: '1px solid #bfdbfe',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    fontSize: 13,
                    color: '#1e40af',
                  }}
                >
                  <span style={{ fontSize: 18 }}>⚡</span>
                  <span>
                    <strong>AI-Powered:</strong> Our system will automatically suggest a category and priority based on your description in Phase 4.
                  </span>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 8 }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate('/tickets')}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    id="create-ticket-submit"
                    disabled={loading || success}
                    className="btn btn-primary"
                  >
                    {loading ? (
                      <>
                        <span className="spinner" style={{ width: 15, height: 15, borderWidth: 2 }} />
                        Submitting…
                      </>
                    ) : (
                      'Submit Ticket'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
