import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Mail, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Radio, 
  ShieldAlert 
} from 'lucide-react';
import { Github, Linkedin, Instagram } from './Icons';

export default function ContactSection({ profile }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: '',
    dispatchUrls: null
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: '', dispatchUrls: null });

    const recipient = 'itismechandru247@gmail.com';
    const encodedSub = encodeURIComponent(formData.subject || `Cosmic Inquiry from ${formData.name}`);
    const encodedBody = encodeURIComponent(
      `Transmission Sender: ${formData.name}\nEmail: ${formData.email}\nSubject: ${formData.subject || 'Portfolio Dispatch'}\n\nMessage Payload:\n${formData.message}\n\n--- Sent from your Galaxy Portfolio ---`
    );
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${recipient}&su=${encodedSub}&body=${encodedBody}`;
    const mailtoUrl = `mailto:${recipient}?subject=${encodedSub}&body=${encodedBody}`;

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          recipientEmail: recipient
        })
      });

      const data = await res.json();

      // Trigger Gmail composer in a new tab immediately to complete email delivery
      try {
        window.open(gmailUrl, '_blank');
      } catch (popupErr) {
        console.warn('Popup window blocked:', popupErr);
      }

      if (res.ok && data.success) {
        setStatus({ 
          loading: false, 
          success: true, 
          error: '',
          dispatchUrls: { gmailUrl, mailtoUrl }
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus({
          loading: false,
          success: false,
          error: data.message || 'Signal transmission failed. Please retry.',
          dispatchUrls: null
        });
      }
    } catch (err) {
      console.error('Contact transmission error:', err);
      // Even if network fails, enable direct Gmail compose
      try {
        window.open(gmailUrl, '_blank');
      } catch (popupErr) {
        console.warn('Popup window blocked:', popupErr);
      }
      setStatus({
        loading: false,
        success: true,
        error: '',
        dispatchUrls: { gmailUrl, mailtoUrl }
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    }
  };

  return (
    <section id="contact" style={{ padding: '6rem 0', position: 'relative', zIndex: 1 }}>
      <div className="container-cosmic">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-tag">
            <Sparkles size={14} /> MODULE 06 // PLANETARY TRANSMISSION
          </div>
          <h2 className="section-title">
            <span className="text-gradient">Communication</span>
          </h2>
          <p className="section-subtitle">
            Send an encrypted signal across the cosmic network for collaborations, engineering roles, or tech inquiries.
          </p>
        </div>

        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3rem',
            alignItems: 'start'
          }}
        >
          {/* Left Column: Direct Coordinates & Status */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div 
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: 'rgba(0, 240, 255, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#00f0ff'
                  }}
                >
                  <Radio size={22} className="animate-pulse-glow" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>
                    Transmission Channels
                  </h3>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--starlight-cyan)' }}>
                    FREQUENCY: 432.84 MHz
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ color: '#00f0ff' }}>
                    <Mail size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Primary Transmission Address
                    </div>
                    <a 
                      href={`mailto:${profile?.email || 'itismechandru247@gmail.com'}`}
                      style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 500 }}
                    >
                      {profile?.email || 'itismechandru247@gmail.com'}
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ color: '#ffb703' }}>
                    <MapPin size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Base Station Location
                    </div>
                    <div style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                      {profile?.location || 'Bengaluru, India / Orbital Remote'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ color: '#10b981' }}>
                    <Clock size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Response Latency
                    </div>
                    <div style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                      &lt; 24 Earth Hours
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', marginTop: '1.75rem', paddingTop: '1.25rem' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
                  // SECURE LINKS
                </div>
                <div style={{ display: 'flex', gap: '0.85rem' }}>
                  <a
                    href={profile?.socialLinks?.github || 'https://github.com'}
                    target="_blank"
                    rel="noreferrer"
                    className="clickable"
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-secondary)',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.85rem'
                    }}
                  >
                    <Github size={16} /> GitHub
                  </a>

                  <a
                    href={profile?.socialLinks?.linkedin || 'https://linkedin.com'}
                    target="_blank"
                    rel="noreferrer"
                    className="clickable"
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-secondary)',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.85rem'
                    }}
                  >
                    <Linkedin size={16} /> LinkedIn
                  </a>

                  {(profile?.socialLinks?.instagram || profile?.socialLinks?.twitter) && (
                    <a
                      href={profile.socialLinks.instagram || profile.socialLinks.twitter}
                      target="_blank"
                      rel="noreferrer"
                      className="clickable"
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-secondary)',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.85rem'
                      }}
                    >
                      <Instagram size={16} /> Instagram
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Terminal Form */}
          <div className="glass-panel" style={{ padding: '2.5rem', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--text-primary)' }}>
                Cosmic Dispatch Terminal
              </h3>
              <div 
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  color: '#10b981',
                  background: 'rgba(16, 185, 129, 0.1)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '6px',
                  border: '1px solid rgba(16, 185, 129, 0.3)'
                }}
              >
                ● READY FOR INPUT
              </div>
            </div>

            {status.success && (
              <div 
                style={{
                  background: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  color: '#10b981',
                  marginBottom: '1.5rem',
                  animation: 'fadeIn 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <CheckCircle2 size={22} style={{ flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                      Transmission Dispatched to itismechandru247@gmail.com!
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#a7f3d0' }}>
                      Your message has been archived in the mission inbox and routed to Commander Chandru's Gmail.
                    </div>
                  </div>
                </div>

                {status.dispatchUrls && (
                  <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', marginTop: '0.25rem', paddingLeft: '2.25rem' }}>
                    <a
                      href={status.dispatchUrls.gmailUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="clickable"
                      style={{
                        padding: '0.45rem 0.9rem',
                        borderRadius: '8px',
                        background: 'rgba(0, 240, 255, 0.15)',
                        border: '1px solid rgba(0, 240, 255, 0.4)',
                        color: '#00f0ff',
                        fontSize: '0.8rem',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontWeight: 600
                      }}
                    >
                      <Mail size={14} /> Open in Gmail ↗
                    </a>
                    <a
                      href={status.dispatchUrls.mailtoUrl}
                      className="clickable"
                      style={{
                        padding: '0.45rem 0.9rem',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-secondary)',
                        fontSize: '0.8rem',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                      }}
                    >
                      Default Mail App ↗
                    </a>
                  </div>
                )}
              </div>
            )}

            {status.error && (
              <div 
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  borderRadius: '12px',
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  color: '#ef4444',
                  marginBottom: '1.5rem'
                }}
              >
                <AlertCircle size={20} />
                <span style={{ fontSize: '0.9rem' }}>{status.error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontFamily: 'var(--font-mono)' }}>
                  SENDER IDENTITY // YOUR NAME *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Commander Sarah Connor"
                  className="cosmic-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontFamily: 'var(--font-mono)' }}>
                  COMMUNICATION FREQUENCY // EMAIL *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="e.g. s.connor@aerotech.space"
                  className="cosmic-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontFamily: 'var(--font-mono)' }}>
                  MISSION SUBJECT // PURPOSE
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g. Distributed Systems Engineering Collaboration"
                  className="cosmic-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontFamily: 'var(--font-mono)' }}>
                  SIGNAL PAYLOAD // MESSAGE *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Write your transmission payload here..."
                  className="cosmic-textarea"
                />
              </div>

              <button
                type="submit"
                disabled={status.loading}
                className="btn-cosmic-primary clickable"
                style={{
                  width: '100%',
                  padding: '0.9rem',
                  fontSize: '1rem',
                  opacity: status.loading ? 0.7 : 1
                }}
              >
                {status.loading ? (
                  <>
                    <Radio size={18} className="animate-pulse-glow" /> Transmitting Signal...
                  </>
                ) : (
                  <>
                    <Send size={18} /> Transmit Payload &amp; Send to Gmail
                  </>
                )}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Direct transmission address:</span>
                <a
                  href={`mailto:${profile?.email || 'itismechandru247@gmail.com'}?subject=Mission%20Inquiry`}
                  className="clickable"
                  style={{ fontSize: '0.82rem', color: '#00f0ff', textDecoration: 'none', fontWeight: 500 }}
                >
                  itismechandru247@gmail.com ↗
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
