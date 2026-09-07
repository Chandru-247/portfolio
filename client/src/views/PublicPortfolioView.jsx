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

const initialProfile = {
  name: 'CHANDRU R',
  headline: 'Software Engineer',
  subheadline: 'Architecting high-performance distributed systems, dynamic web applications, and stellar digital experiences.',
  statusText: 'Open to Mission Opportunities',
  statusAvailable: true,
  location: 'Bengaluru, India / Remote Planetary Station',
  email: 'itismechandru247@gmail.com',
  avatar: 'https://res.cloudinary.com/ogtctcs6/image/upload/v1788795478/galaxy_portfolio/assets/asset_Jersey_1788795478115.jpg',
  avatarPosition: 'center 85%',
  typingWords: [
    'Full-Stack Web Developer',
    'Java & DSA Specialist',
    'Distributed Systems Enthusiast',
    'Cosmic UI/UX Designer',
    'Open Source Contributor'
  ],
  stats: {
    projectsCompleted: 24,
    gitCommits: '1.2K+',
    algorithmsSolved: '650+',
    certificationsEarned: 6
  },
  socialLinks: {
    github: 'https://github.com/Chandru-247',
    linkedin: 'https://www.linkedin.com/in/chandru-r-1a93a03b3',
    instagram: 'https://www.instagram.com/darkscent_lunx_',
    email: 'mailto:itismechandru247@gmail.com',
    discord: 'https://discord.com'
  }
};

export default function PublicPortfolioView({ theme, onToggleTheme }) {
  // Public data state with initial active profile
  const [profile, setProfile] = useState(initialProfile);
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [skills, setSkills] = useState([]);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  // Public Modals state
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [resumeModalOpen, setResumeModalOpen] = useState(false);

  // Fetch all public portfolio data with cache-busting
  const fetchPublicData = async () => {
    try {
      const cacheBust = `?t=${Date.now()}`;
      const [resProf, resProj, resCert, resSkills, resRes] = await Promise.allSettled([
        fetch(`/api/profile${cacheBust}`).then(r => r.json()),
        fetch(`/api/projects${cacheBust}`).then(r => r.json()),
        fetch(`/api/certificates${cacheBust}`).then(r => r.json()),
        fetch(`/api/skills${cacheBust}`).then(r => r.json()),
        fetch(`/api/resume${cacheBust}`).then(r => r.json())
      ]);

      if (resProf.status === 'fulfilled' && resProf.value?.data) {
        setProfile(resProf.value.data);
      }
      if (resProj.status === 'fulfilled' && resProj.value?.data) {
        setProjects(resProj.value.data);
      }
      if (resCert.status === 'fulfilled' && resCert.value?.data) {
        setCertificates(resCert.value.data);
      }
      if (resSkills.status === 'fulfilled' && resSkills.value?.data) {
        setSkills(resSkills.value.data);
      }
      if (resRes.status === 'fulfilled' && resRes.value?.data) {
        setResume(resRes.value.data);
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
