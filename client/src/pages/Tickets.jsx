import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../context/AuthContext';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import TicketCard from '../components/TicketCard';
import { Plus, Search, RefreshCw, Ticket, Filter } from 'lucide-react';

const STATUSES = ['all', 'open', 'in-progress', 'resolved', 'closed'];
const PRIORITIES = ['all', 'critical', 'high', 'medium', 'low'];

export default function Tickets() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (priorityFilter !== 'all') params.priority = priorityFilter;
      const { data } = await api.get('/tickets', { params });
      if (data.success) setTickets(data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tickets.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, priorityFilter]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const filtered = tickets.filter((t) =>
    search === '' ||
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.description.toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Tickets" />

        <main style={{ flex: 1, padding: '28px 28px 40px', maxWidth: 1200 }}>
          {/* Page header */}
          <div className="page-header">
            <div>
              <h1 className="page-title">Support Tickets</h1>
              <p className="page-subtitle">
                {loading ? 'Loading...' : `${filtered.length} ticket${filtered.length !== 1 ? 's' : ''} found`}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={fetchTickets}
                title="Refresh"
              >
                <RefreshCw size={14} />
                Refresh
              </button>
              {user?.role !== 'admin' && (
                <Link to="/tickets/new" className="btn btn-primary btn-sm">
                  <Plus size={14} />
                  New Ticket
                </Link>
              )}
            </div>
          </div>

          {/* Search + filters */}
          <div
            className="card"
            style={{ padding: '16px 20px', marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 14 }}
          >
            {/* Search bar */}
            <div style={{ position: 'relative' }}>
              <Search
                size={16}
                style={{
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="form-input"
                placeholder="Search tickets by title, description, or category…"
                style={{ paddingLeft: 38 }}
                id="ticket-search"
              />
            </div>

            {/* Filter chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Filter size={14} style={{ color: 'var(--text-muted)' }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Status
                </span>
                <div className="filter-bar" style={{ gap: 6 }}>
                  {STATUSES.map((s) => (
                    <button
                      key={s}
                      className={`filter-chip ${statusFilter === s ? 'active' : ''}`}
                      onClick={() => setStatusFilter(s)}
                      style={{ padding: '4px 12px', fontSize: 12 }}
                    >
                      {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="divider" style={{ width: 1, height: 'auto', margin: '0 4px', background: 'var(--border)' }} />

              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Priority
                </span>
                <div className="filter-bar" style={{ gap: 6 }}>
                  {PRIORITIES.map((p) => (
                    <button
                      key={p}
                      className={`filter-chip ${priorityFilter === p ? 'active' : ''}`}
                      onClick={() => setPriorityFilter(p)}
                      style={{ padding: '4px 12px', fontSize: 12 }}
                    >
                      {p === 'all' ? 'All' : p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="alert alert-error" style={{ marginBottom: 16 }}>
              {error}
            </div>
          )}

          {/* Ticket list */}
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  style={{
                    height: 100,
                    background: 'white',
                    border: '1px solid var(--border)',
                    borderRadius: 12,
                  }}
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="card">
              <div className="empty-state">
                <div className="empty-state-icon">
                  <Ticket size={30} />
                </div>
                <div className="empty-state-title">No tickets found</div>
                <div className="empty-state-text">
                  {search || statusFilter !== 'all' || priorityFilter !== 'all'
                    ? 'Try adjusting your search or filters.'
                    : user?.role !== 'admin'
                    ? 'Create your first support ticket to get started.'
                    : 'No tickets have been submitted yet.'}
                </div>
                {!search && statusFilter === 'all' && priorityFilter === 'all' && user?.role !== 'admin' && (
                  <Link to="/tickets/new" className="btn btn-primary btn-sm" style={{ marginTop: 8 }}>
                    <Plus size={14} />
                    Create Ticket
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filtered.map((ticket) => (
                <TicketCard key={ticket._id} ticket={ticket} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
