import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import { Clock, User } from 'lucide-react';

function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const CATEGORY_COLORS = {
  'Technical Issue': '#eff6ff',
  'Account Access': '#faf5ff',
  'Billing': '#f0fdf4',
  'Feature Request': '#fff7ed',
  'Bug Report': '#fef2f2',
  'General Inquiry': '#f8fafc',
  'Other': '#f8fafc',
};

export default function TicketCard({ ticket }) {
  const catColor = CATEGORY_COLORS[ticket.category] || '#f8fafc';

  return (
    <Link to={`/tickets/${ticket._id}`} className="ticket-card animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p className="ticket-card-title">{ticket.title}</p>
          <p
            className="ticket-card-meta"
            style={{ marginTop: 4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
          >
            {ticket.description}
          </p>
        </div>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            padding: '3px 8px',
            borderRadius: 6,
            background: catColor,
            color: 'var(--text-secondary)',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          {ticket.category}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <StatusBadge status={ticket.status} />
        <PriorityBadge priority={ticket.priority} />
        <div style={{ flex: 1 }} />
        {ticket.assignedTo && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-muted)' }}>
            <User size={12} />
            {ticket.assignedTo.name}
          </span>
        )}
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-muted)' }}>
          <Clock size={12} />
          {timeAgo(ticket.createdAt)}
        </span>
      </div>
    </Link>
  );
}
