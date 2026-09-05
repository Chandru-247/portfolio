import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  Sparkles, 
  AlertCircle, 
  ArrowLeft, 
  KeyRound 
} from 'lucide-react';
import GalaxyCanvas from '../components/GalaxyCanvas';
import CosmicCursor from '../components/CosmicCursor';
import AdminDashboard from '../components/Admin/AdminDashboard';

export default function AdminPortalView({ onNavigateToPublic }) {
  const [adminToken, setAdminToken] = useState(null);
  const [adminUser, setAdminUser] = useState(null);

  // Login form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check stored auth session on mount
  useEffect(() => {
    const token = localStorage.getItem('galaxy_admin_token');
    const user = localStorage.getItem('galaxy_admin_user');
    if (token && user) {
      setAdminToken(token);
      try {
        setAdminUser(JSON.parse(user));
      } catch (e) {
        setAdminUser(null);
      }
    }
  }, []);

  const handleFillDemo = () => {
    setUsername('admin');
    setPassword('galaxy@2026');
    setError('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem('galaxy_admin_token', data.token);
        localStorage.setItem('galaxy_admin_user', JSON.stringify(data.user));
        setAdminToken(data.token);
        setAdminUser(data.user);
      } else {
        setError(data.message || 'Security clearance rejected.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Connection to celestial security service timed out.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('galaxy_admin_token');
    localStorage.removeItem('galaxy_admin_user');
    setAdminToken(null);
    setAdminUser(null);
  };

  // If authenticated, display full Admin Command Bridge
  if (adminToken && adminUser) {
    return (
      <AdminDashboard
        token={adminToken}
        user={adminUser}
        onLogout={handleLogout}
        onClose={onNavigateToPublic}
      />
    );
  }

  // If unauthenticated, display dedicated Admin Portal Login Screen
  return (
    <div 
      style={{ 
        minHeight: '100vh', 
        position: 'relative', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '2rem' 
      }}
    >
      <GalaxyCanvas />
      <CosmicCursor />

      {/* Return to Public Portfolio Button */}
      <button
        onClick={onNavigateToPublic}
        className="clickable"
        style={{
          position: 'fixed',
          top: '24px',
          left: '24px',
          zIndex: 100,
          background: 'rgba(255, 255, 255, 0.06)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '10px',
          padding: '0.6rem 1.1rem',
          color: 'var(--text-secondary)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontFamily: 'var(--font-heading)',
          fontSize: '0.85rem',
          transition: 'all 0.2s ease',
          backdropFilter: 'blur(10px)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#00f0ff';
          e.currentTarget.style.borderColor = 'rgba(0, 240, 255, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'var(--text-secondary)';
          e.currentTarget.style.borderColor = 'var(--border-subtle)';
        }}
      >
        <ArrowLeft size={16} />
        <span>Return to Public Portfolio</span>
      </button>

      {/* Admin Login Card */}
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '2.75rem',
          position: 'relative',
          zIndex: 10,
          border: '1px solid var(--border-cosmic)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.85), 0 0 40px rgba(0, 240, 255, 0.25)',
          backgroundColor: 'rgba(8, 12, 32, 0.96)',
          borderRadius: '20px'
        }}
      >
        {/* Security Badge Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '18px',
              background: 'linear-gradient(135deg, #00f0ff 0%, #7209b7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
              boxShadow: '0 0 30px rgba(0, 240, 255, 0.4)'
            }}
          >
            <ShieldCheck size={30} color="#050716" />
          </div>

          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#00f0ff', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
            // RESTRICTED ACCESS // PATH: /ADMIN
          </div>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            Admin Command Bridge
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Authenticate with cosmic credentials to access portfolio control systems.
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#fca5a5',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1.5rem'
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Commander Username
            </label>
            <div style={{ position: 'relative' }}>
              <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                required
                autoFocus
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="cosmic-input"
                style={{ paddingLeft: '2.6rem' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Clearance Passphrase
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="cosmic-input"
                style={{ paddingLeft: '2.6rem', paddingRight: '2.6rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="clickable"
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-cosmic-primary clickable"
            style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem', fontSize: '0.92rem' }}
          >
            {loading ? (
              <span>Authenticating Telemetry...</span>
            ) : (
              <>
                <Sparkles size={16} />
                <span>Authorize Clearance</span>
              </>
            )}
          </button>
        </form>

        {/* Demo Credentials Quick Fill */}
        <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', textAlign: 'center' }}>
          <button
            type="button"
            onClick={handleFillDemo}
            className="clickable"
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '0.45rem 0.9rem',
              color: 'var(--text-muted)',
              fontSize: '0.78rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#00f0ff'; e.currentTarget.style.borderColor = 'rgba(0,240,255,0.3)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
          >
            <KeyRound size={13} />
            <span>Load Demo Credentials (admin / galaxy@2026)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
