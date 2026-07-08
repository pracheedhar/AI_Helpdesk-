import React from 'react';
import { Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ title }) {
  const { user } = useAuth();

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  const roleBadgeClass = {
    admin: 'badge-admin',
    agent: 'badge-agent',
    user: 'badge-user',
  }[user?.role] || 'badge-user';

  return (
    <header className="topnav">
      <div>
        <h1 className="topnav-title">{title}</h1>
      </div>

      <div className="topnav-actions">
        {/* Notification bell */}
        <button
          className="btn btn-ghost"
          style={{ padding: '8px', position: 'relative' }}
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span
            style={{
              position: 'absolute',
              top: 6,
              right: 6,
              width: 8,
              height: 8,
              background: '#2563eb',
              borderRadius: '50%',
              border: '2px solid white',
            }}
          />
        </button>

        {/* User profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
              {user?.name}
            </div>
            <div className="flex justify-end">
              <span className={`badge ${roleBadgeClass}`} style={{ fontSize: 11, padding: '1px 8px' }}>
                {user?.role}
              </span>
            </div>
          </div>
          <div
            className="avatar avatar-md avatar-blue"
            style={{ fontWeight: 700 }}
          >
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}
