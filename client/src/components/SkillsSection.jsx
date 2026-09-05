import React, { useState } from 'react';
import { 
  Sparkles, 
  Code, 
  Coffee, 
  Binary, 
  Box, 
  Layers, 
  Database, 
  Atom, 
  Layout, 
  Palette, 
  Wind, 
  Server, 
  Radio, 
  HardDrive, 
  Share2, 
  GitBranch, 
  Monitor, 
  Package, 
  Send,
  Terminal,
  Cpu,
  FileCode
} from 'lucide-react';

export default function SkillsSection({ skills = [] }) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Dynamic category list
  const categories = ['All', ...new Set(skills.map((s) => s.category))];

  const filteredSkills = selectedCategory === 'All'
    ? skills
    : skills.filter((s) => s.category.toLowerCase() === selectedCategory.toLowerCase());

  // Icon mapping helper
  const getSkillIcon = (iconName) => {
    switch (iconName) {
      case 'Coffee': return <Coffee size={20} />;
      case 'Binary': return <Binary size={20} />;
      case 'Box': return <Box size={20} />;
      case 'Layers': return <Layers size={20} />;
      case 'Database': return <Database size={20} />;
      case 'Atom': return <Atom size={20} />;
      case 'Layout': return <Layout size={20} />;
      case 'Palette': return <Palette size={20} />;
      case 'Wind': return <Wind size={20} />;
      case 'Server': return <Server size={20} />;
      case 'Radio': return <Radio size={20} />;
      case 'HardDrive': return <HardDrive size={20} />;
      case 'Share2': return <Share2 size={20} />;
      case 'GitBranch': return <GitBranch size={20} />;
      case 'Monitor': return <Monitor size={20} />;
      case 'Package': return <Package size={20} />;
      case 'Terminal': return <Terminal size={20} />;
      case 'Cpu': return <Cpu size={20} />;
      case 'FileCode': return <FileCode size={20} />;
      default: return <Code size={20} />;
    }
  };

  const getCategoryColor = (cat) => {
    switch (cat.toLowerCase()) {
      case 'languages': return '#00f0ff';
      case 'core cs': return '#ffb703';
      case 'frontend': return '#9d4edd';
      case 'backend': return '#10b981';
      case 'tools': return '#f72585';
      default: return '#00f0ff';
    }
  };

  return (
    <section id="skills" style={{ padding: '6rem 0', position: 'relative', zIndex: 1 }}>
      <div className="container-cosmic">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-tag">
            <Sparkles size={14} /> MODULE 03 // TECHNICAL ARSENAL
          </div>
          <h2 className="section-title">
            Skills &amp; <span className="text-gradient">Core Competencies</span>
          </h2>
          <p className="section-subtitle">
            From low-level data structures and OOP patterns to modern full-stack web architectures.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div 
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '0.6rem',
            marginBottom: '3rem'
          }}
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="clickable"
                style={{
                  padding: '0.55rem 1.25rem',
                  borderRadius: '9999px',
                  border: isSelected ? '1px solid #00f0ff' : '1px solid rgba(255, 255, 255, 0.1)',
                  background: isSelected ? 'linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(114, 9, 183, 0.2))' : 'rgba(10, 15, 36, 0.6)',
                  color: isSelected ? '#00f0ff' : 'var(--text-secondary)',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 0 15px rgba(0, 240, 255, 0.3)' : 'none'
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Skills Grid */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}
        >
          {filteredSkills.map((skill) => {
            const catColor = getCategoryColor(skill.category);
            return (
              <div
                key={skill.id}
                className="glass-card clickable"
                style={{
                  padding: '1.4rem 1.5rem',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div 
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        background: `rgba(${catColor === '#00f0ff' ? '0, 240, 255' : catColor === '#ffb703' ? '255, 183, 3' : '157, 78, 221'}, 0.15)`,
                        color: catColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {getSkillIcon(skill.icon)}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {skill.name}
                      </h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {skill.category}
                      </span>
                    </div>
                  </div>

                  <span 
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      color: catColor
                    }}
                  >
                    {skill.proficiency}%
                  </span>
                </div>

                {/* Animated Progress Bar */}
                <div 
                  style={{
                    width: '100%',
                    height: '6px',
                    borderRadius: '4px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    overflow: 'hidden',
                    position: 'relative'
                  }}
                >
                  <div 
                    style={{
                      width: `${skill.proficiency}%`,
                      height: '100%',
                      background: `linear-gradient(90deg, ${catColor}, #f72585)`,
                      borderRadius: '4px',
                      boxShadow: `0 0 10px ${catColor}`
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
