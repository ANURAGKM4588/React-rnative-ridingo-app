import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import Icon from './Icon';

export default function BottomNav() {
  const { uTab, setUTab, onboardingOpen, bookingOpen, paymentOpen, liveTrackingOpen } = useApp();
  const [mapPickerActive, setMapPickerActive] = useState(false);

  useEffect(() => {
    const updateMapState = () => {
      const active = Boolean(
        document.body.classList.contains('map-picker-open') ||
        document.querySelector('.map-picker-scrim')
      );
      setMapPickerActive(active);
    };

    updateMapState();
    const observer = new MutationObserver(updateMapState);
    observer.observe(document.body, { attributes: true, childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  if (onboardingOpen || bookingOpen || paymentOpen || liveTrackingOpen || mapPickerActive) return null;

  const NAV_ITEMS = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'trips', label: 'History', icon: 'history' },
    { id: 'wallet', label: 'Wallet', icon: 'wallet' },
    { id: 'profile', label: 'Profile', icon: 'user' }
  ];

  return (
    <nav className="nav" id="u-nav" aria-label="User app">
      {NAV_ITEMS.map(n => (
        <button
          key={n.id}
          className={`nv ${uTab === n.id ? 'on' : ''}`}
          aria-label={n.label}
          aria-current={uTab === n.id}
          onClick={() => {
            setUTab(n.id);
            const el = document.getElementById('u-content');
            if (el) el.scrollTop = 0;
          }}
        >
          <span className="nv-i">
            <Icon name={n.icon} size={23} filled={uTab === n.id} />
          </span>
          <span className="nv-l">{n.label}</span>
        </button>
      ))}
    </nav>
  );
}
