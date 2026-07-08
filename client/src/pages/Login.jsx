import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, KeyRound, ArrowRight, Zap, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(email, password);
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
            Smarter support,
            <br />
            <span style={{ color: '#60a5fa' }}>powered by AI.</span>
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>
            Manage, prioritize, and resolve support tickets effortlessly with intelligent
            automation and real-time insights.
          </p>
        </div>

        {/* Feature points */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          {['AI-powered ticket categorization', 'Smart priority prediction', 'Instant suggested replies'].map((f) => (
            <div
              key={f}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 12,
                color: 'rgba(255,255,255,0.6)',
                fontSize: 14,
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  background: 'rgba(59, 130, 246, 0.3)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <div style={{ width: 6, height: 6, background: '#60a5fa', borderRadius: '50%' }} />
              </div>
              {f}
            </div>
          ))}
        </div>
      </div>

      {/* Right panel – form */}
      <div className="auth-right">
        <div className="auth-card">
          {/* Mobile logo */}
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28 }}
            className="lg:hidden"
          >
            <div
              style={{
                width: 36,
                height: 36,
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Zap size={18} color="white" />
            </div>
            <span style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)' }}>AI Helpdesk</span>
          </div>

          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Welcome back
            </h1>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>
              Sign in to your helpdesk account
            </p>
          </div>

          {error && (
            <div className="alert alert-error" style={{ marginBottom: 20 }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email address</label>
              <div className="form-input-icon">
                <Mail className="input-icon" />
                <input
                  id="email"
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
              <label className="form-label" htmlFor="password">Password</label>
              <div className="form-input-icon" style={{ position: 'relative' }}>
                <KeyRound className="input-icon" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  placeholder="••••••••"
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

            <button
              type="submit"
              id="login-submit"
              disabled={loading}
              className="btn btn-primary btn-lg btn-full"
              style={{ marginTop: 8 }}
            >
              {loading ? (
                <>
                  <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="divider" style={{ margin: '24px 0' }} />

          <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-muted)' }}>
            Don't have an account?{' '}
            <Link
              to="/register"
              style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
