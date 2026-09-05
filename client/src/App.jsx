import React, { useState, useEffect } from 'react';
import PublicPortfolioView from './views/PublicPortfolioView';
import AdminPortalView from './views/AdminPortalView';

export default function App() {
  // Theme state: 'dark' (cosmic deep space) or 'light' (starlight celestial)
  const [theme, setTheme] = useState('dark');

  // Route path state based on window.location.pathname
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // Synchronize route state with browser history (back / forward buttons)
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Programmatic client-side navigation
  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo(0, 0);
  };

  // Toggle Theme
  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    if (nextTheme === 'light') {
      document.body.classList.add('theme-light');
    } else {
      document.body.classList.remove('theme-light');
    }
  };

  // Determine if current route is the Admin path (/admin)
  const normalizedPath = currentPath.toLowerCase().replace(/\/$/, '');
  const isAdminRoute = normalizedPath === '/admin' || normalizedPath.startsWith('/admin/');

  // 1. ADMIN PORTAL VIEW: Visible ONLY on /admin path
  if (isAdminRoute) {
    return (
      <AdminPortalView
        onNavigateToPublic={() => navigate('/')}
      />
    );
  }

  // 2. PUBLIC PORTFOLIO VIEW: Default public-facing experience (No admin buttons visible)
  return (
    <PublicPortfolioView
      theme={theme}
      onToggleTheme={handleToggleTheme}
    />
  );
}
