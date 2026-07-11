import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import {
  Ticket,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Plus,
  ArrowRight,
  Zap,
  BarChart3,
  Users,
  Activity,
} from 'lucide-react';

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
};

const formatDate = () => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
};

export default function Dashboard() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const { data } = await api.get('/tickets');
        if (data.success) setTickets(data.data);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === 'open').length,
    inProgress: tickets.filter((t) => t.status === 'in-progress').length,
    resolved: tickets.filter((t) => t.status === 'resolved').length,
    closed: tickets.filter((t) => t.status === 'closed').length,
    critical: tickets.filter((t) => t.priority === 'critical').length,
    high: tickets.filter((t) => t.priority === 'high').length,
  };

  const recent = tickets.slice(0, 4);

  const resolutionRate = stats.total > 0
    ? Math.round(((stats.resolved + stats.closed) / stats.total) * 100)
    : 0;

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Dashboard" />

        <main style={{ flex: 1, padding: '24px 24px 40px', background: '#f1f5f9' }}>


          {/* ── BENTO GRID ── */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(12, 1fr)',
              gridTemplateRows: 'auto',
              gap: 16,
              maxWidth: 1280,
            }}
          >

            {/* ── HERO CARD (col 1-8, row 1) ── */}
            <div
              style={{
                gridColumn: '1 / 9',
                gridRow: '1',
                background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #2563eb 100%)',
                borderRadius: 20,
                padding: '32px 36px',
                position: 'relative',
                overflow: 'hidden',
                minHeight: 180,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              {/* decorative circles */}
              <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }} />
              <div style={{ position: 'absolute', bottom: -30, right: 80, width: 130, height: 130, background: 'rgba(255,255,255,0.06)', borderRadius: '50%' }} />
              <div style={{ position: 'absolute', top: 20, right: 160, width: 60, height: 60, background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />

              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: 500, marginBottom: 6 }}>
                  {formatDate()}
                </div>
                <h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                  {greeting()}, {user?.name?.split(' ')[0]} 👋
                </h1>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', marginTop: 6 }}>
                  Your support desk is running. Here's your overview.
                </p>
              </div>

              <div style={{ display: 'flex', gap: 24, position: 'relative', zIndex: 1, marginTop: 16 }}>
                <div>
                  <div style={{ fontSize: 32, fontWeight: 800, color: 'white', lineHeight: 1 }}>
                    {loading ? '—' : stats.total}
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 3 }}>Total tickets</div>
                </div>
                <div style={{ width: 1, background: 'rgba(255,255,255,0.1)' }} />
                <div>
                  <div style={{ fontSize: 32, fontWeight: 800, color: '#60a5fa', lineHeight: 1 }}>
                    {loading ? '—' : stats.open}
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 3 }}>Open now</div>
                </div>
                <div style={{ width: 1, background: 'rgba(255,255,255,0.1)' }} />
                <div>
                  <div style={{ fontSize: 32, fontWeight: 800, color: '#34d399', lineHeight: 1 }}>
                    {loading ? '—' : `${resolutionRate}%`}
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 3 }}>Resolution rate</div>
                </div>
              </div>
            </div>

            {/* ── USER PROFILE CARD (col 9-12, row 1) ── */}
            <div
              style={{
                gridColumn: '9 / 13',
                gridRow: '1',
                background: 'white',
                borderRadius: 20,
                padding: '24px',
                border: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              }}
            >
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
                  Signed in as
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #2563eb, #0f172a)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 800,
                      fontSize: 18,
                      flexShrink: 0,
                    }}
                  >
                    {user?.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
                      {user?.name}
                    </div>
                    <span className={`badge badge-${user?.role}`} style={{ marginTop: 4 }}>
                      {user?.role}
                    </span>
                  </div>
                </div>
              </div>
              <div
                style={{
                  background: '#eff6ff',
                  borderRadius: 10,
                  padding: '10px 14px',
                  marginTop: 16,
                  fontSize: 12,
                  color: '#1e40af',
                  fontWeight: 500,
                }}
              >
                ⚡ AI Copilot is active and ready to assist.
              </div>
            </div>

            {/* ── STAT: IN PROGRESS (col 1-3, row 2) ── */}
            <BentoStat
              gridCol="1 / 4"
              label="In Progress"
              value={loading ? '—' : stats.inProgress}
              icon={<Activity size={20} />}
              bg="linear-gradient(135deg, #fef3c7, #fde68a)"
              color="#92400e"
              accent="#d97706"
            />

            {/* ── STAT: RESOLVED (col 4-6, row 2) ── */}
            <BentoStat
              gridCol="4 / 7"
              label="Resolved"
              value={loading ? '—' : stats.resolved}
              icon={<CheckCircle size={20} />}
              bg="linear-gradient(135deg, #dcfce7, #bbf7d0)"
              color="#166534"
              accent="#16a34a"
            />

            {/* ── STAT: CRITICAL (col 7-9, row 2) ── */}
            <BentoStat
              gridCol="7 / 10"
              label="Critical"
              value={loading ? '—' : stats.critical}
              icon={<AlertTriangle size={20} />}
              bg="linear-gradient(135deg, #fee2e2, #fecaca)"
              color="#991b1b"
              accent="#dc2626"
            />

            {/* ── RESOLUTION RATE CARD (col 10-12, row 2) ── */}
            <div
              style={{
                gridColumn: '10 / 13',
                background: 'white',
                borderRadius: 20,
                padding: '20px',
                border: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              }}
            >
              <div style={{ position: 'relative', width: 80, height: 80, marginBottom: 10 }}>
                <svg viewBox="0 0 36 36" style={{ width: 80, height: 80, transform: 'rotate(-90deg)' }}>
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                  <circle
                    cx="18" cy="18" r="15.9" fill="none"
                    stroke={resolutionRate > 70 ? '#16a34a' : resolutionRate > 40 ? '#d97706' : '#dc2626'}
                    strokeWidth="3"
                    strokeDasharray={`${resolutionRate} ${100 - resolutionRate}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)' }}>
                    {loading ? '—' : `${resolutionRate}%`}
                  </span>
                </div>
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textAlign: 'center' }}>
                Resolution Rate
              </div>
            </div>

            {/* ── RECENT TICKETS (col 1-8, row 3) ── */}
            <div
              style={{
                gridColumn: '1 / 9',
                background: 'white',
                borderRadius: 20,
                padding: '24px 28px',
                border: '1px solid var(--border)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Recent Tickets</h3>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Latest support requests across all categories</p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {user?.role !== 'admin' && (
                    <Link to="/tickets/new" className="btn btn-primary btn-sm">
                      <Plus size={13} /> New
                    </Link>
                  )}
                  <Link to="/tickets" className="btn btn-secondary btn-sm">
                    All tickets <ArrowRight size={13} />
                  </Link>
                </div>
              </div>

              {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[1, 2, 3].map((i) => (
                    <div key={i} style={{ height: 52, background: '#f1f5f9', borderRadius: 10, opacity: 0.7 }} />
                  ))}
                </div>
              ) : recent.length === 0 ? (
                <div className="empty-state" style={{ padding: '32px 0' }}>
                  <div className="empty-state-icon"><Ticket size={26} /></div>
                  <div className="empty-state-title">No tickets yet</div>
                  <div className="empty-state-text">
                    {user?.role === 'user' ? 'Submit your first support ticket.' : 'No tickets submitted yet.'}
                  </div>
                  {user?.role !== 'admin' && (
                    <Link to="/tickets/new" className="btn btn-primary btn-sm" style={{ marginTop: 10 }}>
                      <Plus size={13} /> Create Ticket
                    </Link>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {recent.map((ticket, idx) => (
                    <Link
                      key={ticket._id}
                      to={`/tickets/${ticket._id}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 14,
                        padding: '12px 14px',
                        borderRadius: 10,
                        textDecoration: 'none',
                        transition: 'background 0.15s ease',
                        background: idx % 2 === 0 ? '#f8fafc' : 'white',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#eff6ff'}
                      onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? '#f8fafc' : 'white'}
                    >
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 8,
                          background: ticket.status === 'open' ? '#dbeafe'
                            : ticket.status === 'in-progress' ? '#fef3c7'
                            : ticket.status === 'resolved' ? '#dcfce7'
                            : '#f1f5f9',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Ticket
                          size={16}
                          color={ticket.status === 'open' ? '#2563eb'
                            : ticket.status === 'in-progress' ? '#d97706'
                            : ticket.status === 'resolved' ? '#16a34a'
                            : '#94a3b8'}
                        />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: 13.5,
                            fontWeight: 600,
                            color: 'var(--text-primary)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {ticket.title}
                        </div>
                        <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 1 }}>
                          {ticket.createdBy?.name} · {ticket.category}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                        <StatusBadge status={ticket.status} />
                        <PriorityBadge priority={ticket.priority} />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* ── QUICK ACTIONS (col 9-12, row 3) ── */}
            <div
              style={{
                gridColumn: '9 / 13',
                background: 'white',
                borderRadius: 20,
                padding: '24px',
                border: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              }}
            >
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Quick Actions</h3>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Jump to common tasks</p>
              </div>

              {user?.role !== 'admin' && (
                <Link
                  to="/tickets/new"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '12px 14px',
                    background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                    borderRadius: 12,
                    textDecoration: 'none',
                    color: 'white',
                    transition: 'opacity 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  <Plus size={18} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>New Ticket</div>
                    <div style={{ fontSize: 11, opacity: 0.7 }}>Submit a support request</div>
                  </div>
                </Link>
              )}

              <Link
                to="/tickets"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 14px',
                  background: '#f8fafc',
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  textDecoration: 'none',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#eff6ff'}
                onMouseLeave={e => e.currentTarget.style.background = '#f8fafc'}
              >
                <div style={{ width: 36, height: 36, background: '#dbeafe', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BarChart3 size={16} color="#2563eb" />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>All Tickets</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Browse & filter tickets</div>
                </div>
              </Link>

              {/* Priority breakdown */}
              <div style={{ marginTop: 4 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
                  Priority Breakdown
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {[
                    { label: 'Critical', count: stats.critical, color: '#dc2626', bg: '#fee2e2' },
                    { label: 'High', count: stats.high, color: '#ea580c', bg: '#ffedd5' },
                    { label: 'Open', count: stats.open, color: '#2563eb', bg: '#dbeafe' },
                  ].map((item) => (
                    <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: item.color, width: 50 }}>{item.label}</div>
                      <div style={{ flex: 1, height: 6, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                        <div
                          style={{
                            height: '100%',
                            background: item.color,
                            borderRadius: 4,
                            width: stats.total > 0 ? `${Math.round((item.count / stats.total) * 100)}%` : '0%',
                            transition: 'width 0.6s ease',
                          }}
                        />
                      </div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', width: 20, textAlign: 'right' }}>
                        {loading ? '—' : item.count}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

function BentoStat({ gridCol, label, value, icon, bg, color, accent }) {
  return (
    <div
      style={{
        gridColumn: gridCol,
        background: bg,
        borderRadius: 20,
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: 120,
        border: '1px solid rgba(0,0,0,0.04)',
      }}
    >
      <div style={{ color: accent, opacity: 0.8 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 30, fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 12, fontWeight: 600, color, opacity: 0.7, marginTop: 4 }}>{label}</div>
      </div>
    </div>
  );
}
