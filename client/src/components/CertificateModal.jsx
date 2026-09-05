import React from 'react';
import { X, ExternalLink, Download, ShieldCheck, Calendar, Award } from 'lucide-react';

export default function CertificateModal({ certificate, onClose }) {
  if (!certificate) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="glass-panel clickable" 
        style={{
          width: '100%',
          maxWidth: '820px',
          maxHeight: '92vh',
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
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#ffb703' }}>
          <ShieldCheck size={20} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', letterSpacing: '0.1em' }}>
            VERIFIED CREDENTIAL PREVIEW
          </span>
        </div>

        <h2 style={{ fontSize: '1.6rem', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
          {certificate.title}
        </h2>
        <div style={{ fontSize: '1rem', color: 'var(--starlight-cyan)', fontWeight: 600, marginBottom: '1.5rem' }}>
          Issued by {certificate.issuer}
        </div>

        {/* Certificate High-Res Image Frame */}
        <div 
          style={{
            width: '100%',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '2px solid rgba(255, 183, 3, 0.3)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
            marginBottom: '1.75rem'
          }}
        >
          <img
            src={certificate.image || '/assets/cert_cloud_architect.png'}
            alt={certificate.title}
            style={{ width: '100%', display: 'block', maxHeight: '480px', objectFit: 'contain', backgroundColor: '#050716' }}
            onError={(e) => { e.currentTarget.src = '/assets/cert_cloud_architect.png'; }}
          />
        </div>

        {/* Credential Data Metadata */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            padding: '1.25rem',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '12px',
            marginBottom: '1.75rem'
          }}
        >
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ISSUE DATE</div>
            <div style={{ color: 'var(--text-primary)', fontWeight: 600, marginTop: '0.2rem' }}>
              {certificate.issueDate || 'N/A'}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CREDENTIAL ID</div>
            <div style={{ color: '#00f0ff', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
              {certificate.credentialId || 'N/A'}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>VALIDITY</div>
            <div style={{ color: '#10b981', fontWeight: 600, marginTop: '0.2rem' }}>
              {certificate.expiryDate || 'Lifetime Accreditation'}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1.25rem' }}>
          {certificate.downloadUrl && (
            <a
              href={certificate.downloadUrl}
              download
              className="btn-cosmic-primary clickable"
            >
              <Download size={18} /> Download Certificate
            </a>
          )}

          {certificate.credentialUrl && certificate.credentialUrl !== '#' && (
            <a
              href={certificate.credentialUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-cosmic-secondary clickable"
            >
              <ExternalLink size={18} /> Verify via Authority
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
