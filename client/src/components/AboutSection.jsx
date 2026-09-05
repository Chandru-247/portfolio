import React, { useState } from 'react';
import { 
  GraduationCap, 
  Target, 
  Compass, 
  Cpu, 
  CheckCircle, 
  Award, 
  GitCommit, 
  FolderKanban, 
  Binary, 
  Sparkles 
} from 'lucide-react';

export default function AboutSection({ profile }) {
  const [activeTab, setActiveTab] = useState('education');

  const stats = profile?.stats || {
    projectsCompleted: 24,
    gitCommits: '1.2K+',
    algorithmsSolved: '650+',
    certificationsEarned: 6
  };

  const educationList = profile?.education || [];
  const careerGoals = profile?.careerGoals || [];

  return (
    <section id="about" style={{ padding: '6rem 0', position: 'relative', zIndex: 1 }}>
      <div className="container-cosmic">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-tag">
            <Sparkles size={14} /> MODULE 02 // BIOGRAPHICAL TELEMETRY
          </div>
          <h2 className="section-title">
            About <span className="text-gradient">{profile?.name || 'Chandru R'}</span>
          </h2>
          <p className="section-subtitle">
            Bridging fundamental computer science theory with modern high-velocity distributed engineering.
          </p>
        </div>

        {/* Live Mission Statistics Bar */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.25rem',
            marginBottom: '3.5rem'
          }}
        >
          <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', padding: '0.6rem', borderRadius: '12px', background: 'rgba(0, 240, 255, 0.1)', color: '#00f0ff', marginBottom: '0.5rem' }}>
              <FolderKanban size={24} />
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 700, color: '#00f0ff' }}>
              {stats.projectsCompleted}+
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Projects Delivered
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', padding: '0.6rem', borderRadius: '12px', background: 'rgba(157, 78, 221, 0.15)', color: '#9d4edd', marginBottom: '0.5rem' }}>
              <GitCommit size={24} />
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 700, color: '#c77dff' }}>
              {stats.gitCommits}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Git Commits Logged
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', padding: '0.6rem', borderRadius: '12px', background: 'rgba(247, 37, 133, 0.12)', color: '#f72585', marginBottom: '0.5rem' }}>
              <Binary size={24} />
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 700, color: '#f72585' }}>
              {stats.algorithmsSolved}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              DSA Problems Solved
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', padding: '0.6rem', borderRadius: '12px', background: 'rgba(255, 183, 3, 0.12)', color: '#ffb703', marginBottom: '0.5rem' }}>
              <Award size={24} />
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 700, color: '#ffb703' }}>
              {stats.certificationsEarned}+
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Verified Certifications
            </div>
          </div>
        </div>

        {/* Narrative & Tabbed Details Container */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
            alignItems: 'start'
          }}
        >
          {/* Left: Bio Narrative & Core Philosophy */}
          <div className="glass-panel" style={{ padding: '2.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div 
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'rgba(0, 240, 255, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#00f0ff'
                }}
              >
                <Compass size={20} />
              </div>
              <h3 style={{ fontSize: '1.4rem' }}>Trajectory &amp; Focus</h3>
            </div>

            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
              {profile?.bio || 'Passionate software engineer specializing in scalable full-stack applications, Java system design, and algorithmic problem solving. Inspired by space exploration, I design software with the same precision, resilience, and curiosity required for interplanetary flight.'}
            </p>

            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1.5rem' }}>
              <h4 style={{ fontSize: '1rem', color: 'var(--starlight-cyan)', marginBottom: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                // CORE PRINCIPLES
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                  <CheckCircle size={16} color="#00f0ff" />
                  <span><strong>Clean Architecture:</strong> Modularity, SOLID principles, and low coupling.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                  <CheckCircle size={16} color="#00f0ff" />
                  <span><strong>Performance First:</strong> Optimized time/space complexities and rapid UX rendering.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                  <CheckCircle size={16} color="#00f0ff" />
                  <span><strong>Continuous Discovery:</strong> Exploring cutting-edge cloud stacks and aerospace computing.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right: Tabbed Education and Career Goals */}
          <div className="glass-panel" style={{ padding: '2.25rem' }}>
            {/* Tab Selector Buttons */}
            <div 
              style={{
                display: 'flex',
                gap: '0.5rem',
                background: 'rgba(5, 8, 24, 0.8)',
                padding: '0.35rem',
                borderRadius: '12px',
                marginBottom: '1.75rem'
              }}
            >
              <button
                onClick={() => setActiveTab('education')}
                className="clickable"
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.65rem 1rem',
                  borderRadius: '10px',
                  border: 'none',
                  background: activeTab === 'education' ? 'linear-gradient(135deg, #00f0ff, #00b4d8)' : 'transparent',
                  color: activeTab === 'education' ? '#030712' : 'var(--text-secondary)',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <GraduationCap size={18} />
                <span>Academic Journey</span>
              </button>

              <button
                onClick={() => setActiveTab('goals')}
                className="clickable"
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.65rem 1rem',
                  borderRadius: '10px',
                  border: 'none',
                  background: activeTab === 'goals' ? 'linear-gradient(135deg, #f72585, #7209b7)' : 'transparent',
                  color: activeTab === 'goals' ? '#ffffff' : 'var(--text-secondary)',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <Target size={18} />
                <span>Career Milestones</span>
              </button>
            </div>

            {/* Tab Content: Academic Journey */}
            {activeTab === 'education' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {educationList.map((edu, idx) => (
                  <div 
                    key={edu.id || idx}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderLeft: edu.status === 'Currently Pursuing' ? '3px solid #00f0ff' : '3px solid rgba(0, 240, 255, 0.4)',
                      padding: '1.35rem',
                      borderRadius: '0 14px 14px 0',
                      boxShadow: edu.status === 'Currently Pursuing' ? '0 0 20px rgba(0, 240, 255, 0.12)' : 'none',
                      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                      borderRight: '1px solid rgba(255, 255, 255, 0.05)',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                    }}
                  >
                    {/* Top row: Badges */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.6rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {edu.type && (
                          <span style={{ 
                            fontSize: '0.72rem', 
                            padding: '0.2rem 0.55rem', 
                            borderRadius: '6px', 
                            background: 'rgba(255, 255, 255, 0.06)', 
                            color: 'var(--text-secondary)',
                            fontFamily: 'var(--font-mono)'
                          }}>
                            {edu.type}
                          </span>
                        )}
                        {edu.status === 'Currently Pursuing' ? (
                          <span style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: '0.35rem', 
                            fontSize: '0.72rem', 
                            padding: '0.2rem 0.6rem', 
                            borderRadius: '6px', 
                            background: 'rgba(0, 240, 255, 0.12)', 
                            border: '1px solid rgba(0, 240, 255, 0.3)',
                            color: '#00f0ff',
                            fontWeight: 600
                          }}>
                            <span className="pulsing-dot" /> CURRENTLY PURSUING
                          </span>
                        ) : (
                          <span style={{ 
                            fontSize: '0.7rem', 
                            padding: '0.15rem 0.5rem', 
                            borderRadius: '6px', 
                            background: 'rgba(16, 185, 129, 0.1)', 
                            color: '#10b981',
                            border: '1px solid rgba(16, 185, 129, 0.25)',
                            fontWeight: 500
                          }}>
                            ✓ COMPLETED
                          </span>
                        )}
                      </div>

                      <span className="badge-pill badge-cyan" style={{ fontSize: '0.72rem' }}>
                        {edu.period}
                      </span>
                    </div>

                    {/* Degree / Standard Name */}
                    <h4 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                      {edu.degree}
                    </h4>

                    {/* School / College */}
                    <div style={{ color: 'var(--starlight-cyan)', fontSize: '0.95rem', fontWeight: 500, marginBottom: '0.65rem' }}>
                      {edu.institution}
                    </div>

                    {/* Grade / Score Badge (CGPA or Percentage) */}
                    {edu.grade && (
                      <div style={{ marginBottom: '0.65rem' }}>
                        <div 
                          style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: '0.45rem', 
                            padding: '0.35rem 0.75rem', 
                            borderRadius: '8px', 
                            background: 'rgba(255, 183, 3, 0.1)', 
                            border: '1px solid rgba(255, 183, 3, 0.35)', 
                            color: '#ffb703', 
                            fontFamily: 'var(--font-mono)', 
                            fontWeight: 600, 
                            fontSize: '0.85rem' 
                          }}
                        >
                          <Award size={14} color="#ffb703" />
                          <span>{edu.grade}</span>
                        </div>
                      </div>
                    )}

                    {/* Highlights */}
                    {edu.highlights && (
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        {edu.highlights}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Tab Content: Career Goals & Milestones */}
            {activeTab === 'goals' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {careerGoals.map((goal, idx) => (
                  <div 
                    key={goal.id || idx}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderLeft: goal.status === 'Currently Pursuing' ? '3px solid #f72585' : '3px solid rgba(247, 37, 133, 0.4)',
                      padding: '1.35rem',
                      borderRadius: '0 14px 14px 0',
                      boxShadow: goal.status === 'Currently Pursuing' ? '0 0 20px rgba(247, 37, 133, 0.15)' : 'none',
                      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                      borderRight: '1px solid rgba(255, 255, 255, 0.05)',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Target size={16} color="#f72585" />
                        <h4 style={{ fontSize: '1.05rem', color: '#f72585', margin: 0 }}>
                          {goal.title}
                        </h4>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        {goal.status === 'Currently Pursuing' ? (
                          <span style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: '0.35rem', 
                            fontSize: '0.72rem', 
                            padding: '0.2rem 0.6rem', 
                            borderRadius: '6px', 
                            background: 'rgba(247, 37, 133, 0.12)', 
                            border: '1px solid rgba(247, 37, 133, 0.3)',
                            color: '#f72585',
                            fontWeight: 600
                          }}>
                            <span className="pulsing-dot-magenta" /> ACTIVE PURSUIT
                          </span>
                        ) : (
                          <span style={{ 
                            fontSize: '0.7rem', 
                            padding: '0.15rem 0.5rem', 
                            borderRadius: '6px', 
                            background: 'rgba(255, 255, 255, 0.06)', 
                            color: 'var(--text-muted)' 
                          }}>
                            {goal.status || 'Milestone'}
                          </span>
                        )}
                        {goal.period && (
                          <span className="badge-pill badge-purple" style={{ fontSize: '0.7rem' }}>
                            {goal.period}
                          </span>
                        )}
                      </div>
                    </div>

                    <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      {goal.goal}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
