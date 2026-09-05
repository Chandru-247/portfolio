import React, { useState } from 'react';
import { 
  Sparkles, 
  ExternalLink, 
  Rocket, 
  Layers, 
  Star, 
  Eye, 
  Code2 
} from 'lucide-react';
import { Github } from './Icons';

export default function ProjectsSection({ projects = [], onSelectProject }) {
  const [activeFilter, setActiveFilter] = useState('All');

  const categories = ['All', 'Full Stack', 'Core CS / Systems', 'Backend'];

  const filteredProjects = activeFilter === 'All'
    ? projects
    : projects.filter(p => 
        p.category.toLowerCase().includes(activeFilter.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(activeFilter.toLowerCase()))
      );

  return (
    <section id="projects" style={{ padding: '6rem 0', position: 'relative', zIndex: 1 }}>
      <div className="container-cosmic">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-tag">
            <Sparkles size={14} /> MODULE 04 // EXPEDITIONS &amp; DEPLOYMENTS
          </div>
          <h2 className="section-title">
            <span className="text-gradient">Projects</span>
          </h2>
          <p className="section-subtitle">
            Engineered systems ranging from distributed astronomical telemetry to 3D algorithmic computational visualizers.
          </p>
        </div>

        {/* Category Filters */}
        <div 
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '0.6rem',
            marginBottom: '3rem'
          }}
        >
          {categories.map((filter) => {
            const isSelected = activeFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className="clickable"
                style={{
                  padding: '0.55rem 1.3rem',
                  borderRadius: '9999px',
                  border: isSelected ? '1px solid #00f0ff' : '1px solid rgba(255, 255, 255, 0.1)',
                  background: isSelected ? 'linear-gradient(135deg, rgba(0, 240, 255, 0.25), rgba(157, 78, 221, 0.25))' : 'rgba(10, 15, 36, 0.6)',
                  color: isSelected ? '#00f0ff' : 'var(--text-secondary)',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 0 15px rgba(0, 240, 255, 0.3)' : 'none'
                }}
              >
                {filter}
              </button>
            );
          })}
        </div>

        {/* Projects Grid */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '2rem'
          }}
        >
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="glass-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              {/* Project Image Preview Container */}
              <div 
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '210px',
                  overflow: 'hidden',
                  background: '#0a0e28'
                }}
              >
                <img
                  src={project.image || '/assets/project_galaxy_ai.png'}
                  alt={project.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                  onError={(e) => {
                    e.currentTarget.src = '/assets/project_galaxy_ai.png';
                  }}
                />

                {/* Dark gradient vignette */}
                <div 
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(10, 14, 38, 0.95) 0%, transparent 60%)',
                    pointerEvents: 'none'
                  }} 
                />

                {/* Badges Overlay */}
                <div 
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    display: 'flex',
                    gap: '0.5rem'
                  }}
                >
                  <span className="badge-pill badge-cyan" style={{ fontSize: '0.7rem' }}>
                    {project.category}
                  </span>
                  {project.featured && (
                    <span className="badge-pill badge-gold" style={{ fontSize: '0.7rem' }}>
                      <Star size={10} fill="#ffb703" /> Featured
                    </span>
                  )}
                </div>

                {/* Quick Inspect Button */}
                <button
                  onClick={() => onSelectProject(project)}
                  className="clickable"
                  title="View Mission Briefing"
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '12px',
                    background: 'rgba(5, 7, 22, 0.85)',
                    border: '1px solid var(--border-cosmic)',
                    color: '#00f0ff',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-mono)',
                    cursor: 'pointer',
                    backdropFilter: 'blur(8px)'
                  }}
                >
                  <Eye size={13} /> Inspect
                </button>
              </div>

              {/* Card Body */}
              <div 
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  flexGrow: 1,
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <h3 
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      marginBottom: '0.65rem',
                      lineHeight: 1.3
                    }}
                  >
                    {project.title}
                  </h3>

                  <p 
                    style={{
                      fontSize: '0.9rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.6,
                      marginBottom: '1.25rem'
                    }}
                  >
                    {project.description}
                  </p>
                </div>

                <div>
                  {/* Tech Stack Tags */}
                  <div 
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.4rem',
                      marginBottom: '1.5rem'
                    }}
                  >
                    {(project.tags || []).map((tag, i) => (
                      <span
                        key={i}
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.72rem',
                          padding: '0.2rem 0.55rem',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: '6px',
                          color: 'var(--text-secondary)'
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Links Row */}
                  <div 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                      paddingTop: '1rem'
                    }}
                  >
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      {project.githubUrl && project.githubUrl !== '#' && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="clickable"
                          title="Source Code"
                          style={{
                            color: 'var(--text-secondary)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            fontSize: '0.85rem',
                            textDecoration: 'none',
                            transition: 'color 0.2s'
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = '#00f0ff'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
                        >
                          <Github size={16} /> Code
                        </a>
                      )}

                      {project.liveUrl && project.liveUrl !== '#' && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="clickable"
                          title="Live Demo"
                          style={{
                            color: '#00f0ff',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            fontSize: '0.85rem',
                            textDecoration: 'none',
                            fontWeight: 600,
                            transition: 'color 0.2s'
                          }}
                        >
                          <ExternalLink size={16} /> Live Flight
                        </a>
                      )}
                    </div>

                    <button
                      onClick={() => onSelectProject(project)}
                      className="clickable"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--starlight-cyan)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
                    >
                      Briefing &gt;
                    </button>
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
