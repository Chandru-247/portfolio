import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  LogOut, 
  LayoutDashboard, 
  FolderKanban, 
  Award, 
  Cpu, 
  User, 
  FileText, 
  Mail, 
  Settings, 
  Plus, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  Check, 
  X, 
  RefreshCw, 
  Star, 
  Eye, 
  Upload, 
  Save, 
  AlertCircle, 
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  GraduationCap,
  Target,
  Compass,
  BookOpen
} from 'lucide-react';

export default function AdminDashboard({ token, user, onLogout, onClose, onDataRefresh }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [skills, setSkills] = useState([]);
  const [profile, setProfile] = useState(null);
  const [resume, setResume] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Modals / forms state
  const [editingProject, setEditingProject] = useState(null);
  const [editingCert, setEditingCert] = useState(null);
  const [editingSkill, setEditingSkill] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);
  const [showSkillModal, setShowSkillModal] = useState(false);

  // Settings password form
  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  // Fetch all administrative data
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${token}` };

      const [resStats, resProj, resCert, resSkills, resProf, resRes, resMsg] = await Promise.all([
        fetch('/api/stats', { headers }),
        fetch('/api/projects'),
        fetch('/api/certificates'),
        fetch('/api/skills'),
        fetch('/api/profile'),
        fetch('/api/resume'),
        fetch('/api/messages', { headers })
      ]);

      if (resStats.ok) { const d = await resStats.json(); setStats(d.data); }
      if (resProj.ok) { const d = await resProj.json(); setProjects(d.data || []); }
      if (resCert.ok) { const d = await resCert.json(); setCertificates(d.data || []); }
      if (resSkills.ok) { const d = await resSkills.json(); setSkills(d.data || []); }
      if (resProf.ok) { const d = await resProf.json(); setProfile(d.data); }
      if (resRes.ok) { const d = await resRes.json(); setResume(d.data); }
      if (resMsg.ok) { const d = await resMsg.json(); setMessages(d.data || []); }

      if (onDataRefresh) onDataRefresh();
    } catch (err) {
      console.error('Error fetching admin data:', err);
      showToast('Failed to sync celestial data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  /* ---------------- PROJECTS CRUD ---------------- */
  const handleSaveProject = async (e) => {
    e.preventDefault();
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    const isEdit = Boolean(editingProject?.id);
    const url = isEdit ? `/api/projects/${editingProject.id}` : '/api/projects';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(editingProject)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(isEdit ? 'Project updated successfully.' : 'New project launched!');
        setShowProjectModal(false);
        setEditingProject(null);
        fetchAllData();
      } else {
        showToast(data.message || 'Error saving project', 'error');
      }
    } catch (err) {
      showToast('Connection failed while saving project', 'error');
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Are you sure you want to decommission this project?')) return;
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        showToast('Project decommissioned.');
        fetchAllData();
      }
    } catch (err) {
      showToast('Error removing project', 'error');
    }
  };

  /* ---------------- CERTIFICATES CRUD ---------------- */
  const handleSaveCertificate = async (e) => {
    e.preventDefault();
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    const isEdit = Boolean(editingCert?.id);
    const url = isEdit ? `/api/certificates/${editingCert.id}` : '/api/certificates';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(editingCert)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(isEdit ? 'Certificate updated.' : 'New certificate registered!');
        setShowCertModal(false);
        setEditingCert(null);
        fetchAllData();
      } else {
        showToast(data.message || 'Error saving certificate', 'error');
      }
    } catch (err) {
      showToast('Error saving certificate', 'error');
    }
  };

  const handleDeleteCert = async (id) => {
    if (!window.confirm('Are you sure you want to remove this certificate?')) return;
    try {
      const res = await fetch(`/api/certificates/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        showToast('Certificate removed.');
        fetchAllData();
      }
    } catch (err) {
      showToast('Error removing certificate', 'error');
    }
  };

  /* ---------------- SKILLS CRUD ---------------- */
  const handleSaveSkill = async (e) => {
    e.preventDefault();
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    const isEdit = Boolean(editingSkill?.id);
    const url = isEdit ? `/api/skills/${editingSkill.id}` : '/api/skills';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(editingSkill)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(isEdit ? 'Skill telemetry updated.' : 'New skill added.');
        setShowSkillModal(false);
        setEditingSkill(null);
        fetchAllData();
      } else {
        showToast(data.message || 'Error saving skill', 'error');
      }
    } catch (err) {
      showToast('Error saving skill', 'error');
    }
  };

  const handleDeleteSkill = async (id) => {
    if (!window.confirm('Remove this skill telemetry?')) return;
    try {
      const res = await fetch(`/api/skills/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        showToast('Skill removed.');
        fetchAllData();
      }
    } catch (err) {
      showToast('Error removing skill', 'error');
    }
  };

  /* ---------------- PROFILE UPDATE ---------------- */
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profile)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Profile telemetry saved successfully!');
        fetchAllData();
      } else {
        showToast(data.message || 'Error updating profile', 'error');
      }
    } catch (err) {
      showToast('Connection error updating profile', 'error');
    }
  };

  /* ---------------- EDUCATION / CAREER JOURNEY HELPERS ---------------- */
  const handleAddEducation = () => {
    const newEdu = {
      id: `edu-${Date.now()}`,
      type: 'College Course',
      degree: '',
      institution: '',
      grade: 'CGPA: ',
      period: '',
      status: 'Currently Pursuing',
      highlights: ''
    };
    setProfile({
      ...profile,
      education: [...(profile.education || []), newEdu]
    });
  };

  const handleUpdateEducation = (index, field, value) => {
    const updated = [...(profile.education || [])];
    updated[index] = { ...updated[index], [field]: value };
    setProfile({ ...profile, education: updated });
  };

  const handleRemoveEducation = (index) => {
    const updated = [...(profile.education || [])];
    updated.splice(index, 1);
    setProfile({ ...profile, education: updated });
  };

  /* ---------------- CAREER MILESTONES HELPERS ---------------- */
  const handleAddCareerGoal = () => {
    const newGoal = {
      id: `goal-${Date.now()}`,
      title: '🚀 Current Milestone',
      status: 'Currently Pursuing',
      period: '2026 - Present',
      goal: ''
    };
    setProfile({
      ...profile,
      careerGoals: [...(profile.careerGoals || []), newGoal]
    });
  };

  const handleUpdateCareerGoal = (index, field, value) => {
    const updated = [...(profile.careerGoals || [])];
    updated[index] = { ...updated[index], [field]: value };
    setProfile({ ...profile, careerGoals: updated });
  };

  const handleRemoveCareerGoal = (index) => {
    const updated = [...(profile.careerGoals || [])];
    updated.splice(index, 1);
    setProfile({ ...profile, careerGoals: updated });
  };

  /* ---------------- AVATAR PHOTO UPLOAD & POSITIONING ---------------- */
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      showToast('Uploading profile image to CDN...', 'info');
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const nextPosition = profile.avatarPosition || 'center 85%';
        const updated = { ...profile, avatar: data.fileUrl, avatarPosition: nextPosition };
        setProfile(updated);
        
        // Auto-save to profile telemetry immediately so it never gets lost
        try {
          await fetch('/api/profile', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updated)
          });
          showToast('Profile image uploaded & saved live! Adjust framing below if needed.');
        } catch {
          showToast('Profile image uploaded! Click Save Avatar to persist.');
        }
      } else {
        showToast(data.message || 'Error uploading image', 'error');
      }
    } catch (err) {
      showToast('Connection error uploading image', 'error');
    }
  };

  const handleSaveAvatarDirect = async () => {
    try {
      showToast('Saving avatar telemetry...', 'info');
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profile)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Avatar image & framing saved permanently!');
        fetchAllData();
      } else {
        showToast(data.message || 'Error saving avatar', 'error');
      }
    } catch (err) {
      showToast('Connection error saving avatar', 'error');
    }
  };

  const handleResetAvatar = async () => {
    const updated = { ...profile, avatar: 'https://res.cloudinary.com/ogtctcs6/image/upload/v1788795478/galaxy_portfolio/assets/asset_Jersey_1788795478115.jpg', avatarPosition: 'center 85%' };
    setProfile(updated);
    try {
      await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updated)
      });
      showToast('Reset to Chandru profile photo with optimal 85% framing!');
    } catch {
      showToast('Reset avatar in preview. Click Save Avatar to persist.');
    }
  };

  const getAvatarVerticalPercent = () => {
    if (!profile?.avatarPosition) return 85;
    const match = profile.avatarPosition.match(/(\d+)%/);
    if (match) return parseInt(match[1], 10);
    if (profile.avatarPosition.includes('bottom')) return 95;
    if (profile.avatarPosition.includes('top')) return 15;
    if (profile.avatarPosition.includes('center')) return 50;
    return 85;
  };

  /* ---------------- RESUME UPDATE / UPLOAD ---------------- */
  const handleResumeFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('resumeFile', file);
    formData.append('title', file.name);

    try {
      const res = await fetch('/api/resume/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('New resume file uploaded to cosmic archives!');
        fetchAllData();
      } else {
        showToast(data.message || 'Resume upload failed', 'error');
      }
    } catch (err) {
      showToast('Upload connection failed', 'error');
    }
  };

  const handleSaveResumeConfig = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/resume', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(resume)
      });
      if (res.ok) {
        showToast('Resume link settings updated.');
        fetchAllData();
      }
    } catch (err) {
      showToast('Error updating resume config', 'error');
    }
  };

  const handleRegenerateResumePdf = async () => {
    try {
      showToast('Generating fresh PDF resume...');
      const res = await fetch('/api/resume/regenerate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setResume(data.data);
        showToast('Resume PDF regenerated successfully!');
      } else {
        showToast(data.message || 'Regeneration failed', 'error');
      }
    } catch (err) {
      showToast('Error regenerating resume', 'error');
    }
  };

  /* ---------------- MESSAGES ACTIONS ---------------- */
  const handleToggleReadMessage = async (id, currentVal) => {
    try {
      const res = await fetch(`/api/messages/${id}/read`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ read: !currentVal })
      });
      if (res.ok) {
        fetchAllData();
      }
    } catch (err) {
      showToast('Error updating message status', 'error');
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Delete this message transmission?')) return;
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        showToast('Transmission deleted.');
        fetchAllData();
      }
    } catch (err) {
      showToast('Error deleting transmission', 'error');
    }
  };

  /* ---------------- SETTINGS: PASSWORD & FACTORY RESET ---------------- */
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirmPassword) {
      showToast('New passwords do not match!', 'error');
      return;
    }

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passForm.currentPassword,
          newPassword: passForm.newPassword
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Password updated successfully!');
        setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        showToast(data.message || 'Password update failed', 'error');
      }
    } catch (err) {
      showToast('Error changing password', 'error');
    }
  };

  const handleResetDemoData = async () => {
    if (!window.confirm('Reset all portfolio data to factory cosmic seed state? Any custom changes will be reset.')) return;
    try {
      const res = await fetch('/api/auth/reset-demo', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        showToast('Reset to cosmic seed data complete!');
        fetchAllData();
      }
    } catch (err) {
      showToast('Error resetting data', 'error');
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'var(--bg-space)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        color: 'var(--text-primary)'
      }}
    >
      {/* Toast Notification Banner */}
      {toast.show && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 9999,
            background: toast.type === 'error' ? 'rgba(239, 68, 68, 0.95)' : 'rgba(0, 240, 255, 0.95)',
            color: toast.type === 'error' ? '#fff' : '#030712',
            padding: '0.85rem 1.4rem',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontFamily: 'var(--font-heading)',
            fontWeight: 600,
            fontSize: '0.9rem',
            animation: 'fadeIn 0.25s ease'
          }}
        >
          {toast.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <header
        style={{
          padding: '0.9rem 1.75rem',
          background: 'rgba(7, 10, 28, 0.95)',
          borderBottom: '1px solid var(--border-cosmic)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #00f0ff 0%, #7209b7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#050716'
            }}
          >
            <ShieldCheck size={22} />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.15rem' }}>
              ADMIN COMMAND BRIDGE
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#00f0ff' }}>
              LOGGED IN AS: {user?.name || 'Commander'} ({user?.username || 'admin'})
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={onClose}
            className="btn-cosmic-secondary clickable"
            style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }}
          >
            <Eye size={15} />
            <span>View Public Portfolio</span>
          </button>

          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="clickable"
            title="Log Out"
            style={{
              padding: '0.5rem 0.9rem',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#ef4444',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontFamily: 'var(--font-heading)',
              fontSize: '0.82rem',
              fontWeight: 600
            }}
          >
            <LogOut size={15} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Admin Workspace Layout (Sidebar + Content) */}
      <div style={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        {/* Navigation Sidebar */}
        <aside
          style={{
            width: '240px',
            background: 'rgba(6, 9, 25, 0.9)',
            borderRight: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '1.25rem 0.75rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flexShrink: 0
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <button
              onClick={() => setActiveTab('overview')}
              className="clickable"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === 'overview' ? 'rgba(0, 240, 255, 0.15)' : 'transparent',
                color: activeTab === 'overview' ? '#00f0ff' : 'var(--text-secondary)',
                fontFamily: 'var(--font-heading)',
                fontSize: '0.9rem',
                fontWeight: 600,
                textAlign: 'left',
                cursor: 'pointer'
              }}
            >
              <LayoutDashboard size={18} />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className="clickable"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === 'projects' ? 'rgba(0, 240, 255, 0.15)' : 'transparent',
                color: activeTab === 'projects' ? '#00f0ff' : 'var(--text-secondary)',
                fontFamily: 'var(--font-heading)',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FolderKanban size={18} />
                <span>Projects</span>
              </div>
              <span className="badge-pill badge-cyan" style={{ fontSize: '0.65rem' }}>
                {projects.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('certificates')}
              className="clickable"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === 'certificates' ? 'rgba(0, 240, 255, 0.15)' : 'transparent',
                color: activeTab === 'certificates' ? '#00f0ff' : 'var(--text-secondary)',
                fontFamily: 'var(--font-heading)',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Award size={18} />
                <span>Certificates</span>
              </div>
              <span className="badge-pill badge-gold" style={{ fontSize: '0.65rem' }}>
                {certificates.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('skills')}
              className="clickable"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === 'skills' ? 'rgba(0, 240, 255, 0.15)' : 'transparent',
                color: activeTab === 'skills' ? '#00f0ff' : 'var(--text-secondary)',
                fontFamily: 'var(--font-heading)',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Cpu size={18} />
                <span>Skills</span>
              </div>
              <span className="badge-pill badge-purple" style={{ fontSize: '0.65rem' }}>
                {skills.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className="clickable"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === 'profile' ? 'rgba(0, 240, 255, 0.15)' : 'transparent',
                color: activeTab === 'profile' ? '#00f0ff' : 'var(--text-secondary)',
                fontFamily: 'var(--font-heading)',
                fontSize: '0.9rem',
                fontWeight: 600,
                textAlign: 'left',
                cursor: 'pointer'
              }}
            >
              <User size={18} />
              <span>Profile &amp; Bio</span>
            </button>

            <button
              onClick={() => setActiveTab('resume')}
              className="clickable"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === 'resume' ? 'rgba(0, 240, 255, 0.15)' : 'transparent',
                color: activeTab === 'resume' ? '#00f0ff' : 'var(--text-secondary)',
                fontFamily: 'var(--font-heading)',
                fontSize: '0.9rem',
                fontWeight: 600,
                textAlign: 'left',
                cursor: 'pointer'
              }}
            >
              <FileText size={18} />
              <span>Resume Manager</span>
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className="clickable"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === 'messages' ? 'rgba(0, 240, 255, 0.15)' : 'transparent',
                color: activeTab === 'messages' ? '#00f0ff' : 'var(--text-secondary)',
                fontFamily: 'var(--font-heading)',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Mail size={18} />
                <span>Inquiries</span>
              </div>
              {stats?.unreadMessages > 0 ? (
                <span className="badge-pill badge-magenta" style={{ fontSize: '0.65rem' }}>
                  {stats.unreadMessages} NEW
                </span>
              ) : (
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {messages.length}
                </span>
              )}
            </button>
          </div>

          <div>
            <button
              onClick={() => setActiveTab('settings')}
              className="clickable"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                border: '1px solid var(--border-subtle)',
                background: activeTab === 'settings' ? 'rgba(0, 240, 255, 0.1)' : 'transparent',
                color: activeTab === 'settings' ? '#00f0ff' : 'var(--text-secondary)',
                fontFamily: 'var(--font-heading)',
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              <Settings size={16} />
              <span>System Settings</span>
            </button>
          </div>
        </aside>

        {/* Content Body Area */}
        <main
          style={{
            flexGrow: 1,
            overflowY: 'auto',
            padding: '2.5rem',
            background: 'rgba(4, 6, 18, 0.7)'
          }}
        >
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div>
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
                  Mission Control Overview
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                  Live system metrics and administrative shortcuts for portfolio content.
                </p>
              </div>

              {/* Stats Counters Grid */}
              <div 
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '1.5rem',
                  marginBottom: '2.5rem'
                }}
              >
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Projects</span>
                    <FolderKanban size={20} color="#00f0ff" />
                  </div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', fontWeight: 700, color: '#00f0ff' }}>
                    {projects.length}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
                    {projects.filter(p => p.featured).length} designated as featured
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Certifications</span>
                    <Award size={20} color="#ffb703" />
                  </div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', fontWeight: 700, color: '#ffb703' }}>
                    {certificates.length}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
                    Verified credentials active
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Skills Tracked</span>
                    <Cpu size={20} color="#9d4edd" />
                  </div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', fontWeight: 700, color: '#c77dff' }}>
                    {skills.length}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
                    Across {new Set(skills.map(s => s.category)).size} domains
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Visitor Inquiries</span>
                    <Mail size={20} color="#f72585" />
                  </div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', fontWeight: 700, color: '#f72585' }}>
                    {messages.length}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
                    {stats?.unreadMessages || 0} unread transmissions
                  </div>
                </div>
              </div>

              {/* Quick Actions Bar */}
              <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
                  Quick Launch Operations
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                  <button
                    onClick={() => {
                      setEditingProject({
                        title: '',
                        category: 'Full Stack',
                        description: '',
                        longDescription: '',
                        image: '/assets/project_galaxy_ai.png',
                        tags: 'React, Node.js',
                        githubUrl: 'https://github.com',
                        liveUrl: 'https://demo.space',
                        featured: true
                      });
                      setShowProjectModal(true);
                    }}
                    className="btn-cosmic-primary clickable"
                    style={{ fontSize: '0.88rem' }}
                  >
                    <Plus size={16} /> Add New Project
                  </button>

                  <button
                    onClick={() => {
                      setEditingCert({
                        title: '',
                        issuer: '',
                        issueDate: 'September 2026',
                        expiryDate: 'Lifetime',
                        credentialId: '',
                        credentialUrl: 'https://verification.com',
                        image: '/assets/cert_cloud_architect.png'
                      });
                      setShowCertModal(true);
                    }}
                    className="btn-cosmic-secondary clickable"
                    style={{ fontSize: '0.88rem' }}
                  >
                    <Plus size={16} /> Add Certificate
                  </button>

                  <button
                    onClick={() => {
                      setEditingSkill({
                        name: '',
                        category: 'Languages',
                        proficiency: 85,
                        icon: 'Code'
                      });
                      setShowSkillModal(true);
                    }}
                    className="btn-cosmic-secondary clickable"
                    style={{ fontSize: '0.88rem' }}
                  >
                    <Plus size={16} /> Add Skill
                  </button>

                  <button
                    onClick={() => setActiveTab('profile')}
                    className="btn-cosmic-outline clickable"
                    style={{ fontSize: '0.88rem' }}
                  >
                    <Edit3 size={16} /> Edit Profile &amp; Bio
                  </button>
                </div>
              </div>

              {/* Recent Inquiries List */}
              <div className="glass-panel" style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.15rem' }}>Recent Signals Received</h3>
                  <button
                    onClick={() => setActiveTab('messages')}
                    className="clickable"
                    style={{ background: 'transparent', border: 'none', color: '#00f0ff', fontSize: '0.85rem', cursor: 'pointer' }}
                  >
                    View All &gt;
                  </button>
                </div>

                {messages.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No transmissions received yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {messages.slice(0, 3).map((msg) => (
                      <div
                        key={msg.id}
                        style={{
                          background: 'rgba(255, 255, 255, 0.03)',
                          borderLeft: msg.read ? '3px solid #64748b' : '3px solid #00f0ff',
                          padding: '1rem',
                          borderRadius: '0 10px 10px 0',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{msg.name}</span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>&lt;{msg.email}&gt;</span>
                            {!msg.read && <span className="badge-pill badge-cyan" style={{ fontSize: '0.65rem' }}>NEW</span>}
                          </div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--starlight-cyan)', marginTop: '0.2rem' }}>
                            {msg.subject}
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => handleToggleReadMessage(msg.id, msg.read)}
                            className="clickable btn-cosmic-outline"
                            style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
                          >
                            {msg.read ? 'Mark Unread' : 'Mark Read'}
                          </button>
                          <a
                            href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                            className="clickable btn-cosmic-primary"
                            style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem', textDecoration: 'none' }}
                          >
                            Reply
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PROJECTS MANAGER */}
          {activeTab === 'projects' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.8rem', color: 'var(--text-primary)' }}>Manage Projects</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Add, edit, reorder, or decommission portfolio projects. Changes update in real-time.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingProject({
                      title: '',
                      category: 'Full Stack',
                      description: '',
                      longDescription: '',
                      image: '/assets/project_galaxy_ai.png',
                      tags: 'React, Node.js, Express',
                      githubUrl: 'https://github.com',
                      liveUrl: 'https://demo.space',
                      featured: false,
                      order: projects.length + 1
                    });
                    setShowProjectModal(true);
                  }}
                  className="btn-cosmic-primary clickable"
                >
                  <Plus size={16} /> New Project
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {projects.map((p) => (
                  <div key={p.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ position: 'relative', width: '100%', height: '160px', borderRadius: '10px', overflow: 'hidden', marginBottom: '1rem' }}>
                        <img src={p.image} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.src = '/assets/project_galaxy_ai.png'; }} />
                        <div style={{ position: 'absolute', top: '8px', left: '8px' }}>
                          <span className="badge-pill badge-cyan">{p.category}</span>
                        </div>
                        {p.featured && (
                          <div style={{ position: 'absolute', top: '8px', right: '8px' }}>
                            <span className="badge-pill badge-gold"><Star size={10} fill="#ffb703" /> Featured</span>
                          </div>
                        )}
                      </div>

                      <h4 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>{p.title}</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                        {p.description}
                      </p>
                    </div>

                    <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" className="clickable" style={{ color: '#00f0ff' }}><ExternalLink size={16} /></a>}
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => {
                            setEditingProject({
                              ...p,
                              tags: Array.isArray(p.tags) ? p.tags.join(', ') : p.tags
                            });
                            setShowProjectModal(true);
                          }}
                          className="clickable btn-cosmic-outline"
                          style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
                        >
                          <Edit3 size={14} /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProject(p.id)}
                          className="clickable"
                          style={{
                            background: 'rgba(239, 68, 68, 0.15)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            color: '#ef4444',
                            borderRadius: '8px',
                            padding: '0.4rem 0.75rem',
                            fontSize: '0.8rem',
                            cursor: 'pointer'
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CERTIFICATES MANAGER */}
          {activeTab === 'certificates' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.8rem', color: 'var(--text-primary)' }}>Manage Certifications</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Upload, verify, and manage professional accreditation records.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingCert({
                      title: '',
                      issuer: '',
                      issueDate: '2026',
                      expiryDate: 'Lifetime',
                      credentialId: '',
                      credentialUrl: '',
                      image: '/assets/cert_cloud_architect.png'
                    });
                    setShowCertModal(true);
                  }}
                  className="btn-cosmic-primary clickable"
                >
                  <Plus size={16} /> Add Certificate
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {certificates.map((cert) => (
                  <div key={cert.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ position: 'relative', width: '100%', height: '150px', borderRadius: '10px', overflow: 'hidden', marginBottom: '1rem', backgroundColor: '#070a20' }}>
                        <img src={cert.image} alt={cert.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={(e) => { e.currentTarget.src = '/assets/cert_cloud_architect.png'; }} />
                      </div>
                      <h4 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.3rem' }}>{cert.title}</h4>
                      <div style={{ color: '#00f0ff', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>{cert.issuer}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        ID: {cert.credentialId} | {cert.issueDate}
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1rem', marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button
                        onClick={() => {
                          setEditingCert(cert);
                          setShowCertModal(true);
                        }}
                        className="clickable btn-cosmic-outline"
                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
                      >
                        <Edit3 size={14} /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCert(cert.id)}
                        className="clickable"
                        style={{
                          background: 'rgba(239, 68, 68, 0.15)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          color: '#ef4444',
                          borderRadius: '8px',
                          padding: '0.4rem 0.75rem',
                          cursor: 'pointer'
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SKILLS MANAGER */}
          {activeTab === 'skills' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.8rem', color: 'var(--text-primary)' }}>Manage Skills</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Fine-tune proficiency percentages and categories across your technical matrix.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingSkill({
                      name: '',
                      category: 'Languages',
                      proficiency: 90,
                      icon: 'Code'
                    });
                    setShowSkillModal(true);
                  }}
                  className="btn-cosmic-primary clickable"
                >
                  <Plus size={16} /> Add Skill
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
                {skills.map((s) => (
                  <div key={s.id} className="glass-panel" style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{s.name}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#00f0ff' }}>{s.proficiency}%</span>
                    </div>

                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>{s.category}</div>

                    <div style={{ width: '100%', height: '5px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', marginBottom: '1rem', overflow: 'hidden' }}>
                      <div style={{ width: `${s.proficiency}%`, height: '100%', background: '#00f0ff' }} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button
                        onClick={() => {
                          setEditingSkill(s);
                          setShowSkillModal(true);
                        }}
                        className="clickable btn-cosmic-outline"
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                      >
                        <Edit3 size={13} /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteSkill(s.id)}
                        className="clickable"
                        style={{
                          background: 'rgba(239, 68, 68, 0.15)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          color: '#ef4444',
                          borderRadius: '6px',
                          padding: '0.3rem 0.6rem',
                          cursor: 'pointer'
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: PROFILE & ABOUT ME */}
          {activeTab === 'profile' && profile && (
            <div style={{ maxWidth: '850px' }}>
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.8rem', color: 'var(--text-primary)' }}>Profile &amp; Biography Controls</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Update identity details, typing hero words, narrative bio, and education.
                </p>
              </div>

              <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.2rem', color: '#00f0ff' }}>Hero Section Telemetry</h3>

                  {/* Profile Photo / Avatar Manager */}
                  <div style={{ padding: '1.5rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '14px', border: '1px solid rgba(0, 240, 255, 0.2)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <label style={{ display: 'block', fontSize: '0.95rem', color: '#00f0ff', fontWeight: 600 }}>
                        Profile Photo / Astronaut Avatar
                      </label>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Synchronized live with Hero Section &amp; CDN
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', flexWrap: 'wrap' }}>
                      {/* Avatar Preview Box with live position */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                        <div 
                          style={{ 
                            position: 'relative', 
                            width: '120px', 
                            height: '120px', 
                            borderRadius: '24px', 
                            overflow: 'hidden', 
                            border: '2px solid #00f0ff', 
                            boxShadow: '0 0 25px rgba(0,240,255,0.35)', 
                            background: '#050716', 
                            flexShrink: 0 
                          }}
                        >
                          <img
                            src={profile.avatar || 'https://res.cloudinary.com/ogtctcs6/image/upload/v1788795478/galaxy_portfolio/assets/asset_Jersey_1788795478115.jpg'}
                            alt="Avatar Preview"
                            style={{ 
                              width: '100%', 
                              height: '100%', 
                              objectFit: 'cover',
                              objectPosition: profile.avatarPosition || 'center 85%'
                            }}
                            onError={(e) => { e.currentTarget.src = 'https://res.cloudinary.com/ogtctcs6/image/upload/v1788795478/galaxy_portfolio/assets/asset_Jersey_1788795478115.jpg'; }}
                          />
                        </div>
                        <span style={{ fontSize: '0.7rem', color: '#00f0ff', fontFamily: 'var(--font-mono)' }}>
                          Live Preview
                        </span>
                      </div>

                      {/* Controls */}
                      <div style={{ flex: 1, minWidth: '260px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {/* Action Buttons */}
                        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                          <label 
                            className="btn-cosmic-primary clickable" 
                            style={{ padding: '0.55rem 1.1rem', fontSize: '0.82rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
                          >
                            <Upload size={15} /> Upload My Photo
                            <input 
                              type="file" 
                              accept="image/*" 
                              onChange={handleAvatarUpload} 
                              style={{ display: 'none' }} 
                            />
                          </label>

                          <button
                            type="button"
                            onClick={handleResetAvatar}
                            className="btn-cosmic-outline clickable"
                            style={{ padding: '0.55rem 0.9rem', fontSize: '0.82rem' }}
                          >
                            Reset to Default Photo
                          </button>

                          <button
                            type="button"
                            onClick={handleSaveAvatarDirect}
                            className="btn-cosmic-primary clickable"
                            style={{ 
                              padding: '0.55rem 1rem', 
                              fontSize: '0.82rem', 
                              background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(114, 9, 183, 0.4))', 
                              border: '1px solid #00f0ff',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.4rem'
                            }}
                          >
                            <Save size={14} /> Save Avatar
                          </button>
                        </div>

                        {/* Direct URL Input */}
                        <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                            Or direct image URL / asset path:
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. https://res.cloudinary.com/... or /uploads/..."
                            value={profile.avatar || ''}
                            onChange={(e) => setProfile({ ...profile, avatar: e.target.value })}
                            className="cosmic-input"
                            style={{ fontSize: '0.82rem', padding: '0.45rem 0.8rem' }}
                          />
                        </div>

                        {/* Framing & Focal Position Controls */}
                        <div style={{ padding: '0.85rem', background: 'rgba(0, 240, 255, 0.04)', borderRadius: '10px', border: '1px solid rgba(0, 240, 255, 0.15)', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.78rem', color: '#00f0ff', fontWeight: 600 }}>
                              🎯 Vertical Focal Alignment / Framing:
                            </span>
                            <span className="badge-pill badge-cyan" style={{ fontSize: '0.7rem' }}>
                              {profile.avatarPosition || 'center 85%'}
                            </span>
                          </div>

                          {/* Presets */}
                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <button
                              type="button"
                              onClick={() => setProfile({ ...profile, avatarPosition: 'center 85%' })}
                              className={`clickable ${ (profile.avatarPosition === 'center 85%' || profile.avatarPosition === 'bottom') ? 'btn-cosmic-primary' : 'btn-cosmic-outline' }`}
                              style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                            >
                              👤 Bottom / Standing (85%)
                            </button>
                            <button
                              type="button"
                              onClick={() => setProfile({ ...profile, avatarPosition: 'center 50%' })}
                              className={`clickable ${ (profile.avatarPosition === 'center 50%' || profile.avatarPosition === 'center') ? 'btn-cosmic-primary' : 'btn-cosmic-outline' }`}
                              style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                            >
                              ⚖️ Center (50%)
                            </button>
                            <button
                              type="button"
                              onClick={() => setProfile({ ...profile, avatarPosition: 'center 15%' })}
                              className={`clickable ${ (profile.avatarPosition === 'center 15%' || profile.avatarPosition === 'top') ? 'btn-cosmic-primary' : 'btn-cosmic-outline' }`}
                              style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                            >
                              🔝 Top / Face (15%)
                            </button>
                          </div>

                          {/* Custom Slider */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Top (0%)</span>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={getAvatarVerticalPercent()}
                              onChange={(e) => setProfile({ ...profile, avatarPosition: `center ${e.target.value}%` })}
                              style={{ flex: 1, accentColor: '#00f0ff', cursor: 'pointer' }}
                            />
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Bottom (100%)</span>
                          </div>
                          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>
                            💡 Adjust the slider or click <b>Bottom / Standing</b> to center the subject if your uploaded photo is a vertical/portrait shot.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>Commander Name</label>
                      <input
                        type="text"
                        value={profile.name || ''}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="cosmic-input"
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>Status Pill Text</label>
                      <input
                        type="text"
                        value={profile.statusText || ''}
                        onChange={(e) => setProfile({ ...profile, statusText: e.target.value })}
                        className="cosmic-input"
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>Headline Tagline</label>
                    <input
                      type="text"
                      value={profile.headline || ''}
                      onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                      className="cosmic-input"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>Subheadline Narrative</label>
                    <textarea
                      rows={2}
                      value={profile.subheadline || ''}
                      onChange={(e) => setProfile({ ...profile, subheadline: e.target.value })}
                      className="cosmic-textarea"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                      Typing Animation Keywords (comma separated)
                    </label>
                    <input
                      type="text"
                      value={profile.typingWords ? profile.typingWords.join(', ') : ''}
                      onChange={(e) => setProfile({
                        ...profile,
                        typingWords: e.target.value.split(',').map(s => s.trim())
                      })}
                      className="cosmic-input"
                    />
                  </div>
                </div>

                {/* Bio Narrative */}
                <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.2rem', color: '#ffb703' }}>About Me Narrative</h3>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>Biography Story</label>
                    <textarea
                      rows={4}
                      value={profile.bio || ''}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      className="cosmic-textarea"
                    />
                  </div>
                </div>

                {/* Career Journey & Academic Milestones (College, 12th, 10th, CGPA & Percentages) */}
                <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', color: '#00f0ff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <GraduationCap size={20} color="#00f0ff" />
                        Career Journey &amp; Academic Milestones
                      </h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                        Manage College course &amp; CGPA, 12th &amp; 10th school percentages, and currently pursuing milestones.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddEducation}
                      className="btn-cosmic-outline clickable"
                      style={{ padding: '0.5rem 0.9rem', fontSize: '0.85rem', gap: '0.4rem' }}
                    >
                      <Plus size={16} /> Add Journey Milestone
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {(!profile.education || profile.education.length === 0) ? (
                      <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '10px' }}>
                        No academic journey milestones configured yet. Click "+ Add Journey Milestone" to add your College course, 12th, or 10th details.
                      </div>
                    ) : (
                      profile.education.map((edu, idx) => (
                        <div
                          key={edu.id || idx}
                          style={{
                            padding: '1.25rem',
                            borderRadius: '12px',
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: edu.status === 'Currently Pursuing' ? '1px solid rgba(0, 240, 255, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                            boxShadow: edu.status === 'Currently Pursuing' ? '0 0 15px rgba(0, 240, 255, 0.1)' : 'none',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem'
                          }}
                        >
                          {/* Top Row: Milestone Title & Delete */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                              <span
                                style={{
                                  padding: '0.25rem 0.6rem',
                                  borderRadius: '6px',
                                  fontSize: '0.75rem',
                                  fontFamily: 'var(--font-mono)',
                                  background: edu.status === 'Currently Pursuing' ? 'rgba(0, 240, 255, 0.15)' : 'rgba(255, 255, 255, 0.06)',
                                  color: edu.status === 'Currently Pursuing' ? '#00f0ff' : 'var(--text-secondary)',
                                  border: edu.status === 'Currently Pursuing' ? '1px solid rgba(0, 240, 255, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)'
                                }}
                              >
                                {edu.type || `Milestone ${idx + 1}`}
                              </span>
                              {edu.status === 'Currently Pursuing' && (
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#00f0ff', fontWeight: 600 }}>
                                  <span className="pulsing-dot" /> Currently Pursuing
                                </span>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveEducation(idx)}
                              className="clickable"
                              title="Delete Milestone"
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#ef4444',
                                padding: '0.3rem',
                                cursor: 'pointer',
                                borderRadius: '6px'
                              }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>

                          {/* Grid Row 1: Category & Status */}
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                                Milestone Category
                              </label>
                              <select
                                value={edu.type || 'College Course'}
                                onChange={(e) => handleUpdateEducation(idx, 'type', e.target.value)}
                                className="cosmic-input"
                                style={{ background: '#0a0e23', color: '#fff' }}
                              >
                                <option value="College Course">College Course (Degree &amp; CGPA)</option>
                                <option value="12th Standard">12th Standard (Higher Secondary)</option>
                                <option value="10th Standard">10th Standard (Secondary School)</option>
                                <option value="Career Milestone">Career Pursuit Milestone</option>
                                <option value="Other Certification">Other Academic Credential</option>
                              </select>
                            </div>

                            <div>
                              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                                Status
                              </label>
                              <select
                                value={edu.status || 'Completed'}
                                onChange={(e) => handleUpdateEducation(idx, 'status', e.target.value)}
                                className="cosmic-input"
                                style={{ background: '#0a0e23', color: '#fff' }}
                              >
                                <option value="Currently Pursuing">Currently Pursuing</option>
                                <option value="Completed">Completed</option>
                                <option value="In Progress">In Progress</option>
                              </select>
                            </div>
                          </div>

                          {/* Grid Row 2: Course/Degree Title & Institution */}
                          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
                            <div>
                              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                                Degree / Course / Class Title
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. B.Tech in Computer Science / 12th Standard PCM / 10th Standard"
                                value={edu.degree || ''}
                                onChange={(e) => handleUpdateEducation(idx, 'degree', e.target.value)}
                                className="cosmic-input"
                              />
                            </div>

                            <div>
                              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                                School / College / University
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. National Institute of Technology / School Name"
                                value={edu.institution || ''}
                                onChange={(e) => handleUpdateEducation(idx, 'institution', e.target.value)}
                                className="cosmic-input"
                              />
                            </div>
                          </div>

                          {/* Grid Row 3: Grade / Percentage & Duration */}
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                              <label style={{ display: 'block', fontSize: '0.75rem', color: '#ffb703', marginBottom: '0.3rem', fontWeight: 600 }}>
                                Grade / Score (Percentage or CGPA)
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. CGPA: 8.9 / 10.0 or Percentage: 94.6%"
                                value={edu.grade || ''}
                                onChange={(e) => handleUpdateEducation(idx, 'grade', e.target.value)}
                                className="cosmic-input"
                                style={{ borderColor: 'rgba(255, 183, 3, 0.4)' }}
                              />
                            </div>

                            <div>
                              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                                Batch / Duration Period
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. 2022 - 2026 or 2020 - 2022"
                                value={edu.period || ''}
                                onChange={(e) => handleUpdateEducation(idx, 'period', e.target.value)}
                                className="cosmic-input"
                              />
                            </div>
                          </div>

                          {/* Row 4: Highlights / Specialization */}
                          <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                              Specialization, Key Subjects &amp; Highlights
                            </label>
                            <textarea
                              rows={2}
                              placeholder="e.g. Core focus in Distributed Systems, Data Structures, Mathematics Distinction..."
                              value={edu.highlights || ''}
                              onChange={(e) => handleUpdateEducation(idx, 'highlights', e.target.value)}
                              className="cosmic-textarea"
                              style={{ fontSize: '0.85rem' }}
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Career Goals & Currently Pursuing Milestones */}
                <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', color: '#f72585', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Target size={20} color="#f72585" />
                        Career Pursuits &amp; Mission Milestones
                      </h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                        Manage current career trajectory, targeting software roles, and professional development milestones.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddCareerGoal}
                      className="btn-cosmic-outline clickable"
                      style={{ padding: '0.5rem 0.9rem', fontSize: '0.85rem', gap: '0.4rem' }}
                    >
                      <Plus size={16} /> Add Career Milestone
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {(!profile.careerGoals || profile.careerGoals.length === 0) ? (
                      <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '10px' }}>
                        No career milestones configured. Click "+ Add Career Milestone" to add your current career pursuit.
                      </div>
                    ) : (
                      profile.careerGoals.map((goal, idx) => (
                        <div
                          key={goal.id || idx}
                          style={{
                            padding: '1.25rem',
                            borderRadius: '12px',
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: goal.status === 'Currently Pursuing' ? '1px solid rgba(247, 37, 133, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                            boxShadow: goal.status === 'Currently Pursuing' ? '0 0 15px rgba(247, 37, 133, 0.15)' : 'none',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                              <span
                                style={{
                                  padding: '0.25rem 0.6rem',
                                  borderRadius: '6px',
                                  fontSize: '0.75rem',
                                  fontFamily: 'var(--font-mono)',
                                  background: goal.status === 'Currently Pursuing' ? 'rgba(247, 37, 133, 0.15)' : 'rgba(255, 255, 255, 0.06)',
                                  color: goal.status === 'Currently Pursuing' ? '#f72585' : 'var(--text-secondary)',
                                  border: goal.status === 'Currently Pursuing' ? '1px solid rgba(247, 37, 133, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)'
                                }}
                              >
                                {goal.status || `Milestone ${idx + 1}`}
                              </span>
                              {goal.status === 'Currently Pursuing' && (
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#f72585', fontWeight: 600 }}>
                                  <span className="pulsing-dot-magenta" /> Active Trajectory
                                </span>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveCareerGoal(idx)}
                              className="clickable"
                              title="Delete Goal"
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#ef4444',
                                padding: '0.3rem',
                                cursor: 'pointer',
                                borderRadius: '6px'
                              }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: '1rem' }}>
                            <div>
                              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                                Milestone Title
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. 🚀 Currently Pursuing: Software Engineer (SDE)"
                                value={goal.title || ''}
                                onChange={(e) => handleUpdateCareerGoal(idx, 'title', e.target.value)}
                                className="cosmic-input"
                              />
                            </div>

                            <div>
                              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                                Status
                              </label>
                              <select
                                value={goal.status || 'Currently Pursuing'}
                                onChange={(e) => handleUpdateCareerGoal(idx, 'status', e.target.value)}
                                className="cosmic-input"
                                style={{ background: '#0a0e23', color: '#fff' }}
                              >
                                <option value="Currently Pursuing">Currently Pursuing</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Target">Target Milestone</option>
                                <option value="Vision">Future Vision</option>
                              </select>
                            </div>

                            <div>
                              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                                Timeline / Period
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. 2026 - Present"
                                value={goal.period || ''}
                                onChange={(e) => handleUpdateCareerGoal(idx, 'period', e.target.value)}
                                className="cosmic-input"
                              />
                            </div>
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                              Milestone Objectives &amp; Roadmaps
                            </label>
                            <textarea
                              rows={2}
                              placeholder="Describe your current targets, technologies being mastered, or engineering goals..."
                              value={goal.goal || ''}
                              onChange={(e) => handleUpdateCareerGoal(idx, 'goal', e.target.value)}
                              className="cosmic-textarea"
                              style={{ fontSize: '0.85rem' }}
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Social Links */}
                <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.2rem', color: '#f72585' }}>Coordinates &amp; Social Links</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>GitHub URL</label>
                      <input
                        type="text"
                        value={profile.socialLinks?.github || ''}
                        onChange={(e) => setProfile({
                          ...profile,
                          socialLinks: { ...profile.socialLinks, github: e.target.value }
                        })}
                        className="cosmic-input"
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>LinkedIn URL</label>
                      <input
                        type="text"
                        value={profile.socialLinks?.linkedin || ''}
                        onChange={(e) => setProfile({
                          ...profile,
                          socialLinks: { ...profile.socialLinks, linkedin: e.target.value }
                        })}
                        className="cosmic-input"
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>Instagram URL</label>
                      <input
                        type="text"
                        placeholder="https://instagram.com/yourhandle"
                        value={profile.socialLinks?.instagram || ''}
                        onChange={(e) => setProfile({
                          ...profile,
                          socialLinks: { ...profile.socialLinks, instagram: e.target.value }
                        })}
                        className="cosmic-input"
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>Direct Email</label>
                      <input
                        type="text"
                        value={profile.email || ''}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="cosmic-input"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-cosmic-primary clickable"
                  style={{ padding: '1rem', width: 'fit-content' }}
                >
                  <Save size={18} /> Save All Profile Changes
                </button>
              </form>
            </div>
          )}

          {/* TAB 6: RESUME MANAGER */}
          {activeTab === 'resume' && resume && (
            <div style={{ maxWidth: '750px' }}>
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.8rem', color: 'var(--text-primary)' }}>Resume Archival Manager</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Upload a new PDF document or configure external mirror links.
                </p>
              </div>

              {/* Current Resume Info Card */}
              <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#00f0ff', marginBottom: '1rem' }}>Active Document</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>FILE TITLE</div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{resume.title}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SIZE</div>
                    <div style={{ color: '#00f0ff', fontFamily: 'var(--font-mono)' }}>{resume.fileSize}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>LAST REVISION</div>
                    <div style={{ color: 'var(--text-secondary)' }}>
                      {resume.lastUpdated ? new Date(resume.lastUpdated).toLocaleString() : 'N/A'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <a
                    href="/api/resume/download"
                    target="_blank"
                    rel="noreferrer"
                    className="btn-cosmic-primary clickable"
                    style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}
                  >
                    Test Visitor Download
                  </a>
                  <a
                    href="/api/resume/view"
                    target="_blank"
                    rel="noreferrer"
                    className="btn-cosmic-secondary clickable"
                    style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}
                  >
                    <Eye size={15} /> Preview PDF
                  </a>
                  <button
                    type="button"
                    onClick={handleRegenerateResumePdf}
                    className="btn-cosmic-secondary clickable"
                    style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <RefreshCw size={15} /> Regenerate PDF from Profile
                  </button>
                </div>
              </div>

              {/* Upload Form */}
              <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#ffb703', marginBottom: '0.5rem' }}>Upload New PDF File</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                  Select a `.pdf` file from your device to replace the current download file.
                </p>

                <label
                  className="clickable"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px dashed var(--border-cosmic)',
                    borderRadius: '16px',
                    padding: '2.5rem',
                    cursor: 'pointer',
                    background: 'rgba(0, 240, 255, 0.03)'
                  }}
                >
                  <Upload size={32} color="#00f0ff" style={{ marginBottom: '0.75rem' }} />
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                    Click to browse and upload resume PDF
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Max file size: 10MB</span>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleResumeFileUpload}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>

              {/* External Mirror Configuration */}
              <form onSubmit={handleSaveResumeConfig} className="glass-panel" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#f72585', marginBottom: '1rem' }}>External Cloud Mirror Link</h3>
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                    External Google Drive or GitHub raw PDF link:
                  </label>
                  <input
                    type="url"
                    value={resume.externalUrl || ''}
                    onChange={(e) => setResume({ ...resume, externalUrl: e.target.value })}
                    placeholder="https://..."
                    className="cosmic-input"
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
                  <input
                    type="checkbox"
                    id="useExternal"
                    checked={Boolean(resume.useExternal)}
                    onChange={(e) => setResume({ ...resume, useExternal: e.target.checked })}
                  />
                  <label htmlFor="useExternal" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Redirect visitors directly to this external mirror URL instead of serving local file
                  </label>
                </div>

                <button type="submit" className="btn-cosmic-primary clickable">
                  <Save size={16} /> Save Mirror Settings
                </button>
              </form>
            </div>
          )}

          {/* TAB 7: INQUIRIES & MESSAGES */}
          {activeTab === 'messages' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.8rem', color: 'var(--text-primary)' }}>Cosmic Inquiries Inbox</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Transmissions sent by visitors via the public contact terminal.
                  </p>
                </div>
                <span className="badge-pill badge-cyan">
                  {messages.length} Total Messages
                </span>
              </div>

              {messages.length === 0 ? (
                <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
                  <Mail size={40} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
                  <h4 style={{ color: 'var(--text-secondary)' }}>Your communications frequency is silent.</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No messages submitted yet.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className="glass-panel"
                      style={{
                        padding: '1.5rem',
                        borderLeft: m.read ? '4px solid #64748b' : '4px solid #00f0ff',
                        backgroundColor: m.read ? 'rgba(10, 15, 36, 0.5)' : 'rgba(13, 19, 48, 0.85)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>{m.name}</span>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>&lt;{m.email}&gt;</span>
                            {!m.read && <span className="badge-pill badge-cyan" style={{ fontSize: '0.65rem' }}>NEW UNREAD</span>}
                          </div>
                          <div style={{ color: '#00f0ff', fontWeight: 600, fontSize: '0.95rem', marginTop: '0.3rem' }}>
                            {m.subject}
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {new Date(m.createdAt).toLocaleString()}
                          </span>

                          <button
                            onClick={() => handleToggleReadMessage(m.id, m.read)}
                            className="clickable btn-cosmic-outline"
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                          >
                            {m.read ? 'Mark Unread' : 'Mark Read'}
                          </button>

                          <a
                            href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject)}`}
                            className="clickable btn-cosmic-primary"
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', textDecoration: 'none' }}
                          >
                            Reply via Mail
                          </a>

                          <button
                            onClick={() => handleDeleteMessage(m.id)}
                            className="clickable"
                            style={{
                              background: 'rgba(239, 68, 68, 0.15)',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              color: '#ef4444',
                              borderRadius: '8px',
                              padding: '0.35rem 0.65rem',
                              cursor: 'pointer'
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                        {m.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 8: SETTINGS */}
          {activeTab === 'settings' && (
            <div style={{ maxWidth: '650px' }}>
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.8rem', color: 'var(--text-primary)' }}>System Security &amp; Data</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Manage admin credentials or reset cosmic seed records.
                </p>
              </div>

              {/* Password change */}
              <form onSubmit={handleChangePassword} className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#00f0ff' }}>Change Commander Password</h3>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>Current Password</label>
                  <input
                    type="password"
                    required
                    value={passForm.currentPassword}
                    onChange={(e) => setPassForm({ ...passForm, currentPassword: e.target.value })}
                    className="cosmic-input"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>New Password (min 6 chars)</label>
                  <input
                    type="password"
                    required
                    value={passForm.newPassword}
                    onChange={(e) => setPassForm({ ...passForm, newPassword: e.target.value })}
                    className="cosmic-input"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={passForm.confirmPassword}
                    onChange={(e) => setPassForm({ ...passForm, confirmPassword: e.target.value })}
                    className="cosmic-input"
                  />
                </div>

                <button type="submit" className="btn-cosmic-primary clickable" style={{ width: 'fit-content' }}>
                  Update Password
                </button>
              </form>

              {/* Factory Reset */}
              <div className="glass-panel" style={{ padding: '2rem', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#ef4444', marginBottom: '0.5rem' }}>Danger Zone: Factory Seed Reset</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                  Restore all default projects, skills, certificates, and bio data to the initial cosmic state.
                </p>

                <button
                  type="button"
                  onClick={handleResetDemoData}
                  className="clickable"
                  style={{
                    background: 'rgba(239, 68, 68, 0.2)',
                    border: '1px solid #ef4444',
                    color: '#ef4444',
                    padding: '0.75rem 1.4rem',
                    borderRadius: '8px',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Reset to Factory Cosmic Data
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* PROJECT EDIT / ADD MODAL */}
      {showProjectModal && (
        <div className="modal-overlay" onClick={() => setShowProjectModal(false)}>
          <div className="glass-panel clickable" style={{ width: '100%', maxWidth: '650px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem', backgroundColor: 'rgba(8, 12, 32, 0.98)' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.3rem' }}>{editingProject?.id ? 'Edit Project' : 'Launch New Project'}</h3>
              <button onClick={() => setShowProjectModal(false)} className="clickable" style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleSaveProject} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>Project Title *</label>
                <input type="text" required value={editingProject?.title || ''} onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })} className="cosmic-input" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>Category</label>
                  <select value={editingProject?.category || 'Full Stack'} onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })} className="cosmic-select">
                    <option value="Full Stack">Full Stack</option>
                    <option value="Core CS / Systems">Core CS / Systems</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                  </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
                  <input type="checkbox" id="projFeatured" checked={Boolean(editingProject?.featured)} onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })} />
                  <label htmlFor="projFeatured" style={{ fontSize: '0.85rem' }}>Featured on Hero/Top</label>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>Short Description *</label>
                <input type="text" required value={editingProject?.description || ''} onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })} className="cosmic-input" />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>Full Architecture &amp; Mission Briefing</label>
                <textarea rows={3} value={editingProject?.longDescription || ''} onChange={(e) => setEditingProject({ ...editingProject, longDescription: e.target.value })} className="cosmic-textarea" />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>Tech Stack Tags (comma separated)</label>
                <input type="text" value={editingProject?.tags || ''} onChange={(e) => setEditingProject({ ...editingProject, tags: e.target.value })} placeholder="React, Node.js, Express" className="cosmic-input" />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>Image Asset URL</label>
                <input type="text" value={editingProject?.image || ''} onChange={(e) => setEditingProject({ ...editingProject, image: e.target.value })} className="cosmic-input" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>GitHub Repository URL</label>
                  <input type="url" value={editingProject?.githubUrl || ''} onChange={(e) => setEditingProject({ ...editingProject, githubUrl: e.target.value })} className="cosmic-input" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>Live Demo URL</label>
                  <input type="url" value={editingProject?.liveUrl || ''} onChange={(e) => setEditingProject({ ...editingProject, liveUrl: e.target.value })} className="cosmic-input" />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowProjectModal(false)} className="btn-cosmic-outline clickable">Cancel</button>
                <button type="submit" className="btn-cosmic-primary clickable">Save Project</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CERTIFICATE EDIT / ADD MODAL */}
      {showCertModal && (
        <div className="modal-overlay" onClick={() => setShowCertModal(false)}>
          <div className="glass-panel clickable" style={{ width: '100%', maxWidth: '580px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem', backgroundColor: 'rgba(8, 12, 32, 0.98)' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.3rem' }}>{editingCert?.id ? 'Edit Certificate' : 'Register Certificate'}</h3>
              <button onClick={() => setShowCertModal(false)} className="clickable" style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleSaveCertificate} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>Certificate Title *</label>
                <input type="text" required value={editingCert?.title || ''} onChange={(e) => setEditingCert({ ...editingCert, title: e.target.value })} className="cosmic-input" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>Issuer Organization *</label>
                  <input type="text" required value={editingCert?.issuer || ''} onChange={(e) => setEditingCert({ ...editingCert, issuer: e.target.value })} className="cosmic-input" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>Issue Date</label>
                  <input type="text" value={editingCert?.issueDate || ''} onChange={(e) => setEditingCert({ ...editingCert, issueDate: e.target.value })} placeholder="e.g. January 2026" className="cosmic-input" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>Credential ID</label>
                  <input type="text" value={editingCert?.credentialId || ''} onChange={(e) => setEditingCert({ ...editingCert, credentialId: e.target.value })} className="cosmic-input" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>Online Verification URL</label>
                  <input type="url" value={editingCert?.credentialUrl || ''} onChange={(e) => setEditingCert({ ...editingCert, credentialUrl: e.target.value })} className="cosmic-input" />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>Certificate Image URL</label>
                <input type="text" value={editingCert?.image || ''} onChange={(e) => setEditingCert({ ...editingCert, image: e.target.value })} className="cosmic-input" />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowCertModal(false)} className="btn-cosmic-outline clickable">Cancel</button>
                <button type="submit" className="btn-cosmic-primary clickable">Save Certificate</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SKILL EDIT / ADD MODAL */}
      {showSkillModal && (
        <div className="modal-overlay" onClick={() => setShowSkillModal(false)}>
          <div className="glass-panel clickable" style={{ width: '100%', maxWidth: '480px', padding: '2rem', backgroundColor: 'rgba(8, 12, 32, 0.98)' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.3rem' }}>{editingSkill?.id ? 'Edit Skill' : 'Add Skill'}</h3>
              <button onClick={() => setShowSkillModal(false)} className="clickable" style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleSaveSkill} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>Skill Name *</label>
                <input type="text" required value={editingSkill?.name || ''} onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })} className="cosmic-input" />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>Category</label>
                <select value={editingSkill?.category || 'Languages'} onChange={(e) => setEditingSkill({ ...editingSkill, category: e.target.value })} className="cosmic-select">
                  <option value="Languages">Languages</option>
                  <option value="Core CS">Core CS</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Tools">Tools</option>
                </select>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Proficiency Percentage</label>
                  <span style={{ fontFamily: 'var(--font-mono)', color: '#00f0ff', fontWeight: 600 }}>{editingSkill?.proficiency || 85}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={editingSkill?.proficiency || 85}
                  onChange={(e) => setEditingSkill({ ...editingSkill, proficiency: Number(e.target.value) })}
                  style={{ width: '100%', accentColor: '#00f0ff' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowSkillModal(false)} className="btn-cosmic-outline clickable">Cancel</button>
                <button type="submit" className="btn-cosmic-primary clickable">Save Skill</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
