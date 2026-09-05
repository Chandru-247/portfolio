import React from 'react';
import { 
  Sparkles, 
  Award, 
  ExternalLink, 
  Download, 
  Eye, 
  ShieldCheck, 
  Calendar 
} from 'lucide-react';

export default function CertificatesSection({ certificates = [], onSelectCertificate }) {
  return (
    <section id="certificates" style={{ padding: '6rem 0', position: 'relative', zIndex: 1 }}>
      <div className="container-cosmic">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-tag">
            <Sparkles size={14} /> MODULE 05 // CREDENTIALS &amp; ACCREDITATIONS
          </div>
          <h2 className="section-title">
            Certifications &amp; <span className="text-gradient">Honors</span>
          </h2>
          <p className="section-subtitle">
            Industry-recognized validations across cloud systems, algorithmic problem solving, and modern frontend engineering.
          </p>
        </div>

        {/* Certificates Grid */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '2rem'
          }}
        >
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="glass-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              {/* Preview image */}
              <div 
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '190px',
                  background: '#070b1e',
                  overflow: 'hidden',
                  cursor: 'pointer'
                }}
                onClick={() => onSelectCertificate(cert)}
              >
                <img
                  src={cert.image || '/assets/cert_cloud_architect.png'}
                  alt={cert.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.4s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                  onError={(e) => {
                    e.currentTarget.src = '/assets/cert_cloud_architect.png';
                  }}
                />

                <div 
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(5, 7, 22, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    transition: 'opacity 0.2s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = '0'; }}
                >
                  <span className="btn-cosmic-primary" style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem' }}>
                    <Eye size={14} /> Zoom Certificate
                  </span>
                </div>

                <div 
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'rgba(5, 7, 22, 0.85)',
                    padding: '0.3rem 0.65rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 183, 3, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    color: '#ffb703',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.7rem'
                  }}
                >
                  <ShieldCheck size={13} /> VERIFIED
                </div>
              </div>

              {/* Certificate Details */}
              <div 
                style={{
                  padding: '1.4rem',
                  display: 'flex',
                  flexDirection: 'column',
                  flexGrow: 1,
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
                    {cert.title}
                  </h3>

                  <div style={{ color: 'var(--starlight-cyan)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.8rem' }}>
                    {cert.issuer}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Calendar size={13} /> Issued: {cert.issueDate}
                    </div>
                    <div>
                      ID: <span style={{ color: 'var(--text-secondary)' }}>{cert.credentialId}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '1.5rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                    paddingTop: '0.9rem'
                  }}
                >
                  <button
                    onClick={() => onSelectCertificate(cert)}
                    className="clickable btn-cosmic-outline"
                    style={{ fontSize: '0.8rem', padding: '0.45rem 0.9rem' }}
                  >
                    <Eye size={14} /> Preview
                  </button>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {cert.downloadUrl && (
                      <a
                        href={cert.downloadUrl}
                        download
                        className="clickable"
                        title="Download Certificate"
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid var(--border-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--text-secondary)'
                        }}
                      >
                        <Download size={14} />
                      </a>
                    )}

                    {cert.credentialUrl && cert.credentialUrl !== '#' && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="clickable"
                        title="Verify Online"
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: 'rgba(0, 240, 255, 0.1)',
                          border: '1px solid var(--border-cosmic)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#00f0ff'
                        }}
                      >
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
