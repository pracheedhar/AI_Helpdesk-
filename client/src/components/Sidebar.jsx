import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Ticket,
  Users,
  LogOut,
  Settings,
  Zap,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/', end: true, roles: ['user', 'agent', 'admin'] },
  { label: 'Tickets', icon: Ticket, to: '/tickets', roles: ['user', 'agent', 'admin'] },
  { label: 'Users', icon: Users, to: '/users', roles: ['admin'] },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Zap size={18} />
        </div>
        <div>
          <div className="sidebar-logo-text">AI Helpdesk</div>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>
            Smart Support
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Navigation</div>
        {navItems
          .filter((item) => item.roles.includes(user?.role))
          .map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `sidebar-nav-item${isActive ? ' active' : ''}`
              }
            >
              <item.icon className="nav-icon" />
              {item.label}
            </NavLink>
          ))}

        <div className="sidebar-section-label" style={{ marginTop: 20 }}>Account</div>
        <button className="sidebar-nav-item" onClick={() => navigate('/settings')}>
          <Settings className="nav-icon" />
          Settings
        </button>
      </nav>

      {/* Footer — user profile + logout */}
      <div className="sidebar-footer">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 12px',
            borderRadius: 10,
            background: 'rgba(255,255,255,0.05)',
            marginBottom: 10,
          }}
        >
          <div
            className="avatar avatar-sm"
            style={{ background: '#1e40af', color: '#93c5fd', flexShrink: 0 }}
          >
            {initials}
          </div>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: '#f1f5f9',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {user?.name}
            </div>
            <div
              style={{
                fontSize: 11,
                color: 'rgba(255,255,255,0.4)',
                textTransform: 'capitalize',
              }}
            >
              {user?.role}
            </div>
          </div>
        </div>
        <button className="sidebar-nav-item btn-danger-ghost" onClick={handleLogout}>
          <LogOut className="nav-icon" style={{ color: '#f87171' }} />
          <span style={{ color: '#f87171' }}>Logout</span>
        </button>
      </div>
    </aside>
  );
}
