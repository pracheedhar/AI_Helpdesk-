import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../context/AuthContext';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import { ChevronRight, User, Calendar, Tag, AlertCircle, CheckCircle } from 'lucide-react';
import CommentSection from '../components/CommentSection';
import AttachmentSection from '../components/AttachmentSection';
import AiInsightsPanel from '../components/AiInsightsPanel';



const STATUSES = ['open', 'in-progress', 'resolved', 'closed'];
const PRIORITY_LABELS = { low: 'Low', medium: 'Medium', high: 'High', critical: 'Critical' };

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [ticket, setTicket] = useState(null);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMsg, setActionMsg] = useState({ type: '', text: '' });
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [updatingAssign, setUpdatingAssign] = useState(false);
  const [draftComment, setDraftComment] = useState('');


  const canUpdateStatus = ['agent', 'admin'].includes(user?.role);
  const canAssign = user?.role === 'admin';

  useEffect(() => {
    const load = async () => {
      try {
        const [ticketRes, agentsRes] = await Promise.all([
          api.get(`/tickets/${id}`),
          canAssign ? api.get('/tickets/agents') : Promise.resolve({ data: { data: [] } }),
        ]);
        if (ticketRes.data.success) setTicket(ticketRes.data.data);
        if (agentsRes.data.success) setAgents(agentsRes.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load ticket.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, canAssign]);

  const showMsg = (type, text) => {
    setActionMsg({ type, text });
    setTimeout(() => setActionMsg({ type: '', text: '' }), 3000);
  };

  const handleStatusChange = async (newStatus) => {
    if (newStatus === ticket.status) return;
    try {
      setUpdatingStatus(true);
      const { data } = await api.patch(`/tickets/${id}/status`, { status: newStatus });
      if (data.success) {
        setTicket(data.data);
        showMsg('success', `Status updated to "${newStatus}"`);
      }
    } catch (err) {
      showMsg('error', err.response?.data?.message || 'Failed to update status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAssign = async (agentId) => {
    try {
      setUpdatingAssign(true);
      const { data } = await api.patch(`/tickets/${id}/assign`, { agentId: agentId || null });
      if (data.success) {
        setTicket(data.data);
        showMsg('success', agentId ? 'Ticket assigned successfully' : 'Ticket unassigned');
      }
    } catch (err) {
      showMsg('error', err.response?.data?.message || 'Failed to assign ticket.');
    } finally {
      setUpdatingAssign(false);
    }
  };

  if (loading) {
    return (
      <div className="app-layout">
        <Sidebar />
        <div className="main-content">
          <Navbar title="Ticket Detail" />
          <main style={{ flex: 1, padding: 28, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="spinner spinner-blue" style={{ width: 36, height: 36, borderWidth: 3 }} />
          </main>
        </div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="app-layout">
        <Sidebar />
        <div className="main-content">
          <Navbar title="Ticket Detail" />
          <main style={{ flex: 1, padding: 28 }}>
            <div className="alert alert-error" style={{ maxWidth: 500 }}>
              <AlertCircle size={16} />
              {error || 'Ticket not found.'}
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Ticket Detail" />

        <main style={{ flex: 1, padding: '28px 28px 40px', maxWidth: 1100 }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>
            <span style={{ cursor: 'pointer', color: '#2563eb' }} onClick={() => navigate('/tickets')}>
              Tickets
            </span>
            <ChevronRight size={14} />
            <span style={{ color: 'var(--text-secondary)', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {ticket.title}
            </span>
          </div>

          {/* Action message */}
          {actionMsg.text && (
            <div className={`alert ${actionMsg.type === 'success' ? 'alert-success' : 'alert-error'}`} style={{ marginBottom: 20 }}>
              {actionMsg.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
              {actionMsg.text}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'start' }}>
            {/* Main content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Title + badges */}
              <div className="card" style={{ padding: '24px 28px' }}>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                  <StatusBadge status={ticket.status} />
                  <PriorityBadge priority={ticket.priority} />
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      padding: '3px 10px',
                      borderRadius: 100,
                      background: '#f1f5f9',
                      color: '#475569',
                    }}
                  >
                    {ticket.category}
                  </span>
                </div>
                <h1
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.01em',
                    lineHeight: 1.35,
                    marginBottom: 16,
                  }}
                >
                  {ticket.title}
                </h1>
                <div className="divider" />
                <div
                  style={{
                    fontSize: 15,
                    color: 'var(--text-secondary)',
                    lineHeight: 1.75,
                    whiteSpace: 'pre-wrap',
                    marginTop: 16,
                  }}
                >
                  {ticket.description}
                </div>
              </div>

              {/* Comments Section */}
              <CommentSection ticketId={id} user={user} draftComment={draftComment} />
            </div>

            {/* Sidebar meta panel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* AI Insights Copilot panel */}
              <AiInsightsPanel
                ticketId={id}
                user={user}
                onApplyReply={(reply) => setDraftComment(reply)}
              />

              {/* Attachment Section */}
              <AttachmentSection ticketId={id} />


              {/* Meta info */}
              <div className="card" style={{ padding: '20px 20px' }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>
                  Ticket Details
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                      Ticket ID
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                      #{ticket._id.slice(-8).toUpperCase()}
                    </div>
                  </div>

                  <div className="divider" style={{ margin: '0' }} />

                  <MetaRow icon={User} label="Created by" value={ticket.createdBy?.name} sub={ticket.createdBy?.role} />
                  <MetaRow icon={Calendar} label="Opened" value={formatDate(ticket.createdAt)} />
                  <MetaRow icon={Calendar} label="Last updated" value={formatDate(ticket.updatedAt)} />
                  <MetaRow icon={Tag} label="Category" value={ticket.category} />
                  <MetaRow icon={Tag} label="Priority" value={PRIORITY_LABELS[ticket.priority]} />
                </div>
              </div>

              {/* Assigned to */}
              <div className="card" style={{ padding: '20px' }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>
                  Assigned To
                </h3>
                {ticket.assignedTo ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 12px',
                      background: 'var(--surface-2)',
                      borderRadius: 8,
                    }}
                  >
                    <div className="avatar avatar-sm avatar-blue">{ticket.assignedTo.name[0].toUpperCase()}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                        {ticket.assignedTo.name}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                        {ticket.assignedTo.role}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      padding: '10px 12px',
                      background: 'var(--surface-2)',
                      borderRadius: 8,
                      fontSize: 13,
                      color: 'var(--text-muted)',
                      textAlign: 'center',
                    }}
                  >
                    Unassigned
                  </div>
                )}

                {canAssign && (
                  <div style={{ marginTop: 12 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                      Assign agent
                    </label>
                    <select
                      className="form-select"
                      style={{ fontSize: 13 }}
                      value={ticket.assignedTo?._id || ''}
                      onChange={(e) => handleAssign(e.target.value)}
                      disabled={updatingAssign}
                      id="assign-agent-select"
                    >
                      <option value="">— Unassign —</option>
                      {agents.map((a) => (
                        <option key={a._id} value={a._id}>
                          {a.name} ({a.role})
                        </option>
                      ))}
                    </select>
                    {updatingAssign && (
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>Updating…</div>
                    )}
                  </div>
                )}
              </div>

              {/* Status management */}
              {canUpdateStatus && (
                <div className="card" style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>
                    Update Status
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {STATUSES.map((s) => (
                      <button
                        key={s}
                        className={`btn ${ticket.status === s ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                        style={{ justifyContent: 'flex-start', textTransform: 'capitalize' }}
                        onClick={() => handleStatusChange(s)}
                        disabled={updatingStatus || ticket.status === s}
                        id={`status-${s}`}
                      >
                        <span
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: s === 'open' ? '#2563eb'
                              : s === 'in-progress' ? '#d97706'
                              : s === 'resolved' ? '#16a34a'
                              : '#94a3b8',
                            flexShrink: 0,
                          }}
                        />
                        {s.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function MetaRow({ icon: Icon, label, value, sub }) {
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 3 }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Icon size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{value}</div>
          {sub && (
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'capitalize' }}>{sub}</div>
          )}
        </div>
      </div>
    </div>
  );
}
