import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, KeyRound, ArrowRight, Zap, AlertCircle, Eye, EyeOff } from 'lucide-react';

const ROLES = [
  { value: 'user', label: 'User / Customer', desc: 'Submit and track support tickets' },
  { value: 'agent', label: 'Support Agent', desc: 'Manage and resolve tickets' },
  { value: 'admin', label: 'Administrator', desc: 'Full system access and management' },
];

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    const result = await register(name, email, password, role);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="auth-page">
      {/* Left panel – branding */}
      <div className="auth-left">
        <div className="auth-left-pattern" />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 48 }}>
            <div
              style={{
                width: 44,
                height: 44,
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Zap size={22} color="white" />
            </div>
            <span style={{ fontSize: 20, fontWeight: 800, color: 'white' }}>AI Helpdesk</span>
          </div>
          <h2
            style={{
              fontSize: 36,
              fontWeight: 800,
              color: 'white',
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              marginBottom: 16,
            }}
          >
            Join the future
            <br />
            <span style={{ color: '#60a5fa' }}>of support.</span>
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>
            Create your account and start managing support tickets with the power of AI automation.
          </p>
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
              padding: '20px 24px',
            }}
          >
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 8, fontWeight: 500 }}>
              TRUSTED BY TEAMS AT
            </div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {['Enterprise', 'Startups', 'SMBs', 'Agencies'].map((t) => (
                <span key={t} style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right panel – form */}
      <div className="auth-right">
        <div className="auth-card" style={{ maxWidth: 460 }}>
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Create your account
            </h1>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>
              Get started with AI-Powered Helpdesk
            </p>
          </div>

          {error && (
            <div className="alert alert-error" style={{ marginBottom: 20 }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">Full name</label>
              <div className="form-input-icon">
                <User className="input-icon" />
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-email">Email address</label>
              <div className="form-input-icon">
                <Mail className="input-icon" />
                <input
                  id="reg-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  placeholder="you@company.com"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-password">Password</label>
              <div className="form-input-icon" style={{ position: 'relative' }}>
                <KeyRound className="input-icon" />
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  placeholder="Min. 6 characters"
                  style={{ paddingRight: 42 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    padding: 0,
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Role selection */}
            <div className="form-group">
              <label className="form-label">Select role</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {ROLES.map((r) => (
                  <label
                    key={r.value}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '10px 14px',
                      border: `1.5px solid ${role === r.value ? '#2563eb' : 'var(--border)'}`,
                      borderRadius: 8,
                      cursor: 'pointer',
                      background: role === r.value ? '#eff6ff' : 'var(--white)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={r.value}
                      checked={role === r.value}
                      onChange={() => setRole(r.value)}
                      style={{ accentColor: '#2563eb', width: 16, height: 16, flexShrink: 0 }}
                    />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{r.label}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              id="register-submit"
              disabled={loading}
              className="btn btn-primary btn-lg btn-full"
              style={{ marginTop: 4 }}
            >
              {loading ? (
                <>
                  <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="divider" style={{ margin: '20px 0' }} />

          <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
