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
} from 'lucide-react';

function StatCard({ icon: Icon, iconBg, iconColor, label, value, change }) {
  return (
    <div className="stat-card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 10,
            background: iconBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: iconColor,
          }}
        >
          <Icon size={20} />
        </div>
        {change !== undefined && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#16a34a', fontWeight: 600 }}>
            <TrendingUp size={14} />
            {change}
          </div>
        )}
      </div>
      <div>
        <div className="stat-card-value">{value}</div>
        <div className="stat-card-label">{label}</div>
      </div>
    </div>
  );
}

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
        // silently fail – stats will show zero
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
    critical: tickets.filter((t) => t.priority === 'critical').length,
  };

  const recent = tickets.slice(0, 5);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Dashboard" />

        <main style={{ flex: 1, padding: '28px 28px 40px', maxWidth: 1200 }}>
          {/* Welcome */}
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
              {greeting()}, {user?.name?.split(' ')[0]} 👋
            </h2>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>
              Here's what's happening with your support desk today.
            </p>
          </div>

          {/* Stats Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 16,
              marginBottom: 32,
            }}
          >
            <StatCard
              icon={Ticket}
              iconBg="#eff6ff"
              iconColor="#2563eb"
              label="Total Tickets"
              value={loading ? '—' : stats.total}
            />
            <StatCard
              icon={Clock}
              iconBg="#fef3c7"
              iconColor="#d97706"
              label="Open"
              value={loading ? '—' : stats.open}
            />
            <StatCard
              icon={TrendingUp}
              iconBg="#e0f2fe"
              iconColor="#0284c7"
              label="In Progress"
              value={loading ? '—' : stats.inProgress}
            />
            <StatCard
              icon={CheckCircle}
              iconBg="#dcfce7"
              iconColor="#16a34a"
              label="Resolved"
              value={loading ? '—' : stats.resolved}
            />
            <StatCard
              icon={AlertTriangle}
              iconBg="#fee2e2"
              iconColor="#dc2626"
              label="Critical"
              value={loading ? '—' : stats.critical}
            />
          </div>

          {/* Recent Tickets */}
          <div className="card" style={{ padding: '20px 24px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 16,
              }}
            >
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
                  Recent Tickets
                </h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
                  Latest support requests
                </p>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                {user?.role !== 'admin' && (
                  <Link to="/tickets/new" className="btn btn-primary btn-sm">
                    <Plus size={14} />
                    New Ticket
                  </Link>
                )}
                <Link to="/tickets" className="btn btn-secondary btn-sm">
                  View All
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    style={{
                      height: 64,
                      background: 'var(--surface-2)',
                      borderRadius: 8,
                      animation: 'pulse 1.5s ease-in-out infinite',
                    }}
                  />
                ))}
              </div>
            ) : recent.length === 0 ? (
              <div className="empty-state" style={{ padding: '40px 24px' }}>
                <div className="empty-state-icon">
                  <Ticket size={28} />
                </div>
                <div className="empty-state-title">No tickets yet</div>
                <div className="empty-state-text">
                  {user?.role === 'user'
                    ? 'Create your first support ticket to get started.'
                    : 'No tickets have been submitted yet.'}
                </div>
                {user?.role !== 'admin' && (
                  <Link to="/tickets/new" className="btn btn-primary btn-sm">
                    <Plus size={14} />
                    Create Ticket
                  </Link>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {recent.map((ticket, idx) => (
                  <Link
                    key={ticket._id}
                    to={`/tickets/${ticket._id}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      padding: '14px 0',
                      borderBottom: idx < recent.length - 1 ? '1px solid var(--border)' : 'none',
                      textDecoration: 'none',
                      transition: 'background 0.15s ease',
                    }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: ticket.status === 'open' ? '#2563eb'
                          : ticket.status === 'in-progress' ? '#d97706'
                          : ticket.status === 'resolved' ? '#16a34a'
                          : '#94a3b8',
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: 'var(--text-primary)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {ticket.title}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                        by {ticket.createdBy?.name} · {ticket.category}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
                      <StatusBadge status={ticket.status} />
                      <PriorityBadge priority={ticket.priority} />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
