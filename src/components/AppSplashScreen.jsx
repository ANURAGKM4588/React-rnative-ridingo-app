import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

const SPLASH_KEYFRAMES = `
@keyframes splashShimmer {
  0% {
    left: -45%;
    width: 35%;
  }
  50% {
    width: 55%;
  }
  100% {
    left: 110%;
    width: 35%;
  }
}

@keyframes splashLogoEnter {
  0% {
    opacity: 0;
    transform: scale(0.94);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
`;

/**
 * AppSplashScreen Component
 * 
 * Replaces the static splash screen from index.html with a high-performance React component.
 * Features:
 * - Exact visual replication of layout, alignment, and proportions
 * - Automatic detection of User App vs Driver App (via props, URL, context, or port)
 * - Automatic detection of Dark Mode vs Light Mode (via theme pref, context, or system)
 * - Exact CSS cubic-bezier animations for logo entrance and loading shimmer
 * - Timed fade-out transition (750ms dwell + 450ms smooth fade-out)
 * - Completely unmounts from the DOM once transition ends
 */
export default function AppSplashScreen({ isDriver: isDriverProp, isDark: isDarkProp, onFinished }) {
  const appContext = useApp();
  const [mounted, setMounted] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  // Determine if Driver App
  const isDriver = (() => {
    if (typeof isDriverProp === 'boolean') return isDriverProp;
    if (appContext?.view === 'driver') return true;
    if (typeof window !== 'undefined') {
      if (window.RIDINGO_TARGET === 'driver') return true;
      const port = window.location.port || '';
      const search = (window.location.search || '').toLowerCase();
      const path = (window.location.pathname || '').toLowerCase();
      const hash = (window.location.hash || '').toLowerCase();
      if (port === '5174' || search.includes('driver') || path.includes('driver') || hash.includes('driver')) {
        return true;
      }
    }
    return false;
  })();

  // Determine if Dark Mode
  const isDark = (() => {
    if (typeof isDarkProp === 'boolean') return isDarkProp;
    if (isDriver && appContext?.driverThemeVal) {
      return appContext.driverThemeVal === 'dark';
    }
    if (!isDriver && appContext?.userThemeVal) {
      return appContext.userThemeVal === 'dark';
    }
    if (typeof window !== 'undefined') {
      try {
        const pref = localStorage.getItem('ridingo_user_theme') || localStorage.getItem('ridingo_theme_pref') || 'light';
        if (pref === 'dark') return true;
        if (pref === 'system' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          return true;
        }
      } catch {}
    }
    return false;
  })();

  // Auto fade-out after initial load
  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
      const unmountTimer = setTimeout(() => {
        setMounted(false);
        if (onFinished) onFinished();
      }, 500);
      return () => clearTimeout(unmountTimer);
    }, 750);

    return () => clearTimeout(fadeTimer);
  }, [onFinished]);

  if (!mounted) return null;

  // Select appropriate logo
  const logoSrc = isDriver
    ? (isDark ? '/Drivers/Logo Drivers-01.png' : '/Drivers/Logo Drivers-02.png')
    : (isDark ? '/Ridingo White.png' : '/Ridingo Black.png');

  const logoAlt = isDriver ? 'Ridingo Driver' : 'Ridingo';
  const logoHeight = isDriver ? 38 : 48;
  const logoMaxWidth = isDriver ? 210 : 240;

  return (
    <div
      id="app-splash-screen"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: isDark ? '#090A0E' : '#FFFFFF',
        opacity: fadeOut ? 0 : 1,
        visibility: fadeOut ? 'hidden' : 'visible',
        transition: 'opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: fadeOut ? 'none' : 'auto',
      }}
      aria-hidden="true"
    >
      <style>{SPLASH_KEYFRAMES}</style>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '24px',
          transform: 'translateY(-8px)',
        }}
      >
        {/* Animated Brand Logo */}
        <img
          src={logoSrc}
          alt={logoAlt}
          style={{
            height: `${logoHeight}px`,
            width: 'auto',
            maxWidth: `${logoMaxWidth}px`,
            objectFit: 'contain',
            display: 'block',
            animation: 'splashLogoEnter 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
          }}
        />

        {/* Minimal Modern Premium Loading Bar Animation */}
        <div
          style={{
            width: '140px',
            height: '3px',
            background: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)',
            borderRadius: '999px',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              width: '45%',
              borderRadius: '999px',
              background: 'linear-gradient(90deg, #FFC70A 0%, #FFA800 100%)',
              boxShadow: '0 0 10px rgba(255, 199, 10, 0.55)',
              animation: 'splashShimmer 1.3s cubic-bezier(0.4, 0, 0.2, 1) infinite',
            }}
          />
        </div>
      </div>
    </div>
  );
}
