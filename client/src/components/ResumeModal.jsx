import React from 'react';
import { X, Download, FileText, ExternalLink, Calendar, HardDrive, CheckCircle2, Eye } from 'lucide-react';

export default function ResumeModal({ resume, profile, onClose }) {
  if (!resume) return null;

  const rawName = profile?.name || 'CHANDRU R';
  const cleanName = rawName.trim().replace(/[^a-zA-Z0-9_-]/g, '_');
  const defaultTitle = `${cleanName}_Software_Engineer_Resume.pdf`;
  const displayTitle = (resume.title && !resume.title.includes('Alex_Vance'))
    ? resume.title
    : defaultTitle;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/api/resume/download';
    link.setAttribute('download', displayTitle);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="glass-panel clickable" 
        style={{
          width: '100%',
          maxWidth: '540px',
          padding: '2.5rem',
          position: 'relative',
          border: '1px solid var(--border-cosmic)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.8), 0 0 35px rgba(0, 240, 255, 0.25)',
          backgroundColor: 'rgba(8, 12, 32, 0.95)',
          textAlign: 'center'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="clickable"
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        {/* Icon Header */}
        <div 
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #00f0ff 0%, #7209b7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
            boxShadow: '0 0 25px rgba(0, 240, 255, 0.4)'
          }}
        >
          <FileText size={32} color="#030712" />
        </div>

        <h3 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
          {rawName} — Curriculum Vitae
        </h3>
        <p style={{ color: '#00f0ff', fontSize: '0.88rem', fontFamily: 'var(--font-mono)', marginBottom: '1.5rem', wordBreak: 'break-all' }}>
          {displayTitle}
        </p>

        {/* Metadata Details */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '0.75rem',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '12px',
            padding: '1rem',
            marginBottom: '1.75rem',
            textAlign: 'left'
          }}
        >
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>FILE FORMAT</div>
            <div style={{ color: '#00f0ff', fontWeight: 600, fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
              Adobe PDF (Vector)
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ARCHIVE SIZE</div>
            <div style={{ color: 'var(--text-primary)', fontWeight: 600, fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
              {resume.fileSize || '4.4 KB'}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>REVISION DATE</div>
            <div style={{ color: 'var(--text-primary)', fontSize: '0.85rem' }}>
              {resume.lastUpdated ? new Date(resume.lastUpdated).toLocaleDateString() : 'September 2026'}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>VERIFICATION</div>
            <div style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }}>
              <CheckCircle2 size={13} /> Validated PDF
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <a
            href="/api/resume/download"
            download={displayTitle}
            className="btn-cosmic-primary clickable"
            style={{ 
              width: '100%', 
              padding: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              textDecoration: 'none',
              cursor: 'pointer'
            }}
          >
            <Download size={18} /> Download Verified Resume PDF
          </a>

          <a
            href="/api/resume/view"
            target="_blank"
            rel="noreferrer"
            className="btn-cosmic-secondary clickable"
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              textDecoration: 'none',
              cursor: 'pointer'
            }}
          >
            <Eye size={16} /> Preview Resume in Browser
          </a>

          {resume.externalUrl && (
            <a
              href={resume.externalUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-cosmic-secondary clickable"
              style={{ width: '100%', padding: '0.75rem', fontSize: '0.88rem', textDecoration: 'none' }}
            >
              <ExternalLink size={16} /> View External Mirror
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
