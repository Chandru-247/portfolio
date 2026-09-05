import React from 'react';
import { X, ExternalLink, Sparkles, CheckCircle2, Layers } from 'lucide-react';
import { Github } from './Icons';

export default function ProjectModal({ project, onClose }) {
  if (!project) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="glass-panel clickable" 
        style={{
          width: '100%',
          maxWidth: '750px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '2.5rem',
          position: 'relative',
          border: '1px solid var(--border-cosmic)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.8), 0 0 40px rgba(0, 240, 255, 0.25)',
          backgroundColor: 'rgba(8, 12, 32, 0.95)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="clickable"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '50%',
            width: '38px',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#ff4d4f'; e.currentTarget.style.background = 'rgba(255, 77, 79, 0.15)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; }}
        >
          <X size={20} />
        </button>

        {/* Category & Badge */}
        <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1rem' }}>
          <span className="badge-pill badge-cyan">{project.category}</span>
          {project.featured && <span className="badge-pill badge-gold">Featured Mission</span>}
        </div>

        {/* Title */}
        <h2 style={{ fontSize: '1.75rem', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
          {project.title}
        </h2>

        {/* Image Preview */}
        <div 
          style={{
            width: '100%',
            height: '320px',
            borderRadius: '16px',
            overflow: 'hidden',
            marginBottom: '1.75rem',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <img
            src={project.image || '/assets/project_galaxy_ai.png'}
            alt={project.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => { e.currentTarget.src = '/assets/project_galaxy_ai.png'; }}
          />
        </div>

        {/* Tech Stack */}
        <div style={{ marginBottom: '1.75rem' }}>
          <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--starlight-cyan)', marginBottom: '0.6rem' }}>
            // TECH STACK ARCHITECTURE
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {(project.tags || []).map((tag, idx) => (
              <span
                key={idx}
                style={{
                  padding: '0.35rem 0.8rem',
                  borderRadius: '8px',
                  background: 'rgba(0, 240, 255, 0.1)',
                  border: '1px solid rgba(0, 240, 255, 0.3)',
                  color: '#00f0ff',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem'
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Detailed Description */}
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--starlight-cyan)', marginBottom: '0.6rem' }}>
            // MISSION OVERVIEW &amp; IMPACT
          </h4>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1rem', whiteSpace: 'pre-line' }}>
            {project.longDescription || project.description}
          </p>
        </div>

        {/* Action CTAs */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1.5rem' }}>
          {project.liveUrl && project.liveUrl !== '#' && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-cosmic-primary clickable"
            >
              <ExternalLink size={18} />
              <span>Launch Live Flight</span>
            </a>
          )}

          {project.githubUrl && project.githubUrl !== '#' && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-cosmic-secondary clickable"
            >
              <Github size={18} />
              <span>Inspect Source Code</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
