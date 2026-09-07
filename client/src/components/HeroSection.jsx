import React, { useState, useEffect } from 'react';
import { 
  Rocket, 
  Download, 
  Send, 
  Mail, 
  Compass, 
  CheckCircle2, 
  Sparkles, 
  Layers 
} from 'lucide-react';
import { Github, Linkedin, Instagram } from './Icons';

export default function HeroSection({ profile, onDownloadResume, onExploreProjects }) {
  const [typedText, setTypedText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(120);

  const words = profile?.typingWords && profile.typingWords.length > 0
    ? profile.typingWords
    : ['Full-Stack Developer', 'Java & DSA Specialist', 'Cosmic UI Designer', 'Distributed Systems'];

  useEffect(() => {
    const currentWord = words[wordIndex % words.length];

    const handleType = () => {
      if (!isDeleting) {
        setTypedText(currentWord.substring(0, typedText.length + 1));
        setTypingSpeed(100);

        if (typedText === currentWord) {
          setTimeout(() => setIsDeleting(true), 1600);
        }
      } else {
        setTypedText(currentWord.substring(0, typedText.length - 1));
        setTypingSpeed(50);

        if (typedText === '') {
          setIsDeleting(false);
          setWordIndex((prev) => prev + 1);
          setTypingSpeed(300);
        }
      }
    };

    const timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [typedText, isDeleting, wordIndex, words, typingSpeed]);

  const socialLinks = profile?.socialLinks || {};

  return (
    <section 
      id="home" 
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        paddingTop: '6rem',
        paddingBottom: '4rem',
        position: 'relative',
        zIndex: 1
      }}
    >
      <div className="container-cosmic" style={{ width: '100%' }}>
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3.5rem',
            alignItems: 'center'
          }}
        >
          {/* Left Column: Introductions & CTAs */}
          <div>
            {/* Mission Availability Pill */}
            <div 
              className="badge-pill badge-cyan"
              style={{ marginBottom: '1.25rem', width: 'fit-content' }}
            >
              <span 
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#00f0ff',
                  boxShadow: '0 0 8px #00f0ff',
                  display: 'inline-block'
                }} 
              />
              <span>{profile?.statusText || 'Available for Space-Tech Opportunities'}</span>
            </div>

            {/* Main Greeting */}
            <h1 
              style={{
                fontSize: 'clamp(2.4rem, 5.2vw, 4rem)',
                marginBottom: '0.75rem',
                lineHeight: 1.15
              }}
            >
              Hello, I am <br />
              <span className="text-gradient">
                {profile?.name || 'CHANDRU R'}
              </span>
            </h1>

            {/* Dynamic Typing Title */}
            <div 
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'clamp(1.1rem, 2.5vw, 1.6rem)',
                color: 'var(--starlight-cyan)',
                minHeight: '2.4rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.2rem',
                marginBottom: '1.25rem'
              }}
            >
              <span>&gt; {typedText}</span>
              <span 
                style={{
                  display: 'inline-block',
                  width: '3px',
                  height: '1.4em',
                  background: 'var(--solar-magenta)',
                  animation: 'pulseGlow 0.8s infinite',
                  boxShadow: '0 0 8px var(--solar-magenta)'
                }} 
              />
            </div>

            {/* Subheadline / Intro */}
            <p 
              style={{
                fontSize: '1.1rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
                marginBottom: '2.2rem',
                maxWidth: '560px'
              }}
            >
              {profile?.subheadline || 'Building high-performance distributed systems, Java algorithmic solutions, and immersive galaxy-themed web applications.'}
            </p>

            {/* CTA Buttons */}
            <div 
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem',
                marginBottom: '2.5rem'
              }}
            >
              <button
                onClick={onExploreProjects}
                className="btn-cosmic-primary clickable"
              >
                <Rocket size={18} />
                <span>Explore Projects</span>
              </button>

              <button
                onClick={onDownloadResume}
                className="btn-cosmic-secondary clickable"
              >
                <Download size={18} />
                <span>Download Resume</span>
              </button>

              <a
                href="#contact"
                className="btn-cosmic-outline clickable"
              >
                <Send size={16} />
                <span>Transmit Signal</span>
              </a>
            </div>

            {/* Social Coordinates Links */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                COORDINATES //
              </span>

              {socialLinks.github && (
                <a
                  href={socialLinks.github}
                  target="_blank"
                  rel="noreferrer"
                  className="clickable"
                  title="GitHub Profile"
                  style={{
                    color: 'var(--text-secondary)',
                    transition: 'color 0.2s, transform 0.2s',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#00f0ff'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <Github size={20} />
                </a>
              )}

              {socialLinks.linkedin && (
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="clickable"
                  title="LinkedIn Profile"
                  style={{
                    color: 'var(--text-secondary)',
                    transition: 'color 0.2s, transform 0.2s',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#00f0ff'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <Linkedin size={20} />
                </a>
              )}

              {(socialLinks.instagram || socialLinks.twitter) && (
                <a
                  href={socialLinks.instagram || socialLinks.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="clickable"
                  title="Instagram"
                  style={{
                    color: 'var(--text-secondary)',
                    transition: 'color 0.2s, transform 0.2s',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#e1306c'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <Instagram size={20} />
                </a>
              )}

              {socialLinks.email && (
                <a
                  href={socialLinks.email}
                  className="clickable"
                  title="Email Direct"
                  style={{
                    color: 'var(--text-secondary)',
                    transition: 'color 0.2s, transform 0.2s',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#00f0ff'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <Mail size={20} />
                </a>
              )}
            </div>
          </div>

          {/* Right Column: Holographic Astronaut Avatar & Orbital Badges */}
          <div 
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative'
            }}
          >
            {/* Ambient Background Glow */}
            <div 
              style={{
                position: 'absolute',
                width: '380px',
                height: '380px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(0, 240, 255, 0.25) 0%, rgba(157, 78, 221, 0.15) 50%, transparent 70%)',
                filter: 'blur(30px)',
                zIndex: 0
              }} 
            />

            {/* Orbit Ring 1 */}
            <div 
              style={{
                position: 'absolute',
                width: '420px',
                height: '420px',
                borderRadius: '50%',
                border: '1px dashed rgba(0, 240, 255, 0.35)',
                animation: 'orbitSpin 35s linear infinite',
                pointerEvents: 'none'
              }}
            >
              <div 
                style={{
                  position: 'absolute',
                  top: '-8px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: '#00f0ff',
                  boxShadow: '0 0 12px #00f0ff'
                }} 
              />
            </div>

            {/* Orbit Ring 2 */}
            <div 
              style={{
                position: 'absolute',
                width: '490px',
                height: '490px',
                borderRadius: '50%',
                border: '1px dotted rgba(247, 37, 133, 0.25)',
                animation: 'orbitSpin 45s linear infinite reverse',
                pointerEvents: 'none'
              }}
            >
              <div 
                style={{
                  position: 'absolute',
                  bottom: '-6px',
                  left: '30%',
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: '#f72585',
                  boxShadow: '0 0 10px #f72585'
                }} 
              />
            </div>

            {/* Central Avatar Frame */}
            <div 
              className="animate-float"
              style={{
                position: 'relative',
                zIndex: 2,
                width: '320px',
                height: '320px',
                borderRadius: '30px',
                padding: '6px',
                background: 'linear-gradient(135deg, #00f0ff, #7209b7, #f72585)',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(0, 240, 255, 0.3)'
              }}
            >
              <div 
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '26px',
                  overflow: 'hidden',
                  position: 'relative',
                  backgroundColor: '#070a20'
                }}
              >
                <img
                  src={profile?.avatar || '/assets/avatar_cosmic.png'}
                  alt={profile?.name || 'CHANDRU R Avatar'}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: profile?.avatarPosition || 'center 85%',
                    display: 'block'
                  }}
                  onError={(e) => {
                    // Fallback to placeholder if missing
                    e.currentTarget.src = '/assets/avatar_cosmic.png';
                  }}
                />

                {/* Cyber HUD overlay line */}
                <div 
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '0.75rem 1rem',
                    background: 'linear-gradient(to top, rgba(5, 7, 22, 0.95), transparent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#00f0ff' }}>
                    PILOT // ID: {profile?.pilotId || (profile?.name ? profile.name.split(' ').map(n=>n[0]).join('') + '-247' : 'CR-247')}
                  </span>
                  <span className="badge-pill badge-green" style={{ fontSize: '0.65rem' }}>
                    ONLINE
                  </span>
                </div>
              </div>

              {/* Floating Floating Badge 1: DSA Mastery */}
              <div 
                className="glass-panel"
                style={{
                  position: 'absolute',
                  top: '-15px',
                  right: '-25px',
                  padding: '0.6rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(0, 240, 255, 0.4)',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                  backgroundColor: 'rgba(10, 15, 38, 0.9)'
                }}
              >
                <Sparkles size={16} color="#00f0ff" />
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '0.85rem' }}>
                  Java &amp; DSA Pro
                </span>
              </div>

              {/* Floating Badge 2: Full-Stack Systems */}
              <div 
                className="glass-panel"
                style={{
                  position: 'absolute',
                  bottom: '-20px',
                  left: '-25px',
                  padding: '0.6rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(247, 37, 133, 0.4)',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                  backgroundColor: 'rgba(10, 15, 38, 0.9)'
                }}
              >
                <Layers size={16} color="#f72585" />
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '0.85rem' }}>
                  MERN &amp; Cloud Ready
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
