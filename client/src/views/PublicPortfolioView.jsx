import React, { useState, useEffect } from 'react';
import GalaxyCanvas from '../components/GalaxyCanvas';
import CosmicCursor from '../components/CosmicCursor';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import SkillsSection from '../components/SkillsSection';
import ProjectsSection from '../components/ProjectsSection';
import CertificatesSection from '../components/CertificatesSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';

import ProjectModal from '../components/ProjectModal';
import CertificateModal from '../components/CertificateModal';
import ResumeModal from '../components/ResumeModal';

export default function PublicPortfolioView({ theme, onToggleTheme }) {
  // Public data state
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [skills, setSkills] = useState([]);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  // Public Modals state
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [resumeModalOpen, setResumeModalOpen] = useState(false);

  // Fetch all public portfolio data
  const fetchPublicData = async () => {
    try {
      const [resProf, resProj, resCert, resSkills, resRes] = await Promise.all([
        fetch('/api/profile'),
        fetch('/api/projects'),
        fetch('/api/certificates'),
        fetch('/api/skills'),
        fetch('/api/resume')
      ]);

      if (resProf.ok) {
        const d = await resProf.json();
        setProfile(d.data);
      }
      if (resProj.ok) {
        const d = await resProj.json();
        setProjects(d.data || []);
      }
      if (resCert.ok) {
        const d = await resCert.json();
        setCertificates(d.data || []);
      }
      if (resSkills.ok) {
        const d = await resSkills.json();
        setSkills(d.data || []);
      }
      if (resRes.ok) {
        const d = await resRes.json();
        setResume(d.data);
      }
    } catch (err) {
      console.error('Error loading portfolio data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicData();
  }, []);

  useEffect(() => {
    if (profile?.name) {
      document.title = `${profile.name} | Galaxy Portfolio`;
    }
  }, [profile?.name]);

  const handleDownloadResume = () => {
    setResumeModalOpen(true);
  };

  const handleExploreProjects = () => {
    const el = document.getElementById('projects');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      {/* Background Interactive Starfield Canvas */}
      <GalaxyCanvas />

      {/* Custom Stardust Magnetic Cursor */}
      <CosmicCursor />

      {/* Navigation Bar (Clean public view without admin controls) */}
      <Navbar
        profile={profile}
        onDownloadResume={handleDownloadResume}
        theme={theme}
        onToggleTheme={onToggleTheme}
      />

      {/* Public Portfolio Content */}
      <main>
        <HeroSection
          profile={profile}
          onDownloadResume={handleDownloadResume}
          onExploreProjects={handleExploreProjects}
        />

        <AboutSection profile={profile} />

        <SkillsSection skills={skills} />

        <ProjectsSection
          projects={projects}
          onSelectProject={(p) => setSelectedProject(p)}
        />

        <CertificatesSection
          certificates={certificates}
          onSelectCertificate={(c) => setSelectedCertificate(c)}
        />

        <ContactSection profile={profile} />
      </main>

      {/* Footer (Clean public view without admin button) */}
      <Footer profile={profile} />

      {/* Project Briefing Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}

      {/* Certificate High-Res Verification Modal */}
      {selectedCertificate && (
        <CertificateModal
          certificate={selectedCertificate}
          onClose={() => setSelectedCertificate(null)}
        />
      )}

      {/* Resume Modal */}
      {resumeModalOpen && (
        <ResumeModal
          resume={resume}
          profile={profile}
          onClose={() => setResumeModalOpen(false)}
        />
      )}
    </div>
  );
}
