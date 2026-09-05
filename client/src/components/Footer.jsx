import React from 'react';
import { Sparkles, ArrowUp, ShieldCheck, Heart, Mail } from 'lucide-react';
import { Github, Linkedin } from './Icons';

export default function Footer({ profile }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer 
      style={{
        borderTop: '1px solid rgba(0, 240, 255, 0.15)',
        background: 'linear-gradient(to top, rgba(3, 4, 15, 0.95), rgba(5, 7, 22, 0.6))',
        padding: '4rem 0 2rem',
        position: 'relative',
        zIndex: 1
      }}
    >
      <div className="container-cosmic">
        <div 
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '2rem',
            marginBottom: '3rem'
          }}
        >
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.6rem' }}>
              <div 
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #00f0ff, #7209b7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Sparkles size={18} color="#050716" />
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.25rem', color: 'var(--text-primary)' }}>
                {(() => {
                  const parts = (profile?.name || 'CHANDRU R').trim().split(' ');
                  const first = parts[0] || 'CHANDRU';
                  const rest = parts.slice(1).join(' ');
                  return (
                    <>
                      {first} {rest && <span className="text-cyan">{rest}</span>}
                    </>
                  );
                })()}
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '380px' }}>
              Architecting stellar full-stack digital products, Java distributed engines, and futuristic user interfaces.
            </p>
          </div>

          {/* Actions Col */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={scrollToTop}
              className="clickable"
              title="Warp to Top"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: 'rgba(0, 240, 255, 0.1)',
                border: '1px solid var(--border-cosmic)',
                color: '#00f0ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 0 15px rgba(0, 240, 255, 0.2)'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <ArrowUp size={20} />
            </button>
          </div>
        </div>

        {/* Subfooter */}
        <div 
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            paddingTop: '1.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            fontSize: '0.85rem',
            color: 'var(--text-muted)'
          }}
        >
          <div>
            &copy; {new Date().getFullYear()} {profile?.name || 'Chandru R'}. Engineered with Cosmic Precision &amp; Modern React.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span>Powered by Star Dust &amp; Deep Thought</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
